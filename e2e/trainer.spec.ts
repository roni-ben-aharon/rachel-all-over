import { test, expect, Page } from '@playwright/test'

const TRAINER = { email: 'rachel@test.com', password: 'test1234' }

async function login(page: Page) {
  await page.goto('/')
  await page.fill('input[type="email"]', TRAINER.email)
  await page.fill('input[type="password"]', TRAINER.password)
  await page.click('button[type="submit"]')
  await page.waitForURL('**/dashboard', { timeout: 8000 })
}

/** Wait until workout cards settle to an expected count */
async function waitForWorkoutCount(page: Page, expected: number, timeout = 8000) {
  await expect(page.locator('[data-testid="workout-card"]')).toHaveCount(expected, { timeout })
}

/** Click a client in the sidebar and wait for their cards to load */
async function selectClient(page: Page, name: string, expectedCards: number) {
  await page.getByRole('button', { name: new RegExp(name) }).first().click()
  await waitForWorkoutCount(page, expectedCards)
}

// ── 1. Login ──────────────────────────────────────────────────────────────────
test('login as trainer → sees dashboard with clients', async ({ page }) => {
  await login(page)
  await expect(page.getByText("Rachel's clients")).toBeVisible()
  await expect(page.getByText('Ofir Inbar').first()).toBeVisible()
  await expect(page.getByText('Roni Ben Aharon').first()).toBeVisible()
  await expect(page.getByText('Noa Galili').first()).toBeVisible()
})

// ── 2. Logout ─────────────────────────────────────────────────────────────────
test('sign out → redirected to login', async ({ page }) => {
  await login(page)
  await page.getByRole('button', { name: 'Sign out' }).click()
  await page.waitForURL('**/login', { timeout: 5000 })
  await expect(page.getByRole('button', { name: 'Sign in' })).toBeVisible()
})

// ── 3. Ofir — exactly 3 workout cards ────────────────────────────────────────
test('Ofir (3x/week) shows exactly 3 workout cards', async ({ page }) => {
  await login(page)
  await selectClient(page, 'Ofir Inbar', 3)
  await expect(page.getByText('Workout A').first()).toBeVisible()
  await expect(page.getByText('Workout B').first()).toBeVisible()
  await expect(page.getByText('Workout C').first()).toBeVisible()
})

// ── 4. Roni — exactly 2 workout cards ────────────────────────────────────────
test('Roni (2x/week) shows exactly 2 workout cards', async ({ page }) => {
  await login(page)
  await selectClient(page, 'Roni Ben Aharon', 2)
  await expect(page.getByText('Workout A').first()).toBeVisible()
  await expect(page.getByText('Workout B').first()).toBeVisible()
})

// ── 5. Noa — exactly 4 workout cards ─────────────────────────────────────────
test('Noa (4x/week) shows exactly 4 workout cards', async ({ page }) => {
  await login(page)
  await selectClient(page, 'Noa Galili', 4)
  await expect(page.getByText('Workout A').first()).toBeVisible()
  await expect(page.getByText('Workout B').first()).toBeVisible()
  await expect(page.getByText('Workout C').first()).toBeVisible()
  await expect(page.getByText('Workout D').first()).toBeVisible()
})

// ── 6. Client switch — workout count must NOT increase ────────────────────────
test('switching clients repeatedly never increases workout count', async ({ page }) => {
  await login(page)

  // First pass
  await selectClient(page, 'Ofir Inbar', 3)
  await selectClient(page, 'Roni Ben Aharon', 2)
  await selectClient(page, 'Noa Galili', 4)

  // Second pass — counts must be identical
  await selectClient(page, 'Ofir Inbar', 3)
  await selectClient(page, 'Roni Ben Aharon', 2)
  await selectClient(page, 'Noa Galili', 4)

  // Third pass for extra confidence
  await selectClient(page, 'Ofir Inbar', 3)
  await selectClient(page, 'Noa Galili', 4)
  await selectClient(page, 'Roni Ben Aharon', 2)
})

// ── 7. Seeded exercises visible for Ofir ─────────────────────────────────────
test('Ofir Workout A shows seeded exercises', async ({ page }) => {
  await login(page)
  await selectClient(page, 'Ofir Inbar', 3)
  await expect(page.getByText('Squat')).toBeVisible({ timeout: 5000 })
  await expect(page.getByText('Romanian Deadlift')).toBeVisible()
  await expect(page.getByText('Leg Press')).toBeVisible()
})

