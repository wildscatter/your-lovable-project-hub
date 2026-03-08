import Header from "@/components/casino/Header";
import Footer from "@/components/casino/Footer";
import { ShieldCheck } from "lucide-react";

const AboutUs = () => (
  <div className="min-h-screen bg-background">
    <Header />
    <main className="py-12 md:py-20">
      <div className="container mx-auto px-4 max-w-3xl">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-8">About Us</h1>

        <div className="space-y-6 text-sm md:text-base text-muted-foreground leading-relaxed">
          <p>
            <span className="text-foreground font-semibold">WildScatter</span> is an independent informational and affiliate website created to help players make safer and more informed choices when selecting online casino platforms.
          </p>

          <div className="rounded-xl border border-primary/20 bg-primary/5 p-5 flex items-start gap-4">
            <ShieldCheck className="h-6 w-6 text-primary shrink-0 mt-0.5" />
            <p className="text-foreground font-medium">
              Our mission is simple: to help players find platforms they can trust
            </p>
          </div>

          <p>
            We research, review, and compare third-party casino operators based on publicly available information, user experience factors, bonus terms, and overall transparency.
          </p>

          <h2 className="text-xl font-semibold text-foreground pt-4">No Gambling Services</h2>
          <p>
            WildScatter does not operate any gambling services. We do not host games, accept deposits, process payments, handle withdrawals, or manage player accounts. All gambling activity, including registration, deposits, gameplay, and withdrawals, takes place exclusively on external third-party platforms.
          </p>

          <h2 className="text-xl font-semibold text-foreground pt-4">Affiliate Disclosure</h2>
          <p>
            Some of the links on this website are affiliate links. This means we may earn a commission if you choose to visit a partner platform through our links. This comes at no additional cost to you and helps support the maintenance and development of this website. Our editorial content and rankings are not influenced by partnerships.
          </p>

          <h2 className="text-xl font-semibold text-foreground pt-4">Our Commitment</h2>
          <p>
            We aim to present clear, unbiased information so players can better understand their options before choosing where to play. However, online gambling always involves risk, and we strongly encourage responsible play.
          </p>

          <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-5 text-center mt-8">
            <p className="text-sm font-bold text-foreground mb-1">21+ Only</p>
            <p className="text-xs text-muted-foreground">
              WildScatter is intended for users aged 21 and over only. Please gamble responsibly and only on platforms that are legal in your jurisdiction.
            </p>
          </div>
        </div>
      </div>
    </main>
    <Footer />
  </div>
);

export default AboutUs;
