# Testing Guide

## Stack

- **E2E:** Playwright (Chromium)
- **Unit:** Vitest + happy-dom
- **Backend:** Firebase Local Emulator Suite (Firestore :8080, Auth :9099, UI :4000)

---

## Prerequisites

```bash
node >= 20          # nvm use 20
npm install
firebase-tools      # npm install -g firebase-tools
```

---

## Run emulator + dev server

```bash
# Terminal 1 — Firebase emulator
npm run emulator

# Terminal 2 — Dev server (emulator mode, port 5175)
npm run dev:local
```

---

## Run E2E tests

```bash
# Reseeds emulator automatically before run
npm run e2e

# Single file
npm --prefix client run e2e -- e2e/trainer.spec.ts
npm --prefix client run e2e -- e2e/client.spec.ts

# Single test by name
npm --prefix client run e2e -- -g "Ofir"
```

## Run unit tests

```bash
npm run test
```

---

## Test accounts (emulator only)

| Role    | Email              | Password  | Notes                        |
|---------|--------------------|-----------|------------------------------|
| Trainer | rachel@test.com    | test1234  | 3 clients seeded             |
| Client  | ofir@test.com      | test1234  | 3x/week, exercises in Wkt A  |
| Client  | roni@test.com      | test1234  | 2x/week                      |
| Client  | noa@test.com       | test1234  | 4x/week                      |
| Client  | dana@test.com      | —         | Pending — use invite link     |

Pending invite ID for E2E: `test-invite-001`
Signup URL: `http://localhost:5175/signup?invite=test-invite-001`

---

## URLs

| Environment | URL                        |
|-------------|----------------------------|
| Dev (emulator) | http://localhost:5175   |
| Production  | http://localhost:5174       |
| Emulator UI | http://localhost:4000       |

---

## Reseed emulator manually

```bash
npm run seed
```

---

## Test coverage

### `client/e2e/trainer.spec.ts` (39 tests)
Trainer login/logout, workout card counts per client, no count inflation on switch, seeded exercises, save/persist, add exercise, cancel edit, duplicate email, unnamed exercise validation, collapse/expand, delete workout, add workout, 5-workout cap, reps validation, cross-client isolation, header info, session flow, session drafts, previous session display, and session history.

### `client/e2e/client.spec.ts` (14 tests)
Client login → `/my-program`, workout card count, read-only (no Edit button), seeded exercises visible, header shows program + trainer, collapse/expand, sign out, signup errors (no invite / bad invite), invite page banner + pre-filled email, full signup flow, trainer creates client → invite link in modal, and client progress navigation.
