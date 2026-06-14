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
      <div className="flex items-center gap-3 mb-3">
        <span
          className="font-mono text-xs font-semibold tracking-widest text-cyan-500 opacity-70"
          aria-hidden="true"
        >
          {number}.
        </span>
        <div className="h-px flex-1 max-w-[60px]" style={{ background: 'rgba(6,182,212,0.2)' }} />
      </div>
      <h2 id={id} className="text-3xl sm:text-4xl font-bold text-slate-50 tracking-tight">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-3 text-slate-400 text-base max-w-xl leading-relaxed">{subtitle}</p>
      )}
    </motion.div>
  )
}
