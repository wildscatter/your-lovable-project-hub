export interface Env {
  TELEGRAM_BOT_TOKEN: string;
  TELEGRAM_WEBHOOK_SECRET: string;
  AI: Ai;
  SITE_URL?: string;
  MIA_RECOVERY_KEY?: string;
}
type TelegramMessage = { chat?: { id: number; type: string }; text?: string; from?: { id: number; first_name?: string }; message_id?: number };
type JoinRequest = {
  chat: { id: number; type: string; username?: string };
  from: { id: number };
  user_chat_id: number;
  date: number;
};
type TelegramUpdate = { update_id?: number; message?: TelegramMessage; chat_join_request?: JoinRequest };
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
const welcome = "Hey, welcome to WildScatter! 👋 I’m Mia, your AI VIP assistant.\n\nI can help you understand VIP programs, compare their benefits, and check the terms of available offers.\n\nAlready using a platform, or just exploring? Tell me what you’d like help with 💬\n\nTap Start chatting to continue. 18+ only. Gambling involves risk.";
class TelegramSetupError extends Error {}
async function callTelegram(env: Env, method: string, body: Record<string, unknown>) {
  let response: Response;
  try {
    response = await telegram(env.TELEGRAM_BOT_TOKEN, method, body);
  } catch {
    // Network errors can contain the request URL, including the bot token.
    throw new TelegramSetupError(`Telegram ${method}: connection failed. Please retry.`);
  }
  let data: { ok: boolean; result?: any; error_code?: number; description?: string };
  try {
    data = await response.json() as typeof data;
  } catch {
    throw new TelegramSetupError(`Telegram ${method}: invalid response (HTTP ${response.status}). Please retry.`);
  }
  if (!response.ok || !data.ok) {
    let description = typeof data.description === "string" ? data.description : "Request rejected";
    for (const secret of [env.TELEGRAM_BOT_TOKEN, env.TELEGRAM_WEBHOOK_SECRET]) {
      if (secret) description = description.split(secret).join("[redacted]");
    }
    throw new TelegramSetupError(`Telegram ${method} (${data.error_code || response.status}): ${description.slice(0, 400)}`);
  }
  return data.result;
}

async function welcomeAndApprove(env: Env, join: JoinRequest) {
  // A join request already identifies the destination and pending user.
  // Avoid extra membership lookups before Telegram's short DM window closes.
  if (join.chat.id !== channel) return;
  // Telegram closes the private messaging window once the request is approved.
  await callTelegram(env, "sendMessage", {
    chat_id: join.user_chat_id,
    text: welcome,
    reply_markup: { inline_keyboard: [[{ text: "Start chatting", url: "https://t.me/LUCKYMIABOT?start=vip_welcome" }]] },
  });
  await callTelegram(env, "approveChatJoinRequest", { chat_id: channel, user_id: join.from.id });
}

async function setupChannel(env: Env, userId: number, webhookUrl: string) {
  const owner = await callTelegram(env, "getChatMember", { chat_id: channel, user_id: userId });
  if (owner.status !== "creator") return "Only the WildScatter channel owner can configure this flow.";
  const bot = await callTelegram(env, "getMe", {});
  const member = await callTelegram(env, "getChatMember", { chat_id: channel, user_id: bot.id });
  if (!member.can_invite_users) return "Please enable Invite Users / Approve Join Requests for Mia in the channel, then send /setupchannel again.";
  const info = await callTelegram(env, "getWebhookInfo", {});
  if (info.url && info.url !== webhookUrl) return "Webhook belongs to another address. Please check the existing bot deployment.";
  await callTelegram(env, "setWebhook", {
    url: webhookUrl,
    secret_token: env.TELEGRAM_WEBHOOK_SECRET,
    allowed_updates: [...new Set([...(info.allowed_updates || ["message"]), "message", "chat_join_request"])],
  });
  const invite = await callTelegram(env, "createChatInviteLink", {
    chat_id: channel, name: "Mia VIP welcome", creates_join_request: true,
  });
  return `Mia’s request → welcome → approve flow is configured.\n\nUse this request-to-join link on the website:\n${invite.invite_link}`;
}


