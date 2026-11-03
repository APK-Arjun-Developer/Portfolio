import { useEffect, useRef, useState } from 'react';
import { ArrowUp } from 'lucide-react';
import { cn } from '../../../lib/utils';
import { scrollToTop } from '../scroll';

const SHOW_AFTER_PX = 600;
const RADIUS = 24;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

/** Floating button whose ring fills as the page is read. */
export default function BackToTop() {
  const [show, setShow] = useState(false);
  const ring = useRef<SVGCircleElement>(null);

  useEffect(() => {
    const onScroll = () => {
      const { scrollHeight, clientHeight } = document.documentElement;
      const progress = window.scrollY / Math.max(1, scrollHeight - clientHeight);
      ring.current?.setAttribute('stroke-dashoffset', String(CIRCUMFERENCE * (1 - progress)));
      setShow(window.scrollY > SHOW_AFTER_PX);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <button
      type="button"
      aria-label="Back to top"
      tabIndex={show ? 0 : -1}
      data-show={show}
      className={cn('tm-totop', show && 'tm-totop--show')}
      onClick={scrollToTop}
    >
      <svg
        className="absolute inset-0 h-full w-full -rotate-90"
        viewBox="0 0 52 52"
        aria-hidden="true"
      >
        <circle
          ref={ring}
          cx="26"
          cy="26"
          r={RADIUS}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={CIRCUMFERENCE}
        />
      </svg>
      <ArrowUp size={18} aria-hidden="true" />
    </button>
  );
}
