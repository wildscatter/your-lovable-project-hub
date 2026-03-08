import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Cookie } from "lucide-react";

const CookieConsent = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const accepted = localStorage.getItem("cookie-consent");
    if (!accepted) {
      const timer = setTimeout(() => setVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const accept = () => {
    localStorage.setItem("cookie-consent", "true");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-3 sm:p-4 animate-float-up safe-area-bottom">
      <div className="container mx-auto max-w-2xl">
        <div className="rounded-xl border border-border bg-card p-4 sm:p-5 flex flex-col sm:flex-row items-center gap-3 sm:gap-4 shadow-xl shadow-background/50">
          <Cookie className="h-6 w-6 text-primary shrink-0 hidden sm:block" />
          <p className="text-sm text-muted-foreground text-center sm:text-left flex-1 leading-relaxed">
            🍪 We use cookies to improve your experience. By continuing, you agree to our use of cookies.
          </p>
          <Button 
            onClick={accept} 
            className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold px-8 py-3 shrink-0 min-h-[44px] w-full sm:w-auto active:scale-[0.98] transition-all rounded-lg"
          >
            Accept
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;
