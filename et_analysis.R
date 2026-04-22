suppressMessages(library(lme4))
suppressMessages(library(lmerTest))
suppressMessages(library(car))
suppressMessages(library(emmeans))
suppressMessages(library(ggplot2))

# Collect report header
timestamp_utc <- format(Sys.time(), tz = "UTC", usetz = TRUE)
header <- c(
    "Linear mixed-effects model comparisons",
    paste0("Generated: ", timestamp_utc)
)

all_lines <- header 

# Import the results dataset
df <- read.csv("./et_data.csv")

# Set factor levels in the desired order
df$condition    <- factor(df$condition,    levels = c("exhaustive", "unmodified", "contrastive"))
df$chosen_type  <- factor(df$chosen_type,  levels = c("A", "B"))
df$item         <- factor(df$item)
df$participant  <- factor(df$participant)
df$cxt <- interaction(df$condition, df$chosen_type)

# Specific order for 'cxt':
# df$cxt <- factor(df$cxt, levels = c("exclusive.A","exclusive.B","unmodified.A","unmodified.B","contrastive.A","contrastive.B"))

# Define metrics to evaluate (numeric only)
metrics <- c("total_dwell", "total_fixation", "prop_choice")

# Iterate through each metric, log transform, fit models, and record outputs
for (metric in metrics) {
    if (!metric %in% names(df)) {
        all_lines <- c(all_lines, "", paste0("====== Metric: ", metric, " ======"),
                       paste0("[ERROR] Missing column '", metric, "' in et_data.csv"))
        next
    }

    metric_lines <- tryCatch({
        response <- df[[metric]]

        # Keep raw values
        df$ET_raw <- as.numeric(response)

        # Log transform (base e). (Use log1p to allow zeros.)
        df$ET <- log1p(df$ET_raw)

        # Restrict to complete rows required by the model
        model_df <- df[complete.cases(df[, c("ET", "condition", "chosen_type", "item", "participant")]), ]
        if (nrow(model_df) == 0) {
            stop("No complete rows available after filtering for model variables")
        }

        # Fit model
        model1 <- lmer(ET ~ condition * chosen_type + (1|item) + (1|participant), model_df, REML = FALSE)

        # Anovas
        aov_lines <- capture.output(car::Anova(model1, type = "III"))

        # Emmeans
        emmeans_lines1 <- capture.output(emmeans(model1, list(pairwise ~ chosen_type|condition), adjust = "tukey"))
        emmeans_lines2 <- capture.output(emmeans(model1, list(pairwise ~ condition|chosen_type), adjust = "tukey"))
        emmeans_lines3 <- capture.output(emmeans(model1, list(pairwise ~ condition * chosen_type), adjust = "tukey"))

        # Report
        c(
            "",
            paste0("============================================="),
            paste0("============ Metric: ", metric, " ============"),
            paste0("============================================="),
            paste0("---------------------------------------------"),
            paste0("------ Model 1 Summary [", metric, "]: ------"),
            paste0("---------------------------------------------"),
            capture.output(summary(model1)),
            paste0("---------------------------------------------"),
            paste0(aov_lines),
            "",
            paste0("----------------------------------------------------"),
            paste0("Emmeans [", metric, "]:"),
            paste0("---------------------------------------------"),
            emmeans_lines1,
            paste0("---------------------------------------------"),
            emmeans_lines2,
            paste0("---------------------------------------------"),
            emmeans_lines3
        )
    }, error = function(e) {
        c(
            "",
            paste0("============================================="),
            paste0("============ Metric: ", metric, " ============"),
            paste0("============================================="),
            paste0("[ERROR] Metric processing failed: ", conditionMessage(e))
        )
    })

    all_lines <- c(all_lines, metric_lines)
}

# Write the compiled report to disk
writeLines(all_lines, "et_analysis_results.txt")

### END #####################################



# Autogenerate table:
# library(emmeans)

# emm <- emmeans(model4, ~ chosen_type | condition)

# # back-transform from log1p using delta-method SE:
# tab <- as.data.frame(emm)
# tab$mean_raw <- exp(tab$emmean) - 1
# tab$se_raw   <- exp(tab$emmean) * tab$SE

# tab[, c("condition","chosen_type","mean_raw","se_raw")]



### END ####