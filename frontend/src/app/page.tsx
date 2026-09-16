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

          {/* Developer Attribution & Social Links */}
          <div className="border-t border-gray-800 mt-12 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
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
              <div className="flex items-center gap-4">
                <a
                  href="https://github.com/christianLuis07"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                  aria-label="GitHub Christian Luis Paskalis Ginting"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                </a>
                <a
                  href="https://www.linkedin.com/in/christian-luis-paskalis-ginting-85abbb2a2/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                  aria-label="LinkedIn Christian Luis Paskalis Ginting"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                </a>
                <a
                  href="https://dev.to/christianluis07"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                  aria-label="Dev.to Christian Luis Paskalis Ginting"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M7.42 10.05c-.18-.16-.46-.23-.84-.23H6v4.36h.58c.37 0 .65-.08.84-.23.21-.16.31-.45.31-.87v-2.16c0-.42-.1-.71-.31-.87zm14.18-7.7H2.4C1.07 2.35 0 3.42 0 4.75v14.5c0 1.33 1.07 2.4 2.4 2.4h19.2c1.33 0 2.4-1.07 2.4-2.4V4.75c0-1.33-1.07-2.4-2.4-2.4zM8.84 14.05c0 1.22-.63 2.24-2.05 2.24H4.5V7.71h2.35c1.33 0 1.99 1.01 1.99 2.19v4.15zm4.38.23h-1.8v1.8h-1.3V7.71h3.1v1.3h-1.8v2.06h1.8v1.3-.09zm6.13-3.81c0 1.58-.8 2.88-2.42 2.88-.63 0-1.12-.18-1.47-.53v.46h-1.3V7.71h1.3v2.9c.35-.35.84-.53 1.47-.53 1.62 0 2.42 1.3 2.42 2.88v1.51z"/></svg>
                </a>
                <a
                  href="https://christianluispg07.blogspot.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                  aria-label="Blog Christian Luis Paskalis Ginting"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M21.976 24H2.026C.9 24 0 23.1 0 21.976V2.026C0 .9.9 0 2.026 0h19.95C23.1 0 24 .9 24 2.026v19.95C24 23.1 23.1 24 21.976 24zM12 3.91c-4.46 0-8.09 3.63-8.09 8.09s3.63 8.09 8.09 8.09 8.09-3.63 8.09-8.09-3.63-8.09-8.09-8.09zm3.59 9.45h-2.23v2.23c0 .75-.61 1.36-1.36 1.36s-1.36-.61-1.36-1.36v-2.23H8.41c-.75 0-1.36-.61-1.36-1.36s.61-1.36 1.36-1.36h2.23V8.41c0-.75.61-1.36 1.36-1.36s1.36.61 1.36 1.36v2.23h2.23c.75 0 1.36.61 1.36 1.36s-.61 1.36-1.36 1.36z"/></svg>
                </a>
              </div>
            </div>
            <div className="text-gray-400 text-xs text-center mt-4">
              © 2026 MindGarden. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