// ── 8. Exercises persist after client switch ──────────────────────────────────
test('save exercises → switch client → switch back → exercises still there', async ({ page }) => {
  await login(page)
  await selectClient(page, 'Ofir Inbar', 3)

  await page.getByRole('button', { name: 'Edit program' }).click()
  await expect(page.locator('input[value="Squat"]')).toBeVisible()

  await page.getByRole('button', { name: 'Save program' }).click()
  await expect(page.getByRole('button', { name: 'Edit program' })).toBeVisible({ timeout: 5000 })

  await selectClient(page, 'Roni Ben Aharon', 2)
  await selectClient(page, 'Ofir Inbar', 3)
  await expect(page.getByText('Squat')).toBeVisible({ timeout: 5000 })
})

// ── 9. Add exercise in edit mode ──────────────────────────────────────────────
test('add exercise in edit mode → appears after save', async ({ page }) => {
  await login(page)
  await selectClient(page, 'Ofir Inbar', 3)

  await page.getByRole('button', { name: 'Edit program' }).click()
  await page.getByRole('button', { name: '+ Add exercise' }).first().click()

  const inputs = page.locator('input[placeholder="Exercise name *"]')
  await inputs.last().fill('Bench Press')

  await page.getByRole('button', { name: 'Save program' }).click()
  await expect(page.getByRole('button', { name: 'Edit program' })).toBeVisible({ timeout: 5000 })
  await expect(page.getByText('Bench Press')).toBeVisible()
})

// ── 10. Cancel edit discards changes ─────────────────────────────────────────
test('cancel edit → changes discarded', async ({ page }) => {
  await login(page)
  await selectClient(page, 'Ofir Inbar', 3)

  await page.getByRole('button', { name: 'Edit program' }).click()
  await page.getByRole('button', { name: '+ Add exercise' }).first().click()

  const inputs = page.locator('input[placeholder="Exercise name *"]')
  await inputs.last().fill('Should Not Persist')

  await page.getByRole('button', { name: 'Cancel' }).click()
  await expect(page.getByRole('button', { name: 'Edit program' })).toBeVisible()
  await expect(page.getByText('Should Not Persist')).toHaveCount(0)
})

// ── 11. Duplicate email blocked ───────────────────────────────────────────────
test('add client with existing email → shows error', async ({ page }) => {
  await login(page)
  await page.getByRole('button', { name: '+ Add client' }).click()
  await page.fill('input[placeholder="First"]', 'Duplicate')
  await page.fill('input[placeholder="Last"]', 'User')
  await page.fill('input[type="email"]', 'ofir@test.com')
  await page.getByRole('button', { name: 'Create client' }).click()
  await expect(page.getByText('Client with this email already exists')).toBeVisible({ timeout: 5000 })
})

// ── 12. Empty exercise name blocks save ───────────────────────────────────────
test('save with unnamed exercise → shows validation error', async ({ page }) => {
  await login(page)
  await selectClient(page, 'Roni Ben Aharon', 2)

  await page.getByRole('button', { name: 'Edit program' }).click()
  await page.getByRole('button', { name: '+ Add exercise' }).first().click()
  await page.getByRole('button', { name: 'Save program' }).click()
  await expect(page.getByText(/all exercises need a name/)).toBeVisible({ timeout: 3000 })
})

// ── 13. Collapse / expand workout card ───────────────────────────────────────
test('click workout header → table collapses then expands', async ({ page }) => {
  await login(page)
  await selectClient(page, 'Ofir Inbar', 3)

  // Exercises visible initially (cards open by default)
  await expect(page.getByText('Squat')).toBeVisible({ timeout: 5000 })

  // Collapse: click the first workout card header button (Workout A)
  const firstCard = page.locator('[data-testid="workout-card"]').first()
  await firstCard.getByRole('button').first().click()
  await expect(page.getByText('Squat')).not.toBeVisible()

  // Expand again
  await firstCard.getByRole('button').first().click()
  await expect(page.getByText('Squat')).toBeVisible()
})

