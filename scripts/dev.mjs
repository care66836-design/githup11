import { spawn } from 'node:child_process'
import { resolve } from 'node:path'

const extension = process.platform === 'win32' ? '.cmd' : ''
const processes = [
  spawn(resolve(`node_modules/.bin/tsx${extension}`), ['watch', 'server/index.ts'], { stdio: 'inherit' }),
  spawn(resolve(`node_modules/.bin/vite${extension}`), ['--host', '0.0.0.0'], { stdio: 'inherit' }),
]

let closing = false

function close(code = 0) {
  if (closing) return
  closing = true
  for (const child of processes) child.kill('SIGTERM')
  setTimeout(() => process.exit(code), 50)
}

for (const child of processes) {
  child.on('exit', (code, signal) => {
    if (!closing && code !== 0 && signal !== 'SIGTERM') close(code || 1)
  })
}

process.on('SIGINT', () => close())
process.on('SIGTERM', () => close())

