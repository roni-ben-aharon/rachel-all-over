# Phase 3 — Power Features

The polish layer. Charts, bulk import, and an exercise library that auto-completes everywhere.

## Scope (5 screens)

1. **Progress graphs** — multi-line chart with hover tooltip
2. **CSV import** — preview before commit, with row-level error states
3. **Exercise library combobox** — autocomplete + "create new" in edit mode
4. **Add to library (modal)** — quick form to register a new exercise
5. **Exercise library page** — manage the whole library

> Open `../preview/RachelAllOver Screens.html` and click **Phase 3** tab.

---

## Screen 01 — Progress graphs

**Route:** `/clients/:id/progress` (trainer) or `/me/progress` (client).
**Purpose:** Show total volume (sets × reps × weight) per exercise over time. Multi-line chart, filterable by exercise.

### Layout
- **Header** (24px 28px 8px, border-bottom `--line-soft`):
  - Left: `.t-label` "Progress", then headline `Volume over time — Roey` (26px weight 500, "— Roey" in `.serif` `--ink-3` at 28px). Sub: `sets × reps × weight · 6 week window` (12.5px `--ink-3`).
  - Right: sunken tab pill group (`--surface-sunken` bg, 10px radius, 4px padding): `4w / 6w / 3m / All`. Selected = `.btn.sm.primary`, others transparent.
- **Legend / filter row** (18px 28px 12px, wrap, 8px gap):
  - Each exercise = a colored pill (sage, rose, lavender, amber, ghost…). 8px swatch + name. Inactive (toggled off) = .45 opacity + line-through.
  - Right-aligned helper: `click to toggle` (11px `--ink-4`).
- **Chart area** (8px 28px 24px):
  - 260px tall card, `--surface-soft → --surface` linear gradient bg, 14px radius, 1px `--line-soft` border, overflow hidden.
  - **Y-axis labels** at 14px from left (10px mono `--ink-4`, every 46px vertically): `20k / 16k / 12k / 8k / 4k`.
  - **X-axis labels** at the bottom (10px mono `--ink-4`): `W14 / W15 / W16 / W17 / W18 / W19`.
  - **Grid lines** at the same 46px intervals (1px `--line-soft`, between 48px left and 24px right insets).
  - **Lines (SVG)** drawn at 600×240 viewBox, `preserveAspectRatio="none"`, positioned at left 48px / top 20px / right 24px / height 200px:
    - Each line: 2.5px stroke, `stroke-linecap="round"`, `stroke-linejoin="round"`, no fill.
    - The actively-hovered exercise also gets a subtle area fill below it: linear gradient from stroke color at .2 opacity to fully transparent.
    - Colors: Deadlift `#7E9A55` · Squat `#B27466` · Pull up `#7969B8` · Bench press `#C9A24D` · Face pulls/Plank reserved for `--ink-4` if needed.
  - **Hover state**:
    - Vertical dashed guide line at the hovered week (0.5px `--ink` stroke, dasharray `3 3`, .35 opacity).
    - On each visible line at that x position: a 3px filled dot + a 6px translucent halo (.18 opacity) in the same color.
- **Tooltip** (positioned over the chart, near the active week, top:18px):
  - 228px wide card, white bg, 10px radius, `--shadow-tooltip`.
  - **Header** (10px 12px 8px, `--surface-soft` bg, border-bottom `--line-soft`): big label `Week 17` (13px 600), then `Apr 22 — Apr 28` (10px mono `--ink-4`). Right: `.pill.sage` `2 sessions` (9.5px).
  - **Body** (8px 12px, 6px gap), one row per visible exercise:
    - 7×7 color dot + name (11.5px, flex:1) + volume (11.5px mono 500) + delta (10px mono, min-width 32px right-aligned). Delta in `--success` with `↑` for up, `--danger` with `↓` for down, `--ink-4` em-dash for flat.
  - **Footer** (7px 12px, `--surface-soft`, border-top `--line-soft`): `TOTAL` label (10px uppercase) + total in 12px mono 600.
