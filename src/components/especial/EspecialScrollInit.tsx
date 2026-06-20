'use client'

import { useEffect } from 'react'

export default function EspecialScrollInit() {
  useEffect(() => {
    // Prevent browser from restoring scroll position on navigation
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual'
    document.documentElement.classList.remove('con-scroll')
    window.scrollTo(0, 0)

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement
            const delay = el.dataset.wowDelay ?? '0s'
            el.style.animationDelay = delay
            el.style.animationDuration = el.dataset.wowDuration ?? '1s'
            el.classList.add('animated')
            el.style.visibility = 'visible'
            observer.unobserve(el)
          }
        })
      },
      { rootMargin: '0px 0px -100px 0px' }
    )

    document.querySelectorAll('.wow').forEach((el) => observer.observe(el))

    return () => {
      observer.disconnect()
      document.documentElement.classList.remove('con-scroll')
    }
  }, [])

  return null
}
