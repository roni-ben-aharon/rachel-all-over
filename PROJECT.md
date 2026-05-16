# RachelAllOver — Project Spec

> **For Claude Code:** Read this file first, then the relevant Phase section. Only build the phase explicitly requested. Do not build ahead.

**Visual references (open in browser):**
- `docs/screens-phase1.html`
- `docs/screens-phase2.html`
- `docs/screens-phase3.html`

---

## Table of Contents

1. [Tech Stack](#tech-stack)
2. [Data Model](#data-model)
3. [Design Tokens](#design-tokens)
4. [Phase 1 — Trainer Tool](#phase-1--trainer-tool-)
5. [Phase 2 — Sessions + Client Experience](#phase-2--sessions--client-experience-)
6. [Phase 3 — Power Features](#phase-3--power-features-)
7. [Known Bugs](#known-bugs-)
8. [Wishlist](#wishlist-)

---

## Tech Stack

- React + TypeScript (Vite)
- Tailwind CSS
- Firebase Auth + Firestore
- React Router v6
- Playwright (E2E tests) + Vitest (unit tests)
- Recharts (Phase 3 only)

**Run locally:**
```bash
npm run emulator       # terminal 1 — Firebase emulator
npm run dev:local      # terminal 2 — http://localhost:5175
node scripts/seed.mjs  # seed test data (emulator must be running)
```

**Firebase keys:** in `.env` (not committed — see `.env.example`)

---

## Data Model

### Phase 1 collections

```
trainers/{trainerId}
  name: string
  email: string

clients/{clientId}
  trainerId: string
  name: string
  email: string
  daysPerWeek: number
  deleted: boolean
  inviteAccepted: boolean

programs/{programId}
  clientId: string
  trainerId: string
  name: string            // e.g. "Strength Phase 1"
  active: boolean
  deleted: boolean
  createdAt: timestamp

workouts/{workoutId}
  programId: string
  clientId: string
  label: string           // "Workout A", "Workout B", etc.
  order: number
  exercises: Exercise[]   // overwritten directly on save
  updatedAt: timestamp
```

### Exercise type

```ts
interface Exercise {
  muscleGroup: string
  category: string           // "Primary" | "Secondary" | "Isolation"
  advancedTechnique: string  // "Super set" | "Progression" | ""
  name: string
  sets: number | null
  reps: string               // "10", "45 sec", ""
  resistance: {
    type: 'kg' | 'band' | 'bodyweight'
    value?: number
    bandColor?: 'red' | 'blue' | 'green' | 'black' | 'purple'
    assisted?: boolean
  }
  notes: string
}
```

### Phase 2 additions

```
workoutSessions/{sessionId}
  workoutId: string
  clientId: string
  trainerId: string
  createdAt: timestamp
  programUpdated: boolean
  exercises: Exercise[]

invites/{inviteId}
  clientId: string
  trainerId: string
  email: string
  used: boolean
  createdAt: timestamp
  trainerName: string
```

### Phase 3 additions

```
exerciseLibrary/{exerciseId}
  name: string
  muscleGroup: string
  category: string
  createdBy: 'system' | trainerId
```

---

## Design Tokens

```
Font:             -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif
Card radius:      12px
Input/btn radius: 6px
Border:           #e0e0e0
Bg secondary:     #fafafa / #f5f5f5
Primary button:   background #111, color #fff
Session banner:   background #FFFBEB, text #92400E
Avatar accent:    background #EFF6FF, text #3B82F6
Error/danger:     #ef4444
Success:          #1D9E75
```

**Resistance display (read mode):**

| Data | Display |
|------|---------|
| `{ type: "kg", value: 25 }` | `25 kg` |
| `{ type: "band", color: "red", assisted: true }` | `🔴 Red (assisted)` |
| `{ type: "band", color: "blue", assisted: false }` | `🔵 Blue (resistance)` |
| `{ type: "bodyweight" }` | `Bodyweight` |
| empty / null | `—` |

---

## Phase 1 — Trainer Tool ✅

**Status: Complete**

**What exists:**
- Login (email + Google)
- Trainer dashboard — client sidebar, workout cards (read + edit mode)
- Add client modal → creates client + program + N workouts + invite link
- Edit program — inline edit, save to Firestore, validation
- Delete workout, add workout (up to 5)
- Collapse/expand workout cards
- Reps validation (whole number only)

**Routes:**
```
/login       → Sign in
/dashboard   → Trainer dashboard
```

**What does NOT exist in Phase 1:** sessions, versioning, client login, invite email sending, progress graphs, CSV import.

---

## Phase 2 — Sessions + Client Experience 🔄

**Status: Partially complete**

**Done:**
- Client signup via invite link (`/signup?invite={id}`)
- Client view (`/my-program`) — read-only program, collapse/expand cards
- Role-based routing (trainer → `/dashboard`, client → `/my-program`)
- Invite creation in Add Client modal

**Not yet built:**
- Session flow (`/session/:clientId/:workoutId`)
- End session modal (Yes/No update program toggle)
- Session history panel on dashboard
- `/my-progress` placeholder page

**New routes:**
```
/signup?invite={inviteId}      → Client signup
/session/:clientId/:workoutId  → Session page (trainer)
/my-program                    → Client program view
/my-progress                   → Progress placeholder
```

**Session flow summary:**
- "Start session" button on dashboard (next to "Edit program")
- Full screen session page with amber banner
- On end: creates `workoutSessions/{id}` doc always; if trainer says "Yes" → also overwrites `workouts/{id}.exercises`

---

## Phase 3 — Power Features 📋

**Status: Not started**

1. **Progress graphs** — Recharts LineChart, one line per exercise, volume (sets × reps × weight)
2. **CSV import** — drag & drop .csv/.xlsx → preview → confirm → save to Firestore
3. **Exercise library** — pre-seeded from `exercises.json`, combobox in edit mode with autocomplete + auto-fill muscle group/category
4. **Multiple trainers** — already supported by data model, no UI needed
5. **Soft delete** — `deleted: boolean` already in data model, just filter in queries

---

## Known Bugs 🐛

### Legend
- 🔴 Open
- 🟡 Partial — fix attempted, needs verification
- 🟢 Fixed

### Active

| # | Status | Area | Description |
|---|--------|------|-------------|
| 1 | 🟡 | WorkoutSession | Template banner not showing for fresh programs — added `loaded` guard, needs live test |
| 2 | 🔴 | TrainerDashboard | `handleNewProgram` always creates only Workout A + B — should create N workouts based on `daysPerWeek` |
| 3 | 🔴 | programTemplates.ts | `getTemplate(3)` returns 2 workouts — mismatch with AddClientModal which creates 3 for 3x/week |
| 4 | 🔴 | AddClientModal | Invite link only shown in modal — email not sent. Needs Firebase Trigger Email or SMTP |
| 5 | 🔴 | CsvImportPage | If CSV has more workout groups than pre-created workouts, extras are silently dropped |

### Fixed

| # | Area | Description |
|---|------|-------------|
| F1 | TrainerDashboard | "Edit program" enabled when no workouts existed |
| F2 | AddClientModal | Created only 2 workouts regardless of daysPerWeek |
| F3 | WorkoutTable | Blank state showed generic message without columns |
| F4 | TrainerDashboard | Workout count increased when switching clients (race condition) |
| F5 | WorkoutSession | WorkoutTableEdit reps field accepted ranges — now validates whole number only |

---

## Wishlist 💡

Features not yet in any phase — ideas to revisit later.

| # | Idea | Notes |
|---|------|-------|
| W1 | Send invite email automatically | Currently just shows a link. Could use Firebase Trigger Email extension |
| W2 | Client can log their own session | Right now only trainer starts sessions |
| W3 | Program templates | Preset programs Rachel can assign to new clients in one click |
| W4 | Notes per client (not per exercise) | General trainer notes / goals for each client |
| W5 | Dark mode | — |
| W6 | Mobile app (React Native) | Clients log in on their phone during session |

> Add new wishes here — move to a Phase when ready to build.
