import { useEffect, useState } from 'react';

const MONTH_FORMAT = new Intl.DateTimeFormat('en-GB', { month: 'long' });

export function formatClock(now: Date) {
  const hours = now.getHours();
  const minutes = String(now.getMinutes()).padStart(2, '0');
  return {
    time: `${hours % 12 || 12}:${minutes}${hours < 12 ? 'am' : 'pm'}`,
    date: `${now.getDate()} ${MONTH_FORMAT.format(now)}, ${now.getFullYear()}`,
  };
}

/** The visitor's own time and date, ticking. */
export function useClock() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(timer);
  }, []);
  return formatClock(now);
}
