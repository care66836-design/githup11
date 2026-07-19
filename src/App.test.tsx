import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import App from './App'
import type { PositioningReport } from './assistant/types'

const report: PositioningReport = {
  verdict: '人物和宠物关系真实，适合进入 7 天内容测试。',
  stage: '方向测试期',
  confidence: '中',
  positioning: {
    title: '城市带狗出行搭档',
    oneLiner: '一个宠物品牌主理人和边牧搭档，实测城市养狗出行中的真实问题。',
    audience: '经常带狗出门的城市养宠人',
    value: '少踩坑，获得可执行的出行经验',
    memoryPoint: '计划周密的主人和总会制造变量的边牧',
    creatorRole: '负责验证和给出判断的主理人',
    petRole: '提供真实使用反馈的出行搭档',
    relationship: '一起通勤和旅行的搭档关系',
  },
  alternatives: [
    { title: '宠物用品测评', whyNotMain: '范围过宽。' },
    { title: '边牧日常', whyNotMain: '用户价值不够明确。' },
  ],
  profile: {
    nameIdeas: ['林晚和 Momo 出门了', 'Momo 出行实测', '林晚的带狗清单'],
    bio: '宠物用品主理人，和 Momo 实测城市带狗出行。',
    pinnedPosts: ['我们是谁', '第一次高铁实测', '出行清单'],
  },
  content: {
    mainLine: '城市带狗出行实测',
    secondaryLine: '主理人产品判断',
    contentRatio: '主线 70%，副线 30%',
    sevenDayTopics: Array.from({ length: 7 }, (_, index) => ({
      day: `Day ${index + 1}`,
      title: `测试选题 ${index + 1}`,
      format: '原生口播',
      hook: '先给结论',
      testGoal: '验证收藏率',
    })),
  },
  commercialization: {
    priorityPath: '先积累出行场景信任，再承接用品实测。',
    suitableCategories: ['牵引', '车载用品'],
    firstSample: '车载垫真实清洁测试',
  },
  evidence: {
    confirmed: ['主人是宠物品牌主理人'],
    webFindings: [],
    gaps: ['缺少近 30 天作品数据'],
  },
  risks: ['不要把宠物行为动机写成事实'],
  sources: [],
  generatedAt: '2026-07-20T00:00:00.000Z',
}

function mockApi() {
  return vi.fn(async (input: RequestInfo | URL) => {
    const url = String(input)
    if (url.endsWith('/api/health')) {
      return { ok: true, json: async () => ({ configured: true, model: 'gpt-5.6', webSearch: true }) }
    }
    if (url.endsWith('/api/position')) {
      return { ok: true, json: async () => report }
    }
    return { ok: false, json: async () => ({ error: '未模拟接口' }) }
  })
}

describe('PetIP account assistant', () => {
  beforeEach(() => {
    window.localStorage.clear()
    vi.stubGlobal('fetch', mockApi())
  })

  afterEach(() => {
    cleanup()
    vi.unstubAllGlobals()
  })

  it('renders only the positioning and copy workflows', async () => {
    render(<App />)

    expect(screen.getByRole('heading', { name: '这个账号是什么样？' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '账号定位' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '文案助手' })).toBeInTheDocument()
    expect(await screen.findByText('联网可用')).toBeInTheDocument()
  })

  it('generates positioning from the supplied information', async () => {
    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: '填入示例' }))
    fireEvent.click(screen.getByRole('button', { name: '联网生成账号定位' }))

    expect(await screen.findByRole('heading', { name: '城市带狗出行搭档' })).toBeInTheDocument()
    expect(screen.getByText('一个宠物品牌主理人和边牧搭档，实测城市养狗出行中的真实问题。')).toBeInTheDocument()
    await waitFor(() => expect(window.localStorage.getItem('petip.simple.report')).toContain('城市带狗出行搭档'))
  })

  it('keeps copy generation dependent on a completed positioning', () => {
    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: '文案助手' }))

    expect(screen.getByRole('heading', { name: '文案需要知道这个账号是谁' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '返回账号定位' })).toBeInTheDocument()
  })
})
