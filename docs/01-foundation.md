# Feature #1 — Foundation

## Goal

Lay the groundwork so every later numbered feature has a clear home: a shared vision, folder structure, and core domain models.

## Delivered

- Vision and architecture in the root [README](../README.md).
- Domain models in [`packages/shared/models.ts`](../packages/shared/models.ts).
- Folder scaffold for web, API, match engine, shared models, data, and documentation.

## How numbered features work

Each number is one focused, shippable feature:

1. Build the smallest complete vertical slice.
2. Add focused tests and documentation.
3. Update roadmap status and verification commands.

## Current sequence

- **#1 Foundation:** complete.
- **#2 Explainable Match Engine v1:** complete. It validates profile/catalog data and produces deterministic rankings with separate fit and confidence scores.
- **Next:** profile capture UI/API, official-source institute explorer, offline evaluation, then an optional explanation-only LLM layer.

The implementation order changed from the original suggestion because an executable, testable scoring baseline establishes the data contract needed by both profile capture and the institute explorer.
