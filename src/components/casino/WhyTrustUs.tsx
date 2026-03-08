import { ShieldCheck, Award, Users } from "lucide-react";

const items = [
  { icon: ShieldCheck, title: "Expert Reviews", desc: "Every casino is tested and rated by experienced reviewers." },
  { icon: Award, title: "Verified Bonuses", desc: "All offers are checked for fairness and accuracy." },
  { icon: Users, title: "Player-First Approach", desc: "We recommend only platforms with strong player protections." },
];

const WhyTrustUs = () => (
  <section className="py-12 md:py-16">
    <div className="container mx-auto px-4">
      <h2 className="text-2xl font-bold text-foreground text-center mb-8">Why Trust Us</h2>
      <div className="grid md:grid-cols-3 gap-6">
        {items.map((item) => (
          <div key={item.title} className="rounded-xl border border-border bg-card p-6 text-center flex flex-col items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <item.icon className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-foreground">{item.title}</h3>
            <p className="text-sm text-muted-foreground">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default WhyTrustUs;
