import { Menu, Send, Sparkles } from "lucide-react";

const telegramUrl = (import.meta.env.VITE_TELEGRAM_URL as string | undefined) || "https://t.me/+3yyjBIiCXTJiYWY8";

export default function VipAssistantLanding() {
  return (
    <div className="min-h-screen overflow-hidden bg-[#120e1b] font-sans text-white selection:bg-[#ddfb4d] selection:text-[#15101d]">
      <header className="relative z-20 mx-auto flex max-w-6xl items-center justify-between border-b border-white/10 px-6 py-6 sm:px-10">
        <a href="/" aria-label="WildScatter VIP homepage" className="flex items-center gap-3">
          <span aria-hidden="true" className="text-[38px] leading-none text-[#e0ff50] drop-shadow-[0_0_15px_rgba(221,255,75,.55)]">✦</span>
          <span className="text-2xl font-black uppercase tracking-[-.055em] sm:text-3xl">WildScatter <span className="text-[#e5bd75]">VIP</span></span>
        </a>
        <a href="#vip-bonuses" aria-label="Go to VIP bonuses" className="flex h-12 w-12 items-center justify-center rounded-full border border-white/30 bg-white/10 shadow-[inset_0_1px_10px_rgba(255,255,255,.1)] transition hover:bg-white/20"><Menu size={23}/></a>
      </header>

      <main className="relative isolate">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 opacity-60" style={{backgroundImage:"linear-gradient(rgba(255,255,255,.075) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.075) 1px,transparent 1px)",backgroundSize:"72px 72px",maskImage:"linear-gradient(to bottom,black,transparent 80%)"}}/>
        <div aria-hidden="true" className="pointer-events-none absolute left-[-20%] top-[45%] -z-10 h-[650px] w-[700px] rounded-full bg-[#c9a94b]/15 blur-[130px]"/>
        <div aria-hidden="true" className="pointer-events-none absolute right-[-25%] top-[5%] -z-10 h-[600px] w-[700px] rounded-full bg-[#57215d]/20 blur-[120px]"/>

        <section aria-labelledby="vip-title" className="mx-auto flex max-w-6xl flex-col items-center px-5 pb-24 pt-14 text-center sm:px-10 sm:pt-20">
          <div className="relative mb-12 w-[min(72vw,420px)] sm:mb-16">
            <div className="aspect-square rounded-full border-[3px] border-[#e1fb50] p-[13px] shadow-[0_0_35px_rgba(222,255,70,.09)]">
              <div className="flex h-full w-full flex-col items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-[#34303d] via-[#24202d] to-[#191521]">
                {/* Portrait placeholder: insert your own portrait when ready. */}
                <span aria-hidden="true" className="text-6xl font-extralight text-white/30">+</span>
                <span className="mt-2 text-sm font-semibold uppercase tracking-[.22em] text-white/60">Your photo</span>
              </div>
            </div>
            <div className="absolute -bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-2 whitespace-nowrap rounded-full border-[5px] border-[#120e1b] bg-[#223a30] px-5 py-2.5 text-xs font-extrabold tracking-[.12em] text-[#a8f3bb] shadow-lg">
              <span className="h-2.5 w-2.5 rounded-full bg-[#71e79a] shadow-[0_0_10px_#71e79a]"/> ONLINE NOW
            </div>
          </div>

          <h1 id="vip-title" className="text-[clamp(2.8rem,8.5vw,6.7rem)] font-black uppercase leading-[.98] tracking-[-.065em] drop-shadow-[0_3px_2px_rgba(0,0,0,.2)]">
            YOUR <span className="bg-gradient-to-b from-[#f5d38b] to-[#dba75e] bg-clip-text text-transparent">VIP</span> MANAGER
          </h1>
          <p className="mt-6 text-lg text-[#bcb7c3] sm:text-2xl">I'll help you become a VIP user.</p>

          <div id="vip-bonuses" className="relative mt-14 w-full max-w-[800px] rounded-[24px] bg-gradient-to-r from-[#e5ba72] via-[#e6c47c] to-[#dcff4e] p-[4px] sm:mt-16">
            <div className="relative rounded-[20px] bg-[#302a36]/95 px-5 pb-24 pt-9 sm:px-10 sm:pb-28 sm:pt-11">
              <span aria-hidden="true" className="absolute -top-7 left-1/2 -translate-x-1/2 bg-[#120e1b] px-4 text-5xl text-[#edc57f]">✦</span>
              <h2 className="text-[clamp(2.6rem,7vw,5rem)] font-black uppercase leading-none tracking-[-.06em]">VIP <span className="text-[#e1fb50]">BONUSES</span></h2>
              <p className="mt-3 text-base text-[#c3bcc6] sm:text-xl">Exclusive rewards &amp; personal offers</p>
              <a href={telegramUrl} target="_blank" rel="noopener noreferrer" className="absolute -bottom-7 left-1/2 flex min-h-[76px] w-[min(85%,550px)] -translate-x-1/2 items-center justify-center gap-4 rounded-[17px] bg-[#279bd0] px-4 text-base font-black uppercase tracking-[-.02em] text-white shadow-[0_15px_30px_rgba(0,0,0,.35)] transition hover:-translate-y-1 hover:bg-[#168ec5] focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-[#e1fb50] sm:text-2xl">
                <Send size={29} fill="white" strokeWidth={1.6}/> CHAT ON TELEGRAM
              </a>
            </div>
          </div>
          <p className="mt-20 text-xs uppercase tracking-[.16em] text-[#96909e] sm:text-sm">PRIVATE <span className="mx-2">•</span> FAST <span className="mx-2">•</span> EXCLUSIVE</p>
          <p className="mt-6 max-w-xl text-xs leading-6 text-[#8e8797]">18+ only. Offers are subject to partner terms and eligibility. We may earn affiliate commissions. Play responsibly.</p>
        </section>
      </main>
      <footer className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 border-t border-white/10 px-6 py-8 text-xs text-[#9991a3] sm:px-10">
        <span>© {new Date().getFullYear()} WildScatter · 18+ · Play responsibly.</span>
        <nav aria-label="Legal pages" className="flex flex-wrap gap-5">
          <a href="/privacy-policy" className="hover:text-[#e1fb50]">Privacy</a>
          <a href="/terms" className="hover:text-[#e1fb50]">Terms</a>
          <a href="/responsible-gambling" className="hover:text-[#e1fb50]">Responsible gaming</a>
        </nav>
      </footer>
    </div>
  );
}
