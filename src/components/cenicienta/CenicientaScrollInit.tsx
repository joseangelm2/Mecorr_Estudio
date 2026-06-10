'use client'

import { useEffect } from 'react'

export default function CenicientaScrollInit() {
  useEffect(() => {
    const classMap: Record<string, string> = {
      'show-p-y': 'active-p-y',
      'show-n-x': 'active-n-x',
      'show-p-x': 'active-p-x',
      'show': 'active',
    }

    const selectors = Object.keys(classMap).map(c => `.${c}`).join(', ')

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target
            for (const [showClass, activeClass] of Object.entries(classMap)) {
              if (el.classList.contains(showClass)) {
                el.classList.add(activeClass)
                observer.unobserve(el)
                break
              }
            }
          }
        })
      },
      { threshold: 0.1 }
    )

    if ('scrollRestoration' in history) history.scrollRestoration = 'manual'
    window.scrollTo(0, 0)
    document.querySelectorAll(selectors).forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  return null
}
