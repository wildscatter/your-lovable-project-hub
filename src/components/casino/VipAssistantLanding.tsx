import { telegramUrl } from "@/lib/telegram";
import { Menu, Send } from "lucide-react";


export default function VipAssistantLanding() {
  return (
    <div className="min-h-screen overflow-hidden bg-[#120e1b] font-sans text-white selection:bg-[#ddfb4d] selection:text-[#15101d]">
      <header className="relative z-20 mx-auto flex max-w-6xl items-center justify-between border-b border-white/15 px-5 py-3 sm:px-10 sm:py-6">
        <a href="/" aria-label="WildScatter VIP homepage" className="flex items-center gap-3">
          <span aria-hidden="true" className="text-[38px] leading-none text-[#e0ff50] drop-shadow-[0_0_15px_rgba(221,255,75,.55)]">✦</span>
          <span className="text-2xl font-black uppercase tracking-[-.055em] sm:text-3xl">WildScatter <span className="text-[#e5bd75]">VIP</span></span>
        </a>
        <a href="#vip-bonuses" aria-label="Go to VIP bonuses" className="flex h-10 w-10 items-center justify-center rounded-full border border-white/30 bg-gradient-to-br from-white/25 to-[#392549] sm:h-12 sm:w-12 shadow-[inset_0_1px_10px_rgba(255,255,255,.1)] transition hover:bg-white/20"><Menu size={23}/></a>
      </header>

      <main className="relative isolate">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 opacity-60" style={{backgroundImage:"linear-gradient(rgba(255,255,255,.075) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.075) 1px,transparent 1px)",backgroundSize:"clamp(32px, 7.7vw, 72px) clamp(32px, 7.7vw, 72px)",maskImage:"linear-gradient(to bottom,black,transparent 80%)"}}/>
        <div aria-hidden="true" className="pointer-events-none absolute left-[-20%] top-[45%] -z-10 h-[650px] w-[700px] rounded-full bg-[#c9a94b]/15 blur-[130px]"/>
        <div aria-hidden="true" className="pointer-events-none absolute right-[-25%] top-[5%] -z-10 h-[600px] w-[700px] rounded-full bg-[#57215d]/20 blur-[120px]"/>

        <section aria-labelledby="vip-title" className="mx-auto flex max-w-6xl flex-col items-center px-5 pb-14 pt-5 text-center sm:px-10 sm:pb-24 sm:pt-12">
          <div className="flex flex-col items-center">
            <div className="relative aspect-square w-[min(68vw,32svh,240px)] rounded-full border-2 border-[#e1fb50] bg-[#24202d] shadow-[0_0_35px_rgba(222,255,70,.09)] sm:w-[min(46vw,400px)]">
              <div className="absolute inset-[5%] rounded-full bg-gradient-to-b from-[#50495a] to-[#27212e]" aria-hidden="true" />
              <img
                src="/images/vip-assistant-full.webp"
                alt="Portrait of the WildScatter VIP assistant"
                width={720}
                height={1280}
                className="absolute inset-0 m-auto h-[82%] w-auto object-contain"
                loading="eager"
                decoding="async"
              />
            </div>
            <div className="mt-2 flex items-center gap-2 rounded-full bg-[#223a30] px-3 py-1 text-[10px] font-extrabold tracking-[.12em] text-[#a8f3bb] sm:mt-3 sm:text-xs">
              <span className="h-2 w-2 rounded-full bg-[#71e79a] shadow-[0_0_10px_#71e79a]" /> ONLINE NOW
            </div>
          </div>

          <h1 id="vip-title" className="mt-3 text-[clamp(1.6rem,7.2vw,5.5rem)] font-black uppercase leading-none tracking-[-.055em] sm:mt-6">
            YOUR <span className="bg-gradient-to-b from-[#f5d38b] to-[#dba75e] bg-clip-text text-transparent">VIP</span> MANAGER
          </h1>
          <p className="mt-2 text-sm text-[#bcb7c3] sm:mt-4 sm:text-2xl">I'll help you become a VIP user.</p>

          <div id="vip-bonuses" className="relative mt-6 w-full max-w-[700px] rounded-2xl bg-gradient-to-r from-[#e5ba72] via-[#e6c47c] to-[#dcff4e] p-[3px] sm:mt-10 sm:rounded-[24px] sm:p-[4px]">
            <div className="relative rounded-[13px] bg-[#302a36] px-3 pb-7 pt-4 sm:rounded-[20px] sm:px-8 sm:pb-12 sm:pt-8">
              <span aria-hidden="true" className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#120e1b] px-2 text-2xl leading-none text-[#edc57f] sm:-top-6 sm:text-4xl">✦</span>
              <h2 className="text-[clamp(1.6rem,7vw,4.5rem)] font-black uppercase leading-none tracking-[-.045em]">VIP <span className="text-[#e1fb50]">BONUSES</span></h2>
              <p className="mt-1.5 text-xs text-[#c3bcc6] sm:mt-3 sm:text-xl">Exclusive rewards &amp; personal offers</p>
            </div>
            <a
              href={telegramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="relative mx-auto -mb-4 -mt-5 flex min-h-12 w-fit max-w-[calc(100%-1rem)] items-center justify-center gap-2 rounded-xl bg-[#279bd0] px-4 py-2 text-sm font-black text-white shadow-[0_15px_30px_rgba(0,0,0,.35)] transition hover:bg-[#168ec5] focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-[#e1fb50] sm:-mb-6 sm:-mt-8 sm:min-h-[72px] sm:gap-4 sm:px-8 sm:text-2xl"
            >
              <Send size={24} fill="white" strokeWidth={1.6} className="shrink-0" /> CHAT ON TELEGRAM
            </a>
          </div>
          <p className="mt-9 text-xs uppercase tracking-[.16em] text-[#96909e] sm:mt-14 sm:text-sm">PRIVATE <span className="mx-2">•</span> FAST <span className="mx-2">•</span> EXCLUSIVE</p>
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
