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
    <div className="min-h-screen bg-background">
      {/* Ambient BG */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[600px] bg-[radial-gradient(ellipse_at_center,hsl(38_95%_58%/0.05),transparent_70%)]" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[400px] bg-[radial-gradient(ellipse_at_center,hsl(280_60%_42%/0.03),transparent_60%)]" />
      </div>

      {/* Sticky Header */}
      <div className="border-b border-border/50 bg-card/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={() => navigate("/")} className="text-muted-foreground hover:text-foreground -ml-2">
            <ArrowLeft className="h-4 w-4 mr-1" /> Back
          </Button>
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="font-bold text-foreground text-sm">Spin & Win</span>
          </div>
          <div className="flex items-center gap-1.5 bg-primary/10 border border-primary/20 rounded-full px-3 py-1">
            <Star className="h-3 w-3 text-primary" />
            <span className="text-xs font-bold text-primary">{totalPoints}</span>
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-6 space-y-6 relative z-10">
        {/* Progress Card */}
        <div className="bg-card/80 backdrop-blur-sm border border-border/50 rounded-2xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <Trophy className="h-4 w-4 text-primary" />
              </div>
              <span className="text-sm font-semibold text-foreground">Progress</span>
            </div>
            <div className="text-right">
              <span className="text-xl font-extrabold text-primary">{totalPoints}</span>
              <span className="text-xs text-muted-foreground">/{MAX_POINTS}</span>
            </div>
          </div>
          <div className="relative">
            <Progress value={progressPercent} className="h-3 bg-secondary/60" />
            <div className="absolute inset-0 flex items-center">
              {[25, 50, 75].map((mark) => (
                <div
                  key={mark}
                  className="absolute h-3 w-px bg-background/50"
                  style={{ left: `${mark}%` }}
                />
              ))}
            </div>
          </div>
          <div className="flex justify-between text-[10px] text-muted-foreground/60 uppercase tracking-wider">
            <span>Start</span>
            <span>Goal</span>
          </div>
        </div>

        {/* Countdown Timer - Circular Ring */}
        {!canSpin && countdownActive && (
          <div className="flex justify-center animate-fade-in">
            <div className="bg-card/80 backdrop-blur-sm border border-border/50 rounded-2xl p-6 flex flex-col items-center gap-4 w-full max-w-[300px]">
              <p className="text-xs text-muted-foreground uppercase tracking-widest font-medium">Next spin available in</p>
              <div className="relative w-[130px] h-[130px]">
                {/* Background ring */}
                <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                  <circle
                    cx="60" cy="60" r="54"
                    fill="none"
                    stroke="hsl(var(--secondary))"
                    strokeWidth="6"
                    opacity="0.3"
                  />
                  <circle
                    cx="60" cy="60" r="54"
                    fill="none"
                    stroke="hsl(var(--primary))"
                    strokeWidth="6"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    className="transition-all duration-1000 ease-linear"
                    style={{
                      filter: "drop-shadow(0 0 6px hsl(var(--primary) / 0.4))",
                    }}
                  />
                </svg>
                {/* Center time display */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-mono font-extrabold text-foreground tracking-tight">
                    {pad(countdown.h)}:{pad(countdown.m)}
                  </span>
                  <span className="text-lg font-mono font-bold text-primary">
                    {pad(countdown.s)}
                  </span>
                </div>
              </div>
              {/* Segmented time blocks */}
              <div className="flex gap-3">
                {[
                  { label: "HRS", val: pad(countdown.h) },
                  { label: "MIN", val: pad(countdown.m) },
                  { label: "SEC", val: pad(countdown.s) },
                ].map((t) => (
                  <div key={t.label} className="flex flex-col items-center">
                    <div className="bg-secondary/60 border border-border/40 rounded-lg px-3 py-1.5 min-w-[48px] text-center">
                      <span className="text-base font-mono font-bold text-foreground">{t.val}</span>
                    </div>
                    <span className="text-[9px] text-muted-foreground/60 mt-1 uppercase tracking-wider">{t.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Wheel */}
        <div className="bg-card/60 backdrop-blur-sm border border-border/40 rounded-2xl p-4 sm:p-6">
          <SpinWheelCanvas
            canSpin={canSpin && !isSpinning}
            onRequestSpin={handleSpin}
            onSpinComplete={handleSpinComplete}
          />
        </div>

        {/* Result Card */}
        {showResult && spinResult && (() => {
          const style = tierStyles[spinResult.tier] || tierStyles.small;
          return (
            <div
              ref={resultRef}
              className={`animate-scale-in ${style.bg} border ${style.border} rounded-2xl p-5 text-center shadow-lg ${style.glow}`}
            >
              <p className={`text-lg font-extrabold ${style.text}`}>{spinResult.message}</p>
              {spinResult.actualPoints > 0 && (
                <div className="mt-3 inline-flex items-center gap-1.5 bg-primary/10 border border-primary/20 rounded-full px-4 py-1.5 animate-fade-in">
                  <Zap className="h-3 w-3 text-primary" />
                  <span className="text-sm font-bold text-primary">+{spinResult.actualPoints} pts</span>
                </div>
              )}
              {spinResult.tier === "invite" && (
                <div className="mt-3">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={copyReferralLink}
                    className="border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10"
                  >
                    <Copy className="h-3 w-3 mr-1.5" />
                    Copy Invite Link
                  </Button>
                </div>
              )}
            </div>
          );
        })()}

        {/* Referral Card */}
        <div className="bg-card/80 backdrop-blur-sm border border-border/50 rounded-2xl p-5 space-y-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
              <Users className="h-5 w-5 text-emerald-400" />
            </div>
            <div className="flex-1">
              <h3 className="text-foreground font-bold text-sm">Invite Friends</h3>
              <p className="text-[11px] text-muted-foreground">
                +{REFERRAL_POINTS} pts per invite
              </p>
            </div>
            <div className="text-right">
              <span className="text-lg font-bold text-emerald-400">{referralCount}</span>
              <span className="text-xs text-muted-foreground">/{MAX_REFERRALS}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {[...Array(MAX_REFERRALS)].map((_, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
                <div className={`h-2.5 w-full rounded-full transition-all duration-500 ${
                  i < referralCount
                    ? "bg-emerald-500 shadow-sm shadow-emerald-500/30"
                    : "bg-secondary/60"
                }`} />
                <span className="text-[9px] text-muted-foreground/50">
                  {i < referralCount ? "✓" : `+${REFERRAL_POINTS}`}
                </span>
              </div>
            ))}
          </div>

          {referralCount < MAX_REFERRALS && (
            <Button
              onClick={copyReferralLink}
              variant="outline"
              className="w-full border-emerald-500/20 hover:bg-emerald-500/5 hover:border-emerald-500/40 text-foreground transition-all"
            >
              {copied ? (
                <><Check className="h-4 w-4 mr-2 text-emerald-400" /> Copied!</>
              ) : (
                <><Copy className="h-4 w-4 mr-2" /> Copy Invite Link</>
              )}
            </Button>
          )}
        </div>

        <div className="h-8" />
      </div>
    </div>
  );
};

export default SpinWheelPage;