// ── 14. Edit mode shows correct number of trash buttons ───────────────────────
test('edit mode reveals one delete button per workout card', async ({ page }) => {
  await login(page)
  await selectClient(page, 'Ofir Inbar', 3)

  // No trash buttons before edit mode
  await expect(page.getByTitle('Remove workout')).toHaveCount(0)

  await page.getByRole('button', { name: 'Edit program' }).click()
  // 3 workouts → 3 trash buttons
  await expect(page.getByTitle('Remove workout')).toHaveCount(3, { timeout: 3000 })
})

// ── 15. Delete workout reduces count ─────────────────────────────────────────
test('delete a workout in edit mode → one fewer card and daysPerWeek decreases', async ({ page }) => {
  await login(page)
  await selectClient(page, 'Noa Galili', 4)

  await page.getByRole('button', { name: 'Edit program' }).click()
  await expect(page.getByTitle('Remove workout')).toHaveCount(4, { timeout: 3000 })

  // Delete Workout D (last one)
  await page.getByTitle('Remove workout').last().click()

  // Save
  await page.getByRole('button', { name: 'Save program' }).click()
  await expect(page.getByRole('button', { name: 'Edit program' })).toBeVisible({ timeout: 5000 })

  // Should now have 3 workout cards
  await waitForWorkoutCount(page, 3)
  await expect(page.getByText('Workout D')).toHaveCount(0)
  await expect(page.getByText('Workout C').first()).toBeVisible()

  // Switching away and back should still show 3 (no re-creation)
  await selectClient(page, 'Roni Ben Aharon', 2)
  await selectClient(page, 'Noa Galili', 3)
})

// ── 16. Add workout in edit mode increases count ──────────────────────────────
test('add workout in edit mode → new card appears, count increases', async ({ page }) => {
  await login(page)
  await selectClient(page, 'Roni Ben Aharon', 2) // starts with 2

  await page.getByRole('button', { name: 'Edit program' }).click()
  await expect(page.getByText('+ Add workout')).toBeVisible()

  await page.getByText('+ Add workout').click()
  await waitForWorkoutCount(page, 3)
  await expect(page.getByText('Workout C').first()).toBeVisible()

  // Save and verify count persists
  await page.getByRole('button', { name: 'Save program' }).click()
  await expect(page.getByRole('button', { name: 'Edit program' })).toBeVisible({ timeout: 5000 })
  await waitForWorkoutCount(page, 3)

  // Switch away and back — should still be 3
  await selectClient(page, 'Ofir Inbar', 3)
  await selectClient(page, 'Roni Ben Aharon', 3)
})

test('add workout button hidden when already at 5 workouts', async ({ page }) => {
  await login(page)
  // After test 15, Noa has 3 workouts (Workout D was deleted)
  await selectClient(page, 'Noa Galili', 3)
  await page.getByRole('button', { name: 'Edit program' }).click()

  // Add workouts until we reach 5
  await page.getByText('+ Add workout').click()
  await waitForWorkoutCount(page, 4)
  await page.getByText('+ Add workout').click()
  await waitForWorkoutCount(page, 5)

  // Button should disappear at 5
  await expect(page.getByText('+ Add workout')).toHaveCount(0)
})

// ── 17. Reps validation ───────────────────────────────────────────────────────
test('reps with zero value blocked on save', async ({ page }) => {
  await login(page)
  // Use Ofir — stable 3-workout count throughout test run
  await selectClient(page, 'Ofir Inbar', 3)

  await page.getByRole('button', { name: 'Edit program' }).click()
  await page.getByRole('button', { name: '+ Add exercise' }).first().click()

  const nameInputs = page.locator('input[placeholder="Exercise name *"]')
  await nameInputs.last().fill('Push Up')

  // Sets inputs are type="number" too — reps inputs are identified by step="1"
  // Reps input: set to 0 (invalid — must be positive)
  const repsInputs = page.locator('input[min="1"][step="1"]')
  await repsInputs.last().fill('0')

  await page.getByRole('button', { name: 'Save program' }).click()
  await expect(page.getByText(/reps must be a whole number/)).toBeVisible({ timeout: 3000 })
})

