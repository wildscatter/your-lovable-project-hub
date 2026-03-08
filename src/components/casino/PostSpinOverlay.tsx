import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sparkles, Clock, ChevronRight } from "lucide-react";

interface PostSpinOverlayProps {
  nextSpinTime: Date | null;
  visible: boolean;
}

const PostSpinOverlay = ({ nextSpinTime, visible }: PostSpinOverlayProps) => {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState({ h: 0, m: 0, s: 0 });
  const [totalSeconds, setTotalSeconds] = useState(0);
  const [initialSeconds, setInitialSeconds] = useState(1);

  useEffect(() => {
    if (!nextSpinTime) return;
    const totalDiff = Math.max(0, Math.floor((nextSpinTime.getTime() - Date.now()) / 1000));
    setInitialSeconds(totalDiff || 1);

    const interval = setInterval(() => {
      const diff = Math.max(0, nextSpinTime.getTime() - Date.now());
      const secs = Math.floor(diff / 1000);
      setTotalSeconds(secs);
      setCountdown({
        h: Math.floor(secs / 3600),
        m: Math.floor((secs % 3600) / 60),
        s: secs % 60,
      });
      if (diff <= 0) clearInterval(interval);
    }, 1000);
    return () => clearInterval(interval);
  }, [nextSpinTime]);

  if (!visible) return null;

  const progress = initialSeconds > 0 ? ((initialSeconds - totalSeconds) / initialSeconds) : 1;
  const ringRadius = 46;
  const ringCircumference = 2 * Math.PI * ringRadius;
  const ringOffset = ringCircumference - progress * ringCircumference;
  const pad = (n: number) => n.toString().padStart(2, "0");

  return (
    <div className="absolute inset-0 z-30 flex items-center justify-center animate-fade-in">
      {/* Semi-transparent backdrop */}
      <div className="absolute inset-0 bg-background/85 backdrop-blur-md rounded-2xl" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center gap-4 px-4 py-5 max-w-[300px] w-full">
        {/* Clock icon badge */}
        <div className="relative">
          <div className="absolute -inset-3 rounded-full bg-primary/10 animate-pulse" />
          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-[hsl(42,100%,65%)] flex items-center justify-center shadow-lg shadow-primary/30">
            <Clock className="h-5 w-5 text-primary-foreground" />
          </div>
        </div>

        {/* Title */}
        <div className="text-center space-y-1">
          <h3 className="text-xl font-extrabold text-foreground tracking-tight drop-shadow-lg">
            Come Back Tomorrow!
          </h3>
          <p className="text-xs font-medium text-foreground/80">
            Your next spin is waiting for you
          </p>
        </div>

        {/* Countdown ring */}
        <div className="relative w-[110px] h-[110px]">
          {/* Glow behind ring */}
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background: "radial-gradient(circle, hsl(38 95% 58% / 0.08), transparent 70%)",
            }}
          />
          <svg className="w-full h-full -rotate-90" viewBox="0 0 110 110">
            {/* Track */}
            <circle
              cx="70" cy="70" r={ringRadius}
              fill="none"
              stroke="hsl(var(--secondary))"
              strokeWidth="5"
              opacity="0.25"
            />
            {/* Progress arc */}
            <circle
              cx="70" cy="70" r={ringRadius}
              fill="none"
              stroke="url(#countdownGradient)"
              strokeWidth="5"
              strokeLinecap="round"
              strokeDasharray={ringCircumference}
              strokeDashoffset={ringOffset}
              className="transition-all duration-1000 ease-linear"
              style={{
                filter: "drop-shadow(0 0 6px hsl(38 95% 58% / 0.5))",
              }}
            />
            <defs>
              <linearGradient id="countdownGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="hsl(38, 95%, 55%)" />
                <stop offset="50%" stopColor="hsl(42, 100%, 65%)" />
                <stop offset="100%" stopColor="hsl(38, 95%, 55%)" />
              </linearGradient>
            </defs>
          </svg>

          {/* Countdown digits inside ring */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="flex items-baseline gap-0.5 font-mono">
              <span className="text-lg font-extrabold text-foreground">{pad(countdown.h)}</span>
              <span className="text-sm text-primary font-bold animate-pulse">:</span>
              <span className="text-lg font-extrabold text-foreground">{pad(countdown.m)}</span>
              <span className="text-sm text-primary font-bold animate-pulse">:</span>
              <span className="text-lg font-extrabold text-foreground">{pad(countdown.s)}</span>
            </div>
            <span className="text-[8px] text-muted-foreground/60 uppercase tracking-widest mt-1">
              until next spin
            </span>
          </div>
        </div>

        {/* Divider */}
        <div className="w-full flex items-center gap-3">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
          <Sparkles className="h-3 w-3 text-primary/40" />
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
        </div>

        {/* CTA Button */}
        <Button
          size="lg"
          onClick={() => navigate("/#top-casinos")}
          className="w-full glow-pulse-btn bg-gradient-to-r from-primary via-[hsl(42,100%,65%)] to-primary text-primary-foreground font-bold text-sm px-6 py-6 rounded-xl hover:opacity-90 transition-all shadow-lg shadow-primary/25 border border-primary/30 group"
        >
          <span>Explore Top Casinos</span>
          <ChevronRight className="h-4 w-4 ml-1 group-hover:translate-x-0.5 transition-transform" />
        </Button>

        <p className="text-[10px] text-muted-foreground/50 text-center">
          Discover the best casino offers while you wait
        </p>
      </div>
    </div>
  );
};

export default PostSpinOverlay;
