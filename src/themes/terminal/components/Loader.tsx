import { useEffect, useRef, useState } from 'react';
import { personal } from '../../../data/personal';
import { cn } from '../../../lib/utils';
import { doorColour, skillGroups } from '../content';
import { loaderNeeded, markBoarded } from '../intro';

const FILL_MS = 1400;
const HOLD_MS = 350;
const CURTAIN_MS = 1000;
/** Whatever happens (fonts stuck, background tab), the page always opens by now. */
const HARD_LIMIT_MS = 3500;

const pills = [personal.name, ...skillGroups.map((group) => group.title.split(',')[0])];

/** The doors' colours stack up as fonts load, then slide apart and the curtain lifts. */
export default function Loader({ onOpen }: Readonly<{ onOpen: () => void }>) {
  const [phase, setPhase] = useState<'loading' | 'leaving' | 'gone'>(() =>
    loaderNeeded() ? 'loading' : 'gone',
  );
  const root = useRef<HTMLDivElement>(null);
  const count = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (phase === 'leaving') {
      const t = window.setTimeout(() => setPhase('gone'), CURTAIN_MS);
      return () => window.clearTimeout(t);
    }
    if (phase !== 'loading') return;

    const open = () => {
      markBoarded();
      setPhase('leaving');
      onOpen();
    };
    let ceiling = 0.7;
    let raf = 0;
    let hold = 0;
    let start: number | null = null;
    const limit = window.setTimeout(open, HARD_LIMIT_MS);
    const fontsReady = document.fonts?.ready ?? Promise.resolve();
    void fontsReady.then(() => {
      ceiling = 1;
    });

    const tick = (now: number) => {
      start ??= now;
      const shown = Math.min((now - start) / FILL_MS, ceiling, 1);
      if (count.current) {
        count.current.textContent = String(Math.round(shown * 100)).padStart(3, '0');
      }
      root.current?.style.setProperty('--p', shown.toFixed(3));
      root.current?.querySelectorAll('.tm-pill').forEach((pill, i) => {
        pill.classList.toggle('tm-pill--on', shown >= i / pills.length + 0.02);
      });
      if (shown < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        window.clearTimeout(limit);
        hold = window.setTimeout(open, HOLD_MS);
      }
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(limit);
      window.clearTimeout(hold);
    };
  }, [phase, onOpen]);

  if (phase === 'gone') return null;

  return (
    <div
      ref={root}
      className={cn('tm-loader', phase === 'leaving' && 'tm-loader--out')}
      data-testid="boarding-screen"
      aria-hidden="true"
    >
      <div className="tm-loader__bg" />
      <div className="tm-loader__stack">
        {pills.map((label, i) => (
          <span
            key={label}
            className="tm-pill"
            style={
              {
                '--k': i,
                '--dir': i % 2 ? 1 : -1,
                '--c': i === 0 ? '#1d1b1b' : doorColour(i - 1),
              } as React.CSSProperties
            }
          >
            {label}
          </span>
        ))}
      </div>
      <div className="tm-loader__hud">
        <p className="text-sm font-medium text-[#c9c0b8]">
          <b className="font-semibold text-[#e8e4e0]">{personal.name}</b> · Portfolio
        </p>
        <div className="flex items-end justify-between gap-6">
          <span
            ref={count}
            className="text-[clamp(3.5rem,9vw,7.5rem)] font-bold leading-[0.85] tracking-tighter tabular-nums text-[#e8e4e0]"
          >
            000
          </span>
          <span className="tm-loader__bar">
            <i />
          </span>
        </div>
      </div>
    </div>
  );
}
