# Phase 2 — States

Loading, empty, and error states. The happy path is in `README.md`. See also `live-session-deep-dive.md` for the session logger's edge cases.

## Screen 01 — Sign up (invite)

### Loading
- Invited email field shows a skeleton bar while the invite token is being verified.
- On submit: primary CTA → `Creating account…` + spinner. Disable form.

### Empty / invalid invite
- If the token is missing, expired, or already used, render an entirely different page:
  - Centered card on cream bg, 420px wide.
  - Headline: `This invite is no longer valid` (22px 500).
  - Sub depending on cause:
    - Expired: `Invite links expire after 30 days. Ask Rachel for a new one.`
    - Used: `Looks like this account is already set up. Try signing in.` + Sign in CTA.
    - Unknown: `We couldn't find this invite. Double-check the link.`
  - Right-panel testimonial is hidden in this state.

### Error
- Password mismatch (handled inline — see `README.md` password validation section).
- Server error: same calm `--danger` dot banner above the form: `Couldn't create your account. Try again.`
- Google sign-up mismatch (Google email ≠ invited email): inline `--danger` row below the Google button: `Use the Google account for {invited-email} to continue.`

---

## Screen 02 — Workout session

> **See `live-session-deep-dive.md` for the full state machine.** This is a summary.

### Loading (initial session load)
- Banner renders immediately with `Starting session…` and a spinner replacing the timer chip.
- Table area shows skeleton rows (5 default).
- Once loaded, the timer starts and rows populate.

### Empty — no previous session for comparison
- The "Previous: Apr 21" reference in the tab row reads `Previous: —` and `View previous` is disabled (.5 opacity).
- PR badges never appear (there's nothing to compare against).
- A one-line helper appears under the banner: `First session for this workout — no comparison available.`

### Auto-save states (footer)
- `Saving…` — dot is amber, mono `Saving…` text.
- `Auto-saved · 11s ago` — dot is `--success`, mono timestamp.
- `Save failed · Retrying` — dot is `--danger`, mono error text. Hover for full error.
- `Offline · changes queued` — dot is amber, italic mono text. See cross-cutting offline state.

### Validation
- Sets / Reps must be positive integers. On invalid: input border `--danger`, no banner.
- Reps accepts `45s` / `1m` / `Nx` notation (time / drop-sets). Validate via regex.

### Errors
- **Failed to save end-of-session**: modal popover above the `End session →` button (not a full-screen modal):
  - `Couldn't save your session. Your changes are still here.` (12.5px)
  - `Retry` (primary) + `Save as draft` buttons.
- **Concurrent edit detected** (rare — two trainers somehow open the same session):
  - Banner above the table: `Someone else is editing this session. Refresh to see their changes, or keep editing to overwrite.`
  - `Refresh` + `Keep editing` actions.

---

## Screen 03 — Client view

### Loading
- Same skeleton pattern as the trainer dashboard, scoped to the client's own program.

### Empty — invited but no program yet
- Should not happen in practice (trainer always sets up a program first), but defensively:
  - Centered: `Your program isn't ready yet. Rachel will set it up soon.` 16px 500.
  - Sub: `You'll get an email when it's ready.` 12px `--ink-3`.

### Empty — no sessions logged yet
- Summary stripe:
  - "Last logged": `—`
  - "Streak": `Get started!` (with "started" in `.serif`)
- Workout cards render normally (the program exists, just no sessions).

### Error — failed to load
- Same calm error pattern as Phase 1 Screen 02 error.

---

## Cross-cutting

### Offline (live session is the critical case)
- Auto-save footer flips to `Offline · changes queued`.
- A persistent amber pill chip appears in the live session banner next to the timer: `Offline` (9.5px, amber-ink on a `rgba(255,255,255,.5)` bg).
- Writes go to localStorage keyed by sessionId, replayed FIFO on reconnect.
- `End session →` is disabled while offline, with a tooltip on hover: `Reconnect to end this session.`
- Reconnect: brief `Synced.` toast in `--success`.

### Toast system
- Bottom-center, 24px from bottom edge.
- 12px Geist 500, 10px 16px padding, 999px radius.
- Auto-dismiss after 3s for success, 6s for error. Errors include a `✕` to dismiss manually.
