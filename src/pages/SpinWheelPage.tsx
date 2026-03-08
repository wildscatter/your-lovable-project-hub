import { useEffect, useState, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Copy, Check, Users, Sparkles, Trophy, Star, Zap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import SpinWheelCanvas from "@/components/casino/SpinWheelCanvas";
import confetti from "canvas-confetti";

const MAX_POINTS = 100;
const REFERRAL_POINTS = 5;
const MAX_REFERRALS = 3;

interface SpinResult {
  visualPrize: string;
  visualIcon: string;
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

    if (points) {
      setTotalPoints(points.total_points);
    }

    const { data: lastSpin } = await supabase
      .from("spin_history")
      .select("spun_at")
      .eq("user_id", user.id)
      .order("spun_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (lastSpin) {
      const next = new Date(new Date(lastSpin.spun_at).getTime() + 24 * 60 * 60 * 1000);
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

  // Countdown
  useEffect(() => {
    if (!nextSpinTime) {
      setCountdownActive(false);
      return;
    }
    setCountdownActive(true);
    const interval = setInterval(() => {
      const diff = nextSpinTime.getTime() - Date.now();
      if (diff <= 0) {
        setCanSpin(true);
        setNextSpinTime(null);
        setCountdownActive(false);
        clearInterval(interval);
        return;
      }
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setCountdown({ h, m, s });
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
    setIsSpinning(true);
    setShowResult(false);
    setSpinResult(null);

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
    if (result.nextSpinAt) {
      setNextSpinTime(new Date(result.nextSpinAt));
      setCanSpin(false);
    }

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

  const progressPercent = Math.min((totalPoints / MAX_POINTS) * 100, 100);

  // Calculate countdown ring progress (24h = 100%)
  const countdownTotalSeconds = countdown.h * 3600 + countdown.m * 60 + countdown.s;
  const countdownProgress = countdownActive ? (countdownTotalSeconds / 86400) * 100 : 0;
  const circumference = 2 * Math.PI * 54;
  const strokeDashoffset = circumference - (countdownProgress / 100) * circumference;

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

  const pad = (n: number) => n.toString().padStart(2, "0");

  return (
    <div className="min-h-[100dvh] bg-background flex flex-col">
      {/* Ambient BG */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[600px] bg-[radial-gradient(ellipse_at_center,hsl(38_95%_58%/0.05),transparent_70%)]" />
      </div>

      {/* Compact Header with progress */}
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
        {/* Inline progress bar in header */}
        <div className="max-w-lg mx-auto px-3 pb-2">
          <div className="flex items-center gap-2">
            <div className="flex-1 relative">
              <Progress value={progressPercent} className="h-2 bg-secondary/40" />
            </div>
            <span className="text-[10px] font-bold text-primary whitespace-nowrap">{totalPoints}/{MAX_POINTS}</span>
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-3 py-3 space-y-3 relative z-10 flex-1 flex flex-col">
        {/* Compact Countdown Timer - inline bar style */}
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

        {/* Wheel - takes up main space */}
        <div className="bg-card/60 backdrop-blur-sm border border-border/40 rounded-2xl p-3 flex-shrink-0">
          <SpinWheelCanvas
            canSpin={canSpin && !isSpinning}
            onRequestSpin={handleSpin}
            onSpinComplete={handleSpinComplete}
          />
        </div>

        {/* Result Card - compact */}
        {showResult && spinResult && (() => {
          const style = tierStyles[spinResult.tier] || tierStyles.small;
          return (
            <div
              ref={resultRef}
              className={`animate-scale-in ${style.bg} border ${style.border} rounded-xl p-3 text-center shadow-lg ${style.glow}`}
            >
              <p className={`text-sm font-extrabold ${style.text}`}>{spinResult.message}</p>
              {spinResult.actualPoints > 0 && (
                <div className="mt-2 inline-flex items-center gap-1 bg-primary/10 border border-primary/20 rounded-full px-3 py-1 animate-fade-in">
                  <Zap className="h-3 w-3 text-primary" />
                  <span className="text-xs font-bold text-primary">+{spinResult.actualPoints} pts</span>
                </div>
              )}
              {spinResult.tier === "invite" && (
                <div className="mt-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={copyReferralLink}
                    className="border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 h-7 text-xs"
                  >
                    <Copy className="h-3 w-3 mr-1" />
                    Copy Invite Link
                  </Button>
                </div>
              )}
            </div>
          );
        })()}

        {/* Compact Referral Row */}
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
            <Button
              onClick={copyReferralLink}
              size="sm"
              variant="outline"
              className="border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/10 h-8 px-3 text-xs flex-shrink-0"
            >
              {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SpinWheelPage;
