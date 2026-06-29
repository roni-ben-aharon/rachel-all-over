# Live Session — Deep Dive

**This is the hardest screen in the entire app.** It's referenced from `phase-2-sessions-clients/README.md` Screen 02. Read both.

If you find yourself behind schedule on Phase 2, it's almost certainly this screen. Budget accordingly.

## Why this screen is hard

It combines, in a single view:
1. **Editable table** with mixed input types (text, number, mono-number, color picker, textarea).
2. **Live timer** updating every second.
3. **Auto-save** with three visible states (saving / saved / offline-queued).
4. **Inline popovers** for band-color picker and note editor.
5. **Keyboard nav** across cells, including `⌘ S`, `⌘ Enter`, `Tab` cycling.
6. **PR detection** comparing each row to the prior session.
7. **Optimistic UI** — typing should feel instant, even when offline.
8. **Network failure recovery** — losing data here = trust catastrophe.
9. **Concurrent edit protection** (rare but real).

None of these are individually hard. Together they need a clear state machine and disciplined component boundaries.

---

## Component breakdown

Decompose into small, testable pieces:

```
<LiveSession>                          ← state owner
├── <SessionBanner>                    ← timer + status + actions
│   ├── <PulseDot>
│   ├── <Timer />                      ← uses requestAnimationFrame
│   ├── <OfflineChip />                ← conditional
│   └── <SessionActions />             ← Save draft / End session
│
├── <WorkoutTabs />                    ← Workout A/B selector
│   └── <PreviousSessionRef />         ← "Previous: Apr 21" + popover
│
├── <SessionTable>
│   ├── <SessionRow />                 ← repeated
│   │   ├── <ExerciseNameInput />      ← borderless input + PR badge slot
│   │   ├── <MuscleInput />            ← borderless input
│   │   ├── <NumericInput sets|reps />
│   │   ├── <ResistanceCell />         ← polymorphic: kg | band | bodyweight
│   │   │   └── <BandPickerPopover />  ← conditional
│   │   ├── <NoteCell />               ← collapsed chip OR add-button
│   │   │   └── <NotePopover />        ← conditional
│   │   └── <RowDeleteButton />        ← with inline confirm
│   └── <AddRowButton />               ← dashed + Add exercise
│
└── <AutoSaveFooter>                   ← status dot + timestamp + kbd hints
```

Each `<SessionRow>` is independently editable and saveable. Don't make the whole table one big form.

---

## State machine

The session is in one of these states at any time:

```
idle
  ↓ (load complete)
ready
  ↓ (user edits)
dirty
  ↓ (debounce 500ms or ⌘S)
saving
  ↓ (success) → ready
  ↓ (network fail) → offline-queued
  ↓ (server reject) → save-error

offline-queued
  ↓ (reconnect) → saving (replay queue)

save-error
  ↓ (user retry) → saving
  ↓ (continue editing) → dirty (preserves error toast)

ending
  ↓ (success) → ended (navigate away)
  ↓ (fail) → save-error
```

Implement this with a real state machine library (xstate) or a discriminated union in your state.

---

## Auto-save protocol

- **Debounce**: 500ms after the last keystroke.
- **Optimistic**: UI updates immediately on edit; save happens in the background.
- **Per-row**: each row saves independently. Don't lock the table during save.
- **Queue on failure**: failed saves go into an in-memory + localStorage queue, retry with exponential backoff (1s, 2s, 4s, 8s, max 30s).
- **Visible state**: footer dot color + text matches the state machine above.

### localStorage key shape
```
ra-session-{sessionId}-queue: [{ rowId, fieldKey, value, attemptCount, lastTriedAt }]
ra-session-{sessionId}-snapshot: { ...fullSessionState }  // for crash recovery
```

Clear keys on successful `ended` transition.

---

## PR detection

A "PR" (personal record) is detected per row, per session:

```
isPR(currentRow, previousRow) =
  resistance > previousResistance      // kg case: numeric
  OR bandHarder(current, previous)     // band case: order red < blue < green < black < purple
  OR (resistance == previousResistance AND reps > previousReps)
```

