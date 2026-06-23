import { motion } from 'framer-motion';
import { Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import { personal } from '../../data/personal';
import { GithubIcon, LinkedinIcon } from '../ui/BrandIcons';
import { analytics } from '../../lib/analytics';

const socialLinks = [
  {
    label: 'GitHub profile',
    href: personal.github,
    Icon: GithubIcon,
    platform: 'github' as const,
  },
  {
    label: 'LinkedIn profile',
    href: personal.linkedin,
    Icon: LinkedinIcon,
    platform: 'linkedin' as const,
  },
  {
    label: 'Send email',
    href: `mailto:${personal.email}`,
    Icon: Mail,
    platform: 'email' as const,
  },
];

const footerLinks = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/about' },
  { label: 'Projects', to: '/projects' },
];

export default function Footer() {
  return (
    <footer className="relative">
      {/* Gradient top border */}
      <div
        className="h-px w-full"
        style={{
          background:
            'linear-gradient(90deg, transparent 0%, rgba(59,130,246,0.40) 30%, rgba(139,92,246,0.40) 70%, transparent 100%)',
        }}
        aria-hidden="true"
      />

      <div
        style={{
          background: 'rgba(11,17,32,0.80)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
        }}
      >
        <div className="container-xl py-12">
          <div className="flex flex-col items-center gap-8 md:flex-row md:justify-between">
            {/* Brand */}
            <Link to="/" className="group flex items-center gap-2.5" aria-label="Back to home">
              <div
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[10px] font-bold text-white"
                style={{
                  background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                  boxShadow: '0 2px 8px rgba(59,130,246,0.35)',
                }}
                aria-hidden="true"
              >
                AP
              </div>
              <div>
                <p
                  className="text-sm font-semibold transition-colors group-hover:text-blue-400"
                  style={{ color: '#f8fafc' }}
                >
                  {personal.name}
                </p>
                <p className="text-xs" style={{ color: '#64748b' }}>
                  {personal.role}
                </p>
              </div>
            </Link>

            {/* Footer nav */}
            <nav className="flex items-center gap-6" aria-label="Footer navigation">
              {footerLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="text-xs transition-colors"
                  style={{ color: '#64748b' }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.color = '#94a3b8';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.color = '#64748b';
                  }}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Social + copyright */}
            <div className="flex flex-col items-center gap-4 sm:flex-row">
              <div className="flex items-center gap-1" role="list">
                {socialLinks.map(({ Icon, href, label, platform }) => (
                  <motion.a
                    key={label}
                    href={href}
                    target={href.startsWith('mailto') ? undefined : '_blank'}
                    rel="noopener noreferrer"
                    aria-label={label}
                    role="listitem"
                    onClick={() => analytics.socialClick(platform, 'footer')}
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center justify-center p-2 rounded-lg transition-all"
                    style={{ color: '#64748b' }}
                    onMouseEnter={(e) => {
                      const el = e.currentTarget as HTMLElement;
                      el.style.color = '#60a5fa';
                      el.style.background = 'rgba(59,130,246,0.10)';
                    }}
                    onMouseLeave={(e) => {
                      const el = e.currentTarget as HTMLElement;
                      el.style.color = '#64748b';
                      el.style.background = 'transparent';
                    }}
                  >
                    <Icon size={15} />
                  </motion.a>
                ))}
              </div>
              <p className="text-xs" style={{ color: '#475569' }}>
                © {new Date().getFullYear()} {personal.name}
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
