import { useRef, useState, useCallback, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Gift, RotateCcw, Sparkles, Trophy, X } from "lucide-react";

interface Prize {
  label: string;
  color: string;
  textColor: string;
  icon: string;
}

const PRIZES: Prize[] = [
  { label: "50 Free Spins", color: "hsl(38, 95%, 58%)", textColor: "#1a1a2e", icon: "🎰" },
  { label: "€10 Bonus", color: "hsl(230, 18%, 16%)", textColor: "#f5f0e0", icon: "💰" },
  { label: "Try Again", color: "hsl(4, 85%, 52%)", textColor: "#ffffff", icon: "🔄" },
  { label: "€25 Bonus", color: "hsl(38, 70%, 42%)", textColor: "#f5f0e0", icon: "💎" },
  { label: "100 Free Spins", color: "hsl(155, 75%, 38%)", textColor: "#ffffff", icon: "⭐" },
  { label: "€5 Bonus", color: "hsl(230, 18%, 22%)", textColor: "#f5f0e0", icon: "🎁" },
  { label: "VIP Access", color: "hsl(280, 60%, 50%)", textColor: "#ffffff", icon: "👑" },
  { label: "20 Free Spins", color: "hsl(215, 55%, 50%)", textColor: "#ffffff", icon: "🎲" },
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

  const drawWheel = useCallback((rot: number) => {
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

      // Segment
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, RADIUS, startAngle, endAngle);
      ctx.closePath();
      ctx.fillStyle = prize.color;
      ctx.fill();

      // Border between segments
      ctx.strokeStyle = "hsl(230, 20%, 7%)";
      ctx.lineWidth = 2;
      ctx.stroke();

      // Text
      ctx.save();
      ctx.rotate(startAngle + ARC / 2);
      ctx.textAlign = "right";
      ctx.fillStyle = prize.textColor;
      ctx.font = "bold 11px system-ui, -apple-system, sans-serif";
      ctx.fillText(prize.label, RADIUS - 24, 1);
      ctx.font = "16px serif";
      ctx.fillText(prize.icon, RADIUS - 8, 1);
      ctx.restore();
    });

    // Center circle
    ctx.beginPath();
    ctx.arc(0, 0, 28, 0, 2 * Math.PI);
    ctx.fillStyle = "hsl(38, 95%, 58%)";
    ctx.fill();
    ctx.strokeStyle = "hsl(230, 20%, 7%)";
    ctx.lineWidth = 3;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(0, 0, 18, 0, 2 * Math.PI);
    ctx.fillStyle = "hsl(230, 20%, 7%)";
    ctx.fill();

    ctx.fillStyle = "hsl(38, 95%, 58%)";
    ctx.font = "bold 14px system-ui";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("SPIN", 0, 0);

    ctx.restore();
  }, []);

  useEffect(() => {
    if (open) {
      // Small delay to ensure canvas is mounted
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
    const extraSpins = 5 + Math.random() * 3; // 5-8 full rotations
    const prizeAngle = (2 * Math.PI) - (prizeIndex * ARC + ARC / 2);
    const totalRotation = extraSpins * 2 * Math.PI + prizeAngle;

    startRotRef.current = rotation;
    targetRotRef.current = rotation + totalRotation;
    startTimeRef.current = performance.now();
    const duration = 4500 + Math.random() * 1500; // 4.5-6s

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

  return (
    <>
      {/* Trigger Button */}
      <section className="py-8 sm:py-12">
        <div className="w-full px-4 sm:px-6 md:px-12 lg:px-20">
          <div className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-card via-card to-secondary/30 p-6 sm:p-10 text-center">
            <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,hsl(38_95%_58%/0.04),transparent_70%)]" />
            <div className="relative z-10 flex flex-col items-center gap-4">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary animate-pulse" />
                <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground">
                  Spin & <span className="text-primary italic">Win</span>
                </h2>
                <Sparkles className="h-5 w-5 text-primary animate-pulse" />
              </div>
              <p className="text-muted-foreground text-sm sm:text-base max-w-md">
                Try your luck! Spin the wheel for a chance to win exclusive bonuses, free spins, and VIP access.
              </p>
              <Button
                size="lg"
                onClick={() => setOpen(true)}
                className="glow-pulse-btn bg-gradient-to-r from-primary to-gold-dim text-primary-foreground font-bold text-base px-10 py-7 rounded-xl hover:opacity-90 transition-opacity shadow-lg shadow-primary/20 mt-2"
              >
                <Gift className="h-5 w-5 mr-2" />
                Spin the Wheel
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Wheel Dialog */}
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-[440px] p-0 bg-gradient-to-b from-card to-background border-primary/20 overflow-hidden">
          <DialogHeader className="p-6 pb-2">
            <DialogTitle className="text-center text-2xl font-extrabold flex items-center justify-center gap-2">
              <Trophy className="h-5 w-5 text-primary" />
              <span className="text-primary italic">Spin</span> & Win
            </DialogTitle>
            <DialogDescription className="text-center text-muted-foreground text-sm">
              Tap the button to spin — every spin wins!
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col items-center px-6 pb-6 gap-5">
            {/* Wheel container */}
            <div className="relative">
              {/* Pointer / Arrow */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1 z-20">
                <div
                  className="w-0 h-0"
                  style={{
                    borderLeft: "14px solid transparent",
                    borderRight: "14px solid transparent",
                    borderTop: "28px solid hsl(38, 95%, 58%)",
                    filter: "drop-shadow(0 2px 6px hsl(38 95% 58% / 0.4))",
                  }}
                />
              </div>

              {/* Outer ring glow */}
              <div
                className="absolute inset-0 rounded-full"
                style={{
                  boxShadow: spinning
                    ? "0 0 30px hsl(38 95% 58% / 0.3), 0 0 60px hsl(38 95% 58% / 0.1)"
                    : "0 0 15px hsl(38 95% 58% / 0.15)",
                  transition: "box-shadow 0.5s ease",
                }}
              />

              {/* Outer decorative ring */}
              <div
                className="absolute -inset-2 rounded-full border-4 border-primary/30"
                style={{
                  background: "conic-gradient(from 0deg, hsl(38 95% 58% / 0.08), transparent 10%, hsl(38 95% 58% / 0.08) 12.5%, transparent 22.5%, hsl(38 95% 58% / 0.08) 25%, transparent 35%, hsl(38 95% 58% / 0.08) 37.5%, transparent 47.5%, hsl(38 95% 58% / 0.08) 50%, transparent 60%, hsl(38 95% 58% / 0.08) 62.5%, transparent 72.5%, hsl(38 95% 58% / 0.08) 75%, transparent 85%, hsl(38 95% 58% / 0.08) 87.5%, transparent 97.5%)",
                }}
              />

              <canvas
                ref={canvasRef}
                style={{ width: WHEEL_SIZE, height: WHEEL_SIZE }}
                className="rounded-full relative z-10"
              />
            </div>

            {/* Spin button */}
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

            {/* Result */}
            {showResult && result && (
              <div className="animate-scale-in text-center bg-secondary/50 border border-primary/20 rounded-xl px-6 py-4 w-full">
                <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">
                  🎉 You Won
                </p>
                <p className="text-2xl font-extrabold text-primary italic">
                  {result.icon} {result.label}
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  Claim your prize through our VIP support channel
                </p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SpinWheel;
