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
interface Word {
  word: string;
  accent?: boolean;
  /** Character offset in the full sentence — a stable, unique key. */
  offset: number;
}

function splitWords(parts: readonly HeadlinePart[]): Word[] {
  const words: Word[] = [];
  let offset = 0;
  for (const part of parts) {
    for (const word of part.text.split(' ')) {
      words.push({ word, accent: part.accent, offset });
      offset += word.length + 1;
    }
  }
  return words;
}

export default function SplitHeadline({
  parts,
  className,
  delay = 0,
}: Readonly<SplitHeadlineProps>) {
  const words = splitWords(parts);

  return (
    <h1 className={className}>
      <span className="sr-only">{parts.map((p) => p.text).join(' ')}</span>
      <span aria-hidden="true">
        {words.map(({ word, accent, offset }, i) => (
          <Fragment key={offset}>
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
