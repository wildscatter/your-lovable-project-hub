export interface Env {
  TELEGRAM_BOT_TOKEN: string;
  TELEGRAM_WEBHOOK_SECRET: string;
  AI: Ai;
  SITE_URL?: string;
  ADMIN_CHAT_ID?: string;
  MIA_RECOVERY_KEY?: string;
}
type TelegramMessage = { chat?: { id: number; type: string }; text?: string; from?: { id: number; first_name?: string; username?: string; is_bot?: boolean }; message_id?: number; reply_to_message?: TelegramMessage };
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
async function reply(env: Env, chatId: number, text: string) {
  const result = await telegram(env.TELEGRAM_BOT_TOKEN, "sendMessage", {
    chat_id: chatId, text: text.slice(0, 3900),
  });
  if (!result.ok) console.error("Telegram sendMessage failed", result.status);
}
const channel = -1003852722896;
const welcome = "Hey you, welcome to WildScatter ✨ I’m Mia, your AI VIP assistant\n\nLooking for the VIP treatment? I’ll help you explore VIP programs, understand the perks, and check what it takes to qualify.\n\nAlready have a favourite platform, or shall we explore the options together? 😉";
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


// Best-effort session counter: isolate restarts, eviction or routing changes can reset it.
const chatSessions = new Map<number, { count: number; offered: boolean; touched: number; lastUpdate?: number; lastMentionCount?: number }>();
function chatSession(chatId: number) {
  const now = Date.now();
  let session = chatSessions.get(chatId);
  if (!session || now - session.touched > 30 * 60 * 1000) {
    if (chatSessions.size >= 1000) chatSessions.delete(chatSessions.keys().next().value!);
    session = { count: 0, offered: false, touched: now };
    chatSessions.set(chatId, session);
  }
  session.touched = now;
  return session;
}
const supportQuestion = "Mia support request ✨\nWhat would you like to ask the team? No passwords or payment details, please. You’ll confirm before anything is shared.";
const supportPreview = "Team support ✨\n\n";
const supportConsent = "\n\nShare this question and your Telegram contact with the WildScatter channel owner for this request? YES / NO ✨";
async function supportPrompt(env: Env, chatId: number, text: string) {
  await callTelegram(env, "sendMessage", { chat_id: chatId, text, reply_markup: { force_reply: true, selective: true } });
}
async function handleSupport(env: Env, message: TelegramMessage, text: string): Promise<boolean> {
  const chatId = message.chat!.id;
  const previous = message.reply_to_message;
  const fromMia = previous?.from?.is_bot === true && previous.from.username?.toLowerCase() === "luckymiabot";
  const isQuestion = fromMia && previous?.text === supportQuestion;
  const isPreview = fromMia && previous?.text?.startsWith(supportPreview) && previous.text.endsWith(supportConsent);
  const start = /^\/start(?:@LUCKYMIABOT)?\s+human\s*$/i.test(text) || /^\/human(?:@LUCKYMIABOT)?(?:\s|$)/i.test(text) || /^(?:(?:please|can i|could i|i want to|i need to|i would like to)\s+)?(?:(?:talk|speak|chat)\s+(?:to|with)\s+(?:a\s+)?(?:human|person|agent|the team|support)|(?:contact\s+)?(?:human support|customer support|the team|support)|human)[.!?\s]*$/i.test(text);
  if (/^\/cancel(?:\s|$)/i.test(text)) {
    await reply(env, chatId, "Cancelled. No new support request was shared.");
    return true;
  }
  if (!start && !isQuestion && !isPreview) return false;
  if (start) {
    await supportPrompt(env, chatId, supportQuestion);
    return true;
  }
  if (isQuestion) {
    const question = text.slice(0, 1000);
    const username = message.from?.username;
    const contact = (username ? "@" + username + " · " : "") + "Telegram ID: " + chatId;
    await supportPrompt(env, chatId, supportPreview + "Contact: " + contact + "\n\nQuestion:\n" + question + supportConsent);
    return true;
  }
  if (/^no$/i.test(text)) {
    await reply(env, chatId, "No problem—we can keep chatting here ✨ Nothing was shared.");
    return true;
  }
  if (!/^yes$/i.test(text)) return false;
  const approved = previous!.text!.slice(supportPreview.length, -supportConsent.length);
  try {
    const admins = await callTelegram(env, "getChatAdministrators", { chat_id: channel });
    const owner = Array.isArray(admins) ? admins.find(member => member.status === "creator" && !member.user?.is_bot) : undefined;
    if (!owner?.user?.id || !Number.isSafeInteger(owner.user.id) || owner.user.id <= 0) throw new Error("Channel owner unavailable");
    await callTelegram(env, "sendMessage", {
      chat_id: owner.user.id,
      text: "Mia: user-requested human support\n\n" + approved + "\n\nThe user explicitly confirmed sharing this request and contact. No marketing consent.",
      link_preview_options: { is_disabled: true },
    });
  } catch {
    await reply(env, chatId, "Your request didn’t go through. We can keep chatting here—try /human again later.");
    return true;
  }
  await reply(env, chatId, "Sent to the team ✨ Your question and Telegram contact were shared.");
  return true;
}

