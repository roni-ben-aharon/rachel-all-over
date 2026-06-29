# Phase 1 — Trainer Tool

The foundation. Rachel signs in, sees her clients, and authors programs.

## Scope (4 screens)

1. **Sign in** — split-screen login with editorial hero
2. **Trainer dashboard (read mode)** — client sidebar + selected client's program
3. **Add new client (modal)** — quick form to create client + program
4. **Blank template state** — what the dashboard looks like right after adding a client

> Open `../preview/RachelAllOver Screens.html` and click **Phase 1** tab to see these live.

---

## Screen 01 — Sign in

**Route:** `/login`
**Purpose:** Rachel signs in. Email + password or Google OAuth. Role is assigned automatically by backend (no role picker in UI).

### Layout
- Full-viewport split, **1.1fr / 1fr** grid.
- **Left panel** (dark, `--ink` background, `#F1EDE4` text):
  - Brand mark + wordmark top-left (32×32 mark, 13px semibold name with -0.005em tracking).
  - Editorial pull-quote centered vertically: 46px Newsreader italic, line-height 1.0, letter-spacing -0.02em, color `#F1EDE4`. Three lines, hard-broken.
    > Track every / set, every rep, / every week.
  - Subtitle below: 13px, `#A39B89`, max-width 280px, line-height 1.55.
  - Footer row: two uppercase labels separated by ~28px, 11px, `#6F695B`, letter-spacing 0.14em. Sage `●` glyph before "Encrypted".
  - Two faint concentric circles in top-right corner (decorative): 240px and 180px, 1px borders at `rgba(241,237,228, .08-.10)`.
- **Right panel** (`--surface`):
  - Centered form column, max-width 320px.
  - "Welcome back" label (uppercase, `.t-label`).
  - Headline: 26px, weight 500, with "workspace" in Newsreader italic at 30px after a line break: `Sign in to your\nworkspace`.
  - Email + Password inputs (`.input`), labeled with `.t-label`. "Forgot?" link on password row, 11px, underlined, `--ink-3`.
  - Primary CTA (`.btn.primary`, full width, 11px vertical padding, 13px): `Sign in →`.
  - Divider with "OR" — 10.5px uppercase `--ink-4` between two `--line` rules.
  - Google OAuth button (`.btn`, full width). Standard 4-color Google G glyph at 14×14.

### Behavior
- Submit → if credentials valid, redirect to `/clients/:first-client-id` or `/clients` if no clients yet.
- Google OAuth opens the standard Google consent screen.
- "Forgot?" opens a password-reset modal (not designed yet — wire to existing flow if any).
- No "Sign up" link on this screen — signup is invite-only (see Phase 2).

---

## Screen 02 — Trainer dashboard (read mode)

**Route:** `/clients` or `/clients/:clientId`
**Purpose:** Rachel's home base. She picks a client from the sidebar and sees their full program.

### Layout
Three-region: sidebar (240px fixed) · header strip · main scrollable content.

### Sidebar (240px, `--surface-soft`)
- Top: brand mark + "RachelAllOver" wordmark.
- "Rachel's clients" label below, followed by a count line in Geist Mono: `8 active · 1 invited`.
- Client list (vertical, 2px gap between rows):
  - Each row: 30×30 avatar, name (12.5px, weight 500), frequency line (10.5px Geist Mono, `--ink-4`).
  - **Selected client**: white background, 1px `--line` border, faint card shadow.
  - **Avatar** uses sage fill + sage-ink letter for the selected client; default (white + ink-3 letter + line border) for others.
  - Optional right-side badge:
    - "Today" → `.pill.amber` (9.5px).
    - Any other day → plain mono day label ("Tue") in `--ink-4`.
- Footer area (border-top):
  - `+ Add client` button (`.btn`, full-width).
  - Current user row: 26px lavender avatar, name (12px 500), role (10.5px `--ink-4`).

### Main area
- **Header strip** (18px 28px padding, border-bottom `--line`):
  - Left: 44px sage avatar + client name (18px 600 -0.015em) + active pill (`.pill.ghost` with green success dot) + program meta line (12px `--ink-3`: `Strength Phase 1 · 2× / week · 12 sessions logged`).
  - Right: `View progress`, `Edit program` (primary), `⋯` (icon button) buttons.
- **Stat strip** (20px 28px, 3-column grid, 12px gap):
  - Three colored cards, 14px padding, 14px radius. Sage / Amber / Lavender.
  - Each: uppercase label (10.5px 500 with .75 opacity), big number (22px 600 -0.02em), sub (11px with .75 opacity).
  - Examples: `Last session: Apr 28 / 3 days ago`, `Avg. volume: 12,480 kg / +8% vs last month`, `Streak: 4 weeks / consistent`.
- **Workout cards** (20px 28px, vertical stack, 16px gap):
  - One `.wcard` per workout (A, B, …).
  - Header: 24×24 ink square with letter (mono), workout name (13.5px 600), exercise count (11px mono `--ink-3`), `Last: Apr 28` chip, `View` button.
  - Table columns: Exercise (30%) · Muscle (16%) · Sets (9%, center) · Reps (9%, center) · Resistance (24%) · Note (12%, right).
  - Resistance: `.resist-chip` (kg = mono number; band = swatch + color name; bodyweight = dashed pill).
  - Note: `.note-btn.active` (filled ink, lines glyph) if a note exists, `.note-btn.empty` (dashed +) if not.

