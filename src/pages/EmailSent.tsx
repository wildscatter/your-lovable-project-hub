import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Mail } from "lucide-react";

const EmailSent = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const type = searchParams.get("type"); // "signup" or "reset"
  const email = searchParams.get("email") || "";

  const isReset = type === "reset";

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="max-w-[400px] w-full text-center space-y-6 animate-fade-in">
        <div className="mx-auto h-14 w-14 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
          <Mail className="h-7 w-7 text-primary" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-extrabold text-foreground">
            {isReset ? "Check your email" : "Confirm your email"}
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {isReset
              ? "We've sent a password reset link to"
              : "We've sent a confirmation link to"}
          </p>
          {email && (
            <p className="text-sm font-semibold text-foreground">{email}</p>
          )}
        </div>

        <p className="text-xs text-muted-foreground/70">
          {isReset
            ? "Click the link in the email to reset your password."
            : "Click the link in the email to activate your account, then come back and sign in."}
        </p>

        <Button
          variant="outline"
          onClick={() => navigate("/auth")}
          className="mt-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Sign In
        </Button>
      </div>
    </div>
  );
};

export default EmailSent;
