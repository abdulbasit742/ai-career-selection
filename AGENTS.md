# Repository agent guidance

## Scope

These instructions apply to the entire `ai-career-selection` repository.

## Architecture

- Keep ranking deterministic and reviewable.
- Keep domain types in `packages/shared/models.ts` and runtime matching in `packages/match-engine/`.
- Do not let an LLM change eligibility, scores, weights, or ordering.
- Treat committed catalog records as synthetic unless official provenance is documented.

## Verification

```bash
npm ci
npm test
npm run demo
npm run check
```

Add regression tests for every scoring, validation, eligibility, confidence, or tie-break change.

## Safety

- Never commit real student profiles, secrets, populated environment files, or unlicensed admissions datasets.
- Do not use protected attributes in scoring.
- Preserve separate fit and confidence values.
- Missing or stale data must remain visible as warnings; do not silently impute authoritative facts.
- Real recommendations require counselor/user review and verification against official institute sources.
