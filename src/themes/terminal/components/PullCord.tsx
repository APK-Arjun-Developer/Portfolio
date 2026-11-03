import { useEffect, useRef, type PointerEvent } from 'react';
import { prefersReducedMotion } from '../motion';
import { useMode } from '../theme';

const SEGMENTS = 20;
const GRAVITY = 1500; // px/s²
const STEP = 1 / 60;
const SOLVER_PASSES = 8;
const DAMPING = 0.985;
/** How far the ceiling switch travels before it clicks. */
const TRAVEL = 70;
const CLICK_AT = TRAVEL * 0.8;
const REARM_AT = TRAVEL * 0.25;
const SETTLED = 0.03;
/** Frames the rope must stay still and plumb before the animation sleeps. */
const CALM_FRAMES = 20;
const SETTLE_STEPS = 240;
const EDGE_MARGIN = 18;

interface Point {
  x: number;
  y: number;
  px: number;
  py: number;
}

/** A rope hanging from the ceiling: grab it and swing it, or pull it down to switch modes. */
export default function PullCord() {
  const { mode, toggle } = useMode();
  const dark = mode === 'dark';
  const wrap = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const hit = useRef<HTMLButtonElement>(null);
  const toggleRef = useRef(toggle);
  // Commands for the running simulation, set from pointer and click handlers.
  const grab = useRef<{ x: number; y: number } | null>(null);
  const kick = useRef<() => void>(() => {});
  const grabWake = useRef<() => void>(() => {});
  const down = useRef<{ x: number; y: number } | null>(null);
  const dragged = useRef(false);

  useEffect(() => {
    toggleRef.current = toggle;
  }, [toggle]);

  useEffect(() => {
    const box = wrap.current;
    if (!box) return;
    const ctx = canvas.current?.getContext?.('2d') ?? null;

    let length = 0;
    let seg = 0;
    let anchorX = 0;
    let pull = 0;
    let armed = true;
    let raf = 0;
    let points: Point[] = [];

    const hang = () => {
      const width = document.documentElement.clientWidth || window.innerWidth;
      const narrow = width < 640;
      length = narrow ? 170 : 380;
      seg = length / SEGMENTS;
      anchorX = width - (narrow ? 44 : 80);
      points = Array.from({ length: SEGMENTS + 1 }, (_, i) => {
        const y = -TRAVEL + i * seg;
        return { x: anchorX, y, px: anchorX, py: y };
      });
    };

    const resize = () => {
      if (!canvas.current || !ctx) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.current.width = box.clientWidth * dpr;
      canvas.current.height = box.clientHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const simulate = () => {
      const held = grab.current;
      if (held) pull = Math.min(TRAVEL, Math.max(0, held.y - (length - TRAVEL)));
      else pull *= 0.82;

      if (pull > CLICK_AT && armed) {
        armed = false;
        dragged.current = true;
        toggleRef.current();
      }
      if (pull < REARM_AT) armed = true;

      points[0].x = anchorX;
      points[0].y = -TRAVEL + pull;

      let motion = 0;
      for (let i = 1; i <= SEGMENTS; i += 1) {
        const p = points[i];
        const vx = (p.x - p.px) * DAMPING;
        const vy = (p.y - p.py) * DAMPING;
        p.px = p.x;
        p.py = p.y;
        p.x += vx;
        p.y += vy + GRAVITY * STEP * STEP;
        motion += Math.abs(vx) + Math.abs(vy);
      }
      const tip = points[SEGMENTS];
      if (held) {
        // The rope can't reach further than its own length.
        const dx = held.x - anchorX;
        const dy = held.y - points[0].y;
        const reach = Math.min(1, length / (Math.hypot(dx, dy) || 1));
        tip.x = anchorX + dx * reach;
        tip.y = points[0].y + dy * reach;
      }
      for (let pass = 0; pass < SOLVER_PASSES; pass += 1) {
        for (let i = 0; i < SEGMENTS; i += 1) {
          const a = points[i];
          const b = points[i + 1];
          const dx = b.x - a.x;
          const dy = b.y - a.y;
          const gap = Math.hypot(dx, dy) || 1;
          const stretch = (gap - seg) / gap;
          const pinA = i === 0 ? 0 : 0.5;
          const pinB = i + 1 === SEGMENTS && held ? 0 : 0.5;
          const share = pinA + pinB || 1;
          a.x += (dx * stretch * pinA) / share;
          a.y += (dy * stretch * pinA) / share;
          b.x -= (dx * stretch * pinB) / share;
          b.y -= (dy * stretch * pinB) / share;
        }
      }
      // The screen edges stop the rope, so a hard swing can't carry it out of sight.
      const maxX = (document.documentElement.clientWidth || window.innerWidth) - EDGE_MARGIN;
      for (const p of points) p.x = Math.min(maxX, Math.max(EDGE_MARGIN, p.x));
      return motion / SEGMENTS;
    };

    const draw = () => {
      const tip = points[SEGMENTS];
      if (hit.current) {
        hit.current.style.transform = `translate(${tip.x - 32}px, ${tip.y - 24}px)`;
      }
      if (!ctx) return;
      ctx.clearRect(0, 0, box.clientWidth, box.clientHeight);
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      const trace = () => {
        ctx.beginPath();
        points.forEach((p, i) => (i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y)));
      };
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.18)';
      ctx.lineWidth = 3;
      ctx.save();
      ctx.translate(5, 3);
      trace();
      ctx.stroke();
      ctx.restore();
      ctx.strokeStyle = '#a4977f';
      ctx.lineWidth = 3;
      trace();
      ctx.stroke();
      ctx.setLineDash([2, 3]);
      ctx.strokeStyle = '#e4dac6';
      ctx.lineWidth = 1.5;
      trace();
      ctx.stroke();
      ctx.setLineDash([]);

      // Wooden pull at the end, aligned with the last stretch of rope.
      const before = points[SEGMENTS - 2];
      ctx.save();
      ctx.translate(tip.x, tip.y);
      ctx.rotate(Math.atan2(tip.y - before.y, tip.x - before.x) - Math.PI / 2);
      ctx.fillStyle = '#c4a15c';
      ctx.fillRect(-3, -5, 6, 8);
      const wood = ctx.createRadialGradient(-4, 12, 1, 0, 16, 18);
      wood.addColorStop(0, '#a4683d');
      wood.addColorStop(1, '#4a2614');
      ctx.fillStyle = wood;
      ctx.beginPath();
      ctx.moveTo(0, 2);
      ctx.bezierCurveTo(12, 12, 14, 30, 0, 36);
      ctx.bezierCurveTo(-14, 30, -12, 12, 0, 2);
      ctx.fill();
      ctx.restore();
    };

    let running = false;
    let last: number | null = null;
    let motion = 0;
    let owed = 0;
    let calm = 0;
    const frame = (now: number) => {
      // Fixed steps, so the swing feels the same on a 60Hz and a 144Hz screen.
      owed += last === null ? STEP : Math.min((now - last) / 1000, 0.05);
      last = now;
      while (owed >= STEP) {
        motion = simulate();
        owed -= STEP;
      }
      draw();
      // A swing is momentarily still at each end, so being still isn't enough: it must hang plumb.
      const plumb = Math.abs(points[SEGMENTS].x - anchorX) < 1;
      calm = motion < SETTLED && plumb && !grab.current && pull < 0.05 ? calm + 1 : 0;
      if (calm > CALM_FRAMES) {
        running = false;
        return;
      }
      raf = requestAnimationFrame(frame);
    };
    const wake = () => {
      calm = 0;
      if (running) return;
      running = true;
      last = null;
      raf = requestAnimationFrame(frame);
    };

    kick.current = () => {
      if (prefersReducedMotion()) return;
      points[SEGMENTS].px -= 7;
      wake();
    };
    const settle = () => {
      hang();
      resize();
      for (let i = 0; i < SETTLE_STEPS; i += 1) simulate();
      draw();
    };
    grabWake.current = wake;

    settle();
    window.addEventListener('resize', settle);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', settle);
    };
  }, []);

  const toLocal = (event: PointerEvent) => {
    const box = wrap.current?.getBoundingClientRect();
    return { x: event.clientX - (box?.left ?? 0), y: event.clientY - (box?.top ?? 0) };
  };

  const onPointerDown = (event: PointerEvent<HTMLButtonElement>) => {
    dragged.current = false;
    event.currentTarget.setPointerCapture?.(event.pointerId);
    down.current = { ...toLocal(event) };
  };

  const onPointerMove = (event: PointerEvent) => {
    if (!down.current) return;
    const at = toLocal(event);
    if (!grab.current && Math.hypot(at.x - down.current.x, at.y - down.current.y) < 4) return;
    dragged.current = true;
    grab.current = at;
    grabWake.current();
  };

  const release = () => {
    down.current = null;
    grab.current = null;
    grabWake.current();
  };

  const onClick = () => {
    // A drag ends in a click too; a pull has already switched the mode.
    if (!dragged.current) {
      toggle();
      kick.current();
    }
    dragged.current = false;
  };

  return (
    <div ref={wrap} className="tm-cord">
      <canvas ref={canvas} className="absolute inset-0 h-full w-full" aria-hidden="true" />
      <button
        ref={hit}
        type="button"
        role="switch"
        aria-checked={dark}
        aria-label="Dark mode (pull the cord)"
        title="Pull the cord to switch light and dark"
        className="tm-cord__hit"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={release}
        onPointerCancel={release}
        onLostPointerCapture={release}
        onClick={onClick}
      />
    </div>
  );
}
