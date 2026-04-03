import { useEffect, useRef, useState } from 'react'

export function useAutoScroll<T extends HTMLElement>(deps: unknown[]) {
  const ref = useRef<T>(null)
  const [isAtBottom, setIsAtBottom] = useState(true)
  const rafRef = useRef<number | undefined>(undefined)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const handleScroll = () => {
      const threshold = 100
      const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight < threshold
      setIsAtBottom(atBottom)
    }

    el.addEventListener('scroll', handleScroll, { passive: true })
    return () => el.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (isAtBottom && ref.current) {
      if (rafRef.current !== undefined) cancelAnimationFrame(rafRef.current)
      rafRef.current = requestAnimationFrame(() => {
        if (ref.current) {
          ref.current.scrollTop = ref.current.scrollHeight
        }
      })
    }
  }, deps)

  const scrollToBottom = () => {
    if (ref.current) {
      ref.current.scrollTo({ top: ref.current.scrollHeight, behavior: 'smooth' })
    }
  }

  return { ref, isAtBottom, scrollToBottom }
}
