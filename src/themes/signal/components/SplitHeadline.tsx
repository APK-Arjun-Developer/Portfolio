import { Fragment } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../../lib/utils';
import { duration, ease, stagger } from '../motion';

export interface HeadlinePart {
  text: string;
  accent?: boolean;
}

interface SplitHeadlineProps {
  parts: HeadlinePart[];
  className?: string;
  delay?: number;
}

/**
 * Word-by-word masked reveal. The full sentence is in the DOM from first paint for
 * screen readers and SEO; the animated copy is aria-hidden.
 */
export default function SplitHeadline({ parts, className, delay = 0 }: SplitHeadlineProps) {
  const words = parts.flatMap((part) =>
    part.text.split(' ').map((word) => ({ word, accent: part.accent })),
  );

  return (
    <h1 className={className}>
      <span className="sr-only">{parts.map((p) => p.text).join(' ')}</span>
      <span aria-hidden="true">
        {words.map(({ word, accent }, i) => (
          <Fragment key={i}>
            <span className="-mb-[0.12em] inline-block overflow-hidden pb-[0.12em] align-bottom">
              <motion.span
                className={cn('inline-block', accent && 'text-sg-coral-text')}
                initial={{ y: '110%' }}
                animate={{ y: 0 }}
                transition={{
                  duration: duration.heroWord,
                  ease: ease.out,
                  delay: delay + i * stagger.words,
                }}
              >
                {word}
              </motion.span>
            </span>
            {/* The space must sit outside the inline-block mask or it is trimmed. */}
            {i < words.length - 1 && ' '}
          </Fragment>
        ))}
      </span>
    </h1>
  );
}
