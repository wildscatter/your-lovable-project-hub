import { useRef, useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Gift, RotateCcw, Sparkles, Trophy, LogIn } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface Prize {
  label: string;
  color: string;
  textColor: string;
  icon: string;
  points: number;
  gradient?: string;
}

const PRIZES: Prize[] = [
  { label: "500 PTS", color: "hsl(38, 95%, 58%)", textColor: "#1a1a2e", icon: "⭐", points: 500, gradient: "hsl(42, 100%, 65%)" },
  { label: "100 PTS", color: "hsl(230, 18%, 14%)", textColor: "#c8c0b0", icon: "🔹", points: 100, gradient: "hsl(230, 18%, 18%)" },
  { label: "TRY AGAIN", color: "hsl(4, 75%, 48%)", textColor: "#ffd4d4", icon: "🔄", points: 0, gradient: "hsl(4, 85%, 55%)" },
  { label: "250 PTS", color: "hsl(38, 70%, 38%)", textColor: "#f5f0e0", icon: "💎", points: 250, gradient: "hsl(38, 80%, 48%)" },
  { label: "1000 PTS", color: "hsl(155, 75%, 32%)", textColor: "#d0fff0", icon: "🏆", points: 1000, gradient: "hsl(155, 75%, 42%)" },
  { label: "50 PTS", color: "hsl(230, 18%, 18%)", textColor: "#a8a0b0", icon: "✨", points: 50, gradient: "hsl(230, 18%, 24%)" },
  { label: "2000 PTS", color: "hsl(280, 60%, 42%)", textColor: "#f0d0ff", icon: "👑", points: 2000, gradient: "hsl(280, 60%, 55%)" },
  { label: "150 PTS", color: "hsl(215, 55%, 42%)", textColor: "#d0e0ff", icon: "🎯", points: 150, gradient: "hsl(215, 55%, 55%)" },
];

const WHEEL_SIZE = 340;
const CENTER = WHEEL_SIZE / 2;
const RADIUS = WHEEL_SIZE / 2 - 8;
const ARC = (2 * Math.PI) / PRIZES.length;

