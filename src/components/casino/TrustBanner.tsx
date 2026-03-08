import { Link } from "react-router-dom";
import { Mail, ShieldCheck, Clock } from "lucide-react";

const TrustBanner = () => (
  <section className="py-12 md:py-16 border-t border-border">
    <div className="container mx-auto px-4">
      <div className="rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/10 via-background to-primary/5 p-8 md:p-10">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">We're Here For You</h2>
          <p className="text-muted-foreground text-sm max-w-md mx-auto">
            Have questions or concerns? Our team is always available to help
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-3 max-w-3xl mx-auto">
          <div className="flex flex-col items-center text-center gap-2">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <ShieldCheck className="h-6 w-6 text-primary" />
            </div>
            <span className="text-sm font-semibold text-foreground">Independent & Trusted</span>
            <span className="text-xs text-muted-foreground">Unbiased reviews since day one</span>
          </div>

          <div className="flex flex-col items-center text-center gap-2">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Clock className="h-6 w-6 text-primary" />
            </div>
            <span className="text-sm font-semibold text-foreground">24/7 Support</span>
            <span className="text-xs text-muted-foreground">Available around the clock</span>
          </div>

          <div className="flex flex-col items-center text-center gap-2">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Mail className="h-6 w-6 text-primary" />
            </div>
            <span className="text-sm font-semibold text-foreground">Contact Us</span>
            <a href="mailto:contact@wildscatter.com" className="text-xs text-primary hover:underline font-medium">
              contact@wildscatter.com
            </a>
          </div>
        </div>

        <div className="text-center mt-8">
          <Link
            to="/support"
            className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-6 py-2.5 text-sm font-semibold text-primary hover:bg-primary/20 transition-colors"
          >
            <Mail className="h-4 w-4" />
            Get In Touch
          </Link>
        </div>
      </div>
    </div>
  </section>
);

export default TrustBanner;
