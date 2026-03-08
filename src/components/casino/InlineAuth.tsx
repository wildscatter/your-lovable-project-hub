import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Lock, Eye, EyeOff, LogIn, UserPlus, ArrowLeft, Sparkles, CheckCircle, Loader2 } from "lucide-react";

type InlineAuthView = "login" | "signup" | "email-sent";

interface InlineAuthProps {
  onBack?: () => void;
}

const InlineAuth = ({ onBack }: InlineAuthProps) => {
  const [view, setView] = useState<InlineAuthView>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) return;
    setLoading(true);
    setError("");
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      // Auth state change will handle the rest via AuthContext
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) return;
    setLoading(true);
    setError("");
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: `${window.location.origin}/spin` },
      });
      if (error) throw error;
      setView("email-sent");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const isLogin = view === "login";

  if (view === "email-sent") {
    return (
      <div className="flex flex-col items-center text-center gap-4 py-2 animate-fade-in">
        <div className="relative">
          <div className="absolute -inset-3 rounded-full bg-emerald-500/10 animate-pulse" />
          <div className="h-12 w-12 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/30">
            <CheckCircle className="h-6 w-6 text-white" />
          </div>
        </div>
        <div className="space-y-1.5">
          <h3 className="text-lg font-extrabold text-foreground">Check your email</h3>
          <p className="text-sm text-muted-foreground max-w-[260px] leading-relaxed">
            We sent a confirmation link to <span className="text-foreground font-semibold">{email}</span>
          </p>
        </div>
        <div className="bg-secondary/30 border border-border/40 rounded-xl p-3 w-full max-w-[280px]">
          <p className="text-[11px] text-muted-foreground leading-relaxed">
            Click the link in the email, then come back here. Your session will activate automatically.
          </p>
        </div>
        <button
          onClick={() => { setView("login"); setError(""); }}
          className="text-xs text-primary hover:underline underline-offset-4 mt-1"
        >
          Already confirmed? Sign in
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 animate-fade-in">
      <div className="text-center space-y-1">
        <h3 className="text-lg font-extrabold text-foreground">
          {isLogin ? "Welcome back" : "Create account"}
        </h3>
        <p className="text-xs text-muted-foreground">
          {isLogin ? "Sign in to spin for real points" : "Sign up to start earning points"}
        </p>
      </div>

      <form onSubmit={isLogin ? handleLogin : handleSignup} className="space-y-3">
        <div className="space-y-1">
          <Label htmlFor="inline-email" className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
            Email
          </Label>
          <div className="relative group">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input
              id="inline-email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setError(""); }}
              className="pl-10 py-5 rounded-xl bg-background/50 border-border/50 focus:border-primary/50 transition-all"
              required
            />
          </div>
        </div>

        <div className="space-y-1">
          <Label htmlFor="inline-password" className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
            Password
          </Label>
          <div className="relative group">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input
              id="inline-password"
              type={showPassword ? "text" : "password"}
              placeholder={isLogin ? "••••••••" : "Min. 6 characters"}
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(""); }}
              className="pl-10 pr-10 py-5 rounded-xl bg-background/50 border-border/50 focus:border-primary/50 transition-all"
              required
              minLength={6}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {error && (
          <p className="text-xs text-destructive bg-destructive/10 border border-destructive/20 rounded-lg px-3 py-2">
            {error}
          </p>
        )}

        <Button
          type="submit"
          disabled={loading}
          className={`w-full py-5 rounded-xl font-bold text-sm hover:opacity-90 transition-all shadow-lg min-h-[48px] ${
            isLogin
              ? "bg-gradient-to-r from-primary to-gold-dim text-primary-foreground shadow-primary/20"
              : "bg-gradient-to-r from-emerald-600 to-emerald-500 text-white shadow-emerald-500/20"
          }`}
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : isLogin ? (
            <>
              <LogIn className="h-4 w-4 mr-2" />
              Sign In
            </>
          ) : (
            <>
              <UserPlus className="h-4 w-4 mr-2" />
              Create Account
            </>
          )}
        </Button>
      </form>

      <div className="text-center">
        <p className="text-xs text-muted-foreground">
          {isLogin ? "New here?" : "Already have an account?"}{" "}
          <button
            onClick={() => { setView(isLogin ? "signup" : "login"); setError(""); }}
            className={`font-semibold hover:underline underline-offset-4 transition-all ${
              isLogin ? "text-emerald-400" : "text-primary"
            }`}
          >
            {isLogin ? "Create account" : "Sign in"}
          </button>
        </p>
      </div>

      {onBack && (
        <button
          onClick={onBack}
          className="flex items-center justify-center gap-1.5 text-[10px] text-muted-foreground/50 hover:text-muted-foreground transition-colors"
        >
          <ArrowLeft className="h-3 w-3" />
          Back to demo
        </button>
      )}
    </div>
  );
};

export default InlineAuth;
