import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Mail, Lock, Eye, EyeOff, LogIn, UserPlus, ArrowLeft, Sparkles, Shield, Gift, Trophy, Star } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

type AuthView = "login" | "signup" | "forgot";

const Auth = () => {
  const [searchParams] = useSearchParams();
  const referrerId = searchParams.get("ref");
  const returnTo = searchParams.get("returnTo");
  const initialView = searchParams.get("view") as AuthView | null;
  const [view, setView] = useState<AuthView>(initialView === "signup" || referrerId ? "signup" : "login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [resetEmail, setResetEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      const destination = returnTo || "/";
      if (referrerId) {
        supabase.functions.invoke("process-referral", {
          body: { referrerId },
        }).then(() => {
          navigate(destination, { replace: true });
        });
      } else {
        navigate(destination, { replace: true });
      }
    }
  }, [user, navigate, referrerId, returnTo]);

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) return;
    setLoading(true);
    try {
      if (view === "login") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        
        navigate("/");
      } else {
        const siteUrl = "https://wildscatter.com";
        const redirectUrl = referrerId 
          ? `${siteUrl}/auth?ref=${referrerId}${returnTo ? `&returnTo=${returnTo}` : ''}`
          : siteUrl;
        const { error } = await supabase.auth.signUp({
          email, password,
          options: { emailRedirectTo: redirectUrl },
        });
        if (error) throw error;
        navigate(`/email-sent?type=signup&email=${encodeURIComponent(email)}`);
      }
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail.trim()) return;
    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) throw error;
      navigate(`/email-sent?type=reset&email=${encodeURIComponent(resetEmail)}`);
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };


  const isLogin = view === "login";
  const isForgot = view === "forgot";

  const bgGlow = isLogin
    ? "bg-[radial-gradient(ellipse_at_center,hsl(38_95%_58%/0.07),transparent_60%)]"
    : isForgot
    ? "bg-[radial-gradient(ellipse_at_center,hsl(215_55%_60%/0.06),transparent_60%)]"
    : "bg-[radial-gradient(ellipse_at_center,hsl(155_75%_48%/0.06),transparent_60%)]";

  const bgGlow2 = isLogin
    ? "bg-[radial-gradient(ellipse_at_center,hsl(4_85%_62%/0.04),transparent_60%)]"
    : "bg-[radial-gradient(ellipse_at_center,hsl(38_95%_58%/0.05),transparent_60%)]";

  const cardGlow = isLogin
    ? "bg-gradient-to-b from-primary/20 via-transparent to-accent/10"
    : isForgot
    ? "bg-gradient-to-b from-[hsl(215_55%_60%/0.20)] via-transparent to-primary/10"
    : "bg-gradient-to-b from-[hsl(155_75%_48%/0.25)] via-transparent to-primary/10";

  const submitBtnClass = isLogin
    ? "bg-gradient-to-r from-primary via-primary to-gold-dim shadow-primary/25 hover:shadow-primary/30"
    : isForgot
    ? "bg-gradient-to-r from-[hsl(215,55%,50%)] via-[hsl(215,55%,45%)] to-[hsl(215,50%,40%)] shadow-[hsl(215_55%_60%/0.25)] hover:shadow-[hsl(215_55%_60%/0.3)]"
    : "bg-gradient-to-r from-[hsl(155,75%,42%)] via-[hsl(155,70%,38%)] to-[hsl(155,65%,34%)] shadow-[hsl(155_75%_48%/0.25)] hover:shadow-[hsl(155_75%_48%/0.3)]";

  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex items-center justify-center px-4 py-12">
      <div className="absolute inset-0 pointer-events-none transition-all duration-700">
        <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] ${bgGlow} transition-all duration-700`} />
        <div className={`absolute bottom-0 right-0 w-[500px] h-[500px] ${bgGlow2} transition-all duration-700`} />
        <div className="absolute top-20 left-10 w-1 h-1 rounded-full bg-primary/40 sparkle" />
        <div className="absolute top-40 right-20 w-1.5 h-1.5 rounded-full bg-primary/30 sparkle" style={{ animationDelay: "1s" }} />
        <div className="absolute bottom-32 left-1/4 w-1 h-1 rounded-full bg-accent/30 sparkle" style={{ animationDelay: "2s" }} />
        <div className="absolute top-1/3 right-1/3 w-1 h-1 rounded-full bg-primary/20 sparkle" style={{ animationDelay: "0.5s" }} />
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/10 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-accent/10 to-transparent" />
      </div>

      <div className="w-full max-w-[420px] relative z-10 animate-fade-in">
        <button
          onClick={() => isForgot ? setView("login") : navigate("/")}
          className="group flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          {isForgot ? "Back to Sign In" : "Back to Home"}
        </button>

        <div className="mb-10">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-2xl font-extrabold tracking-tight italic">
              <span className="text-primary">Wild</span>
              <span className="text-foreground">Scatter</span>
            </span>
          </div>

          {isForgot ? (
            <>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground leading-tight">
                Reset your <span className="text-[hsl(215,55%,60%)] italic">password</span>
              </h1>
              <p className="text-muted-foreground text-sm mt-2 leading-relaxed">
                Enter your email and we'll send you a link to reset your password.
              </p>
            </>
          ) : isLogin ? (
            <>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground leading-tight">
                Welcome <span className="text-primary italic">back</span>
              </h1>
              <p className="text-muted-foreground text-sm mt-2 leading-relaxed">
                Sign in to access exclusive offers and personalized picks.
              </p>
            </>
          ) : (
            <>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground leading-tight">
                Join the <span className="text-[hsl(155,75%,48%)] italic">club</span>
              </h1>
              <p className="text-muted-foreground text-sm mt-2 leading-relaxed">
                Create your free account and start winning today.
              </p>
              <div className="flex flex-wrap gap-2 mt-4">
                {[
                  { icon: Gift, text: "Welcome Bonus" },
                  { icon: Star, text: "VIP Access" },
                  { icon: Trophy, text: "Exclusive Picks" },
                ].map(({ icon: Icon, text }) => (
                  <span key={text} className="inline-flex items-center gap-1.5 text-[11px] font-medium text-[hsl(155,75%,48%)] bg-[hsl(155_75%_48%/0.08)] border border-[hsl(155_75%_48%/0.15)] rounded-full px-3 py-1">
                    <Icon className="h-3 w-3" />
                    {text}
                  </span>
                ))}
              </div>
            </>
          )}
        </div>

        <div className="relative">
          <div className={`absolute -inset-px rounded-2xl ${cardGlow} blur-sm transition-all duration-700`} />

          <div className="relative bg-card/80 backdrop-blur-sm border border-border/50 rounded-2xl p-6 sm:p-8 shadow-2xl shadow-primary/5">
            {isForgot ? (
              /* Forgot Password Form */
              <form onSubmit={handleForgotPassword} className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="reset-email" className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Email Address
                  </Label>
                  <div className="relative group">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <Input
                      id="reset-email"
                      type="email"
                      placeholder="you@example.com"
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      className="pl-11 py-5 rounded-xl bg-background/50 border-border/50 focus:border-primary/50 focus:bg-background/80 transition-all duration-300"
                      required
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-6 rounded-xl text-primary-foreground font-bold text-base hover:opacity-90 transition-all duration-300 shadow-lg hover:shadow-xl mt-2 group ${submitBtnClass}`}
                >
                  {loading ? (
                    <div className="h-5 w-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  ) : (
                    <>
                      <Mail className="h-4 w-4 mr-2" />
                      Send Reset Link
                    </>
                  )}
                </Button>

                <div className="mt-4 pt-4 border-t border-border/30">
                  <p className="text-center text-sm text-muted-foreground">
                    Remember your password?{" "}
                    <button
                      onClick={() => setView("login")}
                      className="font-semibold text-primary hover:underline underline-offset-4 transition-all"
                    >
                      Sign in
                    </button>
                  </p>
                </div>
              </form>
            ) : (
              /* Login / Signup Form */
              <>

                <form onSubmit={handleEmailAuth} className="space-y-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="email" className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Email
                    </Label>
                    <div className="relative group">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-11 py-5 rounded-xl bg-background/50 border-border/50 focus:border-primary/50 focus:bg-background/80 transition-all duration-300"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="password" className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Password
                    </Label>
                    <div className="relative group">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder={isLogin ? "••••••••" : "Min. 6 characters"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-11 pr-11 py-5 rounded-xl bg-background/50 border-border/50 focus:border-primary/50 focus:bg-background/80 transition-all duration-300"
                        required
                        minLength={6}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  {isLogin && (
                    <div className="text-right">
                      <button
                        type="button"
                        onClick={() => setView("forgot")}
                        className="text-xs text-primary hover:underline underline-offset-4 transition-all"
                      >
                        Forgot password?
                      </button>
                    </div>
                  )}

                  {!isLogin && (
                    <p className="text-[11px] text-muted-foreground/70 pl-1">
                      Use at least 6 characters with a mix of letters and numbers.
                    </p>
                  )}

                  <Button
                    type="submit"
                    disabled={loading}
                    className={`w-full py-6 rounded-xl text-primary-foreground font-bold text-base hover:opacity-90 transition-all duration-300 shadow-lg hover:shadow-xl mt-2 group ${submitBtnClass}`}
                  >
                    {loading ? (
                      <div className="h-5 w-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                    ) : isLogin ? (
                      <>
                        <LogIn className="h-4 w-4 mr-2 group-hover:translate-x-0.5 transition-transform" />
                        Sign In
                      </>
                    ) : (
                      <>
                        <UserPlus className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
                        Create Account
                      </>
                    )}
                  </Button>
                </form>

                <div className="mt-6 pt-5 border-t border-border/30">
                  <p className="text-center text-sm text-muted-foreground">
                    {isLogin ? "New here?" : "Already a member?"}{" "}
                    <button
                      onClick={() => setView(isLogin ? "signup" : "login")}
                      className={`font-semibold hover:underline underline-offset-4 transition-all ${isLogin ? "text-primary" : "text-[hsl(155,75%,48%)]"}`}
                    >
                      {isLogin ? "Create an account" : "Sign in instead"}
                    </button>
                  </p>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="flex items-center justify-center gap-2 mt-8 text-muted-foreground/50">
          {isLogin ? (
            <>
              <Shield className="h-3 w-3" />
              <span className="text-[10px] uppercase tracking-[0.2em]">Secure & encrypted</span>
              <Shield className="h-3 w-3" />
            </>
          ) : isForgot ? (
            <>
              <Shield className="h-3 w-3" />
              <span className="text-[10px] uppercase tracking-[0.2em]">We'll never share your email</span>
              <Shield className="h-3 w-3" />
            </>
          ) : (
            <>
              <Shield className="h-3 w-3" />
              <span className="text-[10px] uppercase tracking-[0.2em]">Secure & encrypted</span>
              <Shield className="h-3 w-3" />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Auth;
