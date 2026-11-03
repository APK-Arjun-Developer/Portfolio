import { useEffect, useRef, useState } from 'react';
import { prefersReducedMotion } from '../motion';

const HOLD_MS = 2900;
const RINGS = Array.from({ length: 12 }, (_, i) => `ring-${i}`);

const pageNumber = (index: number, total: number) =>
  `${String(index + 1).padStart(2, '0')} / ${String(total).padStart(2, '0')}`;

interface FlipCalendarProps {
  words: string[];
  hold?: number;
}

/** Desk calendar turning its pages: each word sits underneath until the page above lifts away. */
export default function FlipCalendar({ words, hold = HOLD_MS }: Readonly<FlipCalendarProps>) {
  const [flips, setFlips] = useState(0);
  const [visible, setVisible] = useState(true);
  const calendar = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting));
    if (calendar.current) observer.observe(calendar.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!visible || words.length < 2 || prefersReducedMotion()) return;
    const timer = window.setInterval(() => setFlips((n) => n + 1), hold);
    return () => window.clearInterval(timer);
  }, [visible, words.length, hold]);

  const current = flips % words.length;
  const previous = (flips - 1 + words.length) % words.length;

  return (
    <span ref={calendar} className="tm-cal" aria-hidden="true">
      <span className="tm-cal__body">
        <span className="tm-cal__stand" />
        <span className="tm-cal__page" data-word={words[current]}>
          {words[current]}
          <span className="tm-cal__no">{pageNumber(current, words.length)}</span>
        </span>
        {flips > 0 && (
          <span key={flips} className="tm-cal__page tm-cal__leaf">
            {words[previous]}
            <span className="tm-cal__no">{pageNumber(previous, words.length)}</span>
          </span>
        )}
        <span className="tm-cal__rings">
          {RINGS.map((ring) => (
            <i key={ring} />
          ))}
        </span>
      </span>
    </span>
  );
}
