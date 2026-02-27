suppressMessages(library(lme4))
suppressMessages(library(car))
suppressMessages(library(emmeans))
suppressMessages(library(ggplot2))

# Collect report header
timestamp_utc <- format(Sys.time(), tz = "UTC", usetz = TRUE)
all_lines <- c(
    "Linear mixed-effects model comparisons",
    paste0("Generated: ", timestamp_utc)
)

# Import the results dataset
df <- read.csv("./et_data.csv")

# Set factor levels in the desired order
df$condition    <- factor(df$condition,    levels = c("exclusive", "focus", "contrastive"))
df$chosen_type  <- factor(df$chosen_type,  levels = c("A", "B"))
df$item         <- factor(df$item)
df$participant  <- factor(df$participant)
df$cxt <- interaction(df$condition, df$chosen_type)

# # Specific order for 'cxt':
df$cxt <- factor(df$cxt, levels = c("exclusive.A","exclusive.B","focus.A","focus.B","contrastive.A","contrastive.B"))

# Define metrics to evaluate (numeric only)
metrics <- c("total_fixation")
# metrics <- c("total_dwell", "fvd", "total_fixation", "transitions")

# Iterate through each metric, log transform, fit models, and record outputs
for (metric in metrics) {
    if (!metric %in% names(df)) {
        all_lines <- c(all_lines, "", paste0("====== Metric: ", metric, " ======"),
                       paste0("[ERROR] Missing column '", metric, "' in et_data.csv"))
        next
    }

    response <- df[[metric]]

    # Keep raw values
    df$ET_raw <- as.numeric(response)

    # Fit models
    model1 <- lmer(ET ~ chosen_type + (1|item) + (1|participant), df, REML = FALSE)
    model2 <- lmer(ET ~ condition + (1|item) + (1|participant), df, REML = FALSE)
    model3 <- lmer(ET ~ condition + chosen_type + (1|item) + (1|participant), df, REML = FALSE)
    model4 <- lmer(ET ~ condition * chosen_type + (1|item) + (1|participant), df, REML = FALSE)

    model5 <- lmer(ET ~ cxt + (1|item) + (1|participant), df, REML = FALSE)

    # Anovas
    aov4_lines <- capture.output(car::Anova(model4, type = "III"))

    # Emmeans
    # emmeans(model4, pairwise ~ condition)    
    emmeans(model4, pairwise ~ chosen_type|condition, adjust = "tukey") 
    # emmeans(model4, list(pairwise ~ condition|chosen_type), adjust = "tukey")
    # emmeans(model5, list(pairwise ~ cxt), adjust = "tukey")

    emmeans4_lines1 <- capture.output(emmeans(model4, list(pairwise ~ condition|chosen_type), adjust = "tukey"))
    emmeans4_lines2 <- capture.output(emmeans(model4, list(pairwise ~ chosen_type|condition), adjust = "tukey"))
    # emmeans5_lines <- capture.output(emmeans(model5, list(pairwise ~ cxt), adjust = "tukey"))

    # Compare models 1, 2, and 3
    model_comp <- anova(model1, model2, model3, model4)
    comp_lines <- capture.output(print(model_comp))

    # Report
    report <- c(
        "",
        paste0("============================================="),
        paste0("============ Metric: ", metric, " ============"),
        paste0("============================================="),
        "",
        paste0("----------------------------------------------------"),
        paste0("------ Model Comparison (1, 2, 3, 4) (Likelihood-ratio tests) [", metric, "] ------"),
        paste0("----------------------------------------------------"),
        comp_lines,
        "",
        paste0("---------------------------------------------"),
        paste0("------ Model 4 Summary [", metric, "]: ------"),
        paste0("---------------------------------------------"),
        # capture.output(summary(model4)),
        paste0(aov4_lines),
        "",
        paste0("----------------------------------------------------"),
        paste0("Emmeans (Model 4, cxt, condition by type) [", metric, "]:"),
        paste0("---------------------------------------------"),
        emmeans4_lines1,
        "",
        emmeans4_lines2,
        "",
        paste0("________________________________________________________________________________")
    )
    all_lines <- c(all_lines, report)
}

# Write the compiled report to disk
writeLines(all_lines, "analysis_results_nolog.txt")

########################################