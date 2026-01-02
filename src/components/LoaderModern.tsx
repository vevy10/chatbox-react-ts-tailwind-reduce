import React, { useState, useEffect } from 'react'
import { type LoaderProps } from '../types/loader.type'

const LoaderModern: React.FC<LoaderProps> = ({
  text = "Chargement",
  size = "md",
  color = "bg-white"
}) => {
  const [seconds, setSeconds] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => setSeconds(s => s + 1), 1000)
    return () => clearInterval(timer)
  }, [])

  const config = {
    sm: { container: 'w-6 h-6', barH: '6px', barW: '1.5px', offset: '12px', font: 'text-[10px]' },
    md: { container: 'w-10 h-10', barH: '10px', barW: '2.5px', offset: '20px', font: 'text-sm' },
    lg: { container: 'w-16 h-16', barH: '14px', barW: '4px', offset: '32px', font: 'text-lg' },
  }[size]

  const formatTime = (s: number) => {
    const min = Math.floor(s / 60)
    const sec = s % 60
    return `${min}:${sec.toString().padStart(2, '0')}s`
  };

  return (

    <div className="flex flex-col items-center justify-center p-4">
      <div
        className={`relative ${config.container}`}
        style={{
          ['--bar-height' as any]: config.barH,
          ['--bar-width' as any]: config.barW,
          ['--center-offset' as any]: config.offset
        }}
      >
        {[...Array(12)].map((_, i) => (

          <div
            key={i}
            className={`spinner-bar ${color}`}
            style={{
              ['--rotate' as any]: `${i * 30}deg`,
              animationDelay: `${-1.1 + i * 0.1}s`,
            }}
          />

        ))}
      </div>

      <div className={`mt-4 flex flex-col items-center font-medium text-white ${config.font}`}>
        <span className="opacity-80 uppercase tracking-widest">{text}</span>
        <span className="font-mono tabular-nums mt-1">{formatTime(seconds)}</span>
      </div>
    </div>

  )

}

export default LoaderModern