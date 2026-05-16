# RachelAllOver

Workout tracking app for personal trainers and their clients.

## Stack

React · TypeScript · Vite · Firebase (Firestore + Auth) · Tailwind · Playwright

---

## Setup

```bash
npm install
cp .env.example .env   # fill in Firebase keys (get from project owner)
```

## Run (production Firebase)

```bash
npm run dev            # http://localhost:5174
```

## Run (local emulator)

```bash
npm run emulator       # start Firebase emulator (terminal 1)
npm run dev:local      # http://localhost:5175  (terminal 2)
node scripts/seed.mjs  # seed test data (emulator must be running)
```

---

## Testing

See [TESTING.md](./TESTING.md) for full test guide, accounts, and commands.

Full project spec, phases, bugs, and wishlist → [PROJECT.md](./PROJECT.md)

```bash
npm run e2e    # Playwright E2E (requires emulator + dev:local running)
npm run test   # Vitest unit tests
```

---

## Roles

| Role    | Access                                      |
|---------|---------------------------------------------|
| Trainer | Dashboard — manage clients and programs     |
| Client  | My Program — read-only workout view         |

Clients are added by the trainer via invite link only.
