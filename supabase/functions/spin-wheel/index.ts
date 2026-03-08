import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

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

const MAX_POINTS = 85;
const REFERRAL_POINTS = 5;
const MAX_REFERRALS = 3;
const COOLDOWN_MS = 10 * 1000; // 10 seconds for testing (change to 24 * 60 * 60 * 1000 for production)
const FIRST_SPIN_POINTS = 30;
const DECAY_THRESHOLD = 50;

// Wheel segments: [30, 5, 20, 0, 15, 5, 10, 0] (indices 0-7)
const SEGMENT_VALUES = [30, 5, 20, 0, 15, 5, 10, 0];

function calculatePoints(totalPoints: number, isFirstSpin: boolean): { points: number; visualIndex: number; tier: SpinResult["tier"] } {
  if (isFirstSpin) {
    return { points: FIRST_SPIN_POINTS, visualIndex: 0, tier: "jackpot" }; // lands on 30
  }

  const remaining = MAX_POINTS - totalPoints;
  if (remaining <= 0) {
    const r = Math.random();
    if (r < 0.5) return { points: 0, visualIndex: 3, tier: "tryagain" }; // lands on 0
    return { points: 0, visualIndex: 7, tier: "invite" }; // lands on 0
  }

  // Decay: above threshold, reduce rewards
  if (totalPoints >= DECAY_THRESHOLD) {
    const r = Math.random();
    if (r < 0.30) return { points: Math.min(5, remaining), visualIndex: 1, tier: "small" }; // 5
    if (r < 0.55) return { points: 0, visualIndex: 3, tier: "tryagain" }; // 0
    if (r < 0.70) return { points: 0, visualIndex: 7, tier: "invite" }; // 0
    if (r < 0.85) return { points: Math.min(5, remaining), visualIndex: 5, tier: "small" }; // 5
    if (r < 0.95) return { points: Math.min(10, remaining), visualIndex: 6, tier: "good" }; // 10
    return { points: Math.min(15, remaining), visualIndex: 4, tier: "great" }; // 15
  }

  // Normal phase: weighted random
  const r = Math.random();
  if (r < 0.05) {
    return { points: Math.min(30, remaining), visualIndex: 0, tier: "jackpot" }; // 30
  }
  if (r < 0.12) {
    return { points: Math.min(20, remaining), visualIndex: 2, tier: "great" }; // 20
  }
  if (r < 0.25) {
    return { points: Math.min(15, remaining), visualIndex: 4, tier: "great" }; // 15
  }
  if (r < 0.45) {
    return { points: Math.min(10, remaining), visualIndex: 6, tier: "good" }; // 10
  }
  if (r < 0.65) {
    return { points: Math.min(5, remaining), visualIndex: 1, tier: "good" }; // 5
  }
  if (r < 0.80) {
    return { points: Math.min(5, remaining), visualIndex: 5, tier: "small" }; // 5
  }
  if (r < 0.92) {
    return { points: 0, visualIndex: 3, tier: "tryagain" }; // 0
  }
  return { points: 0, visualIndex: 7, tier: "invite" }; // 0
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
      Deno.env.get("SUPABASE_ANON_KEY")!,
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
        const { count: refCount } = await serviceClient
          .from("referrals")
          .select("*", { count: "exact", head: true })
          .eq("referrer_id", userId);

        const result: SpinResult = {
          visualIndex: 3,
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

    const newTotal = Math.min(userPoints!.total_points + points, MAX_POINTS);

    // Record spin
    await serviceClient.from("spin_history").insert({
      user_id: userId,
      points_won: points,
      prize_label: `${SEGMENT_VALUES[visualIndex]} pts`,
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
      visualIndex,
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
