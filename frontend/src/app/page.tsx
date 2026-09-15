import { LandingHeader } from "@/components/layout/landing-header";
import { HeroSection } from "@/components/landing/hero-section";
import { ProblemSection } from "@/components/landing/problem-section";
import { FeaturesSection } from "@/components/landing/features-section";
import { HowItWorks } from "@/components/landing/how-it-works";
import { TestimonialsSection } from "@/components/landing/testimonials-section";
import { FAQSection } from "@/components/landing/faq-section";
import { CTASection } from "@/components/landing/cta-section";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <LandingHeader />

      <main>
        <HeroSection />
        <ProblemSection />
        <FeaturesSection />
        <HowItWorks />
        <TestimonialsSection />
        <FAQSection />
        <CTASection />
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            {/* Brand */}
            <div className="md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-linear-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">MG</span>
                </div>
                <span className="font-bold text-xl">MindGarden</span>
              </div>
              <p className="text-gray-400 max-w-md">
                Teman tepercaya untuk kesehatan mentalmu. Pantau, refleksikan,
                bernapas, dan berkembang dalam ruang yang aman dan penuh
                dukungan.
              </p>
            </div>

            {/* Links */}
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a
                    href="#features"
                    className="hover:text-white transition-colors"
                  >
                    Fitur
                  </a>
                </li>
                <li>
                  <a
                    href="#how-it-works"
                    className="hover:text-white transition-colors"
                  >
                    Cara Kerja
                  </a>
                </li>
                <li>
                  <a
                    href="#testimonials"
                    className="hover:text-white transition-colors"
                  >
                    Testimoni
                  </a>
                </li>
                <li>
                  <a
                    href="/pricing"
                    className="hover:text-white transition-colors"
                  >
                    Pricing
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a
                    href="/about"
                    className="hover:text-white transition-colors"
                  >
                    About
                  </a>
                </li>
                <li>
                  <a
                    href="/blog"
                    className="hover:text-white transition-colors"
                  >
                    Blog
                  </a>
                </li>
                <li>
                  <a
                    href="/careers"
                    className="hover:text-white transition-colors"
                  >
                    Careers
                  </a>
                </li>
                <li>
                  <a
                    href="/contact"
                    className="hover:text-white transition-colors"
                  >
                    Contact
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Developer Attribution & Bottom */}
          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex flex-wrap items-center gap-2 text-sm text-gray-400 text-center md:text-left">
              <span>Dikonsep & Dikembangkan oleh</span>
              <a
                href="https://github.com/christianLuis07"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white font-semibold hover:text-green-400 transition-colors underline decoration-dotted underline-offset-4"
              >
                Christian Luis Paskalis Ginting
              </a>
              <span className="text-gray-600 hidden sm:inline">•</span>
              <span className="text-xs text-gray-500 hidden sm:inline">
                Full-Stack Software Engineer
              </span>
            </div>
            <div className="text-gray-400 text-xs">
              © 2026 MindGarden. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
