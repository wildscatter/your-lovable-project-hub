import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const TELEGRAM_API = "https://api.telegram.org/bot";

// This function is triggered via a database webhook when a new offer is inserted
serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const token = Deno.env.get("TELEGRAM_BOT_TOKEN");
    const channelId = Deno.env.get("CHANNEL_ID");
    if (!token || !channelId) throw new Error("Missing TELEGRAM_BOT_TOKEN or CHANNEL_ID");

    const payload = await req.json();

    // Support both direct call and webhook trigger format
    const offer = payload.record || payload;

    if (!offer.casino_name || !offer.affiliate_link) {
      return new Response(JSON.stringify({ ok: true, message: "No valid offer data" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const text = `🆕 *ახალი შეთავაზება!* 🆕

🎰 *${offer.casino_name}*
${offer.bonus_text || ""}
${offer.description ? "\n" + offer.description : ""}

👇 ნუ გაუშვებ ხელიდან!

18+ | ითამაშე პასუხისმგებლობით`;

    const inlineButtons = {
      inline_keyboard: [
        [{ text: "🎁 მიიღე ბონუსი", url: offer.affiliate_link }],
        [{ text: "🌐 wildscatter.com", url: Deno.env.get("SITE_URL") || "https://wildscatter.com" }],
      ],
    };

    if (offer.banner_url) {
      await fetch(`${TELEGRAM_API}${token}/sendPhoto`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: channelId,
          photo: offer.banner_url,
          caption: text,
          parse_mode: "Markdown",
          reply_markup: inlineButtons,
        }),
      });
    } else {
      await fetch(`${TELEGRAM_API}${token}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: channelId,
          text,
          parse_mode: "Markdown",
          reply_markup: inlineButtons,
        }),
      });
    }

    return new Response(JSON.stringify({ ok: true, posted: offer.casino_name }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("New offer post error:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
