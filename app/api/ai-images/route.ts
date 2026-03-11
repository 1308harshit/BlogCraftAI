import { NextRequest, NextResponse } from 'next/server'

// Mock image generation - in production you'd use DALL-E, Midjourney, or Stable Diffusion
async function generateImage(prompt: string, style: string = 'realistic'): Promise<string> {
  // Demo URLs - in production, these would be real generated images
  const demoImages = [
    'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1676299081847-824916de030a?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1675557009230-1bb5d7b9b8b8?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1674027444485-cec3da58eef4?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1673844969019-c99b0c933e90?w=800&h=600&fit=crop'
  ]
  
  return demoImages[Math.floor(Math.random() * demoImages.length)]
}

function extractImagePrompts(content: string): string[] {
  const prompts = []
  
  // Extract title for featured image
  const titleMatch = content.match(/^#\s+(.+)$/m)
  if (titleMatch) {
    prompts.push(`Professional illustration representing: ${titleMatch[1]}`)
  }
  
  // Extract section headings for section images
  const headings = content.match(/^##\s+(.+)$/gm)
  if (headings) {
    headings.slice(0, 3).forEach(heading => {
      const cleanHeading = heading.replace('##', '').trim()
      prompts.push(`Modern graphic illustrating: ${cleanHeading}`)
    })
  }
  
  // Add generic prompts based on content themes
  if (content.toLowerCase().includes('business')) {
    prompts.push('Professional business concept illustration')
  }
  if (content.toLowerCase().includes('technology')) {
    prompts.push('Modern technology and innovation graphic')
  }
  if (content.toLowerCase().includes('health')) {
    prompts.push('Clean healthcare and wellness illustration')
  }
  
  return prompts.slice(0, 5) // Limit to 5 images
}

export async function POST(request: NextRequest) {
  try {
    const { content, imageCount = 3, style = 'realistic' } = await request.json()

    if (!content) {
      return NextResponse.json(
        { error: 'Content is required' },
        { status: 400 }
      )
    }

    const prompts = extractImagePrompts(content)
    const limitedPrompts = prompts.slice(0, imageCount)
    
    const images = []
    
    for (let i = 0; i < limitedPrompts.length; i++) {
      const prompt = limitedPrompts[i]
      try {
        const imageUrl = await generateImage(prompt, style)
        images.push({
          id: `img_${i + 1}`,
          prompt,
          url: imageUrl,
          altText: prompt,
          suggested_placement: i === 0 ? 'featured' : `section_${i}`,
          style
        })
      } catch (error) {
        console.error(`Failed to generate image for prompt: ${prompt}`, error)
      }
    }

    return NextResponse.json({
      images,
      totalGenerated: images.length,
      prompts: limitedPrompts,
      note: 'Demo mode - using Unsplash images. Add DALL-E API key for real AI generation',
      suggestions: [
        'Use the featured image at the top of your article',
        'Place section images before relevant headings',
        'Add proper alt text for SEO',
        'Optimize image sizes for web performance'
      ]
    })
  } catch (error) {
    console.error('AI image generation error:', error)
    return NextResponse.json(
      { error: 'Failed to generate images' },
      { status: 500 }
    )
  }
}