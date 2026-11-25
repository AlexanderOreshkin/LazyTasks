// Сборка выполняется локально командой `npm run build:full`.
// Этот скрипт проверяет, что готовый `dist/` существует —
// нужен для окружений, где postinstall-скрипты (esbuild) заблокированы.
import { existsSync } from 'node:fs'

if (!existsSync('dist/index.html')) {
  console.error('dist/index.html не найден. Сначала выполни: npm run build:full')
  process.exit(1)
}
console.log('dist/ на месте — сборка не требуется.')
