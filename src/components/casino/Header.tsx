import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";

const navLinks = [
  { label: "Top Casinos", href: "#top-casinos" },
  { label: "How We Rate", href: "#how-we-rate" },
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
    <header className="sticky top-0 z-50 border-b border-primary/10 bg-background/90 backdrop-blur-xl">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <button onClick={() => navigate("/")} className="group flex items-center gap-2 bg-transparent border-none cursor-pointer">
          <span className="text-2xl">🎰</span>
          <span className="text-2xl font-extrabold tracking-tight italic">
            <span className="text-primary">Wild</span>
            <span className="text-foreground">Scatter</span>
          </span>
        </button>

        <div className="hidden md:flex items-center gap-8">
          <nav className="flex items-center gap-8">
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => handleNavClick(link.href)}
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors duration-200 bg-transparent border-none cursor-pointer"
              >
                {link.label}
              </button>
            ))}
          </nav>

          <a
            href={telegramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 hover:bg-primary/20 transition-colors"
            aria-label="Join our Telegram"
          >
            <img
              src="https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/telegram.svg"
              alt="Telegram"
              className="w-5 h-5"
              style={{filter: 'brightness(0) saturate(100%) invert(62%) sepia(98%) saturate(1604%) hue-rotate(360deg) brightness(102%) contrast(101%)'}}
            />
          </a>
        </div>

        <div className="flex md:hidden items-center gap-2">
          <a
            href={telegramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 hover:bg-primary/20 transition-colors"
            aria-label="Join our Telegram"
          >
            <img
              src="https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/telegram.svg"
              alt="Telegram"
              className="w-5 h-5"
              style={{filter: 'brightness(0) saturate(100%) invert(62%) sepia(98%) saturate(1604%) hue-rotate(360deg) brightness(102%) contrast(101%)'}}
            />
          </a>
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-foreground">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-background border-border">
              <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
              <nav className="flex flex-col gap-6 mt-8">
                {navLinks.map((link) => (
                  <button
                    key={link.href}
                    onClick={() => { handleNavClick(link.href); setOpen(false); }}
                    className="text-lg font-medium text-foreground hover:text-primary transition-colors bg-transparent border-none cursor-pointer text-left"
                  >
                    {link.label}
                  </button>
                ))}
                <a
                  href={telegramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-lg font-medium text-foreground hover:text-primary transition-colors"
                  onClick={() => setOpen(false)}
                >
                  <img
                    src="https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/telegram.svg"
                    alt="Telegram"
                    className="w-5 h-5"
                    style={{filter: 'brightness(0) saturate(100%) invert(62%) sepia(98%) saturate(1604%) hue-rotate(360deg) brightness(102%) contrast(101%)'}}
                  />
                  Join Telegram
                </a>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;
