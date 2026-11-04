# Mixed-effects analyses of focused-target reading times, whole-sentence reading
# times and logged choice intervals.
# From the repository root: Rscript new/rt_analysis.R
# From new/:                 Rscript rt_analysis.R
# Optional arguments: input CSV, then output report path.

# ---------------------------------------------------------------------------
# 1. Packages
# ---------------------------------------------------------------------------
# lme4/lmerTest fit the mixed models (lmerTest adds p-values), car gives
# type-III ANOVA tables, emmeans gives estimated means and pairwise contrasts.
required_packages <- c("lme4", "lmerTest", "car", "emmeans")
missing_packages <- required_packages[!vapply(required_packages, requireNamespace, logical(1), quietly = TRUE)]
if (length(missing_packages)) {
    stop("Missing R packages: ", paste(missing_packages, collapse = ", "),
         ". Install them before running this script.")
}

# ---------------------------------------------------------------------------
# 2. Input and output paths
# ---------------------------------------------------------------------------
# Optional command-line arguments: [input.csv] [report.txt]
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
if (length(args) > 2L) stop("Usage: Rscript rt_analysis.R [input.csv] [report.txt]")
input_path <- if (length(args) >= 1L) args[1] else file.path(script_dir, "rt_data.csv")
if (!file.exists(input_path)) {
    stop("Input not found: ", input_path, ". Run the focused reading-time export cell in analysis.ipynb first.")
}
# By default the report is written next to the input CSV.
report_path <- if (length(args) >= 2L) args[2] else
    file.path(script_dir, "rt_analysis_results.txt")
if (normalizePath(input_path) == normalizePath(report_path, mustWork = FALSE)) {
    stop("The report path must differ from the input CSV.")
}

# ---------------------------------------------------------------------------
# 3. Read and validate the data
# ---------------------------------------------------------------------------
# Blank cells become NA (e.g. a region time that was not logged).
df <- read.csv(input_path, stringsAsFactors = FALSE, na.strings = c("", "NA"))

# Dependent measures, one model family per measure (all in milliseconds):
#   object_r4_ms              object region (r4)
#   modifier_object_ms        modifier + object, averaged before log transform
#   verb_r5_ms                verb region (r5)
#   sentence_ms               whole sentence = r1 + ... + r6 (NA if any region is missing)
#   interval_before_choice_ms logged interval before the choice key (includes 500 ms fixation)
metrics <- c("object_r4_ms", "modifier_object_ms", "verb_r5_ms", "sentence_ms",
             "interval_before_choice_ms")
required_columns <- c("session", "item", "context_condition", "target_condition", metrics)
missing_columns <- setdiff(required_columns, names(df))
if (length(missing_columns)) {
    stop("Missing input columns: ", paste(missing_columns, collapse = ", "),
         ". Rerun the focused timing export cell in analysis.ipynb.")
}

# Only the three focused target conditions are analysed (non-focused is excluded).
# The first level of each factor is the reference level for ordering only;
# the sum contrasts set below make the tests independent of that choice.
target_levels <- c("pvf-exhaustive", "pvf-base", "pvf-contrastive")
context_levels <- c("ctx-exhaustive", "ctx-base", "ctx-contrastive")
if (anyNA(df[, c("session", "item", "context_condition", "target_condition")])) {
    stop("Input contains missing participant, item, or condition identifiers.")
}
if (any(!df$target_condition %in% target_levels) ||
    any(!df$context_condition %in% context_levels)) {
    stop("Input contains an unexpected target or context condition.")
}
if (!all(vapply(df[metrics], is.numeric, logical(1)))) stop("All timing measures must be numeric.")

# session = one participant submission; item = stimulus item (both random effects).
df$session <- factor(df$session)
df$item <- factor(df$item)
df$target_condition <- factor(df$target_condition, levels = target_levels)
df$context_condition <- factor(df$context_condition, levels = context_levels)
# Sum (deviation) contrasts so type-III tests of main effects are meaningful
# in the presence of the target x context interaction.
contrasts(df$target_condition) <- contr.sum(3)
contrasts(df$context_condition) <- contr.sum(3)

