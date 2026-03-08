import { useEffect, useState } from "react";
import { Clock, Flame } from "lucide-react";

// ── Campaign end date (change this to set the deadline) ──
const CAMPAIGN_END = new Date("2026-03-19T00:00:00Z");

interface TimeLeft {
  d: number;
  h: number;
  m: number;
  s: number;
  total: number;
}

const calcTimeLeft = (): TimeLeft => {
  const total = Math.max(0, CAMPAIGN_END.getTime() - Date.now());
  return {
    d: Math.floor(total / 86400000),
    h: Math.floor((total % 86400000) / 3600000),
    m: Math.floor((total % 3600000) / 60000),
    s: Math.floor((total % 60000) / 1000),
    total,
  };
};

interface CampaignCountdownProps {
  onExpired?: () => void;
}

const CampaignCountdown = ({ onExpired }: CampaignCountdownProps) => {
  const [time, setTime] = useState<TimeLeft>(calcTimeLeft);
  const expired = time.total <= 0;

  useEffect(() => {
    const interval = setInterval(() => {
      const t = calcTimeLeft();
      setTime(t);
      if (t.total <= 0) {
        clearInterval(interval);
        onExpired?.();
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [onExpired]);

  const pad = (n: number) => n.toString().padStart(2, "0");

  // Progress for the arc (10 days = 864000000ms)
  const totalDuration = 10 * 86400000;
  const elapsed = totalDuration - time.total;
  const progress = Math.min(elapsed / totalDuration, 1);

  if (expired) {
    return (
      <div className="bg-destructive/10 border border-destructive/30 rounded-xl p-4 text-center animate-fade-in">
        <p className="text-sm font-bold text-destructive">🏁 Campaign has ended!</p>
        <p className="text-xs text-muted-foreground mt-1">Thanks for participating. Stay tuned for future events.</p>
      </div>
    );
  }

  const units = [
    { label: "DAYS", value: pad(time.d) },
    { label: "HRS", value: pad(time.h) },
    { label: "MIN", value: pad(time.m) },
    { label: "SEC", value: pad(time.s) },
  ];

  // Arc for the progress ring
  const ringR = 18;
  const ringC = 2 * Math.PI * ringR;
  const ringOffset = ringC * (1 - progress);

  return (
    <div className="relative overflow-hidden">
      {/* Subtle animated shimmer */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(105deg, transparent 40%, hsl(38 95% 58% / 0.04) 45%, hsl(38 95% 58% / 0.08) 50%, hsl(38 95% 58% / 0.04) 55%, transparent 60%)",
          backgroundSize: "200% 100%",
          animation: "shimmer 3s ease-in-out infinite",
        }}
      />

      <div className="relative flex items-center gap-2 px-2.5 py-1.5">
        {/* Mini progress ring */}
        <div className="relative w-[32px] h-[32px] flex-shrink-0">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 44 44">
            <circle cx="22" cy="22" r={ringR} fill="none" stroke="hsl(var(--secondary))" strokeWidth="3" opacity="0.2" />
            <circle cx="22" cy="22" r={ringR} fill="none" stroke="hsl(var(--primary))" strokeWidth="3" strokeLinecap="round" strokeDasharray={ringC} strokeDashoffset={ringOffset} className="transition-all duration-1000 ease-linear" style={{ filter: "drop-shadow(0 0 4px hsl(38 95% 58% / 0.4))" }} />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <Flame className="h-3 w-3 text-primary" />
          </div>
        </div>

        {/* Label + digits inline */}
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <p className="text-[9px] uppercase tracking-widest text-primary font-semibold flex items-center gap-1">
            <Clock className="h-2.5 w-2.5" />
            Ends in
          </p>
          <div className="flex items-baseline gap-1">
            {units.map((u, i) => (
              <div key={u.label} className="flex items-baseline gap-1">
                <div className="flex flex-col items-center">
                  <span className="text-xs font-extrabold text-foreground font-mono leading-none tabular-nums">{u.value}</span>
                  <span className="text-[6px] text-muted-foreground/50 uppercase tracking-wider">{u.label}</span>
                </div>
                {i < units.length - 1 && (
                  <span className="text-primary/40 font-bold text-[10px] leading-none animate-pulse">:</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </div>
  );
};

export { CAMPAIGN_END };
export default CampaignCountdown;
