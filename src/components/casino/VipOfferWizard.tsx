import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { CheckCircle, ChevronRight, ChevronLeft, Loader2, Sparkles } from "lucide-react";
import emailjs from "@emailjs/browser";

const EMAILJS_SERVICE_ID = "service_m5m4d0i";
const EMAILJS_TEMPLATE_ID = "template_yz7bh2o";
const EMAILJS_PUBLIC_KEY = "uwal6zbarjqcPutjJ";

interface VipOfferWizardProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const VipOfferWizard = ({ open, onOpenChange }: VipOfferWizardProps) => {
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [casinoName, setCasinoName] = useState("");
  const [isFirstTimer, setIsFirstTimer] = useState(false);
  const [wagering, setWagering] = useState("");
  const [email, setEmail] = useState("");
  const [agreedToEmails, setAgreedToEmails] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const resetForm = () => {
    setStep(1); setSubmitting(false); setSubmitted(false);
    setCasinoName(""); setIsFirstTimer(false); setWagering("");
    setEmail(""); setAgreedToEmails(false); setErrors({});
  };

  const handleClose = () => { onOpenChange(false); setTimeout(resetForm, 300); };

  const validateStep1 = () => {
    if (!casinoName.trim() && !isFirstTimer) {
      setErrors({ casino: "Please enter a casino name or select the first-timer option." });
      return false;
    }
    setErrors({}); return true;
  };

  const validateStep2 = () => {
    const amount = parseFloat(wagering);
    if (!wagering.trim() || isNaN(amount) || amount <= 0) {
      setErrors({ wagering: "Please enter a valid wagering amount." }); return false;
    }
    if (amount > 10000000) {
      setErrors({ wagering: "Please enter a realistic amount." }); return false;
    }
    setErrors({}); return true;
  };

