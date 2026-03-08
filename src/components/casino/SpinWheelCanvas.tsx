import { useRef, useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { RotateCcw, Sparkles } from "lucide-react";

interface Prize {
  label: string;
  color: string;
  textColor: string;
  icon: string;
  points: number;
  gradient?: string;
  weight: number;
}

const PRIZES: Prize[] = [
  { label: "1 PTS", color: "hsl(230, 18%, 14%)", textColor: "#c8c0b0", icon: "✨", points: 1, gradient: "hsl(230, 18%, 18%)", weight: 30 },
  { label: "3 PTS", color: "hsl(215, 55%, 42%)", textColor: "#d0e0ff", icon: "🔹", points: 3, gradient: "hsl(215, 55%, 55%)", weight: 25 },
  { label: "კიდევ სცადე", color: "hsl(4, 75%, 48%)", textColor: "#ffd4d4", icon: "🔄", points: 0, gradient: "hsl(4, 85%, 55%)", weight: 20 },
  { label: "5 PTS", color: "hsl(38, 70%, 38%)", textColor: "#f5f0e0", icon: "💎", points: 5, gradient: "hsl(38, 80%, 48%)", weight: 12 },
  { label: "მოიწვიე", color: "hsl(155, 75%, 32%)", textColor: "#d0fff0", icon: "👥", points: 0, gradient: "hsl(155, 75%, 42%)", weight: 5 },
  { label: "2 PTS", color: "hsl(230, 18%, 18%)", textColor: "#a8a0b0", icon: "⭐", points: 2, gradient: "hsl(230, 18%, 24%)", weight: 28 },
  { label: "10 PTS", color: "hsl(280, 60%, 42%)", textColor: "#f0d0ff", icon: "👑", points: 10, gradient: "hsl(280, 60%, 55%)", weight: 3 },
  { label: "7 PTS", color: "hsl(38, 95%, 58%)", textColor: "#1a1a2e", icon: "🎯", points: 7, gradient: "hsl(42, 100%, 65%)", weight: 7 },
];

const WHEEL_SIZE = 340;
const CENTER = WHEEL_SIZE / 2;
const RADIUS = WHEEL_SIZE / 2 - 8;
const ARC = (2 * Math.PI) / PRIZES.length;

interface SpinWheelCanvasProps {
  canSpin: boolean;
  firstSpinDone: boolean;
  onSpinComplete: (prize: { label: string; points: number }) => void;
}

const SpinWheelCanvas = ({ canSpin, firstSpinDone, onSpinComplete }: SpinWheelCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<Prize | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [rotation, setRotation] = useState(0);
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

      const grad = ctx.createRadialGradient(0, 0, 20, 0, 0, RADIUS);
      grad.addColorStop(0, prize.gradient || prize.color);
      grad.addColorStop(1, prize.color);

      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, RADIUS, startAngle, endAngle);
      ctx.closePath();
      ctx.fillStyle = grad;
      ctx.fill();

      ctx.strokeStyle = "hsl(230, 20%, 7%)";
      ctx.lineWidth = 2.5;
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, RADIUS - 1, startAngle, endAngle);
      ctx.strokeStyle = "hsla(0, 0%, 100%, 0.06)";
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.save();
      ctx.rotate(startAngle + ARC / 2);
      ctx.font = "22px serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(prize.icon, RADIUS * 0.72, 0);

      ctx.fillStyle = prize.textColor;
      ctx.font = "bold 11px system-ui, -apple-system, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(prize.label, RADIUS * 0.42, 0);
      ctx.restore();
    });

    // Outer dots
    for (let i = 0; i < 32; i++) {
      const angle = (i / 32) * Math.PI * 2;
      const x = Math.cos(angle) * (RADIUS - 6);
      const y = Math.sin(angle) * (RADIUS - 6);
      ctx.beginPath();
      ctx.arc(x, y, 1.5, 0, Math.PI * 2);
      ctx.fillStyle = i % 2 === 0 ? "hsl(38, 95%, 58%)" : "hsla(0, 0%, 100%, 0.15)";
      ctx.fill();
    }

    // Center hub
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

    ctx.fillStyle = "hsl(38, 95%, 58%)";
    ctx.font = "bold 12px system-ui";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("SPIN", 0, 0);

    ctx.restore();
  }, []);

  useEffect(() => {
    setTimeout(() => drawWheel(rotation), 50);
  }, [drawWheel, rotation]);

  const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

  // Weighted random selection
  const getWeightedPrizeIndex = useCallback(() => {
    const totalWeight = PRIZES.reduce((sum, p) => sum + p.weight, 0);
    let random = Math.random() * totalWeight;
    for (let i = 0; i < PRIZES.length; i++) {
      random -= PRIZES[i].weight;
      if (random <= 0) return i;
    }
    return 0;
  }, []);

  const spin = useCallback(() => {
    if (spinning || !canSpin) return;
    setSpinning(true);
    setResult(null);
    setShowResult(false);

    const prizeIndex = getWeightedPrizeIndex();
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
        const wonPrize = PRIZES[prizeIndex];
        setResult(wonPrize);
        setTimeout(() => setShowResult(true), 300);
        onSpinComplete({ label: wonPrize.label, points: wonPrize.points });
      }
    };

    animRef.current = requestAnimationFrame(animate);
  }, [spinning, canSpin, rotation, drawWheel, getWeightedPrizeIndex, onSpinComplete]);

  useEffect(() => {
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, []);

  const getResultMessage = (prize: Prize) => {
    if (!firstSpinDone) {
      return { icon: "🎁", title: "მოგესალმებით!", subtitle: "პირველი დატრიალებისას მიიღე 30 ქულა!", color: "text-primary" };
    }
    if (prize.label === "მოიწვიე") {
      return { icon: "👥", title: "მოიწვიე მეგობარი!", subtitle: "გააზიარე ლინკი და მიიღე 5 ქულა!", color: "text-emerald" };
    }
    if (prize.points === 0) {
      return { icon: "😅", title: "კიდევ სცადე!", subtitle: "იღბალი შემდეგ ჯერზე გელოდება!", color: "text-accent" };
    }
    if (prize.points >= 7) {
      return { icon: "🔥", title: `მოიგე ${prize.points} ქულა!`, subtitle: "შესანიშნავი შედეგი!", color: "text-primary" };
    }
    return { icon: "✅", title: `მოიგე ${prize.points} ქულა!`, subtitle: "ქულები დაემატა ბალანსზე.", color: "text-foreground" };
  };

  return (
    <div className="flex flex-col items-center gap-5">
      {/* Wheel */}
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

      {/* Spin Button */}
      <Button
        size="lg"
        onClick={spin}
        disabled={spinning || !canSpin}
        className="glow-pulse-btn bg-gradient-to-r from-primary to-gold-dim text-primary-foreground font-bold text-lg px-12 py-7 rounded-xl hover:opacity-90 transition-all shadow-lg shadow-primary/20 disabled:opacity-50 disabled:animate-none w-full max-w-[280px]"
      >
        {spinning ? (
          <RotateCcw className="h-5 w-5 mr-2 animate-spin" />
        ) : (
          <Sparkles className="h-5 w-5 mr-2" />
        )}
        {spinning ? "ტრიალებს..." : !canSpin ? "დაელოდე" : "დაატრიალე"}
      </Button>

      {/* Result */}
      {showResult && result && (() => {
        const msg = getResultMessage(result);
        return (
          <div className="animate-scale-in text-center bg-card border border-border rounded-2xl px-6 py-5 w-full max-w-[320px]">
            <p className="text-3xl mb-2">{msg.icon}</p>
            <p className={`text-xl font-extrabold ${msg.color}`}>{msg.title}</p>
            <p className="text-xs text-muted-foreground mt-2">{msg.subtitle}</p>
            {(result.points > 0 || !firstSpinDone) && (
              <div className="mt-3 inline-flex items-center gap-1.5 bg-primary/10 border border-primary/20 rounded-full px-4 py-1.5">
                <span className="text-xs font-bold text-primary">+{firstSpinDone ? result.points : 30} ქულა</span>
              </div>
            )}
          </div>
        );
      })()}
    </div>
  );
};

export default SpinWheelCanvas;
