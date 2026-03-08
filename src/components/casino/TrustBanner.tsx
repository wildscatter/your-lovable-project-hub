import { Link } from "react-router-dom";
import { Mail, ShieldCheck, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

const TrustBanner = () => (
  <section className="py-14 md:py-20 border-t border-border">
    <div className="container mx-auto px-4">
      <div className="rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/10 via-background to-primary/5 p-8 md:p-12">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-extrabold text-foreground mb-3">We're Here For You</h2>
          <p className="text-muted-foreground text-sm max-w-md mx-auto leading-relaxed">
            Have questions or concerns? Our team is always available to help.
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-3 max-w-3xl mx-auto">
          <div className="flex flex-col items-center text-center gap-3">
            <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center">
              <ShieldCheck className="h-7 w-7 text-primary" />
            </div>
            <span className="text-sm font-bold text-foreground">Independent & Trusted</span>
            <span className="text-xs text-muted-foreground leading-relaxed">Unbiased reviews since day one</span>
          </div>

          <div className="flex flex-col items-center text-center gap-3">
            <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center">
              <Clock className="h-7 w-7 text-primary" />
            </div>
            <span className="text-sm font-bold text-foreground">24/7 Support</span>
            <span className="text-xs text-muted-foreground leading-relaxed">Available around the clock</span>
          </div>

          <div className="flex flex-col items-center text-center gap-3">
            <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center">
              <Mail className="h-7 w-7 text-primary" />
            </div>
            <span className="text-sm font-bold text-foreground">Contact Us</span>
            <a href="mailto:contact@wildscatter.com" className="text-xs text-primary hover:underline font-medium">
              contact@wildscatter.com
            </a>
          </div>
        </div>

        <div className="text-center mt-10">
          <Button asChild className="glow-pulse-subtle bg-gradient-to-r from-primary to-gold-dim text-primary-foreground font-bold px-8 py-6 rounded-xl hover:opacity-90 transition-opacity shadow-lg shadow-primary/15">
            <Link to="/support" className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Get In Touch
            </Link>
          </Button>
        </div>
      </div>
    </div>
  </section>
);

export default TrustBanner;
