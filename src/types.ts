export type ProjectStatus = '定位中' | '内容生产' | '直播运营' | '待复盘' | '已暂停'

export interface ProjectSummary {
  id: string
  code: string
  name: string
  creator: string
  pet: string
  petRole: string
  image: string
  status: ProjectStatus
  progress: number
  lead: string
  nextAction: string
  due: string
  platforms: string[]
}

export interface QueueItem {
  id: string
  type: '审核' | '内容' | '直播' | '资料'
  title: string
  project: string
  owner: string
  due: string
  priority: '高' | '中' | '低'
}

export interface DiagnosticModule {
  name: string
  score: number
  evidence: string
  status: '完整' | '需补充'
}

export interface PositioningOption {
  id: 'stable' | 'different' | 'commerce'
  label: string
  shortLabel: string
  score: number
  positioning: string
  persona: string
  audience: string
  strategy: string
  liveFit: number
  difficulty: number
  advantage: string
  risk: string
  color: 'green' | 'coral' | 'gold'
}

export interface StyleScore {
  label: string
  value: number
  direction: 'higher' | 'lower'
}

export interface ContentDraft {
  id: string
  title: string
  project: string
  mode: '原生口播' | 'IP 观点' | '日常记录' | '电商转化'
  platform: string
  status: '待审校' | '待修改' | '待审核' | '已通过'
  updatedAt: string
  body: string
  aiBody: string
  styleScores: StyleScore[]
  issues: string[]
  suggestions: string[]
}

export interface ProductRow {
  id: string
  name: string
  role: '引流品' | '主推品' | '利润品' | '形象品' | '连带品'
  price: number
  ipFit: number
  liveFit: number
  margin: number
  refundRisk: '低' | '中' | '高'
  recommendation: '优先' | '推荐' | '测试' | '谨慎'
}

