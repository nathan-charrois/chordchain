import { useCallback, useEffect, useRef } from 'react'

type Props = {
  className: string
}

export function useAnimation({ className }: Props) {
  const ref = useRef<HTMLImageElement | null>(null)

  useEffect(() => {
    const handleEnd = () => {
      ref.current?.classList.forEach((c) => {
        if (c.startsWith('animate')) {
          ref.current?.classList.remove(c)
        }
      })
    }

    ref.current?.addEventListener('animationend', handleEnd)
    return () => {
      ref.current?.removeEventListener('animationend', handleEnd)
    }
  }, [ref.current])

  const animate = useCallback(() => {
    ref.current?.classList.remove(className)
    ref.current?.classList.add(className)
  }, [className])

  return { ref, animate }
}
