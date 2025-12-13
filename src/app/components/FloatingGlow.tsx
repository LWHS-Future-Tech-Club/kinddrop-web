'use client'

import { useEffect, useRef, useState } from 'react'

const DEFAULT_SIZE = 420
const SPRING_TENSION = 0.75
const SPRING_FRICTION = 0.1

export function FloatingGlow() {
  const glowRef = useRef<HTMLDivElement | null>(null)
  const [position, setPosition] = useState({ top: 0, left: 0 })
  const animationRef = useRef<number | null>(null)
  const targetRef = useRef<{ x: number; y: number } | null>(null)
  const currentPositionRef = useRef({ top: 0, left: 0 })
  const velocityRef = useRef({ x: 0, y: 0 })

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

        // Allow the glow to move outside of the viewport by not clamping
        const desiredLeft = target.x - glowWidth / 2
        const desiredTop = target.y - glowHeight / 2

        const current = currentPositionRef.current
        const velocity = velocityRef.current

        const forceX = (desiredLeft - current.left) * SPRING_TENSION
        const forceY = (desiredTop - current.top) * SPRING_TENSION

        const newVelocityX = (velocity.x + forceX) * SPRING_FRICTION
        const newVelocityY = (velocity.y + forceY) * SPRING_FRICTION

        const nextLeft = current.left + newVelocityX
        const nextTop = current.top + newVelocityY

        velocityRef.current = { x: newVelocityX, y: newVelocityY }

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
