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
  'CSS': { icon: SiCss, color: '#1572B6' },
  'Node.js': { icon: SiNodedotjs, color: '#339933' },
  '.NET Core': { icon: SiDotnet, color: '#512BD4' },
  'PostgreSQL': { icon: SiPostgresql, color: '#336791' },
  'MySQL': { icon: SiMysql, color: '#4479A1' },
  'SQL Server': { icon: Database, color: '#CC2927' },
  'SQLite': { icon: SiSqlite, color: '#003B57' },
  'Git': { icon: SiGit, color: '#F05032' },
  'REST APIs': { icon: Webhook, color: '#6B7280' },
}

interface TechCardProps {
  name: string
  index?: number
}

export default function TechCard({ name, index = 0 }: TechCardProps) {
  const tech = TECH_ICONS[name]
  const Icon = tech?.icon ?? Webhook
  const color = tech?.color ?? '#6B7280'

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.04, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -3, scale: 1.04 }}
      className="group flex flex-col items-center gap-2.5 rounded-2xl border border-gray-200 bg-white p-4 shadow-card transition-all duration-200 hover:border-gray-300 hover:shadow-tech-hover"
    >
      <div
        className="flex h-10 w-10 items-center justify-center rounded-xl transition-transform duration-200"
        style={{ color }}
      >
        <Icon size={28} />
      </div>
      <span className="text-center text-xs font-medium text-text-secondary leading-tight">
        {name}
      </span>
    </motion.div>
  )
}
