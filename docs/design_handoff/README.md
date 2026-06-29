# RachelAllOver — Design Handoff

A workout-tracking web app for personal trainer Rachel and her clients. This bundle hands off the visual redesign of every screen, split into three phases that can each be shipped independently.

## ⚠️ About these files

The HTML files in `preview/` are **design references**, not production code. They were authored as static prototypes to lock down the look and feel.

Your job: **recreate these designs in the existing RachelAllOver codebase** (React + Firebase, per the project spec), reusing its component patterns and styling conventions. Match the visual language defined in `design-system.css` and the per-screen specs in each phase's README.

If a question arises ("how should this behave on hover?", "what happens on validation error?"), the prototypes are the source of truth for **visuals**; the per-phase README is the source of truth for **behavior, copy, and states**.

## Fidelity

**High-fidelity.** Colors, typography, spacing, radius, and shadow values are final. Use the exact hex values, font stacks, and pixel measurements in `design-system.css`. Behaviour and interaction notes are in each phase README.

## File map

```
design_handoff/
├── README.md                              ← you are here
├── BLOCKERS.md                            ← open product Qs gating each phase — read first
├── design-system.css                      ← tokens + utility classes (the bible)
├── preview/
│   ├── RachelAllOver Screens.html         ← open this in a browser to see all screens
│   ├── phase1.js
│   ├── phase2.js
│   └── phase3.js
├── phase-1-trainer-tool/
│   ├── README.md                          ← sign in, dashboard, add client, blank template
│   └── states.md                          ← loading, empty, error states
├── phase-2-sessions-clients/
│   ├── README.md                          ← sign up, live session, client view
│   ├── states.md                          ← loading, empty, error states
│   └── live-session-deep-dive.md          ← the hard screen — read before estimating
└── phase-3-power-features/
    ├── README.md                          ← progress graphs, CSV import, library
    └── states.md                          ← loading, empty, error states
```

## Read order

1. **`BLOCKERS.md`** — confirm the decisions gating your target phase.
2. **`README.md`** (this file) — design system + footguns below.
3. **Your phase's `README.md`** — per-screen specs.
4. **Your phase's `states.md`** — loading, empty, error.
5. **(Phase 2 only)** `live-session-deep-dive.md` — the state machine for the hardest screen.

## Suggested implementation order

1. **Set up tokens.** Port `design-system.css` into your codebase as CSS variables (or Tailwind theme extension, depending on stack). Wire up the two Google Fonts.
2. **Build shared atoms first** — see "Shared components" below. These are reused across all three phases. Getting them right once pays off everywhere.
3. **Phase 1** — the foundation. Sign in, trainer dashboard, add-client modal, blank-template state.
4. **Phase 2** — live session logger (the most interactive screen) + invite signup + client view.
5. **Phase 3** — progress chart, CSV import, exercise-library combobox + management page.

## Design philosophy (so you know what to optimize for)

- **Calm, editorial, trustworthy.** Rachel uses this every day; it shouldn't feel like a "fitness app." Avoid gradients, avoid emoji, avoid bright primary colors as defaults.
- **Numbers are content.** Reps, weight, dates, durations — everything numeric uses Geist Mono with tabular figures. This is how trainers scan a program quickly.
- **Color is semantic.** Sage = success / active client. Amber = in-progress / warning. Lavender = informational / library-linked. Rose = error / destructive. Never decorative.
- **The serif italic accent is intentional.** Used once per major heading to add personality to otherwise dense data screens. Don't sprinkle it.

## Design system summary

### Color tokens (see `design-system.css` for the full set)

| Token | Hex | Usage |
|---|---|---|
| `--bg` | `#F1EDE4` | Page background (warm cream) |
| `--bg-2` | `#E8E3D7` | Secondary background (modal scrim) |
| `--surface` | `#FFFFFF` | Cards, inputs |
| `--surface-soft` | `#FBFAF6` | Subtle surface lift (table headers, footers) |
| `--surface-sunken` | `#F4F1EA` | Inset elements (kbd, resist chips) |
| `--ink` | `#15130F` | Primary text, primary button bg |
| `--ink-2` | `#3A362E` | Strong secondary text |
| `--ink-3` | `#6E685C` | Body secondary text |
| `--ink-4` | `#9B9486` | Tertiary text, placeholders |
| `--line` | `#E5DFD2` | Default borders |
| `--line-soft` | `#EFEBE0` | Internal dividers (table rows) |
| `--sage` / `--sage-ink` | `#CBD7B5` / `#2C3B1E` | Active, success, "in library" |
| `--amber` / `--amber-ink` | `#F3D58F` / `#5B4317` | Live session, warning, pending invite |
| `--lavender` / `--lavender-ink` | `#C8C5E4` / `#312E66` | Info, library-linked cells, custom items |
| `--rose` / `--rose-ink` | `#E8C5BD` / `#5B2A1F` | Soft error chips |
| `--danger` | `#C2410C` | Destructive (delete icons, error text) |
| `--success` | `#4F7A3A` | Positive deltas, "passwords match" |

