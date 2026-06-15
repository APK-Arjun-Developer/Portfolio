import { motion } from 'framer-motion'

interface SectionTitleProps {
  number: string
  title: string
  subtitle?: string
  id?: string
}

export default function SectionTitle({ number, title, subtitle, id }: SectionTitleProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="mb-16"
    >
      <div className="flex items-center gap-3 mb-4">
        <span
          className="font-mono text-xs font-bold tracking-widest"
          style={{ color: '#60a5fa' }}
          aria-hidden="true"
        >
          {number}.
        </span>
        <div
          className="h-px flex-1 max-w-[80px]"
          style={{ background: 'linear-gradient(90deg, rgba(96,165,250,0.7), rgba(167,139,250,0.3), transparent)' }}
          aria-hidden="true"
        />
      </div>
      <h2
        id={id}
        className="font-heading text-3xl sm:text-4xl font-bold tracking-tight"
        style={{ color: '#f8fafc' }}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className="mt-3 text-base max-w-xl leading-relaxed"
          style={{ color: '#94a3b8' }}
        >
          {subtitle}
        </p>
      )}
    </motion.div>
  )
}
