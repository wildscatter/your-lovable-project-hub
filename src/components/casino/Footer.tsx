import { Link } from "react-router-dom";
import { Send } from "lucide-react";

const Footer = () => (
  <footer className="border-t border-border bg-card/50 py-12">
    <div className="container mx-auto px-4 text-center space-y-6">
      <div className="flex items-center justify-center gap-2 mb-2">
        <span className="text-xl">🎰</span>
        <span className="text-xl font-extrabold italic">
          <span className="text-primary">Wild</span><span className="text-foreground">Scatter</span>
        </span>
      </div>

      <nav className="flex flex-wrap justify-center gap-x-8 gap-y-3 text-sm">
        <a href="#top-casinos" className="text-muted-foreground hover:text-primary transition-colors py-1">Top Casinos</a>
        <a href="#how-we-rate" className="text-muted-foreground hover:text-primary transition-colors py-1">How We Rate</a>
        <a href="#safe-play" className="text-muted-foreground hover:text-primary transition-colors py-1">Safe Play</a>
        <Link to="/about" className="text-muted-foreground hover:text-primary transition-colors py-1">About Us</Link>
        <Link to="/support" className="text-muted-foreground hover:text-primary transition-colors py-1">Support 24/7</Link>
      </nav>

      <div className="flex items-center justify-center gap-4">
        <a
          href="YOUR_TELEGRAM_LINK_HERE"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-lg bg-[hsl(200_80%_50%)] hover:bg-[hsl(200_80%_45%)] text-foreground font-semibold text-sm px-5 py-2.5 transition-all duration-200"
        >
          <Send className="h-4 w-4" />
          Join Telegram
        </a>
      </div>

      <div className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-5 py-2">
        <span className="text-sm font-bold text-foreground">18+</span>
        <span className="text-xs text-muted-foreground">Gamble Responsibly</span>
      </div>

      <p className="text-xs text-muted-foreground/70 max-w-lg mx-auto leading-relaxed">
        Independent affiliate review site. No real-money gambling or payments happen on this website.
        Offers are provided by third-party operators. 18+ | Gamble responsibly.
      </p>
    </div>
  </footer>
);

export default Footer;
