import { FAQItem } from "@/components/ui/faq-item";
import { SectionWrapper } from "@/components/ui/section-wrapper";
import { Mail, ArrowRight, LifeBuoy } from "lucide-react";
import Link from "next/link";

const faqs = [
  {
    question: "Is my personal data private and secure?",
    answer:
      "Yes. Your journals, mood logs, and reflection records are strictly private to your account. MindGarden does not sell user data, run behavioral tracking ads, or share your entries with third parties.",
  },
  {
    question: "Is MindGarden really free to use?",
    answer:
      "Yes, MindGarden is entirely free. All core features—daily mood tracking, reflective journaling with sentiment insights, guided breathwork, and peer groups—are accessible without subscriptions or paywalls.",
  },
  {
    question: "Do I need to install software or wear a special device?",
    answer:
      "No downloads or wearables are required. MindGarden is a fast, responsive web application that runs directly inside any modern browser across laptops, tablets, and smartphones.",
  },
  {
    question: "How does the automated sentiment analysis work?",
    answer:
      "When you write a journal entry, an automated algorithm evaluates the emotional tone on an objective scale (-1 to +1). This helps you notice subtle shifts in perspective and identify trends in your thoughts over weeks or months.",
  },
  {
    question: "Can I participate in community support groups anonymously?",
    answer:
      "Yes. You have complete control over your profile visibility. You can exchange encouragement and join topic-specific discussions with peace of mind.",
  },
  {
    question: "Can I share my mood and journal history with my therapist?",
    answer:
      "Absolutely. Many users find it valuable to review their mood charts and journal reflections during therapy sessions to provide concrete context on weekly highs and lows.",
  },
];

export function FAQSection() {
  return (
    <SectionWrapper id="faq" className="bg-white">
      <div className="max-w-4xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-gray-600">
            Everything you need to know about MindGarden, our tools, and our privacy commitments.
          </p>
        </div>

        {/* FAQ Items */}
        <div className="bg-gray-50 rounded-2xl p-8">
          {faqs.map((faq, index) => (
            <FAQItem key={index} question={faq.question} answer={faq.answer} />
          ))}
        </div>

        {/* Support CTA */}
        <div className="text-center mt-16 p-10 md:p-14 bg-card/90 border border-primary/25 backdrop-blur-xl rounded-[2.5rem] shadow-xl shadow-primary/5 relative overflow-hidden">
          {/* Subtle ambient botanical glow */}
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-secondary/30 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-2xl mx-auto">
            <div className="w-14 h-14 bg-primary/15 text-primary rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-md shadow-primary/10">
              <LifeBuoy className="w-7 h-7" />
            </div>

            <h3 className="text-2xl md:text-3xl font-black text-foreground tracking-tight mb-4">
              Still have questions?
            </h3>
            <p className="text-muted-foreground text-base md:text-lg mb-8 max-w-xl mx-auto font-medium leading-relaxed">
              We are here to support your journey toward daily mindfulness and emotional balance.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a
                href="mailto:support@mindgarden.com"
                className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 bg-primary hover:bg-primary/90 text-white font-bold rounded-2xl shadow-xl shadow-primary/25 transition-all hover:scale-105 active:scale-95 text-sm uppercase tracking-wider"
              >
                <Mail className="w-4 h-4 mr-2" />
                Contact Support
              </a>
              <Link
                href="/register"
                className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 bg-background border-2 border-border hover:border-primary/40 text-foreground font-bold rounded-2xl transition-all hover:scale-105 active:scale-95 text-sm uppercase tracking-wider shadow-sm hover:shadow-md"
              >
                Start for Free
                <ArrowRight className="w-4 h-4 ml-2 text-primary" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}
