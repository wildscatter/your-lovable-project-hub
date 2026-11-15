import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const code = readFileSync(new URL("../src/index.ts", import.meta.url), "utf8");
const config = readFileSync(new URL("../wrangler.toml", import.meta.url), "utf8");

test("webhook verifies Telegram secret before parsing messages", () => {
  assert.match(code, /X-Telegram-Bot-Api-Secret-Token/);
  assert.match(code, /status: 401/);
});
test("bot discloses automation and includes human handoff", () => {
  assert.match(code, /automated assistant/);
  assert.match(code, /\/support/);
  assert.match(code, /ADMIN_CHAT_ID/);
});
test("no outbound broadcast or unapproved channel publishing", () => {
  assert.doesNotMatch(code, /sendPhoto|copyMessage|forwardMessage/);
});
test("wrangler references a separate worker and no committed secrets", () => {
  assert.match(config, /wildscatter-vip-bot/);
  assert.doesNotMatch(config, /TELEGRAM_BOT_TOKEN\s*=/);
});
