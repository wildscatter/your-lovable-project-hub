import Header from "@/components/casino/Header";
import Hero from "@/components/casino/Hero";
import TopCasinos from "@/components/casino/TopCasinos";
import HowWeRate from "@/components/casino/HowWeRate";
import WhyTrustUs from "@/components/casino/WhyTrustUs";
import SafePlayTips from "@/components/casino/SafePlayTips";
import FAQ from "@/components/casino/FAQ";
import ResponsibleGambling from "@/components/casino/ResponsibleGambling";
import TrustBanner from "@/components/casino/TrustBanner";
import SpinWheel from "@/components/casino/SpinWheel";
import Footer from "@/components/casino/Footer";
import CookieConsent from "@/components/casino/CookieConsent";
import FloatingCTA from "@/components/casino/FloatingCTA";
import Chatbot from "@/components/casino/Chatbot";

const Index = () => (
  <div className="min-h-screen bg-background">
    <Header />
    <main>
      <Hero />
      <TopCasinos />
      <SpinWheel />
      <HowWeRate />
      <WhyTrustUs />
      <SafePlayTips />
      <FAQ />
      <TrustBanner />
      <ResponsibleGambling />
    </main>
    <Footer />
    <CookieConsent />
    <FloatingCTA />
    <Chatbot />
  </div>
);

export default Index;
