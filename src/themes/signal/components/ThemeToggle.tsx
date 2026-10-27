import { motion } from 'framer-motion';
import { Monitor, Moon, Sun } from 'lucide-react';
import { cn } from '../../../lib/utils';
import { duration, ease } from '../motion';
import { useTheme, type ThemePreference } from '../theme';

const options: { value: ThemePreference; label: string; Icon: typeof Sun }[] = [
  { value: 'light', label: 'Light theme', Icon: Sun },
  { value: 'system', label: 'System theme', Icon: Monitor },
  { value: 'dark', label: 'Dark theme', Icon: Moon },
];

export default function ThemeToggle({ id = 'theme' }: Readonly<{ id?: string }>) {
  const { preference, setPreference } = useTheme();

  return (
    <fieldset className="inline-flex items-center rounded-full border border-sg-line p-0.5">
      <legend className="sr-only">Colour theme</legend>
      {options.map(({ value, label, Icon }) => {
        const active = preference === value;
        return (
          <button
            key={value}
            type="button"
            aria-label={label}
            aria-pressed={active}
            title={label}
            onClick={() => setPreference(value)}
            className={cn(
              'relative flex h-8 w-8 items-center justify-center rounded-full transition-colors',
              active ? 'text-sg-on-coral' : 'text-sg-faint hover:text-sg-ink',
            )}
          >
            {active && (
              <motion.span
                layoutId={`${id}-pill`}
                className="absolute inset-0 rounded-full bg-sg-coral"
                transition={{ duration: duration.ui, ease: ease.inOut }}
              />
            )}
            <Icon size={15} strokeWidth={2} className="relative" aria-hidden="true" />
          </button>
        );
      })}
    </fieldset>
  );
}
