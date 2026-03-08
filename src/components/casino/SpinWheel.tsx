import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Gift, Sparkles, LogIn } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const SpinWheel = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleClick = () => {
    if (!user) {
      navigate("/auth");
      return;
    }
    navigate("/spin");
  };

  return (
    <section className="py-8 sm:py-12">
      <div className="w-full px-4 sm:px-6 md:px-12 lg:px-20">
        <div className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-card via-card to-secondary/30 p-6 sm:p-10 text-center">
          <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,hsl(38_95%_58%/0.04),transparent_70%)]" />
          <div className="relative z-10 flex flex-col items-center gap-4">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary animate-pulse" />
              <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground">
                Spin & <span className="text-primary italic">Win Points</span>
              </h2>
              <Sparkles className="h-5 w-5 text-primary animate-pulse" />
            </div>
            <p className="text-muted-foreground text-sm sm:text-base max-w-md">
              {user
                ? "დაატრიალე ბორბალი და მოაგროვე ქულები!"
                : "გაიარე ავტორიზაცია და დაატრიალე ბორბალი!"}
            </p>
            <Button
              size="lg"
              onClick={handleClick}
              className="glow-pulse-btn bg-gradient-to-r from-primary to-gold-dim text-primary-foreground font-bold text-base px-10 py-7 rounded-xl hover:opacity-90 transition-opacity shadow-lg shadow-primary/20 mt-2"
            >
              {user ? (
                <>
                  <Gift className="h-5 w-5 mr-2" />
                  Spin the Wheel
                </>
              ) : (
                <>
                  <LogIn className="h-5 w-5 mr-2" />
                  Sign In to Spin
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SpinWheel;
