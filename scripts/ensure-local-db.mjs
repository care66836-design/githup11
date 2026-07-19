import { mkdir, open } from 'node:fs/promises'
import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const databasePath = fileURLToPath(new URL('../prisma/dev.db', import.meta.url))

await mkdir(dirname(databasePath), { recursive: true })
const databaseFile = await open(databasePath, 'a')
await databaseFile.close()
