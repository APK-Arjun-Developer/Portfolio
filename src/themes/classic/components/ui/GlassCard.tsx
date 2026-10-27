import { forwardRef } from 'react';
import { cn } from '../../../../lib/utils';

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
  strong?: boolean;
}

const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className, hover = true, strong = false, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'rounded-2xl transition-all duration-300',
          strong ? 'glass-strong' : 'glass',
          hover && 'glass-hover',
          className,
        )}
        {...props}
      />
    );
  },
);

GlassCard.displayName = 'GlassCard';
export default GlassCard;
