import Header from "@/components/casino/Header";
import Footer from "@/components/casino/Footer";
import SEOHead from "@/components/SEOHead";

const Terms = () => (
  <div className="min-h-screen bg-background">
    <SEOHead
      title="Terms & Conditions | WildScatter"
      description="WildScatter terms and conditions. Read our terms of use, affiliate disclosure, and website usage policies."
      canonical="https://wildscatter.com/terms"
    />
    <Header />
    <main className="py-12 md:py-20">
      <div className="container mx-auto px-4 max-w-3xl">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">Terms & Conditions</h1>
        <p className="text-sm text-muted-foreground mb-8">Last updated: March 13, 2026</p>

        <div className="space-y-6 text-sm md:text-base text-muted-foreground leading-relaxed">
          <p>
            Welcome to <strong className="text-foreground">WildScatter</strong>. By accessing and using this website (wildscatter.com), you agree to be bound by these Terms & Conditions. If you do not agree with any part of these terms, please do not use our website.
          </p>

          <h2 className="text-xl font-semibold text-foreground pt-4">1. Nature of Our Service</h2>
          <p>
            WildScatter is an informational and affiliate website. We provide casino reviews, bonus comparisons, and gambling-related content for educational and entertainment purposes. We do not operate any gambling services, accept bets, process payments, or manage player accounts. All gambling activity occurs on third-party platforms.
          </p>

          <h2 className="text-xl font-semibold text-foreground pt-4">2. Affiliate Disclosure</h2>
          <p>
            WildScatter participates in affiliate programs with online casino operators. This means we may earn a commission when you click on certain links on our website and subsequently register or deposit at a partner casino. This affiliate relationship is clearly disclosed and does not affect our editorial opinions, reviews, or rankings. We are committed to providing honest and unbiased information regardless of commercial partnerships.
          </p>

          <h2 className="text-xl font-semibold text-foreground pt-4">3. Age Requirement</h2>
          <p>
            You must be at least 18 years old (or the legal gambling age in your jurisdiction, whichever is higher) to use this website. By using WildScatter, you confirm that you meet this age requirement.
          </p>

          <h2 className="text-xl font-semibold text-foreground pt-4">4. No Guarantee of Accuracy</h2>
          <p>
            While we strive to provide accurate and up-to-date information, casino bonuses, terms, and availability change frequently. We cannot guarantee that all information on our website is current or error-free at all times. Always verify bonus terms directly with the casino operator before claiming any offer.
          </p>

          <h2 className="text-xl font-semibold text-foreground pt-4">5. Responsible Gambling</h2>
          <p>
            We strongly encourage all users to gamble responsibly. Gambling involves risk, and you should never wager more than you can afford to lose. If you believe you have a gambling problem, please visit our{" "}
            <a href="/responsible-gambling" className="text-primary underline font-medium">Responsible Gambling</a>{" "}
            page for support resources.
          </p>

          <h2 className="text-xl font-semibold text-foreground pt-4">6. Intellectual Property</h2>
          <p>
            All content on WildScatter, including text, graphics, logos, and design elements, is the property of WildScatter and is protected by copyright laws. You may not reproduce, distribute, or create derivative works from our content without prior written permission.
          </p>

          <h2 className="text-xl font-semibold text-foreground pt-4">7. Third-Party Links</h2>
          <p>
            Our website contains links to third-party websites (casino operators and other resources). We are not responsible for the content, privacy practices, or terms of service of these external sites. Clicking on a third-party link is at your own risk.
          </p>

          <h2 className="text-xl font-semibold text-foreground pt-4">8. Limitation of Liability</h2>
          <p>
            WildScatter shall not be held liable for any losses, damages, or negative outcomes arising from your use of information on this website or your interactions with third-party casino operators. All gambling decisions are made at your own risk.
          </p>

          <h2 className="text-xl font-semibold text-foreground pt-4">9. User Accounts</h2>
          <p>
            If you create an account on WildScatter, you are responsible for maintaining the confidentiality of your account credentials. You agree to notify us immediately of any unauthorized use of your account.
          </p>

          <h2 className="text-xl font-semibold text-foreground pt-4">10. Changes to These Terms</h2>
          <p>
            We reserve the right to modify these Terms & Conditions at any time. Changes will be effective immediately upon posting on this page. Your continued use of the website after any changes constitutes acceptance of the updated terms.
          </p>

          <h2 className="text-xl font-semibold text-foreground pt-4">Contact</h2>
          <p>
            If you have any questions about these Terms & Conditions, please reach out through our{" "}
            <a href="/support" className="text-primary underline font-medium">Support page</a>.
          </p>
        </div>
      </div>
    </main>
    <Footer />
  </div>
);

export default Terms;
