# Blockers — decisions needed before build

These are open product questions identified during design. Each one gates a specific phase. Get answers before starting that phase's build, or you'll either guess wrong and rebuild, or block partway through.

Owner column is who should answer. Status: `open` → `decided`.

---

## 🔴 BLOCKS Phase 1

### B1. Sidebar sort order
**Question:** Should the trainer's client list in the sidebar be sorted by:
- (a) alphabetical (current design)
- (b) next session date ascending ("who's up next")
- (c) most-recently-active first
- (d) custom manual order via drag

**Why it blocks:** Affects sidebar component API (sortable vs static), the data fetch (need next-session date if (b)), and the "Today" badge logic.

**Owner:** Rachel
**Recommended default if unspecified:** (b) — most useful for daily workflow.
**Status:** open

### B2. Multiple trainers, one workspace?
**Question:** Will the product ever have >1 trainer in the same workspace (e.g. a gym with multiple staff)? Or is each trainer always solo?

**Why it blocks:** Affects auth/role model, client-to-trainer relationship, and whether the sidebar needs a "filter by trainer" control.

**Owner:** Product
**Recommended default if unspecified:** Solo trainer only for v1. Schema should allow multi-trainer later but UI ignores it.
**Status:** open

---

## 🔴 BLOCKS Phase 2

### B3. Session versioning policy
**Question:** When a trainer ends a live session with edited values, does the **program** (the canonical workout) update to match? Or does the program stay frozen and only the session log carries the new values?

The design says "logged as a new version. Won't change the program" in the banner — but the toast on save says "Roey's program will use these values next time." These contradict. Decide.

**Why it blocks:** Affects whether `Workout.exercises` is mutable or whether we always merge from the latest session at read time.

**Owner:** Rachel + engineer
**Recommended default if unspecified:** Each session is immutable. The program shows the *most recent session's* values when displayed in read mode, with a "since [date]" footnote. Trainer can promote a session to "set as program baseline" explicitly.
**Status:** open

### B4. Offline / network-loss handling in the live session
**Question:** What happens if Rachel loses internet mid-session?
- (a) Block input until reconnected
- (b) Keep writing to localStorage, sync on reconnect
- (c) Best-effort sync, warn but don't block

**Why it blocks:** This is the most stressful failure mode in the app — losing live training data. Decide before building.

**Owner:** Rachel
**Recommended default if unspecified:** (b) — local-first writes, replay on reconnect, never block. Show a small `Offline · changes queued` chip in the auto-save footer.
**Status:** open

### B5. Invite link expiration
**Question:** How long is `allover.fit/i/{token}` valid?
- 7 days / 30 days / never expires?

**Why it blocks:** Affects token storage, the "expired invite" empty state, and the invite-resend flow (which isn't designed yet).

**Owner:** Security / Product
**Recommended default if unspecified:** 30 days, single-use. Show an "invite expired" page with a "Request new invite" CTA.
**Status:** open

---

## 🔴 BLOCKS Phase 3

### B6. CSV required columns
**Question:** Which columns are required vs optional? See `phase-3-power-features/README.md` for current assumption. Confirm with Rachel using one of her real CSVs.

**Why it blocks:** Parser logic, error messages, and which columns get the "needs attention" treatment.

**Owner:** Rachel (share a sample CSV)
**Recommended default if unspecified:** Required: `workout`, `exercise`, `sets`, `reps`. Optional: everything else (parse what's there, skip what's missing).
**Status:** open

### B7. Deleting library exercises
**Question:** Can a trainer delete an exercise from the library? If yes, what happens to historical programs/sessions that reference it?
- (a) Soft delete + tombstone, programs keep working
- (b) Block delete if exercise is in use
- (c) Hard delete + orphan the references

**Why it blocks:** Whether to design a delete affordance at all, and whether to show "in use by 3 programs" warning text.

**Owner:** Product
**Recommended default if unspecified:** (b) — soft block. Show "In use by N programs — remove from those first" with a link to filter the affected clients.
**Status:** open

### B8. Per-trainer vs global library
**Question:** Is the library:
- (a) one global library, all trainers share + contribute (current design)
- (b) one library per trainer (their private list)
- (c) a global seed + per-trainer additions (hybrid)

**Why it blocks:** Backend schema, "Added by" column meaning, and the "Custom" badge logic.

**Owner:** Product
**Recommended default if unspecified:** (c) — `system` seed exercises everyone sees, plus per-trainer additions tagged with the trainer's name. Current design assumes this.
**Status:** open

---

## 🟡 Non-blocking but should resolve before launch

### B9. Mobile/responsive design
Currently desktop-only. Rachel will ask within a week of Phase 1 shipping. Recommend designing mobile screens in parallel with Phase 2 implementation.

### B10. Notifications
Are there any? Email when client logs a session? In-app banner? Out of scope for v1, but pin it.

### B11. Accessibility audit
- All `.input` focus states defined ✓
- Color contrast: sage/amber/lavender pills against `--ink-2` text — verify WCAG AA. Some of the amber-on-amber-ink combinations may be borderline.
- Keyboard nav on the live session needs an explicit pass — `Tab` cycle, focus rings on custom band picker.

---

## How to use this doc

- **Before kicking off any phase**, scan the blockers tagged for that phase.
- For each `open` blocker, get a decision and edit this file to `decided` + write the decision next to "Recommended default."
- Don't start the phase until all its blockers are decided. Building on assumptions = rework.
