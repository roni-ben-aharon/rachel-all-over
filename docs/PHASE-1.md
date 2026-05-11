# PHASE 1 — Build This Now

**Goal:** Working trainer tool. Rachel can log in, add clients, build programs, and edit them.

**What does NOT exist in Phase 1:**
- No sessions
- No session history
- No versioning
- No client login
- No invite flow
- No progress graphs
- No CSV import

**Visual reference:** `screens-phase1.html` — open in browser before building.

---

## Routes

```
/login       → Sign in page
/dashboard   → Trainer dashboard (only page after login)
```

After login, always redirect to `/dashboard`. There are no other routes in Phase 1.

---

## Screen 1 — Sign In (`/login`)

- Email field + password field
- "Sign in" primary button (black bg, white text)
- Divider "or"
- "Continue with Google" button
- On success → redirect to `/dashboard`
- No sign up link (clients are Phase 2)

---

## Screen 2 — Trainer Dashboard (`/dashboard`)

This is the only screen after login. Everything happens here.

### Left sidebar (200px wide, fixed)

- Header: "Rachel's clients" + count of active clients
- Client list: one row per client
  - Avatar circle (first letter of name)
  - Client name
  - Days per week ("2x / week")
  - Active client row is highlighted
  - Clicking a row switches the main area to that client
- Bottom: "+ Add client" button (full width)

### Main area — Header

When a client is selected:
- Avatar circle + client full name
- Program name + days/week (subtitle)
- "Edit program" button (primary, black)
- "···" menu button → dropdown with:
  - New program
  - ─────────────
  - Delete client

**Edit mode toggle:**
When "Edit program" is clicked:
- "Edit program" button changes to "Save program" (primary) + "Cancel" (secondary)
- All workout table rows become editable (see edit mode below)
- Clicking "Save program" saves and exits edit mode
- Clicking "Cancel" discards changes and exits edit mode

### Main area — Workout cards

Workouts are stacked vertically (Workout A, then Workout B, etc.)

Each workout card has:
- Card header: workout label ("Workout A") + exercise count
- Table with these exact columns (in this order):

| Column | Width | Read mode | Edit mode |
|--------|-------|-----------|-----------|
| Muscle group | 15% | text | free text input |
| Category | 12% | text | free text input |
| Technique | 12% | text | free text input (e.g. "Super set") |
| Exercise | 20% | text | free text input |
| Sets | 8% | number | number input |
| Reps | 8% | text | text input (supports "10", "45 sec") |
| Resistance | 15% | formatted text | type selector + value (see below) |
| Notes | 10% | + icon | + icon |

**Read mode — Resistance display:**
- `{ type: "kg", value: 25 }` → "25 kg"
- `{ type: "band", color: "red", assisted: true }` → "🔴 Red (assisted)"
- `{ type: "band", color: "blue", assisted: false }` → "🔵 Blue (resistance)"
- `{ type: "bodyweight" }` → "Bodyweight"
- Empty → "—"

**Edit mode — Resistance input (ResistanceInput component):**
- Dropdown to select type: kg / Band / Bodyweight
- If kg: number input + "kg" label
- If Band:
  - Color selector: 🔴 Red / 🔵 Blue / 🟢 Green / ⚫ Black / 🟣 Purple
  - Toggle: "Assisted" (pull up assist) / "Resistance" (adds resistance)
- If Bodyweight: nothing extra shown

**Notes column behavior:**
- Read mode:
  - No note → faded "+" (lighter color, not interactive looking)
  - Has note → active "+" (dark) → click expands a row below showing the note → "−" to collapse
- Edit mode:
  - "+" → click opens an inline text input below the row
  - If note exists → shows 📝 icon → click to expand/collapse the text input

**Edit mode — extra controls:**
- "✕" button at the end of each row to delete the exercise
- "+ Add exercise" dashed button at bottom of each workout card → adds a new blank row

### Main area — Footer

- "Last updated: {date}" (left side)

### Save behavior

"Save program" → writes the full exercises array directly to `workouts/{workoutId}` document in Firestore.

**CRITICAL:** This is NOT a session. It does NOT create any version history. It just overwrites `workouts/{workoutId}.exercises` directly. No `workoutSessions` collection is touched.

---

## Screen 3 — Add Client Modal

Triggered by "+ Add client" in the sidebar.

Fields:
- First name + last name (two inputs side by side)
- Email address
- Program name (e.g. "Strength Phase 1")
- Workouts per week: pill button selector → 1 / 2 / 3 / 4 / 5 (one active at a time)

Buttons:
- "Cancel" → closes modal
- "Create client" (primary) → on submit:
  1. Create `clients/{id}` doc in Firestore
  2. Create `programs/{id}` doc linked to client
  3. Create N `workouts/{id}` docs (Workout A, B, C... based on days/week selected), each with `exercises: []`
  4. Close modal, select the new client in the sidebar, show their empty workout cards

---

## Firestore writes in Phase 1

Only these collections are written to in Phase 1:

```
trainers/         → created manually or on first login
clients/          → created via Add Client modal
programs/         → created via Add Client modal
workouts/         → created via Add Client modal, updated via Save Program
```

These collections must NOT be created in Phase 1:
```
workoutSessions/  → Phase 2
invites/          → Phase 2
exerciseLibrary/  → Phase 3
```

---

## Components to build

```
src/
  components/
    trainer/
      ClientList.tsx          // sidebar client list
      ClientHeader.tsx        // main area header with edit/save buttons
      WorkoutCard.tsx         // workout card wrapper
      WorkoutTable.tsx        // read mode table
      WorkoutTableEdit.tsx    // edit mode table with inputs
      ResistanceInput.tsx     // kg / band / bodyweight switcher
      NoteCell.tsx            // + / − expand/collapse note
      AddClientModal.tsx      // add client modal
  pages/
    Login.tsx
    TrainerDashboard.tsx
  hooks/
    useAuth.ts               // login, logout, current user
    useRole.ts               // is user a trainer or client?
    useClients.ts            // fetch clients for trainer
    useWorkouts.ts           // fetch workouts for a client
  lib/
    firebase.ts              // firebase config + exports
```

---

## Build order

Build in this exact order and test each step before moving on:

1. `firebase.ts` — config + auth + firestore exports
2. `useAuth.ts` — login with Google, login with email/password, logout
3. `Login.tsx` — sign in page
4. `useRole.ts` — check trainers collection to determine role
5. `TrainerDashboard.tsx` — page shell with sidebar + main area layout
6. `useClients.ts` + `ClientList.tsx` — sidebar with client list
7. `useWorkouts.ts` + `WorkoutTable.tsx` — read mode workout cards
8. `AddClientModal.tsx` — add client flow
9. `ResistanceInput.tsx` — resistance type selector
10. `NoteCell.tsx` — note expand/collapse
11. `WorkoutTableEdit.tsx` — edit mode with all inputs
12. `ClientHeader.tsx` — edit/save/cancel toggle
13. Wire save to Firestore
