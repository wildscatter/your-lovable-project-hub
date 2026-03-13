import Header from "@/components/casino/Header";
import Footer from "@/components/casino/Footer";
import SEOHead from "@/components/SEOHead";
import { ShieldCheck } from "lucide-react";

const ResponsibleGambling = () => (
  <div className="min-h-screen bg-background">
    <SEOHead
      title="Responsible Gambling | WildScatter"
      description="Learn how to gamble responsibly. Find resources, self-exclusion tools, and support organizations to help maintain healthy gambling habits."
      canonical="https://wildscatter.com/responsible-gambling"
    />
    <Header />
    <main className="py-12 md:py-20">
      <div className="container mx-auto px-4 max-w-3xl">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-8">Responsible Gambling</h1>

        <div className="space-y-6 text-sm md:text-base text-muted-foreground leading-relaxed">
          <div className="rounded-xl border border-primary/20 bg-primary/5 p-5 flex items-start gap-4">
            <ShieldCheck className="h-6 w-6 text-primary shrink-0 mt-0.5" />
            <p className="text-foreground font-medium">
              Gambling should always be fun, never a source of stress or financial hardship. If it stops being enjoyable, it's time to stop.
            </p>
          </div>

          <p>
            At <strong className="text-foreground">WildScatter</strong>, we believe in promoting safe and responsible gambling. While we do not operate any gambling services ourselves, we feel a strong responsibility to provide information that helps players make informed, healthy choices.
          </p>

          <h2 className="text-xl font-semibold text-foreground pt-4">Know the Signs</h2>
          <p>Problem gambling can affect anyone. Watch for these warning signs:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Spending more money or time gambling than you can afford</li>
            <li>Chasing losses by increasing bets after losing</li>
            <li>Neglecting work, family, or personal responsibilities due to gambling</li>
            <li>Borrowing money or selling possessions to fund gambling</li>
            <li>Feeling anxious, irritable, or depressed when not gambling</li>
            <li>Lying to friends or family about your gambling habits</li>
          </ul>

          <h2 className="text-xl font-semibold text-foreground pt-4">Tips for Staying in Control</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Set a strict budget before you start and never exceed it</li>
            <li>Set time limits for your gambling sessions</li>
            <li>Never gamble with money you need for bills, rent, or essentials</li>
            <li>Take regular breaks and don't gamble when tired or upset</li>
            <li>Use deposit limits and self-exclusion tools offered by casinos</li>
            <li>Never chase your losses — accept them as part of the experience</li>
          </ul>

          <h2 className="text-xl font-semibold text-foreground pt-4">Self-Exclusion Tools</h2>
          <p>
            Most reputable online casinos offer built-in responsible gambling tools including deposit limits, loss limits, session time limits, cooling-off periods, and self-exclusion options. We encourage all players to use these features proactively.
          </p>

          <h2 className="text-xl font-semibold text-foreground pt-4">Get Help</h2>
          <p>
            If you or someone you know is struggling with gambling, please reach out to one of these organizations for free, confidential support:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <a href="https://www.gamcare.org.uk" target="_blank" rel="noopener noreferrer" className="text-primary underline font-medium">
                GamCare
              </a>{" "}
              — Free advice, support, and counselling for problem gamblers in the UK
            </li>
            <li>
              <a href="https://www.begambleaware.org" target="_blank" rel="noopener noreferrer" className="text-primary underline font-medium">
                BeGambleAware
              </a>{" "}
              — Independent charity providing information and support
            </li>
            <li>
              <a href="https://www.gamblersanonymous.org" target="_blank" rel="noopener noreferrer" className="text-primary underline font-medium">
                Gamblers Anonymous
              </a>{" "}
              — A fellowship of people who share their experience to help each other
            </li>
            <li>
              <a href="https://www.ncpgambling.org" target="_blank" rel="noopener noreferrer" className="text-primary underline font-medium">
                National Council on Problem Gambling (US)
              </a>{" "}
              — Helpline: 1-800-522-4700
            </li>
          </ul>

          <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-5 text-center mt-8">
            <p className="text-sm font-bold text-foreground mb-1">18+ Only</p>
            <p className="text-xs text-muted-foreground">
              Gambling is only for adults aged 18 and over. Please gamble responsibly and only on platforms that are legal in your jurisdiction.
            </p>
          </div>
        </div>
      </div>
    </main>
    <Footer />
  </div>
);

export default ResponsibleGambling;
