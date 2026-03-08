import { useRef, useEffect } from "react";

const PRIZES = [
  { label: "30", color: "hsl(38, 95%, 48%)", gradient: "hsl(42, 100%, 60%)" },
  { label: "5",  color: "hsl(230, 22%, 16%)", gradient: "hsl(230, 22%, 22%)" },
  { label: "20", color: "hsl(4, 72%, 44%)", gradient: "hsl(4, 80%, 55%)" },
  { label: "0",  color: "hsl(230, 25%, 12%)", gradient: "hsl(230, 22%, 18%)" },
  { label: "15", color: "hsl(155, 60%, 28%)", gradient: "hsl(155, 60%, 40%)" },
  { label: "5",  color: "hsl(275, 45%, 35%)", gradient: "hsl(275, 45%, 48%)" },
  { label: "10", color: "hsl(215, 55%, 38%)", gradient: "hsl(215, 55%, 50%)" },
  { label: "0",  color: "hsl(230, 20%, 10%)", gradient: "hsl(230, 20%, 16%)" },
];

const SIZE = 28;
const CENTER = SIZE / 2;
const RADIUS = SIZE / 2 - 2;
const ARC = (2 * Math.PI) / PRIZES.length;

const MiniWheel = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rotRef = useRef(0);
  const animRef = useRef(0);

  useEffect(() => {
    let running = true;
    const draw = () => {
      if (!running) return;
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const dpr = window.devicePixelRatio || 1;
      canvas.width = SIZE * dpr;
      canvas.height = SIZE * dpr;
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, SIZE, SIZE);

      // Outer ring
      ctx.beginPath();
      ctx.arc(CENTER, CENTER, RADIUS + 1, 0, Math.PI * 2);
      ctx.strokeStyle = "hsl(38, 50%, 35%)";
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.save();
      ctx.translate(CENTER, CENTER);
      rotRef.current += 0.008;
      ctx.rotate(rotRef.current);

      // Segments
      PRIZES.forEach((prize, i) => {
        const startAngle = i * ARC - Math.PI / 2;
        const endAngle = startAngle + ARC;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.arc(0, 0, RADIUS, startAngle, endAngle);
        ctx.closePath();
        ctx.fillStyle = prize.color;
        ctx.fill();
        ctx.strokeStyle = "hsla(230, 20%, 7%, 0.6)";
        ctx.lineWidth = 0.5;
        ctx.stroke();
      });

      // Center hub
      ctx.beginPath();
      ctx.arc(0, 0, 4, 0, Math.PI * 2);
      ctx.fillStyle = "hsl(38, 80%, 50%)";
      ctx.fill();
      ctx.beginPath();
      ctx.arc(0, 0, 2.5, 0, Math.PI * 2);
      ctx.fillStyle = "hsl(230, 20%, 10%)";
      ctx.fill();

      ctx.restore();

      // Pointer
      ctx.beginPath();
      ctx.moveTo(CENTER - 2.5, 1);
      ctx.lineTo(CENTER + 2.5, 1);
      ctx.lineTo(CENTER, 5);
      ctx.closePath();
      ctx.fillStyle = "hsl(38, 95%, 55%)";
      ctx.fill();

      animRef.current = requestAnimationFrame(draw);
    };
    animRef.current = requestAnimationFrame(draw);
    return () => { running = false; cancelAnimationFrame(animRef.current); };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ width: SIZE, height: SIZE }}
      className="rounded-full"
    />
  );
};

export default MiniWheel;
