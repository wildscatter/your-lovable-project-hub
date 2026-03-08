import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";

const navLinks = [
  { label: "Top Casinos", href: "#top-casinos" },
  { label: "How We Rate", href: "#how-we-rate" },
  { label: "Blog", href: "/blog" },
  { label: "FAQ", href: "#faq" },
  { label: "Support 24/7", href: "/support" },
];

const Header = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleNavClick = (href: string) => {
    if (href.startsWith("#")) {
      if (window.location.pathname !== "/") {
        navigate("/" + href);
      } else {
        const el = document.querySelector(href);
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      navigate(href);
    }
  };

  const telegramUrl = "YOUR_TELEGRAM_LINK_HERE";

  return (
    <header className="sticky top-0 z-50 border-b border-primary/10 bg-background/95 backdrop-blur-xl">
      <div className="container mx-auto flex h-14 sm:h-16 items-center justify-between px-3 sm:px-4">
        {/* Logo */}
        <button onClick={() => navigate("/")} className="group flex items-center bg-transparent border-none cursor-pointer min-h-[44px]">
          <span className="text-lg sm:text-2xl font-extrabold tracking-tight italic">
            <span className="text-primary">Wild</span>
            <span className="text-foreground">Scatter</span>
          </span>
        </button>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6">
          <nav className="flex items-center gap-5 lg:gap-6">
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => handleNavClick(link.href)}
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors duration-200 bg-transparent border-none cursor-pointer py-2 min-h-[44px]"
              >
                {link.label}
              </button>
            ))}
          </nav>
          <a
            href={telegramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg bg-[hsl(200_80%_50%)] hover:bg-[hsl(200_80%_45%)] text-foreground font-semibold text-sm px-5 py-2.5 transition-all duration-200 shadow-md hover:shadow-lg hover:shadow-[hsl(200_80%_50%/0.3)] min-h-[44px]"
            aria-label="Join our Telegram"
          >
            <Send className="h-4 w-4" />
            <span>Telegram</span>
          </a>
        </div>

        {/* Mobile nav */}
        <div className="flex md:hidden items-center gap-2">
          <a
            href={telegramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg bg-[hsl(200_80%_50%)] hover:bg-[hsl(200_80%_45%)] text-foreground font-semibold text-xs px-3.5 py-2.5 transition-all duration-200 min-h-[44px] active:scale-95"
            aria-label="Join our Telegram"
          >
            <Send className="h-4 w-4" />
            <span>Telegram</span>
          </a>
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-foreground h-11 w-11 min-h-[44px] min-w-[44px]">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-background border-border w-[85vw] max-w-[320px] p-0">
              <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
              <div className="flex flex-col h-full">
                {/* Mobile menu header */}
                <div className="px-5 pt-6 pb-4 border-b border-border">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">🎰</span>
                    <span className="text-lg font-extrabold italic">
                      <span className="text-primary">Wild</span>
                      <span className="text-foreground">Scatter</span>
                    </span>
                  </div>
                </div>
                
                {/* Nav links */}
                <nav className="flex flex-col gap-1 px-3 py-4 flex-1">
                  {navLinks.map((link) => (
                    <button
                      key={link.href}
                      onClick={() => { handleNavClick(link.href); setOpen(false); }}
                      className="text-base font-medium text-foreground hover:text-primary active:bg-primary/10 transition-colors bg-transparent border-none cursor-pointer text-left py-3.5 px-4 rounded-xl min-h-[48px]"
                    >
                      {link.label}
                    </button>
                  ))}
                </nav>
                
                {/* Telegram CTA at bottom */}
                <div className="px-4 pb-6 pt-2 border-t border-border mt-auto">
                  <a
                    href={telegramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-3 text-base font-bold text-foreground bg-[hsl(200_80%_50%)] hover:bg-[hsl(200_80%_45%)] active:scale-[0.98] transition-all py-4 px-4 rounded-xl min-h-[52px]"
                    onClick={() => setOpen(false)}
                  >
                    <Send className="h-5 w-5" />
                    Join Telegram
                  </a>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;
