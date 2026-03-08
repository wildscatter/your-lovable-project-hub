import { useEffect, useState, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Copy, Check, Users, Sparkles, Star, Zap, Trophy, Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import SpinWheelCanvas from "@/components/casino/SpinWheelCanvas";
import confetti from "canvas-confetti";

const DISPLAY_MAX = 100;
const REFERRAL_POINTS = 5;
const MAX_REFERRALS = 3;

interface SpinResult {
  visualIndex: number;
  actualPoints: number;
  totalPoints: number;
  isFirstSpin: boolean;
  message: string;
  tier: "jackpot" | "great" | "good" | "small" | "tryagain" | "invite";
  canSpinAgain: boolean;
  nextSpinAt: string | null;
  referralCount: number;
  maxReferrals: number;
}

const SpinWheelPage = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [totalPoints, setTotalPoints] = useState(0);
  const [canSpin, setCanSpin] = useState(true);
  const [nextSpinTime, setNextSpinTime] = useState<Date | null>(null);
  const [countdown, setCountdown] = useState({ h: 0, m: 0, s: 0 });
  const [countdownActive, setCountdownActive] = useState(false);
  const [referralCount, setReferralCount] = useState(0);
  const [copied, setCopied] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [spinResult, setSpinResult] = useState<SpinResult | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!loading && !user) navigate("/auth");
  }, [user, loading, navigate]);

  const loadUserData = useCallback(async () => {
    if (!user) return;

    const { data: points } = await supabase
      .from("user_points")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();

    if (points) setTotalPoints(points.total_points);

    const { data: lastSpin } = await supabase
      .from("spin_history")
      .select("spun_at")
      .eq("user_id", user.id)
      .order("spun_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (lastSpin) {
      const next = new Date(new Date(lastSpin.spun_at).getTime() + 10 * 1000); // 10s for testing
      if (next > new Date()) {
        setCanSpin(false);
        setNextSpinTime(next);
      }
    }

    const { count } = await supabase
      .from("referrals")
      .select("*", { count: "exact", head: true })
      .eq("referrer_id", user.id);

    setReferralCount(count || 0);
    setDataLoaded(true);
  }, [user]);

  useEffect(() => { loadUserData(); }, [loadUserData]);

  useEffect(() => {
    if (!nextSpinTime) { setCountdownActive(false); return; }
    setCountdownActive(true);
    const interval = setInterval(() => {
      const diff = nextSpinTime.getTime() - Date.now();
      if (diff <= 0) {
        setCanSpin(true); setNextSpinTime(null); setCountdownActive(false);
        clearInterval(interval); return;
      }
      setCountdown({
        h: Math.floor(diff / 3600000),
        m: Math.floor((diff % 3600000) / 60000),
        s: Math.floor((diff % 60000) / 1000),
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [nextSpinTime]);

  const fireConfetti = (tier: string) => {
    if (tier === "jackpot") {
      const end = Date.now() + 2500;
      const frame = () => {
        confetti({ particleCount: 4, angle: 60, spread: 55, origin: { x: 0, y: 0.7 }, colors: ["#d4a520", "#ffd700", "#ff6b35"] });
        confetti({ particleCount: 4, angle: 120, spread: 55, origin: { x: 1, y: 0.7 }, colors: ["#d4a520", "#ffd700", "#ff6b35"] });
        if (Date.now() < end) requestAnimationFrame(frame);
      };
      frame();
    } else if (tier === "great") {
      confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 }, colors: ["#d4a520", "#ffd700"] });
    } else if (tier === "good") {
      confetti({ particleCount: 30, spread: 50, origin: { y: 0.65 }, colors: ["#ffd700", "#c8c0b0"] });
    }
  };

  const handleSpin = async () => {
    if (!user || !canSpin || isSpinning) return;
    setIsSpinning(true); setShowResult(false); setSpinResult(null);
    try {
      const { data, error } = await supabase.functions.invoke("spin-wheel");
      if (error) throw error;
      const result = data as SpinResult;
      setSpinResult(result);
      return result;
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      setIsSpinning(false);
      return null;
    }
  };

  const handleSpinComplete = (result: SpinResult) => {
    setIsSpinning(false);
    setTotalPoints(result.totalPoints);
    setReferralCount(result.referralCount);
    setCanSpin(result.canSpinAgain);
    if (result.nextSpinAt) { setNextSpinTime(new Date(result.nextSpinAt)); setCanSpin(false); }
    setTimeout(() => {
      setShowResult(true);
      fireConfetti(result.tier);
      resultRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 400);
  };

  const copyReferralLink = () => {
    if (!user) return;
    navigator.clipboard.writeText(`${window.location.origin}/auth?ref=${user.id}`);
    setCopied(true);
    toast({ title: "Link copied!", description: "Share it with your friends to earn bonus points." });
    setTimeout(() => setCopied(false), 2000);
  };

  const progressPercent = Math.min((totalPoints / DISPLAY_MAX) * 100, 100);
  const pad = (n: number) => n.toString().padStart(2, "0");

  // Progress ring calculations
  const ringRadius = 52;
  const ringCircumference = 2 * Math.PI * ringRadius;
  const ringOffset = ringCircumference - (progressPercent / 100) * ringCircumference;

  if (loading || !dataLoaded) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="h-12 w-12 border-3 border-primary/20 border-t-primary rounded-full animate-spin" />
            <Sparkles className="h-5 w-5 text-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
          </div>
          <p className="text-sm text-muted-foreground animate-pulse">Loading...</p>
        </div>
      </div>
    );
  }

  const tierStyles: Record<string, { bg: string; border: string; text: string; glow: string }> = {
    jackpot: { bg: "bg-gradient-to-br from-primary/15 to-primary/5", border: "border-primary/40", text: "text-primary", glow: "shadow-primary/20" },
    great: { bg: "bg-gradient-to-br from-primary/10 to-gold-dim/5", border: "border-primary/30", text: "text-primary", glow: "shadow-primary/15" },
    good: { bg: "bg-secondary/40", border: "border-border", text: "text-foreground", glow: "" },
    small: { bg: "bg-secondary/30", border: "border-border/50", text: "text-muted-foreground", glow: "" },
    tryagain: { bg: "bg-accent/5", border: "border-accent/20", text: "text-accent", glow: "" },
    invite: { bg: "bg-emerald-500/5", border: "border-emerald-500/20", text: "text-emerald-400", glow: "" },
  };

  const reachedMax = totalPoints >= 80;

  return (
    <div className="min-h-[100dvh] bg-background">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[600px] bg-[radial-gradient(ellipse_at_center,hsl(38_95%_58%/0.05),transparent_70%)]" />
      </div>

      {/* Header */}
      <div className="border-b border-border/50 bg-card/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-lg mx-auto px-3 py-2 flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={() => navigate("/")} className="text-muted-foreground hover:text-foreground -ml-2 h-8 px-2">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            <span className="font-bold text-foreground text-sm">Spin & Win</span>
          </div>
          <div className="flex items-center gap-1 bg-primary/10 border border-primary/20 rounded-full px-2.5 py-0.5">
            <Star className="h-3 w-3 text-primary" />
            <span className="text-xs font-bold text-primary">{totalPoints}</span>
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-3 py-4 space-y-4 relative z-10">

        {/* Circular Progress + Prize Display */}
        <div className="flex items-center gap-4">
          {/* Circular progress ring */}
          <div className="relative w-[120px] h-[120px] flex-shrink-0">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r={ringRadius} fill="none" stroke="hsl(var(--secondary))" strokeWidth="7" opacity="0.3" />
              <circle
                cx="60" cy="60" r={ringRadius}
                fill="none"
                stroke={reachedMax ? "hsl(155, 65%, 45%)" : "hsl(var(--primary))"}
                strokeWidth="7"
                strokeLinecap="round"
                strokeDasharray={ringCircumference}
                strokeDashoffset={ringOffset}
                className="transition-all duration-1000 ease-out"
                style={{ filter: `drop-shadow(0 0 8px ${reachedMax ? "hsl(155 65% 45% / 0.5)" : "hsl(var(--primary) / 0.4)"})` }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-extrabold text-foreground">{totalPoints}</span>
              <span className="text-[9px] text-muted-foreground/60 uppercase tracking-wider">/ {DISPLAY_MAX}</span>
            </div>
          </div>

          {/* Prize goal card */}
          <div className={`flex-1 rounded-xl p-3 border transition-all duration-500 ${
            reachedMax 
              ? "bg-gradient-to-br from-primary/15 to-emerald-500/10 border-primary/40 shadow-lg shadow-primary/10" 
              : "bg-card/60 border-border/40"
          }`}>
            <div className="flex items-center gap-2 mb-1.5">
              <Trophy className={`h-4 w-4 ${reachedMax ? "text-primary" : "text-muted-foreground/50"}`} />
              <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-medium">Ultimate Prize</span>
            </div>
            <p className={`text-sm font-extrabold ${reachedMax ? "text-primary" : "text-foreground/70"}`}>
              🎰 100 Free Spins
            </p>
            <p className="text-[10px] text-muted-foreground mt-0.5">
              {reachedMax ? "🎉 You've unlocked the prize!" : "Reach 100 pts to claim"}
            </p>
          </div>
        </div>

        {/* Countdown Timer */}
        {!canSpin && countdownActive && (
          <div className="bg-card/80 border border-border/50 rounded-xl px-4 py-2.5 flex items-center justify-between animate-fade-in">
            <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Next spin</span>
            <div className="flex items-center gap-1.5">
              {[
                { val: pad(countdown.h), label: "h" },
                { val: pad(countdown.m), label: "m" },
                { val: pad(countdown.s), label: "s" },
              ].map((t, i) => (
                <div key={t.label} className="flex items-center gap-1.5">
                  {i > 0 && <span className="text-muted-foreground/40 text-xs font-mono">:</span>}
                  <div className="bg-secondary/60 border border-border/40 rounded-md px-2 py-1 min-w-[36px] text-center">
                    <span className="text-sm font-mono font-bold text-foreground">{t.val}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Wheel */}
        <div className="bg-card/60 backdrop-blur-sm border border-border/40 rounded-2xl p-3">
          <SpinWheelCanvas
            canSpin={canSpin && !isSpinning}
            onRequestSpin={handleSpin}
            onSpinComplete={handleSpinComplete}
          />
        </div>

        {/* Result Card */}
        {showResult && spinResult && (() => {
          const style = tierStyles[spinResult.tier] || tierStyles.tryagain;
          return (
            <div ref={resultRef} className={`animate-scale-in ${style.bg} border ${style.border} rounded-xl p-3 text-center shadow-lg ${style.glow}`}>
              <p className={`text-sm font-extrabold ${style.text}`}>{spinResult.message}</p>
              {spinResult.actualPoints > 0 && (
                <div className="mt-2 inline-flex items-center gap-1 bg-primary/10 border border-primary/20 rounded-full px-3 py-1 animate-fade-in">
                  <Zap className="h-3 w-3 text-primary" />
                  <span className="text-xs font-bold text-primary">+{spinResult.actualPoints} pts</span>
                </div>
              )}
            </div>
          );
        })()}

        {/* Referral Row */}
        <div className="bg-card/80 border border-border/50 rounded-xl p-3 flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center flex-shrink-0">
            <Users className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-semibold text-foreground">Invite Friends</span>
              <span className="text-xs text-emerald-400 font-bold">{referralCount}/{MAX_REFERRALS}</span>
            </div>
            <div className="flex gap-1">
              {[...Array(MAX_REFERRALS)].map((_, i) => (
                <div key={i} className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${
                  i < referralCount ? "bg-emerald-500" : "bg-secondary/60"
                }`} />
              ))}
            </div>
          </div>
          {referralCount < MAX_REFERRALS && (
            <Button onClick={copyReferralLink} size="sm" variant="outline"
              className="border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/10 h-8 px-3 text-xs flex-shrink-0">
              {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
            </Button>
          )}
        </div>

        {/* Rules Section */}
        <div className="bg-card/60 border border-border/30 rounded-xl p-4 space-y-3">
          <h4 className="text-xs font-bold text-foreground flex items-center gap-2 uppercase tracking-wider">
            <Shield className="h-3.5 w-3.5 text-primary" /> Game Rules
          </h4>
          <ul className="text-[11px] text-muted-foreground/70 space-y-2 list-disc list-inside">
            <li>You can spin the wheel once every 24 hours. Points are tracked per account.</li>
            <li>Invite friends for +5 points each, up to 3 friends (15 pts max).</li>
            <li>Points are capped — the backend adjusts spins to enforce the limit.</li>
            <li>Wheel results must exactly match the points awarded. Any discrepancy is considered invalid.</li>
            <li>Reach 100 points to unlock the 100 Free Spins Promo Code.</li>
            <li>Invalid or fraudulent attempts (multiple accounts, false referrals, incorrect point claims) will not be counted.</li>
            <li>Users must follow instructions to claim prizes properly; failing to do so may result in disqualification.</li>
            <li>All decisions by the site admin are final regarding prize eligibility.</li>
          </ul>
        </div>

        <div className="h-6" />
      </div>
    </div>
  );
};

export default SpinWheelPage;
