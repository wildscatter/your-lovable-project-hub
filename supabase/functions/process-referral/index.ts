import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const REFERRAL_POINTS = 5;
const MAX_REFERRALS = 3;

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

    const { referrerId } = await req.json();
    if (!referrerId || referrerId === user.id) {
      return new Response(JSON.stringify({ error: "Invalid referral" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Check if this user was already referred
    const { data: existingRef } = await serviceClient
      .from("referrals")
      .select("id")
      .eq("referred_id", user.id)
      .maybeSingle();

    if (existingRef) {
      return new Response(JSON.stringify({ message: "Already referred" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Check referrer hasn't exceeded max referrals
    const { count } = await serviceClient
      .from("referrals")
      .select("*", { count: "exact", head: true })
      .eq("referrer_id", referrerId);

    if ((count || 0) >= MAX_REFERRALS) {
      return new Response(JSON.stringify({ message: "Referrer at max referrals" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Create referral record
    await serviceClient.from("referrals").insert({
      referrer_id: referrerId,
      referred_id: user.id,
      points_awarded: true,
    });

    // Award points to referrer
    const { data: referrerPoints } = await serviceClient
      .from("user_points")
      .select("*")
      .eq("user_id", referrerId)
      .maybeSingle();

    if (referrerPoints) {
      await serviceClient
        .from("user_points")
        .update({
          total_points: referrerPoints.total_points + REFERRAL_POINTS,
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", referrerId);
    } else {
      await serviceClient
        .from("user_points")
        .insert({
          user_id: referrerId,
          total_points: REFERRAL_POINTS,
          first_spin_done: false,
        });
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
