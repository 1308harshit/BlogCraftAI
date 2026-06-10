'use client'

import { useEffect, useRef } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { useWorkspaceStore, type BrandMemory, type Project } from '@/stores/workspace-store'

export function WorkspaceHydrator() {
  const router = useRouter()
  const pathname = usePathname()
  const hydrated = useRef(false)
  const setBrandMemory = useWorkspaceStore((s) => s.setBrandMemory)
  const setProjects = useWorkspaceStore((s) => s.setProjects)

  useEffect(() => {
    if (hydrated.current) return
    hydrated.current = true

    Promise.all([
      fetch('/api/workspace/brand-memory').then((r) => r.json()),
      fetch('/api/workspace/projects').then((r) => r.json()),
    ])
      .then(([brandRes, projectsRes]) => {
        if (brandRes.brandMemory) {
          setBrandMemory(brandRes.brandMemory as BrandMemory)
        }

        if (projectsRes.projects?.length) {
          setProjects(projectsRes.projects as Project[])
        }

        const needsOnboarding =
          brandRes.onboardingCompleted === false &&
          pathname.startsWith('/dashboard')

        if (needsOnboarding) {
          router.replace('/onboarding')
        }
      })
      .catch(() => {
        // Offline or DB not configured — local store still works
      })
  }, [pathname, router, setBrandMemory, setProjects])

  return null
}
