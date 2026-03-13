import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Header from "@/components/casino/Header";
import Hero from "@/components/casino/Hero";
import TopCasinos from "@/components/casino/TopCasinos";
import HowWeRate from "@/components/casino/HowWeRate";
import WhyTrustUs from "@/components/casino/WhyTrustUs";
import SafePlayTips from "@/components/casino/SafePlayTips";
import FAQ from "@/components/casino/FAQ";
import ResponsibleGambling from "@/components/casino/ResponsibleGambling";
import TrustBanner from "@/components/casino/TrustBanner";
import Footer from "@/components/casino/Footer";
import CookieConsent from "@/components/casino/CookieConsent";
import FloatingCTA from "@/components/casino/FloatingCTA";
import Chatbot from "@/components/casino/Chatbot";
import SEOHead from "@/components/SEOHead";

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "WildScatter",
  "url": "https://wildscatter.com",
  "description": "Best online casino reviews, bonuses and VIP offers in 2026",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://wildscatter.com/?s={search_term_string}",
    "query-input": "required name=search_term_string"
  }
};

const Index = () => {
  const { hash } = useLocation();

  useEffect(() => {
    if (hash) {
      setTimeout(() => {
        const el = document.querySelector(hash);
        el?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  }, [hash]);

  return (
  <div className="min-h-screen bg-background">
    <SEOHead
      title="WildScatter — Best Online Casino Reviews & Exclusive Offers 2026"
      description="Expert-picked casinos, verified bonuses & transparent reviews. Find the best online casinos in 2026 with fast payouts and fair terms."
      canonical="https://wildscatter.com/"
      jsonLd={websiteJsonLd}
    />
    <Header />
    <main>
      <Hero />
      <TopCasinos />
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
};

export default Index;
