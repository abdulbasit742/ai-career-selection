# 🎓 AI Career Selection

**Students share who they are. The AI tells them where they belong.**

A platform where a student fills in everything about themselves (interests, grades, subjects they love, budget, location, goals), explores every university and institute in one place, and gets an honest, AI-driven recommendation of the best-fit institutes for them — ranked, explained, and personalised.

> Build order: features are numbered 1..N. Each feature = one focused, shippable change pushed to git. **This is Feature #1: the foundation.**

---

## 🌟 What it does (the vision)

1. **Student Profile** — the student tells the system everything: academic record, favourite subjects, interests, strengths, budget, preferred city/country, career goals.
2. **Institute Explorer** — browse/search every university and institute, with programs, fees, locations, admission criteria, deadlines.
3. **AI Match Engine** — the AI reads the student's profile + interests and recommends the institutes that fit best, ranked 1..N, each with a clear "why this is a good fit for you" explanation.
4. **Guidance** — next steps: what to study, entry requirements, deadlines, and how to prepare.

## 🧠 Why AI-driven

Most students pick blind — by hearsay or peer pressure. This reads the actual person (interests + ability + constraints) and matches it to real programs, then explains the reasoning so the student learns, not just obeys.

---

## 🏗️ Architecture (planned)

```
ai-career-selection/
├── apps/
│   ├── web/          # student-facing app (profile, explorer, recommendations)
│   └── api/          # backend API
├── packages/
│   ├── match-engine/ # AI matching + scoring (profile  ->  ranked institutes)
│   └── shared/       # shared types/models (Student, Institute, Program, Match)
├── data/             # seed institute/program data
└── docs/             # specs per feature
```

**Stack (proposed, locked in a later feature):**
- Web: React + TypeScript + Tailwind
- API: Node + TypeScript (Express/Fastify)
- DB: Postgres (students, institutes, programs, matches)
- AI: routed through a self-hosted LLM (Ollama) for profile→fit reasoning, with a deterministic scoring layer underneath so results are explainable and not pure black-box.

## 🧩 Core data model (first draft)

- **Student**: interests[], subjects[], grades, budget, location, goals[]
- **Institute**: name, type, location, ranking, programs[]
- **Program**: name, field, fees, duration, entryRequirements
- **Match**: studentId, instituteId, programId, score (0–100), reasons[]

See [`packages/shared/models.ts`](packages/shared/models.ts) for the typed definitions.

## 🗺️ Roadmap (numbered features)

- **#1 — Foundation (this commit):** vision, architecture, data model, repo scaffold.
- **#2 onwards:** to be assigned. Each number = one focused feature, coded and pushed.

---

## 🚦 Status

Feature #1 ✅ — foundation in place. Waiting for Feature #2.
