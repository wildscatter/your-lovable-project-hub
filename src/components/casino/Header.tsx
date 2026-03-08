import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, Send, MessageCircle, LogIn, LogOut, Zap, User } from "lucide-react";
import MiniWheel from "@/components/casino/MiniWheel";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { useChatbot } from "@/hooks/use-chatbot";
import { useAuth } from "@/contexts/AuthContext";

const navLinks = [
  { label: "Top Casinos", href: "#top-casinos" },
  { label: "How We Rate", href: "#how-we-rate" },
  { label: "Blog", href: "/blog" },
  { label: "FAQ", href: "#faq" },
];

const Header = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { setIsOpen: openChat } = useChatbot();
  const { user, signOut } = useAuth();

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
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-2xl">
      {/* Top accent line */}
      <div className="h-[1px] bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
      
      <div className="container mx-auto flex h-16 sm:h-[68px] items-center justify-between px-4 sm:px-6">
        {/* Logo */}
        <button
          onClick={() => {
            if (window.location.pathname === "/") window.scrollTo({ top: 0, behavior: "smooth" });
            else navigate("/");
          }}
          className="group flex items-center gap-2.5 bg-transparent border-none cursor-pointer min-h-[44px]"
        >
          <span className="text-xl sm:text-2xl font-extrabold tracking-tight italic">
            <span className="text-primary">Wild</span>
            <span className="text-foreground">Scatter</span>
          </span>
        </button>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-2">
          {/* Spin wheel mini icon */}
          <button
            onClick={() => navigate("/spin")}
            className="relative group inline-flex items-center justify-center h-10 w-10 rounded-xl bg-primary/5 border border-primary/20 hover:bg-primary/15 hover:border-primary/35 transition-all duration-300 cursor-pointer min-h-[40px]"
            aria-label="Spin & Win"
            title="Spin & Win"
          >
            <MiniWheel />
            <span className="absolute -top-2 -right-3 bg-accent text-[7px] font-extrabold text-accent-foreground px-1.5 py-[1px] rounded-full uppercase tracking-wide animate-pulse shadow-sm shadow-accent/30">new</span>
          </button>

          <nav className="flex items-center bg-secondary/30 rounded-xl px-1.5 py-1 border border-border/30">
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => handleNavClick(link.href)}
                className="relative text-sm font-medium text-muted-foreground hover:text-foreground px-4 py-2 rounded-lg hover:bg-secondary/60 transition-all duration-200 bg-transparent border-none cursor-pointer min-h-[36px]"
              >
                {link.label}
              </button>
            ))}
          </nav>

          <div className="w-px h-8 bg-border/40 mx-2" />

          <button
            onClick={() => openChat(true)}
            className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary to-gold-dim text-primary-foreground font-bold text-sm px-5 py-2.5 transition-all duration-300 shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 hover:scale-[1.02] min-h-[44px] active:scale-[0.98]"
          >
            <div className="relative">
              <MessageCircle className="h-4 w-4" />
              <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-accent animate-pulse" />
            </div>
            Support 24/7
          </button>

          {/* Auth */}
          {user ? (
            <div className="flex items-center gap-2 ml-1">
              <div className="flex items-center gap-2 bg-secondary/30 rounded-xl px-3 py-2 border border-border/30">
                <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                  <User className="h-3.5 w-3.5 text-primary" />
                </div>
                <span className="text-xs text-muted-foreground truncate max-w-[100px]">
                  {user.email}
                </span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={signOut}
                className="text-muted-foreground hover:text-accent hover:bg-accent/10 rounded-xl h-10 w-10 min-h-[40px] transition-all duration-200"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("/auth")}
              className="ml-1 border-primary/25 text-foreground hover:bg-primary/10 hover:border-primary/40 hover:text-primary font-semibold min-h-[44px] rounded-xl px-5 transition-all duration-300 group"
            >
              <LogIn className="h-4 w-4 mr-1.5 group-hover:translate-x-0.5 transition-transform" />
              Sign In
            </Button>
          )}
        </div>

        {/* Mobile */}
        <div className="flex md:hidden items-center gap-2">
          {/* Mobile spin icon */}
          <button
            onClick={() => navigate("/spin")}
            className="relative inline-flex items-center justify-center h-10 w-10 rounded-xl bg-primary/5 border border-primary/20 active:scale-95 transition-all duration-200 cursor-pointer min-h-[40px]"
            aria-label="Spin & Win"
          >
            <MiniWheel />
            <span className="absolute -top-2 -right-3 bg-accent text-[7px] font-extrabold text-accent-foreground px-1.5 py-[1px] rounded-full uppercase tracking-wide animate-pulse shadow-sm shadow-accent/30">new</span>
          </button>
          <button
            onClick={() => openChat(true)}
            className="relative inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-primary to-gold-dim text-primary-foreground font-bold text-xs px-4 py-2.5 transition-all duration-300 min-h-[40px] active:scale-95 shadow-md shadow-primary/20"
            aria-label="Support Chat"
          >
            <MessageCircle className="h-4 w-4" />
            <span className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-accent animate-pulse border-2 border-background" />
          </button>
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-foreground h-11 w-11 min-h-[44px] min-w-[44px] rounded-xl hover:bg-secondary/40">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-background/95 backdrop-blur-2xl border-border/50 w-[85vw] max-w-[320px] p-0">
              <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
              <div className="flex flex-col h-full">
                {/* Mobile menu header */}
                <div className="px-5 pt-6 pb-5 border-b border-border/30">
                  <div className="flex items-center gap-2.5">
                    <span className="text-lg font-extrabold italic">
                      <span className="text-primary">Wild</span>
                      <span className="text-foreground">Scatter</span>
                    </span>
                  </div>
                  {user && (
                    <div className="mt-4 flex items-center gap-2.5 bg-secondary/20 rounded-xl px-3 py-2.5 border border-border/20">
                      <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                        <User className="h-4 w-4 text-primary" />
                      </div>
                      <span className="text-xs text-muted-foreground truncate">{user.email}</span>
                    </div>
                  )}
                </div>

                {/* Navigation */}
                <nav className="flex flex-col gap-0.5 px-3 py-3 flex-1">
                  {navLinks.map((link) => (
                    <button
                      key={link.href}
                      onClick={() => { handleNavClick(link.href); setOpen(false); }}
                      className="text-base font-medium text-foreground hover:text-primary active:bg-primary/5 transition-all bg-transparent border-none cursor-pointer text-left py-3.5 px-4 rounded-xl min-h-[48px] hover:translate-x-1 duration-200"
                    >
                      {link.label}
                    </button>
                  ))}

                  <div className="h-px bg-border/20 my-2 mx-4" />

                  <button
                    onClick={() => { openChat(true); setOpen(false); }}
                    className="text-base font-bold text-primary hover:text-primary/80 active:bg-primary/5 transition-all bg-transparent border-none cursor-pointer text-left py-3.5 px-4 rounded-xl min-h-[48px] flex items-center gap-2.5 hover:translate-x-1 duration-200"
                  >
                    <MessageCircle className="h-5 w-5" />
                    Support 24/7
                  </button>

                  {user ? (
                    <button
                      onClick={() => { signOut(); setOpen(false); }}
                      className="text-base font-medium text-muted-foreground hover:text-accent active:bg-accent/5 transition-all bg-transparent border-none cursor-pointer text-left py-3.5 px-4 rounded-xl min-h-[48px] flex items-center gap-2.5 hover:translate-x-1 duration-200"
                    >
                      <LogOut className="h-5 w-5" />
                      Sign Out
                    </button>
                  ) : (
                    <button
                      onClick={() => { navigate("/auth"); setOpen(false); }}
                      className="text-base font-bold bg-gradient-to-r from-primary/10 to-transparent text-primary hover:from-primary/15 transition-all border-none cursor-pointer text-left py-3.5 px-4 rounded-xl min-h-[48px] flex items-center gap-2.5 hover:translate-x-1 duration-200"
                    >
                      <LogIn className="h-5 w-5" />
                      Sign In / Register
                    </button>
                  )}
                </nav>

                {/* Telegram CTA */}
                <div className="px-4 pb-6 pt-2 border-t border-border/20 mt-auto">
                  <a
                    href={telegramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-3 text-base font-bold text-white hover:opacity-90 active:scale-[0.98] transition-all py-4 px-4 rounded-xl min-h-[52px] shadow-lg"
                    style={{ background: "linear-gradient(135deg, #2AABEE, #229ED9)" }}
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

      {/* Bottom border glow */}
      <div className="h-px bg-gradient-to-r from-transparent via-primary/15 to-transparent" />
    </header>
  );
};

export default Header;
