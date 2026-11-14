import { ArrowDownRight, ArrowUpRight, CheckCircle2, Gift, Send, Sparkles, Star } from "lucide-react";

const telegramUrl = (import.meta.env.VITE_TELEGRAM_URL as string | undefined) || "https://t.me/+3yyjBIiCXTJiYWY8";

const perks = [
  { icon: Gift, title: "Selected VIP offers", description: "Discover handpicked partner offers.", tone: "bg-[#31405C]" },
  { icon: Star, title: "Individual guidance", description: "Explore offers that suit your interests.", tone: "bg-[#254352]" },
  { icon: Sparkles, title: "Direct Telegram contact", description: "Reach our Telegram community in one tap.", tone: "bg-[#293C58]" },
];

export default function VipAssistantLanding() {
  return (
    <div className="min-h-screen bg-[#0B1220] text-[#F5F7FB] selection:bg-[#1B4E75]">
      <header className="mx-auto flex max-w-7xl items-center justify-between border-b border-[#253247] px-5 py-6 sm:px-8 lg:px-12">
        <a href="/" className="text-xl font-extrabold tracking-[-.05em]" aria-label="WildScatter homepage">
          wild<span className="text-[#69C6F2]">scatter</span><span className="ml-2 align-middle text-[11px] font-semibold tracking-normal text-[#9AA9C0]">VIP</span>
        </a>
        <a href="#vip-bonuses" className="flex items-center gap-1 text-xs font-bold text-[#B8C5D8] transition hover:text-[#69C6F2]">
          VIP bonuses <ArrowDownRight size={15} />
        </a>
      </header>

      <main>
        <section className="mx-auto grid max-w-7xl items-center gap-11 px-5 pb-20 pt-10 sm:px-8 md:grid-cols-[1.08fr_.92fr] md:gap-8 lg:px-12 lg:pb-24 lg:pt-20" aria-labelledby="vip-title">
          <div className="order-2 md:order-1">
            <p className="mb-6 inline-flex items-center gap-2 rounded-full bg-[#17283B] px-4 py-2 text-xs font-bold text-[#8ACFF0]"><Sparkles size={15}/> Your VIP assistant is here</p>
            <h1 id="vip-title" className="max-w-[720px] text-[clamp(3.1rem,5.7vw,5.5rem)] font-bold leading-[1.04] tracking-[-.07em]">
              Your VIP access.<br/><span className="text-[#69C6F2]">Made simple.</span>
            </h1>
            <p className="mt-6 max-w-[500px] text-base leading-8 text-[#A9B7C9] sm:text-lg">
              Discover carefully selected VIP offers and useful guidance, with one direct way to connect on Telegram.
            </p>
            <div className="mt-8 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
              <a href={telegramUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-[58px] w-full items-center justify-center gap-3 rounded-2xl bg-[#229ED9] px-7 text-sm font-bold text-white shadow-[0_12px_26px_rgba(34,158,217,.15)] transition hover:-translate-y-0.5 hover:bg-[#168FC8] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#229ED9] sm:w-auto">
                <Send size={19} /> Chat on Telegram <ArrowUpRight size={17} />
              </a>
              <a href="#vip-bonuses" className="inline-flex items-center gap-2 px-1 py-3 text-sm font-bold text-[#94D6F5] hover:text-[#FFFFFF]">See VIP bonuses <ArrowDownRight size={17}/></a>
            </div>
            <p className="mt-7 flex items-center gap-2 text-xs text-[#90A0B5]"><CheckCircle2 size={15} className="text-[#4BC7A8]"/> Easy access <span aria-hidden="true">·</span> 18+ <span aria-hidden="true">·</span> Partner terms apply</p>
          </div>
          <div className="order-1 flex flex-col items-center justify-center pb-6 pt-3 md:order-2">
            <div className="relative aspect-square w-[min(75vw,430px)]">
              <div className="absolute inset-0 rounded-full bg-[#263C53] p-[9px]">
                <div className="flex h-full w-full flex-col items-center justify-center rounded-full border-2 border-dashed border-[#607A92] bg-[#132337] text-center">
                  {/* Empty picture area. Replace with your own portrait later. */}
                  <span aria-hidden="true" className="text-5xl font-light text-[#719CB8]">+</span>
                  <span className="mt-2 text-sm font-bold text-[#B8D0E0]">Your photo</span>
                  <span className="mt-1 text-xs text-[#829AB0]">Add it later</span>
                </div>
              </div>
              <div className="absolute -bottom-5 left-1/2 z-10 flex -translate-x-1/2 items-center gap-2 whitespace-nowrap rounded-full border-[5px] border-[#0B1220] bg-[#1C423D] px-6 py-3 text-xs font-extrabold text-[#9BE8CC] shadow-sm">
                <span className="h-2.5 w-2.5 rounded-full bg-[#36B37E]" /> ONLINE NOW
              </div>
            </div>
          </div>
        </section>

        <section id="vip-bonuses" aria-labelledby="bonuses-title" className="bg-[#101C2E] px-5 py-16 sm:px-8 lg:px-12 lg:py-20">
          <div className="mx-auto max-w-7xl">
            <div className="mb-9 flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="mb-3 text-xs font-bold text-[#80C4E7]">EXCLUSIVE ACCESS</p>
                <h2 id="bonuses-title" className="text-4xl font-extrabold tracking-[-.055em] sm:text-5xl">VIP bonuses<span className="text-[#69C6F2]">.</span></h2>
              </div>
              <p className="max-w-xs text-sm leading-6 text-[#A9B7C9]">Clear information, personal guidance and one place to explore available offers.</p>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {perks.map(({ icon: Icon, title, description, tone }) => (
                <article key={title} className="rounded-[24px] border border-[#28384C] bg-[#18263A] p-6 shadow-[0_8px_25px_rgba(0,0,0,.1)] transition hover:-translate-y-1 hover:shadow-lg">
                  <div className={`mb-6 flex h-12 w-12 items-center justify-center rounded-2xl ${tone}`}><Icon size={23} className="text-[#E5F2FF]"/></div>
                  <h3 className="text-lg font-extrabold tracking-[-.025em]">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-[#B1BED0]">{description}</p>
                </article>
              ))}
            </div>
            <div className="mt-9 flex flex-wrap items-center justify-between gap-5">
              <p className="max-w-lg text-xs leading-6 text-[#9DAAC0]">18+ only. Bonuses and eligibility depend on partner terms. We may earn affiliate commissions.</p>
              <a href={telegramUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-[52px] items-center gap-2 rounded-2xl bg-[#229ED9] px-6 text-sm font-bold text-white transition hover:bg-[#168FC8]"><Send size={18}/> Join Telegram <ArrowUpRight size={16}/></a>
            </div>
          </div>
        </section>
      </main>
      <footer className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-5 py-8 text-xs text-[#8C9BB1] sm:px-8 lg:px-12">
        <span>© {new Date().getFullYear()} WildScatter · 18+ · Play responsibly.</span>
        <nav aria-label="Legal pages" className="flex flex-wrap gap-5"><a href="/privacy-policy" className="hover:text-[#69C6F2]">Privacy</a><a href="/terms" className="hover:text-[#69C6F2]">Terms</a><a href="/responsible-gambling" className="hover:text-[#69C6F2]">Responsible gaming</a></nav>
      </footer>
    </div>
  );
}
