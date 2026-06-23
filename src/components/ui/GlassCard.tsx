import { forwardRef } from 'react';
import { cn } from '../../lib/utils';

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  glow?: 'blue' | 'violet' | 'none';
  hover?: boolean;
  strong?: boolean;
}

const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className, glow = 'none', hover = true, strong = false, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'rounded-2xl transition-all duration-300',
          strong ? 'glass-strong' : 'glass',
          hover && 'glass-hover',
          glow === 'blue' && 'hover:shadow-[0_0_30px_rgba(37,99,235,0.12)]',
          glow === 'violet' && 'hover:shadow-[0_0_30px_rgba(124,58,237,0.12)]',
          className,
        )}
        {...props}
      />
    );
  },
);

GlassCard.displayName = 'GlassCard';
export default GlassCard;
