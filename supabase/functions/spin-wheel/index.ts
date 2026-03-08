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

// Segment index mapping: { value: visualIndex[] }
// 0 -> [3,7], 5 -> [1,5], 10 -> [6], 15 -> [4], 20 -> [2], 30 -> [0]
const VALUE_TO_INDICES: Record<number, number[]> = {
  0: [3, 7], 5: [1, 5], 10: [6], 15: [4], 20: [2], 30: [0],
};

function pickIndex(value: number): number {
  const indices = VALUE_TO_INDICES[value];
  return indices[Math.floor(Math.random() * indices.length)];
}

function tierForValue(value: number): SpinResult["tier"] {
  if (value >= 30) return "jackpot";
  if (value >= 15) return "great";
  if (value >= 5) return "good";
  return "tryagain";
}

function calculatePoints(totalPoints: number, isFirstSpin: boolean): { points: number; visualIndex: number; tier: SpinResult["tier"] } {
  if (isFirstSpin) {
    return { points: 30, visualIndex: 0, tier: "jackpot" };
  }

  const remaining = MAX_POINTS - totalPoints;
  if (remaining <= 0) {
    return { points: 0, visualIndex: pickIndex(0), tier: "tryagain" };
  }

  // Build list of allowed values (only those that fit fully within remaining)
  const allValues = [0, 5, 10, 15, 20, 30];
  const allowed = allValues.filter(v => v <= remaining);

  // Weighted random from allowed values
  // Weights: 0->20, 5->25, 10->20, 15->15, 20->12, 30->8
  const baseWeights: Record<number, number> = { 0: 20, 5: 25, 10: 20, 15: 15, 20: 12, 30: 8 };

  // Above decay threshold, shift weights toward lower values
  if (totalPoints >= DECAY_THRESHOLD) {
    baseWeights[0] = 30;
    baseWeights[5] = 30;
    baseWeights[10] = 18;
    baseWeights[15] = 12;
    baseWeights[20] = 7;
    baseWeights[30] = 3;
  }

  const entries = allowed.map(v => ({ value: v, weight: baseWeights[v] }));
  const totalWeight = entries.reduce((s, e) => s + e.weight, 0);
  let r = Math.random() * totalWeight;

  for (const entry of entries) {
    r -= entry.weight;
    if (r <= 0) {
      return { points: entry.value, visualIndex: pickIndex(entry.value), tier: tierForValue(entry.value) };
    }
  }

  // Fallback (shouldn't reach here)
  return { points: 0, visualIndex: pickIndex(0), tier: "tryagain" };
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
      tryagain: "😅 Try again tomorrow!",
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