# ---------------------------------------------------------------------------
# 4. Report header
# ---------------------------------------------------------------------------
report <- c(
    "Focused-target timing measures: linear mixed-effects models",
    paste("Generated:", format(Sys.time(), tz = "UTC", usetz = TRUE)),
    paste("Input:", input_path),
    "Response: log1p(timing measure in ms); modifier-object means are calculated before transformation.",
    "Whole-sentence time is the sum of r1-r6 and is only available for trials with all six regions logged.",
    "The logged pre-choice interval includes the 500 ms fixation and is not a choice-onset reaction time.",
    "Random intercepts: submission and item. Pooled and factorial analyses are separate.",
    "Pairwise Tukey adjustments apply within each reported comparison family, not across measures or models.",
    "Estimated effects and contrasts are on the log1p scale.",
    ""
)

# ---------------------------------------------------------------------------
# 5. Fit two models per measure
# ---------------------------------------------------------------------------
for (metric in metrics) {
    values <- df[[metric]]
    if (any(!is.finite(values[!is.na(values)])) || any(values < 0, na.rm = TRUE)) {
        stop("Invalid non-finite or negative timing value in ", metric)
    }
    # Keep only trials where this measure exists; log1p handles values near 0.
    model_df <- df[!is.na(values), , drop = FALSE]
    model_df$response <- log1p(model_df[[metric]])
    if (nlevels(droplevels(model_df$session)) < 2L || nlevels(droplevels(model_df$item)) < 2L) {
        stop("At least two submissions and items are required for ", metric)
    }
    if (any(table(model_df$target_condition, model_df$context_condition) == 0L)) {
        stop("A target-by-context cell has no complete observations for ", metric)
    }

    # Model 1 (pooled): effect of target condition, ignoring context.
    pooled <- lmerTest::lmer(
        response ~ target_condition + (1 | session) + (1 | item),
        data = model_df, REML = FALSE
    )
    # Model 2 (factorial): target, context and their interaction.
    factorial <- lmerTest::lmer(
        response ~ target_condition * context_condition + (1 | session) + (1 | item),
        data = model_df, REML = FALSE
    )

    # Append results for this measure to the report.
    report <- c(
        report,
        paste0("\n========== ", metric, " =========="),
        paste("Trials:", nrow(model_df), "; missing measure:", sum(is.na(values)),
              "; submissions:", nlevels(droplevels(model_df$session)),
              "; items:", nlevels(droplevels(model_df$item))),
        "Target-by-context trial counts:",
        capture.output(print(table(model_df$target_condition, model_df$context_condition))),
        "\n--- Pooled target model ---",
        paste("Singular fit:", lme4::isSingular(pooled)),   # TRUE = random-effects structure may be too complex
        capture.output(print(summary(pooled))),
        capture.output(print(car::Anova(pooled, type = 3))),   # type-III test of target
        "Target estimated marginal means and pairwise comparisons (Tukey):",
        capture.output(print(emmeans::emmeans(pooled, pairwise ~ target_condition, adjust = "tukey"))),
        "\n--- Target by context model ---",
        paste("Singular fit:", lme4::isSingular(factorial)),
        capture.output(print(summary(factorial))),
        capture.output(print(car::Anova(factorial, type = 3))),   # target, context, interaction
        # Compare the targets with each other inside each context ...
        "Target estimated marginal means and pairwise comparisons within each context (Tukey):",
        capture.output(print(emmeans::emmeans(
            factorial, pairwise ~ target_condition | context_condition, adjust = "tukey"
        ))),
        # ... and the contexts with each other for each target (same target across contexts).
        "Context estimated marginal means and pairwise comparisons within each target (Tukey):",
        capture.output(print(emmeans::emmeans(
            factorial, pairwise ~ context_condition | target_condition, adjust = "tukey"
        )))
    )
}

# ---------------------------------------------------------------------------
# 6. Write the report
# ---------------------------------------------------------------------------
writeLines(report, report_path)
cat("Analysis report written to", report_path, "\n")
