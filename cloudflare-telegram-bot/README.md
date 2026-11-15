# Lucky Mia — Cloudflare Telegram AI bot

This is a standalone Cloudflare Worker for **@LUCKYMIABOT**, independent of the paused Supabase project. The website continues to be deployed separately.

## Deploy
1. In Cloudflare, open **Workers & Pages** and create a Worker from this repository using the `cloudflare-telegram-bot` directory as the Worker root, or use Wrangler from this directory.
2. Install Wrangler: `npm install -g wrangler`; then `wrangler login` and `wrangler deploy`.
3. Add **Worker secrets** (Cloudflare dashboard → Worker → Settings → Variables and Secrets): `TELEGRAM_BOT_TOKEN` (from BotFather) and `TELEGRAM_WEBHOOK_SECRET` (generate a long random string using only A-Z, a-z, 0-9, underscore or hyphen). Never commit either value.
4. Configure Telegram's webhook from a trusted local terminal (replace placeholders; do not commit the command with real values):
   ```bash
   curl -X POST "https://api.telegram.org/bot<BOT_TOKEN>/setWebhook" \
     -H "Content-Type: application/json" \
     -d '{"url":"https://<WORKER_NAME>.<SUBDOMAIN>.workers.dev/webhook","secret_token":"<WEBHOOK_SECRET>","allowed_updates":["message"]}'
   ```
5. Check `https://api.telegram.org/bot<BOT_TOKEN>/getWebhookInfo` privately, then send `/start` to @LUCKYMIABOT.

**Important:** Cloudflare Workers AI must be enabled on the account and may incur usage charges beyond its free allocation. No token or AI credentials belong in client-side Vite environment variables.

## Security and limitations
- Telegram webhook secret header is verified before processing messages.
- Private text messages only; no automatic DMs to new channel subscribers (Telegram limits bot-initiated conversations).
- The Worker uses Cloudflare Workers AI; it does not depend on Supabase or Lovable.
- The current version is stateless (no conversation history) and does not fetch live offers. Consider adding KV/D1 for opt-in memory, replay deduplication, and rate limits before large-scale traffic.
- Do not merge or deploy until the secrets, webhook, and bot responses are tested.
