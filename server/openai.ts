import type { AccountIntake, CopyRequest, CopyResult, PositioningReport, WebSource } from '../src/assistant/types'

const OPENAI_URL = 'https://api.openai.com/v1/responses'
const DEFAULT_MODEL = 'gpt-5.6'

type JsonObject = Record<string, unknown>

export class ServiceError extends Error {
  status: number

  constructor(message: string, status = 500) {
    super(message)
    this.status = status
  }
}

export function serviceConfig() {
  return {
    configured: Boolean(process.env.OPENAI_API_KEY),
    model: process.env.OPENAI_MODEL || DEFAULT_MODEL,
    webSearch: true,
  }
}

const stringArray = { type: 'array', items: { type: 'string' } }

const positioningSchema = {
  type: 'object',
  additionalProperties: false,
  required: ['verdict', 'stage', 'confidence', 'positioning', 'alternatives', 'profile', 'content', 'commercialization', 'evidence', 'risks'],
  properties: {
    verdict: { type: 'string' },
    stage: { type: 'string' },
    confidence: { type: 'string', enum: ['高', '中', '低'] },
    positioning: {
      type: 'object',
      additionalProperties: false,
      required: ['title', 'oneLiner', 'audience', 'value', 'memoryPoint', 'creatorRole', 'petRole', 'relationship'],
      properties: {
        title: { type: 'string' },
        oneLiner: { type: 'string' },
        audience: { type: 'string' },
        value: { type: 'string' },
        memoryPoint: { type: 'string' },
        creatorRole: { type: 'string' },
        petRole: { type: 'string' },
        relationship: { type: 'string' },
      },
    },
    alternatives: {
      type: 'array',
      minItems: 2,
      maxItems: 2,
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['title', 'whyNotMain'],
        properties: { title: { type: 'string' }, whyNotMain: { type: 'string' } },
      },
    },
    profile: {
      type: 'object',
      additionalProperties: false,
      required: ['nameIdeas', 'bio', 'pinnedPosts'],
      properties: {
        nameIdeas: { ...stringArray, minItems: 3, maxItems: 3 },
        bio: { type: 'string' },
        pinnedPosts: { ...stringArray, minItems: 3, maxItems: 3 },
      },
    },
    content: {
      type: 'object',
      additionalProperties: false,
      required: ['mainLine', 'secondaryLine', 'contentRatio', 'sevenDayTopics'],
      properties: {
        mainLine: { type: 'string' },
        secondaryLine: { type: 'string' },
        contentRatio: { type: 'string' },
        sevenDayTopics: {
          type: 'array',
          minItems: 7,
          maxItems: 7,
          items: {
            type: 'object',
            additionalProperties: false,
            required: ['day', 'title', 'format', 'hook', 'testGoal'],
            properties: {
              day: { type: 'string' },
              title: { type: 'string' },
              format: { type: 'string' },
              hook: { type: 'string' },
              testGoal: { type: 'string' },
            },
          },
        },
      },
    },
    commercialization: {
      type: 'object',
      additionalProperties: false,
      required: ['priorityPath', 'suitableCategories', 'firstSample'],
      properties: {
        priorityPath: { type: 'string' },
        suitableCategories: stringArray,
        firstSample: { type: 'string' },
      },
    },
    evidence: {
      type: 'object',
      additionalProperties: false,
      required: ['confirmed', 'webFindings', 'gaps'],
      properties: { confirmed: stringArray, webFindings: stringArray, gaps: stringArray },
    },
    risks: stringArray,
  },
}

const copySchema = {
  type: 'object',
  additionalProperties: false,
  required: ['title', 'hook', 'body', 'shotList', 'caption', 'aiTasteCheck', 'sourceNotes'],
  properties: {
    title: { type: 'string' },
    hook: { type: 'string' },
    body: { type: 'string' },
    shotList: stringArray,
    caption: { type: 'string' },
    aiTasteCheck: stringArray,
    sourceNotes: stringArray,
  },
}

