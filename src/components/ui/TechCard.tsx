import { motion } from 'framer-motion'
import {
  SiReact,
  SiJavascript,
  SiHtml5,
  SiCss,
  SiNodedotjs,
  SiDotnet,
  SiPostgresql,
  SiMysql,
  SiSqlite,
  SiGit,
} from 'react-icons/si'
import { Webhook, Database } from 'lucide-react'

const TECH_ICONS: Record<string, { icon: React.ElementType; color: string }> = {
  'React': { icon: SiReact, color: '#61DAFB' },
  'JavaScript': { icon: SiJavascript, color: '#F7DF1E' },
  'HTML': { icon: SiHtml5, color: '#E34F26' },
  'CSS': { icon: SiCss, color: '#38BDF8' },
  'Node.js': { icon: SiNodedotjs, color: '#4ADE80' },
  '.NET Core': { icon: SiDotnet, color: '#A78BFA' },
  'PostgreSQL': { icon: SiPostgresql, color: '#60A5FA' },
  'MySQL': { icon: SiMysql, color: '#60A5FA' },
  'SQL Server': { icon: Database, color: '#F87171' },
  'SQLite': { icon: SiSqlite, color: '#94A3B8' },
  'Git': { icon: SiGit, color: '#FB923C' },
  'REST APIs': { icon: Webhook, color: '#34D399' },
}

interface TechCardProps {
  name: string
  index?: number
}

export default function TechCard({ name, index = 0 }: TechCardProps) {
  const tech = TECH_ICONS[name]
  const Icon = tech?.icon ?? Webhook
  const color = tech?.color ?? '#94a3b8'

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.04, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -4, scale: 1.04 }}
      className="group flex flex-col items-center gap-2.5 rounded-2xl p-4 transition-all duration-200 cursor-default"
      style={{
        background: 'rgba(255,255,255,0.04)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        border: '1px solid rgba(255,255,255,0.08)',
        boxShadow: '0 1px 4px rgba(0,0,0,0.25), 0 2px 8px rgba(0,0,0,0.20)',
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLElement
        el.style.background = 'rgba(255,255,255,0.08)'
        el.style.borderColor = 'rgba(255,255,255,0.15)'
        el.style.boxShadow = '0 4px 20px rgba(0,0,0,0.35), 0 2px 8px rgba(0,0,0,0.25)'
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLElement
        el.style.background = 'rgba(255,255,255,0.04)'
        el.style.borderColor = 'rgba(255,255,255,0.08)'
        el.style.boxShadow = '0 1px 4px rgba(0,0,0,0.25), 0 2px 8px rgba(0,0,0,0.20)'
      }}
    >
      <div
        className="flex h-11 w-11 items-center justify-center rounded-xl transition-transform duration-200 group-hover:scale-110"
        style={{
          color,
          background: `${color}14`,
          border: `1px solid ${color}22`,
        }}
      >
        <Icon size={26} />
      </div>
      <span className="text-center text-xs font-medium leading-tight" style={{ color: '#94a3b8' }}>
        {name}
      </span>
    </motion.div>
  )
}
