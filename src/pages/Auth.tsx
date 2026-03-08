import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Mail, Lock, Eye, EyeOff, LogIn, UserPlus, Zap, ArrowLeft, Sparkles } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (user) navigate("/", { replace: true });
  }, [user, navigate]);

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) return;
    setLoading(true);
    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast({ title: "Signed in successfully!" });
        navigate("/");
      } else {
        const { error } = await supabase.auth.signUp({
          email, password,
          options: { emailRedirectTo: window.location.origin },
        });
        if (error) throw error;
        toast({ title: "Registration successful!", description: "Check your email for confirmation." });
      }
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const { error } = await lovable.auth.signInWithOAuth("google", {
        redirect_uri: window.location.origin,
      });
      if (error) throw error;
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex items-center justify-center px-4 py-12">
      {/* Animated background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-[radial-gradient(ellipse_at_center,hsl(38_95%_58%/0.06),transparent_60%)]" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-[radial-gradient(ellipse_at_center,hsl(4_85%_62%/0.04),transparent_60%)]" />
        <div className="absolute top-20 left-10 w-1 h-1 rounded-full bg-primary/40 sparkle" />
        <div className="absolute top-40 right-20 w-1.5 h-1.5 rounded-full bg-primary/30 sparkle" style={{ animationDelay: "1s" }} />
        <div className="absolute bottom-32 left-1/4 w-1 h-1 rounded-full bg-accent/30 sparkle" style={{ animationDelay: "2s" }} />
        <div className="absolute top-1/3 right-1/3 w-1 h-1 rounded-full bg-primary/20 sparkle" style={{ animationDelay: "0.5s" }} />
        {/* Decorative lines */}
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/10 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-accent/10 to-transparent" />
      </div>

      <div className="w-full max-w-[420px] relative z-10 animate-fade-in">
        {/* Back button */}
        <button
          onClick={() => navigate("/")}
          className="group flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          Back to Home
        </button>

        {/* Logo & Heading */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="relative">
              <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-primary to-gold-dim flex items-center justify-center shadow-lg shadow-primary/25">
                <Zap className="h-6 w-6 text-primary-foreground" />
              </div>
              <div className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-accent animate-pulse" />
            </div>
            <span className="text-2xl font-extrabold tracking-tight italic">
              <span className="text-primary">Wild</span>
              <span className="text-foreground">Scatter</span>
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground leading-tight">
            {isLogin ? (
              <>Welcome <span className="text-primary italic">back</span></>
            ) : (
              <>Join the <span className="text-primary italic">action</span></>
            )}
          </h1>
          <p className="text-muted-foreground text-sm mt-2 leading-relaxed">
            {isLogin
              ? "Sign in to access exclusive offers and personalized picks."
              : "Create your free account and unlock VIP rewards."}
          </p>
        </div>

        {/* Main Card */}
        <div className="relative">
          {/* Card glow */}
          <div className="absolute -inset-px rounded-2xl bg-gradient-to-b from-primary/20 via-transparent to-accent/10 blur-sm" />
          
          <div className="relative bg-card/80 backdrop-blur-sm border border-border/50 rounded-2xl p-6 sm:p-8 shadow-2xl shadow-primary/5">
            {/* Google Login */}
            <Button
              variant="outline"
              className="w-full py-6 text-sm font-semibold rounded-xl border-border/60 bg-secondary/20 hover:bg-secondary/40 hover:border-primary/30 transition-all duration-300 mb-5 group"
              onClick={handleGoogleLogin}
              disabled={loading}
            >
              <svg className="h-5 w-5 mr-2.5 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              Continue with Google
            </Button>

            {/* Divider */}
            <div className="flex items-center gap-4 mb-5">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent to-border" />
              <span className="text-[10px] text-muted-foreground uppercase tracking-[0.2em] font-medium">or</span>
              <div className="flex-1 h-px bg-gradient-to-l from-transparent to-border" />
            </div>

            {/* Email Form */}
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
                    placeholder="••••••••"
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

              <Button
                type="submit"
                disabled={loading}
                className="w-full py-6 rounded-xl bg-gradient-to-r from-primary via-primary to-gold-dim text-primary-foreground font-bold text-base hover:opacity-90 transition-all duration-300 shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 mt-2 group"
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

            {/* Toggle */}
            <div className="mt-6 pt-5 border-t border-border/30">
              <p className="text-center text-sm text-muted-foreground">
                {isLogin ? "New here?" : "Already a member?"}{" "}
                <button
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-primary font-semibold hover:underline underline-offset-4 transition-all"
                >
                  {isLogin ? "Create an account" : "Sign in instead"}
                </button>
              </p>
            </div>
          </div>
        </div>

        {/* Bottom trust badge */}
        <div className="flex items-center justify-center gap-2 mt-8 text-muted-foreground/50">
          <Sparkles className="h-3 w-3" />
          <span className="text-[10px] uppercase tracking-[0.2em]">Secure & encrypted</span>
          <Sparkles className="h-3 w-3" />
        </div>
      </div>
    </div>
  );
};

export default Auth;
