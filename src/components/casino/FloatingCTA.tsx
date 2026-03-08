import { Send, Gift } from "lucide-react";
import { useState } from "react";
import VipOfferWizard from "./VipOfferWizard";

const FloatingCTA = () => {
  const [vipOpen, setVipOpen] = useState(false);
  const telegramUrl = "YOUR_TELEGRAM_LINK_HERE";

  return (
    <>
      <div className="fixed bottom-6 right-4 z-50 flex flex-col items-end gap-3 sm:bottom-8 sm:right-6">
        {/* VIP Offer sticky CTA */}
        <button
          onClick={() => setVipOpen(true)}
          className="group flex items-center gap-2 rounded-full bg-primary text-primary-foreground font-bold text-sm px-5 py-3 shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 active:scale-95 transition-all duration-200 min-h-[48px] animate-fade-in"
          aria-label="Get VIP Offers"
        >
          <Gift className="h-5 w-5" />
          <span className="hidden sm:inline">VIP Offers</span>
        </button>

        {/* Floating Telegram button */}
        <a
          href={telegramUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center gap-2 rounded-full bg-accent text-accent-foreground font-bold text-sm px-5 py-3 shadow-lg shadow-accent/25 hover:shadow-xl hover:shadow-accent/30 active:scale-95 transition-all duration-200 min-h-[48px] animate-bounce-subtle"
          aria-label="Join our Telegram"
        >
          <Send className="h-5 w-5" />
          <span className="hidden sm:inline">Telegram</span>
        </a>
      </div>

      <VipOfferWizard open={vipOpen} onOpenChange={setVipOpen} />
    </>
  );
};

export default FloatingCTA;
