import { execFileSync } from 'child_process'
import { dirname, resolve } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const repoRoot = resolve(__dirname, '../..')
const seedScript = resolve(repoRoot, 'server/scripts/seed.mjs')

export default async function globalSetup() {
  console.log('\n🌱 Reseeding emulator before test run...')
  try {
    execFileSync(process.execPath, [seedScript], {
      cwd: repoRoot,
      stdio: 'pipe',
      timeout: 15000,
    })
    console.log('✅ Seed complete\n')
  } catch (err: unknown) {
    const execErr = err as { stdout?: Buffer | string; stderr?: Buffer | string }
    const out = execErr.stdout?.toString() || ''
    const errOut = execErr.stderr?.toString() || ''
    throw new Error(`Seed failed — is the emulator running? (npm run emulator)\n${out}\n${errOut}`)
  }
}
