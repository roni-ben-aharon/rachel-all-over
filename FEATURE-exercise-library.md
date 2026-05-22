# Exercise Library — Feature Definition

This is a Phase 3 feature. Do not build until Phase 2 is complete and approved.

**Visual reference:** `screens-phase3.html` — see "Exercise library" section.

---

## What it is

A searchable bank of exercises that Rachel can draw from when building programs or running sessions. Pre-seeded from her existing client data. Grows automatically as she adds new exercises.

---

## Data model

```
exerciseLibrary/{exerciseId}
  - name: string               // "Db incline bench press"
  - muscleGroup: string        // "Chest"
  - category: string           // "Primary" | "Secondary" | "Isolation" | "General"
  - defaultResistanceType: 'kg' | 'band' | 'bodyweight'
  - createdBy: 'system' | trainerId
  - createdAt: timestamp
```

Pre-seed by running `seed.ts` once after project setup. This populates 107 exercises from `exercises.json`.

---

## Feature 1 — Combobox in edit program + session

Replace the plain text input for the Exercise field with a combobox.

### Behavior

1. Rachel clicks the Exercise cell → input activates with a search placeholder
2. She starts typing → dropdown appears showing matching exercises from `exerciseLibrary`
3. Each dropdown result shows:
   - Exercise name (13px, font-weight 500)
   - Subtitle: `{Muscle group} · {Category} · {Resistance type}` (11px, muted)
   - First result is highlighted (active state)
4. She selects a result:
   - Exercise name fills in
   - Muscle group field auto-fills → turns blue (background: `var(--color-background-info)`, color: `var(--color-text-info)`, border: `var(--color-border-info)`)
   - Category field auto-fills → also turns blue
   - Blue = "filled from library, editable if needed"
5. She types something not in the library → "Add to library" option appears at the bottom of the dropdown:
   - Icon: `ti-plus` in info color
   - Title: `Add "{typed text}" to library` (info color, font-weight 500)
   - Subtitle: "Save as a new exercise" (muted)
6. She clicks "Add to library" → opens the Add to Library modal (see Feature 2)
7. She can also just press Enter or click away to use free text without saving to library

### Dropdown UI

```
┌────────────────────────────────┐
│ Db incline bench press         │  ← highlighted (background-secondary)
│ Chest · Primary · kg           │
├────────────────────────────────┤
│ Db incline fly                 │
│ Chest · Isolation · kg         │
├────────────────────────────────┤
│ + Add "Db inc" to library      │  ← info color
│   Save as a new exercise       │  ← muted subtitle
└────────────────────────────────┘
```

- Border: 0.5px solid `var(--color-border-secondary)`
- Border radius: `var(--border-radius-md)`
- Each result: 10px 12px padding
- Dividers: 0.5px solid `var(--color-border-tertiary)`
- Max 5 results shown, scrollable if more

### Auto-fill behavior

When an exercise is selected from the library:
- `muscleGroup` → auto-fills, field turns blue
- `category` → auto-fills, field turns blue
- `resistance.type` → auto-fills the resistance type selector (but does NOT turn blue — resistance value is always manual)
- Blue fields are still editable — Rachel can override them

---

## Feature 2 — Add to Library modal

Triggered when Rachel clicks "Add to library" from the combobox dropdown.

### Layout (modal, centered, 320px wide)

```
Add to exercise library
"Box climb" wasn't found — add it?

Name:           [Box climb        ]
Muscle group:   [              ]    Category: [           ]
Default type:   [ kg ] [ Band ] [ Bodyweight ]

                          [Skip]  [Add to library]
```

### Fields

- **Name** — pre-filled with what Rachel typed, editable
- **Muscle group** — free text, empty
- **Category** — free text, empty
- **Default resistance type** — pill button selector: kg / Band / Bodyweight

### Buttons

- **Skip** — closes modal, uses the exercise as free text without saving to library. Exercise name is kept in the row.
- **Add to library** — saves to `exerciseLibrary` collection with `createdBy: trainerId`, closes modal, exercise is now in the library for future use

---

## Feature 3 — Library management page (`/library`)

Accessible only to trainers. Link in the sidebar or "···" menu (TBD).

### Layout

- Header: "Exercise library" title + total count + search input + "+ Add exercise" button
- Filter pills: All | Back | Chest | Legs | Shoulders | Core | ... (all unique muscle groups)
- Table:

| Exercise | Muscle group | Category | Resistance | (edit) |
|----------|-------------|----------|------------|--------|

- Edit icon per row → inline editing of name, muscle group, category, resistance type
- No delete — exercises can't be deleted (would break history references)
- "+ Add exercise" → same modal as Feature 2 but without the "Skip" option

### Pagination / filtering

- Filter by muscle group pill → filters table
- Search input → filters by exercise name
- Show 20 per page, pagination at bottom

---

## Build order

1. Seed the library (`npm run seed` or `npx ts-node seed.ts`)
2. Build the combobox component (`ExerciseCombobox.tsx`)
3. Wire combobox into `WorkoutTableEdit.tsx` and `WorkoutSession.tsx`
4. Build the "Add to library" modal (`AddToLibraryModal.tsx`)
5. Build the library management page (`/library`)

---

## Components

```
src/
  components/
    library/
      ExerciseCombobox.tsx      // searchable input + dropdown
      AddToLibraryModal.tsx     // modal for adding new exercises
      LibraryTable.tsx          // management page table
  pages/
    Library.tsx                 // /library page
  hooks/
    useExerciseLibrary.ts       // search, add, fetch exercises
```

---

## ⚠️ Open questions (decide before building)

1. Where does the `/library` link live — sidebar or "···" menu on dashboard?
2. Should Rachel be able to edit exercise names after they've been used in sessions? (Risk: breaks display consistency in session history)
