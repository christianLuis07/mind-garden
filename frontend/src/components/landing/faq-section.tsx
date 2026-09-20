import { FAQItem } from "@/components/ui/faq-item";
import { SectionWrapper } from "@/components/ui/section-wrapper";

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
        <div className="text-center mt-12 p-8 bg-linear-to-r from-green-50 to-blue-50 rounded-2xl">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Still have questions?
          </h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            We are here to support your journey toward daily mindfulness and emotional balance.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:support@mindgarden.com"
              className="inline-flex items-center px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg transition-colors"
            >
              Contact Support
            </a>
            <a
              href="/register"
              className="inline-flex items-center px-6 py-3 border-2 border-green-500 text-green-500 hover:bg-green-500 hover:text-white font-semibold rounded-lg transition-colors"
            >
              Start for Free
            </a>
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}
