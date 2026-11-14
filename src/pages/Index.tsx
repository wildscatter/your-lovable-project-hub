import VipAssistantLanding from "@/components/casino/VipAssistantLanding";
import CookieConsent from "@/components/casino/CookieConsent";
import SEOHead from "@/components/SEOHead";

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "WildScatter",
  url: "https://wildscatter.com",
  description: "VIP casino bonuses, independent recommendations and direct VIP guidance on Telegram",
};

export default function Index() {
  return (
    <div className="min-h-screen bg-[#090C0A]">
      <SEOHead
        title="WildScatter VIP Assistant — VIP Bonuses & Telegram Access"
        description="Discover curated VIP bonuses and exclusive partner offers. Connect directly with the WildScatter VIP assistant through Telegram. 18+ only."
        canonical="https://wildscatter.com/"
        jsonLd={websiteJsonLd}
      />
      <VipAssistantLanding />
      <CookieConsent />
    </div>
  );
}
