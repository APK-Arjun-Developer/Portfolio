import { CopyEmail } from '../../FooterContact';
import { contactRows, footerLinks } from '../../footer-links';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight, Download } from 'lucide-react';
import { personal, projects } from '../../../data/personal';
import { analytics } from '../../../lib/analytics';
import { versionLabel } from '../../../lib/version';
import { useOpenContact } from '../contact';

/** Dark closing panel on every page: the pitch, every way to get in touch, the name edge to edge. */
export default function ContactFooter() {
  const openContact = useOpenContact();

  return (
    <footer className="tm-footer" aria-labelledby="contact-heading">
      <div className="tm-wrap relative z-[1] pb-7 pt-20 lg:pt-28">
        <p className="inline-flex items-center gap-2.5 text-[0.8125rem] font-medium uppercase tracking-[0.06em] text-[#b8b0a9]">
          <i className="tm-footer__pulse" aria-hidden="true" />
          <span>Available for opportunities</span>
        </p>
        <h2
          id="contact-heading"
          className="mt-5 text-[clamp(2.75rem,7.5vw,6.5rem)] font-semibold leading-[0.95] text-[#e8e4e0]"
        >
          Let's build <span className="block text-[#8d8782]">something solid.</span>
        </h2>
        <p className="mt-6 max-w-[46ch] text-[1.0625rem] leading-relaxed text-[#c5bdb6]">
          {personal.summary}
        </p>

        <div className="mt-9 flex flex-wrap gap-3">
          <button type="button" onClick={openContact} className="tm-footer__btn group">
            <span>Contact Me</span>
            <span className="tm-badge tm-badge--dark">
              <ArrowRight size={16} className="tm-nudge-x" aria-hidden="true" />
            </span>
          </button>
          <Link to="/projects" className="tm-footer__ghost">
            All Projects
          </Link>
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-2">
          <a
            href={`mailto:${personal.email}`}
            onClick={() => analytics.ctaClick('contact_me')}
            className="group inline-flex max-w-full items-center gap-2 text-[clamp(1.0625rem,1.3vw+0.6rem,1.5rem)] font-semibold text-[#e8e4e0] [overflow-wrap:anywhere] hover:text-white"
          >
            {personal.email}
            <ArrowUpRight size={20} className="tm-nudge-ne shrink-0" aria-hidden="true" />
          </a>
          <CopyEmail iconOnly />
        </div>

        <div className="mt-16 grid grid-cols-2 gap-x-6 gap-y-9 border-t border-[#ffffff1f] pt-10 md:grid-cols-[2fr_1fr_1fr]">
          <div className="col-span-2 md:col-span-1">
            <h3 className="tm-footer__h">Work</h3>
            <ul className="grid gap-x-6 gap-y-2.5 sm:grid-cols-2">
              {projects.map((project) => (
                <li key={project.id}>
                  <Link to={`/projects/${project.id}`} className="tm-footer__link">
                    {project.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <nav aria-label="Footer navigation">
            <h3 className="tm-footer__h">Navigate</h3>
            <ul className="space-y-2.5">
              {footerLinks.map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="tm-footer__link">
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <button type="button" onClick={openContact} className="tm-footer__link">
                  Contact
                </button>
              </li>
            </ul>
          </nav>
          <div>
            <h3 className="tm-footer__h">Connect</h3>
            <ul className="space-y-2.5">
              {contactRows.map(({ label, href, Icon, onClick, external }) => (
                <li key={label}>
                  <a
                    href={href}
                    target={external ? '_blank' : undefined}
                    rel={external ? 'noopener noreferrer' : undefined}
                    onClick={onClick}
                    className="tm-footer__link inline-flex items-center gap-2"
                  >
                    <Icon size={15} />
                    {label}
                  </a>
                </li>
              ))}
              <li>
                <a
                  href={personal.resumeUrl}
                  download="arjun-p-resume.pdf"
                  onClick={() => analytics.resumeDownload('footer')}
                  className="tm-footer__link inline-flex items-center gap-2"
                >
                  <Download size={15} aria-hidden="true" />
                  Resume (PDF)
                </a>
              </li>
            </ul>
          </div>
        </div>

        <p className="mt-16 text-[0.8125rem] text-[#b8b0a9] md:mt-28">
          © {new Date().getFullYear()} {personal.name}.{' '}
          <span title={`Site version ${versionLabel}`}>
            <span className="sr-only">Version </span>
            {versionLabel}
          </span>
        </p>
      </div>
      <p className="tm-footer__word" aria-hidden="true">
        {personal.name}
      </p>
    </footer>
  );
}
