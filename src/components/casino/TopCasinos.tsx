import { Star, Crown, Sparkles, Trophy, Zap, Clock, Flame, Gem, Rocket, Dice5, Shuffle } from "lucide-react";
import { Button } from "@/components/ui/button";
import useEmblaCarousel from "embla-carousel-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useState, useEffect, useCallback } from "react";

const casinos = [
  {
    name: "Cybet.com",
    rating: 4.9,
    benefit: "100% up to $500 + 50 Free Spins",
    tag: "Editor's Pick",
    icon: Crown,
    brandColor: "from-amber-500 to-yellow-600",
    brandBg: "bg-amber-500/10 border-amber-500/30",
    brandText: "text-amber-400",
    link: "https://cybetplay.com/tw4at7jqi",
    isComingSoon: false,
  },
  {
    name: "Rainbet.com",
    rating: 4.8,
    benefit: "100% up to $500 + 50 Free Spins",
    tag: "Top Rated",
    icon: Sparkles,
    brandColor: "from-sky-400 to-blue-600",
    brandBg: "bg-sky-500/10 border-sky-500/30",
    brandText: "text-sky-400",
    link: "https://rainbet.com?r=wildscatter",
    isComingSoon: false,
  },
  {
    name: "Stake.com",
    rating: 4.7,
    benefit: "200% Deposit Bonus up to $2,000",
    tag: "Best Games",
    icon: Trophy,
    brandColor: "from-emerald-400 to-teal-600",
    brandBg: "bg-emerald-500/10 border-emerald-500/30",
    brandText: "text-emerald-400",
    link: "https://stake.com/?c=WjpRycfh",
    isComingSoon: false,
  },
  {
    name: "BC.Game",
    rating: 4.8,
    benefit: "120% up to $1,000 + 100 Free Spins",
    tag: "Crypto Friendly",
    icon: Gem,
    brandColor: "from-violet-400 to-purple-600",
    brandBg: "bg-violet-500/10 border-violet-500/30",
    brandText: "text-violet-400",
    link: "https://bc.game/i-4bstrjaxi-n/",
    isComingSoon: false,
  },
  {
    name: "Gamdom",
    rating: 4.7,
    benefit: "Exclusive Rewards & Rakeback",
    tag: "Fan Favorite",
    icon: Flame,
    brandColor: "from-red-500 to-orange-600",
    brandBg: "bg-red-500/10 border-red-500/30",
    brandText: "text-red-400",
    link: "https://gamdom.com/r/wildscatter",
    isComingSoon: false,
  },
  {
    name: "Cloudbet",
    rating: 4.6,
    benefit: "Welcome Bitcoin Bonus",
    tag: "Crypto Pioneer",
    icon: Rocket,
    brandColor: "from-cyan-400 to-blue-600",
    brandBg: "bg-cyan-500/10 border-cyan-500/30",
    brandText: "text-cyan-400",
    link: "https://cldbt.cloud/go/en/landing/bitcoin-bonus?af_token=070f0f8350c7479897d208fe7a497973&aftm_campaign=Welcome+Bonus+2026&aftm_medium=social",
    isComingSoon: false,
  },
  {
    name: "Betfury",
    rating: 4.6,
    benefit: "BFG Staking & Daily Bonuses",
    tag: "Staking Rewards",
    icon: Dice5,
    brandColor: "from-orange-400 to-red-600",
    brandBg: "bg-orange-500/10 border-orange-500/30",
    brandText: "text-orange-400",
    link: "https://betfury.bet/dwxys4aak",
    isComingSoon: false,
  },
  {
    name: "Shuffle",
    rating: 4.7,
    benefit: "Instant Rakeback & VIP Perks",
    tag: "Hot Pick",
    icon: Shuffle,
    brandColor: "from-pink-400 to-fuchsia-600",
    brandBg: "bg-pink-500/10 border-pink-500/30",
    brandText: "text-pink-400",
    link: "https://shuffle.com?r=hqp5hk1S42",
    isComingSoon: false,
  },
  {
    name: "Coming Soon",
    rating: 5.0,
    benefit: "More Bonus and Rewards!",
    tag: "New Casino",
    icon: Clock,
    brandColor: "from-gray-400 to-gray-600",
    brandBg: "bg-gray-500/10 border-gray-500/30",
    brandText: "text-gray-400",
    link: "#",
    isComingSoon: true,
  },
];

