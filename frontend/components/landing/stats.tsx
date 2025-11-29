'use client'

import { useEffect, useState, useRef } from 'react'

function useCounter(end: number, duration: number = 2000) {
  const [count, setCount] = useState(0)
  const countRef = useRef(0)

  useEffect(() => {
    const startTime = Date.now()
    const increment = end / (duration / 16)

    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime
      if (elapsed >= duration) {
        setCount(end)
        clearInterval(timer)
      } else {
        countRef.current = Math.min(countRef.current + increment, end)
        setCount(Math.floor(countRef.current))
      }
    }, 16)

    return () => clearInterval(timer)
  }, [end, duration])

  return count
}

export function Stats() {
  const vulnerabilities = useCounter(500)
  const organizations = useCounter(120)
  const uptime = useCounter(99.9, 1500)

  return (
    <section className="py-16 bg-white border-y border-gray-200">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="text-4xl font-display font-bold gradient-text mb-2">
              {vulnerabilities}+
            </div>
            <div className="text-gray-600">Vulnerabilities Discovered</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-display font-bold gradient-text mb-2">
              {organizations}
            </div>
            <div className="text-gray-600">Organizations Protected</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-display font-bold gradient-text mb-2">
              {uptime.toFixed(1)}%
            </div>
            <div className="text-gray-600">Uptime SLA</div>
          </div>
        </div>
      </div>
    </section>
  )
}