- **Stat strip** (0 28px 24px, 3-col grid, 12px gap):
  - Three big colored stat cards. 18px 20px padding, 14px radius.
  - Header row: 10.5px uppercase label (.75 opacity) + optional icon (★, ↑) at .6 opacity.
  - Big number: 30px weight 500 -0.025em.
  - Sub: 11.5px .7 opacity.
  - Examples: `Total volume / +65% / since Mar 24` (sage), `Sessions / 12 / last 6 weeks` (lavender), `Best exercise / Deadlift / +112% volume` (amber, ★).

### Behavior
- Click a legend pill → toggle that exercise's line on/off.
- Drag-select or click a week on the x-axis → tooltip pins to that week.
- Time range buttons (`4w`, `6w`, `3m`, `All`) refetch + rescale.
- On exit, tooltip fades out; on hover, snaps to the nearest week.

### Implementation hint
Use a charting lib that supports custom tooltip rendering (Recharts, visx, or a hand-rolled SVG layer). Hand-rolled is fine since there are at most 6 lines × ~26 weekly points = trivial data.

---

## Screen 02 — CSV import (preview)

**Route:** `/clients/:id/import` (multi-step; this is the preview step).
**Purpose:** Show a parsed CSV with errors flagged inline. User commits or cancels.

### Layout
- **Header** (20px 28px, border-bottom `--line-soft`):
  - Left: `.t-label` "Import preview" + headline row with the filename in a mono chip: `$ROEY.csv` (14px mono `--ink-3`, `--surface-sunken` bg, 4px 10px padding, 6px radius, 1px `--line` border).
  - Stats row below: `11 exercises · 2 workouts · 5 need attention` (last segment in `--danger`).
  - Right: `Cancel` + `Import program →` (primary).
