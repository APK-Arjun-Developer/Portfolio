import { useEffect, useRef, useState } from 'react';

/** Hero-only ambient gradient mesh; pauses its CSS animation while off-screen. */
export default function SignalMesh() {
  const ref = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => setPaused(!entry.isIntersecting));
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return <div ref={ref} className="sg-mesh" data-paused={paused} aria-hidden="true" />;
}