const StarRating = ({ rating }: { rating: number }) => {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${i < full ? "fill-accent text-accent" : i === full && half ? "fill-accent/50 text-accent" : "text-muted-foreground/30"}`}
          />
        ))}
      </div>
      <span className="text-sm font-bold text-foreground ml-0.5">{rating}</span>
    </div>
  );
};

const CasinoCard = ({ casino, index }: { casino: typeof casinos[0]; index: number }) => {
  const isFeatured = index === 0;

  return (
    <div className={`card-casino rounded-xl border bg-card p-5 sm:p-6 flex flex-col items-center text-center gap-3 min-w-0 relative ${isFeatured ? "card-featured border-primary/50" : "border-border"} ${casino.isComingSoon ? "opacity-70" : ""}`}>
      <div className={`absolute top-3 left-3 text-xs font-bold px-2.5 py-1 rounded-md ${isFeatured ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"}`}>
        #{index + 1}
      </div>

      <div className={`absolute top-3 right-3 text-[10px] font-semibold px-2 py-0.5 rounded-full ${isFeatured ? "bg-primary/15 text-primary border border-primary/30" : "bg-secondary text-muted-foreground"}`}>
        {casino.tag}
      </div>

      {/* Styled text logo badge */}
      <div className={`mt-4 w-14 h-14 sm:w-16 sm:h-16 rounded-2xl border ${casino.brandBg} flex items-center justify-center`}>
        <casino.icon className={`h-7 w-7 sm:h-8 sm:h-8 ${casino.brandText}`} />
      </div>
      <h3 className="text-lg sm:text-xl font-bold text-foreground">{casino.name}</h3>
      <StarRating rating={casino.rating} />

      <p className={`text-sm font-semibold leading-snug ${isFeatured ? "text-primary" : "text-foreground"}`}>
        {casino.benefit}
      </p>

      {casino.isComingSoon ? (
        <Button className="w-full mt-auto bg-muted text-muted-foreground cursor-not-allowed min-h-[48px] text-sm rounded-lg" disabled>
          Coming Soon
        </Button>
      ) : (
        <Button className="w-full mt-auto glow-pulse-btn bg-gradient-to-r from-primary to-gold-dim text-primary-foreground hover:opacity-90 font-bold min-h-[48px] text-sm sm:text-base rounded-lg shadow-md shadow-primary/15 active:scale-[0.98] transition-all" asChild>
          <a href={casino.link} target="_blank" rel="noopener noreferrer nofollow sponsored">
            Claim Bonus →
          </a>
        </Button>
      )}

      <p className="text-[10px] text-muted-foreground/50">
        {casino.isComingSoon ? "Launching soon!" : "We may earn a commission from partner links."}
      </p>
    </div>
  );
};

const TopCasinos = () => {
  const isMobile = useIsMobile();
  const [emblaRef, emblaApi] = useEmblaCarousel({ align: "start", containScroll: "trimSnaps" });
  const [activeIndex, setActiveIndex] = useState(0);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setActiveIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on("select", onSelect);
    onSelect();
    return () => { emblaApi.off("select", onSelect); };
  }, [emblaApi, onSelect]);

  return (
    <section id="top-casinos" className="py-10 sm:py-12 md:py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-5 py-2 text-xs font-bold uppercase tracking-widest text-primary mb-4 glow-pulse-subtle">
            <Flame className="h-4 w-4 animate-pulse text-accent" />
            <span>Today's Deals</span>
            <Flame className="h-4 w-4 animate-pulse text-accent" />
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold mb-3">
            <span className="text-primary">Top Rated</span> Casinos
          </h2>
          <p className="text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
            Hand-picked and verified by our team of experts. More casinos coming soon — stay tuned!
          </p>
        </div>

        {isMobile ? (
          <div>
            <div ref={emblaRef} className="overflow-hidden -mx-4 px-4 pt-2 -mt-2">
              <div className="flex gap-3">
                {casinos.map((casino, i) => (
                  <div key={casino.name} className="flex-[0_0_85%] min-w-0">
                    <CasinoCard casino={casino} index={i} />
                  </div>
                ))}
              </div>
            </div>
            <div className="flex items-center justify-center gap-2 mt-5">
              {casinos.map((_, i) => (
                <button
                  key={i}
                  className={`rounded-full transition-all duration-300 ${
                    i === activeIndex
                      ? "w-6 h-2 bg-primary"
                      : "w-2 h-2 bg-muted-foreground/30"
                  }`}
                  onClick={() => emblaApi?.scrollTo(i)}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 max-w-6xl mx-auto">
            {casinos.map((casino, i) => (
              <CasinoCard key={casino.name} casino={casino} index={i} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default TopCasinos;
