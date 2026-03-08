import { ShieldCheck, Award, Users } from "lucide-react";

const items = [
  { icon: ShieldCheck, title: "Expert Reviews", desc: "Every casino is tested and rated by experienced reviewers with years of industry knowledge." },
  { icon: Award, title: "Verified Bonuses", desc: "All offers are checked for fairness, accuracy, and reasonable wagering requirements." },
  { icon: Users, title: "Player-First Approach", desc: "We recommend only platforms with strong player protections and responsive support." },
];

const WhyTrustUs = () => (
  <section className="py-12 sm:py-14 md:py-20">
    <div className="container mx-auto px-4">
      <h2 className="text-2xl md:text-3xl font-extrabold text-foreground text-center mb-3">
        Why <span className="text-primary">Trust</span> Us
      </h2>
      <p className="text-sm text-muted-foreground text-center mb-8 sm:mb-10 max-w-md mx-auto">
        Transparency, expertise, and player safety are at the core of everything we do.
      </p>
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 max-w-4xl mx-auto">
        {items.map((item) => (
          <div key={item.title} className="rounded-xl border border-border bg-card p-6 sm:p-7 text-center flex flex-col items-center gap-3 sm:gap-4 hover:border-primary/30 transition-colors duration-300">
            <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-full bg-primary/10 flex items-center justify-center">
              <item.icon className="h-6 w-6 sm:h-7 sm:w-7 text-primary" />
            </div>
            <h3 className="text-base sm:text-lg font-bold text-foreground">{item.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default WhyTrustUs;
