import { test, expect, Page } from '@playwright/test'

const OFIR = { email: 'ofir@test.com', password: 'test1234' }
const TEST_INVITE_ID = 'test-invite-001'

async function loginAsClient(page: Page, email: string, password: string) {
  await page.goto('/login')
  await page.fill('input[type="email"]', email)
  await page.fill('input[type="password"]', password)
  await page.click('button[type="submit"]')
  await page.waitForURL('**/my-program', { timeout: 10000 })
}

// ── 1. Client login ───────────────────────────────────────────────────────────
test('client login → redirected to /my-program', async ({ page }) => {
  await loginAsClient(page, OFIR.email, OFIR.password)
  await expect(page.getByText('Hey, Ofir Inbar')).toBeVisible()
})

// ── 2. Client sees workout cards ──────────────────────────────────────────────
test('client sees correct number of workout cards (Ofir: 3)', async ({ page }) => {
  await loginAsClient(page, OFIR.email, OFIR.password)
  await expect(page.locator('[data-testid="client-workout-card"]')).toHaveCount(3, { timeout: 8000 })
  await expect(page.getByText('Workout A').first()).toBeVisible()
  await expect(page.getByText('Workout B').first()).toBeVisible()
  await expect(page.getByText('Workout C').first()).toBeVisible()
})

// ── 3. Read-only — no Edit button ────────────────────────────────────────────
test('client view has no Edit program button', async ({ page }) => {
  await loginAsClient(page, OFIR.email, OFIR.password)
  await expect(page.locator('[data-testid="client-workout-card"]')).toHaveCount(3, { timeout: 8000 })
  await expect(page.getByRole('button', { name: 'Edit program' })).toHaveCount(0)
})

// ── 4. Client sees seeded exercises ──────────────────────────────────────────
test('client sees exercises seeded by trainer', async ({ page }) => {
  await loginAsClient(page, OFIR.email, OFIR.password)
  await expect(page.getByText('Squat')).toBeVisible({ timeout: 8000 })
  await expect(page.getByText('Romanian Deadlift')).toBeVisible()
  await expect(page.getByText('Leg Press')).toBeVisible()
})

// ── 5. Header shows program and trainer name ──────────────────────────────────
test('client header shows program name and trainer name', async ({ page }) => {
  await loginAsClient(page, OFIR.email, OFIR.password)
  await expect(page.getByText(/Strength Phase 1/)).toBeVisible()
  await expect(page.getByText(/with Rachel/)).toBeVisible()
})

// ── 6. Collapse/expand workout card ──────────────────────────────────────────
test('client can collapse and expand workout card', async ({ page }) => {
  await loginAsClient(page, OFIR.email, OFIR.password)
  await expect(page.locator('[data-testid="client-workout-card"]')).toHaveCount(3, { timeout: 8000 })
  // Squat visible by default (cards open)
  await expect(page.getByText('Squat')).toBeVisible()
  // Collapse first card (click the header toggle button — first button in the card)
  await page.locator('[data-testid="client-workout-card"]').first().locator('button').first().click()
  await expect(page.getByText('Squat')).toHaveCount(0)
  // Expand again
  await page.locator('[data-testid="client-workout-card"]').first().locator('button').first().click()
  await expect(page.getByText('Squat')).toBeVisible()
})

// ── 7. Client sign out ────────────────────────────────────────────────────────
test('client sign out → redirected to /login', async ({ page }) => {
  await loginAsClient(page, OFIR.email, OFIR.password)
  await page.getByRole('button', { name: 'Sign out' }).click()
  await page.waitForURL('**/login', { timeout: 5000 })
  await expect(page.getByRole('button', { name: 'Sign in' })).toBeVisible()
})

// ── 8. No invite param → error ───────────────────────────────────────────────
test('signup without invite param shows error', async ({ page }) => {
  await page.goto('/signup')
  await expect(page.getByText('No invite link provided.')).toBeVisible()
})

// ── 9. Invalid invite ID → error ─────────────────────────────────────────────
test('signup with invalid invite ID shows error', async ({ page }) => {
  await page.goto('/signup?invite=does-not-exist-xyz')
  await expect(page.getByText('Invalid invite link.')).toBeVisible({ timeout: 8000 })
})

// ── 10. Valid invite — shows trainer banner + pre-filled email ────────────────
test('valid invite page shows trainer banner and pre-filled email', async ({ page }) => {
  await page.goto(`/signup?invite=${TEST_INVITE_ID}`)
  await expect(page.getByText(/Rachel invited you/)).toBeVisible({ timeout: 8000 })
  const emailInput = page.locator('input[type="email"]')
  await expect(emailInput).toHaveValue('dana@test.com')
  await expect(emailInput).toBeDisabled()
})

// ── 11. Signup with valid invite → account created → /my-program ──────────────
test('signup with valid invite creates account and redirects to /my-program', async ({ page }) => {
  await page.goto(`/signup?invite=${TEST_INVITE_ID}`)
  await expect(page.getByText(/Rachel invited you/)).toBeVisible({ timeout: 8000 })
  await page.fill('input[placeholder="Full name"]', 'Dana Pending')
  await page.fill('input[type="password"]', 'test1234')
  await page.click('button[type="submit"]')

  // Redirect to /my-program — proves signup + Firebase Auth user creation succeeded
  await page.waitForURL('**/my-program', { timeout: 12000 })

  // Client program renders (Sign out button only appears once clientData is loaded)
  await expect(page.getByRole('button', { name: 'Sign out' })).toBeVisible({ timeout: 15000 })
  await expect(page.getByText('Hey, Dana Pending')).toBeVisible({ timeout: 5000 })
})

// ── 12. Trainer creates client → invite link shown ───────────────────────────
test('trainer creates client → invite link shown in modal', async ({ page }) => {
  await page.goto('/login')
  await page.fill('input[type="email"]', 'rachel@test.com')
  await page.fill('input[type="password"]', 'test1234')
  await page.click('button[type="submit"]')
  await page.waitForURL('**/dashboard', { timeout: 8000 })

  await page.getByRole('button', { name: '+ Add client' }).click()
  await page.fill('input[placeholder="First"]', 'Test')
  await page.fill('input[placeholder="Last"]', 'User')
  await page.fill('input[type="email"]', 'testuser@example.com')
  await page.getByRole('button', { name: 'Create client' }).click()

  const linkInput = page.locator('[data-testid="invite-link-input"]')
  await expect(linkInput).toBeVisible({ timeout: 8000 })
  const link = await linkInput.inputValue()
  expect(link).toContain('/signup?invite=')
  await expect(page.getByText('Client created!')).toBeVisible()
})

// ── My progress navigation ────────────────────────────────────────────────────
test('client has My progress button', async ({ page }) => {
  await loginAsClient(page, OFIR.email, OFIR.password)
  await expect(page.locator('[data-testid="my-progress-btn"]')).toBeVisible({ timeout: 5000 })
})

test('My progress button navigates to /my-progress', async ({ page }) => {
  await loginAsClient(page, OFIR.email, OFIR.password)
  await page.locator('[data-testid="my-progress-btn"]').click()
  await expect(page).toHaveURL(/\/my-progress/, { timeout: 5000 })
  await expect(page.getByText('My progress')).toBeVisible()
})