const SpinWheel = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<Prize | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [open, setOpen] = useState(false);
  const animRef = useRef<number>(0);
  const startTimeRef = useRef(0);
  const startRotRef = useRef(0);
  const targetRotRef = useRef(0);
  const { user } = useAuth();
  const navigate = useNavigate();

  const drawWheel = useCallback((rot: number, highlightIndex?: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = WHEEL_SIZE * dpr;
    canvas.height = WHEEL_SIZE * dpr;
    ctx.scale(dpr, dpr);

    ctx.clearRect(0, 0, WHEEL_SIZE, WHEEL_SIZE);
    ctx.save();
    ctx.translate(CENTER, CENTER);
    ctx.rotate(rot);

    PRIZES.forEach((prize, i) => {
      const startAngle = i * ARC - Math.PI / 2;
      const endAngle = startAngle + ARC;

      // Segment with gradient
      const grad = ctx.createRadialGradient(0, 0, 20, 0, 0, RADIUS);
      grad.addColorStop(0, prize.gradient || prize.color);
      grad.addColorStop(1, prize.color);

      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, RADIUS, startAngle, endAngle);
      ctx.closePath();
      ctx.fillStyle = grad;
      ctx.fill();

      // Segment borders
      ctx.strokeStyle = "hsl(230, 20%, 7%)";
      ctx.lineWidth = 2.5;
      ctx.stroke();

      // Inner accent line
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, RADIUS - 1, startAngle, endAngle);
      ctx.strokeStyle = "hsla(0, 0%, 100%, 0.06)";
      ctx.lineWidth = 1;
      ctx.stroke();

      // Icon (larger, centered)
      ctx.save();
      ctx.rotate(startAngle + ARC / 2);
      ctx.font = "20px serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(prize.icon, RADIUS * 0.7, 0);

      // Label text
      ctx.fillStyle = prize.textColor;
      ctx.font = "bold 10px system-ui, -apple-system, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(prize.label, RADIUS * 0.42, 0);
      ctx.restore();
    });

    // Outer ring dots
    for (let i = 0; i < 32; i++) {
      const angle = (i / 32) * Math.PI * 2;
      const x = Math.cos(angle) * (RADIUS - 6);
      const y = Math.sin(angle) * (RADIUS - 6);
      ctx.beginPath();
      ctx.arc(x, y, 1.5, 0, Math.PI * 2);
      ctx.fillStyle = i % 2 === 0 ? "hsl(38, 95%, 58%)" : "hsla(0, 0%, 100%, 0.15)";
      ctx.fill();
    }

    // Center hub — outer ring
    ctx.beginPath();
    ctx.arc(0, 0, 32, 0, 2 * Math.PI);
    const hubGrad = ctx.createRadialGradient(0, 0, 5, 0, 0, 32);
    hubGrad.addColorStop(0, "hsl(42, 100%, 70%)");
    hubGrad.addColorStop(1, "hsl(38, 95%, 50%)");
    ctx.fillStyle = hubGrad;
    ctx.fill();
    ctx.strokeStyle = "hsl(230, 20%, 7%)";
    ctx.lineWidth = 3;
    ctx.stroke();

    // Center hub — inner circle
    ctx.beginPath();
    ctx.arc(0, 0, 20, 0, 2 * Math.PI);
    const innerGrad = ctx.createRadialGradient(0, 0, 2, 0, 0, 20);
    innerGrad.addColorStop(0, "hsl(230, 18%, 14%)");
    innerGrad.addColorStop(1, "hsl(230, 20%, 7%)");
    ctx.fillStyle = innerGrad;
    ctx.fill();
    ctx.strokeStyle = "hsl(38, 80%, 50%)";
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Center text
    ctx.fillStyle = "hsl(38, 95%, 58%)";
    ctx.font = "bold 12px system-ui";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("SPIN", 0, 0);

    ctx.restore();
  }, []);

  useEffect(() => {
    if (open) {
      setTimeout(() => drawWheel(rotation), 50);
    }
  }, [open, drawWheel, rotation]);

  const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

  const spin = useCallback(() => {
    if (spinning) return;
    setSpinning(true);
    setResult(null);
    setShowResult(false);

    const prizeIndex = Math.floor(Math.random() * PRIZES.length);
    const extraSpins = 5 + Math.random() * 3;
    const prizeAngle = (2 * Math.PI) - (prizeIndex * ARC + ARC / 2);
    const totalRotation = extraSpins * 2 * Math.PI + prizeAngle;

    startRotRef.current = rotation;
    targetRotRef.current = rotation + totalRotation;
    startTimeRef.current = performance.now();
    const duration = 4500 + Math.random() * 1500;

    const animate = (now: number) => {
      const elapsed = now - startTimeRef.current;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeOutCubic(progress);
      const currentRot = startRotRef.current + (targetRotRef.current - startRotRef.current) * eased;

      setRotation(currentRot);
      drawWheel(currentRot);

      if (progress < 1) {
        animRef.current = requestAnimationFrame(animate);
      } else {
        setSpinning(false);
        setResult(PRIZES[prizeIndex]);
        setTimeout(() => setShowResult(true), 300);
      }
    };

    animRef.current = requestAnimationFrame(animate);
  }, [spinning, rotation, drawWheel]);

  useEffect(() => {
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, []);

  const handleClose = () => {
    setOpen(false);
    setResult(null);
    setShowResult(false);
  };

  const handleOpenWheel = () => {
    if (!user) {
      navigate("/auth");
      return;
    }
    setOpen(true);
  };

  // Result card style based on prize
  const getResultStyle = (prize: Prize) => {
    if (prize.points === 0) {
      return {
        border: "border-accent/30",
        bg: "bg-accent/5",
        titleColor: "text-accent",
        icon: "😅",
        subtitle: "Better luck next time!",
      };
    }
    if (prize.points >= 1000) {
      return {
        border: "border-primary/40",
        bg: "bg-gradient-to-br from-primary/10 to-primary/5",
        titleColor: "text-primary",
        icon: "🎉",
        subtitle: "Amazing! Jackpot points earned!",
      };
    }
    if (prize.points >= 250) {
      return {
        border: "border-primary/25",
        bg: "bg-primary/5",
        titleColor: "text-primary",
        icon: "🔥",
        subtitle: "Great spin! Points added to your balance.",
      };
    }
    return {
      border: "border-border",
      bg: "bg-secondary/30",
      titleColor: "text-foreground",
      icon: "✅",
      subtitle: "Points added to your balance.",
    };
  };

  return (
    <>
      <section className="py-8 sm:py-12">
        <div className="w-full px-4 sm:px-6 md:px-12 lg:px-20">
          <div className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-card via-card to-secondary/30 p-6 sm:p-10 text-center">
            <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,hsl(38_95%_58%/0.04),transparent_70%)]" />
            <div className="relative z-10 flex flex-col items-center gap-4">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary animate-pulse" />
                <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground">
                  Spin & <span className="text-primary italic">Win Points</span>
                </h2>
                <Sparkles className="h-5 w-5 text-primary animate-pulse" />
              </div>
              <p className="text-muted-foreground text-sm sm:text-base max-w-md">
                {user
                  ? "Try your luck! Spin the wheel to earn bonus points."
                  : "Sign in to spin the wheel and earn bonus points!"}
              </p>
              <Button
                size="lg"
                onClick={handleOpenWheel}
                className="glow-pulse-btn bg-gradient-to-r from-primary to-gold-dim text-primary-foreground font-bold text-base px-10 py-7 rounded-xl hover:opacity-90 transition-opacity shadow-lg shadow-primary/20 mt-2"
              >
                {user ? (
                  <>
                    <Gift className="h-5 w-5 mr-2" />
                    Spin the Wheel
                  </>
                ) : (
                  <>
                    <LogIn className="h-5 w-5 mr-2" />
                    Sign In to Spin
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-[440px] p-0 bg-gradient-to-b from-card to-background border-primary/20 overflow-hidden">
          <DialogHeader className="p-6 pb-2">
            <DialogTitle className="text-center text-2xl font-extrabold flex items-center justify-center gap-2">
              <Trophy className="h-5 w-5 text-primary" />
              <span className="text-primary italic">Spin</span> & Win Points
            </DialogTitle>
            <DialogDescription className="text-center text-muted-foreground text-sm">
              Tap the button to spin — earn points every time!
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col items-center px-6 pb-6 gap-5">
            <div className="relative">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1 z-20">
                <div
                  className="w-0 h-0"
                  style={{
                    borderLeft: "14px solid transparent",
                    borderRight: "14px solid transparent",
                    borderTop: "28px solid hsl(38, 95%, 58%)",
                    filter: "drop-shadow(0 2px 8px hsl(38 95% 58% / 0.5))",
                  }}
                />
              </div>

              <div
                className="absolute inset-0 rounded-full"
                style={{
                  boxShadow: spinning
                    ? "0 0 40px hsl(38 95% 58% / 0.35), 0 0 80px hsl(38 95% 58% / 0.12)"
                    : "0 0 20px hsl(38 95% 58% / 0.15)",
                  transition: "box-shadow 0.5s ease",
                }}
              />

              <div
                className="absolute -inset-3 rounded-full border-[3px] border-primary/20"
                style={{
                  background: "conic-gradient(from 0deg, hsl(38 95% 58% / 0.1), transparent 10%, hsl(38 95% 58% / 0.1) 12.5%, transparent 22.5%, hsl(38 95% 58% / 0.1) 25%, transparent 35%, hsl(38 95% 58% / 0.1) 37.5%, transparent 47.5%, hsl(38 95% 58% / 0.1) 50%, transparent 60%, hsl(38 95% 58% / 0.1) 62.5%, transparent 72.5%, hsl(38 95% 58% / 0.1) 75%, transparent 85%, hsl(38 95% 58% / 0.1) 87.5%, transparent 97.5%)",
                }}
              />

              <canvas
                ref={canvasRef}
                style={{ width: WHEEL_SIZE, height: WHEEL_SIZE }}
                className="rounded-full relative z-10"
              />
            </div>

            <Button
              size="lg"
              onClick={spin}
              disabled={spinning}
              className="glow-pulse-btn bg-gradient-to-r from-primary to-gold-dim text-primary-foreground font-bold text-lg px-12 py-7 rounded-xl hover:opacity-90 transition-all shadow-lg shadow-primary/20 disabled:opacity-50 disabled:animate-none w-full max-w-[280px]"
            >
              {spinning ? (
                <RotateCcw className="h-5 w-5 mr-2 animate-spin" />
              ) : (
                <Sparkles className="h-5 w-5 mr-2" />
              )}
              {spinning ? "Spinning..." : "SPIN NOW"}
            </Button>

            {showResult && result && (() => {
              const style = getResultStyle(result);
              return (
                <div className={`animate-scale-in text-center ${style.bg} border ${style.border} rounded-2xl px-6 py-5 w-full`}>
                  <p className="text-3xl mb-2">{style.icon}</p>
                  <p className={`text-2xl font-extrabold italic ${style.titleColor}`}>
                    {result.icon} {result.label}
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    {style.subtitle}
                  </p>
                  {result.points > 0 && (
                    <div className="mt-3 inline-flex items-center gap-1.5 bg-primary/10 border border-primary/20 rounded-full px-4 py-1.5">
                      <span className="text-xs font-bold text-primary">+{result.points.toLocaleString()} pts</span>
                    </div>
                  )}
                </div>
              );
            })()}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SpinWheel;
