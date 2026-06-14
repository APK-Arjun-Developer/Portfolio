import { motion } from 'framer-motion'
import { Mail } from 'lucide-react'
import { Link } from 'react-router-dom'
import { personal } from '../../data/personal'
import { GithubIcon, LinkedinIcon } from '../ui/BrandIcons'

const socialLinks = [
  { label: 'GitHub profile', href: personal.github, Icon: GithubIcon },
  { label: 'LinkedIn profile', href: personal.linkedin, Icon: LinkedinIcon },
  { label: 'Send email', href: `mailto:${personal.email}`, Icon: Mail },
]

const footerLinks = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/about' },
  { label: 'Projects', to: '/projects' },
]

export default function Footer() {
  return (
    <footer className="relative mt-24 border-t border-gray-200">
      <div className="container-xl py-12">
        <div className="flex flex-col items-center gap-8 md:flex-row md:justify-between">
          {/* Brand */}
          <Link to="/" className="group flex items-center gap-2.5" aria-label="Back to home">
            <div
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-[9px] font-bold text-white"
              style={{ background: 'linear-gradient(135deg, #2563EB, #7C3AED)' }}
              aria-hidden="true"
            >
              AP
            </div>
            <div>
              <p className="text-sm font-semibold text-text-heading transition-colors group-hover:text-blue-600">
                {personal.name}
              </p>
              <p className="text-xs text-text-secondary">{personal.role}</p>
            </div>
          </Link>

          {/* Footer nav */}
          <nav className="flex items-center gap-6" aria-label="Footer navigation">
            {footerLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="text-xs text-text-secondary hover:text-text-heading transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Social + copyright */}
          <div className="flex flex-col items-center gap-4 sm:flex-row">
            <div className="flex items-center gap-1" role="list">
              {socialLinks.map(({ Icon, href, label }) => (
                <motion.a
                  key={label}
                  href={href}
                  target={href.startsWith('mailto') ? undefined : '_blank'}
                  rel="noopener noreferrer"
                  aria-label={label}
                  role="listitem"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center justify-center p-2 rounded-lg text-text-secondary hover:text-text-heading transition-colors hover:bg-gray-100"
                >
                  <Icon size={15} />
                </motion.a>
              ))}
            </div>
            <p className="text-xs text-text-secondary">
              © {new Date().getFullYear()} {personal.name}
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
