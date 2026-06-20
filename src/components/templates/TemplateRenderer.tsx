'use client'

import dynamic from 'next/dynamic'
import type { Project, TemplateId } from '@/types/invitation'

type TemplateComponent = React.ComponentType<{ project: Project }>

const templateMap: Record<TemplateId, TemplateComponent> = {
  sobre: dynamic(() => import('./SobreTemplate')),
  esmeralda: dynamic(() => import('./EsmeraldaTemplate')),
  pink: dynamic(() => import('./PinkTemplate')),
  love: dynamic(() => import('./LoveTemplate')),
  zafiro: dynamic(() => import('./ZafiroTemplate')),
  elegance: dynamic(() => import('./EleganceTemplate')),
  hogwarts: dynamic(() => import('./HogwartsTemplate')),
  sellorosa: dynamic(() => import('./SelloRosaTemplate')),
  rosagold: dynamic(() => import('./RosaGoldTemplate')),
  magical: dynamic(() => import('./MagicalTemplate')),
  especial: dynamic(() => import('./EspecialTemplate')),
}

interface Props {
  project: Project
}

export function TemplateRenderer({ project }: Props) {
  const Component = templateMap[project.template]
  if (!Component) {
    return (
      <div className="p-8 text-center text-red-500">
        Template &quot;{project.template}&quot; no encontrado
      </div>
    )
  }
  return <Component project={project} />
}
