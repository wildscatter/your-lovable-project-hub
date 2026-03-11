import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const TELEGRAM_API = "https://api.telegram.org/bot";

// ──── English Messages ────

const WELCOME_VARIANTS = [
  `🎰 *Welcome to Wild Scatter!* 🎰

🔥 The best crypto casino bonuses are waiting for you!
💎 Exclusive offers and VIP privileges

👇 Click below to claim your bonus!

18+ | Play Responsibly`,

  `🌟 *Welcome to the Wild Scatter family!* 🌟

🎁 Ready for the best casino bonuses?
💰 Register → Deposit → Bonus automatically!

👇 Choose your casino and get started!

18+ | Play Responsibly`,

  `🚀 *Welcome! Wild Scatter brings you the best crypto casinos!* 🚀

🎰 Verified casinos
🎁 Exclusive bonuses
💎 VIP offers

👇 Start now!

18+ | Play Responsibly`,
];

const MAIN_MENU_TEXT = `🎰 *Wild Scatter Bot* 🎰

Choose what interests you:`;

const CONTACT_TEXT = `📩 *Contact Us:*

• *Website:* wildscatter.com
• *Email:* contact@wildscatter.com
• *Telegram:* @WildScatter

24/7 support available!`;

const HELP_TEXT = `❓ *Help:*

Ask me any question about casinos, bonuses or slots and I'll help you!

Or use the menu:
🎁 Offers — Active bonuses
⭐ Top Casinos — Best casinos list
🔗 Referral Link — Your personal link
💬 Contact — Contact info`;

const AI_SYSTEM_PROMPT = `You are Wild Scatter's casino affiliate assistant. Help users with questions about casinos, bonuses and slots. Always mention responsible gambling.

Key info:
- Wild Scatter is a crypto casino review and affiliate site
- We offer verified casinos with exclusive bonuses
- Website: wildscatter.com
- 24/7 support
- 18+ | Play Responsibly

Rules:
- Reply in the same language the user writes in
- Be friendly and specific
- Always recommend visiting wildscatter.com
- If the question isn't about casinos, politely redirect
- Keep answers under 300 words`;

// ──── Helpers ────

function getSupabaseClient() {
  return createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );
}

function getMainKeyboard() {
  return {
    keyboard: [
      [{ text: "🎁 Offers" }, { text: "⭐ Top Casinos" }],
      [{ text: "🔗 Referral Link" }, { text: "💬 Contact" }],
      [{ text: "❓ Help" }],
    ],
    resize_keyboard: true,
    one_time_keyboard: false,
  };
}

