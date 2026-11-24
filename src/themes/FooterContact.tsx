import { useEffect, useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { personal } from '../data/personal';

export function CopyEmail({ iconOnly = false }: Readonly<{ iconOnly?: boolean }>) {
  const [copied, setCopied] = useState(false);
  const Icon = copied ? Check : Copy;
  const confirmation = iconOnly ? 'Email copied' : 'Copied';
  const prompt = iconOnly ? '' : 'Copy email';

  useEffect(() => {
    if (!copied) return;
    const t = window.setTimeout(() => setCopied(false), 2000);
    return () => window.clearTimeout(t);
  }, [copied]);

  return (
    <button
      type="button"
      aria-label={iconOnly ? 'Copy email' : undefined}
      onClick={() =>
        navigator.clipboard?.writeText(personal.email).then(
          () => setCopied(true),
          () => {},
        )
      }
      className={
        iconOnly
          ? 'inline-flex h-11 w-11 items-center justify-center text-[#e8e4e0] hover:text-white'
          : 'sg-btn-quiet'
      }
    >
      <Icon size={iconOnly ? 18 : 15} aria-hidden="true" />
      <span className={iconOnly ? 'sr-only' : undefined} aria-live="polite">
        {copied ? confirmation : prompt}
      </span>
    </button>
  );
}
