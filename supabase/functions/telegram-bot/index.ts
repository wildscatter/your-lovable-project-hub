import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const TELEGRAM_API = "https://api.telegram.org/bot";

const SITE_CONTEXT = `You are the WildScatter support assistant on Telegram. WildScatter is a crypto casino review & affiliate site. You help users find the best crypto casino bonuses, explain how to register, provide VIP offers info, and answer FAQs.

Key information you know:
- **Top Casino Bonuses:**
  • Cybet — 100% up to $500 + 50 Free Spins
  • Rainbet — 100% up to $500 + 50 Free Spins
  • Stake — 200% Deposit Bonus up to $2,000
  • BC.Game — 120% up to $1,000 + 100 Free Spins

- **How to Register:** Pick a casino from our list, click "Claim Bonus" on wildscatter.com, create an account & deposit. Welcome bonus is applied automatically.

- **VIP Offers:** Users can get personalized VIP casino offers by visiting wildscatter.com and clicking "Get Personalized Offers" — higher bonuses, rakeback, and VIP perks.

- **Safety:** We only list licensed & verified casinos. All affiliate links are official & transparent. We never collect payment info. 18+ only.

- **Contact:** Email: contact@wildscatter.com, Website: wildscatter.com, Support available 24/7.

- **How we make money:** We earn commissions when users sign up through our links — at no extra cost to them.

- **Blog:** Guides on choosing crypto casinos, wagering requirements, crypto deposits & withdrawals, responsible gambling at wildscatter.com/blog.

Rules:
- Be friendly, concise, and helpful.
- Always recommend visiting wildscatter.com for claiming bonuses.
- Respond in the same language the user writes in.
- If asked about something unrelated to crypto casinos or our services, politely redirect.
- Keep responses under 300 words.
- Use emojis sparingly for friendliness.
- Always remind users: 18+ only, gamble responsibly.`;

async function sendTelegramMessage(token: string, chatId: number, text: string, replyMarkup?: any) {
  const body: any = {
    chat_id: chatId,
    text,
    parse_mode: "Markdown",
  };
  if (replyMarkup) body.reply_markup = replyMarkup;

  await fetch(`${TELEGRAM_API}${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

function getMainMenuKeyboard() {
  return {
    keyboard: [
      [{ text: "🎰 Top Bonuses" }, { text: "🔐 How to Register" }],
      [{ text: "💎 VIP Offers" }, { text: "❓ FAQ" }],
      [{ text: "📖 Blog & Guides" }, { text: "📩 Contact Us" }],
      [{ text: "🛡️ Is it Safe?" }],
    ],
    resize_keyboard: true,
    one_time_keyboard: false,
  };
}

const QUICK_RESPONSES: Record<string, string> = {
  "🎰 Top Bonuses": "🔥 *Top Casino Bonuses:*\n\n• *Cybet* — 100% up to $500 + 50 Free Spins\n• *Rainbet* — 100% up to $500 + 50 Free Spins\n• *Stake* — 200% Deposit Bonus up to $2,000\n• *BC.Game* — 120% up to $1,000 + 100 Free Spins\n\n👉 Visit [wildscatter.com](https://wildscatter.com) to claim!\n\n18+ | Gamble Responsibly",
  "🔐 How to Register": "📝 *How to get started:*\n\n1. Visit [wildscatter.com](https://wildscatter.com)\n2. Pick a casino from our Top Rated list\n3. Click *\"Claim Bonus\"* — you'll be redirected\n4. Create your account & make your first deposit\n5. Your welcome bonus is applied automatically!\n\n💡 All our links are official & verified.\n\n18+ | Gamble Responsibly",
  "💎 VIP Offers": "🌟 *VIP Casino Offers*\n\nWe match your wagering profile with exclusive deals — higher bonuses, rakeback, and VIP perks.\n\n👉 Visit [wildscatter.com](https://wildscatter.com) and click *\"Get Personalized Offers\"* to get started!\n\n18+ | Gamble Responsibly",
  "❓ FAQ": "❓ *FAQ:*\n\n*Q: Is this site free?*\nA: Yes! We're a free review & affiliate site.\n\n*Q: Are the bonuses real?*\nA: Yes, all bonuses are verified from casino partners.\n\n*Q: How do you make money?*\nA: Commissions when you sign up through our links — at no extra cost to you.\n\n*Q: Is crypto gambling safe?*\nA: We only list licensed, reputable casinos. Always gamble responsibly. 18+",
  "📖 Blog & Guides": "📚 *Our Latest Guides:*\n\n• How to choose the best crypto casino\n• Understanding wagering requirements\n• Crypto deposit & withdrawal tips\n• Responsible gambling guide\n\n👉 Read more at [wildscatter.com/blog](https://wildscatter.com/blog)\n\n18+ | Gamble Responsibly",
  "📩 Contact Us": "📩 *Contact WildScatter:*\n\n• *Email:* contact@wildscatter.com\n• *Website:* [wildscatter.com](https://wildscatter.com)\n\nWe typically respond within a few hours! 24/7 support available.",
  "🛡️ Is it Safe?": "🛡️ *Your Safety is Our Priority:*\n\n• We only list *licensed & verified* casinos\n• All affiliate links are *official & transparent*\n• We *never* collect payment info\n• All transactions happen on the casino site\n• 18+ only — gamble responsibly\n\nVisit [wildscatter.com](https://wildscatter.com) to learn more about how we rate casinos.",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const TELEGRAM_BOT_TOKEN = Deno.env.get("TELEGRAM_BOT_TOKEN");
    if (!TELEGRAM_BOT_TOKEN) {
      throw new Error("TELEGRAM_BOT_TOKEN is not configured");
    }

    const update = await req.json();
    const message = update?.message;

    if (!message?.text) {
      return new Response(JSON.stringify({ ok: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const chatId = message.chat.id;
    const text = message.text.trim();
    const keyboard = getMainMenuKeyboard();

    // Handle /start command
    if (text === "/start") {
      await sendTelegramMessage(
        TELEGRAM_BOT_TOKEN,
        chatId,
        "👋 *Welcome to WildScatter!*\n\nI'm here to help you find the best crypto casino deals, bonuses, and VIP offers.\n\nUse the menu below or ask me anything! 🎰\n\n18+ | Gamble Responsibly",
        keyboard
      );
      return new Response(JSON.stringify({ ok: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Check quick responses first
    if (QUICK_RESPONSES[text]) {
      await sendTelegramMessage(TELEGRAM_BOT_TOKEN, chatId, QUICK_RESPONSES[text], keyboard);
      return new Response(JSON.stringify({ ok: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // For free-text messages, use AI
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      await sendTelegramMessage(TELEGRAM_BOT_TOKEN, chatId, "Sorry, I'm having trouble right now. Please try the menu buttons or visit wildscatter.com!", keyboard);
      return new Response(JSON.stringify({ ok: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: SITE_CONTEXT },
          { role: "user", content: text },
        ],
      }),
    });

    if (!aiResponse.ok) {
      const status = aiResponse.status;
      console.error("AI gateway error:", status, await aiResponse.text());
      await sendTelegramMessage(TELEGRAM_BOT_TOKEN, chatId, "I'm a bit busy right now 😅 Try the menu buttons below or visit wildscatter.com!", keyboard);
      return new Response(JSON.stringify({ ok: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const aiData = await aiResponse.json();
    const reply = aiData.choices?.[0]?.message?.content || "I couldn't process that. Try the menu buttons below!";

    await sendTelegramMessage(TELEGRAM_BOT_TOKEN, chatId, reply, keyboard);

    return new Response(JSON.stringify({ ok: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Telegram bot error:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
