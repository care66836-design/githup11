const genericPatterns = ['你有没有发现', '不是', '而是', '真正的', '首先', '其次', '最后', '在这个快节奏的时代', '闭眼入', '天花板']

export interface WritingReview {
  genericPhraseScore: number
  detailDensityScore: number
  detectedProblems: string[]
}

export function reviewWriting(text: string): WritingReview {
  const hits = genericPatterns.filter((pattern) => text.includes(pattern))
  const concreteSignals = (text.match(/\d+|公斤|分钟|厘米|今天|昨天|地铁|开车|后腿|底板/g) ?? []).length
  const genericPhraseScore = Math.min(100, hits.length * 18)
  const detailDensityScore = Math.min(100, 30 + concreteSignals * 10)
  const detectedProblems = hits.map((hit) => `检测到模板化或禁用表达：“${hit}”`)

  if (text.length > 0 && concreteSignals === 0) detectedProblems.push('缺少可观察的场景、动作或数据。')
  if (/更加美好|意义非凡|温暖与陪伴/.test(text)) detectedProblems.push('结尾可能存在空泛升华。')

  return { genericPhraseScore, detailDensityScore, detectedProblems }
}

