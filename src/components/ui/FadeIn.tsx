import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Box } from '@mui/material';

interface Props {
  children: ReactNode;
  delay?: number;
  direction?: 'up' | 'left' | 'right' | 'none';
}

export default function FadeIn({ children, delay = 0, direction = 'up' }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const translate = direction === 'up' ? 'translateY(30px)' : direction === 'left' ? 'translateX(-30px)' : direction === 'right' ? 'translateX(30px)' : 'none';

  return (
    <Box
      ref={ref}
      sx={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'none' : translate,
        transition: `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms`,
      }}
    >
      {children}
    </Box>
  );
}
