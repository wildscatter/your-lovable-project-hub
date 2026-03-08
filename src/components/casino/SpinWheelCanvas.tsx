import { useRef, useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { RotateCcw, Sparkles } from "lucide-react";

interface Prize {
  label: string;
  points: number;
  color: string;
  gradient: string;
  accent: string;
}

const PRIZES: Prize[] = [
  { label: "30", points: 30, color: "hsl(38, 95%, 48%)", gradient: "hsl(42, 100%, 60%)", accent: "hsl(45, 100%, 72%)" },
  { label: "5",  points: 5,  color: "hsl(230, 22%, 16%)", gradient: "hsl(230, 22%, 22%)", accent: "hsl(230, 20%, 35%)" },
  { label: "20", points: 20, color: "hsl(4, 72%, 44%)", gradient: "hsl(4, 80%, 55%)", accent: "hsl(4, 90%, 70%)" },
  { label: "0",  points: 0,  color: "hsl(230, 25%, 12%)", gradient: "hsl(230, 22%, 18%)", accent: "hsl(230, 20%, 28%)" },
  { label: "15", points: 15, color: "hsl(155, 60%, 28%)", gradient: "hsl(155, 60%, 40%)", accent: "hsl(155, 65%, 55%)" },
  { label: "5",  points: 5,  color: "hsl(275, 45%, 35%)", gradient: "hsl(275, 45%, 48%)", accent: "hsl(275, 55%, 65%)" },
  { label: "10", points: 10, color: "hsl(215, 55%, 38%)", gradient: "hsl(215, 55%, 50%)", accent: "hsl(215, 65%, 65%)" },
  { label: "0",  points: 0,  color: "hsl(230, 20%, 10%)", gradient: "hsl(230, 20%, 16%)", accent: "hsl(230, 18%, 26%)" },
];

const WHEEL_SIZE = 340;
const CENTER = WHEEL_SIZE / 2;
const RADIUS = WHEEL_SIZE / 2 - 12;
const ARC = (2 * Math.PI) / PRIZES.length;
const NUM_MARQUEE_LIGHTS = 24;

interface SpinResult {
  visualIndex: number;
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
  const [highlightIndex, setHighlightIndex] = useState<number | null>(null);
  const animRef = useRef<number>(0);
  const startTimeRef = useRef(0);
  const startRotRef = useRef(0);
  const targetRotRef = useRef(0);
  const glowRef = useRef<number>(0);
  const tickRef = useRef(0);

  const drawWheel = useCallback((rot: number, time?: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const t = time || Date.now();

    const dpr = window.devicePixelRatio || 1;
    canvas.width = WHEEL_SIZE * dpr;
    canvas.height = WHEEL_SIZE * dpr;
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, WHEEL_SIZE, WHEEL_SIZE);

    // Outer glow ring
    ctx.save();
    ctx.beginPath();
    ctx.arc(CENTER, CENTER, RADIUS + 10, 0, Math.PI * 2);
    const outerGlow = ctx.createRadialGradient(CENTER, CENTER, RADIUS - 5, CENTER, CENTER, RADIUS + 14);
    outerGlow.addColorStop(0, "transparent");
    outerGlow.addColorStop(0.5, `hsla(38, 95%, 58%, ${spinning ? 0.15 + glowIntensity * 0.1 : 0.06})`);
    outerGlow.addColorStop(1, "transparent");
    ctx.fillStyle = outerGlow;
    ctx.fill();
    ctx.restore();

    // Outer chrome ring
    ctx.save();
    ctx.beginPath();
    ctx.arc(CENTER, CENTER, RADIUS + 6, 0, Math.PI * 2);
    const ringGrad = ctx.createRadialGradient(CENTER, CENTER, RADIUS + 2, CENTER, CENTER, RADIUS + 8);
    ringGrad.addColorStop(0, "hsl(230, 18%, 22%)");
    ringGrad.addColorStop(0.4, "hsl(230, 16%, 16%)");
    ringGrad.addColorStop(0.7, "hsl(38, 40%, 25%)");
    ringGrad.addColorStop(1, "hsl(230, 20%, 10%)");
    ctx.fillStyle = ringGrad;
    ctx.fill();
    ctx.strokeStyle = "hsl(38, 50%, 30%)";
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.restore();

    // Marquee lights
    for (let i = 0; i < NUM_MARQUEE_LIGHTS; i++) {
      const angle = (i / NUM_MARQUEE_LIGHTS) * Math.PI * 2 - Math.PI / 2;
      const lx = CENTER + Math.cos(angle) * (RADIUS + 6);
      const ly = CENTER + Math.sin(angle) * (RADIUS + 6);

      const phase = spinning
        ? Math.sin((t / 150) + i * 0.8) * 0.5 + 0.5
        : Math.sin((t / 800) + i * 0.5) * 0.3 + 0.7;

      const isGold = i % 3 === 0;
      const baseHue = isGold ? 38 : (i % 3 === 1 ? 0 : 215);
      const baseSat = isGold ? 95 : 80;
      const baseLit = isGold ? 58 : 55;

      // Light glow
      ctx.save();
      ctx.beginPath();
      ctx.arc(lx, ly, 5 + phase * 2, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${baseHue}, ${baseSat}%, ${baseLit}%, ${0.15 + phase * 0.2})`;
      ctx.fill();
      ctx.restore();

      // Light bulb
      ctx.save();
      ctx.beginPath();
      ctx.arc(lx, ly, 3, 0, Math.PI * 2);
      const bulbGrad = ctx.createRadialGradient(lx - 0.5, ly - 0.5, 0.5, lx, ly, 3);
      bulbGrad.addColorStop(0, `hsla(${baseHue}, 100%, ${75 + phase * 20}%, 1)`);
      bulbGrad.addColorStop(0.6, `hsla(${baseHue}, ${baseSat}%, ${baseLit + phase * 15}%, ${0.7 + phase * 0.3})`);
      bulbGrad.addColorStop(1, `hsla(${baseHue}, ${baseSat}%, ${baseLit}%, ${0.3 + phase * 0.3})`);
      ctx.fillStyle = bulbGrad;
      ctx.fill();
      ctx.restore();
    }

    // Inner rim
    ctx.save();
    ctx.beginPath();
    ctx.arc(CENTER, CENTER, RADIUS, 0, Math.PI * 2);
    ctx.strokeStyle = "hsl(38, 60%, 35%)";
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.restore();

    // Segments
    ctx.save();
    ctx.translate(CENTER, CENTER);
    ctx.rotate(rot);

    PRIZES.forEach((prize, i) => {
      const startAngle = i * ARC - Math.PI / 2;
      const endAngle = startAngle + ARC;
      const isHighlighted = highlightIndex === i;

      // Segment fill
      const grad = ctx.createRadialGradient(0, 0, 15, 0, 0, RADIUS);
      grad.addColorStop(0, prize.gradient);
      grad.addColorStop(0.6, prize.color);
      grad.addColorStop(1, isHighlighted ? prize.gradient : prize.color);

      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, RADIUS - 2, startAngle, endAngle);
      ctx.closePath();
      ctx.fillStyle = grad;
      ctx.fill();

      // Segment borders
      ctx.strokeStyle = "hsla(230, 20%, 7%, 0.8)";
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Glossy overlay on top half of segment
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, RADIUS - 2, startAngle, endAngle);
      ctx.closePath();
      ctx.clip();

      const glossGrad = ctx.createLinearGradient(0, -RADIUS, 0, RADIUS * 0.3);
      glossGrad.addColorStop(0, "hsla(0, 0%, 100%, 0.12)");
      glossGrad.addColorStop(0.5, "hsla(0, 0%, 100%, 0.03)");
      glossGrad.addColorStop(1, "transparent");
      ctx.fillStyle = glossGrad;
      ctx.fill();
      ctx.restore();

      // Draw number
      ctx.save();
      ctx.rotate(startAngle + ARC / 2);
      const textX = RADIUS * 0.56;

      // Neon outer glow
      ctx.shadowColor = prize.accent;
      ctx.shadowBlur = 20;
      ctx.fillStyle = "transparent";
      ctx.font = "bold 36px 'Georgia', 'Times New Roman', serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(prize.label, textX, 0);

      // Main text with glow
      ctx.shadowColor = "rgba(255,255,255,0.8)";
      ctx.shadowBlur = 12;
      ctx.fillStyle = "#ffffff";
      ctx.fillText(prize.label, textX, 0);

      // Crisp overlay
      ctx.shadowColor = "rgba(0,0,0,0.4)";
      ctx.shadowBlur = 3;
      ctx.shadowOffsetY = 1.5;
      ctx.fillStyle = "#ffffff";
      ctx.fillText(prize.label, textX, 0);

      // Top specular highlight
      ctx.shadowColor = "transparent";
      ctx.shadowBlur = 0;
      ctx.shadowOffsetY = 0;
      ctx.fillStyle = "rgba(255,255,255,0.2)";
      ctx.font = "bold 36px 'Georgia', 'Times New Roman', serif";
      ctx.fillText(prize.label, textX, -1.5);

      ctx.restore();
    });

    // Inner LED ring
    for (let i = 0; i < 48; i++) {
      const angle = (i / 48) * Math.PI * 2;
      const x = Math.cos(angle) * (RADIUS - 8);
      const y = Math.sin(angle) * (RADIUS - 8);

      const ledPhase = spinning
        ? ((t / 80 + i * 3) % 20) < 10
        : i % 2 === 0;

      ctx.beginPath();
      ctx.arc(x, y, 1.5, 0, Math.PI * 2);
      if (ledPhase) {
        ctx.fillStyle = `hsla(38, 95%, ${60 + Math.sin(t / 200 + i) * 10}%, 0.9)`;
        ctx.shadowColor = "hsl(38, 95%, 58%)";
        ctx.shadowBlur = 4;
      } else {
        ctx.fillStyle = "hsla(0, 0%, 100%, 0.08)";
        ctx.shadowBlur = 0;
      }
      ctx.fill();
      ctx.shadowBlur = 0;
    }

    // Center hub - outer ring
    ctx.beginPath();
    ctx.arc(0, 0, 34, 0, 2 * Math.PI);
    const hubOuterGrad = ctx.createRadialGradient(0, 0, 20, 0, 0, 34);
    hubOuterGrad.addColorStop(0, "hsl(38, 80%, 55%)");
    hubOuterGrad.addColorStop(0.5, "hsl(38, 70%, 42%)");
    hubOuterGrad.addColorStop(1, "hsl(38, 60%, 30%)");
    ctx.fillStyle = hubOuterGrad;
    ctx.fill();
    ctx.strokeStyle = "hsl(230, 20%, 7%)";
    ctx.lineWidth = 3;
    ctx.stroke();

    // Center hub - inner
    ctx.beginPath();
    ctx.arc(0, 0, 24, 0, 2 * Math.PI);
    const hubInnerGrad = ctx.createRadialGradient(-3, -3, 2, 0, 0, 24);
    hubInnerGrad.addColorStop(0, "hsl(230, 18%, 18%)");
    hubInnerGrad.addColorStop(0.7, "hsl(230, 20%, 10%)");
    hubInnerGrad.addColorStop(1, "hsl(230, 22%, 6%)");
    ctx.fillStyle = hubInnerGrad;
    ctx.fill();
    ctx.strokeStyle = "hsl(38, 70%, 45%)";
    ctx.lineWidth = 2;
    ctx.stroke();

    // Center hub highlight
    ctx.beginPath();
    ctx.arc(-4, -4, 10, 0, Math.PI * 2);
    const highlightGrad = ctx.createRadialGradient(-4, -4, 1, -4, -4, 10);
    highlightGrad.addColorStop(0, "hsla(0, 0%, 100%, 0.15)");
    highlightGrad.addColorStop(1, "transparent");
    ctx.fillStyle = highlightGrad;
    ctx.fill();

    // SPIN text
    ctx.fillStyle = "hsl(38, 95%, 60%)";
    ctx.font = "bold 11px system-ui, -apple-system, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.shadowColor = "hsl(38, 95%, 58%)";
    ctx.shadowBlur = 6;
    ctx.fillText("SPIN", 0, 0);
    ctx.shadowBlur = 0;

    ctx.restore();
  }, [spinning, glowIntensity, highlightIndex]);

  // Idle animation loop
  useEffect(() => {
    let running = true;
    const idleLoop = () => {
      if (!running) return;
      drawWheel(rotation, Date.now());
      tickRef.current = requestAnimationFrame(idleLoop);
    };
    tickRef.current = requestAnimationFrame(idleLoop);
    return () => {
      running = false;
      cancelAnimationFrame(tickRef.current);
    };
  }, [rotation, drawWheel]);

  const easeOutQuart = (t: number) => 1 - Math.pow(1 - t, 4);

  const spin = useCallback(async () => {
    if (spinning || !canSpin) return;

    const result = await onRequestSpin();
    if (!result) return;

    setSpinning(true);
    setGlowIntensity(1);
    setHighlightIndex(null);

    const prizeIndex = result.visualIndex;
    const extraSpins = 7 + Math.random() * 3;
    const prizeAngle = (2 * Math.PI) - (prizeIndex * ARC + ARC / 2);
    const totalRotation = extraSpins * 2 * Math.PI + prizeAngle;

    startRotRef.current = rotation;
    targetRotRef.current = rotation + totalRotation;
    startTimeRef.current = performance.now();
    const duration = 5500 + Math.random() * 2000;

    const animate = (now: number) => {
      const elapsed = now - startTimeRef.current;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeOutQuart(progress);
      const currentRot = startRotRef.current + (targetRotRef.current - startRotRef.current) * eased;

      setRotation(currentRot);
      setGlowIntensity(1 - eased * 0.7);

      if (progress < 1) {
        animRef.current = requestAnimationFrame(animate);
      } else {
        setSpinning(false);
        setGlowIntensity(0);
        setHighlightIndex(prizeIndex);
        // Clear highlight after a few seconds
        setTimeout(() => setHighlightIndex(null), 3000);
        onSpinComplete(result);
      }
    };

    animRef.current = requestAnimationFrame(animate);
  }, [spinning, canSpin, rotation, onRequestSpin, onSpinComplete]);

  useEffect(() => {
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, []);

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative">
        {/* Ambient glow behind wheel */}
        <div
          className="absolute -inset-8 rounded-full transition-all duration-500"
          style={{
            background: spinning
              ? `radial-gradient(circle, hsl(38 95% 58% / ${0.08 + glowIntensity * 0.08}), transparent 70%)`
              : "radial-gradient(circle, hsl(38 95% 58% / 0.04), transparent 70%)",
          }}
        />

        {/* Pointer */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 z-20">
          <div className="relative">
            <div
              className="w-0 h-0"
              style={{
                borderLeft: "14px solid transparent",
                borderRight: "14px solid transparent",
                borderTop: "30px solid hsl(38, 95%, 55%)",
                filter: `drop-shadow(0 2px 12px hsl(38 95% 58% / ${0.5 + glowIntensity * 0.4}))`,
                transition: "filter 0.1s",
              }}
            />
            {/* Pointer inner highlight */}
            <div
              className="absolute top-[2px] left-1/2 -translate-x-1/2 w-0 h-0"
              style={{
                borderLeft: "8px solid transparent",
                borderRight: "8px solid transparent",
                borderTop: "18px solid hsl(42, 100%, 72%)",
                opacity: 0.4,
              }}
            />
          </div>
        </div>

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
        className="glow-pulse-btn bg-gradient-to-r from-primary via-[hsl(42,100%,65%)] to-primary text-primary-foreground font-bold text-base px-10 py-5 rounded-xl hover:opacity-90 transition-all shadow-lg shadow-primary/25 disabled:opacity-40 disabled:animate-none w-full max-w-[260px] border border-primary/30"
      >
        {spinning ? (
          <><RotateCcw className="h-5 w-5 mr-2 animate-spin" /> Spinning...</>
        ) : !canSpin ? (
          <><RotateCcw className="h-5 w-5 mr-2" /> Come Back Tomorrow</>
        ) : (
          <><Sparkles className="h-5 w-5 mr-2" /> Spin Now</>
        )}
      </Button>
    </div>
  );
};

export default SpinWheelCanvas;
