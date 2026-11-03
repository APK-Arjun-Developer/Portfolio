import { useState, type PointerEvent } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { personal } from '../../../data/personal';
import { heroFacts, skillGroups } from '../content';
import { prefersReducedMotion } from '../motion';
import Dialog from './Dialog';

const TILT_DEG = 12;
const tiltSpring = { stiffness: 180, damping: 18 };

/** A card that leans toward the pointer and flips: facts and skills, no made-up ratings. */
export default function AbilityCard({
  open,
  onClose,
}: Readonly<{ open: boolean; onClose: () => void }>) {
  const [flipped, setFlipped] = useState(false);
  const tiltX = useMotionValue(0);
  const tiltY = useMotionValue(0);
  const rotateX = useSpring(tiltX, tiltSpring);
  const rotateY = useSpring(tiltY, tiltSpring);

  const lean = (event: PointerEvent<HTMLElement>) => {
    if (prefersReducedMotion()) return;
    const box = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - box.left) / (box.width || 1) - 0.5;
    const y = (event.clientY - box.top) / (box.height || 1) - 0.5;
    tiltX.set(-y * TILT_DEG * 2);
    tiltY.set(x * TILT_DEG * 2);
  };

  const settle = () => {
    tiltX.set(0);
    tiltY.set(0);
  };

  const close = () => {
    setFlipped(false);
    settle();
    onClose();
  };

  return (
    <Dialog open={open} onClose={close} label="My ability card" className="tm-dialog--bare">
      <motion.div
        className="tm-card-stage"
        style={{ rotateX, rotateY }}
        onPointerMove={lean}
        onPointerLeave={settle}
      >
        <div className="tm-card" data-flipped={flipped}>
          <div className="tm-card__face" aria-hidden={flipped}>
            <p className="tm-eyebrow text-[#c9c0b8]">Ability card</p>
            <h2 className="mt-3 text-4xl font-semibold leading-none text-[#f3efea]">
              {personal.name}
            </h2>
            <p className="mt-2 text-[#c9c0b8]">{personal.role}</p>
            <dl className="mt-auto space-y-4">
              {heroFacts.map(({ value, label }) => (
                <div key={label} className="flex items-baseline justify-between gap-4">
                  <dt className="text-sm text-[#c9c0b8]">{label}</dt>
                  <dd className="text-3xl font-semibold text-[#f3efea]">{value}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="tm-card__face tm-card__face--back" aria-hidden={!flipped}>
            <p className="tm-eyebrow text-[#c9c0b8]">Capabilities</p>
            <ul className="mt-4 space-y-4 overflow-y-auto">
              {skillGroups.map((group) => (
                <li key={group.title}>
                  <p className="font-semibold text-[#f3efea]">{group.title}</p>
                  <p className="mt-1 text-sm leading-snug text-[#c9c0b8]">
                    {group.items.join(' · ')}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </motion.div>
      <button
        type="button"
        className="tm-btn-secondary mx-auto mt-5 flex border-[#ffffff40] text-[#f3efea]"
        aria-pressed={flipped}
        onClick={() => setFlipped((side) => !side)}
      >
        Flip card
      </button>
    </Dialog>
  );
}
