import { motion, useScroll, useSpring } from 'framer-motion';

export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      style={{ scaleX }}
      className="fixed top-0 left-0 right-0 z-[200] h-[2px] origin-left"
      aria-hidden="true"
      role="progressbar"
      aria-label="Page scroll progress"
    >
      <div
        className="h-full w-full"
        style={{
          background: 'linear-gradient(90deg, #3b82f6, #8b5cf6, #22d3ee)',
          boxShadow: '0 0 8px rgba(59,130,246,0.6)',
        }}
      />
    </motion.div>
  );
}