Render the `.pill.sage ↑ PR` chip below the exercise name when `isPR` is true.

**Edge cases:**
- Mixed resistance types (was kg, now band) → don't compare, no PR.
- Bodyweight → no PR ever (no measurable progression).
- First-ever session → no PR (nothing to compare).

---

## Keyboard map

| Key | Action |
|---|---|
| `Tab` | Move to next cell in row; at end of row, move to first cell of next row. |
| `Shift+Tab` | Reverse. |
| `Enter` | In a popover (band picker / note): confirm. In a row input: move down to same column of next row. |
| `Esc` | Close any open popover. From a focused row, deselect. |
| `⌘ S` | Force save now. |
| `⌘ Enter` | Open end-session confirmation. |
| `⌘ K` | (optional) Open exercise search/swap for the focused row. |
| `Delete` (on a focused row's `✕` button) | Trigger row delete with inline confirm. |

**Focus management**: when a row is added, focus jumps to its Exercise input. When a row is deleted, focus moves to the row above's Exercise input.

---

## Band picker popover

Triggered by clicking the band variant of `<ResistanceCell>`.

- 5×1 grid of 32×32 color swatches with hover/focus rings.
- Order matters (left to right = easier to harder): Red · Blue · Green · Black · Purple.
- Active band has a `--ink` 2px ring at -3px inset.
- Below the swatch row, a labeled chip: `{Color} band` (12px mono).
- Click a swatch → updates the row, closes the popover, returns focus to the cell.

Position: absolute, below the cell with a 6px gap. Use a portal so it escapes the table's overflow.

---

## Note popover

Triggered by clicking `+ note` or an existing note chip.

- 320px wide card, white bg, 14px radius, `--shadow-tooltip`.
- Textarea inside, 4 rows min, auto-expanding.
- Placeholder: `Add a note about this exercise (form cue, increase next time, etc.)`.
- Footer: char counter (right) + `Save` button. `Esc` cancels without saving.
- Existing notes show the textarea pre-filled with current value.

---

## Concurrent edit detection

Rare case: a second device (Rachel's iPad?) opens the same session.

- On open, write a `presence` field with deviceId + timestamp.
- Poll every 10s: if another device's timestamp is newer, show the concurrent-edit banner from `states.md`.
- "Refresh" reloads from server (you lose unsaved local changes — confirm before).
- "Keep editing" continues but flags that you're overriding.

This isn't critical for v1 — if you ship without it, just document the limitation.

---

## Performance budget

- Initial render: <300ms after data arrives.
- Keystroke → visible update: <16ms (don't re-render the whole table on every keystroke; row-level memoization).
- Auto-save: shouldn't block the UI thread. Debounce on idle.

Avoid:
- Re-rendering all rows when one row changes.
- Animating row inserts/deletes (jitters at 60 fps with a heavy table). Cross-fade only.
- Putting the entire session state in a single Redux/Zustand atom that all rows subscribe to. Use selectors.

---

## Testing checklist

Before calling Phase 2 done, verify:

- [ ] Edit a row → auto-save fires within 500ms of last keystroke.
- [ ] Kill network mid-edit → footer shows offline state, edit persists locally.
- [ ] Restore network → queue replays, footer returns to saved.
- [ ] Refresh page mid-session → resume from snapshot (no data loss).
- [ ] Tab through all cells in a row, then onto the next row.
- [ ] `⌘ S` saves immediately even without 500ms debounce wait.
- [ ] `⌘ Enter` opens end-session confirm.
- [ ] PR badge appears on a row where current > previous.
- [ ] PR badge doesn't appear on bodyweight or first-session rows.
- [ ] Band picker positions correctly and doesn't get clipped by the table.
- [ ] Delete row → focus moves to the row above, table re-renders smoothly.
- [ ] Timer keeps counting if the tab is backgrounded (use `performance.now()`, not `setInterval`).
- [ ] End session → toast appears, navigate to dashboard.

If you can check all twelve boxes, you've nailed it.
