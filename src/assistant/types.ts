export type Platform = '抖音' | '小红书' | '视频号' | 'B站' | '快手' | '其他'

export type AccountIntake = {
  platform: Platform
  accountName: string
  profileUrl: string
  creatorProfile: string
  petProfile: string
  relationship: string
  contentStatus: string
  goal: string
  voiceSamples: string
  constraints: string
  images: string[]
}

export type WebSource = {
  title: string
  url: string
}

export type PositioningReport = {
  verdict: string
  stage: string
  confidence: '高' | '中' | '低'
  positioning: {
    title: string
    oneLiner: string
    audience: string
    value: string
    memoryPoint: string
    creatorRole: string
    petRole: string
    relationship: string
  }
  alternatives: Array<{
    title: string
    whyNotMain: string
  }>
  profile: {
    nameIdeas: string[]
    bio: string
    pinnedPosts: string[]
  }
  content: {
    mainLine: string
    secondaryLine: string
    contentRatio: string
    sevenDayTopics: Array<{
      day: string
      title: string
      format: string
      hook: string
      testGoal: string
    }>
  }
  commercialization: {
    priorityPath: string
    suitableCategories: string[]
    firstSample: string
  }
  evidence: {
    confirmed: string[]
    webFindings: string[]
    gaps: string[]
  }
  risks: string[]
  sources: WebSource[]
  generatedAt: string
}

export type CopyMode = '原生口播' | 'IP 观点' | '日常记录' | '电商转化'

export type CopyRequest = {
  mode: CopyMode
  topic: string
  objective: string
  product: string
  duration: string
  extraContext: string
}

export type CopyResult = {
  title: string
  hook: string
  body: string
  shotList: string[]
  caption: string
  aiTasteCheck: string[]
  sourceNotes: string[]
  sources: WebSource[]
  generatedAt: string
}

export type AnalysisRecord = {
  id: string
  createdAt: string
  intake: Omit<AccountIntake, 'images'>
  report: PositioningReport
}

export type ServiceHealth = {
  configured: boolean
  model: string
  webSearch: boolean
}

export const emptyIntake: AccountIntake = {
  platform: '抖音',
  accountName: '',
  profileUrl: '',
  creatorProfile: '',
  petProfile: '',
  relationship: '',
  contentStatus: '',
  goal: '',
  voiceSamples: '',
  constraints: '',
  images: [],
}

