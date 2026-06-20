'use client'

import { useEffect } from 'react'

export default function EspecialScrollInit() {
  useEffect(() => {
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
    return () => observer.disconnect()
  }, [])

  return null
}
