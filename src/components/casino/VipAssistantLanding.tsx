import { ArrowUpRight, Send, ShieldCheck, Sparkles } from "lucide-react";

const telegramUrl = (import.meta.env.VITE_TELEGRAM_URL as string | undefined) || "https://t.me/+3yyjBIiCXTJiYWY8";
const validTelegramUrl = telegramUrl && /^https:\/\/t\.me\/[A-Za-z0-9_+/-]+(?:\?.*)?$/.test(telegramUrl);

export default function VipAssistantLanding() {
  return (
    <section aria-labelledby="vip-title" className="relative isolate overflow-hidden bg-[#0c0b12] text-[#faf5ef]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_80%_40%,rgba(177,113,121,0.15),transparent_52%)]" />
      <div className="mx-auto max-w-[1500px] px-5 pb-16 pt-7 sm:px-10 lg:px-20 lg:pb-24">
        <div className="flex items-center justify-between border-b border-[#ffffff18] pb-6">
          <a href="/" aria-label="WildScatter home" className="text-sm font-bold tracking-[.22em] text-[#d8b981] sm:text-base">WILDSCATTER <span className="text-[#f8f3ec]">/ VIP</span></a>
          <a href="#top-casinos" className="text-xs font-medium uppercase tracking-[.14em] text-[#c3b6b3] hover:text-white">Explore offers <ArrowUpRight className="ml-1 inline h-3 w-3" /></a>
        </div>
        <div className="grid items-center gap-10 pt-10 lg:min-h-[690px] lg:grid-cols-[1fr_0.95fr] lg:gap-16 lg:pt-14">
          <div className="order-2 max-w-2xl lg:order-1">
            <p className="mb-5 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[.25em] text-[#d9b784]"><Sparkles className="h-4 w-4" /> Your private VIP concierge</p>
            <h1 id="vip-title" className="text-[clamp(3.25rem,6.4vw,6.7rem)] font-semibold leading-[.99] tracking-[-.065em]">Your VIP<br /><span className="text-[#d8b981]">experience</span><br />starts here.</h1>
            <p className="mt-7 max-w-[460px] text-base leading-8 text-[#bdb5b9] sm:text-lg">Discover curated offers, personal guidance, and direct VIP support. Your next step is one tap away.</p>
            {validTelegramUrl ? (
              <a className="mt-9 inline-flex min-h-16 w-full items-center justify-center gap-3 rounded-2xl bg-[#dbb779] px-8 text-sm font-bold uppercase tracking-[.06em] text-[#17121a] shadow-[0_18px_60px_rgba(219,183,121,.14)] transition hover:-translate-y-1 hover:bg-[#efcb90] sm:w-auto" href={telegramUrl} target="_blank" rel="noopener noreferrer"><Send className="h-5 w-5" /> Continue to Telegram <ArrowUpRight className="h-4 w-4" /></a>
            ) : (
              <div className="mt-9 inline-flex min-h-16 items-center rounded-2xl border border-[#dbb77955] bg-[#dbb77916] px-6 text-sm text-[#e6c796]">Telegram link will appear here once configured</div>
            )}
            <p className="mt-5 flex items-center gap-2 text-xs text-[#938993]"><ShieldCheck className="h-4 w-4" /> Private access · 18+ · Offers subject to terms</p>
          </div>
          <div className="order-1 mx-auto w-full max-w-[570px] lg:order-2">
            <div className="relative overflow-hidden rounded-[28px] border border-[#d1af7840] bg-[#42343f] shadow-[0_32px_110px_rgba(0,0,0,.4)]">
              <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1100&q=85" alt="Elegant portrait of a woman representing the VIP assistant experience" className="aspect-[4/4.4] w-full object-cover object-center sm:aspect-[4/4.2]" loading="eager" fetchPriority="high" />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0c0b12]/55 via-transparent to-transparent" />
              <div className="absolute bottom-5 left-5 rounded-full border border-white/25 bg-[#18131c]/60 px-4 py-2 text-[10px] font-semibold uppercase tracking-[.2em] text-white backdrop-blur">The VIP experience</div>
            </div>
          </div>
        </div>
        <div className="mt-12 flex flex-wrap justify-between gap-4 border-t border-[#ffffff1f] pt-6 text-[10px] uppercase tracking-[.14em] text-[#9b9199]">
          <span>Independent recommendations</span><span>Affiliate partnerships may earn commission</span>
        </div>
      </div>
    </section>
  );
}
