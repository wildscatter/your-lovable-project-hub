import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Copy, Check, Users, Clock, Sparkles, Gift } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import SpinWheelCanvas from "@/components/casino/SpinWheelCanvas";

const MAX_POINTS = 100;
const REFERRAL_POINTS = 5;
const MAX_REFERRALS = 3;
const COOLDOWN_HOURS = 24;

const SpinWheelPage = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [totalPoints, setTotalPoints] = useState(0);
  const [firstSpinDone, setFirstSpinDone] = useState(false);
  const [canSpin, setCanSpin] = useState(true);
  const [nextSpinTime, setNextSpinTime] = useState<Date | null>(null);
  const [countdown, setCountdown] = useState("");
  const [referralCount, setReferralCount] = useState(0);
  const [copied, setCopied] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  // Load user data
  const loadUserData = useCallback(async () => {
    if (!user) return;

    // Get or create user points
    const { data: points } = await supabase
      .from("user_points")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();

    if (points) {
      setTotalPoints(points.total_points);
      setFirstSpinDone(points.first_spin_done);
    } else {
      await supabase.from("user_points").insert({ user_id: user.id, total_points: 0, first_spin_done: false });
    }

    // Check last spin time
    const { data: lastSpin } = await supabase
      .from("spin_history")
      .select("spun_at")
      .eq("user_id", user.id)
      .order("spun_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (lastSpin) {
      const lastSpinDate = new Date(lastSpin.spun_at);
      const nextSpin = new Date(lastSpinDate.getTime() + COOLDOWN_HOURS * 60 * 60 * 1000);
      if (nextSpin > new Date()) {
        setCanSpin(false);
        setNextSpinTime(nextSpin);
      }
    }

    // Get referral count
    const { count } = await supabase
      .from("referrals")
      .select("*", { count: "exact", head: true })
      .eq("referrer_id", user.id);

    setReferralCount(count || 0);
    setDataLoaded(true);
  }, [user]);

  useEffect(() => {
    loadUserData();
  }, [loadUserData]);

  // Countdown timer
  useEffect(() => {
    if (!nextSpinTime) return;
    const interval = setInterval(() => {
      const now = new Date();
      const diff = nextSpinTime.getTime() - now.getTime();
      if (diff <= 0) {
        setCanSpin(true);
        setNextSpinTime(null);
        setCountdown("");
        clearInterval(interval);
        return;
      }
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      setCountdown(`${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`);
    }, 1000);
    return () => clearInterval(interval);
  }, [nextSpinTime]);

  const handleSpinComplete = async (prize: { label: string; points: number }) => {
    if (!user) return;

    let pointsToAdd = prize.points;

    // First spin always gives 30
    if (!firstSpinDone && pointsToAdd > 0) {
      pointsToAdd = 30;
    }

    // Record spin
    await supabase.from("spin_history").insert({
      user_id: user.id,
      points_won: pointsToAdd,
      prize_label: prize.label,
    });

    // Update points
    if (pointsToAdd > 0) {
      const newTotal = Math.min(totalPoints + pointsToAdd, MAX_POINTS);
      await supabase
        .from("user_points")
        .update({
          total_points: newTotal,
          first_spin_done: true,
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", user.id);

      setTotalPoints(newTotal);
      setFirstSpinDone(true);
    } else {
      // Even "try again" marks first spin done
      if (!firstSpinDone) {
        // Actually for first spin, override to give 30 points
        const newTotal = Math.min(totalPoints + 30, MAX_POINTS);
        await supabase
          .from("user_points")
          .update({ total_points: newTotal, first_spin_done: true, updated_at: new Date().toISOString() })
          .eq("user_id", user.id);
        setTotalPoints(newTotal);
        setFirstSpinDone(true);
      }
    }

    // Set cooldown
    const nextSpin = new Date(Date.now() + COOLDOWN_HOURS * 60 * 60 * 1000);
    setCanSpin(false);
    setNextSpinTime(nextSpin);
  };

  const copyReferralLink = () => {
    if (!user) return;
    const link = `${window.location.origin}/auth?ref=${user.id}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    toast({ title: "ლინკი დაკოპირდა!", description: "გაუგზავნე მეგობარს რეგისტრაციისთვის." });
    setTimeout(() => setCopied(false), 2000);
  };

  const progressPercent = Math.min((totalPoints / MAX_POINTS) * 100, 100);
  const maxPointsWithoutReferrals = MAX_POINTS - (MAX_REFERRALS * REFERRAL_POINTS);

  if (loading || !dataLoaded) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={() => navigate("/")} className="text-muted-foreground">
            <ArrowLeft className="h-4 w-4 mr-1" /> უკან
          </Button>
          <h1 className="text-lg font-bold text-foreground flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Spin & Win
          </h1>
          <div className="w-20" />
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        {/* Points Progress */}
        <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-foreground font-bold text-lg">შენი ქულები</h2>
            <span className="text-2xl font-extrabold text-primary">{totalPoints}<span className="text-sm text-muted-foreground font-normal">/{MAX_POINTS}</span></span>
          </div>
          <Progress value={progressPercent} className="h-4 bg-secondary" />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>0</span>
            <span className="text-primary font-medium">{totalPoints} ქულა</span>
            <span>{MAX_POINTS}</span>
          </div>
          {totalPoints >= maxPointsWithoutReferrals && referralCount < MAX_REFERRALS && (
            <p className="text-xs text-accent text-center animate-pulse">
              ⚠️ პროგრეს ბარის შესავსებად მოიწვიე მეგობრები!
            </p>
          )}
        </div>

        {/* Wheel Section */}
        <div className="bg-card border border-border rounded-2xl p-6 flex flex-col items-center gap-6">
          {!canSpin && countdown && (
            <div className="flex items-center gap-2 bg-secondary/50 border border-border rounded-xl px-5 py-3">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">შემდეგი დატრიალება:</span>
              <span className="text-lg font-mono font-bold text-primary">{countdown}</span>
            </div>
          )}

          <SpinWheelCanvas
            canSpin={canSpin}
            firstSpinDone={firstSpinDone}
            onSpinComplete={handleSpinComplete}
          />
        </div>

        {/* Invite Friends Section */}
        <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Users className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="text-foreground font-bold">მოიწვიე მეგობარი</h3>
              <p className="text-xs text-muted-foreground">მიიღე {REFERRAL_POINTS} ქულა ყოველი მოწვევისთვის (მაქს. {MAX_REFERRALS})</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {[...Array(MAX_REFERRALS)].map((_, i) => (
              <div
                key={i}
                className={`h-3 flex-1 rounded-full transition-colors ${
                  i < referralCount ? "bg-primary" : "bg-secondary"
                }`}
              />
            ))}
          </div>
          <p className="text-xs text-muted-foreground text-center">
            {referralCount}/{MAX_REFERRALS} მეგობარი მოწვეული • +{referralCount * REFERRAL_POINTS} ქულა მიღებული
          </p>

          {referralCount < MAX_REFERRALS && (
            <Button
              onClick={copyReferralLink}
              variant="outline"
              className="w-full border-primary/30 hover:bg-primary/10 text-foreground"
            >
              {copied ? <Check className="h-4 w-4 mr-2 text-emerald-500" /> : <Copy className="h-4 w-4 mr-2" />}
              {copied ? "დაკოპირდა!" : "დააკოპირე მოწვევის ლინკი"}
            </Button>
          )}
        </div>

        {/* Rules */}
        <div className="bg-card/50 border border-border rounded-2xl p-5 space-y-2">
          <h4 className="text-sm font-bold text-foreground flex items-center gap-2">
            <Gift className="h-4 w-4 text-primary" /> წესები
          </h4>
          <ul className="text-xs text-muted-foreground space-y-1.5 list-disc list-inside">
            <li>ბორბლის დატრიალება შესაძლებელია 24 საათში ერთხელ</li>
            <li>პირველი დატრიალებისას იღებ 30 ქულას</li>
            <li>მაქსიმალური ქულა: {MAX_POINTS}</li>
            <li>მოიწვიე მეგობარი და მიიღე {REFERRAL_POINTS} ქულა (მაქს. {MAX_REFERRALS} მოწვევა)</li>
            <li>პროგრეს ბარის შესავსებად საჭიროა მეგობრების მოწვევა</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SpinWheelPage;