test('valid reps (positive integer) saves successfully', async ({ page }) => {
  await login(page)
  await selectClient(page, 'Ofir Inbar', 3)

  await page.getByRole('button', { name: 'Edit program' }).click()
  await page.getByRole('button', { name: '+ Add exercise' }).first().click()

  const nameInputs = page.locator('input[placeholder="Exercise name *"]')
  await nameInputs.last().fill('Plank')

  const repsInputs = page.locator('input[min="1"][step="1"]')
  await repsInputs.last().fill('12')

  await page.getByRole('button', { name: 'Save program' }).click()
  await expect(page.getByRole('button', { name: 'Edit program' })).toBeVisible({ timeout: 5000 })
  await expect(page.getByText('Plank')).toBeVisible()
})

// ── 18. Editing one client doesn't affect another ────────────────────────────
test('editing Roni exercises does not affect Ofir', async ({ page }) => {
  await login(page)
  await selectClient(page, 'Ofir Inbar', 3)
  await expect(page.getByText('Squat')).toBeVisible({ timeout: 5000 })

  // After test 16 (add workout), Roni has 3 workouts
  await selectClient(page, 'Roni Ben Aharon', 3)
  await page.getByRole('button', { name: 'Edit program' }).click()
  await page.getByRole('button', { name: '+ Add exercise' }).first().click()
  const inputs = page.locator('input[placeholder="Exercise name *"]')
  await inputs.last().fill('Roni-Only Exercise')
  await page.getByRole('button', { name: 'Save program' }).click()
  await expect(page.getByRole('button', { name: 'Edit program' })).toBeVisible({ timeout: 5000 })

  await selectClient(page, 'Ofir Inbar', 3)
  await expect(page.getByText('Squat')).toBeVisible({ timeout: 5000 })
  await expect(page.getByText('Roni-Only Exercise')).toHaveCount(0)
})

// ── 19. Header updates when switching clients ─────────────────────────────────
test('clicking client updates header with correct name and frequency', async ({ page }) => {
  await login(page)
  await selectClient(page, 'Ofir Inbar', 3)

  const header = page.locator('.flex-1.flex.flex-col.overflow-hidden')
  await expect(header.getByText('Ofir Inbar')).toBeVisible()
  await expect(header.getByText(/3x \/ week/)).toBeVisible()

  // After test 16, Roni has 3 workouts (daysPerWeek=3)
  await selectClient(page, 'Roni Ben Aharon', 3)
  await expect(header.getByText('Roni Ben Aharon')).toBeVisible({ timeout: 5000 })
  await expect(header.getByText(/3x \/ week/)).toBeVisible()
})

// ── 20. Delete workout then cancel → no change in Firestore ──────────────────
test('delete workout in edit mode then cancel → workout count unchanged', async ({ page }) => {
  await login(page)
  await selectClient(page, 'Ofir Inbar', 3)

  await page.getByRole('button', { name: 'Edit program' }).click()
  await expect(page.getByTitle('Remove workout')).toHaveCount(3, { timeout: 3000 })

  // Delete Workout C (last trash button)
  await page.getByTitle('Remove workout').last().click()
  // Should visually disappear in draft
  await expect(page.locator('[data-testid="workout-card"]')).toHaveCount(2, { timeout: 3000 })

  // Cancel — should restore all 3 workouts (no Firestore write happened)
  await page.getByRole('button', { name: 'Cancel' }).click()
  await waitForWorkoutCount(page, 3)
  await expect(page.getByText('Workout C').first()).toBeVisible()

  // Reload page to confirm Firestore was never touched
  await page.reload()
  await page.waitForURL('**/dashboard', { timeout: 5000 })
  await selectClient(page, 'Ofir Inbar', 3)
  await expect(page.getByText('Workout C').first()).toBeVisible()
})

// ── 21. Start session button ──────────────────────────────────────────────────
test('Start session button visible in read mode, hidden in edit mode', async ({ page }) => {
  await login(page)
  await selectClient(page, 'Ofir Inbar', 3)

  // Read mode: one Start session button per workout card
  await expect(page.locator('[data-testid="start-session-btn"]')).toHaveCount(3, { timeout: 5000 })

  // Edit mode: Start session buttons replaced by trash buttons
  await page.getByRole('button', { name: 'Edit program' }).click()
  await expect(page.locator('[data-testid="start-session-btn"]')).toHaveCount(0)
  await expect(page.getByTitle('Remove workout')).toHaveCount(3)

  // Cancel → buttons back
  await page.getByRole('button', { name: 'Cancel' }).click()
  await expect(page.locator('[data-testid="start-session-btn"]')).toHaveCount(3, { timeout: 3000 })
})

