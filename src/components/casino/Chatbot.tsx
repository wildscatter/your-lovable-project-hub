import { useState, useRef, useEffect } from "react";
import { X, Send, MessageCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useChatbot } from "@/hooks/use-chatbot";

type Message = {
  id: string;
  role: "bot" | "user";
  text: string;
  options?: QuickOption[];
};

type QuickOption = {
  label: string;
  action: string;
};

const QUICK_OPTIONS: QuickOption[] = [
  { label: "🎰 Top Casino Bonuses", action: "bonuses" },
  { label: "🔐 How to Register", action: "register" },
  { label: "💎 VIP Offers", action: "vip" },
  { label: "📖 Blog & Guides", action: "blog" },
  { label: "❓ FAQ", action: "faq" },
  { label: "📩 Contact Us", action: "contact" },
];

const RESPONSES: Record<string, { text: string; options?: QuickOption[] }> = {
  greeting: {
    text: "Hey there! 👋 Welcome to WildScatter. I'm here to help you find the best crypto casino deals. What are you looking for?",
    options: QUICK_OPTIONS,
  },
  bonuses: {
    text: "🔥 **Here are our top picks right now:**\n\n• **Cybet** — 100% up to $500 + 50 Free Spins\n• **Rainbet** — 100% up to $500 + 50 Free Spins\n• **Stake** — 200% Deposit Bonus up to $2,000\n• **BC.Game** — 120% up to $1,000 + 100 Free Spins\n\nScroll up to the **Top Casinos** section to claim any bonus!",
    options: [
      { label: "💎 Get VIP Offers", action: "vip" },
      { label: "🔐 How to Register", action: "register" },
      { label: "⬅️ Main Menu", action: "menu" },
    ],
  },
  register: {
    text: "📝 **How to get started:**\n\n1. Pick a casino from our **Top Rated** list\n2. Click **\"Claim Bonus\"** — you'll be redirected to the casino\n3. Create your account & make your first deposit\n4. Your welcome bonus will be applied automatically!\n\n💡 All our links are official affiliate links — safe & verified.",
    options: [
      { label: "🎰 See Bonuses", action: "bonuses" },
      { label: "❓ Is it safe?", action: "safety" },
      { label: "⬅️ Main Menu", action: "menu" },
    ],
  },
  vip: {
    text: "🌟 **Want personalized VIP casino offers?**\n\nWe match your wagering profile with exclusive deals from top casinos — higher bonuses, rakeback, and VIP perks.\n\nClick the **VIP Offers** button on the right side, or scroll to the hero section and hit **\"Get Personalized Offers\"**!",
    options: [
      { label: "🎰 Current Bonuses", action: "bonuses" },
      { label: "📩 Contact Us", action: "contact" },
      { label: "⬅️ Main Menu", action: "menu" },
    ],
  },
  blog: {
    text: "📚 **Check out our latest guides:**\n\n• How to choose the best crypto casino\n• Understanding wagering requirements\n• Crypto deposit & withdrawal tips\n• Responsible gambling guide\n\nVisit our **Blog** page for all articles!",
    options: [
      { label: "📖 Go to Blog", action: "navigate:/blog" },
      { label: "🎰 Top Bonuses", action: "bonuses" },
      { label: "⬅️ Main Menu", action: "menu" },
    ],
  },
  faq: {
    text: "❓ **Frequently Asked Questions:**\n\n**Q: Is this site free?**\nA: Yes! We're a free review & affiliate site. No payments happen here.\n\n**Q: Are the bonuses real?**\nA: Yes, all bonuses are verified directly from casino partners.\n\n**Q: How do you make money?**\nA: We earn commissions when you sign up through our links — at no extra cost to you.\n\n**Q: Is crypto gambling safe?**\nA: We only list licensed, reputable casinos. Always gamble responsibly. 18+",
    options: [
      { label: "🔐 How to Register", action: "register" },
      { label: "📩 Contact Us", action: "contact" },
      { label: "⬅️ Main Menu", action: "menu" },
    ],
  },
  contact: {
    text: "📩 **Get in touch with us:**\n\n• **Telegram** — Join our channel (button on the right)\n• **Email** — Use our Support page for direct contact\n• **VIP Form** — Submit your profile for personalized offers\n\nWe typically respond within 24 hours!",
    options: [
      { label: "📧 Go to Support", action: "navigate:/support" },
      { label: "💎 VIP Offers", action: "vip" },
      { label: "⬅️ Main Menu", action: "menu" },
    ],
  },
  safety: {
    text: "🛡️ **Your safety is our priority:**\n\n• We only list **licensed & verified** casinos\n• All affiliate links are **official & transparent**\n• We never collect payment info — all transactions happen on the casino site\n• 18+ only — gamble responsibly\n\nCheck our **How We Rate** section for our review methodology.",
    options: [
      { label: "🎰 See Top Casinos", action: "bonuses" },
      { label: "⬅️ Main Menu", action: "menu" },
    ],
  },
  menu: {
    text: "Sure! What else can I help you with?",
    options: QUICK_OPTIONS,
  },
  fallback: {
    text: "I'm not sure I understand that. Here are some things I can help with:",
    options: QUICK_OPTIONS,
  },
};

