import { ArrowDownRight, ArrowUpRight, Check, Send, Sparkles, Zap } from "lucide-react";

const telegramUrl = (import.meta.env.VITE_TELEGRAM_URL as string | undefined) || "https://t.me/+3yyjBIiCXTJiYWY8";

const features = [
  { number: "01", title: "Curated VIP deals", detail: "A handpicked selection of partner promotions." },
  { number: "02", title: "Personal VIP guidance", detail: "Get help exploring what is available." },
  { number: "03", title: "One-tap direct access", detail: "Connect with our Telegram community." },
];

export default function VipAssistantLanding() {
  return (
    <div className="min-h-screen overflow-hidden bg-[#090C0A] text-[#F8FAF4] selection:bg-[#C7FF31] selection:text-[#11190B]">
      <header className="mx-auto flex max-w-[1500px] items-center justify-between border-b border-white/10 px-5 py-6 sm:px-10 lg:px-20">
        <a href="/" aria-label="WildScatter homepage" className="text-base font-black uppercase tracking-[-.03em] sm:text-xl">WILD<span className="text-[#C7FF31]">SCATTER</span><span className="ml-2 align-middle text-[10px] font-bold tracking-[.16em] text-[#9CA99B]">VIP</span></a>
        <a href="#vip-bonuses" className="flex items-center gap-1 text-[11px] font-black uppercase tracking-[.12em] text-[#D7DDD2] transition hover:text-[#C7FF31]">Explore bonuses <ArrowDownRight size={15} /></a>
      </header>

      <main>
        <section aria-labelledby="vip-title" className="relative mx-auto grid max-w-[1500px] items-center gap-16 px-5 pb-24 pt-16 sm:px-10 lg:min-h-[720px] lg:grid-cols-[1.12fr_.88fr] lg:gap-10 lg:px-20 lg:pb-28 lg:pt-20">
          <div aria-hidden="true" className="pointer-events-none absolute -left-[360px] -top-[300px] h-[650px] w-[650px] rounded-full bg-[#C7FF31]/[.055] blur-[100px]" />
          <div className="order-2 relative z-10 lg:order-1">
            <p className="mb-7 inline-flex items-center gap-3 rounded-full border border-[#C7FF31]/30 bg-[#C7FF31]/10 px-4 py-2 text-[10px] font-black uppercase tracking-[.17em] text-[#C7FF31]"><Sparkles size={14} /> Your private VIP assistant</p>
            <h1 id="vip-title" className="max-w-[760px] text-[clamp(3.35rem,7.4vw,7.6rem)] font-black uppercase leading-[.9] tracking-[-.075em]">LEVEL UP<br /><span className="text-[#C7FF31]">YOUR VIP</span><br />EXPERIENCE<span className="text-[#C7FF31]">.</span></h1>
            <p className="mt-8 max-w-[510px] text-[15px] leading-8 text-[#ABB4A8] sm:text-lg">Discover exclusive VIP bonuses and tailored recommendations. Your next opportunity is only a message away.</p>
            <div className="mt-9 flex flex-col gap-4 sm:flex-row sm:items-center">
              <a href={telegramUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-[62px] w-full items-center justify-center gap-3 rounded-2xl bg-[#229ED9] px-7 text-sm font-extrabold uppercase tracking-[.04em] text-white shadow-[0_16px_46px_rgba(34,158,217,.2)] transition hover:-translate-y-1 hover:bg-[#2AABEE] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#2AABEE] sm:w-auto"><Send size={20} /> Go to Telegram <ArrowUpRight size={17} /></a>
              <a href="#vip-bonuses" className="inline-flex min-h-12 items-center justify-center gap-2 text-sm font-bold text-[#C7FF31] hover:text-white">Explore VIP bonuses <ArrowDownRight size={17} /></a>
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-[10px] font-bold uppercase tracking-[.13em] text-[#929D8D]"><span className="inline-flex items-center gap-2"><Check size={14} className="text-[#C7FF31]" /> Direct access</span><span className="inline-flex items-center gap-2"><Check size={14} className="text-[#C7FF31]" /> Private community</span><span>18+ only</span></div>
          </div>
          <div className="order-1 mx-auto w-full max-w-[500px] lg:order-2">
            <div className="relative mx-auto aspect-square w-[min(78vw,455px)] max-w-full">
              <div className="absolute -inset-3 rounded-full border border-[#C7FF31]/25" aria-hidden="true" />
              <div className="absolute inset-0 rounded-full bg-[conic-gradient(from_20deg,#C7FF31,#3B573D,#1B241D,#C7FF31)] p-[3px] shadow-[0_0_90px_rgba(199,255,49,.075)]">
                <div className="flex h-full w-full flex-col items-center justify-center rounded-full bg-[#18211A] text-center">
                  {/* Empty image placeholder. Replace this content with an image when ready. */}
                  <span className="flex h-16 w-16 items-center justify-center rounded-full border border-[#C7FF31]/30 text-4xl font-light text-[#C7FF31]/70" aria-hidden="true">+</span>
                  <span className="mt-5 text-xs font-bold uppercase tracking-[.23em] text-white/70">Your photo here</span>
                  <span className="mt-2 text-xs text-[#899588]">Add an image whenever you're ready</span>
                </div>
              </div>
              <div className="absolute bottom-[-14px] left-1/2 z-20 flex -translate-x-1/2 items-center gap-2.5 whitespace-nowrap rounded-full border-[6px] border-[#090C0A] bg-[#C7FF31] px-7 py-3 text-[11px] font-black uppercase tracking-[.16em] text-[#131C0D] shadow-[0_12px_32px_rgba(199,255,49,.18)]"><span className="h-2.5 w-2.5 animate-pulse rounded-full bg-[#17320A]" /> Online now</div>
            </div>
            <p className="mt-12 text-center text-[10px] font-semibold uppercase tracking-[.2em] text-[#889487]">A direct line to your VIP experience</p>
          </div>
        </section>

        <section id="vip-bonuses" aria-labelledby="vip-bonuses-title" className="bg-[#C7FF31] px-5 py-16 text-[#11190D] sm:px-10 md:py-24 lg:px-20">
          <div className="mx-auto max-w-[1340px]">
            <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
              <div><p className="mb-5 flex items-center gap-2 text-[11px] font-black uppercase tracking-[.22em]"><Zap size={17} /> Curated for you</p><h2 id="vip-bonuses-title" className="text-[clamp(3.5rem,8.5vw,8rem)] font-black uppercase leading-[.87] tracking-[-.08em]">VIP<br />BONUSES<span className="text-[#528521]">.</span></h2></div>
              <p className="max-w-[280px] text-sm font-medium leading-7 text-[#334621]">Less searching. More clarity. Find your next VIP offer with a direct line to our Telegram community.</p>
            </div>
            <div className="grid gap-3 md:grid-cols-3">
              {features.map((feature) => <div key={feature.number} className="group flex min-h-[225px] flex-col justify-between rounded-[26px] bg-[#121A12] p-7 text-white transition duration-300 hover:-translate-y-1 hover:shadow-xl">
                <div className="flex items-start justify-between"><span className="text-xs font-black tracking-[.16em] text-[#C7FF31]">{feature.number} / VIP</span><ArrowUpRight size={20} className="text-[#C7FF31]" /></div>
                <div><h3 className="text-xl font-extrabold tracking-[-.04em] sm:text-2xl">{feature.title}</h3><p className="mt-2 text-sm leading-6 text-[#ADB8A9]">{feature.detail}</p></div>
              </div>)}
            </div>
            <div className="mt-9 flex flex-wrap items-center justify-between gap-5"><p className="max-w-[690px] text-xs leading-6 text-[#395126]">18+ · Offers and eligibility depend on partner terms · This site may earn affiliate commissions</p><a href={telegramUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-[56px] items-center gap-3 rounded-2xl bg-[#229ED9] px-7 text-sm font-extrabold uppercase tracking-[.04em] text-white transition hover:bg-[#168DC5]"><Send size={19} /> Join on Telegram <ArrowUpRight size={17} /></a></div>
          </div>
        </section>
      </main>
      <footer className="mx-auto flex max-w-[1500px] flex-wrap justify-between gap-5 px-5 py-8 text-[11px] text-[#939C90] sm:px-10 lg:px-20">
        <p>© {new Date().getFullYear()} WildScatter. 18+ only. Play responsibly.</p>
        <nav aria-label="Legal links" className="flex flex-wrap gap-5"><a href="/privacy-policy" className="hover:text-white">Privacy</a><a href="/terms" className="hover:text-white">Terms</a><a href="/responsible-gambling" className="hover:text-white">Responsible gaming</a></nav>
      </footer>
    </div>
  );
}
