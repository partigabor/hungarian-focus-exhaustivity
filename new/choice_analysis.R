# Mixed-effects logistic regressions for the A/B picture choices.
# From the repository root: Rscript new/choice_analysis.R
# From new/:                 Rscript choice_analysis.R
# Optional arguments: input CSV, then output report path.
# (Reaction times are analysed separately in rt_analysis.R.)

# ---------------------------------------------------------------------------
# 1. Packages
# ---------------------------------------------------------------------------
# lme4 fits the logistic mixed models, emmeans gives estimated probabilities
# and pairwise comparisons.
required_packages <- c("lme4", "emmeans")
missing_packages <- required_packages[!vapply(required_packages, requireNamespace, logical(1), quietly = TRUE)]
if (length(missing_packages)) {
    stop("Missing R packages: ", paste(missing_packages, collapse = ", "),
         ". Install them before running this script.")
}

# ---------------------------------------------------------------------------
# 2. Input and output paths
# ---------------------------------------------------------------------------
# Defaults are resolved relative to this script's folder (new/), never the working directory.
script_arg <- grep("^--file=", commandArgs(FALSE), value = TRUE)
source_file <- tryCatch(sys.frame(1)$ofile, error = function(e) NULL)   # set when run via source()
script_dir <- if (length(script_arg)) {
    dirname(normalizePath(sub("^--file=", "", script_arg[1])))
} else if (!is.null(source_file)) {
    dirname(normalizePath(source_file))
} else if (basename(getwd()) == "new") {
    getwd()
} else {
    file.path(getwd(), "new")   # interactive run from the repository root
}
if (!dir.exists(script_dir)) stop("Cannot locate the new/ folder: ", script_dir)
args <- commandArgs(trailingOnly = TRUE)
if (length(args) > 2L) stop("Usage: Rscript choice_analysis.R [input.csv] [report.txt]")
input_path <- if (length(args) >= 1L) args[1] else file.path(script_dir, "choice_data.csv")
if (!file.exists(input_path)) {
    stop("Input not found: ", input_path, ". Run the choice export cell (section 4.6) in analysis.ipynb first.")
}
report_path <- if (length(args) >= 2L) args[2] else
    file.path(script_dir, "choice_analysis_results.txt")
if (normalizePath(input_path) == normalizePath(report_path, mustWork = FALSE)) {
    stop("The report path must differ from the input CSV.")
}

# ---------------------------------------------------------------------------
# 3. Read and validate the data
# ---------------------------------------------------------------------------
dat <- read.csv(input_path, stringsAsFactors = FALSE, na.strings = c("", "NA"))
required_columns <- c("session", "item", "context_condition", "target_condition",
                      "choice_a", "is_correct")
missing_columns <- setdiff(required_columns, names(dat))
if (length(missing_columns)) {
    stop("Missing input columns: ", paste(missing_columns, collapse = ", "),
         ". Rerun the choice export cell in analysis.ipynb.")
}
if (anyNA(dat[, c("session", "item", "context_condition", "target_condition", "choice_a")])) {
    stop("Input contains missing identifiers, conditions, or choices.")
}
if (!all(dat$choice_a %in% c(0, 1))) stop("choice_a must be 0 (B) or 1 (A).")

target_levels <- c("pvf-exhaustive", "pvf-base", "pvf-contrastive")
context_levels <- c("ctx-exhaustive", "ctx-base", "ctx-contrastive")
if (any(!dat$context_condition %in% context_levels)) stop("Unexpected context condition.")
if (any(!dat$target_condition %in% c(target_levels, "non-focused"))) stop("Unexpected target condition.")

# session = one participant submission; item = stimulus item (random effects).
dat$session <- factor(dat$session)
dat$item <- factor(dat$item)
dat$context_condition <- factor(dat$context_condition, levels = context_levels)
# Sum (deviation) contrasts, as in the original choice analysis.
contrasts(dat$context_condition) <- contr.sum(3)

# Optimizer settings used in the original script, to help convergence.
ctrl <- lme4::glmerControl(optimizer = "bobyqa", optCtrl = list(maxfun = 2e5))

report <- c(
    "Choice data: mixed-effects logistic regressions",
    paste("Generated:", format(Sys.time(), tz = "UTC", usetz = TRUE)),
    paste("Input:", input_path),
    "Random intercepts: submission and item. Estimates are log-odds; emmeans are also shown as probabilities.",
    "Pairwise comparisons use Holm adjustment within each reported family.",
    ""
)