const KEYWORD_MAP: Record<string, string> = {
  bonus: "bonuses", bonuses: "bonuses", offer: "bonuses", deal: "bonuses", free: "bonuses", spin: "bonuses",
  register: "register", signup: "register", "sign up": "register", start: "register", join: "register", how: "register",
  vip: "vip", exclusive: "vip", personalized: "vip", personal: "vip",
  blog: "blog", guide: "blog", article: "blog", read: "blog",
  faq: "faq", question: "faq", help: "faq",
  contact: "contact", email: "contact", support: "contact", telegram: "contact", reach: "contact",
  safe: "safety", safety: "safety", trust: "safety", legit: "safety", scam: "safety", secure: "safety",
  menu: "menu", back: "menu", home: "menu", hi: "greeting", hello: "greeting", hey: "greeting",
};

const generateId = () => Math.random().toString(36).slice(2, 10);

const Chatbot = () => {
  const { isOpen, setIsOpen } = useChatbot();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      addBotMessage("greeting");
    }
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  const addBotMessage = (key: string) => {
    setIsTyping(true);
    const response = RESPONSES[key] || RESPONSES.fallback;
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { id: generateId(), role: "bot", text: response.text, options: response.options },
      ]);
      setIsTyping(false);
    }, 600 + Math.random() * 400);
  };

  const handleOptionClick = (action: string) => {
    if (action.startsWith("navigate:")) {
      navigate(action.replace("navigate:", ""));
      setIsOpen(false);
      return;
    }
    setMessages((prev) => [
      ...prev,
      { id: generateId(), role: "user", text: QUICK_OPTIONS.find(o => o.action === action)?.label || action },
    ]);
    addBotMessage(action);
  };

  const handleSend = () => {
    const text = input.trim();
    if (!text) return;
    setInput("");
    setMessages((prev) => [...prev, { id: generateId(), role: "user", text }]);
    const lower = text.toLowerCase();
    const matchedKey = Object.entries(KEYWORD_MAP).find(([kw]) => lower.includes(kw))?.[1] || "fallback";
    addBotMessage(matchedKey);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-4 z-50 w-auto sm:w-[380px] h-[min(520px,80vh)] rounded-2xl border border-border bg-card shadow-2xl shadow-black/40 flex flex-col overflow-hidden animate-fade-in sm:bottom-6 sm:right-6">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-secondary/50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
            <MessageCircle className="h-4 w-4 text-primary" />
          </div>
          <div>
            <p className="text-sm font-bold text-foreground leading-tight">WildScatter Support</p>
            <p className="text-[10px] text-emerald font-medium flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald inline-block" />
              Online 24/7
            </p>
          </div>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded-lg hover:bg-secondary min-h-[36px] min-w-[36px] flex items-center justify-center"
          aria-label="Close chat"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-3 space-y-3 scroll-smooth">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
              msg.role === "user"
                ? "bg-primary text-primary-foreground rounded-br-md"
                : "bg-secondary text-foreground rounded-bl-md"
            }`}>
              {msg.text.split("\n").map((line, i) => (
                <p key={i} className={i > 0 ? "mt-1" : ""}>
                  {line.split(/(\*\*.*?\*\*)/).map((part, j) =>
                    part.startsWith("**") && part.endsWith("**")
                      ? <strong key={j} className="font-bold">{part.slice(2, -2)}</strong>
                      : part
                  )}
                </p>
              ))}
              {msg.options && msg.role === "bot" && (
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {msg.options.map((opt) => (
                    <button
                      key={opt.action}
                      onClick={() => handleOptionClick(opt.action)}
                      className="text-xs font-medium bg-card hover:bg-muted border border-border text-foreground rounded-lg px-3 py-1.5 transition-colors active:scale-95 min-h-[32px]"
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-secondary rounded-2xl rounded-bl-md px-4 py-3 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-muted-foreground/50 animate-bounce" style={{ animationDelay: "0ms" }} />
              <span className="w-2 h-2 rounded-full bg-muted-foreground/50 animate-bounce" style={{ animationDelay: "150ms" }} />
              <span className="w-2 h-2 rounded-full bg-muted-foreground/50 animate-bounce" style={{ animationDelay: "300ms" }} />
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="border-t border-border px-3 py-3 bg-secondary/30">
        <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex items-center gap-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 bg-card border border-border rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 min-h-[44px]"
          />
          <button
            type="submit"
            disabled={!input.trim()}
            className="bg-primary text-primary-foreground rounded-xl p-2.5 min-h-[44px] min-w-[44px] flex items-center justify-center hover:opacity-90 active:scale-95 transition-all disabled:opacity-40"
            aria-label="Send message"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chatbot;
