# WildScatter VIP Assistant bot

An informational Telegram assistant hosted as a separate Cloudflare Worker. **No marketing broadcasts or personalized gambling recommendations.** It does not modify the React website, existing SEO or legal pages.

## Local setup
1. Open `telegram-bot/` in your terminal and run `npm install`.
2. Run `npm run check` and `npm run dev`.
3. For local testing, create `.dev.vars` (excluded from git) with:
```
TELEGRAM_BOT_TOKEN=<get this from BotFather>
TELEGRAM_WEBHOOK_SECRET=<generate a long random token using letters numbers underscore hyphen>
ADMIN_CHAT_ID=<optional private chat ID>
OPENAI_API_KEY=<optional: enable AI for general support questions>
```
Bot code requires only the token and webhook secret. AI is optional. AI-generated responses cannot invent partner offers.

## Deploy a separate Worker
1. Authenticate to your own Cloudflare account: `npx wrangler login`.
2. Before deployment configure secrets with `npx wrangler secret put TELEGRAM_BOT_TOKEN` and `npx wrangler secret put TELEGRAM_WEBHOOK_SECRET`. Optionally add `ADMIN_CHAT_ID` and `OPENAI_API_KEY`. These commands can publish a Worker version; use your Cloudflare dashboard if you prefer to stage changes.
3. Run `npm run deploy`. Note the HTTPS workers.dev URL.
4. With your secret stored locally (never post tokens publicly), register a webhook using Telegram Bot API `setWebhook`, URL `https://YOUR-WORKER.workers.dev/webhook`, `secret_token` set to exactly the configured webhook secret, and allowed updates `message,callback_query`.
5. Test `/start`, `/help`, `/privacy`, the menu, a custom question and handoff.
6. Insert the real bot username into the pinned channel post.

The webhook endpoint rejects missing or mismatched `X-Telegram-Bot-Api-Secret-Token` headers. The GET `/health` endpoint is safe for monitoring.

## Operational limitations
- The bot uses Telegram's API, not admin access to the channel. It cannot publish posts until added as an admin and given explicit approval.
- Human handoff sends a notification to `ADMIN_CHAT_ID` only when a user requests it; an admin must then communicate through an appropriate official channel.
- No chat persistence or analytics is enabled. Basic deterministic FAQ replies operate even without an AI API key.
- AI is restricted to general FAQs and cannot know live partner terms or account status. Review outputs before trusting them for important decisions.
- Protect and rotate secrets; keep the bot's privacy notice consistent with actual operational practices.
