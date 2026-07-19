import 'dotenv/config'
import { createServer, type IncomingMessage, type ServerResponse } from 'node:http'
import { readFile, stat } from 'node:fs/promises'
import { extname, join, normalize } from 'node:path'
import { diagnoseAccount, ServiceError, serviceConfig, writeCopy } from './openai'
import type { AccountIntake, CopyRequest, PositioningReport } from '../src/assistant/types'

const port = Number(process.env.API_PORT || 8787)
const distDir = join(process.cwd(), 'dist')

function sendJson(response: ServerResponse, status: number, payload: unknown) {
  response.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
    'X-Content-Type-Options': 'nosniff',
  })
  response.end(JSON.stringify(payload))
}

async function readJson(request: IncomingMessage) {
  const chunks: Buffer[] = []
  let size = 0
  for await (const chunk of request) {
    const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk)
    size += buffer.length
    if (size > 20 * 1024 * 1024) throw new ServiceError('上传内容超过 20MB，请减少图片后重试。', 413)
    chunks.push(buffer)
  }
  try {
    return JSON.parse(Buffer.concat(chunks).toString('utf8')) as unknown
  } catch {
    throw new ServiceError('请求内容格式不正确。', 400)
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

async function handleApi(request: IncomingMessage, response: ServerResponse, pathname: string) {
  if (request.method === 'GET' && pathname === '/api/health') {
    sendJson(response, 200, serviceConfig())
    return
  }

  if (request.method === 'POST' && pathname === '/api/position') {
    const body = await readJson(request)
    if (!isRecord(body) || typeof body.creatorProfile !== 'string' || typeof body.petProfile !== 'string' || typeof body.goal !== 'string') {
      throw new ServiceError('请补充人物、宠物和账号目标。', 400)
    }
    sendJson(response, 200, await diagnoseAccount(body as AccountIntake))
    return
  }

  if (request.method === 'POST' && pathname === '/api/copy') {
    const body = await readJson(request)
    if (!isRecord(body) || !isRecord(body.report) || !isRecord(body.request) || typeof body.request.topic !== 'string') {
      throw new ServiceError('请先完成定位并填写本次文案主题。', 400)
    }
    sendJson(response, 200, await writeCopy(body.report as PositioningReport, body.request as CopyRequest))
    return
  }

  sendJson(response, 404, { error: '接口不存在。' })
}

const mimeTypes: Record<string, string> = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.ico': 'image/x-icon',
  '.jpg': 'image/jpeg',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
}

async function serveApp(response: ServerResponse, pathname: string) {
  const requested = pathname === '/' ? 'index.html' : pathname.replace(/^\/+/, '')
  const safePath = normalize(requested).replace(/^(\.\.[/\\])+/, '')
  let filePath = join(distDir, safePath)
  try {
    if (!(await stat(filePath)).isFile()) filePath = join(distDir, 'index.html')
  } catch {
    filePath = join(distDir, 'index.html')
  }
  try {
    const content = await readFile(filePath)
    response.writeHead(200, { 'Content-Type': mimeTypes[extname(filePath)] || 'application/octet-stream' })
    response.end(content)
  } catch {
    sendJson(response, 404, { error: '前端尚未构建，请先运行 pnpm build。' })
  }
}

const server = createServer(async (request, response) => {
  const pathname = new URL(request.url || '/', `http://${request.headers.host || 'localhost'}`).pathname
  try {
    if (pathname.startsWith('/api/')) await handleApi(request, response, pathname)
    else await serveApp(response, pathname)
  } catch (error) {
    const status = error instanceof ServiceError ? error.status : 500
    const message = error instanceof Error ? error.message : '服务发生未知错误。'
    sendJson(response, status, { error: message })
  }
})

server.listen(port, '0.0.0.0', () => {
  console.log(`PetIP API listening on http://127.0.0.1:${port}`)
})
