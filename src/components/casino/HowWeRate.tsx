import { Search, BarChart3, ShieldCheck, CheckCircle } from "lucide-react";

const steps = [
  { icon: Search, title: "Research", desc: "We investigate licensing, ownership, and player history." },
  { icon: ShieldCheck, title: "Security Check", desc: "SSL, encryption, and responsible gambling tools verified." },
  { icon: BarChart3, title: "Performance Score", desc: "Rated on speed, game variety, support, and fairness." },
  { icon: CheckCircle, title: "Final Verdict", desc: "Only platforms meeting all criteria get listed." },
];

const HowWeRate = () => (
  <section id="how-we-rate" className="py-10 md:py-14">
    <div className="container mx-auto px-4">
      <h2 className="text-2xl md:text-3xl font-extrabold text-center mb-2">
        <span className="text-primary">How</span> We Rate
      </h2>
      <p className="text-sm text-muted-foreground text-center mb-8">
        Our transparent 4-step review process
      </p>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {steps.map((step, i) => (
          <div key={step.title} className="rounded-xl border border-border bg-card p-4 text-center flex flex-col items-center gap-2 relative">
            <div className="absolute -top-3 left-4 text-[10px] font-bold bg-primary text-primary-foreground px-2 py-0.5 rounded-full">
              Step {i + 1}
            </div>
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mt-2">
              <step.icon className="h-5 w-5 text-primary" />
            </div>
            <h3 className="text-sm font-bold text-foreground">{step.title}</h3>
            <p className="text-xs text-muted-foreground">{step.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default HowWeRate;
