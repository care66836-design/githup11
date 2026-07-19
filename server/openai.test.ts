import { describe, expect, it } from 'vitest'
import { extractOpenAIResponse } from './openai'

describe('OpenAI response parsing', () => {
  it('extracts structured JSON and deduplicates web citations', () => {
    const response = extractOpenAIResponse({
      output: [{
        type: 'message',
        content: [{
          type: 'output_text',
          text: '{"verdict":"可测试"}',
          annotations: [
            { type: 'url_citation', url: 'https://example.com/a', title: '资料 A' },
            { type: 'url_citation', url: 'https://example.com/a', title: '资料 A' },
          ],
        }],
      }],
    })

    expect(response.data).toEqual({ verdict: '可测试' })
    expect(response.sources).toEqual([{ url: 'https://example.com/a', title: '资料 A' }])
  })
})

