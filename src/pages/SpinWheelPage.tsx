import { useEffect, useState, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Copy, Check, Users, Sparkles, Star, Zap, Trophy, Shield, LogIn } from "lucide-react";

import { useToast } from "@/hooks/use-toast";
import SpinWheelCanvas from "@/components/casino/SpinWheelCanvas";
import PostSpinOverlay from "@/components/casino/PostSpinOverlay";
import CampaignCountdown, { CAMPAIGN_END } from "@/components/casino/CampaignCountdown";
import confetti from "canvas-confetti";

const DISPLAY_MAX = 100;
const REFERRAL_POINTS = 5;
const MAX_REFERRALS = 3;

// Wheel segments for guest demo
const SEGMENT_VALUES = [30, 5, 20, 0, 15, 5, 10, 0];

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

  const isGuest = !user;

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
  const [guestSpinDone, setGuestSpinDone] = useState(false);
  const [campaignEnded, setCampaignEnded] = useState(CAMPAIGN_END.getTime() <= Date.now());
  const resultRef = useRef<HTMLDivElement>(null);

  const loadUserData = useCallback(async () => {
    if (!user) {
      setDataLoaded(true);
      return;
    }

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
      const next = new Date(new Date(lastSpin.spun_at).getTime() + 24 * 60 * 60 * 1000); // 24 hours
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

  // Guest demo spin — visual only, no points
  const handleGuestSpin = async (): Promise<SpinResult | null> => {
    if (campaignEnded) return null;
    setIsSpinning(true);
    const randomIndex = Math.floor(Math.random() * SEGMENT_VALUES.length);
    const fakeResult: SpinResult = {
      visualIndex: randomIndex,
      actualPoints: 0,
      totalPoints: 0,
      isFirstSpin: false,
      message: "",
      tier: "good",
      canSpinAgain: false,
      nextSpinAt: null,
      referralCount: 0,
      maxReferrals: MAX_REFERRALS,
    };
    return fakeResult;
  };

  const handleGuestSpinComplete = (_result: SpinResult) => {
    setIsSpinning(false);
    setGuestSpinDone(true);
    fireConfetti("good");
  };

  // Authenticated spin
  const handleSpin = async (): Promise<SpinResult | null> => {
    if (!user || !canSpin || isSpinning || campaignEnded) return null;
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
    }, 400);
  };

  const copyReferralLink = () => {
    if (!user) return;
    const baseUrl = window.location.hostname === "localhost" || window.location.hostname.includes("lovable")
      ? "https://wildscatter.com"
      : window.location.origin;
    navigator.clipboard.writeText(`${baseUrl}/auth?ref=${user.id}`);
    setCopied(true);
    toast({ title: "Link copied!", description: "Share it with your friends to earn bonus points." });
    setTimeout(() => setCopied(false), 2000);
  };

  const progressPercent = Math.min((totalPoints / DISPLAY_MAX) * 100, 100);

  // Progress ring calculations
  const ringRadius = 52;
  const ringCircumference = 2 * Math.PI * ringRadius;
  const ringOffset = ringCircumference - (progressPercent / 100) * ringCircumference;

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="h-12 w-12 border-3 border-primary/20 border-t-primary rounded-full animate-spin" />
            <Sparkles className="h-5 w-5 text-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
          </div>
        </div>
      </div>
    );
  }

  const reachedMax = totalPoints >= 100;

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
          {!isGuest && (
            <div className="flex items-center gap-1 bg-primary/10 border border-primary/20 rounded-full px-2.5 py-0.5">
              <Star className="h-3 w-3 text-primary" />
              <span className="text-xs font-bold text-primary">{totalPoints}</span>
            </div>
          )}
          {isGuest && <div />}
        </div>
      </div>

      <div className="max-w-lg mx-auto px-3 py-4 space-y-4 relative z-10">

        {/* Campaign Countdown */}
        <CampaignCountdown onExpired={() => setCampaignEnded(true)} />

        {/* Circular Progress + Prize Display (hidden for guests) */}
        {!isGuest && (
          <div className="flex items-center gap-4">
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
        )}

        {/* Guest Banner */}
        {isGuest && (
          <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 border border-primary/20 rounded-xl p-3 flex items-center gap-3 animate-fade-in">
            <div className="h-8 w-8 rounded-lg bg-primary/15 border border-primary/25 flex items-center justify-center flex-shrink-0">
              <Sparkles className="h-4 w-4 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-foreground">Preview Mode</p>
              <p className="text-[10px] text-muted-foreground">Try a demo spin! Sign in to earn real points.</p>
            </div>
            <Button
              size="sm"
              onClick={() => navigate("/auth?view=signup&returnTo=/spin")}
              className="bg-primary text-primary-foreground font-bold text-xs h-8 px-3 rounded-lg hover:opacity-90 flex-shrink-0"
            >
              Sign Up
            </Button>
          </div>
        )}

        {/* Wheel */}
        <div className="relative bg-card/60 backdrop-blur-sm border border-border/40 rounded-2xl p-3">
          {isGuest ? (
            <>
              <SpinWheelCanvas
                canSpin={!guestSpinDone && !isSpinning && !campaignEnded}
                onRequestSpin={handleGuestSpin}
                onSpinComplete={handleGuestSpinComplete}
              />
              {guestSpinDone && !isSpinning && (
                <div className="absolute inset-0 z-30 flex items-center justify-center animate-fade-in">
                  <div className="absolute inset-0 bg-background/90 backdrop-blur-md rounded-2xl" />
                  <div className="relative z-10 flex flex-col items-center gap-5 px-6 py-8 text-center">
                    <Sparkles className="h-10 w-10 text-primary" />
                    <h3 className="text-2xl font-extrabold text-foreground drop-shadow-lg">Sign up to earn real points!</h3>
                    <p className="text-base text-foreground/80 font-medium">Create an account to save your spins and collect rewards.</p>
                    <Button onClick={() => navigate("/auth?view=signup&returnTo=/spin")} className="bg-primary text-primary-foreground font-bold px-8 py-5 text-base rounded-xl">
                      Create Account
                    </Button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <>
              <div className={`transition-all duration-700 ${!canSpin && !isSpinning ? "blur-[6px] pointer-events-none" : ""}`}>
                <SpinWheelCanvas
                  canSpin={canSpin && !isSpinning}
                  onRequestSpin={handleSpin}
                  onSpinComplete={handleSpinComplete}
                />
              </div>
              <PostSpinOverlay
                nextSpinTime={nextSpinTime}
                visible={!canSpin && !isSpinning && countdownActive}
              />
            </>
          )}
        </div>

        {/* Referral Row (auth only) */}
        {!isGuest && (
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
        )}

        {/* Rules Section */}
        <div className="bg-card/60 border border-border/30 rounded-xl p-4 space-y-3">
          <h4 className="text-xs font-bold text-foreground flex items-center gap-2 uppercase tracking-wider">
            <Shield className="h-3.5 w-3.5 text-primary" /> Game Rules
          </h4>
          <ul className="text-[11px] text-muted-foreground/70 space-y-2 list-disc list-inside">
            <li>You can spin the wheel once every 24 hours. Points are tracked per account.</li>
            <li>Invite friends for +5 points each, up to 3 friends (15 pts max).</li>
            <li>Reach 100 points to unlock the 100 wheel free Spins.</li>
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
