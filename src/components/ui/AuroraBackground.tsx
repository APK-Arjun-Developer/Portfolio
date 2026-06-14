interface AuroraBackgroundProps {
  children?: React.ReactNode
  className?: string
}

export default function AuroraBackground({ children, className = '' }: AuroraBackgroundProps) {
  return (
    <div className={`relative ${className}`} style={{ backgroundColor: '#08080e' }}>
      {/* Aurora blobs — purely decorative */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        {/* Cyan blob — top left */}
        <div
          className="animate-aurora-1 absolute -left-40 -top-40 h-[700px] w-[700px] rounded-full opacity-[0.13]"
          style={{
            background: 'radial-gradient(circle at 40% 40%, #06b6d4 0%, #0284c7 40%, transparent 70%)',
          }}
        />
        {/* Violet blob — top right */}
        <div
          className="animate-aurora-2 absolute -right-40 -top-20 h-[600px] w-[600px] rounded-full opacity-[0.12]"
          style={{
            background: 'radial-gradient(circle at 60% 40%, #8b5cf6 0%, #6d28d9 40%, transparent 70%)',
          }}
        />
        {/* Emerald blob — bottom center */}
        <div
          className="animate-aurora-3 absolute -bottom-20 left-1/2 h-[500px] w-[900px] -translate-x-1/2 rounded-full opacity-[0.07]"
          style={{
            background:
              'radial-gradient(ellipse at center, #10b981 0%, #059669 40%, transparent 70%)',
          }}
        />
        {/* Subtle grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)',
            backgroundSize: '64px 64px',
          }}
        />
      </div>

      {children}
    </div>
  )
}
