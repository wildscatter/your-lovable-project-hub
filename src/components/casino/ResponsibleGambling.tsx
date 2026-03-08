import { AlertTriangle } from "lucide-react";

const ResponsibleGambling = () => (
  <section className="py-8 md:py-10">
    <div className="container mx-auto px-4">
      <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-5 md:p-6 flex flex-col md:flex-row items-center gap-4 max-w-3xl mx-auto">
        <div className="h-12 w-12 rounded-full bg-destructive/10 flex items-center justify-center shrink-0">
          <AlertTriangle className="h-6 w-6 text-destructive" />
        </div>
        <div className="text-center md:text-left">
          <h3 className="text-sm font-bold text-foreground mb-1">Gambling Should Be Fun — Not a Problem</h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            If you or someone you know is struggling with gambling, please seek help.
            Visit{" "}
            <a href="https://www.begambleaware.org" target="_blank" rel="noopener noreferrer" className="text-primary underline">
              BeGambleAware.org
            </a>
            {" "}or{" "}
            <a href="https://www.gamcare.org.uk" target="_blank" rel="noopener noreferrer" className="text-primary underline">
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