test('Start session button navigates to session URL', async ({ page }) => {
  await login(page)
  await selectClient(page, 'Ofir Inbar', 3)

  await page.locator('[data-testid="start-session-btn"]').first().click()
  await expect(page).toHaveURL(/\/session\/[^/]+\/[^/]+/, { timeout: 5000 })
})

test('Session page renders amber banner and workout label', async ({ page }) => {
  await login(page)
  await selectClient(page, 'Ofir Inbar', 3)

  await page.locator('[data-testid="start-session-btn"]').first().click()
  await expect(page).toHaveURL(/\/session\/[^/]+\/[^/]+/, { timeout: 5000 })

  // Amber banner visible
  await expect(page.getByText('Session in progress')).toBeVisible({ timeout: 5000 })

  // Workout label loaded
  const label = page.locator('[data-testid="session-workout-label"]')
  await expect(label).toBeVisible({ timeout: 5000 })
  await expect(label).toContainText('Workout')
})

test('Session page cancel returns to dashboard', async ({ page }) => {
  await login(page)
  await selectClient(page, 'Ofir Inbar', 3)

  await page.locator('[data-testid="start-session-btn"]').first().click()
  await expect(page).toHaveURL(/\/session\/[^/]+\/[^/]+/, { timeout: 5000 })

  await page.locator('[data-testid="cancel-session-btn"]').click()
  await expect(page).toHaveURL(/\/dashboard/, { timeout: 5000 })
})

test('Session table pre-filled from program exercises', async ({ page }) => {
  await login(page)
  await selectClient(page, 'Ofir Inbar', 3)

  // Click Workout A (first) — has Squat, Romanian Deadlift, Leg Press
  await page.locator('[data-testid="start-session-btn"]').first().click()
  await expect(page).toHaveURL(/\/session\/[^/]+\/[^/]+/, { timeout: 5000 })

  // Exercises pre-filled — check by placeholder + value
  const nameInputs = page.locator('input[placeholder="Exercise name *"]')
  await expect(nameInputs.nth(0)).toHaveValue('Squat', { timeout: 5000 })
  await expect(nameInputs.nth(1)).toHaveValue('Romanian Deadlift')
  await expect(nameInputs.nth(2)).toHaveValue('Leg Press')
})

test('Change indicator updates when session table is edited', async ({ page }) => {
  await login(page)
  await selectClient(page, 'Ofir Inbar', 3)

  await page.locator('[data-testid="start-session-btn"]').first().click()
  await expect(page).toHaveURL(/\/session\/[^/]+\/[^/]+/, { timeout: 5000 })

  // Initially "No changes yet"
  await expect(page.locator('[data-testid="change-indicator"]')).toHaveText('No changes yet', { timeout: 5000 })

  // Edit first exercise name
  await page.locator('input[placeholder="Exercise name *"]').first().fill('Squat modified')

  // Now shows "Unsaved changes"
  await expect(page.locator('[data-testid="change-indicator"]')).toHaveText('Unsaved changes')
})

test('Resume draft banner appears when localStorage draft exists', async ({ page }) => {
  await login(page)
  await selectClient(page, 'Ofir Inbar', 3)

  // Navigate to session to get the real workoutId from URL
  await page.locator('[data-testid="start-session-btn"]').first().click()
  await expect(page).toHaveURL(/\/session\/[^/]+\/[^/]+/, { timeout: 5000 })

  const url = page.url()
  const workoutId = url.split('/').pop()!

  // Inject a draft into localStorage and navigate back
  const draft = JSON.stringify([
    { name: 'Draft Exercise', sets: 5, reps: '5', resistance: { type: 'kg', value: 100 }, notes: '' }
  ])
  await page.evaluate(({ key, value }) => localStorage.setItem(key, value), {
    key: `tracklift:session:${workoutId}`,
    value: draft,
  })
  // Navigate away and back so the component re-mounts and reads localStorage
  await page.goBack()
  await page.locator('[data-testid="start-session-btn"]').first().click()
  await expect(page).toHaveURL(/\/session\/[^/]+\/[^/]+/, { timeout: 5000 })

  // Resume banner visible
  await expect(page.locator('[data-testid="resume-draft-banner"]')).toBeVisible({ timeout: 5000 })
})

