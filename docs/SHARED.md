# SHARED — Tech Stack, Firebase Config & Data Model

This file applies to all phases.

---

## Tech Stack

- **React + TypeScript** (Vite)
- **Tailwind CSS**
- **Firebase Auth + Firestore**
- **React Router v6**
- **Recharts** (Phase 3 only)

---

## Project Setup

```bash
npm create vite@latest tracklift -- --template react-ts
cd tracklift
npm install
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
npm install firebase react-router-dom recharts
```

---

## Firebase Config (`src/lib/firebase.ts`)

```ts
import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
  measurementId: process.env.VITE_FIREBASE_MEASUREMENT_ID,
}
// Keys live in .env — see .env.example

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)
```

---

## Auth & Roles

**How roles work:**
After login, check if the user's email exists in the `trainers` collection:
- Found → role = `trainer`, redirect to `/dashboard`
- Not found → role = `client`, redirect to `/my-program` (Phase 2)

**Phase 1:** Only trainer login exists. No client login yet.

---

## Full Data Model (all phases)

### Phase 1 collections (build now)

```
trainers/{trainerId}
  - name: string
  - email: string

clients/{clientId}
  - trainerId: string
  - name: string
  - email: string
  - daysPerWeek: number
  - deleted: boolean        // always false in Phase 1

programs/{programId}
  - clientId: string
  - trainerId: string
  - name: string            // e.g. "Strength Phase 1"
  - active: boolean         // true = current program
  - deleted: boolean        // always false in Phase 1
  - createdAt: timestamp

workouts/{workoutId}
  - programId: string
  - clientId: string
  - label: string           // "Workout A", "Workout B", etc.
  - order: number           // 0, 1, 2...
  - exercises: Exercise[]   // the live program — overwritten directly in Phase 1
  - updatedAt: timestamp
```

### Exercise type (embedded in workouts and sessions)

```ts
interface Exercise {
  muscleGroup: string        // free text, e.g. "Back"
  category: string           // free text, e.g. "Primary", "Secondary", "Isolation"
  advancedTechnique: string  // free text, e.g. "Super set", "Progression", ""
  name: string               // free text, e.g. "Pull up"
  sets: number | null        // can be empty/null
  reps: string               // string — supports "10", "45 sec", ""
  resistance: {
    type: 'kg' | 'band' | 'bodyweight'
    value?: number           // for kg only
    bandColor?: string       // "red" | "blue" | "green" | "black" | "purple"
    assisted?: boolean       // true = assisted (pull up), false = resistance band
  }
  notes: string              // free text
}
```

### Phase 2 additions (do not create in Phase 1)

```
workoutSessions/{sessionId}
  - workoutId: string
  - clientId: string
  - trainerId: string
  - createdAt: timestamp
  - programUpdated: boolean   // did Rachel choose "Yes" to update program?
  - exercises: Exercise[]     // full snapshot of what happened in the session

invites/{inviteId}
  - clientId: string
  - trainerId: string
  - email: string
  - used: boolean
  - createdAt: timestamp
```

### Phase 3 additions (do not create in Phase 1 or 2)

```
exerciseLibrary/{exerciseId}
  - name: string
  - muscleGroup: string
  - category: string
  - createdBy: 'system' | trainerId
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

---

## Resistance Display (read mode — used in all phases)

| Data | Display |
|------|---------|
| `{ type: "kg", value: 25 }` | `25 kg` |
| `{ type: "band", color: "red", assisted: true }` | `🔴 Red (assisted)` |
| `{ type: "band", color: "blue", assisted: false }` | `🔵 Blue (resistance)` |
| `{ type: "band", color: "green", assisted: true }` | `🟢 Green (assisted)` |
| `{ type: "band", color: "black", assisted: false }` | `⚫ Black (resistance)` |
| `{ type: "band", color: "purple", assisted: false }` | `🟣 Purple (resistance)` |
| `{ type: "bodyweight" }` | `Bodyweight` |
| empty / null | `—` |

---

## Notes UI Pattern (used in all phases)

**Read mode:**
- No note → faded "+" (non-interactive look, lighter color)
- Has note → active "+" (dark) → click expands a row below with note text → shows "−" to collapse

**Edit mode:**
- "+" → click opens inline text input below the row
- If note already exists → shows 📝 icon → click to expand/collapse the text input