### Behavior
- Click a sidebar row → load that client's program (`/clients/:id`).
- Click `Edit program` → enter edit mode (Phase 3 combobox screen).
- Click `View progress` → navigate to `/clients/:id/progress` (Phase 3 graphs).
- Click a workout's `View` chip → expand to focus that workout (smooth scroll + collapse others — optional, confirm with Rachel).
- Click a `.note-btn.active` → pop a tooltip/popover with the note text. Empty → open an input to type the note.
- Hover row → row gets `--surface-soft` background.

---

## Screen 03 — Add new client (modal)

**Route:** any trainer page, triggered by `+ Add client` button.
**Purpose:** Create a client record + initial program scaffold + send invite.

### Layout
- Modal centered on a `--bg-2` scrim with a subtle radial gradient hint at top.
- Modal card: 460px wide, `--surface`, 18px radius, `--shadow-modal`.
- Header (22px 26px 18px):
  - "New client" label.
  - Headline: 22px weight 500, with "started" in Newsreader italic at 25px: `Let's get them started`.
  - Sub: 12.5px `--ink-3`: `We'll create a program and email an invite link.`
  - `✕` ghost icon button top-right.
- Body (6px 26px 22px, 14px gap):
  - First / Last name (two columns, 10px gap).
  - Email (single column).
  - Program name (single column, pre-filled `Strength Phase 1`).
  - **Workouts per week** picker: label row with count summary (`creates 3 blank workouts`), 5-column grid of `.btn` (1–5), the selected one is `.btn.primary`. Each button uses Geist Mono for the number.
- Footer (14px 26px, `--surface-soft` bg, border-top `--line-soft`):
  - Left: 11px hint `An invite link will be generated.`
  - Right: `Cancel` + `Create client →` (primary).

### Behavior
- On submit:
  1. Create user record (status: `invited`).
  2. Create program with N blank workouts (where N = workouts/week).
  3. Generate invite URL `allover.fit/i/{token}`.
  4. Send invite email (background job).
  5. Redirect to that new client's dashboard → which renders **Screen 04**.
- Validation: all four text fields required; email must validate.
- Cancel / `✕` / Esc / scrim-click → close without saving.

---

## Screen 04 — Blank template state

**Route:** `/clients/:newClientId` (just after creation).
**Purpose:** Show the new client's empty program with a clear invite link prompt.

### Layout
- Same header strip pattern as Screen 02, but:
  - Status pill is `.pill.amber` with text `Invite pending`.
  - Meta line: `Strength Phase 1 · 3× / week · blank template`.
  - Only `Edit program` button on the right.
- **Invite banner strip** (18px 28px, `--surface-soft`, border-bottom `--line-soft`):
  - 28×28 lavender icon square with `↗`.
  - Title: `Invite Roey to RachelAllOver` (12.5px 500).
  - Sub: `They'll create their own login.` (11px `--ink-3`).
  - Mono URL chip on the right: `allover.fit/i/8H4N2K` — 11px Geist Mono inside a bordered `--surface` chip.
  - `Copy link` button (`.btn.sm`).
- **Blank workout cards** (20px 28px, vertical stack, 14px gap):
  - `.wcard` with `--surface-soft` body bg.
  - Header: same as Screen 02 but the letter square is sunken (`--surface-sunken` bg, `--ink-3` letter) and the count says `0 exercises` in `--ink-4`.
  - Empty body: centered column, 32px 18px padding, 8px gap. 36×36 dashed-border square with `+`. Text: `No exercises yet` (12.5px `--ink-3`) and helper `Click [Edit program] to add` (11px `--ink-4`) with `Edit program` in `.kbd`.

### Behavior
- `Copy link` writes URL to clipboard → micro-toast "Copied" (use existing toast system).
- `Edit program` → transitions to Phase 3 edit-mode workout view.
- Banner auto-hides once invite is accepted (status changes from `invited` → `active`).

---

## Components introduced in this phase

| Component | Used in | Spec |
|---|---|---|
| **Brand mark** | All trainer chrome | 28–42px dark square, 12px radius, inner hairline border at 6px inset + centered 18×2px bar. |
| **Client row** | Dashboard sidebar | 30px avatar + name/freq stack + optional right badge. Selected = white card. |
| **Stat card** | Dashboard header | Colored fill (sage/amber/lavender) + label + big number + sub. 14px padding, 14px radius. |
| **Workout card (read-only)** | Dashboard main | `.wcard` with letter-square + name + meta in header. Table body for exercises. |
| **Resistance chip** | Workout table | `.resist-chip`; band variant gets a colored dot, kg uses mono numerals, bodyweight is dashed. |
| **Note button** | Workout table | Filled = has note (3-line glyph); empty = dashed `+`. |
| **Invite link chip** | Blank template banner | Mono URL inside bordered `--surface` chip + adjacent Copy button. |
| **Modal shell** | Add client | 460px, 18px radius, modal shadow, footer strip with `--surface-soft` bg. |

## State / data needed (Phase 1)

- **Auth**: signed-in trainer (id, name, email, role).
- **Clients list**: id, name, initial, email, program-name, frequency-per-week, last-session-date, next-session-day, status (`active` | `invited`).
- **Selected client's program**: workouts (A, B, C…) each with exercises (name, muscle, sets, reps, resistance, optional note, last-logged-date).
- **Invite link**: short token URL.

## Out of scope for Phase 1

- Editing program (Phase 3).
- Logging a live session (Phase 2).
- Charts / progress (Phase 3).
- The client-side experience (Phase 2).
