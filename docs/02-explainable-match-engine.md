# Feature #2 — Explainable Match Engine v1

## Goal

Turn a validated student profile and program catalog into a deterministic shortlist that a student, parent, counselor, or reviewer can inspect without trusting a black-box model.

## Ranking model

The engine compares profile terms with program name, field, keywords, career outcomes, and entry requirements. A small canonical-token map handles obvious equivalents such as `coding` → `programming` and `maths` → `mathematics`.

Default weighted components:

- interests: 30
- subjects: 20
- goals: 20
- budget: 15
- location: 10
- academics: 5

All component points are returned. Weights are normalized, so custom weights do not need to total 100.

## Eligibility and uncertainty

A known academic score below a known program minimum is a hard eligibility failure. The program is excluded from the normal shortlist and reported separately.

Missing student scores or missing program thresholds do not invent eligibility. The result is marked `unknown`, receives neutral academic credit, and includes a warning.

## Fit versus confidence

`fitScore` answers: **How well do the available profile signals align with this program?**

`confidence` answers: **How complete and well-sourced is the evidence behind that score?**

Confidence considers profile completeness, program metadata completeness, source URL/date metadata, and optional freshness relative to `asOf`. Synthetic fixtures are explicitly capped and warned.

## Privacy and fairness boundary

Only interests, subjects, goals, academic score, budget, location preference, and relocation preference are used. Extra fields such as gender, religion, ethnicity, or disability do not affect the result.

This is an engineering safeguard, not proof of fairness. Production use still requires representative evaluation data, outcome monitoring, appeal/review paths, and legal/ethical review.

## Determinism

After fit and confidence, ties are ordered by stable institute and program IDs. The engine performs no network calls and does not mutate inputs.