test('Resume draft loads draft exercises', async ({ page }) => {
  await login(page)
  await selectClient(page, 'Ofir Inbar', 3)

  await page.locator('[data-testid="start-session-btn"]').first().click()
  await expect(page).toHaveURL(/\/session\/[^/]+\/[^/]+/, { timeout: 5000 })

  const url = page.url()
  const workoutId = url.split('/').pop()!

  const draft = JSON.stringify([
    { name: 'Draft Exercise', sets: 5, reps: '5', resistance: { type: 'kg', value: 100 }, notes: '' }
  ])
  await page.evaluate(({ key, value }) => localStorage.setItem(key, value), {
    key: `tracklift:session:${workoutId}`,
    value: draft,
  })
  await page.goBack()
  await page.locator('[data-testid="start-session-btn"]').first().click()
  await expect(page).toHaveURL(/\/session\/[^/]+\/[^/]+/, { timeout: 5000 })

  await page.locator('[data-testid="resume-draft-btn"]').click()

  // Draft exercise loaded into table
  await expect(page.locator('input[placeholder="Exercise name *"]').first()).toHaveValue('Draft Exercise', { timeout: 3000 })
  await expect(page.locator('[data-testid="change-indicator"]')).toHaveText('Unsaved changes')
})

test('Discard draft loads fresh program exercises', async ({ page }) => {
  await login(page)
  await selectClient(page, 'Ofir Inbar', 3)

  await page.locator('[data-testid="start-session-btn"]').first().click()
  await expect(page).toHaveURL(/\/session\/[^/]+\/[^/]+/, { timeout: 5000 })

  const url = page.url()
  const workoutId = url.split('/').pop()!

  const draft = JSON.stringify([
    { name: 'Draft Exercise', sets: 5, reps: '5', resistance: { type: 'kg', value: 100 }, notes: '' }
  ])
  await page.evaluate(({ key, value }) => localStorage.setItem(key, value), {
    key: `tracklift:session:${workoutId}`,
    value: draft,
  })
  await page.goBack()
  await page.locator('[data-testid="start-session-btn"]').first().click()
  await expect(page).toHaveURL(/\/session\/[^/]+\/[^/]+/, { timeout: 5000 })

  await page.locator('[data-testid="discard-draft-btn"]').click()

  // Fresh exercises from program
  await expect(page.locator('input[placeholder="Exercise name *"]').nth(0)).toHaveValue('Squat', { timeout: 3000 })
  await expect(page.locator('[data-testid="change-indicator"]')).toHaveText('No changes yet')
})

test('Previous session: shows no-prev message when no sessions exist', async ({ page }) => {
  await login(page)
  await selectClient(page, 'Ofir Inbar', 3)

  await page.locator('[data-testid="start-session-btn"]').first().click()
  await expect(page).toHaveURL(/\/session\/[^/]+\/[^/]+/, { timeout: 5000 })

  // Seed has no workoutSessions → "No previous sessions" shown
  await expect(page.locator('[data-testid="no-prev-session"]')).toBeVisible({ timeout: 5000 })
})

test('End session button opens modal', async ({ page }) => {
  await login(page)
  await selectClient(page, 'Ofir Inbar', 3)

  await page.locator('[data-testid="start-session-btn"]').first().click()
  await expect(page).toHaveURL(/\/session\/[^/]+\/[^/]+/, { timeout: 5000 })

  await page.locator('[data-testid="end-session-btn"]').click()
  await expect(page.locator('[data-testid="end-session-modal"]')).toBeVisible()
})

test('Cancel modal keeps session open', async ({ page }) => {
  await login(page)
  await selectClient(page, 'Ofir Inbar', 3)

  await page.locator('[data-testid="start-session-btn"]').first().click()
  await expect(page).toHaveURL(/\/session\/[^/]+\/[^/]+/, { timeout: 5000 })

  await page.locator('[data-testid="end-session-btn"]').click()
  await expect(page.locator('[data-testid="end-session-modal"]')).toBeVisible()

  await page.locator('[data-testid="end-session-modal"]').getByRole('button', { name: 'Cancel' }).click()
  await expect(page.locator('[data-testid="end-session-modal"]')).not.toBeVisible()
  await expect(page).toHaveURL(/\/session\/[^/]+\/[^/]+/)
})

