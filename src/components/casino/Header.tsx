import { Menu, Send } from "lucide-react";
import { telegramUrl } from "@/lib/telegram";
import BrandLogo from "./BrandLogo";
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetClose } from "@/components/ui/sheet";

export default function Header() {
  return (
      <header className="relative z-20 mx-auto flex max-w-6xl items-center justify-between border-b border-white/15 bg-[#120e1b] text-white px-5 py-3 sm:px-10 sm:py-6">
        <BrandLogo />
        <Sheet>
          <SheetTrigger asChild>
            <button type="button" aria-label="Open navigation menu" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/30 bg-gradient-to-br from-white/25 to-[#392549] shadow-[inset_0_1px_10px_rgba(255,255,255,.1)] transition hover:bg-white/20 sm:h-12 sm:w-12">
              <Menu size={23} />
            </button>
          </SheetTrigger>
          <SheetContent side="right" className="border-white/15 bg-[#120e1b] text-white">
            <SheetHeader className="text-left">
              <SheetTitle className="text-white">WildScatter VIP</SheetTitle>
              <SheetDescription>Explore WildScatter and contact us.</SheetDescription>
            </SheetHeader>
            <nav aria-label="Main navigation" className="mt-8 flex flex-col gap-2">
              {[
                ["/", "Home"],
                ["/#vip-bonuses", "VIP bonuses"],
                ["/blog", "Blog"],
                ["/about", "About"],
                ["/support", "Support"],
                ["/responsible-gambling", "Responsible gambling"],
              ].map(([href, label]) => (
                <SheetClose asChild key={href}>
                  <a href={href} className="rounded-lg px-3 py-3 text-base font-semibold transition hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#e1fb50]">{label}</a>
                </SheetClose>
              ))}
              <SheetClose asChild>
                <a href={telegramUrl} target="_blank" rel="noopener noreferrer" className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-[#279bd0] px-4 py-3 font-bold text-white hover:bg-[#168ec5]">
                  <Send size={20} /> Chat on Telegram
                </a>
              </SheetClose>
            </nav>
          </SheetContent>
        </Sheet>
      </header>
  );
}
