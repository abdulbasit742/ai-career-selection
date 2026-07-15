# AI Career Selection

A local-first decision-support project for matching a student profile to institute programs with transparent, reviewable scoring.

The system does **not** decide a student's future and does not treat an LLM as an admissions authority. It produces a ranked shortlist, explains every score component, separates fit from data confidence, and tells the user what must be verified with official institute sources.

## Current status

**Feature #2: Explainable Match Engine v1**

- deterministic profile-to-program ranking
- hard academic eligibility gate
- weighted interest, subject, goal, budget, location, and academic components
- separate confidence score for profile completeness and catalog provenance
- explicit warnings for missing, stale, or synthetic data
- stable tie-breaking and bounded input validation
- protected/sensitive profile attributes are not used for scoring
- dependency-free Node.js runtime and automated tests

## Quick start

Requirements: Node.js 20 or newer.

```bash
npm ci
npm test
npm run demo
npm run check
```

The demo uses only fictional records from `data/sample-institutes.json`.

## Public API

```js
import { matchStudent } from './packages/match-engine/index.mjs';

const result = matchStudent(student, institutes, {
  topK: 5,
  asOf: '2026-07-15',
});
```

Each match includes:

- `fitScore`: weighted program fit from 0 to 100
- `confidence`: completeness/provenance confidence from 0 to 100
- `eligible` and `eligibilityStatus`
- component points and maximum points
- human-readable reasons
- missing/stale/synthetic-data warnings
- source metadata when supplied

Programs below a known academic threshold are excluded by default. They can be returned for review with `includeIneligible: true`, but remain clearly marked ineligible.

## Default scoring weights

| Component | Weight |
|---|---:|
| Interests | 30 |
| Subjects | 20 |
| Goals | 20 |
| Budget | 15 |
| Location | 10 |
| Academics | 5 |

Weights are configurable, validated, and normalized. The same input and options always produce the same order.

## Data and safety boundary

The committed catalog is synthetic and must never be presented as real admissions data. A production catalog needs official or licensed sources, verification dates, accreditation checks, currency normalization, and a documented update process.

LLMs may later rewrite already-computed reasons into simpler language. They must not change eligibility, component scores, or ranking.

## Repository structure

```text
packages/shared/models.ts          Shared domain types
packages/match-engine/             Validated deterministic engine
packages/match-engine/index.d.ts   TypeScript public declarations
data/sample-institutes.json        Fictional test/demo catalog
scripts/match-demo.mjs             Runnable example
tests/                             Regression suites
docs/                              Design, references, and audits
```

## Roadmap

- **#1 Foundation:** vision and initial domain models
- **#2 Explainable Match Engine v1:** complete
- Student profile UI/API with consent and minimal-data collection
- Official-source institute explorer with freshness monitoring
- Offline evaluation dataset and ranking-quality metrics
- Optional LLM explanation layer that cannot alter deterministic results
