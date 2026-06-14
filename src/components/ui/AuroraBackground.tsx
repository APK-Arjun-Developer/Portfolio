interface AuroraBackgroundProps {
  children?: React.ReactNode
  className?: string
}

export default function AuroraBackground({ children, className = '' }: AuroraBackgroundProps) {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Subtle light-theme aurora blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        {/* Blue blob — top left */}
        <div
          className="animate-aurora-1 absolute -left-56 -top-56 h-[700px] w-[700px] rounded-full"
          style={{
            background: 'radial-gradient(circle at 40% 40%, rgba(59,130,246,0.12) 0%, rgba(37,99,235,0.06) 45%, transparent 70%)',
          }}
        />
        {/* Violet blob — top right */}
        <div
          className="animate-aurora-2 absolute -right-48 -top-24 h-[600px] w-[600px] rounded-full"
          style={{
            background: 'radial-gradient(circle at 60% 40%, rgba(124,58,237,0.10) 0%, rgba(139,92,246,0.04) 45%, transparent 70%)',
          }}
        />
        {/* Emerald blob — bottom */}
        <div
          className="animate-aurora-3 absolute -bottom-24 left-1/2 h-[500px] w-[900px] -translate-x-1/2 rounded-full"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(16,185,129,0.07) 0%, rgba(5,150,105,0.03) 45%, transparent 70%)',
          }}
        />
        {/* Subtle dot grid */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'radial-gradient(circle, rgba(0,0,0,0.06) 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }}
        />
      </div>

      {children}
    </div>
  )
}
