# Phase 2 — Sessions + Clients

What happens after the invite is sent. Clients sign up, trainers log live sessions, clients see their program.

## Scope (3 screens)

1. **Sign up (invite-only)** — client redeems invite, creates account
2. **Workout session (live)** — trainer logs a session in real time
3. **Client view** — read-only client-facing program

> Open `../preview/RachelAllOver Screens.html` and click **Phase 2** tab.

---

## Screen 01 — Sign up

**Route:** `/invite/:token`
**Purpose:** Convert an invited client into a registered user.

### Layout
- Full-viewport split, **1fr / 1.1fr** grid (form on left, dark testimonial panel on right — mirror of Phase 1 sign-in).
- **Left panel** (`--surface`):
  - Centered column, max-width 340px.
  - **"Rachel invited you" chip**: rounded 999px pill, 6px 12px 6px 6px padding, `--surface-soft` bg, 1px `--line` border. 24×24 ink avatar with "R" on the left + 11.5px text: `**Rachel** invited you`.
  - Headline: 30px weight 500, two-line with "training space" in Newsreader italic at 34px: `Welcome to your\ntraining space`.
  - Sub: 13px `--ink-3` line-height 1.55.
  - Form (28px gap above, 12px gap between fields):
    - Full name input.
    - Email input — **disabled**, value locked from invite token. Right-aligned `.pill.ghost` (9.5px) on label row: `Locked from invite`. Disabled state uses `--surface-sunken` bg.
    - Password input + strength meter + Confirm password input. **See "Password validation" below.**
    - `Create account →` primary CTA (full-width, 11px padding).
    - OR divider.
    - `Sign up with Google` (full-width, 4-color G icon).
    - Footer link: `Already have an account? Sign in` (11px center, `--ink-4`, "Sign in" in `--ink` underlined).
- **Right panel** (`--ink` background, `#F1EDE4` text):
  - Top label row: `● Your trainer's view of you` (sage dot, uppercase, 11px `#8B8472`, 0.14em letter-spacing).
  - **Mini-preview card** (background `#211E18`, 1px `#2D2A22` border, 14px radius, 20px padding):
    - Header row: 36px sage avatar + name (13px 500 `#F1EDE4`) + meta (10.5px mono `#8B8472`).
    - Two stat tiles (background `#15130F`, 9px radius, 11px 12px padding):
      - "This week" / `2/2` (the slash and "/2" at 14px with .4 opacity).
      - "Last session" / `Apr 28`.
  - Pull-quote: 34px Newsreader italic, hard-broken into four lines.
  - Citation: 12px `#8B8472`.

### Password validation (Roni's request)
- **Strength meter** sits below the Password input.
  - 1×3px bar split into 4 segments (2px gap), corners rounded.
  - Segments fill `--success` left-to-right as strength climbs (weak: 1, fair: 2, good: 3, strong: 4).
  - Right of the bar: 10.5px label `Weak | Fair | Good | Strong` colored `--danger` / amber-ink / amber-ink / `--success`.
  - Heuristic: length ≥ 8 (req), mixed case, number, symbol. Each adds a segment.
- **Confirm password** input below Password.
  - Below: 10.5px `--success` row with `✓ Passwords match` once strings are non-empty and equal.
  - If mismatch: same row in `--danger` with `✕ Passwords don't match`.
- Submit disabled until strength ≥ Fair AND passwords match AND name + email present.

### Behavior
- On submit:
  - Set the invited user's password, mark status `active`.
  - Sign them in.
  - Redirect to **Screen 03 (client view)**.
- Google sign-up: same outcome but skips password fields entirely — match the email from the invite token to the Google account; reject if mismatch with a clear inline error.
- Email field is read-only; tooltip on hover: `Tied to your invite from Rachel.`

---

## Screen 02 — Workout session (live logger)

**Route:** `/clients/:id/session/:sessionId` (or new: `/clients/:id/session/new`)
**Purpose:** Rachel records exactly what the client actually did in this session. The session is saved as a **new version** — it does NOT overwrite the program.

