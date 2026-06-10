import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface BrandMemory {
  niche: string
  writingStyle: string
  targetAudience: string
  brandTone: string
  seoGoals: string
}

export interface Project {
  id: string
  title: string
  content: string
  updatedAt: string
  seoScore?: number
}

interface WorkspaceState {
  brandMemory: BrandMemory | null
  projects: Project[]
  currentProjectId: string | null
  setBrandMemory: (memory: BrandMemory) => void
  setProjects: (projects: Project[]) => void
  addProject: (project: Project) => void
  updateProject: (id: string, updates: Partial<Project>) => void
  setCurrentProject: (id: string | null) => void
}

export const useWorkspaceStore = create<WorkspaceState>()(
  persist(
    (set) => ({
      brandMemory: null,
      projects: [],
      currentProjectId: null,
      setBrandMemory: (brandMemory) => set({ brandMemory }),
      setProjects: (projects) => set({ projects }),
      addProject: (project) =>
        set((s) => ({ projects: [project, ...s.projects], currentProjectId: project.id })),
      updateProject: (id, updates) =>
        set((s) => ({
          projects: s.projects.map((p) =>
            p.id === id ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p
          ),
        })),
      setCurrentProject: (currentProjectId) => set({ currentProjectId }),
    }),
    { name: 'blogcraft-workspace' }
  )
)
