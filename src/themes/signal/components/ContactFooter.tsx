import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Check, Copy, Download, Mail } from 'lucide-react';
import { personal } from '../../../data/personal';
import { analytics } from '../../../lib/analytics';
import { GithubIcon, LinkedinIcon } from '../../../components/BrandIcons';
import { Reveal, RevealGroup, RevealItem } from './Reveal';

const footerLinks = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/about' },
  { label: 'Projects', to: '/projects' },
];

function CopyEmail() {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const t = window.setTimeout(() => setCopied(false), 2000);
    return () => window.clearTimeout(t);
  }, [copied]);

  return (
    <button
      type="button"
      onClick={() =>
        navigator.clipboard?.writeText(personal.email).then(
          () => setCopied(true),
          () => {},
        )
      }
      className="sg-btn-quiet"
    >
      {copied ? <Check size={15} aria-hidden="true" /> : <Copy size={15} aria-hidden="true" />}
      <span aria-live="polite">{copied ? 'Copied' : 'Copy email'}</span>
    </button>
  );
}

/** Closing contact composition shared by every page, plus the legal/nav bar. */
export default function ContactFooter() {
  const rows = [
    {
      label: 'GitHub',
      href: personal.github,
      Icon: GithubIcon,
      onClick: () => analytics.socialClick('github', 'footer'),
      external: true,
    },
    {
      label: 'LinkedIn',
      href: personal.linkedin,
      Icon: LinkedinIcon,
      onClick: () => analytics.socialClick('linkedin', 'footer'),
      external: true,
    },
    {
      label: 'Email',
      href: `mailto:${personal.email}`,
      Icon: Mail,
      onClick: () => analytics.socialClick('email', 'footer'),
      external: false,
    },
  ];

  return (
    <footer
      className="relative mt-28 border-t border-sg-line md:mt-40"
      aria-labelledby="contact-heading"
    >
      <div className="sg-wrap grid gap-14 py-20 md:py-28 lg:grid-cols-12">
        <Reveal className="lg:col-span-7">
          <p className="sg-kicker flex items-center gap-2.5">
            <span className="relative flex h-2 w-2" aria-hidden="true">
              <span className="absolute inset-0 rounded-full motion-safe:animate-ping bg-sg-teal opacity-60 [animation-iteration-count:3]" />
              <span className="relative h-2 w-2 rounded-full bg-sg-teal" />
            </span>
            <span>Available for opportunities</span>
          </p>
          <h2
            id="contact-heading"
            className="mt-6 text-[clamp(2.5rem,5vw+1rem,5rem)] font-extrabold leading-[0.98]"
          >
            Let's build <span className="text-sg-coral-text">something solid.</span>
          </h2>
          <a
            href={`mailto:${personal.email}`}
            onClick={() => analytics.ctaClick('contact_me')}
            className="group mt-10 inline-flex max-w-full items-center gap-3 font-display text-[clamp(1.0625rem,1.3vw+0.6rem,1.75rem)] [overflow-wrap:anywhere] font-bold text-sg-ink transition-colors hover:text-sg-coral-text"
          >
            {personal.email}
            <ArrowUpRight size={24} className="sg-nudge-ne shrink-0" aria-hidden="true" />
          </a>
          <div className="mt-4">
            <CopyEmail />
          </div>
        </Reveal>

        <RevealGroup
          as="ul"
          className="self-end border-t border-sg-line lg:col-span-4 lg:col-start-9"
        >
          {rows.map(({ label, href, Icon, onClick, external }) => (
            <RevealItem as="li" key={label} className="border-b border-sg-line">
              <a
                href={href}
                target={external ? '_blank' : undefined}
                rel={external ? 'noopener noreferrer' : undefined}
                onClick={onClick}
                className="group flex items-center justify-between gap-4 py-5 text-lg font-semibold text-sg-ink transition-colors hover:text-sg-coral-text"
              >
                <span className="flex items-center gap-3">
                  <Icon size={18} />
                  {label}
                </span>
                <ArrowUpRight size={18} className="sg-nudge-ne" aria-hidden="true" />
              </a>
            </RevealItem>
          ))}
          <RevealItem as="li" className="border-b border-sg-line">
            <a
              href={personal.resumeUrl}
              download="arjun-p-resume.pdf"
              onClick={() => analytics.resumeDownload('footer')}
              className="group flex items-center justify-between gap-4 py-5 text-lg font-semibold text-sg-ink transition-colors hover:text-sg-coral-text"
            >
              <span className="flex items-center gap-3">
                <Download size={18} aria-hidden="true" />
                Resume (PDF)
              </span>
              <Download
                size={18}
                className="transition-transform duration-200 group-hover:translate-y-0.5"
                aria-hidden="true"
              />
            </a>
          </RevealItem>
        </RevealGroup>
      </div>

      <div className="border-t border-sg-line">
        <div className="sg-wrap flex flex-col gap-4 py-6 text-sm sm:flex-row sm:items-center sm:justify-between">
          <p className="font-mono text-xs text-sg-faint">
            © {new Date().getFullYear()} {personal.name}
          </p>
          <nav aria-label="Footer navigation">
            <ul className="flex gap-6">
              {footerLinks.map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="text-sg-muted transition-colors hover:text-sg-ink">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </footer>
  );
}
