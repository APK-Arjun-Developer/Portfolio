import { Mail } from 'lucide-react';
import { personal } from '../data/personal';
import { analytics } from '../lib/analytics';
import { GithubIcon, LinkedinIcon } from '../components/BrandIcons';

export const footerLinks = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/about' },
  { label: 'Projects', to: '/projects' },
];

export const contactRows = [
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
