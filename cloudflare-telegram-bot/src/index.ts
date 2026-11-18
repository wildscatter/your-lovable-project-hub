export interface Env {
  TELEGRAM_BOT_TOKEN: string;
  TELEGRAM_WEBHOOK_SECRET: string;
  AI: Ai;
  SITE_URL?: string;
}
type TelegramMessage = { chat?: { id: number; type: string }; text?: string; from?: { id: number; first_name?: string }; message_id?: number };
type TelegramUpdate = { update_id?: number; message?: TelegramMessage };
const telegram = (token: string, method: string, body: Record<string, unknown>) =>
  fetch(`https://api.telegram.org/bot${token}/${method}`, {
    method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body),
  });
const menu = { inline_keyboard: [[{ text: "🌐 Visit WildScatter", url: "https://wildscatter.com" }], [{ text: "🛡️ Responsible gambling", url: "https://wildscatter.com/responsible-gambling" }]] };
async function reply(env: Env, chatId: number, text: string) {
  const result = await telegram(env.TELEGRAM_BOT_TOKEN, "sendMessage", {
    chat_id: chatId, text: text.slice(0, 3900), reply_markup: menu,
  });
  if (!result.ok) console.error("Telegram sendMessage failed", result.status);
}
const channel = -1003852722896;
const affiliateUrl = "https://gamdom.com/r/wildscatter";
const dailyPosts = [
  `Partner link: Gamdom
If you’re comparing offers, check the official terms for eligibility, wagering and withdrawal limits before deciding.
${affiliateUrl}
Affiliate disclosure: WildScatter may earn a commission. 18+. Gambling involves risk.`,
  "WildScatter tip: Before claiming a bonus, check whether the wagering multiplier applies to the bonus alone or to the deposit plus bonus.",
  "WildScatter tip: Check withdrawal minimums, fees, and identity verification rules before using a platform.",
  "WildScatter tip: Set a time and spending limit before playing. Take a break when you reach either limit.",
  "WildScatter tip: Check which games count toward a bonus and how much each game contributes.",
  "WildScatter tip: When reading an offer, look for the expiry date, maximum bet, and any cashout cap.",
  "WildScatter tip: If gambling stops being enjoyable, taking a break or using self-exclusion can help. https://wildscatter.com/responsible-gambling",
];

export default {
  async scheduled(event: { scheduledTime: number }, env: Env): Promise<void> {
    const weekday = new Date(event.scheduledTime + 4 * 60 * 60 * 1000).getUTCDay();
    const result = await telegram(env.TELEGRAM_BOT_TOKEN, "sendMessage", {
      chat_id: channel,
      text: dailyPosts[weekday],
    });
    if (!result.ok) throw new Error(`Telegram channel post failed (HTTP ${result.status})`);
  },


  async fetch(request: Request, env: Env): Promise<Response> {
    if (request.method !== "POST" || new URL(request.url).pathname !== "/webhook") return new Response("Not found", { status: 404 });
    if (!env.TELEGRAM_BOT_TOKEN || !env.TELEGRAM_WEBHOOK_SECRET || !env.AI) return new Response("Missing configuration", { status: 503 });
    if (request.headers.get("X-Telegram-Bot-Api-Secret-Token") !== env.TELEGRAM_WEBHOOK_SECRET) return new Response("Forbidden", { status: 403 });
    if (Number(request.headers.get("content-length") || 0) > 65536) return new Response("Too large", { status: 413 });
    let update: TelegramUpdate;
    try { update = await request.json() as TelegramUpdate; } catch { return new Response("Bad request", { status: 400 }); }
    const message = update.message;
    if (!message?.chat || message.chat.type !== "private" || typeof message.text !== "string") return new Response("OK");
    const chatId = message.chat.id;
    const text = message.text.trim().slice(0, 2000);
    if (!text) return new Response("OK");
    const site = env.SITE_URL || "https://wildscatter.com";
    if (/^\/start(?:\s|$)/.test(text)) {
      await reply(env, chatId, "👋 Welcome to Lucky Mia, WildScatter's AI assistant! Ask me about casino reviews, bonus terms, safety, or navigating the website. WildScatter is an affiliate review site, not a casino. 18+ only. Gambling involves risk.");
      return new Response("OK");
    }
    if (/^\/help(?:\s|$)/.test(text)) {
      await reply(env, chatId, "Ask a question in your own words. I can explain wagering requirements, promotions, casino reviews, and safer gambling. I cannot access accounts, guarantee winnings, or verify live offers.");
      return new Response("OK");
    }
    try {
      const result = await env.AI.run("@cf/meta/llama-3.1-8b-instruct-fast", {
        messages: [
          { role: "system", content: `You are Lucky Mia, an informational assistant for WildScatter (${site}), an independent casino affiliate review website. Reply in the user's language. Be clear, concise, helpful, and transparent that the website may earn affiliate commissions. Explain bonus terms, wagering requirements, safety and site navigation. Do not invent offers, licenses, casino rankings, or current promotions; direct users to verify current details on the operator's official terms. Never promise winnings, urge deposits, use pressure or urgency, or claim gambling is a way to earn income. Do not encourage minors or users indicating gambling harm to gamble; instead offer supportive safer-gambling resources. Do not ask for credentials, payment details, or sensitive personal information. You cannot access user accounts. Keep replies under 180 words.` },
          { role: "user", content: text },
        ], max_tokens: 320, temperature: 0.4,
      });
      const answer = typeof result === "object" && result && "response" in result ? String(result.response || "") : "";
      await reply(env, chatId, answer || "I couldn't answer that right now. Please try again.");
    } catch (err) {
      console.error("AI error", err instanceof Error ? err.message : "unknown");
      await reply(env, chatId, "Sorry, I'm temporarily unavailable. Please try again shortly.");
    }
    return new Response("OK");
  },
};
