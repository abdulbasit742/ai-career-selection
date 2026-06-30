# Feature #1 — Foundation

## Goal
Lay the groundwork so every later numbered feature has a clear home: a shared vision, a folder
structure, and the core domain models the whole system revolves around.

## Delivered
- **Vision + architecture** in the root [README](../README.md).
- **Domain models** in [`packages/shared/models.ts`](../packages/shared/models.ts): `Student`,
  `Institute`, `Program`, `Match`, `Recommendation`.
- **Folder scaffold**: `apps/web`, `apps/api`, `packages/match-engine`, `packages/shared`, `data`,
  `docs`.

## How numbered features work
Each number (1, 2, 3, …) is ONE focused feature. For each:
1. Build the smallest complete version of that feature.
2. Commit with `feat(#N): <what>` and push.
3. Update the README roadmap status.

This keeps the history readable and every step shippable, instead of one giant unreviewable dump.

## Suggested next features (not started — waiting for the go-ahead number)
- **#2 Student Profile capture** — form + API to create/update a `Student`.
- **#3 Institute Explorer** — list/search `Institute`s and their `Program`s from seed data.
- **#4 Match Engine v1** — deterministic scoring: interests/subjects/budget/location → ranked matches with reasons.
- **#5 AI reasoning layer** — wrap the scores with LLM-generated "why this fits you" explanations.

The student profile is intentionally first after foundation because nothing can be matched until we
can capture who the student is.