async function sendMessage(token: string, chatId: number, text: string, replyMarkup?: any) {
  const body: any = { chat_id: chatId, text, parse_mode: "Markdown" };
  if (replyMarkup) body.reply_markup = replyMarkup;
  await fetch(`${TELEGRAM_API}${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

async function sendPhoto(token: string, chatId: number, photoUrl: string, caption: string, replyMarkup?: any) {
  const body: any = { chat_id: chatId, photo: photoUrl, caption, parse_mode: "Markdown" };
  if (replyMarkup) body.reply_markup = replyMarkup;
  await fetch(`${TELEGRAM_API}${token}/sendPhoto`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

async function logUser(supabase: any, telegramId: number, username?: string, firstName?: string, variant?: number) {
  await supabase.from("bot_users").upsert(
    { telegram_id: telegramId, username: username || null, first_name: firstName || null, welcome_variant: variant || 1 },
    { onConflict: "telegram_id" }
  );
}

async function getActiveOffers(supabase: any) {
  const { data } = await supabase
    .from("casino_offers")
    .select("*")
    .eq("is_active", true)
    .order("priority", { ascending: false })
    .limit(10);
  return data || [];
}

async function getTopCasinos(supabase: any) {
  const { data } = await supabase
    .from("casinos")
    .select("*")
    .eq("is_active", true)
    .eq("is_top", true)
    .order("rating", { ascending: false })
    .limit(10);
  return data || [];
}

async function askAI(question: string): Promise<string> {
  const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
  if (!LOVABLE_API_KEY) return "Sorry, the AI assistant is temporarily unavailable. Please try again later!";

  try {
    const resp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: AI_SYSTEM_PROMPT },
          { role: "user", content: question },
        ],
      }),
    });

    if (!resp.ok) {
      console.error("AI error:", resp.status);
      return "Sorry, I couldn't process your question. Try the menu or visit wildscatter.com!";
    }

    const data = await resp.json();
    return data.choices?.[0]?.message?.content || "Couldn't process the answer. Please try again!";
  } catch (e) {
    console.error("AI fetch error:", e);
    return "Temporary issue. Please try again later!";
  }
}

// ──── Handlers ────

async function handleNewMember(token: string, message: any, supabase: any) {
  const chatId = message.chat.id;
  const newMembers = message.new_chat_members || [];
  const affiliateLink = Deno.env.get("AFFILIATE_LINK") || "https://wildscatter.com";
  const siteUrl = Deno.env.get("SITE_URL") || "https://wildscatter.com";
  const bannerUrl = Deno.env.get("WELCOME_BANNER_URL");

  for (const member of newMembers) {
    if (member.is_bot) continue;

    const variant = Math.floor(Math.random() * 3);
    const welcomeText = WELCOME_VARIANTS[variant];

    await logUser(supabase, member.id, member.username, member.first_name, variant + 1);

    const inlineButtons = {
      inline_keyboard: [
        [
          { text: "🎁 Claim Bonus", url: affiliateLink },
          { text: "🌐 Website", url: siteUrl },
        ],
      ],
    };

    if (bannerUrl) {
      await sendPhoto(token, chatId, bannerUrl, welcomeText, inlineButtons);
    } else {
      await sendMessage(token, chatId, welcomeText, inlineButtons);
    }

    try {
      await sendMessage(token, member.id, `👋 Hello ${member.first_name || ""}!\n\n${welcomeText}`, inlineButtons);
    } catch {
      // User may not have started bot — ignore
    }
  }
}

async function handleOffers(token: string, chatId: number, supabase: any) {
  const offers = await getActiveOffers(supabase);

  if (offers.length === 0) {
    await sendMessage(token, chatId, "No active offers at the moment. Check back soon! 🎰", getMainKeyboard());
    return;
  }

  let text = "🎁 *Active Offers:*\n\n";
  const buttons: any[] = [];

  for (const offer of offers) {
    text += `🎰 *${offer.casino_name}*\n${offer.bonus_text}\n${offer.description ? offer.description + "\n" : ""}\n`;
    buttons.push([{ text: `🎁 ${offer.casino_name} — Claim Bonus`, url: offer.affiliate_link }]);
  }

  text += "\n18+ | Play Responsibly";
  await sendMessage(token, chatId, text, { inline_keyboard: buttons });
}

async function handleTopCasinos(token: string, chatId: number, supabase: any) {
  const casinos = await getTopCasinos(supabase);

  if (casinos.length === 0) {
    await sendMessage(token, chatId, "Casino list coming soon! 🎰", getMainKeyboard());
    return;
  }

  let text = "⭐ *Top Casinos:*\n\n";
  const buttons: any[] = [];

  for (let i = 0; i < casinos.length; i++) {
    const c = casinos[i];
    text += `${i + 1}. *${c.name}* — ⭐ ${c.rating}/5.0\n${c.description ? c.description + "\n" : ""}\n`;
    buttons.push([{ text: `🎰 ${c.name}`, url: c.affiliate_link }]);
  }

  text += "\n18+ | Play Responsibly";
  await sendMessage(token, chatId, text, { inline_keyboard: buttons });
}

function handleReferralLink(token: string, chatId: number, telegramId: number) {
  const siteUrl = Deno.env.get("SITE_URL") || "https://wildscatter.com";
  const referralLink = `${siteUrl}?ref=tg_${telegramId}`;

  const text = `🔗 *Your Referral Link:*

\`${referralLink}\`

Share with friends and earn bonuses! 🎁

18+ | Play Responsibly`;

  return sendMessage(token, chatId, text, getMainKeyboard());
}

// ──── Main Handler ────

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const token = Deno.env.get("TELEGRAM_BOT_TOKEN");
    if (!token) throw new Error("TELEGRAM_BOT_TOKEN not configured");

    const update = await req.json();
    const supabase = getSupabaseClient();
    const keyboard = getMainKeyboard();

    // Handle new members in group
    if (update?.message?.new_chat_members) {
      await handleNewMember(token, update.message, supabase);
      return new Response(JSON.stringify({ ok: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const message = update?.message;
    if (!message?.text) {
      return new Response(JSON.stringify({ ok: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const chatId = message.chat.id;
    const text = message.text.trim();
    const telegramId = message.from?.id;
    const username = message.from?.username;
    const firstName = message.from?.first_name;

    // /start command
    if (text === "/start") {
      await logUser(supabase, telegramId, username, firstName);
      await sendMessage(token, chatId, MAIN_MENU_TEXT, keyboard);
      return new Response(JSON.stringify({ ok: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Menu buttons
    switch (text) {
      case "🎁 Offers":
        await handleOffers(token, chatId, supabase);
        break;
      case "⭐ Top Casinos":
        await handleTopCasinos(token, chatId, supabase);
        break;
      case "🔗 Referral Link":
        await handleReferralLink(token, chatId, telegramId);
        break;
      case "💬 Contact":
        await sendMessage(token, chatId, CONTACT_TEXT, keyboard);
        break;
      case "❓ Help":
        await sendMessage(token, chatId, HELP_TEXT, keyboard);
        break;
      default: {
        const aiReply = await askAI(text);
        await sendMessage(token, chatId, aiReply, keyboard);
        break;
      }
    }

    return new Response(JSON.stringify({ ok: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Bot error:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
