// Quick test for the content analyzer API
async function testAnalyzer() {
  const testContent = {
    title: "10 Proven Strategies to Boost Your Content Marketing in 2024",
    content: `# Introduction

Content marketing is essential for modern businesses. In this comprehensive guide, we'll explore proven strategies that actually work.

## Strategy 1: Understand Your Audience

Before creating content, you need to deeply understand who you're writing for. Research your target audience's pain points, interests, and preferences.

## Strategy 2: Create High-Quality Content

Quality beats quantity every time. Focus on creating content that provides real value to your readers.

- Research thoroughly
- Write clearly
- Edit ruthlessly

## Strategy 3: Optimize for SEO

Search engine optimization helps your content reach more people. Use relevant keywords naturally and structure your content properly.

## Strategy 4: Promote Strategically

Great content needs promotion. Share on social media, engage with your community, and build relationships.

## Strategy 5: Measure and Iterate

Track your content performance and adjust your strategy based on data. Use analytics to understand what works.

## Conclusion

Content marketing success requires consistent effort and strategic thinking. Implement these strategies and watch your results improve.`,
    keyword: "content marketing"
  };

  console.log('Testing Content Analyzer API...\n');
  
  try {
    const response = await fetch('http://localhost:3000/api/analyze-content', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testContent)
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${await response.text()}`);
    }

    const analysis = await response.json();
    
    console.log('✅ API Response Successful!\n');
    console.log('📊 Overall Score:', analysis.overallScore, '/100\n');
    console.log('📈 Breakdown:');
    console.log('  - SEO:', analysis.breakdown.seo.score, '/', analysis.breakdown.seo.maxScore);
    console.log('  - Readability:', analysis.breakdown.readability.score, '/', analysis.breakdown.readability.maxScore);
    console.log('  - Engagement:', analysis.breakdown.engagement.score, '/', analysis.breakdown.engagement.maxScore);
    console.log('  - Structure:', analysis.breakdown.structure.score, '/', analysis.breakdown.structure.maxScore);
    console.log('\n💡 Summary:', analysis.summary);
    console.log('\n📝 Top Recommendations:');
    analysis.recommendations.slice(0, 3).forEach((rec, i) => {
      console.log(`  ${i + 1}. [${rec.priority.toUpperCase()}] ${rec.title}: ${rec.description}`);
    });
    console.log('\n✅ Test PASSED - Analyzer is working correctly!');
    
  } catch (error) {
    console.error('❌ Test FAILED:', error.message);
    process.exit(1);
  }
}

testAnalyzer();