# ---------------------------------------------------------------------------
# 4. Analysis 1: probability of choosing A in the focused targets
# ---------------------------------------------------------------------------
# Outcome: choice_a (1 = option A, 0 = option B), raw coding.
# Predictors: target (3 focused levels), context (3 levels) and their interaction.
foc <- dat[dat$target_condition %in% target_levels, ]
foc$target_condition <- factor(foc$target_condition, levels = target_levels)
contrasts(foc$target_condition) <- contr.sum(3)
if (any(table(foc$target_condition, foc$context_condition) == 0L)) {
    stop("A target-by-context cell has no observations.")
}

# Pooled model: target only (ignoring context).
m_pooled <- lme4::glmer(choice_a ~ target_condition + (1 | session) + (1 | item),
                        family = binomial(link = "logit"), data = foc, control = ctrl)
# Factorial model: target x context.
m_fact <- lme4::glmer(choice_a ~ target_condition * context_condition + (1 | session) + (1 | item),
                      family = binomial(link = "logit"), data = foc, control = ctrl)

report <- c(
    report,
    "========== Focused targets: P(choice = A) ==========",
    paste("Trials:", nrow(foc), "; submissions:", nlevels(droplevels(foc$session)),
          "; items:", nlevels(droplevels(foc$item))),
    "Counts of A (1) and B (0) by target and context:",
    capture.output(print(ftable(foc$target_condition, foc$context_condition, foc$choice_a))),
    "\n--- Pooled target model ---",
    paste("Singular fit:", lme4::isSingular(m_pooled)),
    capture.output(print(summary(m_pooled))),
    "Target probabilities and pairwise comparisons (Holm):",
    capture.output(print(emmeans::emmeans(m_pooled, pairwise ~ target_condition,
                                          type = "response", adjust = "holm"))),
    "\n--- Target by context model ---",
    paste("Singular fit:", lme4::isSingular(m_fact)),
    capture.output(print(summary(m_fact))),
    # Likelihood-ratio tests of each term (drop one term at a time).
    capture.output(print(drop1(m_fact, test = "Chisq"))),
    # Compare targets inside each context ...
    "Targets compared within each context (Holm):",
    capture.output(print(emmeans::emmeans(m_fact, pairwise ~ target_condition | context_condition,
                                          type = "response", adjust = "holm"))),
    # ... and the same target across contexts.
    "Contexts compared within each target (Holm):",
    capture.output(print(emmeans::emmeans(m_fact, pairwise ~ context_condition | target_condition,
                                          type = "response", adjust = "holm"))),
    ""
)

# ---------------------------------------------------------------------------
# 5. Analysis 2: accuracy in the non-focused targets
# ---------------------------------------------------------------------------
# Non-focused trials have a correct image; is_correct = 1 when it was chosen.
nf <- dat[dat$target_condition == "non-focused" & !is.na(dat$is_correct), ]
if (nrow(nf) > 0L) {
    m_acc <- lme4::glmer(is_correct ~ context_condition + (1 | session) + (1 | item),
                         family = binomial(link = "logit"), data = nf, control = ctrl)
    coefs <- summary(m_acc)$coefficients
    # Odds ratios with 95% Wald CIs for reporting.
    or_table <- cbind(Estimate = coefs[, "Estimate"], OR = exp(coefs[, "Estimate"]),
                      exp(confint(m_acc, parm = "beta_", method = "Wald")))
    report <- c(
        report,
        "========== Non-focused targets: P(correct choice) ==========",
        paste("Trials:", nrow(nf), "; overall accuracy:", round(mean(nf$is_correct), 3)),
        paste("Singular fit:", lme4::isSingular(m_acc)),
        capture.output(print(summary(m_acc))),
        "Accuracy by context and pairwise comparisons (Holm):",
        capture.output(print(emmeans::emmeans(m_acc, pairwise ~ context_condition,
                                              type = "response", adjust = "holm"))),
        "Odds ratios and 95% Wald confidence intervals:",
        capture.output(print(or_table))
    )
} else {
    report <- c(report, "No non-focused trials with a correct answer; accuracy model skipped.")
}

# ---------------------------------------------------------------------------
# 6. Write the report
# ---------------------------------------------------------------------------
writeLines(report, report_path)
cat("Analysis report written to", report_path, "\n")
