// Test all the new killer features
const BASE_URL = 'http://localhost:3001'

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m'
}

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`)
}

async function testSEOAnalyzer() {
  log('\n📊 Testing SEO Analyzer...', 'cyan')
  
  try {
    const response = await fetch(`${BASE_URL}/api/seo-score`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        content: `# How to Build a SaaS Business\n\n## Introduction\n\nBuilding a SaaS business requires planning and execution. This guide will help you succeed.\n\n## Key Steps\n\n### 1. Market Research\nUnderstand your target market and competition.\n\n### 2. Product Development\nBuild a minimum viable product (MVP).\n\n### 3. Marketing Strategy\nDevelop a comprehensive marketing plan.\n\n## Conclusion\n\nSuccess in SaaS requires dedication and the right strategy.`,
        keywords: 'SaaS, business, startup'
      })
    })

    const data = await response.json()
    
    if (response.ok) {
      log('✅ SEO Analyzer working!', 'green')
      log(`   Score: ${data.analysis.score}/100`, 'yellow')
      log(`   Word Count: ${data.wordCount}`, 'yellow')
      log(`   Reading Time: ${data.readingTime} min`, 'yellow')
      return true
    } else {
      log(`❌ SEO Analyzer failed: ${data.error}`, 'red')
      return false
    }
  } catch (error) {
    log(`❌ SEO Analyzer error: ${error.message}`, 'red')
    return false
  }
}

async function testContentRemix() {
  log('\n🎨 Testing Content Remix...', 'cyan')
  
  try {
    const response = await fetch(`${BASE_URL}/api/content-remix`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        content: 'Building a successful SaaS requires understanding your market, developing a great product, and executing effective marketing strategies.',
        format: 'twitter'
      })
    })

    const data = await response.json()
    
    if (response.ok) {
      log('✅ Content Remix working!', 'green')
      log(`   Format: ${data.format}`, 'yellow')
      log(`   Remixed length: ${data.remixedLength || 'N/A'} chars`, 'yellow')
      return true
    } else {
      log(`❌ Content Remix failed: ${data.error}`, 'red')
      return false
    }
  } catch (error) {
    log(`❌ Content Remix error: ${error.message}`, 'red')
    return false
  }
}

async function testCompetitorAnalysis() {
  log('\n🔍 Testing Competitor Analysis...', 'cyan')
  
  try {
    const response = await fetch(`${BASE_URL}/api/competitor-analysis`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        content: 'This is a sample article about SaaS business development and growth strategies.'
      })
    })

    const data = await response.json()
    
    if (response.ok) {
      log('✅ Competitor Analysis working!', 'green')
      log(`   Recommendations: ${data.recommendations?.length || 0}`, 'yellow')
      return true
    } else {
      log(`❌ Competitor Analysis failed: ${data.error}`, 'red')
      return false
    }
  } catch (error) {
    log(`❌ Competitor Analysis error: ${error.message}`, 'red')
    return false
  }
}

async function testVoiceToBlog() {
  log('\n🎙️ Testing Voice-to-Blog...', 'cyan')
  
  try {
    const response = await fetch(`${BASE_URL}/api/voice-to-blog`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        transcript: 'So I was thinking about how to build a successful SaaS business and I think the key is really understanding your customers and building something they actually want to pay for.'
      })
    })

    const data = await response.json()
    
    if (response.ok) {
      log('✅ Voice-to-Blog working!', 'green')
      log(`   Article length: ${data.wordCount} words`, 'yellow')
      log(`   Processing time: ${data.processingTime}`, 'yellow')
      return true
    } else {
      log(`❌ Voice-to-Blog failed: ${data.error}`, 'red')
      return false
    }
  } catch (error) {
    log(`❌ Voice-to-Blog error: ${error.message}`, 'red')
    return false
  }
}

