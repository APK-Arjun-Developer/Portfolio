import { useClock } from '../clock';

export default function LocalClock() {
  const { time, date } = useClock();
  return (
    <div className="tm-chip flex items-center gap-3 whitespace-nowrap px-3.5 py-2.5 text-sm">
      <span className="text-tm-muted">Local time</span>
      <span className="min-w-[3.75rem] font-medium tabular-nums text-tm-ink">{time}</span>
      <span className="hidden text-tm-line-strong md:inline" aria-hidden="true">
        •
      </span>
      <span className="hidden font-medium text-tm-muted md:inline">{date}</span>
    </div>
  );
}
