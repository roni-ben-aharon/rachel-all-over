import { vi } from 'vitest'

// Mock firebase modules so hooks can be imported without real Firebase connection
vi.mock('../lib/firebase', () => ({
  db: {},
  auth: { currentUser: null },
}))