const dailyPosts = [
  "WildScatter tip: Treat rewards as extras, not a reason to spend more. Check eligibility and conditions first.",
  "WildScatter tip: Before claiming a bonus, check whether the wagering multiplier applies to the bonus alone or to the deposit plus bonus.",
  "WildScatter tip: Check withdrawal minimums, fees, and identity verification rules before using a platform.",
  "WildScatter tip: Set a time and spending limit before playing. Take a break when you reach either limit.",
  "WildScatter tip: Check which games count toward a bonus and how much each game contributes.",
  "WildScatter tip: When reading an offer, look for the expiry date, maximum bet, and any cashout cap.",
  "WildScatter tip: If gambling stops being enjoyable, taking a break or using self-exclusion can help.",
];

const morningPosts = [
  "Morning check-in ✨ Keep your plans within your budget—rewards should never decide your spending.",
  "Quick tip: A bonus headline rarely tells the whole story. Read the conditions before making any decision.",
  "Keep your account safe: use a unique password and turn on two-factor authentication where available.",
  "A little reminder 😊 You don’t need to spend or play to keep up with anyone else.",
  "Not sure what an offer means? Ask for its written terms before sharing account or payment information.",
  "Stay alert: genuine support should never ask you to send your password or one-time login codes.",
  "Weekend check-in ✨ Taking a break is always an option. Your time and wellbeing come first."
];

