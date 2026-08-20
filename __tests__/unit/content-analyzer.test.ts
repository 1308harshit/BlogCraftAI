import { analyzeContent } from '@/lib/content-analyzer'

describe('analyzeContent', () => {
  it('returns bounded, transparent heuristic scores', () => {
    const analysis = analyzeContent({
      title: 'How to write a practical content strategy',
      keyword: 'content strategy',
      content: '# Introduction\n\nA content strategy helps teams publish useful work for the right reader. This short introduction explains the goal.\n\n## Research the audience\n\nStart with customer questions, then write clear answers. Include a real example and link to a source: https://example.com.\n\n## Build an outline\n\n- Define the reader\n- Choose one useful outcome\n- Review the draft\n\n## Publish and improve\n\nReview feedback after publishing and improve the next version.',
    })

    expect(analysis.overallScore).toBeGreaterThanOrEqual(0)
    expect(analysis.overallScore).toBeLessThanOrEqual(100)
    expect(analysis.breakdown.seo.maxScore).toBe(35)
    expect(analysis.breakdown.readability.maxScore).toBe(25)
    expect(analysis.seo.keywordDensity['content strategy']).toBeGreaterThan(0)
    expect(analysis.summary).toContain('heuristic')
  })
})
