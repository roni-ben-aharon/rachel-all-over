# PHASE 2 — Build After Phase 1 is Approved

**Goal:** Sessions, history, and client experience.

**Do not build Phase 2 until Phase 1 is complete and approved.**

**Visual reference:** `screens-phase2.html`

---

## What's new in Phase 2

### 1. Sessions (separate from Edit program)

The key distinction:
- **Edit program** (Phase 1) = Rachel is fixing the structure of the plan. Saves directly. No history.
- **Start session** (Phase 2) = Rachel is training with a client right now. Changes are logged. At the end, Rachel decides if the program should be updated.

**New button on dashboard:** "Start session" (next to "Edit program")

**Session page** (`/session/:clientId/:workoutId`):
- Full screen, separate page
- Amber top banner: "Session — {clientName}" + "End session" button
- Workout picker tabs: Workout A | Workout B
- Editable table: same columns as edit mode (Muscle group | Category | Technique | Exercise | Sets | Reps | Resistance | Notes)
- Footer: "Started {time}" + change indicator ("No changes" / "Unsaved changes")

**End session modal:**
- Question: "Update program based on today?" with Yes / No toggle
- "Save session" primary button
- On save:
  - Always: creates `workoutSessions/{id}` doc with full exercise snapshot + `programUpdated: true/false`
  - If Yes: also overwrites `workouts/{workoutId}.exercises` with session exercises
  - If No: session logged, program unchanged

**Session history:**
- In the "···" dropdown on dashboard: add "Session history"
- Opens a right side panel showing list of past sessions for the selected client
- Each entry: date + "Program updated" tag if applicable

### 2. Client invite + signup

- Rachel enters client email in Add Client modal → sends invite
- Invite link: `/signup?invite={inviteId}`
- Signup page: pre-filled locked email, name field, password field, "Create account" + "Sign up with Google"

### 3. Client view

After client logs in:
- `/my-program` → read-only program table (same layout as trainer dashboard but no edit controls)
- `/my-progress` → placeholder page ("Progress graphs coming soon")

---

## New routes in Phase 2

```
/signup?invite={inviteId}    → Client signup
/session/:clientId/:workoutId → Session page
/my-program                  → Client program view
/my-progress                 → Placeholder
```

---

## New Firestore collections in Phase 2

```
workoutSessions/{sessionId}
  - workoutId: string
  - clientId: string
  - trainerId: string
  - createdAt: timestamp
  - programUpdated: boolean
  - exercises: Exercise[]

invites/{inviteId}
  - clientId: string
  - trainerId: string
  - email: string
  - used: boolean
  - createdAt: timestamp
```

---

## New components in Phase 2

```
src/
  components/
    trainer/
      SessionHeader.tsx       // amber banner + end session button
      SessionModal.tsx        // end session modal with yes/no toggle
      SessionHistory.tsx      // side panel with past sessions list
  pages/
    Signup.tsx
    WorkoutSession.tsx
    ClientProgram.tsx
    ClientProgress.tsx        // placeholder
  hooks/
    useSessions.ts
```