### Typography

- **Geist** (`300 / 400 / 500 / 600 / 700`) — UI, body, headlines. `font-feature-settings: "ss01","ss02","cv11"`.
- **Geist Mono** (`400 / 500 / 600`) — numerals, dates, IDs, kbd. `font-feature-settings: "tnum","zero"`.
- **Newsreader** italic (`400 / 500`, optical size variable) — single-word editorial accents inside headings (`<span class="serif">`).

Type scale used:
- Display: 30–34px, weight 500, letter-spacing -0.025em, line-height 1.05
- H3: 18–22px, weight 500–600, letter-spacing -0.015em
- Body: 13px, weight 400, line-height 1.55
- Small: 11.5–12px, weight 400
- Label: 10.5px, weight 500, uppercase, letter-spacing 0.1em
- Mono: tabular numerals everywhere data lives

### Radius

| Token | px | Usage |
|---|---|---|
| `--r-xl` | 18 | Screen frames, modals |
| `--r-lg` | 14 | Cards, workout containers |
| `--r-md` | 10 | Buttons (large), pills |
| `--r-sm` | 6 | Resist chips, kbd, small inputs |

### Shadow

- Surface lift: `0 1px 0 rgba(21,19,15,.04), 0 12px 32px -16px rgba(21,19,15,.12)`
- Modal: `0 24px 60px -20px rgba(21,19,15,.25), 0 2px 0 rgba(21,19,15,.04)`
- Tooltip / dropdown: `0 16px 40px -8px rgba(21,19,15,.18), 0 2px 0 rgba(21,19,15,.04)`

### Spacing rhythm

Padding inside cards / screens: **18–28px** horizontal, **14–24px** vertical. Gap between stacked cards: **14–16px**. Avoid going below 12px between major regions.

## Shared components

These appear in every phase. Build them as primitives in your component library.

### `Button` (`.btn`)
- Default: 8px 14px, 12px Geist 500, white bg, 1px `--line` border, 8px radius. Hover: bg `--surface-sunken`, border `--ink-4`.
- `.primary` — `--ink` bg, white text, no border. Hover: pure black.
- `.amber` — `--amber-ink` bg, white text (used for "End session →").
- `.ghost` — transparent, no border, `--ink-3` text.
- `.sm` — 11.5px, 6px 12px, 7px radius.
- `.icon` — 30×30 square, centered icon.

### `Pill` (`.pill`)
4px 9px, 10.5px Geist 500, 999px radius. Variants follow the color tokens: `.sage`, `.amber`, `.lavender`, `.rose`, `.ghost`. A leading dot (6×6, currentColor, opacity .7) is optional.

### `Input` (`.input`)
13px Geist 400, 9px 12px padding, 1px `--line` border, 8px radius, white bg.
Focus: border `--ink`, box-shadow `0 0 0 3px rgba(21,19,15,.06)`.
Disabled: bg `--surface-sunken`, color `--ink-3`.

### `Avatar`
Circle, sized 26–44px. Uppercase initial. Background uses one of the four accent fills (sage / amber / lavender / rose) with the matching `*-ink` color. **Inactive** clients in the sidebar use `--surface` bg + `--line` border + `--ink-3` text.

### Workout table (`table.workout`)
The most important shared component — used in 6+ screens.
- Container: white card, 1px `--line` border, 14px radius, overflow hidden.
- Header strip: `--surface-soft` bg, 13.5px 600 title, optional badge pill, "View" button on right.
- Table head: 10.5px label, uppercase, `--ink-3`, 10px 18px padding.
- Table body rows: 13px 18px padding, 1px `--line-soft` bottom border, last row no border. Row hover: `--surface-soft`.
- Numeric cells (sets, reps): Geist Mono, `--ink-2`, tabular figures.
- Exercise name: 12.5px, weight 500.
- Muscle group / category: 12px, `--ink-3`.

