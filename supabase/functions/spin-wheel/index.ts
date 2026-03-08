import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

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

const MAX_POINTS = 100;
const MAX_SPIN_POINTS = 85; // Can't reach 100 without referrals
const REFERRAL_POINTS = 5;
const MAX_REFERRALS = 3;
const COOLDOWN_MS = 24 * 60 * 60 * 1000;
const FIRST_SPIN_POINTS = 30;
const DECAY_THRESHOLD = 50;

// Visual prizes shown on wheel (decoration only)
const VISUAL_PRIZES = [
  { label: "🌟 BONUS", icon: "🌟", tier: "great" as const },
  { label: "⭐ LUCKY", icon: "⭐", tier: "good" as const },
  { label: "🔄 RETRY", icon: "🔄", tier: "tryagain" as const },
  { label: "💎 MEGA", icon: "💎", tier: "great" as const },
  { label: "👥 INVITE", icon: "👥", tier: "invite" as const },
  { label: "✨ NICE", icon: "✨", tier: "small" as const },
  { label: "👑 JACKPOT", icon: "👑", tier: "jackpot" as const },
  { label: "🎯 HIT", icon: "🎯", tier: "good" as const },
];

function calculatePoints(totalPoints: number, isFirstSpin: boolean): { points: number; visualIndex: number; tier: SpinResult["tier"] } {
  if (isFirstSpin) {
    return { points: FIRST_SPIN_POINTS, visualIndex: 6, tier: "jackpot" }; // Show jackpot visual
  }

  const remaining = MAX_SPIN_POINTS - totalPoints;
  if (remaining <= 0) {
    // At cap - give try again or invite
    const r = Math.random();
    if (r < 0.6) return { points: 0, visualIndex: 2, tier: "tryagain" };
    return { points: 0, visualIndex: 4, tier: "invite" };
  }

  // Decay: if above threshold, drastically reduce rewards
  if (totalPoints >= DECAY_THRESHOLD) {
    const r = Math.random();
    if (r < 0.35) return { points: 1, visualIndex: 5, tier: "small" };
    if (r < 0.60) return { points: 2, visualIndex: 1, tier: "small" };
    if (r < 0.75) return { points: 3, visualIndex: 7, tier: "good" };
    if (r < 0.85) return { points: 0, visualIndex: 2, tier: "tryagain" };
    if (r < 0.95) return { points: 0, visualIndex: 4, tier: "invite" };
    return { points: 5, visualIndex: 3, tier: "great" };
  }

  // Normal phase: weighted random
  const r = Math.random();
  if (r < 0.05) {
    const pts = Math.min(10, remaining);
    return { points: pts, visualIndex: 6, tier: "jackpot" };
  }
  if (r < 0.15) {
    const pts = Math.min(7, remaining);
    return { points: pts, visualIndex: 3, tier: "great" };
  }
  if (r < 0.30) {
    const pts = Math.min(5, remaining);
    return { points: pts, visualIndex: 0, tier: "great" };
  }
  if (r < 0.50) {
    const pts = Math.min(3, remaining);
    return { points: pts, visualIndex: 7, tier: "good" };
  }
  if (r < 0.70) {
    const pts = Math.min(2, remaining);
    return { points: pts, visualIndex: 1, tier: "good" };
  }
  if (r < 0.85) {
    return { points: 1, visualIndex: 5, tier: "small" };
  }
  if (r < 0.95) {
    return { points: 0, visualIndex: 2, tier: "tryagain" };
  }
  return { points: 0, visualIndex: 4, tier: "invite" };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_PUBLISHABLE_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const serviceClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const userId = user.id;

    // Get or create user points
    let { data: userPoints } = await serviceClient
      .from("user_points")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle();

    if (!userPoints) {
      const { data: newPoints } = await serviceClient
        .from("user_points")
        .insert({ user_id: userId, total_points: 0, first_spin_done: false })
        .select()
        .single();
      userPoints = newPoints;
    }

    // Check cooldown
    const { data: lastSpin } = await serviceClient
      .from("spin_history")
      .select("spun_at")
      .eq("user_id", userId)
      .order("spun_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (lastSpin) {
      const lastSpinTime = new Date(lastSpin.spun_at).getTime();
      const nextSpinTime = lastSpinTime + COOLDOWN_MS;
      if (Date.now() < nextSpinTime) {
        // Get referral count for response
        const { count: refCount } = await serviceClient
          .from("referrals")
          .select("*", { count: "exact", head: true })
          .eq("referrer_id", userId);

        const result: SpinResult = {
          visualPrize: "",
          visualIcon: "",
          actualPoints: 0,
          totalPoints: userPoints!.total_points,
          isFirstSpin: false,
          message: "Wait for your next spin!",
          tier: "tryagain",
          canSpinAgain: false,
          nextSpinAt: new Date(nextSpinTime).toISOString(),
          referralCount: refCount || 0,
          maxReferrals: MAX_REFERRALS,
        };
        return new Response(JSON.stringify(result), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    // Calculate points
    const isFirstSpin = !userPoints!.first_spin_done;
    const { points, visualIndex, tier } = calculatePoints(userPoints!.total_points, isFirstSpin);
    const visual = VISUAL_PRIZES[visualIndex];

    const newTotal = Math.min(userPoints!.total_points + points, MAX_POINTS);

    // Record spin
    await serviceClient.from("spin_history").insert({
      user_id: userId,
      points_won: points,
      prize_label: visual.label,
    });

    // Update points
    await serviceClient
      .from("user_points")
      .update({
        total_points: newTotal,
        first_spin_done: true,
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", userId);

    // Get referral count
    const { count: refCount } = await serviceClient
      .from("referrals")
      .select("*", { count: "exact", head: true })
      .eq("referrer_id", userId);

    const nextSpinAt = new Date(Date.now() + COOLDOWN_MS).toISOString();

    const messages: Record<string, string> = {
      jackpot: "🎉 Unbelievable! Jackpot!",
      great: "🔥 Amazing result!",
      good: "✨ Nice spin!",
      small: "⭐ Points added!",
      tryagain: "😅 Try again tomorrow!",
      invite: "👥 Invite a friend for bonus!",
    };

    const result: SpinResult = {
      visualPrize: visual.label,
      visualIcon: visual.icon,
      actualPoints: points,
      totalPoints: newTotal,
      isFirstSpin,
      message: messages[tier],
      tier,
      canSpinAgain: false,
      nextSpinAt,
      referralCount: refCount || 0,
      maxReferrals: MAX_REFERRALS,
    };

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
