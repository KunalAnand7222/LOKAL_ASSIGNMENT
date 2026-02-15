import { useEffect, useRef, useState } from 'react'

export const useSessionTimer = () => {
  const [duration, setDuration] = useState(0)
  const startRef = useRef(Date.now())
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setDuration(Math.floor((Date.now() - startRef.current) / 1000))
    }, 1000)

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [])

  const formatTime = () => {
    const minutes = Math.floor(duration / 60)
    const seconds = duration % 60
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
  }

  return { formatTime }
}
