# Phase 1 — States

Loading, empty, and error states for the trainer tool. The happy path is in `README.md`.

## Screen 01 — Sign in

### Loading (form submit)
- Replace primary CTA label with a spinner + `Signing in…` (12px). Disable both inputs.
- Google button: replace text with `Connecting to Google…` and disable.

### Error
- **Invalid credentials**: 12px `--danger` row appears between the password input and the CTA: `Email and password don't match. Try again.` No field-level red borders (keeps it calm).
- **Account not found**: same row, copy: `No account for this email. Ask your trainer for an invite.`
- **Network error**: amber banner above form: `Couldn't reach the server. Check your connection.` with a `Retry` button.

### Empty
N/A — sign-in always has the same fields.

---

## Screen 02 — Trainer dashboard

### Loading

**Sidebar skeleton:**
- Render the client list area with 6 skeleton rows.
- Each row: 30×30 circle (sage shimmer `--surface-sunken → --line → --surface-sunken` linear gradient, 1.5s loop) + two stacked rectangles for name (60% width) and frequency (40% width).
- Shimmer animation: subtle, never below 200ms cycle.

**Main area skeleton:**
- Header avatar circle + two stacked text bars (40% and 60%).
- Stat strip: three colored boxes with skeleton inner text. Use the actual sage/amber/lavender bgs so the page doesn't visually shift on load.
- Workout cards: render one `.wcard` shell with header text skeleton bars + 3 skeleton table rows (no borders).

### Empty — no clients yet (first-time trainer)
- Sidebar: shows the brand mark + "Rachel's clients" label + `0 active` count.
- Below the count: a small illustration block (placeholder — coordinate with brand for actual asset). 200×140, centered.
- Headline (centered, 16px 500): `No clients yet`.
- Sub (12px `--ink-3`): `Add your first client to get started. They'll get an invite link.`
- Centered `+ Add client` primary button.
- Main area: empty cream canvas with a one-line ghost message centered: `Pick or add a client to see their program.` (13px `--ink-3`).

### Empty — selected client has no sessions yet
- All `.wcard`s show the **Blank workout** treatment from Screen 04 (dashed `+` empty state inside each).
- Stat strip: amber/sage/lavender cards still show but with placeholder values (`—`) and the sub line reading `Once you log a session`.

### Error — failed to load client
- Main area replaces with a calm error state:
  - 36×36 circle with `!` glyph in `--ink-3`, `--surface-sunken` bg.
  - Headline `Couldn't load Roey's program` (16px 500).
  - Sub (12px `--ink-3`): the actual error code in mono, e.g. `error: permission-denied`.
  - Buttons: `Retry` + `Back to all clients`.

---

## Screen 03 — Add new client modal

### Loading (submit)
- Primary CTA → spinner + `Creating client…`. Disable form inputs.

### Validation errors (inline, no banner)
- Per field, show 11px `--danger` text under the input on blur if invalid.
- Email format: `Enter a valid email address.`
- Required missed: `Required.`
- Email already in use: `This email already has an account. Use a different one.`
- Disable submit while any error is active.

### Server error
- Banner appears between body and footer of the modal: same calm style as Phase 3 CSV banner — 12px 24px, `--surface-soft`, 6×6 `--danger` dot, message: `Couldn't create client. Try again or contact support.` `Retry` button on the right.

---

## Screen 04 — Blank template state

### Loading
- Invite banner: URL chip shows skeleton (40% width gray pill). Copy button disabled with `Generating…` text.
- Workout cards: render with the blank state immediately (no skeleton — there's no data to wait on).

### Error — invite generation failed
- Replace the invite banner content with a calm error inline:
  - `Couldn't generate invite link.` (12.5px `--ink-2`)
  - Right side: `Retry` button.

---

## Cross-cutting

### Network connection lost
- Persistent toast at the bottom of the screen: `You're offline. Changes will sync when you reconnect.` 
- `--ink` bg, `#F1EDE4` text, 12px, 999px radius, 10px 16px padding, drop shadow.
- Auto-dismisses on reconnect with a brief `Back online.` toast in `--success` text.

### Skeleton shimmer animation
```css
@keyframes shimmer {
  0%   { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}
.skeleton {
  background: linear-gradient(90deg,
    var(--surface-sunken) 0%,
    var(--line) 50%,
    var(--surface-sunken) 100%);
  background-size: 200% 100%;
  animation: shimmer 1.5s ease-in-out infinite;
  border-radius: 6px;
}
```
