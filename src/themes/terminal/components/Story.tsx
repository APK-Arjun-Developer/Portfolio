import { useRef, useState } from 'react';
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';
import { cn } from '../../../lib/utils';
import { stops } from '../content';
import { prefersReducedMotion, spring } from '../motion';

const DIGITS = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

function RollingYear({ year }: Readonly<{ year: string }>) {
  return (
    <span className="tm-year">
      {[...year].map((digit, place) => (
        <span key={place} className="tm-year__cell">
          <span className="tm-year__roll" style={{ '--d': digit } as React.CSSProperties}>
            {DIGITS.map((d) => (
              <i key={d}>{d}</i>
            ))}
          </span>
        </span>
      ))}
    </span>
  );
}

interface StoryProps {
  id: string;
  kicker: string;
  title: string;
  action?: React.ReactNode;
}

/** The career timeline: heading and a rolling year stay put while the entries scroll past. */
export default function Story({ id, kicker, title, action }: Readonly<StoryProps>) {
  const route = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const { scrollYProgress } = useScroll({ target: route, offset: ['start 50%', 'end 50%'] });
  const progress = useSpring(scrollYProgress, spring.rail);
  const dialTurn = useTransform(scrollYProgress, [0, 1], [0, 110]);
  const still = prefersReducedMotion();
  const stop = stops[active];

  return (
    <section className="tm-story" aria-labelledby={id}>
      <div className="tm-story__amb" aria-hidden="true">
        {stops.map((item, i) => (
          <i
            key={item.title}
            data-on={i === active}
            style={{ '--c1': item.light[0], '--c2': item.light[1] } as React.CSSProperties}
          />
        ))}
      </div>

      <div className="tm-wrap relative grid gap-12 py-24 md:py-32 lg:grid-cols-2 lg:gap-10">
        <div className="lg:sticky lg:top-24 lg:flex lg:h-[calc(100svh-7rem)] lg:flex-col lg:justify-center lg:self-start">
          <motion.span
            className="tm-dial"
            style={still ? undefined : { rotate: dialTurn }}
            aria-hidden="true"
          />
          <p className="tm-eyebrow relative">{kicker}</p>
          <h2
            id={id}
            className="relative mt-2 text-[clamp(2rem,3.4vw,3.25rem)] font-semibold leading-[1.05]"
          >
            {title}
          </h2>
          <div className="relative mt-8 hidden lg:block" aria-hidden="true">
            <RollingYear year={stop.year} />
            <p className="tm-kicker mt-6 text-tm-ink">{stop.period}</p>
            <div className="mt-6 flex items-center gap-3 text-[0.9375rem]">
              <span className="font-semibold tabular-nums text-tm-ink">
                {String(active + 1).padStart(2, '0')}
              </span>
              <span>/ {String(stops.length).padStart(2, '0')}</span>
              <span className="tm-meter">
                <b style={{ transform: `scaleX(${(active + 1) / stops.length})` }} />
              </span>
            </div>
          </div>
          {action && <div className="relative mt-8">{action}</div>}
        </div>

        <div ref={route} className="relative lg:py-[22svh]">
          <span className="tm-rail" aria-hidden="true" />
          {!still && (
            <motion.span
              className="tm-rail tm-rail--on origin-top"
              style={{ scaleY: progress }}
              aria-hidden="true"
            />
          )}
          <ol className="space-y-20 lg:space-y-28">
            {stops.map((item, i) => (
              <motion.li
                key={item.title}
                className={cn('tm-stop relative pl-10', i === active && 'tm-stop--on')}
                onViewportEnter={() => setActive(i)}
                viewport={{ margin: '-45% 0px -45% 0px' }}
              >
                <span className="tm-stop__dot" aria-hidden="true" />
                <time className="tm-kicker text-tm-ink">{item.period}</time>
                <h3 className="mt-3 text-[clamp(1.5rem,2.2vw,2.25rem)] font-semibold leading-tight">
                  {item.title}
                </h3>
                <p className="mt-2 text-[1.0625rem] text-tm-ink">{item.subtitle}</p>
                {item.badge && <span className="tm-tag mt-3">{item.badge}</span>}
                {item.highlights.length > 0 && (
                  <ul
                    className="mt-5 space-y-3"
                    aria-label={`Key responsibilities at ${item.title}`}
                  >
                    {item.highlights.map((highlight) => (
                      <li key={highlight} className="flex gap-3 text-tm-ink">
                        <span aria-hidden="true">–</span>
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </motion.li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
