import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Gift, ArrowDown } from "lucide-react";
import VipOfferWizard from "@/components/casino/VipOfferWizard";

const Hero = () => {
  const [wizardOpen, setWizardOpen] = useState(false);

  return (
    <>
      <section className="relative overflow-hidden py-4 sm:py-8 md:py-14 mb-0">
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-secondary/20 via-transparent to-primary/5" />
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top,hsl(var(--primary)/0.06),transparent_70%)]" />

        <div className="w-full px-4 sm:px-6 md:px-12 lg:px-20 relative z-10">
            <div className="max-w-xl mx-auto md:mx-0 text-center md:text-left mb-6">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-extrabold tracking-tight leading-[1.1]">
                <span className="text-foreground">Helping Players Discover the</span><br />
                <span className="text-primary italic">Best Online Casinos</span>
              </h1>
              <p className="text-muted-foreground text-base mt-3 leading-relaxed">
                Expert-picked casinos, verified bonuses &amp; transparent reviews.
              </p>
            </div>

          {/* Desktop */}
          <div className="hidden md:flex items-center justify-between gap-10">
            <div className="flex flex-col items-center gap-4">
              <Button
                size="lg"
                className="glow-pulse-btn bg-gradient-to-r from-primary to-gold-dim text-primary-foreground font-bold text-base px-10 py-7 rounded-xl hover:opacity-90 transition-opacity shadow-lg shadow-primary/20"
                asChild
              >
                <a href="#top-casinos" className="flex items-center gap-2">
                  Explore Top Casinos
                  <ArrowDown className="h-4 w-4 animate-bounce" />
                </a>
              </Button>
              <div className="relative">
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => setWizardOpen(true)}
                  className="border-emerald/30 text-emerald hover:bg-emerald/10 hover:text-emerald font-semibold text-sm px-8 py-5 rounded-xl transition-all min-h-[48px]"
                >
                  <Gift className="h-4 w-4 mr-2" />
                  Get Personalized Offers
                </Button>
                <span className="absolute -top-2 -right-3 bg-emerald-500 text-[7px] font-extrabold text-white px-1.5 py-[1px] rounded-full uppercase tracking-wide animate-pulse shadow-sm shadow-emerald-500/30">vip</span>
              </div>
            </div>

          </div>

          {/* Mobile */}
          <div className="md:hidden flex flex-col items-center text-center gap-2">
            <div className="flex items-center gap-2 w-full max-w-xs mt-1">
              <Button
                className="glow-pulse-btn bg-gradient-to-r from-primary to-gold-dim text-primary-foreground font-bold text-sm flex-1 py-4 rounded-xl hover:opacity-90 shadow-lg shadow-primary/20 active:scale-[0.98] transition-all min-h-[44px]"
                asChild
              >
                <a href="#top-casinos" className="flex items-center justify-center gap-1.5">
                  Top Casinos
                  <ArrowDown className="h-3.5 w-3.5 animate-bounce" />
                </a>
              </Button>
              
              <div className="relative">
                <Button
                  variant="outline"
                  onClick={() => setWizardOpen(true)}
                  className="border-emerald/30 text-emerald hover:bg-emerald/10 hover:text-emerald font-semibold text-sm py-4 px-4 rounded-xl transition-all active:scale-[0.98] min-h-[44px]"
                >
                  <Gift className="h-4 w-4 mr-1" />
                  VIP
                </Button>
                <span className="absolute -top-2 -right-2 bg-emerald-500 text-[6px] font-extrabold text-white px-1 py-[1px] rounded-full uppercase tracking-wide animate-pulse shadow-sm shadow-emerald-500/30">vip</span>
              </div>
            </div>
            
          </div>
        </div>
      </section>

      <VipOfferWizard open={wizardOpen} onOpenChange={setWizardOpen} />
    </>
  );
};

export default Hero;