### Resist chip (`.resist-chip`)
Inline 3px 9px, 6px radius, `--surface-sunken` bg, 11.5px Geist Mono. For bands: prepend an 8×8 colored dot (`Red:#C2410C`, `Blue:#3B82F6`, `Green:#4F7A3A`, `Black:#15130F`, `Purple:#7C5BD0`). For bodyweight: transparent bg, dashed 1px border.

### Note button (`.note-btn`)
22×22, 6px radius.
- `.active` — `--ink` bg, white "lines" glyph (3 horizontal lines, decreasing widths). Indicates the exercise has a saved note.
- `.empty` — transparent, 1px dashed border, "+" icon. Indicates "click to add a note."

### Keyboard chip (`.kbd`)
10px Geist Mono, `--surface-sunken` bg, 1px `--line` border, 4px radius, 2px 6px padding. Use for `⌘ K`, `⌘ S`, `↵`, etc.

## Brand mark

A 42×42 dark square (`--ink`), 12px radius, with a hairline inner border square at inset 6px and a single 18×2px horizontal bar centered inside. Don't redraw it as an icon — keep this minimal geometric mark.

## Known footguns

Real things that will trip you up. Read these before you start.

### 1. Combobox dropdown needs `overflow: visible` on the table
The exercise library combobox (Phase 3, Screen 03) renders its dropdown as an absolute-positioned child of a `<td>`. If the table or any ancestor has `overflow: hidden` / `overflow: auto`, the dropdown gets clipped. Either:
- Set `overflow: visible` on the table container, OR
- Render the dropdown into a portal (`document.body`) and position it manually.

Portal approach is more robust if your table virtualizes.

### 2. The live session screen is roughly 3× the build effort of any other screen
It looks like one screen but it's ~6 interactive primitives stacked: editable table, live timer, auto-save with three visible states, band-color popover, note popover, keyboard nav, PR detection, offline queue. **Read `phase-2-sessions-clients/live-session-deep-dive.md` before estimating Phase 2.**

### 3. Numeric inputs need `font-variant-numeric: tabular-nums`
Without it, the digits jitter as the user types. All `.mono` class numerals already have `font-feature-settings: "tnum"` — but if you swap to a different font in your stack, ensure it's preserved.

### 4. The serif italic accent is a `<span>`, not a font family swap
`<span class="serif">workspace</span>` inside a normal heading. The font size goes UP by ~10% (e.g. parent is 26px → serif span is 30px) because the italic optical metrics need it. Don't try to use Newsreader for whole paragraphs — it's a punctuation, not a paragraph font.

### 5. Band-color swatch dots need to be filled circles, not bordered
For trainers scanning a program, a hollow ring at 8px is hard to see. Solid fill only. Don't add a border.

### 6. The session "logged as a new version" wording is intentional and contradicted by the toast
See `BLOCKERS.md` B3. Don't ship until this is resolved — the current copy in the prototype is inconsistent on purpose to surface the question.

### 7. Modal backdrop click should close, but ⌘+click should not
A trainer mid-edit who accidentally clicks outside a modal loses their work. Use `mousedown → mouseup` both outside to confirm intent.

### 8. Charts render with `preserveAspectRatio="none"` on purpose
Phase 3 Screen 01's SVG paths use absolute coordinates in a 600×240 viewBox but the container can be any width. `preserveAspectRatio="none"` stretches the lines horizontally — that's correct. If you use Recharts/visx instead, ignore this footgun (they handle it).

### 9. Tabular figures break in Safari for some Geist Mono weights
Geist Mono 600 has a known kerning quirk in older Safari. If you see misaligned numerals in the workout table, force `font-variant-numeric: tabular-nums slashed-zero` and consider locking to weight 500 for table cells.

### 10. Don't add the "Today" badge to the sidebar until B1 is decided
The current design assumes alphabetical sort with a "Today" pill on whichever client has a session today. If B1 lands on "sort by next-session-date," the pill becomes redundant and should be removed entirely.

---



Designer: Claude · Reviewer: Roni · Project owner: Rachel
