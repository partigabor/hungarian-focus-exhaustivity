
# # Minimal choice-only R script

# library(lme4)
# library(emmeans)

# dat <- read.csv("choice_data.csv", stringsAsFactors = FALSE)

# # IDs
# dat$subject <- factor(dat$participant_id)
# dat$item    <- factor(dat$item)

# # Binary choice: adjust mapping if your labels differ ("A" -> 1, "B" -> 0)
# dat$choice <- ifelse(dat$chosen_type == "A", 1,
#                          ifelse(dat$chosen_type == "B", 0, NA))
# dat <- subset(dat, !is.na(choice))

# # Condition factor (set level order to match your hypotheses)
# dat$condition <- factor(dat$condition, levels = c("exhaustive", "unmodified", "contrastive"))

# # Contrast coding (sum-to-zero effects coding) — print matrix for Methods
# contrasts(dat$condition) <- contr.sum(3)
# print(contrasts(dat$condition))

# # Fit mixed-effects logistic model (condition only)
# m <- glmer(choice ~ condition + (1 | subject) + (1 | item),
#            family = binomial(link = "logit"),
#            data = dat,
#            control = glmerControl(optimizer = "bobyqa", optCtrl = list(maxfun = 2e5)))

# summary(m)

# # Pairwise comparisons (adjusted)
# emm <- emmeans(m, ~ condition)
# pairs(emm, adjust = "holm")

# # # Odds ratios and 95% Wald CIs for reporting
# # coefs <- summary(m)$coefficients
# # OR <- exp(coefs[, "Estimate"])
# # ci <- exp(confint(m, parm = "beta_", method = "Wald"))
# # cbind(Estimate = coefs[, "Estimate"], OR = OR, ci)

######################################################

# Mixed-Effects Logistic Regression for Picture Choice

library(lme4)
library(emmeans)

# 1. Load Data
dat <- read.csv("choice_data.csv", stringsAsFactors = FALSE)

# 2. Factorize IDs
dat$subject <- factor(dat$participant_id)
dat$item    <- factor(dat$item)

# 3. Create Binary Outcome (Reviewer request: "For a binary outcome...")
dat$choice <- ifelse(dat$chosen_type == "A", 1,
                     ifelse(dat$chosen_type == "B", 0, NA))
dat <- subset(dat, !is.na(choice))

# 4. Define Fixed Effect (Reviewer request: "...with sentence condition as a fixed effect")
dat$condition <- factor(dat$condition, levels = c("exhaustive", "unmodified", "contrastive"))

# Apply sum-to-zero effects coding
contrasts(dat$condition) <- contr.sum(3)
print("Contrast Matrix:")
print(contrasts(dat$condition))

# 5. Fit Model (Reviewer request: "...generalized linear mixed-effects model (binomial family, logit link)... random effects for participants and items.")
m <- glmer(choice ~ condition + (1 | subject) + (1 | item),
           family = binomial(link = "logit"),
           data = dat,
           control = glmerControl(optimizer = "bobyqa", optCtrl = list(maxfun = 2e5)))

print(summary(m))

# 6. Pairwise Comparisons
emm <- emmeans(m, ~ condition)
print("Pairwise Comparisons (Holm adjusted):")
print(pairs(emm, adjust = "holm"))

# 7. Odds Ratios and 95% CIs (Uncommented for manuscript reporting)
print("Odds Ratios and 95% Confidence Intervals:")
coefs <- summary(m)$coefficients
OR <- exp(coefs[, "Estimate"])
ci <- exp(confint(m, parm = "beta_", method = "Wald"))
cbind(Estimate = coefs[, "Estimate"], OR = OR, ci)