function isObject(value: unknown): value is JsonObject {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function parseJson(text: string) {
  const cleaned = text.trim().replace(/^```json\s*/i, '').replace(/\s*```$/, '')
  try {
    return JSON.parse(cleaned) as JsonObject
  } catch {
    throw new ServiceError('AI 返回了无法识别的内容，请重新生成。', 502)
  }
}

export function extractOpenAIResponse(payload: unknown) {
  if (!isObject(payload) || !Array.isArray(payload.output)) {
    throw new ServiceError('AI 响应格式异常，请重新生成。', 502)
  }

  const textParts: string[] = []
  const sourceMap = new Map<string, WebSource>()

  for (const item of payload.output) {
    if (!isObject(item) || item.type !== 'message' || !Array.isArray(item.content)) continue
    for (const content of item.content) {
      if (!isObject(content) || content.type !== 'output_text' || typeof content.text !== 'string') continue
      textParts.push(content.text)
      if (!Array.isArray(content.annotations)) continue
      for (const annotation of content.annotations) {
        if (!isObject(annotation) || annotation.type !== 'url_citation' || typeof annotation.url !== 'string') continue
        sourceMap.set(annotation.url, {
          url: annotation.url,
          title: typeof annotation.title === 'string' ? annotation.title : annotation.url,
        })
      }
    }
  }

  if (textParts.length === 0) throw new ServiceError('AI 没有生成内容，请重新尝试。', 502)
  return { data: parseJson(textParts.join('\n')), sources: [...sourceMap.values()] }
}

async function callOpenAI(input: JsonObject, schemaName: string, schema: JsonObject) {
  const { configured, model } = serviceConfig()
  if (!configured) {
    throw new ServiceError('尚未配置 OpenAI API 密钥。请在 .env 中加入 OPENAI_API_KEY 后重启服务。', 503)
  }

  const response = await fetch(OPENAI_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      reasoning: { effort: 'medium' },
      tools: [{ type: 'web_search' }],
      input: [input],
      text: {
        format: {
          type: 'json_schema',
          name: schemaName,
          strict: true,
          schema,
        },
      },
    }),
  })

  const payload = await response.json().catch(() => null) as unknown
  if (!response.ok) {
    const apiMessage = isObject(payload) && isObject(payload.error) && typeof payload.error.message === 'string'
      ? payload.error.message
      : 'OpenAI 服务请求失败。'
    const message = response.status === 401
      ? 'OpenAI API 密钥无效，请检查 .env 配置。'
      : response.status === 429
        ? 'OpenAI 请求额度不足或过于频繁，请稍后重试。'
        : apiMessage
    throw new ServiceError(message, response.status >= 500 ? 502 : response.status)
  }

  return extractOpenAIResponse(payload)
}

function positioningInstructions() {
  return `你是宠物账号定位顾问。根据用户资料和公开网页完成一份可执行的“定位与试训规划”。

必须遵守：
1. 只使用用户明确提供的事实和可访问的公开信息；不得登录平台、绕过权限或编造数据。
2. 区分“用户确认”“公开观察”“仍需补充”。无法确认账号本体时，把联网观察留空并说明缺口。
3. 不把宠物行为动机脑补成事实。例如“叼牵引绳”是行为，“催主人出门”只能作为待验证表达。
4. 比较两个备选定位，但最终只选择一个主定位。主定位要兼顾真实性、记忆度、可持续拍摄、目标用户价值和商业承接。
5. 给出 7 天可证伪测试，不因为一条作品就宣布定位成立。
6. 语言具体、克制、像资深策划写给执行者，不写空洞的营销套话。
7. 联网重点核对账号公开主页、平台内容生态、对标类型和可能变化的规则；引用会由系统单独展示。
8. 涉及健康、训练或产品安全时保持谨慎，不给医疗诊断，不建议让宠物承担危险表演。`
}

export async function diagnoseAccount(intake: AccountIntake): Promise<PositioningReport> {
  const images = Array.isArray(intake.images) ? intake.images : []
  const content: JsonObject[] = [
    {
      type: 'input_text',
      text: `${positioningInstructions()}\n\n用户资料：\n${JSON.stringify({ ...intake, images: undefined }, null, 2)}`,
    },
    ...images.map((image) => ({ type: 'input_image', image_url: image })),
  ]
  const { data, sources } = await callOpenAI(
    { role: 'user', content },
    'petip_positioning',
    positioningSchema,
  )

  return { ...data, sources, generatedAt: new Date().toISOString() } as PositioningReport
}

function copyInstructions(mode: CopyRequest['mode']) {
  const modeRules: Record<CopyRequest['mode'], string> = {
    '原生口播': '允许不完整句、停顿和少量重复；每段只讲一个意思，读出来必须自然。',
    'IP 观点': '给出清晰判断，结合真实身份和具体场景；不做无依据的过度争议。',
    '日常记录': '优先写动作、细节和情绪；不知识灌输，不强行总结或升华。',
    '电商转化': '先写真实使用场景和购买顾虑，再写产品；不堆卖点，不使用电视购物式叫卖。',
  }
  return `你是宠物账号文案编导。文案必须继承账号定位、人物身份、宠物角色和用户提供的真实表达样本。

当前模式：${mode}。${modeRules[mode]}

完成初稿后单独检查并改掉：泛用的“你有没有发现”、滥用“不是而是”、排比过多、结构过整齐、抽象形容词、虚假焦虑、强行升华、“首先其次最后”、客户平时不会说的词，以及对宠物行为动机的编造。

联网只用于核对当前平台信息、公开规则、产品事实或用户主题中的时效信息。无法确认的内容不要写成事实。输出必须是可以直接拍摄的中文文案。`
}

export async function writeCopy(report: PositioningReport, request: CopyRequest): Promise<CopyResult> {
  const { data, sources } = await callOpenAI(
    {
      role: 'user',
      content: [{
        type: 'input_text',
        text: `${copyInstructions(request.mode)}\n\n账号定位：\n${JSON.stringify(report, null, 2)}\n\n本次需求：\n${JSON.stringify(request, null, 2)}`,
      }],
    },
    'petip_copy',
    copySchema,
  )

  return { ...data, sources, generatedAt: new Date().toISOString() } as CopyResult
}
