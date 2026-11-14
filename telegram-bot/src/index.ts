import faq from "../faq.json";

interface Env {
  TELEGRAM_BOT_TOKEN: string;
  TELEGRAM_WEBHOOK_SECRET: string;
  ADMIN_CHAT_ID?: string;
  CHANNEL_URL: string;
}
type Chat = { id: number; type: string };
type User = { id: number; first_name?: string };
type Message = { text?: string; chat: Chat; from?: User };
type Callback = { id: string; data?: string; message?: Message };
type Update = { update_id: number; message?: Message; callback_query?: Callback };
type TgReply = { ok: boolean; description?: string };

const answers = Object.fromEntries(faq.map(x => [x.topic, x.answer]));
const menu = {
  inline_keyboard: [
    [{ text: "💎 VIP services", callback_data: "vip" }, { text: "📋 Partner terms", callback_data: "terms" }],
    [{ text: "❓ About WildScatter", callback_data: "about" }, { text: "🛡 Responsible gambling", callback_data: "safety" }],
    [{ text: "🙋 Human support", callback_data: "support" }],
  ],
};
const topics: Record<string, string> = {
  vip: "VIP services", terms: "Partner terms",
  about: "About WildScatter", safety: "Responsible gambling",
};
const welcome = `Welcome to WildScatter VIP Club! 👋

I'm an automated assistant, not a human VIP manager. I can explain our services, general partner terms and ways to get help.

Choose a topic below or send /support to request human assistance.

18+ (or higher legal age in your location). Gambling carries financial risk. Never share passwords, codes, card details or personal documents here.`;

async function telegram(env: Env, method: string, payload: object): Promise<void> {
  const result = await fetch(`https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/${method}`, {
    method: "POST", headers: { "content-type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!result.ok) throw new Error(`Telegram returned HTTP ${result.status}`);
  const data = await result.json() as TgReply;
  if (!data.ok) throw new Error(data.description || "Telegram request failed");
}
async function send(env: Env, chatId: number, text: string, withMenu = false): Promise<void> {
  await telegram(env, "sendMessage", {
    chat_id: chatId, text,
    disable_web_page_preview: true,
    ...(withMenu ? { reply_markup: menu } : {}),
  });
}
async function handleMessage(env: Env, message: Message): Promise<void> {
  if (message.chat.type !== "private" || !message.text) return;
  const text = message.text.trim().slice(0, 500);
  const command = text.split(/\s+/)[0].split("@")[0].toLowerCase();
  if (command === "/start" || command === "/help") {
    await send(env, message.chat.id, welcome, true);
    return;
  }
  if (command === "/privacy") {
    await send(env, message.chat.id, answers.Privacy);
    return;
  }
  if (command === "/channel") {
    await send(env, message.chat.id, "Official WildScatter channel: " + env.CHANNEL_URL);
    return;
  }
  if (command === "/support") {
    if (!env.ADMIN_CHAT_ID || !/^-?\d+$/.test(env.ADMIN_CHAT_ID)) {
      await send(env, message.chat.id, "Human support is not configured yet. Please consult the official contact details on wildscatter.com.");
      return;
    }
    // Only a Telegram user ID is forwarded: never forward arbitrary player messages or sensitive data.
    await telegram(env, "sendMessage", {
      chat_id: env.ADMIN_CHAT_ID,
      text: `WildScatter: human support requested by Telegram user ID ${message.from?.id ?? message.chat.id}. Follow your authorized support process; an admin cannot directly reply to the user through this notification.`,
    });
    await send(env, message.chat.id, "Your request has been flagged for human review. Do not send private account or payment information. We cannot guarantee response times.");
    return;
  }
  if (/\b(addict|addiction|can't stop|cannot stop|debt|self.exclud|lost money|gambling problem|problem gambling)\b/i.test(text)) {
    await send(env, message.chat.id, answers["Responsible gambling"]);
    return;
  }
  if (/\b(bonus|casino|deposit|wager|bet|win|offer|free spins|jackpot|promotion)\b/i.test(text)) {
    await send(env, message.chat.id, answers["Partner terms"], true);
    return;
  }
  if (/\b(privacy|data|information about me)\b/i.test(text)) {
    await send(env, message.chat.id, answers.Privacy, true);
    return;
  }
  if (/\b(vip|club|service|assistant)\b/i.test(text)) {
    await send(env, message.chat.id, answers["VIP services"], true);
    return;
  }
  await send(env, message.chat.id, "I can help with WildScatter services, general partner conditions and responsible gambling information. Choose an option below, or use /support to request human assistance.", true);
}
async function processUpdate(env: Env, update: Update): Promise<void> {
  if (update.callback_query) {
    const callback = update.callback_query;
    await telegram(env, "answerCallbackQuery", { callback_query_id: callback.id });
    const chat = callback.message?.chat;
    if (!chat || chat.type !== "private") return;
    if (callback.data === "support") {
      await send(env, chat.id, "To request human support, send /support. Do not send financial or account credentials.");
    } else if (callback.data && topics[callback.data]) {
      await send(env, chat.id, answers[topics[callback.data]], true);
    } else {
      await send(env, chat.id, welcome, true);
    }
    return;
  }
  if (update.message) await handleMessage(env, update.message);
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    if (request.method === "GET" && url.pathname === "/health") {
      return new Response(JSON.stringify({ ok: true, app: "wildscatter-vip-bot" }), {
        headers: { "content-type": "application/json", "cache-control": "no-store" },
      });
    }
    if (request.method !== "POST" || url.pathname !== "/webhook") {
      return new Response("Not found", { status: 404 });
    }
    if (!env.TELEGRAM_WEBHOOK_SECRET || !env.TELEGRAM_BOT_TOKEN) {
      return new Response("Service not configured", { status: 503 });
    }
    if (request.headers.get("X-Telegram-Bot-Api-Secret-Token") !== env.TELEGRAM_WEBHOOK_SECRET) {
      return new Response("Unauthorized", { status: 401 });
    }
    if ((Number(request.headers.get("content-length")) || 0) > 65536) {
      return new Response("Payload too large", { status: 413 });
    }
    let update: Update;
    try {
      update = await request.json() as Update;
    } catch {
      return new Response("Invalid JSON", { status: 400 });
    }
    if (typeof update.update_id !== "number") return new Response("Invalid update", { status: 400 });
    try {
      await processUpdate(env, update);
      return new Response("OK");
    } catch {
      // Return a retryable failure to Telegram. Do not leak tokens or user content.
      return new Response("Temporary failure", { status: 503 });
    }
  },
};
