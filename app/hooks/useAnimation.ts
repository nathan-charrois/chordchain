import { useCallback, useEffect, useRef } from 'react'

type Props = {
  className: string
  isActive: boolean
}

export function useAnimation({ className, isActive }: Props) {
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
    if (isActive) {
      ref.current?.classList.remove(className)
      ref.current?.classList.add(className)
    }
    else {
      ref.current?.classList.remove(className)
    }
  }, [className, isActive])

  return { ref, animate }
}
