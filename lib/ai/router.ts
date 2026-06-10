import OpenAI from 'openai'
import { GoogleGenerativeAI } from '@google/generative-ai'

export type AIProvider = 'openai' | 'gemini'
export type AITask = 'write' | 'rewrite' | 'summarize' | 'expand' | 'seo' | 'research' | 'outline'

export interface AIRequest {
  task: AITask
  prompt: string
  system?: string
  maxTokens?: number
  temperature?: number
}

export interface AIResponse {
  content: string
  provider: AIProvider
  model: string
}

function getOpenAI() {
  const key = process.env.OPENAI_API_KEY
  if (!key) return null
  return new OpenAI({ apiKey: key })
}

function getGemini() {
  const key = process.env.GOOGLE_GENERATIVE_AI_API_KEY
  if (!key) return null
  return new GoogleGenerativeAI(key)
}

export async function routeAI(request: AIRequest): Promise<AIResponse> {
  const openai = getOpenAI()
  const gemini = getGemini()

  const system =
    request.system ||
    'You are BlogCraft AI, an expert content strategist and SEO writer. Produce clear, engaging, publication-ready content.'

  if (openai) {
    try {
      const completion = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: system },
          { role: 'user', content: request.prompt },
        ],
        max_tokens: request.maxTokens ?? 4096,
        temperature: request.temperature ?? 0.7,
      })
      const content = completion.choices[0]?.message?.content ?? ''
      if (content) {
        return { content, provider: 'openai', model: 'gpt-4o-mini' }
      }
    } catch (e) {
      console.error('OpenAI error:', e)
    }
  }

  if (gemini) {
    try {
      const model = getGemini()!.getGenerativeModel({ model: 'gemini-2.0-flash' })
      const result = await model.generateContent(`${system}\n\n${request.prompt}`)
      const content = result.response.text()
      if (content) {
        return { content, provider: 'gemini', model: 'gemini-2.0-flash' }
      }
    } catch (e) {
      console.error('Gemini error:', e)
    }
  }

  return {
    content: generateFallback(request),
    provider: 'openai',
    model: 'fallback',
  }
}

function generateFallback(request: AIRequest): string {
  return `## Generated Content (Demo Mode)

Add \`OPENAI_API_KEY\` or \`GOOGLE_GENERATIVE_AI_API_KEY\` to enable live AI.

**Task:** ${request.task}

${request.prompt.slice(0, 500)}...

---

*Configure API keys in .env.local for production AI generation.*`
}

export const AI_TASK_PROMPTS: Record<AITask, string> = {
  write: 'Write a comprehensive, SEO-optimized article.',
  rewrite: 'Rewrite the following content to improve clarity and engagement while preserving meaning.',
  summarize: 'Summarize the following content concisely with key takeaways.',
  expand: 'Expand the following content with more detail, examples, and depth.',
  seo: 'Optimize the following content for SEO. Return improved version with meta title and description.',
  research: 'Research and provide structured insights, outline, and key points for the topic.',
  outline: 'Create a detailed blog outline with H2/H3 headings and brief descriptions.',
}
