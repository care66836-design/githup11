import { execFile } from 'node:child_process'
import { chmod, readFile, rename, writeFile } from 'node:fs/promises'
import { promisify } from 'node:util'

const run = promisify(execFile)
const envPath = new URL('../.env', import.meta.url)
const tempPath = new URL('../.env.tmp', import.meta.url)

function setEnvValue(source, key, value) {
  const line = `${key}=${JSON.stringify(value)}`
  const pattern = new RegExp(`^${key}=.*$`, 'm')
  return pattern.test(source) ? source.replace(pattern, line) : `${source.trimEnd()}\n${line}\n`
}

async function requestKey() {
  if (process.platform !== 'darwin') {
    throw new Error('此配置工具目前需要在 macOS 上运行。')
  }

  const appleScript = `
set dialogResult to display dialog "请粘贴 OpenAI Platform API Key。\n\n密钥只会写入本机 .env，不会提交到 GitHub。" default answer "" with hidden answer buttons {"取消", "连接"} default button "连接" cancel button "取消" with title "连接 PetIP AI"
return text returned of dialogResult
`
  const { stdout } = await run('osascript', ['-e', appleScript], { maxBuffer: 1024 * 1024 })
  return stdout.trim()
}

async function validateKey(apiKey) {
  const response = await fetch('https://api.openai.com/v1/models', {
    headers: { Authorization: `Bearer ${apiKey}` },
  })

  if (!response.ok) {
    if (response.status === 401) throw new Error('这个 API Key 无效，请重新创建或检查是否粘贴完整。')
    throw new Error(`OpenAI 连接失败（HTTP ${response.status}），请稍后重试。`)
  }

  const payload = await response.json()
  const available = new Set(Array.isArray(payload.data) ? payload.data.map((item) => item.id) : [])
  const preferred = ['gpt-5.6', 'gpt-5.5', 'gpt-5.4', 'gpt-5.4-mini', 'gpt-4.1']
  return preferred.find((model) => available.has(model)) || 'gpt-5.4'
}

try {
  const apiKey = await requestKey()
  if (!apiKey.startsWith('sk-') || apiKey.length < 24 || /\s/.test(apiKey)) {
    throw new Error('API Key 格式不正确，通常以 sk- 开头且不包含空格。')
  }

  const model = await validateKey(apiKey)
  let env = await readFile(envPath, 'utf8').catch(() => '')
  env = setEnvValue(env, 'OPENAI_API_KEY', apiKey)
  env = setEnvValue(env, 'OPENAI_MODEL', model)
  await writeFile(tempPath, env, { encoding: 'utf8', mode: 0o600 })
  await rename(tempPath, envPath)
  await chmod(envPath, 0o600)
  console.log(`OpenAI API 已连接，可用模型：${model}`)
} catch (error) {
  const message = error instanceof Error ? error.message : '配置失败。'
  if (!/User canceled|用户已取消/.test(message)) console.error(message)
  process.exitCode = 1
}
