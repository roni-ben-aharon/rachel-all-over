# PHASE 3 — Future Features

**Do not build Phase 3 until Phase 2 is complete and approved.**

**Visual reference:** `screens-phase3.html`

---

## Features

### 1. Progress graphs

On client view (`/my-progress`) and trainer dashboard side panel:

- Single multi-line Recharts LineChart
- One line per exercise, colored
- Toggle buttons (pills) to show/hide each exercise line
- X axis: session dates
- Y axis: volume (sets × reps × weight)
- Hover tooltip: "{Exercise}: {sets} sets × {reps} reps × {weight}"
- 3 summary cards below chart: total volume % change / sessions logged / best exercise

**Volume calculation:**
```ts
function calculateVolume(exercise: Exercise): number {
  if (exercise.resistance.type === 'kg') {
    return exercise.sets * parseFloat(exercise.reps) * (exercise.resistance.value || 0)
  }
  if (exercise.resistance.type === 'band') {
    const bandScale = { red: 1, blue: 2, green: 3, black: 4, purple: 5 }
    return exercise.sets * parseFloat(exercise.reps) * (bandScale[exercise.resistance.bandColor] || 1)
  }
  if (exercise.resistance.type === 'bodyweight') {
    return exercise.sets * parseFloat(exercise.reps)
  }
  return 0
}
```

### 2. CSV import

Triggered from Add Client modal ("Import from CSV" button — currently disabled).

3-step flow:
1. **Upload** — drag & drop or browse. Accepts .csv or .xlsx (one sheet at a time)
2. **Preview** — parsed table with columns: Workout | Muscle group | Category | Technique | Exercise | Sets | Reps | Resistance | Notes
3. **Confirm** — "Import program" button → saves to Firestore

**Parsing rules:**
- `"25 kg"` → `{ type: "kg", value: 25 }`
- `"red band"` → `{ type: "band", color: "red" }`
- `"-"`, `"bodyweight"` → `{ type: "bodyweight" }`
- Anything unparseable → resistance left blank, original value moved to notes as `"Resistance: {value}"`
- Missing sets/reps → imported as blank, no error
- Empty Program cells → inherit from row above (superset pattern)
- Program column values (FBW 1, FBW 2...) → map to Workout A, Workout B

**Error display in preview:**
- Unparseable resistance → "—" in red in Resistance column
- Notes column → collapsed by default, "+" to expand. Red "+" if error note
- Expanded error note shows: "Resistance: {original value}" in red

### 3. Exercise library

Pre-seed from `exercises.json` (107 exercises from Rachel's data). Run `seed.ts` once.

In edit mode, exercise name input becomes a combobox:
- Type to search existing exercises in library
- Select → muscle group + category auto-fill
- Type something not in list → accepted as free text, added to library

### 4. Multiple trainers

- Each trainer only sees their own clients
- Trainers collection can have multiple docs
- No trainer management UI needed — trainers are added manually to Firestore

### 5. Soft delete

- Clients and programs: `deleted: boolean` field already in data model
- Soft delete instead of hard delete
- Deleted clients not shown in sidebar (but data preserved)

### 6. Sets per week summary

Side table per client showing:
- Muscle group | Sets per week (calculated from program) | Goal (free text)
