import { Link } from "react-router-dom";

const Footer = () => (
  <footer className="border-t border-border bg-card/50 py-10">
    <div className="container mx-auto px-4 text-center space-y-4">
      <div className="flex items-center justify-center mb-4">
        <span className="text-xl font-extrabold italic">
          <span className="text-primary">Wild</span><span className="text-foreground">Scatter</span>
        </span>
      </div>

      <nav className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
        <a href="#top-casinos" className="hover:text-primary transition-colors">Top Casinos</a>
        <a href="#bonuses" className="hover:text-primary transition-colors">Bonuses</a>
        <a href="#safe-play" className="hover:text-primary transition-colors">Safe Play</a>
        <Link to="/about" className="hover:text-primary transition-colors">About Us</Link>
        <Link to="/support" className="hover:text-primary transition-colors">Support 24/7</Link>
      </nav>

      <div className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-4 py-1.5">
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
