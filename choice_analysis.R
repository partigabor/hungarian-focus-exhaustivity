# Minimal choice-only R script

library(lme4)
library(emmeans)

dat <- read.csv("choice_data.csv", stringsAsFactors = FALSE)

# IDs
dat$subject <- factor(dat$participant_id)
dat$item    <- factor(dat$item)

# Binary choice: adjust mapping if your labels differ ("A" -> 1, "B" -> 0)
dat$choice <- ifelse(dat$chosen_type == "A", 1,
                         ifelse(dat$chosen_type == "B", 0, NA))
dat <- subset(dat, !is.na(choice))

# Condition factor (set level order to match your hypotheses)
dat$condition <- factor(dat$condition, levels = c("exhaustive", "unmodified", "contrastive"))

# Contrast coding (sum-to-zero effects coding) — print matrix for Methods
contrasts(dat$condition) <- contr.sum(3)
print(contrasts(dat$condition))

# Fit mixed-effects logistic model (condition only)
m <- glmer(choice ~ condition + (1 | subject) + (1 | item),
           family = binomial(link = "logit"),
           data = dat,
           control = glmerControl(optimizer = "bobyqa", optCtrl = list(maxfun = 2e5)))

summary(m)

# Pairwise comparisons (adjusted)
emm <- emmeans(m, ~ condition)
pairs(emm, adjust = "holm")

# # Odds ratios and 95% Wald CIs for reporting
# coefs <- summary(m)$coefficients
# OR <- exp(coefs[, "Estimate"])
# ci <- exp(confint(m, parm = "beta_", method = "Wald"))
# cbind(Estimate = coefs[, "Estimate"], OR = OR, ci)