- **Issue banner** (Roni's request — toned down):
  - 12px 28px, `--surface-soft` bg, border-bottom `--line-soft`, `--ink-2` text.
  - Tiny 6×6 `--danger` dot · message: `5 rows need a resistance value — click any to set, or import as-is.` (12px, with "5 rows" in mono `--ink`) · right-aligned `Show issues only` button (11px `.btn.sm`).
  - **No** red background, **no** big `!` glyph. Calm.
- **Table** (no card border, edge-to-edge):
  - Columns (widths): Workout (10%) · Muscle (13%) · Category (11%) · Exercise (22%) · Sets (6%, center) · Reps (7%, center) · Resistance (18%) · Note (8%, center).
  - Workout cell only renders the value on the first row of that workout (Workout A appears at row 1, blank for subsequent A rows). 600 weight when present.
  - Error rows: error chip in Resistance column reads the raw unparsed string, e.g. `green/red band`, `10/25 kg`, `box24`, `#4`.
    - Chip style: transparent bg, 1px dashed `--danger` border, 6px radius, 4px 9px, 11.5px mono, `--danger` color, `→` at .5 opacity at the end (signals "click to resolve"). Row hover does not change.

### Behavior
- Click an error chip → open a popover/input with options (kg / band / bodyweight) to set this row's resistance. Saves locally to the import session, doesn't touch the database.
- `Show issues only` toggles a filter that hides rows with valid resistance.
- `Import program →` writes to the DB:
  - Creates workouts in order they appear.
  - Each exercise links to library by exact name match; if no match, creates a new library entry (or prompts via Screen 04 — confirm policy with product).
- `Cancel` → discard import session, back to dashboard.

### CSV format assumed
| Column | Required | Notes |
|---|---|---|
| `workout` | yes | Workout name (A, B, C…) or label. |
| `muscle` | yes | Free text; auto-matches if exists. |
| `category` | no | Primary / Secondary / Isolation / etc. |
| `exercise` | yes | Free text. |
| `sets` | yes | Integer. |
| `reps` | yes | Integer or time string ("45s"). |
| `resistance` | no | Free text — parser tries `N kg`, `<color> band`, `Bodyweight`. Unparseable → error chip. |
| `note` | no | Free text. |

---

## Screen 03 — Exercise library combobox

**Route:** `/clients/:id/edit` (program edit mode).
**Purpose:** As the trainer types an exercise name, autocomplete against the library. Auto-fill muscle/category/resistance type when a match is selected. If no match, offer to create new.

### Layout
- **Header strip** (16px 28px, `--surface-soft`, border-bottom `--line-soft`):
  - Letter square + workout name + `.pill.sage` `Linked to library` indicator.
  - Right: `Cancel` + `Save` (primary).
- **Table** with `overflow: visible` (so dropdown can escape).
  - Columns: Muscle (13%) · Category (12%) · Technique (11%) · Exercise (24%) · Sets (7%) · Reps (7%) · Resistance (18%) · `✕` (8%).
  - **Auto-filled cells** when an exercise is library-linked: use a lavender treatment to signal "this came from the library":
    - bg `#E5E9F6`, color `--lavender-ink`, 1px `#C8C5E4` border, 7px radius, 6px 9px padding.
    - Leading 5×5 `●` glyph at .5 opacity.
    - Still editable — clicking enters edit mode and reverts the cell to a normal `.input`.
  - **Active combobox cell** (the Exercise input being edited):
    - Border `--ink`, box-shadow `0 0 0 3px rgba(21,19,15,.08)` on the input.
    - Dropdown below: `position: absolute; top: calc(100% + 6px); z-index: 100; right: -40px;` (overflows the column slightly for readability).
    - Dropdown card: 10px radius, 1px `--line` border, `--shadow-tooltip`.
- **Dropdown content**:
  - Top strip (8px 14px 6px, `--surface-soft`, border-bottom `--line-soft`): left = `2 matches` (10px uppercase `--ink-4`), right = `↑↓ navigate · ↵ select` with kbd chips.
  - First match (highlighted): `--surface-sunken` bg, 2px `--ink` left border, 11px 14px padding. Row contents: exercise name (13px 500) + `.pill.sage` `In library` (9.5px) on the right. Meta below: `Chest · Primary · kg` (11px `--ink-3`, mono for "kg").
  - Subsequent matches: 11px 14px padding, no special styling.
  - **"Add … to library"** affordance at the bottom (border-top `--line-soft`, `--surface-soft` bg, 11px 14px, 10px gap):
    - 22×22 lavender square with `+`.
    - `Add "Db inc" to library` (12.5px 500, "Db inc" in mono).
    - Sub: `Save as a new exercise` (11px `--ink-3`).
- **Footer hint** (14px 28px, border-top `--line-soft`, `--surface-soft`):
  - Left: a 12×12 lavender swatch + caption `Lavender fields are auto-filled from the library — still editable` (11px `--ink-3`).
  - Right: `+ Add exercise` (`.btn.sm` dashed border).

### Behavior
- Keyboard:
  - `↑` / `↓` cycles the highlighted option.
  - `Enter` selects highlighted → auto-fills muscle, category, resistance type into adjacent cells; preserves any value the trainer already typed there.
  - `Tab` moves to the next cell (Sets).
  - `Esc` closes dropdown without selecting.
- "Add to library" option:
  - If the typed text matches no library entry, this is always the last item.
  - Clicking opens **Screen 04 (Add to library modal)** pre-filled with the typed name.
- `Linked to library` pill flips to `.pill.amber` `Not linked` if a row's exercise field is freeform (no library entry selected).

---

## Screen 04 — Add to library (modal)

**Route:** triggered from combobox or library page.
**Purpose:** Quick form to register a new exercise so it autocompletes next time.

### Layout
- Modal: 420px wide, 18px radius, `--shadow-modal`.
- **Header** (22px 24px 18px):
  - 30×30 lavender icon square with `+`.
  - `.t-label` `New exercise`.
  - Headline: 20px weight 500, "exercise library" in `.serif` 23px: `Add to exercise library`.
  - Sub: 12.5px `--ink-3` with the failing name in a mono chip: `"Box climb" wasn't found. Add it now so it autocompletes next time.`
- **Body** (0 24px 18px, 12px gap):
  - Name input (pre-filled with the typed text).
  - Muscle group + Category in a 2-col row.
  - **Default resistance** picker: 3-col grid of `.btn`, selected = `.primary`. Options: `kg / Band / Bodyweight`.
- **Footer** (14px 24px, `--surface-soft`, border-top `--line-soft`):
  - Right: `Skip` + `Add to library →` (primary).

### Behavior
- Create library entry on submit. Return control to whatever opened this (usually the combobox); auto-select the new entry in that row.
- `Skip` → close modal, leave the exercise as freeform (not library-linked).

---

## Screen 05 — Exercise library page

**Route:** `/library`.
**Purpose:** Manage the global + per-trainer library.

### Layout
- **Header** (20px 28px, border-bottom `--line-soft`):
  - `.t-label` "Library" + headline `Exercise library` (22px 500, "library" in `.serif` 25px) + sub `107 exercises · 14 added by you` (11.5px mono `--ink-3`).
  - Right: search input (240px wide, with `⌕` at left 11px, `⌘ K` kbd at right 10px) + `+ Add exercise` primary.
- **Category filter strip** (14px 28px, `--surface-soft`, border-bottom `--line-soft`):
  - `.btn.sm` row: `All / Back / Chest / Legs / Shoulders / Arms / Core / Cardio` — each shows a count chip (10px mono, opacity .5 normally, .65 on selected).
  - Selected = inverted (`--ink` bg, white text).
  - Right-aligned: `Sort by name ↓` (11px `--ink-3`, "name ↓" in mono `--ink`).
- **Table**:
  - Columns: Exercise (32%) · Muscle group (18%) · Category (14%) · Resistance (14%) · Added by (14%) · row-action (8%, right).
  - Custom exercises (`added by Rachel`) get a `.pill.lavender` `Custom` (9.5px) next to the name.
  - Resistance shown as a mono `.resist-chip`.
  - Added-by shown in mono small (`System` or trainer name).
  - Row action: `✎` icon button, `.btn.icon.ghost`, `--ink-3`. Click → opens **Screen 04 modal** in edit mode.
- **Pagination footer** (14px 28px, border-top `--line-soft`):
  - Left: `Showing 7 of 107 exercises` (11.5px `--ink-3`, "7 of 107" in mono `--ink`).
  - Right: `← Prev` + `Next →` (`.btn.sm`). Prev disabled (.5 opacity) on first page.

### Behavior
- Search: instant filter as the trainer types. `⌘ K` focuses the search input from anywhere on the page.
- Filter strip: click a category to filter to it; click again or click `All` to clear.
- Sort: clickable header — current implementation only sorts by name. Cycle ascending/descending on click.
- `+ Add exercise` opens Screen 04 modal in create mode.
- Edit `✎` opens Screen 04 in edit mode (pre-filled).
- Deleting a library exercise: not in this design — confirm with product whether to add (likely yes, with a "is in use by N programs" check).

---

## Components introduced in this phase

| Component | Used in | Spec |
|---|---|---|
| **Multi-line chart** | Progress | SVG lines with stroke colors per exercise; hover state = dashed guide + dual-radius dots. |
| **Chart tooltip** | Progress | Card with header + per-line delta row + total footer. |
| **Big stat card** | Progress | 30px headline, full-saturation accent fill, optional icon glyph. |
| **Calm error banner** | CSV import | Sunken bg with single dot + mono count — replaces previous loud red banner. |
| **Error chip (inline)** | CSV import | Dashed-danger chip with raw text + `→` arrow. |
| **Combobox dropdown** | Library combobox | Card with top hint strip, highlighted active row with left ink border, "add new" footer affordance. |
| **Library-linked cell** | Library combobox | Lavender-filled cell as a visual marker for "auto-filled from library". |
| **Category filter pill row** | Library page | `.btn.sm` row, selected = inverted ink. Each pill carries a count. |
| **Search input with kbd hint** | Library page | Input with `⌕` prefix + `⌘ K` kbd suffix inside. |

## State / data needed (Phase 3)

- **Per-client volume series**: `[{exerciseId, week, volume}]` — derived from saved sessions.
- **Exercise library**: `[{id, name, muscle, category, defaultResistanceType, addedBy: 'system' | trainerId}]`.
- **Pending CSV import**: parsed rows in a temp session with per-row validity flags.
- **Edit-mode program** (working copy, distinct from the persisted program).
- **Search index** for the library (client-side fuzzy match is fine for <500 entries).

## Out of scope for Phase 3

- Per-client custom library (everything is global).
- Sharing libraries between trainers.
- Bulk-edit / multi-select in the library page.
- Exporting a library to CSV (only import is in scope).
