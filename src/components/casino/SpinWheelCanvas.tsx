import { useRef, useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { RotateCcw, Sparkles } from "lucide-react";

interface Prize {
  label: string;
  color: string;
  textColor: string;
  icon: string;
  gradient?: string;
}

const PRIZES: Prize[] = [
  { label: "🌟 BONUS", color: "hsl(38, 95%, 58%)", textColor: "#1a1a2e", icon: "🌟", gradient: "hsl(42, 100%, 65%)" },
  { label: "⭐ LUCKY", color: "hsl(230, 18%, 14%)", textColor: "#c8c0b0", icon: "⭐", gradient: "hsl(230, 18%, 18%)" },
  { label: "🔄 RETRY", color: "hsl(4, 75%, 48%)", textColor: "#ffd4d4", icon: "🔄", gradient: "hsl(4, 85%, 55%)" },
  { label: "💎 MEGA", color: "hsl(38, 70%, 38%)", textColor: "#f5f0e0", icon: "💎", gradient: "hsl(38, 80%, 48%)" },
  { label: "👥 INVITE", color: "hsl(155, 75%, 32%)", textColor: "#d0fff0", icon: "👥", gradient: "hsl(155, 75%, 42%)" },
  { label: "✨ NICE", color: "hsl(230, 18%, 18%)", textColor: "#a8a0b0", icon: "✨", gradient: "hsl(230, 18%, 24%)" },
  { label: "👑 JACKPOT", color: "hsl(280, 60%, 42%)", textColor: "#f0d0ff", icon: "👑", gradient: "hsl(280, 60%, 55%)" },
  { label: "🎯 HIT", color: "hsl(215, 55%, 42%)", textColor: "#d0e0ff", icon: "🎯", gradient: "hsl(215, 55%, 55%)" },
];

const WHEEL_SIZE = 320;
const CENTER = WHEEL_SIZE / 2;
const RADIUS = WHEEL_SIZE / 2 - 8;
const ARC = (2 * Math.PI) / PRIZES.length;

interface SpinResult {
  visualPrize: string;
  visualIcon: string;
  actualPoints: number;
  totalPoints: number;
  isFirstSpin: boolean;
  message: string;
  tier: string;
  canSpinAgain: boolean;
  nextSpinAt: string | null;
  referralCount: number;
  maxReferrals: number;
}

interface SpinWheelCanvasProps {
  canSpin: boolean;
  onRequestSpin: () => Promise<SpinResult | null>;
  onSpinComplete: (result: SpinResult) => void;
}

const SpinWheelCanvas = ({ canSpin, onRequestSpin, onSpinComplete }: SpinWheelCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [glowIntensity, setGlowIntensity] = useState(0);
  const animRef = useRef<number>(0);
  const startTimeRef = useRef(0);
  const startRotRef = useRef(0);
  const targetRotRef = useRef(0);
  const glowRef = useRef<number>(0);

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
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(0, 0, RADIUS - 1, startAngle, endAngle);
      ctx.strokeStyle = "hsla(0, 0%, 100%, 0.05)";
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.save();
      ctx.rotate(startAngle + ARC / 2);
      ctx.font = "24px serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(prize.icon, RADIUS * 0.72, 0);

      ctx.fillStyle = prize.textColor;
      ctx.font = "bold 9px system-ui, -apple-system, sans-serif";
      ctx.textAlign = "center";
      ctx.shadowColor = "rgba(0,0,0,0.5)";
      ctx.shadowBlur = 2;
      ctx.fillText(prize.label.split(" ").pop() || "", RADIUS * 0.42, 0);
      ctx.shadowBlur = 0;
      ctx.restore();
    });

    for (let i = 0; i < 40; i++) {
      const angle = (i / 40) * Math.PI * 2;
      const x = Math.cos(angle) * (RADIUS - 5);
      const y = Math.sin(angle) * (RADIUS - 5);
      ctx.beginPath();
      ctx.arc(x, y, 1.8, 0, Math.PI * 2);
      const isLit = spinning ? (Date.now() / 100 + i) % 4 < 2 : i % 2 === 0;
      ctx.fillStyle = isLit ? "hsl(38, 95%, 65%)" : "hsla(0, 0%, 100%, 0.1)";
      ctx.fill();
    }

    ctx.beginPath();
    ctx.arc(0, 0, 30, 0, 2 * Math.PI);
    const hubGrad = ctx.createRadialGradient(0, 0, 4, 0, 0, 30);
    hubGrad.addColorStop(0, "hsl(42, 100%, 72%)");
    hubGrad.addColorStop(0.6, "hsl(38, 95%, 52%)");
    hubGrad.addColorStop(1, "hsl(38, 80%, 40%)");
    ctx.fillStyle = hubGrad;
    ctx.fill();
    ctx.strokeStyle = "hsl(230, 20%, 7%)";
    ctx.lineWidth = 3;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(0, 0, 18, 0, 2 * Math.PI);
    const innerGrad = ctx.createRadialGradient(0, 0, 2, 0, 0, 18);
    innerGrad.addColorStop(0, "hsl(230, 18%, 16%)");
    innerGrad.addColorStop(1, "hsl(230, 20%, 8%)");
    ctx.fillStyle = innerGrad;
    ctx.fill();
    ctx.strokeStyle = "hsl(38, 80%, 55%)";
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.fillStyle = "hsl(38, 95%, 60%)";
    ctx.font = "bold 10px system-ui";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("SPIN", 0, 0);

    ctx.restore();
  }, [spinning]);

  useEffect(() => {
    requestAnimationFrame(() => drawWheel(rotation));
  }, [drawWheel, rotation]);

  useEffect(() => {
    if (!spinning) return;
    const animate = () => {
      drawWheel(rotation);
      glowRef.current = requestAnimationFrame(animate);
    };
    glowRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(glowRef.current);
  }, [spinning]);

  const easeOutQuart = (t: number) => 1 - Math.pow(1 - t, 4);

  const getVisualIndex = (prize: string): number => {
    const idx = PRIZES.findIndex((p) => p.label === prize);
    return idx >= 0 ? idx : Math.floor(Math.random() * PRIZES.length);
  };

  const spin = useCallback(async () => {
    if (spinning || !canSpin) return;

    const result = await onRequestSpin();
    if (!result) return;

    setSpinning(true);
    setGlowIntensity(1);

    const prizeIndex = getVisualIndex(result.visualPrize);
    const extraSpins = 6 + Math.random() * 3;
    const prizeAngle = (2 * Math.PI) - (prizeIndex * ARC + ARC / 2);
    const totalRotation = extraSpins * 2 * Math.PI + prizeAngle;

    startRotRef.current = rotation;
    targetRotRef.current = rotation + totalRotation;
    startTimeRef.current = performance.now();
    const duration = 5000 + Math.random() * 1500;

    const animate = (now: number) => {
      const elapsed = now - startTimeRef.current;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeOutQuart(progress);
      const currentRot = startRotRef.current + (targetRotRef.current - startRotRef.current) * eased;

      setRotation(currentRot);
      drawWheel(currentRot);
      setGlowIntensity(1 - eased * 0.7);

      if (progress < 1) {
        animRef.current = requestAnimationFrame(animate);
      } else {
        setSpinning(false);
        setGlowIntensity(0);
        onSpinComplete(result);
      }
    };

    animRef.current = requestAnimationFrame(animate);
  }, [spinning, canSpin, rotation, drawWheel, onRequestSpin, onSpinComplete]);

  useEffect(() => {
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, []);

  return (
    <div className="flex flex-col items-center gap-5">
      <div className="relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1.5 z-20">
          <div
            className="w-0 h-0"
            style={{
              borderLeft: "13px solid transparent",
              borderRight: "13px solid transparent",
              borderTop: "26px solid hsl(38, 95%, 58%)",
              filter: `drop-shadow(0 2px 10px hsl(38 95% 58% / ${0.4 + glowIntensity * 0.4}))`,
              transition: "filter 0.1s",
            }}
          />
        </div>

        <div
          className="absolute -inset-4 rounded-full transition-all duration-300"
          style={{
            boxShadow: spinning
              ? `0 0 ${30 + glowIntensity * 30}px hsl(38 95% 58% / ${0.2 + glowIntensity * 0.2}), 0 0 ${60 + glowIntensity * 40}px hsl(38 95% 58% / 0.08)`
              : "0 0 15px hsl(38 95% 58% / 0.1)",
          }}
        />

        <div className="absolute -inset-3 rounded-full border-2 border-primary/15" />

        <canvas
          ref={canvasRef}
          style={{ width: WHEEL_SIZE, height: WHEEL_SIZE }}
          className="rounded-full relative z-10"
        />
      </div>

      <Button
        size="lg"
        onClick={spin}
        disabled={spinning || !canSpin}
        className="glow-pulse-btn bg-gradient-to-r from-primary to-gold-dim text-primary-foreground font-bold text-base px-10 py-6 rounded-xl hover:opacity-90 transition-all shadow-lg shadow-primary/20 disabled:opacity-40 disabled:animate-none w-full max-w-[260px]"
      >
        {spinning ? (
          <><RotateCcw className="h-5 w-5 mr-2 animate-spin" /> Spinning...</>
        ) : !canSpin ? (
          <><RotateCcw className="h-5 w-5 mr-2" /> Wait</>
        ) : (
          <><Sparkles className="h-5 w-5 mr-2" /> Spin Now</>
        )}
      </Button>
    </div>
  );
};

export default SpinWheelCanvas;
