# Phase 3 — States

Loading, empty, and error states. The happy path is in `README.md`.

## Screen 01 — Progress graphs

### Loading
- Header renders immediately (it's static).
- Chart area: skeleton placeholder — a single horizontal shimmer bar at the midline of the chart area, plus the axis labels in skeleton state (gray pill stand-ins).
- Stat strip: three colored cards with `—` for the big number and skeleton bars for label/sub.

### Empty — no sessions logged yet
- Replace the chart with a centered empty card:
  - Lavender icon square (40×40, `+` glyph).
  - Headline: `No data yet` (18px 500).
  - Sub: `Once you log a session, you'll see volume per exercise here.` (12.5px `--ink-3`).
  - CTA `.btn.primary`: `Start a session →` (trainer view) or `View my program` (client view).
- Stat strip cards each show `—` with sub `After your first session`.
- Time range tabs are disabled (.5 opacity).

### Empty — only 1 session logged (not enough to chart)
- Chart shows a single labeled point in the middle, but with a calm overlay:
  - Faint cream gradient at 60% opacity over the chart area.
  - Centered text: `Log one more session to see your progress curve.` (12.5px `--ink-2`).
- Stat strip is **enabled** and shows real values where possible (e.g. "Total volume" = the single session's total).

### Error — failed to load series
- Chart area replaced by error card:
  - `Couldn't load progress data.` (16px 500) + mono error code below.
  - `Retry` button.

---

## Screen 02 — CSV import

### Loading (parsing the file)
- Header renders with filename chip, but stats row reads `Parsing…` (in mono).
- Table area: 10 skeleton rows (no data yet).
- Buttons disabled.

### Empty — no rows after filtering "Show issues only"
- Render an inline card replacing the table body:
  - `All rows look good.` (14px 500 with sage dot prefix).
  - Sub: `Click "Show issues only" again to see the full file.`

### Error — CSV could not be parsed at all
- Replace the entire screen body with a calm error state:
  - `--surface-soft` bg fills the body area.
  - 36×36 `--danger` outlined square (1px dashed border, transparent fill) with `!` glyph.
  - Headline `Couldn't read this file.` (18px 500).
  - Sub (12.5px `--ink-3`): `Expected a CSV with columns: workout, exercise, sets, reps. Try downloading our template.`
  - Buttons: `Cancel import` + `Download template`.

### Validation — submitting with unresolved errors
- Inline confirm popover from the `Import program →` button:
  - `5 rows still have resistance issues. Import them as blanks and edit later?`
  - `Cancel` + `Import anyway →` actions.

### Error — server-side write failure mid-import
- Modal: `Some rows didn't save. {N} of {M} succeeded. Try again to import the failed rows?`
- Show which rows failed inline (red row highlights).

---

## Screen 03 — Exercise library combobox

### Loading (searching the library)
- Dropdown shows a single skeleton row (`--surface-sunken` shimmer) with `Searching…` (10px `--ink-4`).

### Empty — no matches
- Top strip reads `No matches` (10px uppercase `--ink-4`).
- Only the "Add … to library" affordance appears below — promoted, with a hover state and stronger color.

### Error — library service unavailable
- Top strip reads `Couldn't reach library.` in `--danger` 10px.
- Allow user to type freely — exercise is saved as freeform (not library-linked).
- Banner footer at bottom of dropdown: `Save what you have — we'll link it when the library is back.`

### Edit-mode banner state
- The header `.pill.sage` `Linked to library` becomes `.pill.amber` `Some not linked` if any row contains a freeform (unlinked) exercise. Clicking the pill scrolls to the first unlinked row.

---

## Screen 04 — Add to library modal

### Loading (submit)
- Primary CTA → `Adding…` + spinner. Form disabled.

### Validation
- Name required. If missed: 11px `--danger` under input, submit disabled.
- Name duplicate: inline 11px `--danger`: `An exercise with this name exists. Pick a different name or edit the existing one.` + small `View existing` link.

### Error
- Calm banner same pattern: `Couldn't save. Try again.` with `Retry`.

---

## Screen 05 — Exercise library page

### Loading
- Header renders immediately (it's static).
- Filter strip: render with skeleton count chips.
- Table: 7 skeleton rows.

### Empty — no exercises match filter/search
- Replace table body with centered empty state:
  - 36×36 sunken square with `⌕` glyph.
  - `No exercises match "{query}".` (14px 500).
  - Sub: `Try a different search or clear filters.` (12px `--ink-3`).
  - Buttons: `Clear search` + `Clear filters`.

### Empty — library never had any custom exercises (first-time)
- Less common since system seeds are always present, but if a fresh deploy has no library at all:
  - Centered state with `+ Add your first exercise` primary CTA.

### Error — failed to load
- Same calm error pattern as elsewhere.

---

## Cross-cutting

### Chart-specific gotchas (the live session edge cases for Phase 3)
- **Sparse data**: if some weeks have no sessions, draw the line with a dashed segment through the gap (3 3 dasharray) and reduce stroke opacity to .5 in that range.
- **Single exercise mode**: if only one legend pill is active, the area fill below the line becomes solid (.2 opacity gradient → 0). Helps the eye when no comparison is needed.
- **Y-axis auto-scaling**: round max to nearest 5k. Don't show below zero. If max volume is < 4k, scale ticks at 1k.

### Performance budgets for the library page
- Library is expected to grow to 500–1000 entries over time.
- Use virtualized list rendering if >100 rows visible.
- Search should be client-side fuzzy (debounce 100ms) — no server roundtrip per keystroke.
