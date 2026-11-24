import { useEffect, useRef, useState, type MouseEvent, type PointerEvent } from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { projects, type Project } from '../../../data/personal';
import { analytics } from '../../../lib/analytics';
import { doorColour } from '../content';
import { ease, prefersReducedMotion, spring } from '../motion';

const WALK_MS = 620;
const DOOR_AJAR_DEG = 11;
const DOOR_OPEN_DEG = 70;
const INFO_ITEMS = 5;

interface GateProps {
  project: Project;
  active: boolean;
  /** Another door in this row is the active one, so this one steps back. */
  dimmed: boolean;
  /** The last door has no neighbour to its right, so its panel sits on the left. */
  infoSide: 'left' | 'right';
  onActive: (active: boolean) => void;
  onCursor: (event: PointerEvent | null) => void;
}

function Gate({ project, active, dimmed, infoSide, onActive, onCursor }: Readonly<GateProps>) {
  const navigate = useNavigate();
  const [walking, setWalking] = useState(false);
  const walkTimer = useRef(0);
  const to = `/projects/${project.id}`;
  const infoId = `door-info-${project.id}`;

  useEffect(() => () => window.clearTimeout(walkTimer.current), []);

  const onClick = (event: MouseEvent) => {
    if (walking) {
      event.preventDefault();
      return;
    }
    analytics.projectViewDetails(project.title);
    // New-tab clicks and reduced motion go straight through the link.
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    if (prefersReducedMotion()) return;
    event.preventDefault();
    setWalking(true);
    onCursor(null);
    walkTimer.current = window.setTimeout(() => navigate(to), WALK_MS);
  };

  let angle = 0;
  if (walking) angle = DOOR_OPEN_DEG;
  else if (active) angle = DOOR_AJAR_DEG;

  const scale = walking ? 1.14 : 1;

  return (
    <li
      className="tm-gate"
      data-active={active}
      data-dim={dimmed}
      data-side={infoSide}
      style={{ '--door': doorColour(projects.indexOf(project)) } as React.CSSProperties}
    >
      <Link
        to={to}
        onClick={onClick}
        onPointerEnter={(event) => {
          if (event.pointerType === 'mouse') onActive(true);
          onCursor(event);
        }}
        onPointerMove={(event) => onCursor(event)}
        onPointerLeave={() => {
          onActive(false);
          onCursor(null);
        }}
        onFocus={() => onActive(true)}
        onBlur={() => onActive(false)}
        aria-label={`Open ${project.title}`}
        aria-describedby={infoId}
        className="block rounded-xl"
      >
        <motion.span
          className="tm-doorway"
          aria-hidden="true"
          animate={{ scale }}
          transition={walking ? { duration: WALK_MS / 1000, ease: ease.inOut } : spring.door}
        >
          <span className="tm-doorway__opening">
            <span className="tm-room" />
            <motion.span className="tm-door" animate={{ rotateY: angle }} transition={spring.door}>
              <span className="tm-door__panel" />
              <span className="tm-door__plate">{project.title}</span>
              <span className="tm-door__handle">
                <i />
              </span>
              <span className="tm-door__lock" />
            </motion.span>
          </span>
        </motion.span>
      </Link>

      <div id={infoId} className="tm-doorinfo">
        <h3 className="text-[1.75rem] font-semibold leading-[1.1]">{project.title}</h3>
        <p className="tm-kicker mt-2 text-tm-accent-text">{project.tagline}</p>
        {project.companyName && (
          <p className="mt-2 text-sm text-tm-ink">
            {project.companyName}
            {project.role && ` · ${project.role}`}
          </p>
        )}
        <ul className="mt-4 space-y-2" aria-label="Technologies used">
          {project.techStack.slice(0, INFO_ITEMS).map((tech) => (
            <li
              key={tech}
              className="flex items-start gap-2.5 text-[0.9375rem] leading-snug text-tm-ink"
            >
              <span className="tm-doorinfo__tick" aria-hidden="true">
                <Check size={10} strokeWidth={3.5} />
              </span>
              {tech}
            </li>
          ))}
        </ul>
      </div>

      {walking && (
        <motion.span
          className="fixed inset-0 z-50 bg-tm-bg"
          aria-hidden="true"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: WALK_MS / 1000, ease: ease.inOut }}
        />
      )}
    </li>
  );
}

/**
 * A wall of doors. With a mouse or keyboard, the active door comes forward with its details
 * beside it while the others fade back. Without hover, the details sit under each door.
 */
export default function GateRow({ gates }: Readonly<{ gates: Project[] }>) {
  const badge = useRef<HTMLSpanElement>(null);
  const [activeId, setActiveId] = useState<string | null>(null);

  // The badge sits exactly on a mouse pointer; touch has no hover to attach it to.
  const onCursor = (event: PointerEvent | null) => {
    const el = badge.current;
    if (!el) return;
    if (!event || event.pointerType !== 'mouse') {
      el.dataset.on = 'false';
      return;
    }
    el.dataset.on = 'true';
    el.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0) translate(-50%, -50%)`;
  };

  return (
    <>
      <ul className="tm-gates">
        {gates.map((project, i) => (
          <Gate
            key={project.id}
            project={project}
            active={activeId === project.id}
            dimmed={activeId !== null && activeId !== project.id}
            infoSide={i === gates.length - 1 ? 'left' : 'right'}
            onActive={(on) =>
              setActiveId((current) => {
                if (on) return project.id;
                return current === project.id ? null : current;
              })
            }
            onCursor={onCursor}
          />
        ))}
      </ul>
      <span ref={badge} className="tm-door-cursor" data-on="false" aria-hidden="true">
        Click to enter
      </span>
    </>
  );
}
