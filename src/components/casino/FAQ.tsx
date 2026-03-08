import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  { q: "Is WildScatter a casino?", a: "No. WildScatter is an independent review site. We do not offer gambling or process any payments. We only provide reviews and links to third-party platforms." },
  { q: "How do you make money?", a: "We earn commissions when users sign up through our affiliate links. This does not affect our ratings — all reviews are based on objective criteria." },
  { q: "Are the bonuses guaranteed?", a: "All bonuses are verified at the time of publishing. Terms and availability may change — always check the operator's site for the latest offers." },
  { q: "How do you rate casinos?", a: "We use a 4-step process: research, security check, performance scoring, and final verdict. Only platforms meeting all criteria get listed." },
  { q: "Is my data safe?", a: "We do not collect personal data or payment information. Any data shared is directly with the third-party platforms you choose to visit." },
  { q: "What if I have a gambling problem?", a: "Please reach out to BeGambleAware.org, GamCare.org.uk, or your local responsible gambling support service. Gambling should always be fun — never chase losses." },
];

const FAQ = () => (
  <section id="faq" className="py-10 md:py-14">
    <div className="container mx-auto px-4 max-w-2xl">
      <h2 className="text-2xl md:text-3xl font-extrabold text-center mb-6">
        <span className="text-primary">Frequently</span> Asked Questions
      </h2>
      <Accordion type="single" collapsible className="space-y-2">
        {faqs.map((faq, i) => (
          <AccordionItem key={i} value={`faq-${i}`} className="rounded-lg border border-border bg-card px-4">
            <AccordionTrigger className="text-sm font-semibold text-foreground hover:text-primary">
              {faq.q}
            </AccordionTrigger>
            <AccordionContent className="text-sm text-muted-foreground">
              {faq.a}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  </section>
);

export default FAQ;
