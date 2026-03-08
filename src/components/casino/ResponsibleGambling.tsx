import { AlertTriangle } from "lucide-react";

const ResponsibleGambling = () => (
  <section className="py-8 sm:py-10 md:py-12">
    <div className="container mx-auto px-4">
      <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-5 sm:p-6 md:p-8 flex flex-col md:flex-row items-center gap-4 sm:gap-5 max-w-3xl mx-auto">
        <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-full bg-destructive/10 flex items-center justify-center shrink-0">
          <AlertTriangle className="h-6 w-6 sm:h-7 sm:w-7 text-destructive" />
        </div>
        <div className="text-center md:text-left">
          <h3 className="text-sm sm:text-base font-bold text-foreground mb-1.5 sm:mb-2">Gambling Should Be Fun — Not a Problem</h3>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            If you or someone you know is struggling with gambling, please seek help.
            Visit{" "}
            <a href="https://www.begambleaware.org" target="_blank" rel="noopener noreferrer" className="text-primary underline font-medium">
              BeGambleAware.org
            </a>
            {" "}or{" "}
            <a href="https://www.gamcare.org.uk" target="_blank" rel="noopener noreferrer" className="text-primary underline font-medium">
              GamCare.org.uk
            </a>
            {" "}for free, confidential support. 18+ only. Play responsibly.
          </p>
        </div>
      </div>
    </div>
  </section>
);

export default ResponsibleGambling;
