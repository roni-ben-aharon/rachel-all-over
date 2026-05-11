# TrackLift — Bug & Issue Tracker

## Legend
- 🔴 Open — not fixed
- 🟡 Partial — fix attempted, needs verification
- 🟢 Fixed — confirmed working

---

## Active Bugs

| # | Status | Area | Description |
|---|--------|------|-------------|
| 1 | 🟡 | WorkoutSession | Template banner not showing for fresh programs — added `loaded` guard, needs live test |
| 2 | 🔴 | TrainerDashboard | `handleNewProgram` always creates only Workout A + B — should create N workouts based on client's `daysPerWeek` |
| 3 | 🔴 | programTemplates.ts | `getTemplate(3)` returns 2 workouts — but AddClientModal now creates 3 workouts for 3x/week. Mismatch between template count and workout count |
| 4 | 🔴 | WorkoutSession | Excel import modal still exists in session — now redundant with `/import/:clientId` flow. Decide: keep, remove, or repurpose |
| 5 | 🔴 | AddClientModal | Invite link only logged to console — email not sent. Needs Firebase Trigger Email or SMTP integration |
| 6 | 🔴 | CsvImportPage | If CSV has more workout groups than pre-created workouts, extras are silently dropped — should create additional workout docs |
| 7 | 🔴 | TrainerDashboard | "Edit program" navigates to `workouts[0].id` — if that workout was deleted/out of order, may break |
| 8 | 🔴 | Client view | No loading state — blank screen briefly on load |

---

## Fixed

| # | Status | Area | Description | Fixed in |
|---|--------|------|-------------|----------|
| F1 | 🟢 | TrainerDashboard | "Edit program" button was enabled when no workouts existed | Session 1 |
| F2 | 🟢 | AddClientModal | Only created 2 workouts regardless of daysPerWeek | Session 2 |
| F3 | 🟢 | AddClientModal | Missing last name field, no Start blank / Import CSV toggle | Session 2 |
| F4 | 🟢 | WorkoutTable | Blank state showed generic "No exercises yet" without columns | Session 2 |
| F5 | 🟢 | App.tsx | Missing `/import/:clientId` route | Session 2 |

---

## Notes / Decisions Pending

- **Invite email**: Firebase Trigger Email extension vs manual SMTP — not decided
- **Excel import in session**: Keep for manual mid-session imports or remove in favour of `/import` flow?
- **Band scale for progress chart**: Who defines the order? Hardcoded for now (red=1, blue=2, green=3, black=4, purple=5)
