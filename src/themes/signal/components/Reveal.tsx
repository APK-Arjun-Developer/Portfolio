import { motion } from 'framer-motion';
import { fadeUp, staggerGroup, viewportOnce } from '../motion';

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

/** A single block that rises in once when it scrolls into view. */
export function Reveal({ children, className, delay = 0 }: Readonly<RevealProps>) {
  return (
    <motion.div
      className={className}
      variants={fadeUp}
      initial="hidden"
      whileInView="show"
      viewport={viewportOnce}
      transition={{ delay }}
    >
      {children}
    </motion.div>
  );
}

const groupTags = { div: motion.div, ul: motion.ul, ol: motion.ol, dl: motion.dl };
const itemTags = { div: motion.div, li: motion.li, article: motion.article };

interface RevealGroupProps extends RevealProps {
  as?: keyof typeof groupTags;
  gap?: number;
  'aria-label'?: string;
}

/** Container that staggers its <RevealItem> children in once. */
export function RevealGroup({
  as = 'div',
  children,
  className,
  gap,
  delay,
  ...rest
}: Readonly<RevealGroupProps>) {
  const Tag = groupTags[as];
  return (
    <Tag
      className={className}
      variants={staggerGroup(gap, delay)}
      initial="hidden"
      whileInView="show"
      viewport={viewportOnce}
      {...rest}
    >
      {children}
    </Tag>
  );
}

interface RevealItemProps {
  as?: keyof typeof itemTags;
  children: React.ReactNode;
  className?: string;
}

export function RevealItem({ as = 'div', children, className }: Readonly<RevealItemProps>) {
  const Tag = itemTags[as];
  return (
    <Tag className={className} variants={fadeUp}>
      {children}
    </Tag>
  );
}
