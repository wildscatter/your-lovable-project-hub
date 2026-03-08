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
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4">
      <div className="container mx-auto max-w-2xl">
        <div className="rounded-xl border border-border bg-card p-4 flex flex-col sm:flex-row items-center gap-3 shadow-lg">
          <Cookie className="h-5 w-5 text-primary shrink-0" />
          <p className="text-xs text-muted-foreground text-center sm:text-left flex-1">
            We use cookies to improve your experience. By continuing, you agree to our use of cookies.
          </p>
          <Button size="sm" onClick={accept} className="bg-primary text-primary-foreground hover:bg-primary/90 text-xs px-4">
            Accept
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;
