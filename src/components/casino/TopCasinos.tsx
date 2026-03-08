import { Star, Crown, Sparkles, Trophy, Zap, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import useEmblaCarousel from "embla-carousel-react";
import { useIsMobile } from "@/hooks/use-mobile";

const casinos = [
  {
    name: "Cybet.com",
    rating: 4.9,
    benefit: "200% up to $5,000 +55 Free Spins",
    tag: "Editor's Pick",
    icon: Crown,
    emoji: "👑",
    link: "https://cybetplay.com/tw4at7jqi",
    isComingSoon: false,
  },
  {
    name: "Rainbet.com",
    rating: 4.8,
    benefit: "150% up to $3,000 +100 Free Spins",
    tag: "Top Rated",
    icon: Sparkles,
    emoji: "🎰",
    link: "https://rainbet.com?r=wildscatter",
    isComingSoon: false,
  },
  {
    name: "Stake.com",
    rating: 4.7,
    benefit: "300% up to $2,000 +25 Free Spins",
    tag: "Best Games",
    icon: Trophy,
    emoji: "🃏",
    link: "https://stake.com/?c=WjpRycfh",
    isComingSoon: false,
  },
  {
    name: "BC.Game",
    rating: 4.8,
    benefit: "250% up to $2000 +5FB/100 Free Spins",
    tag: "Crypto Friendly",
    icon: Zap,
    emoji: "💎",
    link: "https://bc.game/i-4bstrjaxi-n/",
    isComingSoon: false,
  },
  {
    name: "Coming Soon",
    rating: 5.0,
    benefit: "More Bonus and Rewards!",
    tag: "New Casino",
    icon: Clock,
    emoji: "⏳",
    link: "#",
    isComingSoon: true,
  },
];

const StarRating = ({ rating }: { rating: number }) => {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  return (
    <div className="flex items-center gap-1">
      <div className="flex">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={`h-3.5 w-3.5 ${i < full ? "fill-primary text-primary" : i === full && half ? "fill-primary/50 text-primary" : "text-muted-foreground/30"}`}
          />
        ))}
      </div>
      <span className="text-sm font-bold text-foreground ml-1">{rating}</span>
    </div>
  );
};

const CasinoCard = ({ casino, index }: { casino: typeof casinos[0]; index: number }) => {
  const isFeatured = index === 0;

  return (
    <div className={`card-casino rounded-xl border bg-card p-5 flex flex-col items-center text-center gap-3 min-w-[260px] relative ${isFeatured ? "card-featured border-primary/50" : "border-border"} ${casino.isComingSoon ? "opacity-75" : ""}`}>
      <div className={`absolute top-3 left-3 text-xs font-bold px-2 py-0.5 rounded ${isFeatured ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"}`}>
        #{index + 1}
      </div>

      <div className="text-4xl mt-2">{casino.emoji}</div>
      <h3 className="text-lg font-bold text-foreground">{casino.name}</h3>
      <StarRating rating={casino.rating} />

      <p className={`text-sm font-semibold ${isFeatured ? "text-primary" : "text-foreground"}`}>
        {casino.benefit}
      </p>

      {casino.isComingSoon ? (
        <Button className="w-full mt-auto bg-muted text-muted-foreground cursor-not-allowed" disabled>
          Coming Soon
        </Button>
      ) : (
        <Button className="w-full mt-auto glow-pulse-btn bg-primary text-primary-foreground hover:bg-primary/90 font-semibold" asChild>
          <a href={casino.link} target="_blank" rel="noopener noreferrer nofollow">
            Visit Casino
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
  const [emblaRef] = useEmblaCarousel({ align: "start", containScroll: "trimSnaps" });

  return (
    <section id="top-casinos" className="py-10 md:py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-semibold text-primary mb-4">
            🔥 Today's Deals
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold mb-2">
            <span className="text-primary">Top Rated</span> Casinos
          </h2>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            Hand-picked and verified by our team of experts. More casinos coming soon — stay tuned!
          </p>
        </div>

        {isMobile ? (
          <div ref={emblaRef} className="overflow-hidden -mx-4 px-4">
            <div className="flex gap-4">
              {casinos.map((casino, i) => (
                <div key={casino.name} className="flex-[0_0_80%]">
                  <CasinoCard casino={casino} index={i} />
                </div>
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
