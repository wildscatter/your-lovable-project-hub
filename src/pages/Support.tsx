import Header from "@/components/casino/Header";
import Footer from "@/components/casino/Footer";
import { Mail, Clock, MessageCircle } from "lucide-react";

const Support = () => (
  <div className="min-h-screen bg-background">
    <Header />
    <main className="py-8 sm:py-12 md:py-20">
      <div className="container mx-auto px-4 max-w-3xl">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-2 sm:mb-3">Support 24/7</h1>
        <p className="text-muted-foreground text-sm sm:text-base mb-8 sm:mb-10">We're here to help around the clock. Reach out anytime.</p>

        <div className="grid gap-4 sm:gap-6 sm:grid-cols-2">
          <div className="rounded-xl border border-primary/20 bg-primary/5 p-5 sm:p-6 flex flex-col items-center text-center gap-3">
            <Mail className="h-8 w-8 text-primary" />
            <h2 className="text-base sm:text-lg font-semibold text-foreground">Email Us</h2>
            <a
              href="mailto:contact@wildscatter.com"
              className="text-primary hover:underline font-medium break-all text-sm sm:text-base min-h-[44px] flex items-center"
            >
              contact@wildscatter.com
            </a>
            <p className="text-xs text-muted-foreground">We typically respond within a few hours</p>
          </div>

          <div className="rounded-xl border border-border bg-card p-5 sm:p-6 flex flex-col items-center text-center gap-3">
            <Clock className="h-8 w-8 text-primary" />
            <h2 className="text-base sm:text-lg font-semibold text-foreground">Available 24/7</h2>
            <p className="text-sm text-muted-foreground">
              Our support team is available around the clock, 7 days a week
            </p>
          </div>
        </div>

        <div className="mt-8 sm:mt-10 rounded-xl border border-border bg-card p-5 sm:p-6">
          <div className="flex items-center gap-3 mb-3 sm:mb-4">
            <MessageCircle className="h-5 w-5 text-primary" />
            <h2 className="text-base sm:text-lg font-semibold text-foreground">How Can We Help?</h2>
          </div>
          <ul className="space-y-2.5 text-sm text-muted-foreground list-disc list-inside">
            <li>Questions about our reviews or ratings</li>
            <li>Report incorrect or outdated information</li>
            <li>Partnership and collaboration inquiries</li>
            <li>General feedback and suggestions</li>
          </ul>
          <p className="text-xs text-muted-foreground/70 mt-4 leading-relaxed">
            Note: WildScatter is an independent review site. For account, payment, or gameplay issues, please contact the respective casino platform directly.
          </p>
        </div>
      </div>
    </main>
    <Footer />
  </div>
);

export default Support;
