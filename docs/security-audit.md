# Match engine security and safety audit

## Changed trust boundaries

- Student and catalog payloads are treated as untrusted input.
- Arrays, strings, numeric ranges, identifiers, parent references, URLs, and option bounds are validated.
- Duplicate institute/program IDs are rejected.
- Source URLs must be absolute HTTP(S) URLs without embedded credentials.
- The engine performs no network calls and executes no user-provided code.

## Privacy

- Matching uses a minimal allowlist of profile signals.
- Name and extra profile fields do not affect scores.
- Sensitive/protected attributes are intentionally ignored and covered by regression tests.
- The demo contains no real student or institute data.

## Decision safety

- Academic ineligibility is not hidden inside a blended score.
- Fit and confidence are separate.
- Missing, stale, and synthetic data produce visible warnings.
- Output includes a mandatory verification disclaimer.
- LLM ranking is outside the boundary of this version.

## Residual risks

- Token overlap is a baseline and may miss nuanced interests or interdisciplinary programs.
- Source metadata can be present but incorrect; production ingestion needs independent verification.
- Fee currencies and financial aid are not normalized yet.
- A deterministic formula can still encode biased assumptions through weights or catalog coverage.
- Admissions rules change; stale-source monitoring is required before real deployment.