### Layout
- Stack: banner → workout tabs → editable table → auto-save footer.

### Live session banner (top, 16px 28px)
- Background: linear gradient `var(--amber)` → `#ECC976`, color `var(--amber-ink)`, border-bottom `#D7B663`.
- Left side:
  - 8×8 pulsing dot: solid `--amber-ink` core with a 1px-border ring at inset -3px running `@keyframes pulse` (`scale 1→2.2`, `opacity .5→0`, 2s infinite).
  - Title row: `Live session — Roey` (14px 600 -0.005em) + timer chip (11px Geist Mono, `rgba(91,67,23,.12)` bg, 5px radius, 2px 8px padding). Updates every second.
  - Sub: `Logged as a new version. Won't change the program.` (11.5px, .7 opacity).
- Right side: `Save draft` (translucent button, `rgba(255,255,255,.5)` bg, transparent border, `--amber-ink` text) + `End session →` (`.btn.amber`).

### Workout tabs row (14px 28px, border-bottom `--line`)
- Left: pill group of `.btn.sm` — selected workout is `.btn.sm.primary`.
- Right: previous-session reference: `Previous: Apr 21` (11px, with date in mono) + `View previous ⌄` button (gap 5px, chev at .5 opacity).

### Editable table
- Wrap in 1px `--line` bordered card with 14px radius (sits inside 20px 28px outer padding).
- Columns (widths): Exercise (24%) · Muscle (13%) · Sets (8%, center) · Reps (8%, center) · Resistance (24%) · Note (15%) · `✕` (8%).
- Each cell is an inline `.input` with reduced padding (6px 9px, 12–12.5px font). Exercise + Muscle inputs are borderless (transparent bg) to feel quieter; Sets/Reps are width 42px center-aligned mono; Resistance uses a styled chip-input (see below).
- **PR badge**: when a row's resistance increased vs previous session, drop a `.pill.sage` `↑ PR` (9.5px) below the exercise name in a small margin row.

#### Resistance editor (per row)
- **kg variant**: a single `.input` showing `25 kg` (mono).
- **Band variant**: a custom chip-input — 1px `--line` border, 8px radius, 6px 9px padding, white bg. Contains: 8×8 colored dot + band color name (e.g. `Red band`) + `⌄` (margin-left auto, 10px `--ink-4`). Clicking opens a popover with a 5×1 swatch row of band colors (Red, Blue, Green, Black, Purple).
- **Bodyweight variant**: dashed-border input that reads `Bodyweight`, no value, no chevron.

#### Note cell
- If has note: `--surface-soft` chip with a 📝-equivalent neutral icon + truncated note text (single line, ellipsis). Click to expand into a textarea popover.
- If empty: `.btn.sm` dashed-border `+ note`, `--ink-4`.

#### Trailing X button
- `.btn.icon.ghost` with `--danger` color. Click → confirm delete row. Confirmation is a tiny inline tooltip ("Delete this exercise from the session?") — NOT a full modal.

#### Add row
- Below the table: full-width dashed-border `.btn` (12px padding, `--ink-3`): `+ Add exercise`.

### Auto-save footer (14px 28px, `--surface-soft`, border-top `--line-soft`)
- Left: green dot + `Auto-saved · 11s ago` (11.5px `--ink-3`, "11s ago" mono `--ink-2`).
- Right: `Press ⌘ S to save · ⌘ Enter to end` (11px `--ink-4`, kbd chips for shortcuts).

