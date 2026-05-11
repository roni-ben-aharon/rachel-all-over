import { execSync } from 'child_process'

export default async function globalSetup() {
  console.log('\n🌱 Reseeding emulator before test run...')
  try {
    execSync('node scripts/seed.mjs', {
      cwd: process.cwd(),
      stdio: 'pipe',
      timeout: 15000,
    })
    console.log('✅ Seed complete\n')
  } catch (err: any) {
    const out = err?.stdout?.toString() || ''
    const errOut = err?.stderr?.toString() || ''
    throw new Error(`Seed failed — is the emulator running? (npm run emulator)\n${out}\n${errOut}`)
  }
}
