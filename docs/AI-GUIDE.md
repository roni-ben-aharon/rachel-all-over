# TrackLift — Project Files

## How to use these files

Hand all files in this folder to Claude Code. Start with this prompt:

> "Read README.md first, then PHASE-1.md. Fix the existing code to match Phase 1 exactly. Do not build anything from Phase 2 or Phase 3."

---

## Files in this folder

| File | Purpose |
|------|---------|
| `README.md` | This file — overview and how to use |
| `PHASE-1.md` | **Build this now** — login, dashboard, edit program |
| `PHASE-2.md` | Build after Phase 1 is approved — sessions, client login |
| `PHASE-3.md` | Future features — graphs, CSV import, exercise library |
| `SHARED.md` | Tech stack, Firebase config, data model — shared across all phases |
| `screens-phase1.html` | Visual reference for Phase 1 screens |
| `screens-phase2.html` | Visual reference for Phase 2 screens |
| `screens-phase3.html` | Visual reference for Phase 3 screens |
| `exercises.json` | 107 exercises from Rachel's data (used in Phase 3) |
| `seed.ts` | Script to populate exercise library in Firestore (Phase 3) |

---

## Product Overview

**TrackLift** is a workout tracking app for personal trainers and their clients.

Rachel (the trainer) uses it to build workout programs for her clients and track their progress over time. Clients log in to view their program and see their progress.

The core problem it solves: Rachel currently manages everything in Excel. When she updates a program, the old version is overwritten — there's no history, no progress tracking.

---

## The 3 Phases

### Phase 1 — Working trainer tool (build now)
Rachel can log in, add clients, build programs, and edit them directly. No sessions, no versioning, no client login yet.

### Phase 2 — Sessions + client experience
Rachel can run training sessions (separate from editing the program), log what happened, and optionally update the program based on the session. Clients can log in and view their program.

### Phase 3 — Power features
Progress graphs, CSV import from Excel, exercise library with autocomplete, and more.

---

## Current State (what Claude Code already built)

- ✅ Login screen
- ✅ Trainer dashboard (client list + read mode)
- ✅ Add client modal
- ✅ Blank template (empty workout cards)
- ⚠️ Edit program — BROKEN: currently opens a session screen instead of inline editing on the dashboard
- ⚠️ Session screen — should not exist in Phase 1, was built prematurely
- ❌ Missing columns in program table: Muscle group, Category, Technique are missing
- ❌ Missing resistance band type UI

## What needs to be fixed in Phase 1

1. **Remove the session screen** — `/session/...` route should not exist yet
2. **Fix Edit program** — should toggle inline edit mode on the dashboard, NOT navigate to a new page
3. **Add missing columns** to the workout table: Muscle group | Category | Technique | Exercise | Sets | Reps | Resistance | Notes
4. **Add resistance input** — dropdown for kg / band / bodyweight with appropriate sub-inputs
5. **Save program** directly to Firestore (`workouts/{id}.exercises`) — no versioning
