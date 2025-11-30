'use client'

import { useEffect, useRef, useState } from 'react'

const DEFAULT_SIZE = 420
const EDGE_PADDING = 32
const SMOOTHING = 0.08

export function FloatingGlow() {
  const glowRef = useRef<HTMLDivElement | null>(null)
  const [position, setPosition] = useState({ top: 0, left: 0 })
  const animationRef = useRef<number | null>(null)
  const targetRef = useRef<{ x: number; y: number } | null>(null)
  const currentPositionRef = useRef({ top: 0, left: 0 })

  useEffect(() => {
    const clamp = (value: number, min: number, max: number) =>
      Math.min(Math.max(value, min), max)

    const setTargetToCenter = () => {
      targetRef.current = {
        x: window.innerWidth / 2,
        y: window.innerHeight / 2,
      }
    }

    const applyPosition = (nextTop: number, nextLeft: number) => {
      currentPositionRef.current = { top: nextTop, left: nextLeft }
      setPosition((prev) => {
        const diffTop = Math.abs(prev.top - nextTop)
        const diffLeft = Math.abs(prev.left - nextLeft)
        if (diffTop < 0.1 && diffLeft < 0.1) {
          return prev
        }
        return { top: nextTop, left: nextLeft }
      })
    }

    const animate = () => {
      const target = targetRef.current
      if (target) {
        const glowWidth = glowRef.current?.offsetWidth ?? DEFAULT_SIZE
        const glowHeight = glowRef.current?.offsetHeight ?? DEFAULT_SIZE

        const minLeft = EDGE_PADDING
        const maxLeft = Math.max(EDGE_PADDING, window.innerWidth - glowWidth - EDGE_PADDING)
        const minTop = EDGE_PADDING
        const maxTop = Math.max(EDGE_PADDING, window.innerHeight - glowHeight - EDGE_PADDING)

        const desiredLeft = clamp(target.x - glowWidth / 2, minLeft, maxLeft)
        const desiredTop = clamp(target.y - glowHeight / 2, minTop, maxTop)

        const current = currentPositionRef.current
        const nextLeft = current.left + (desiredLeft - current.left) * SMOOTHING
        const nextTop = current.top + (desiredTop - current.top) * SMOOTHING

        applyPosition(nextTop, nextLeft)
      }

      animationRef.current = window.requestAnimationFrame(animate)
    }

    const handlePointerMove = (event: PointerEvent) => {
      targetRef.current = { x: event.clientX, y: event.clientY }
      if (animationRef.current === null) {
        animationRef.current = window.requestAnimationFrame(animate)
      }
    }

    const handlePointerLeave = () => {
      setTargetToCenter()
    }

    const handleResize = () => {
      setTargetToCenter()
    }

    setTargetToCenter()
    animationRef.current = window.requestAnimationFrame(animate)
    window.addEventListener('pointermove', handlePointerMove)
    window.addEventListener('pointerleave', handlePointerLeave)
    window.addEventListener('resize', handleResize)

    return () => {
      if (animationRef.current !== null) {
        window.cancelAnimationFrame(animationRef.current)
      }
      animationRef.current = null
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerleave', handlePointerLeave)
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return (
    <div
      ref={glowRef}
      className="floating-glow"
      style={{ top: position.top, left: position.left }}
    />
  )
}
