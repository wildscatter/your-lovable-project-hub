import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const TELEGRAM_API = "https://api.telegram.org/bot";

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const token = Deno.env.get("TELEGRAM_BOT_TOKEN");
    const channelId = Deno.env.get("CHANNEL_ID");
    if (!token || !channelId) throw new Error("Missing TELEGRAM_BOT_TOKEN or CHANNEL_ID");

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Get the best active offer (highest priority)
    const { data: offers } = await supabase
      .from("casino_offers")
      .select("*")
      .eq("is_active", true)
      .order("priority", { ascending: false })
      .limit(1);

    if (!offers || offers.length === 0) {
      return new Response(JSON.stringify({ ok: true, message: "No active offers" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const offer = offers[0];

    const text = `🔥 *დღის საუკეთესო შეთავაზება!* 🔥

🎰 *${offer.casino_name}*
${offer.bonus_text}
${offer.description ? "\n" + offer.description : ""}

👇 მიიღე ბონუსი ახლავე!

18+ | ითამაშე პასუხისმგებლობით`;

    const inlineButtons = {
      inline_keyboard: [
        [{ text: "🎁 მიიღე ბონუსი", url: offer.affiliate_link }],
        [{ text: "🌐 wildscatter.com", url: Deno.env.get("SITE_URL") || "https://wildscatter.com" }],
      ],
    };

    const body: any = {
      chat_id: channelId,
      text,
      parse_mode: "Markdown",
      reply_markup: inlineButtons,
    };

    // If offer has banner, send as photo
    if (offer.banner_url) {
      const photoBody = {
        chat_id: channelId,
        photo: offer.banner_url,
        caption: text,
        parse_mode: "Markdown",
        reply_markup: inlineButtons,
      };
      await fetch(`${TELEGRAM_API}${token}/sendPhoto`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(photoBody),
      });
    } else {
      await fetch(`${TELEGRAM_API}${token}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
    }

    return new Response(JSON.stringify({ ok: true, posted: offer.casino_name }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Daily post error:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