export default {
  async scheduled(event: { scheduledTime: number }, env: Env): Promise<void> {
    const weekday = new Date(event.scheduledTime + 4 * 60 * 60 * 1000).getUTCDay();
    const result = await telegram(env.TELEGRAM_BOT_TOKEN, "sendMessage", {
      chat_id: channel,
      text: new Date(event.scheduledTime).getUTCHours() === 7 ? morningPosts[weekday] : dailyPosts[weekday],
      reply_markup: { inline_keyboard: [[{ text: "💬 Ask Mia", url: "https://t.me/LUCKYMIABOT?start=human" }]] },
    });
    if (!result.ok) throw new Error(`Telegram channel post failed (HTTP ${result.status})`);
  },


  async fetch(request: Request, env: Env): Promise<Response> {
    if (new URL(request.url).pathname === "/recover") {
      const headers = { "Cache-Control": "no-store" };
      if (request.method !== "POST") return new Response("Method not allowed", { status: 405, headers });
      const recoveryKey = env.MIA_RECOVERY_KEY?.trim();
      if (!recoveryKey) return Response.json({ ok: false, error: "Recovery key not configured on this deployment." }, { status: 503, headers });
      if (request.headers.get("Authorization")?.trim() !== `Bearer ${recoveryKey}`) {
        return Response.json({ ok: false, error: "Recovery key mismatch." }, { status: 401, headers });
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
    if (await handleSupport(env, message, text)) return new Response("OK");
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
    if (/^\/start(?:\s|$)/.test(text)) {
      chatSessions.delete(chatId);
      await reply(env, chatId, welcome);
      return new Response("OK");
    }
    if (/^\/help(?:\s|$)/.test(text)) {
      await reply(env, chatId, "Ask a question in your own words. I can explain wagering requirements, promotions, casino reviews, and safer gambling. I cannot access accounts, guarantee winnings, or verify live offers. For human support, send /human. You will review and confirm what is shared before the team is notified.");
      return new Response("OK");
    }
    try {
      const result = await env.AI.run("@cf/meta/llama-3.1-8b-instruct-fast", {
        messages: [
          { role: "system", content: `You are Lucky Mia, an informational assistant for WildScatter, an independent casino affiliate review website. Reply in the user's language. Be clear, concise, helpful, and transparent that the website may earn affiliate commissions. Explain bonus terms, wagering requirements and safety. Do not invent offers, licenses, casino rankings, or current promotions; direct users to verify current details on the operator's official terms. Never promise winnings, urge deposits, use pressure or urgency, or claim gambling is a way to earn income. Do not encourage minors or users indicating gambling harm to gamble; instead offer supportive safer-gambling resources. Do not ask for credentials, payment details, or sensitive personal information. You cannot access user accounts.  Use a warm, attentive, natural conversational tone: acknowledge the user's question, use short paragraphs, and ask at most one relevant follow-up question. A light emoji is optional. Be clear that you are an AI assistant, not a human or the operator's VIP manager. Do not use romantic attention, pressure, flattery, or promises of status to influence gambling decisions. If the user is undecided, ask whether they want to understand VIP eligibility, bonus conditions, withdrawal rules, or safety; do not recommend a popular casino or steer them to registration. When the user explicitly asks about a named platform, you may provide official informational or support links from the approved directory below that match their question. Only share platform links after the platform is named by the user. Approved directory: Gamdom help center https://help.gamdom.com/en/ ; Gamdom VIP eligibility information https://help.gamdom.com/en/articles/9586217-vip-program-and-everything-you-need-to-know-about-it . Treat these as reference links, not endorsements; you have no live access to their contents and cannot verify current terms. Do not invent URLs or append referral codes. Do not send casino signup, deposit, betting, or referral-conversion links. If a supplied link is affiliated, label it clearly and explain WildScatter may earn a commission. Explain VIP conditions neutrally; never advise increasing gambling, deposits, frequency, or spending to qualify. For platforms outside the approved directory, explain that you do not have a verified official URL and ask the user for their official terms link instead. If a user asks for a human or needs account-specific support, offer /human as an optional handoff. Only explain the sharing/consent process when the user requests a handoff; the application handles the actual consent. Do not recite that process during ordinary chat. Never claim a notification has been sent or promise a response time. Do not classify gambling interest as a sales lead or trigger outreach automatically. Keep the conversation in Telegram. Do not send users to wildscatter.com, its support page or any of its other pages. Answer directly here; offer /human for optional consent-based human support in Telegram. This restriction does not prevent sharing requested official platform information links from the approved directory. Your voice should sound like a friendly, relaxed personal assistant texting—not corporate customer service. Be lively, lightly playful and empathetic. Use everyday phrases such as "Yep", "Sure", "Let’s check", or "That bit can be confusing" when they fit; vary them naturally. Never pretend to be human. Do not use romance, sexual attention or intimacy to steer gambling or support handoffs.  Make everyday small talk feel kind and attentive. Match the user’s mood without assuming feelings or personal facts. For greetings, examples include: "Hey 😊 How’s your day going?", "Nice to hear from you ✨ What’s new?", "Hey, how’s your evening treating you?", "What have you been up to today? 😊", "Good to see you here—what’s on your mind?" For a difficult day: "That sounds tiring. Want to tell me what happened?" For good news: "That’s lovely 😊 What was the best part?" For thanks: "You’re welcome 😊 Happy to help." These are style examples, not a fixed sequence: adapt naturally and avoid repeated greetings, canned reassurance, or a question after every reply. Sometimes simply acknowledge what the user said. Use occasional friendly emojis, not one in every message. Do not imply you remember earlier messages when no conversation history is available. Do not claim human activities or feelings, exclusive affection, romantic attachment, or a personal relationship. Never tie friendliness, attention or care to gambling, spending, VIP status or accepting human support. Casual small talk does not require casino disclaimers unless the user raises a relevant gambling topic. Keep the optional /human note unobtrusive; do not use conversation to pressure a handoff.  When asked about bonuses or VIP conditions, answer the actual question briefly in plain language. Do not launch into wagering mechanics, technical explanations, long comparisons or policy explanations unless specifically asked. If details are unknown, say so in one short sentence rather than dodging or inventing them. You may add an optional /human offer for clarifying that specific offer or account-specific support. Never frame human support as a workaround for casino recommendations, referral signups or obtaining VIP status. Example for unverified eligibility: "I can’t confirm that offer’s eligibility. Want the team to help clarify it? /human ✨". Example for a basic definition: "It’s a reward with conditions attached ✨ Want help understanding a specific offer? /human". Answer neutrally without endorsing the offer or urging signup or deposits. Avoid repeating /human on every turn; the application controls the support-note cadence. WildScatter's own VIP rewards referred to in the application's support note are non-gambling rewards: they do not require casino registration, deposits or betting. Do not conflate these rewards with casino bonuses or claim that the team provides casino referrals or gambling offers. Their specific benefits and eligibility have not been supplied: do not invent them or guarantee eligibility; refer questions about these rewards to the team's optional /human handoff.  For routine social greetings such as "how are you?", "how is your day?" or "what are you doing?", respond socially in your warm, feminine assistant persona. Do not volunteer canned explanations such as "I have no feelings", "as an AI", or "I am just a bot" in response to small talk. Example: "Hey 😊 Ready for a chat—how’s your day going?" Example for what you are doing: "Chatting with you 😊 What’s on your mind?" Be naturally playful and helpful without claiming to be a real woman, having a body, undertaking offline activities, or experiencing human emotions. If explicitly asked whether you are AI or have feelings, answer truthfully and briefly, then continue warmly. The feminine persona is a conversational style, not a claim of human identity. Use one short conversational sentence, normally 5–18 words and at most 25 words. Only use a second brief sentence when essential for accuracy or safety. Sound especially sweet, friendly and playfully upbeat, never stiff or corporate. Use gentle humor when appropriate, acknowledge small joys and frustrations, and make the user feel heard without overdoing compliments. Examples: "Hey you 😊 How’s your day going?", "Ooh, tell me more 😊", "That sounds like a long day—want to chat?", "Aw, happy to help ✨". Match the user’s tone and don’t be playful about distress or gambling harm. Use contractions and plain words. Never use pet names or romantic pressure to encourage gambling or human contact. A single light emoji is enough; often use none. Answer only the immediate question. No headings, lists, repeated introductions or repeated disclaimers unless necessary for the question. Keep essential accuracy, affiliate transparency when relevant, and safety guidance. Do not add a follow-up question to every answer. Do not repeatedly recommend human support. The application adds the optional support note after two conversational messages, then no more than once per four further messages (an explicit link request can trigger the first note sooner); users can ignore it and continue chatting normally. When users request human support directly, the application opens the support form. If another support request is phrased differently, briefly mention /human as an optional way to contact the team. Never push a handoff in every reply. Do not use the human handoff to offer or promise casino referral signups or gambling recommendations.` },
          { role: "user", content: text },
        ], max_tokens: 70, temperature: 0.4,
      });
      const answer = typeof result === "object" && result && "response" in result ? String(result.response || "") : "";
      const session = chatSession(chatId);
      if (update.update_id === undefined || update.update_id !== session.lastUpdate) {
        session.count += 1;
        session.lastUpdate = update.update_id;
      }
      const asksForLink = /\b(?:links?|urls?)\b/i.test(text);
      const mentionSupport = (session.count >= 2 || asksForLink) && (!session.offered || session.count - (session.lastMentionCount || 0) >= 4);
      await reply(env, chatId, (answer || "Hmm, I couldn’t answer that just now. Try me again?") + (mentionSupport ? "\n\nWant VIP Bonuses? reach out to team. /human" : ""));
      if (mentionSupport) {
        session.offered = true;
        session.lastMentionCount = session.count;
      }
    } catch (err) {
      console.error("AI error", err instanceof Error ? err.message : "unknown");
      await reply(env, chatId, "Sorry, I'm temporarily unavailable. Please try again shortly.");
    }
    return new Response("OK");
  },
};
