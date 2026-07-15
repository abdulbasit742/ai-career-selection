# Reference repository review

Three public repositories were reviewed for patterns, not copied source.

## `aliciazhang15/Career-Advising-Matching-Recommendation-System`

Useful pattern: formulate career guidance as content similarity between a new profile/question and known items, with multiple candidate similarity techniques.

Adopted: transparent text-feature overlap as a small baseline.

Not adopted: notebook-only delivery, unbounded NLP dependencies, or opaque embedding scores without a repository-specific evaluation dataset.

## `recommenders-team/recommenders`

Useful pattern: separate data preparation, modeling, evaluation, optimization, and operationalization; keep simple baselines alongside advanced models.

Adopted: validated data boundary, explicit scoring components, deterministic baseline, testable outputs, and a clear future evaluation stage.

Not adopted: large ML stacks and collaborative-filtering algorithms, because this repository has no interaction history yet.

## `nilbuild/developer-roadmap`

Useful pattern: present career paths as understandable role descriptions, structured choices, and concrete next steps rather than a single unexplained answer.

Adopted: readable reasons, component breakdowns, warnings, and decision-support wording.

Not adopted: developer-only roadmap content, visual design, or application source.