### Behavior
- Auto-save every 5s when fields change. Status updates the footer timestamp.
- Timer counts up from session start. Doesn't pause.
- **`End session →`**: writes the session as the latest version of this workout's run-log, navigates back to the dashboard with a toast confirmation: `Session saved. Roey's program will use these values next time.` (Confirm wording with product.)
- **`Save draft`**: persists current state to `localStorage` keyed by sessionId; doesn't end the session. Reload-safe.
- Keyboard:
  - `⌘ S` → manual save.
  - `⌘ Enter` → confirm end session.
  - `Tab` cycles through cells in row, then jumps to next row's first input.
- A PR is auto-detected per row by comparing resistance vs the prior logged session for the same exercise.

---

## Screen 03 — Client view

**Route:** `/me` (when signed in as a client).
**Purpose:** Read-only — what Roey sees when he opens the app.

### Layout
- Header strip: 44px sage avatar (initial) + greeting + meta + tab toggle.
  - Greeting: `Hey, Roey 👋` — emoji is intentional and the only one in the system. 18px weight 600, the 👋 wrapped in `.serif` for tonal balance (color `--ink-3`).
  - Meta: `Strength Phase 1 · with Rachel` (12px `--ink-3`).
- Right side: tab toggle, sunken pill group (`--surface-sunken` bg, 10px radius, 4px padding, 6px gap):
  - `My program` (selected = `.btn.sm.primary`).
  - `My progress` (unselected = transparent bg, no border).
- **Summary stripe** (18px 28px, `--surface-soft`, border-bottom `--line-soft`, 4-column grid with 16px gap):
  - **This week** (1.5fr): label + headline `2 sessions scheduled` (24px weight 500 with "scheduled" in `.serif` `--ink-3`) + sub `Next: Tuesday · Workout B` (11.5px `--ink-3`).
  - **Last logged**: label + `Apr 28` (16px mono 500).
  - **Streak**: label + `4 weeks strong` ("strong" in `.serif` `--ink-3` at 14px).
  - **Right-aligned**: `Download as PDF` button.
- **Workout cards** (same as Phase 1 Screen 02 — fully read-only).

### Behavior
- `My progress` tab → routes to client's read-only version of the progress graphs (Phase 3 Screen 01, scoped to themselves).
- `Download as PDF` → renders current program to a PDF. Single sheet, print-friendly. (Implementation can use react-pdf or browser `window.print()` with a `@media print` stylesheet.)
- Clients **cannot** edit anything on this screen. No inputs, no `+ Add exercise`, no note popovers (notes are visible but read-only — same `.note-btn.active` rendering, but click reveals tooltip without an editor).

---

## Components introduced in this phase

| Component | Used in | Spec |
|---|---|---|
| **Invite chip** | Sign up header | Rounded pill with 24px ink avatar + `**Rachel** invited you`. |
| **Live session banner** | Workout session | Amber gradient strip with pulsing dot + mono timer + dual action set. |
| **Password strength meter** | Sign up | 4-segment bar + label, colors graduate red→green. |
| **Workout tab pill row** | Workout session, Client view | Inline `.btn.sm` group; selected = `.primary`. |
| **Editable workout row** | Workout session | Borderless inputs for ID fields, mono inputs for numbers, custom band-color chip. |
| **PR badge** | Workout session | `.pill.sage` `↑ PR` 9.5px, sits below exercise name. |
| **Sunken tab toggle** | Client view | `.btn.sm` pair inside a `--surface-sunken` pill group. |
| **Summary stripe** | Client view | 4-col stripe in `--surface-soft` with mixed sans + serif numerals. |
| **Auto-save footer** | Workout session | Sunken footer with status dot + kbd shortcuts hint. |

## State / data needed (Phase 2)

- **Invite token** → `{email, trainerId, trainerName, clientName?}`.
- **Active session** → `{id, clientId, workoutId, startedAt, savedAt, status: 'draft' | 'saved', rows: [...exercises]}`.
- **Previous session** for the same client+workout (for the PR comparison + "Previous: Apr 21").
- **Client's program** (same shape as Phase 1).
- **Streak / week-summary** derived stats.

## Out of scope for Phase 2

- Progress graphs (Phase 3).
- CSV import (Phase 3).
- Exercise library management (Phase 3).
- Editing the program structure itself (handled in Phase 3 edit mode).
