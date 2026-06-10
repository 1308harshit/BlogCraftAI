import { createServerSupabase } from '@/lib/supabase/client'

export interface DbProject {
  id: string
  user_id: string
  title: string
  content: string
  content_type: string
  seo_score: number | null
  status: 'draft' | 'published' | 'archived'
  created_at: string
  updated_at: string
}

export async function listProjects(profileId: string): Promise<DbProject[]> {
  const supabase = createServerSupabase()
  if (!supabase) return []

  const { data } = await supabase
    .from('projects')
    .select('*')
    .eq('user_id', profileId)
    .order('updated_at', { ascending: false })

  return (data ?? []) as DbProject[]
}

export async function upsertProject(
  profileId: string,
  project: { id?: string; title: string; content: string; seo_score?: number; content_type?: string }
): Promise<DbProject | null> {
  const supabase = createServerSupabase()
  if (!supabase) return null

  const payload = {
    user_id: profileId,
    title: project.title,
    content: project.content,
    seo_score: project.seo_score ?? null,
    content_type: project.content_type ?? 'blog',
    updated_at: new Date().toISOString(),
  }

  if (project.id) {
    const { data, error } = await supabase
      .from('projects')
      .update(payload)
      .eq('id', project.id)
      .eq('user_id', profileId)
      .select()
      .single()
    if (error) {
      console.error('upsertProject update:', error)
      return null
    }
    return data as DbProject
  }

  const { data, error } = await supabase.from('projects').insert(payload).select().single()
  if (error) {
    console.error('upsertProject insert:', error)
    return null
  }
  return data as DbProject
}

export async function deleteProject(profileId: string, projectId: string) {
  const supabase = createServerSupabase()
  if (!supabase) return false
  const { error } = await supabase.from('projects').delete().eq('id', projectId).eq('user_id', profileId)
  return !error
}
