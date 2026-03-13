import Header from "@/components/casino/Header";
import Footer from "@/components/casino/Footer";
import SEOHead from "@/components/SEOHead";

const PrivacyPolicy = () => (
  <div className="min-h-screen bg-background">
    <SEOHead
      title="Privacy Policy | WildScatter"
      description="WildScatter privacy policy. Learn how we collect, use, and protect your personal information on our casino review website."
      canonical="https://wildscatter.com/privacy-policy"
    />
    <Header />
    <main className="py-12 md:py-20">
      <div className="container mx-auto px-4 max-w-3xl">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">Privacy Policy</h1>
        <p className="text-sm text-muted-foreground mb-8">Last updated: March 13, 2026</p>

        <div className="space-y-6 text-sm md:text-base text-muted-foreground leading-relaxed">
          <p>
            <strong className="text-foreground">WildScatter</strong> ("we," "us," or "our") operates the website wildscatter.com. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website.
          </p>

          <h2 className="text-xl font-semibold text-foreground pt-4">Information We Collect</h2>
          <p>We may collect the following types of information:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong className="text-foreground">Personal Data:</strong> Email address, name, and other information you voluntarily provide through our VIP offer form or account registration.</li>
            <li><strong className="text-foreground">Usage Data:</strong> Browser type, operating system, pages visited, time spent on pages, referring URLs, and other diagnostic data collected automatically.</li>
            <li><strong className="text-foreground">Cookies and Tracking:</strong> We use cookies and similar technologies to track activity on our website and improve your experience.</li>
          </ul>

          <h2 className="text-xl font-semibold text-foreground pt-4">How We Use Your Information</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>To provide and maintain our website</li>
            <li>To send you personalized casino offers (only if you opt in)</li>
            <li>To analyze website usage and improve our content</li>
            <li>To communicate with you regarding support inquiries</li>
            <li>To detect and prevent fraud or technical issues</li>
          </ul>

          <h2 className="text-xl font-semibold text-foreground pt-4">Cookies</h2>
          <p>
            We use cookies to enhance your browsing experience. Cookies are small data files stored on your device. You can instruct your browser to refuse all cookies or indicate when a cookie is being sent. However, some features of our website may not function properly without cookies.
          </p>
          <p>We use the following types of cookies:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong className="text-foreground">Essential Cookies:</strong> Required for the website to function properly.</li>
            <li><strong className="text-foreground">Analytics Cookies:</strong> Help us understand how visitors interact with our website.</li>
            <li><strong className="text-foreground">Marketing Cookies:</strong> Used to track visitors across websites for advertising purposes.</li>
          </ul>

          <h2 className="text-xl font-semibold text-foreground pt-4">Affiliate Relationships</h2>
          <p>
            WildScatter is an affiliate website. Some links on our site are affiliate links, meaning we may earn a commission if you click through and sign up at a partner casino. This does not affect our editorial independence or the accuracy of our reviews. Affiliate partnerships do not influence our rankings.
          </p>

          <h2 className="text-xl font-semibold text-foreground pt-4">Third-Party Services</h2>
          <p>
            We may employ third-party services for analytics (such as web analytics tools), email delivery, and advertising. These third parties have access to your personal data only to perform specific tasks on our behalf and are obligated not to disclose or use it for any other purpose.
          </p>

          <h2 className="text-xl font-semibold text-foreground pt-4">Data Security</h2>
          <p>
            We use commercially acceptable means to protect your personal data. However, no method of transmission over the Internet or electronic storage is 100% secure, and we cannot guarantee absolute security.
          </p>

          <h2 className="text-xl font-semibold text-foreground pt-4">Your Rights</h2>
          <p>Depending on your jurisdiction, you may have the right to:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Access the personal data we hold about you</li>
            <li>Request correction of inaccurate data</li>
            <li>Request deletion of your data</li>
            <li>Opt out of marketing communications at any time</li>
          </ul>

          <h2 className="text-xl font-semibold text-foreground pt-4">Children's Privacy</h2>
          <p>
            Our website is not intended for anyone under the age of 18. We do not knowingly collect personal data from children under 18. If you are a parent or guardian and believe your child has provided us with personal data, please contact us.
          </p>

          <h2 className="text-xl font-semibold text-foreground pt-4">Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.
          </p>

          <h2 className="text-xl font-semibold text-foreground pt-4">Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact us through our{" "}
            <a href="/support" className="text-primary underline font-medium">Support page</a>.
          </p>
        </div>
      </div>
    </main>
    <Footer />
  </div>
);

export default PrivacyPolicy;