async function channelStatus(env: Env, userId: number, webhookUrl: string) {
  const owner = await callTelegram(env, "getChatMember", { chat_id: channel, user_id: userId });
  if (owner.status !== "creator") return "Only the WildScatter channel owner can check this setup.";
  const bot = await callTelegram(env, "getMe", {});
  const member = await callTelegram(env, "getChatMember", { chat_id: channel, user_id: bot.id });
  const info = await callTelegram(env, "getWebhookInfo", {});
  let lastError = String(info.last_error_message || "None reported");
  for (const secret of [env.TELEGRAM_BOT_TOKEN, env.TELEGRAM_WEBHOOK_SECRET]) {
    if (secret) lastError = lastError.split(secret).join("[redacted]");
  }
  return [
    `Channel: ${channel}`,
    `Mia: @${bot.username || "unknown"}`,
    `Approve requests permission: ${member.can_invite_users ? "yes" : "NO"}`,
    `Webhook matches this Worker: ${info.url === webhookUrl ? "yes" : "NO"}`,
    `Join request updates enabled: ${info.allowed_updates?.includes("chat_join_request") ? "yes" : "NO"}`,
    `Pending webhook updates: ${info.pending_update_count || 0}`,
    `Last webhook error: ${lastError.slice(0, 400)}`,
    `Last error time: ${info.last_error_date ? new Date(info.last_error_date * 1000).toISOString() : "None"}`,
    "Pending webhook updates are delivery events, not a count of people waiting to join.",
  ].join("\n");
}

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
    if (new URL(request.url).pathname === "/recover") {
      const headers = { "Cache-Control": "no-store" };
      if (request.method !== "POST" || !env.MIA_RECOVERY_KEY ||
          request.headers.get("Authorization") !== `Bearer ${env.MIA_RECOVERY_KEY}`) {
        return new Response("Not found", { status: 404, headers });
      }
      if (!env.TELEGRAM_BOT_TOKEN || !env.TELEGRAM_WEBHOOK_SECRET) {
        return Response.json({ ok: false, error: "Missing Telegram token or webhook secret in this Worker." }, { status: 503, headers });
      }
      try {
        const bot = await callTelegram(env, "getMe", {});
        if (String(bot.username).toLowerCase() !== "luckymiabot") {
          return Response.json({ ok: false, error: "This Worker token belongs to a different bot. Webhook unchanged." }, { status: 409, headers });
        }
        const member = await callTelegram(env, "getChatMember", { chat_id: channel, user_id: bot.id });
        const webhookUrl = "https://wildscatter-vip-bot.butrus300.workers.dev/webhook";
        await callTelegram(env, "setWebhook", {
          url: webhookUrl, secret_token: env.TELEGRAM_WEBHOOK_SECRET,
          allowed_updates: ["message", "chat_join_request"],
          drop_pending_updates: false,
        });
        const info = await callTelegram(env, "getWebhookInfo", {});
        return Response.json({
          ok: info.url === webhookUrl && info.allowed_updates?.includes("chat_join_request"),
          bot: bot.username,
          webhookMatches: info.url === webhookUrl,
          canApprove: !!member.can_invite_users,
          pendingUpdates: info.pending_update_count || 0,
          nextStep: "Send /start to Mia, then cancel and resend your pending join request.",
        }, { headers });
      } catch (error) {
        return Response.json({ ok: false, error: error instanceof TelegramSetupError ? error.message : "Recovery failed." }, { status: 502, headers });
      }
    }
    if (request.method !== "POST" || new URL(request.url).pathname !== "/webhook") return new Response("Not found", { status: 404 });
    if (!env.TELEGRAM_BOT_TOKEN || !env.TELEGRAM_WEBHOOK_SECRET) return new Response("Missing configuration", { status: 503 });
    if (request.headers.get("X-Telegram-Bot-Api-Secret-Token") !== env.TELEGRAM_WEBHOOK_SECRET) return new Response("Forbidden", { status: 403 });
    if (Number(request.headers.get("content-length") || 0) > 65536) return new Response("Too large", { status: 413 });
    let update: TelegramUpdate;
    try { update = await request.json() as TelegramUpdate; } catch { return new Response("Bad request", { status: 400 }); }
    if (update.chat_join_request) {
      try {
        await welcomeAndApprove(env, update.chat_join_request);
        return new Response("OK");
      } catch (error) {
        console.error(error instanceof Error ? error.message : "Join request failed");
        return new Response("Join request failed", { status: 503 });
      }
    }
    const message = update.message;
    if (!message?.chat || message.chat.type !== "private" || typeof message.text !== "string") return new Response("OK");
    const chatId = message.chat.id;
    const text = message.text.trim().slice(0, 2000);
    if (!text) return new Response("OK");
    if (/^\/channelstatus(?:\s|$)/.test(text)) {
      try {
        await reply(env, chatId, await channelStatus(env, message.from?.id || chatId, new URL("/webhook", request.url).href));
      } catch (error) {
        const detail = error instanceof TelegramSetupError ? error.message : "Unexpected status error. Please retry.";
        await reply(env, chatId, `Channel check failed.\n\n${detail}`);
      }
      return new Response("OK");
    }
    if (/^\/setupchannel(?:\s|$)/.test(text)) {
      try {
        await reply(env, chatId, await setupChannel(env, message.from?.id || chatId, new URL("/webhook", request.url).href));
      } catch (error) {
        const detail = error instanceof TelegramSetupError ? error.message : "Unexpected setup error. Please retry.";
        console.error("Channel setup failed:", detail);
        await reply(env, chatId, `Channel setup failed.\n\n${detail}`);
      }
      return new Response("OK");
    }
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
