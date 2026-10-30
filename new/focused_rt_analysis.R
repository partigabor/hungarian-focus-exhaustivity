# Mixed-effects analyses of focused-target reading times and logged choice intervals.
# From the repository root: Rscript new/focused_rt_analysis.R
# From new/:                 Rscript focused_rt_analysis.R
# Optional arguments: input CSV, then output report path.

required_packages <- c("lme4", "lmerTest", "car", "emmeans")
missing_packages <- required_packages[!vapply(required_packages, requireNamespace, logical(1), quietly = TRUE)]
if (length(missing_packages)) {
    stop("Missing R packages: ", paste(missing_packages, collapse = ", "),
         ". Install them before running this script.")
}

args <- commandArgs(trailingOnly = TRUE)
if (length(args) > 2L) stop("Usage: Rscript focused_rt_analysis.R [input.csv] [report.txt]")
if (length(args) >= 1L) {
    input_path <- args[1]
} else if (file.exists("focused_rt_data.csv")) {
    input_path <- "focused_rt_data.csv"
} else {
    input_path <- file.path("new", "focused_rt_data.csv")
}
if (!file.exists(input_path)) {
    stop("Input not found: ", input_path, ". Run the focused reading-time export cell in eval.ipynb first.")
}
report_path <- if (length(args) >= 2L) args[2] else
    file.path(dirname(input_path), "focused_rt_analysis_results.txt")
if (normalizePath(input_path) == normalizePath(report_path, mustWork = FALSE)) {
    stop("The report path must differ from the input CSV.")
}

df <- read.csv(input_path, stringsAsFactors = FALSE, na.strings = c("", "NA"))
metrics <- c("object_r4_ms", "modifier_object_ms", "verb_r5_ms", "interval_before_choice_ms")
required_columns <- c("session", "item", "context_condition", "target_condition", metrics)
missing_columns <- setdiff(required_columns, names(df))
if (length(missing_columns)) {
    stop("Missing input columns: ", paste(missing_columns, collapse = ", "),
         ". Rerun the focused timing export cell in eval.ipynb.")
}

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

df$session <- factor(df$session)
df$item <- factor(df$item)
df$target_condition <- factor(df$target_condition, levels = target_levels)
df$context_condition <- factor(df$context_condition, levels = context_levels)
contrasts(df$target_condition) <- contr.sum(3)
contrasts(df$context_condition) <- contr.sum(3)

report <- c(
    "Focused-target timing measures: linear mixed-effects models",
    paste("Generated:", format(Sys.time(), tz = "UTC", usetz = TRUE)),
    paste("Input:", input_path),
    "Response: log1p(timing measure in ms); modifier-object means are calculated before transformation.",
    "The logged pre-choice interval includes the 500 ms fixation and is not a choice-onset reaction time.",
    "Random intercepts: submission and item. Pooled and factorial analyses are separate.",
    "Pairwise Tukey adjustments apply within each reported comparison family, not across measures or models.",
    "Estimated effects and contrasts are on the log1p scale.",
    ""
)

for (metric in metrics) {
    values <- df[[metric]]
    if (any(!is.finite(values[!is.na(values)])) || any(values < 0, na.rm = TRUE)) {
        stop("Invalid non-finite or negative timing value in ", metric)
    }
    model_df <- df[!is.na(values), , drop = FALSE]
    model_df$response <- log1p(model_df[[metric]])
    if (nlevels(droplevels(model_df$session)) < 2L || nlevels(droplevels(model_df$item)) < 2L) {
        stop("At least two submissions and items are required for ", metric)
    }
    if (any(table(model_df$target_condition, model_df$context_condition) == 0L)) {
        stop("A target-by-context cell has no complete observations for ", metric)
    }

    pooled <- lmerTest::lmer(
        response ~ target_condition + (1 | session) + (1 | item),
        data = model_df, REML = FALSE
    )
    factorial <- lmerTest::lmer(
        response ~ target_condition * context_condition + (1 | session) + (1 | item),
        data = model_df, REML = FALSE
    )

    report <- c(
        report,
        paste0("\n========== ", metric, " =========="),
        paste("Trials:", nrow(model_df), "; missing measure:", sum(is.na(values)),
              "; submissions:", nlevels(droplevels(model_df$session)),
              "; items:", nlevels(droplevels(model_df$item))),
        "Target-by-context trial counts:",
        capture.output(print(table(model_df$target_condition, model_df$context_condition))),
        "\n--- Pooled target model ---",
        paste("Singular fit:", lme4::isSingular(pooled)),
        capture.output(print(summary(pooled))),
        capture.output(print(car::Anova(pooled, type = 3))),
        "Target estimated marginal means and pairwise comparisons (Tukey):",
        capture.output(print(emmeans::emmeans(pooled, pairwise ~ target_condition, adjust = "tukey"))),
        "\n--- Target by context model ---",
        paste("Singular fit:", lme4::isSingular(factorial)),
        capture.output(print(summary(factorial))),
        capture.output(print(car::Anova(factorial, type = 3))),
        "Target estimated marginal means and pairwise comparisons within each context (Tukey):",
        capture.output(print(emmeans::emmeans(
            factorial, pairwise ~ target_condition | context_condition, adjust = "tukey"
        ))),
        "Context estimated marginal means and pairwise comparisons within each target (Tukey):",
        capture.output(print(emmeans::emmeans(
            factorial, pairwise ~ context_condition | target_condition, adjust = "tukey"
        )))
    )
}

writeLines(report, report_path)
cat("Analysis report written to", report_path, "\n")
