import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Gift } from "lucide-react";
import VipOfferWizard from "@/components/casino/VipOfferWizard";

const Hero = () => {
  const [claimed, setClaimed] = useState(10000);
  const [online, setOnline] = useState(70);
  const [wizardOpen, setWizardOpen] = useState(false);

  useEffect(() => {
    const claimedInterval = setInterval(() => {
      setClaimed((prev) => prev + Math.floor(Math.random() * 15) + 3);
    }, 3000);
    const onlineInterval = setInterval(() => {
      setOnline((prev) => Math.max(40, prev + Math.floor(Math.random() * 7) - 3));
    }, 5000);
    return () => {
      clearInterval(claimedInterval);
      clearInterval(onlineInterval);
    };
  }, []);

  const formatClaimed = (n: number) => {
    if (n >= 1000) return `$${(n / 1000).toFixed(1)}K`;
    return `$${n}`;
  };

  return (
    <>
      <section className="relative overflow-hidden py-8 md:py-10">
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-secondary/15 via-transparent to-secondary/10" />

        <div className="w-full px-6 md:px-12 lg:px-20 relative z-10">
          {/* Desktop: horizontal layout */}
          <div className="hidden md:flex items-center justify-between gap-8">
            <div className="flex-1">
              <h1 className="text-4xl lg:text-5xl xl:text-6xl font-extrabold tracking-tight leading-tight">
                <span className="text-primary italic">Helping players find</span><br />
                <span className="text-foreground">platforms they can trust</span>
              </h1>
              <p className="text-muted-foreground text-sm mt-2">
                Expert-picked casinos, verified bonuses &amp; transparent reviews.
              </p>
            </div>

            <div className="flex flex-col items-center gap-3">
              <Button
                size="lg"
                className="glow-pulse-btn bg-gradient-to-r from-primary to-gold-dim text-primary-foreground font-bold text-base px-10 py-6 rounded-xl hover:opacity-90 transition-opacity"
                asChild
              >
                <a href="#top-casinos">Explore Top Casinos</a>
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => setWizardOpen(true)}
                className="border-primary/30 text-primary hover:bg-primary/10 hover:text-primary font-semibold text-sm px-8 py-5 rounded-xl transition-all"
              >
                <Gift className="h-4 w-4 mr-2" />
                Get Personalized Offers
              </Button>
            </div>

            <div className="flex items-center gap-8">
              <div className="text-center">
                <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Claimed Today</p>
                <p className="text-3xl font-extrabold text-primary italic">{formatClaimed(claimed)}</p>
              </div>
              <div className="w-px h-10 bg-border" />
              <div className="text-center">
                <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Online Now</p>
                <p className="text-3xl font-extrabold text-primary italic">{online}</p>
              </div>
            </div>
          </div>

          {/* Mobile: stacked but compact */}
          <div className="md:hidden flex flex-col items-center text-center gap-3">
            <h1 className="text-2xl font-extrabold tracking-tight leading-tight">
              <span className="text-primary italic">Helping players find</span>{" "}
              <span className="text-foreground">platforms they can trust</span>
            </h1>
            <p className="text-muted-foreground text-xs">
              Expert-picked casinos, verified bonuses &amp; transparent reviews.
            </p>
            <Button
              className="glow-pulse-btn bg-gradient-to-r from-primary to-gold-dim text-primary-foreground font-bold text-sm px-6 rounded-lg hover:opacity-90"
              asChild
            >
              <a href="#top-casinos">Explore Top Casinos</a>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setWizardOpen(true)}
              className="border-primary/30 text-primary hover:bg-primary/10 hover:text-primary font-semibold text-xs px-5 rounded-lg transition-all"
            >
              <Gift className="h-3.5 w-3.5 mr-1.5" />
              Get Personalized Offers
            </Button>
            <div className="flex items-center gap-6 mt-1">
              <div className="text-center">
                <p className="text-[9px] uppercase tracking-[0.2em] text-muted-foreground">Claimed Today</p>
                <p className="text-xl font-extrabold text-primary italic">{formatClaimed(claimed)}</p>
              </div>
              <div className="w-px h-8 bg-border" />
              <div className="text-center">
                <p className="text-[9px] uppercase tracking-[0.2em] text-muted-foreground">Online Now</p>
                <p className="text-xl font-extrabold text-primary italic">{online}</p>
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
