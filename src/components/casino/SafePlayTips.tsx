import { Clock, Target, HeartHandshake, AlertTriangle, BookOpen } from "lucide-react";

const tips = [
  { icon: Clock, text: "Set time and spending limits before you play." },
  { icon: Target, text: "Only play on licensed, regulated platforms." },
  { icon: HeartHandshake, text: "Never chase losses — take breaks often." },
  { icon: AlertTriangle, text: "If gambling stops being fun, seek help immediately." },
  { icon: BookOpen, text: "Read all bonus terms carefully before claiming." },
];

const SafePlayTips = () => (
  <section id="safe-play" className="py-12 md:py-16">
    <div className="container mx-auto px-4 max-w-2xl">
      <h2 className="text-2xl font-bold text-foreground text-center mb-6">Safe Play Tips</h2>
      <div className="space-y-3">
        {tips.map((tip, i) => (
          <div key={i} className="flex items-start gap-3 rounded-lg border border-border bg-card p-4">
            <tip.icon className="h-5 w-5 text-primary mt-0.5 shrink-0" />
            <p className="text-sm text-muted-foreground">{tip.text}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default SafePlayTips;