test('Save session navigates to dashboard and shows prev session on re-entry', async ({ page }) => {
  await login(page)
  await selectClient(page, 'Ofir Inbar', 3)

  await page.locator('[data-testid="start-session-btn"]').first().click()
  await expect(page).toHaveURL(/\/session\/[^/]+\/[^/]+/, { timeout: 5000 })

  // Save session
  await page.locator('[data-testid="end-session-btn"]').click()
  await page.locator('[data-testid="confirm-save-session-btn"]').click()
  await expect(page).toHaveURL(/\/dashboard/, { timeout: 8000 })

  // Re-select client (dashboard state resets on navigation)
  await selectClient(page, 'Ofir Inbar', 3)

  // Re-enter same session
  await page.locator('[data-testid="start-session-btn"]').first().click()
  await expect(page).toHaveURL(/\/session\/[^/]+\/[^/]+/, { timeout: 5000 })

  // Previous session toggle now appears (allow time for Firestore query)
  await expect(page.locator('[data-testid="prev-session-toggle"]')).toBeVisible({ timeout: 10000 })
})

test('Session history panel opens from ··· menu', async ({ page }) => {
  await login(page)
  await selectClient(page, 'Ofir Inbar', 3)

  // Open ··· menu
  await page.getByRole('button', { name: '···' }).click()
  await expect(page.locator('[data-testid="session-history-menu-item"]')).toBeVisible()

  await page.locator('[data-testid="session-history-menu-item"]').click()
  await expect(page.locator('[data-testid="session-history-panel"]')).toBeVisible()
})

test('Session history panel closes on ✕ button', async ({ page }) => {
  await login(page)
  await selectClient(page, 'Ofir Inbar', 3)

  await page.getByRole('button', { name: '···' }).click()
  await page.locator('[data-testid="session-history-menu-item"]').click()
  await expect(page.locator('[data-testid="session-history-panel"]')).toBeVisible()

  await page.locator('[data-testid="close-history-panel"]').click()
  await expect(page.locator('[data-testid="session-history-panel"]')).not.toBeVisible()
})

test('Session history panel shows sessions after one is saved', async ({ page }) => {
  await login(page)
  await selectClient(page, 'Ofir Inbar', 3)

  // Save a session first
  await page.locator('[data-testid="start-session-btn"]').first().click()
  await expect(page).toHaveURL(/\/session\/[^/]+\/[^/]+/, { timeout: 5000 })
  await page.locator('[data-testid="end-session-btn"]').click()
  await page.locator('[data-testid="confirm-save-session-btn"]').click()
  await expect(page).toHaveURL(/\/dashboard/, { timeout: 8000 })

  await selectClient(page, 'Ofir Inbar', 3)

  // Open session history
  await page.getByRole('button', { name: '···' }).click()
  await page.locator('[data-testid="session-history-menu-item"]').click()
  await expect(page.locator('[data-testid="session-history-panel"]')).toBeVisible()

  // Workout A sessions listed (no-sessions-msg should NOT be visible)
  await expect(page.locator('[data-testid="no-sessions-msg"]')).not.toBeVisible({ timeout: 5000 })
})

test('workout card shows Resume session after draft exists', async ({ page }) => {
  await login(page)
  await selectClient(page, 'Ofir Inbar', 3)

  // Start session and make a change (triggers autosave to localStorage)
  await page.locator('[data-testid="start-session-btn"]').first().click()
  await expect(page).toHaveURL(/\/session\/[^/]+\/[^/]+/, { timeout: 5000 })
  await page.locator('input[placeholder="Exercise name *"]').first().fill('Modified squat')

  // Cancel back to dashboard
  await page.locator('[data-testid="cancel-session-btn"]').click()
  await expect(page).toHaveURL(/\/dashboard/, { timeout: 5000 })

  // Re-select client so cards re-mount and read fresh localStorage
  await selectClient(page, 'Roni Ben Aharon', 2)
  await selectClient(page, 'Ofir Inbar', 3)

  // First workout card now shows "Resume session"
  await expect(page.locator('[data-testid="start-session-btn"]').first()).toHaveText('Resume session')
})