async function testAIImages() {
  log('\n🎨 Testing AI Images...', 'cyan')
  
  try {
    const response = await fetch(`${BASE_URL}/api/ai-images`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        content: '# SaaS Business Guide\n\n## Market Research\n\nUnderstanding your market is crucial.\n\n## Product Development\n\nBuild what customers want.',
        imageCount: 3
      })
    })

    const data = await response.json()
    
    if (response.ok) {
      log('✅ AI Images working!', 'green')
      log(`   Images generated: ${data.totalGenerated}`, 'yellow')
      log(`   Prompts created: ${data.prompts?.length || 0}`, 'yellow')
      return true
    } else {
      log(`❌ AI Images failed: ${data.error}`, 'red')
      return false
    }
  } catch (error) {
    log(`❌ AI Images error: ${error.message}`, 'red')
    return false
  }
}

async function testAutoPublish() {
  log('\n🚀 Testing Auto-Publish...', 'cyan')
  
  try {
    const response = await fetch(`${BASE_URL}/api/auto-publish`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        content: '# Test Article\n\nThis is a test article for auto-publishing.',
        platforms: ['wordpress', 'medium'],
        configs: {
          wordpress: { siteUrl: 'https://example.com' },
          medium: {}
        }
      })
    })

    const data = await response.json()
    
    if (response.ok) {
      log('✅ Auto-Publish working!', 'green')
      log(`   Published: ${data.totalPublished}`, 'yellow')
      log(`   Failed: ${data.totalFailed}`, 'yellow')
      return true
    } else {
      log(`❌ Auto-Publish failed: ${data.error}`, 'red')
      return false
    }
  } catch (error) {
    log(`❌ Auto-Publish error: ${error.message}`, 'red')
    return false
  }
}

async function testStudioPage() {
  log('\n🚀 Testing Studio Page...', 'cyan')
  
  try {
    const response = await fetch(`${BASE_URL}/studio`)
    
    if (response.ok) {
      log('✅ Studio Page accessible!', 'green')
      return true
    } else {
      log(`❌ Studio Page failed: ${response.status}`, 'red')
      return false
    }
  } catch (error) {
    log(`❌ Studio Page error: ${error.message}`, 'red')
    return false
  }
}

async function runAllTests() {
  log('\n🔥 TESTING KILLER FEATURES', 'magenta')
  log('=' .repeat(50), 'blue')
  
  const results = []
  
  results.push({ name: 'Studio Page', passed: await testStudioPage() })
  results.push({ name: 'SEO Analyzer', passed: await testSEOAnalyzer() })
  results.push({ name: 'Content Remix', passed: await testContentRemix() })
  results.push({ name: 'Competitor Analysis', passed: await testCompetitorAnalysis() })
  results.push({ name: 'Voice-to-Blog', passed: await testVoiceToBlog() })
  results.push({ name: 'AI Images', passed: await testAIImages() })
  results.push({ name: 'Auto-Publish', passed: await testAutoPublish() })
  
  // Summary
  log('\n' + '='.repeat(50), 'blue')
  log('🎯 KILLER FEATURES TEST SUMMARY', 'magenta')
  log('='.repeat(50), 'blue')
  
  const passed = results.filter(r => r.passed).length
  const total = results.length
  
  results.forEach(result => {
    const icon = result.passed ? '✅' : '❌'
    const color = result.passed ? 'green' : 'red'
    log(`${icon} ${result.name}`, color)
  })
  
  log('\n' + '='.repeat(50), 'blue')
  log(`Results: ${passed}/${total} features working`, passed === total ? 'green' : 'yellow')
  log('='.repeat(50), 'blue')
  
  if (passed === total) {
    log('\n🎉 ALL KILLER FEATURES ARE WORKING!', 'green')
    log('🚀 BlogCraft AI is now REVOLUTIONARY!', 'green')
    log('💰 Ready to disrupt the content industry!', 'green')
  } else {
    log(`\n⚠️  ${total - passed} feature(s) need attention.`, 'yellow')
  }
  
  log('\n🔗 Test the Studio: http://localhost:3001/studio', 'cyan')
}

// Run tests
runAllTests().catch(error => {
  log(`\n❌ Fatal error: ${error.message}`, 'red')
  process.exit(1)
})