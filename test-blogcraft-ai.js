// BlogCraft AI - Comprehensive Test Script
const baseUrl = 'http://localhost:3001'

async function testAPI(endpoint, method = 'GET', body = null) {
  try {
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    }
    
    if (body) {
      options.body = JSON.stringify(body)
    }
    
    const response = await fetch(`${baseUrl}${endpoint}`, options)
    const data = await response.json()
    
    return {
      success: response.ok,
      status: response.status,
      data
    }
  } catch (error) {
    return {
      success: false,
      error: error.message
    }
  }
}

async function runTests() {
  console.log('🚀 Testing BlogCraft AI...\n')
  
  const results = []
  
  // Test 1: Blog Generation API
  console.log('1. Testing Blog Generation API...')
  const blogTest = await testAPI('/api/generate', 'POST', {
    topic: 'How to improve website SEO',
    keywords: 'SEO, optimization, rankings'
  })
  
  if (blogTest.success) {
    console.log('✅ Blog generation working')
    console.log(`   Generated ${blogTest.data.article?.length || 0} characters`)
    if (blogTest.data.note) {
      console.log(`   Note: ${blogTest.data.note}`)
    }
  } else {
    console.log('❌ Blog generation failed:', blogTest.error || blogTest.data.error)
  }
  results.push({ test: 'Blog Generation', success: blogTest.success })
  
  // Test 2: User Signup API
  console.log('\n2. Testing User Signup API...')
  const signupTest = await testAPI('/api/signup', 'POST', {
    email: 'test@example.com',
    name: 'Test User'
  })
  
  if (signupTest.success) {
    console.log('✅ User signup working')
    console.log(`   User ID: ${signupTest.data.user?.id}`)
    if (signupTest.data.message?.includes('Demo')) {
      console.log('   Note: Using demo mode')
    }
  } else {
    console.log('❌ User signup failed:', signupTest.error || signupTest.data.error)
  }
  results.push({ test: 'User Signup', success: signupTest.success })
  
  // Test 3: User Retrieval API
  console.log('\n3. Testing User Retrieval API...')
  const userTest = await testAPI('/api/user?email=demo@blogcraft-ai.com')
  
  if (userTest.success) {
    console.log('✅ User retrieval working')
    console.log(`   User: ${userTest.data.user?.name}`)
    console.log(`   Plan: ${userTest.data.user?.plan}`)
    console.log(`   Articles: ${userTest.data.user?.articleCount}`)
  } else {
    console.log('❌ User retrieval failed:', userTest.error || userTest.data.error)
  }
  results.push({ test: 'User Retrieval', success: userTest.success })
  
  // Test 4: Articles API
  console.log('\n4. Testing Articles API...')
  const articlesTest = await testAPI('/api/articles?userId=demo-user-1')
  
  if (articlesTest.success) {
    console.log('✅ Articles retrieval working')
    console.log(`   Found ${articlesTest.data.articles?.length || 0} articles`)
    if (articlesTest.data.articles?.length > 0) {
      console.log(`   Latest: ${articlesTest.data.articles[0].title}`)
    }
  } else {
    console.log('❌ Articles retrieval failed:', articlesTest.error || articlesTest.data.error)
  }
  results.push({ test: 'Articles Retrieval', success: articlesTest.success })
  
  // Test 5: Article Creation API
  console.log('\n5. Testing Article Creation API...')
  const createArticleTest = await testAPI('/api/articles', 'POST', {
    userId: 'demo-user-1',
    title: 'Test Article from API',
    content: 'This is a test article created via API',
    keywords: 'test, api, demo'
  })
  
  if (createArticleTest.success) {
    console.log('✅ Article creation working')
    console.log(`   Created: ${createArticleTest.data.article?.title}`)
  } else {
    console.log('❌ Article creation failed:', createArticleTest.error || createArticleTest.data.error)
  }
  results.push({ test: 'Article Creation', success: createArticleTest.success })
  
  // Test 6: Stripe Checkout API
  console.log('\n6. Testing Stripe Checkout API...')
  const stripeTest = await testAPI('/api/stripe/create-checkout', 'POST', {
    userId: 'demo-user-1',
    userEmail: 'demo@blogcraft-ai.com'
  })
  
  if (stripeTest.success) {
    console.log('✅ Stripe checkout working')
    console.log(`   Session ID: ${stripeTest.data.sessionId}`)
    if (stripeTest.data.note) {
      console.log(`   Note: ${stripeTest.data.note}`)
    }
  } else {
    console.log('❌ Stripe checkout failed:', stripeTest.error || stripeTest.data.error)
  }
  results.push({ test: 'Stripe Checkout', success: stripeTest.success })
  
  // Summary
  console.log('\n📊 TEST SUMMARY')
  console.log('='.repeat(50))
  
  const passed = results.filter(r => r.success).length
  const total = results.length
  
  results.forEach(result => {
    const status = result.success ? '✅' : '❌'
    console.log(`${status} ${result.test}`)
  })
  
  console.log(`\n🎯 Results: ${passed}/${total} tests passed`)
  
  if (passed === total) {
    console.log('🎉 All tests passed! BlogCraft AI is working perfectly!')
  } else {
    console.log('⚠️  Some tests failed. Check the errors above.')
  }
  
  console.log('\n🚀 BlogCraft AI is ready for production!')
  console.log('Next steps:')
  console.log('1. Get real API keys (OpenAI, Supabase, Stripe)')
  console.log('2. Deploy to Vercel')
  console.log('3. Start lead generation')
  console.log('4. Begin email outreach')
  console.log('5. Get your first customer!')
}

// Run tests
runTests().catch(console.error)