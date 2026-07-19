import { describe, expect, it } from 'vitest'
import { reviewWriting } from './styleReview'

describe('reviewWriting', () => {
  it('flags generic and banned phrases', () => {
    const result = reviewWriting('在这个快节奏的时代，这款产品真的是天花板，闭眼入。')
    expect(result.genericPhraseScore).toBeGreaterThan(40)
    expect(result.detectedProblems).toEqual(expect.arrayContaining([
      '检测到模板化或禁用表达：“在这个快节奏的时代”',
      '检测到模板化或禁用表达：“天花板”',
      '检测到模板化或禁用表达：“闭眼入”',
    ]))
  })

  it('rewards concrete scene details', () => {
    const result = reviewWriting('Momo 28 公斤，坐进去以后后腿没有地方收，底板也往中间塌。')
    expect(result.detailDensityScore).toBeGreaterThanOrEqual(70)
    expect(result.genericPhraseScore).toBe(0)
  })
})