  const validateStep3 = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const newErrors: Record<string, string> = {};
    if (!email.trim() || !emailRegex.test(email.trim())) newErrors.email = "Please enter a valid email address.";
    if (email.trim().length > 255) newErrors.email = "Email must be less than 255 characters.";
    if (!agreedToEmails) newErrors.agree = "You must agree to receive offers.";
    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return false; }
    setErrors({}); return true;
  };

  const handleNext = () => {
    if (step === 1 && validateStep1()) setStep(2);
    else if (step === 2 && validateStep2()) setStep(3);
  };

  const handleBack = () => { setErrors({}); setStep((s) => Math.max(1, s - 1)); };

  const handleSubmit = async () => {
    if (!validateStep3()) return;
    setSubmitting(true);
    const templateParams = {
      current_casino: isFirstTimer ? "First-time crypto casino user" : casinoName.trim(),
      monthly_wagering: `$${parseFloat(wagering).toLocaleString()}`,
      user_email: email.trim(),
      submission_date: new Date().toLocaleString(),
    };
    try {
      await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams, EMAILJS_PUBLIC_KEY);
      setSubmitted(true);
    } catch (error) {
      console.error("EmailJS error:", error);
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  };

  const progressWidth = submitted ? 100 : ((step - 1) / 3) * 100;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="w-[calc(100vw-2rem)] max-w-[480px] p-0 bg-card border-primary/20 overflow-hidden gap-0 max-h-[90vh] overflow-y-auto rounded-2xl">
        <div className="px-5 sm:px-6 pt-5 sm:pt-6 pb-2">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              {submitted ? "Complete" : `Step ${step} of 3`}
            </span>
            <Sparkles className="h-4 w-4 text-primary" />
          </div>
          <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progressWidth}%` }}
            />
          </div>
        </div>

        <div className="px-5 sm:px-6 pb-6 pt-3 sm:pt-4 min-h-[300px] flex flex-col">
          {submitted && (
            <div className="flex-1 flex flex-col items-center justify-center text-center gap-4 animate-float-up py-4">
              <div className="h-16 w-16 rounded-full bg-accent/15 flex items-center justify-center">
                <CheckCircle className="h-8 w-8 text-accent" />
              </div>
              <h2 className="text-xl font-bold text-foreground">Request Received</h2>
              <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">
                Our team will analyze your wagering profile and send you the best available casino offers.
              </p>
              <Button onClick={handleClose} className="mt-2 glow-pulse-btn bg-gradient-to-r from-primary to-gold-dim text-primary-foreground font-bold px-8 py-5 rounded-xl hover:opacity-90 min-h-[48px] active:scale-[0.98] transition-all">
                Back to Casinos
              </Button>
            </div>
          )}

          {!submitted && step === 1 && (
            <div className="flex-1 flex flex-col gap-4 sm:gap-5 animate-float-up">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-foreground mb-1">Which casino are you currently using?</h2>
                <p className="text-xs sm:text-sm text-muted-foreground">Tell us where you play or if you're new.</p>
              </div>
              <div className="space-y-3">
                <Input placeholder="Type the casino name" value={casinoName}
                  onChange={(e) => { setCasinoName(e.target.value.slice(0, 100)); if (e.target.value.trim()) setIsFirstTimer(false); setErrors({}); }}
                  disabled={isFirstTimer} className="bg-secondary/50 border-border text-foreground placeholder:text-muted-foreground/50 h-12 text-base rounded-xl" />
                <div className="relative">
                  <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border" /></div>
                  <div className="relative flex justify-center"><span className="bg-card px-3 text-xs text-muted-foreground">or</span></div>
                </div>
                <button type="button" onClick={() => { setIsFirstTimer(!isFirstTimer); if (!isFirstTimer) setCasinoName(""); setErrors({}); }}
                  className={`w-full p-4 rounded-xl border-2 text-left text-sm font-medium transition-all duration-200 min-h-[52px] active:scale-[0.98] ${isFirstTimer ? "border-primary bg-primary/10 text-primary" : "border-border bg-secondary/30 text-muted-foreground hover:border-primary/40 hover:bg-secondary/50"}`}>
                  <span className="flex items-center gap-3">
                    <span className={`h-5 w-5 rounded-full border-2 flex items-center justify-center transition-colors shrink-0 ${isFirstTimer ? "border-primary bg-primary" : "border-muted-foreground/40"}`}>
                      {isFirstTimer && <span className="h-2 w-2 rounded-full bg-primary-foreground" />}
                    </span>
                    I'm trying crypto casinos for the first time
                  </span>
                </button>
              </div>
              {errors.casino && <p className="text-xs text-destructive">{errors.casino}</p>}
            </div>
          )}

          {!submitted && step === 2 && (
            <div className="flex-1 flex flex-col gap-4 sm:gap-5 animate-float-up">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-foreground mb-1">Monthly wagering amount?</h2>
                <p className="text-xs sm:text-sm text-muted-foreground">Helps us match you with the best VIP programs.</p>
              </div>
              <div className="space-y-2">
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-semibold text-base">$</span>
                  <Input type="number" placeholder="Approximate monthly amount (USD)" value={wagering}
                    onChange={(e) => { setWagering(e.target.value); setErrors({}); }} min={0}
                    className="bg-secondary/50 border-border text-foreground placeholder:text-muted-foreground/50 h-12 pl-8 text-base rounded-xl" />
                </div>
                <p className="text-[11px] text-muted-foreground/70">This helps us find better bonuses and VIP offers for you.</p>
              </div>
              {errors.wagering && <p className="text-xs text-destructive">{errors.wagering}</p>}
            </div>
          )}

          {!submitted && step === 3 && (
            <div className="flex-1 flex flex-col gap-4 sm:gap-5 animate-float-up">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-foreground mb-1">Where should we send offers?</h2>
                <p className="text-xs sm:text-sm text-muted-foreground">Exclusive deals matched to your profile.</p>
              </div>
              <div className="space-y-4">
                <Input type="email" placeholder="Enter your email address" value={email}
                  onChange={(e) => { setEmail(e.target.value.slice(0, 255)); setErrors({}); }}
                  className="bg-secondary/50 border-border text-foreground placeholder:text-muted-foreground/50 h-12 text-base rounded-xl" />
                {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
                <div className="flex items-start gap-3 min-h-[44px]">
                  <Checkbox id="agree-emails" checked={agreedToEmails}
                    onCheckedChange={(checked) => { setAgreedToEmails(checked === true); setErrors((prev) => ({ ...prev, agree: "" })); }}
                    className="mt-1 border-muted-foreground/40 data-[state=checked]:bg-primary data-[state=checked]:border-primary h-5 w-5" />
                  <label htmlFor="agree-emails" className="text-sm text-muted-foreground leading-relaxed cursor-pointer">
                    I agree to receive personalized casino offers and promotional emails.
                  </label>
                </div>
                {errors.agree && <p className="text-xs text-destructive">{errors.agree}</p>}
                <p className="text-[11px] text-muted-foreground/50 text-center">18+ only. Please gamble responsibly.</p>
              </div>
            </div>
          )}

          {!submitted && (
            <div className="flex items-center gap-3 mt-5 sm:mt-6 pt-4 border-t border-border">
              {step > 1 && (
                <Button variant="ghost" onClick={handleBack} className="text-muted-foreground hover:text-foreground min-h-[44px] px-4">
                  <ChevronLeft className="h-4 w-4 mr-1" /> Back
                </Button>
              )}
              <div className="flex-1" />
              {step < 3 ? (
                <Button onClick={handleNext} className="bg-gradient-to-r from-primary to-violet-dim text-primary-foreground font-semibold px-6 sm:px-8 rounded-xl hover:opacity-90 transition-all min-h-[48px] active:scale-[0.98]">
                  Continue <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              ) : (
                <Button onClick={handleSubmit} disabled={submitting} className="glow-pulse-btn bg-gradient-to-r from-primary to-violet-dim text-primary-foreground font-semibold px-6 sm:px-8 rounded-xl hover:opacity-90 transition-all min-h-[48px] active:scale-[0.98]">
                  {submitting ? (<><Loader2 className="h-4 w-4 mr-2 animate-spin" />Sending...</>) : "Get My Offers"}
                </Button>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VipOfferWizard;
