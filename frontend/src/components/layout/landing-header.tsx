"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function LandingHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 w-full bg-white/90 backdrop-blur-md z-50 border-b border-gray-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-linear-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">MG</span>
            </div>
            <span className="font-bold text-xl text-gray-900">MindGarden</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href="#features"
              className="text-gray-600 hover:text-green-600 transition-colors"
            >
              Fitur
            </Link>
            <Link
              href="#how-it-works"
              className="text-gray-600 hover:text-green-600 transition-colors"
            >
              Cara Kerja
            </Link>
            <Link
              href="#testimonials"
              className="text-gray-600 hover:text-green-600 transition-colors"
            >
              Testimoni
            </Link>
            <Link
              href="#faq"
              className="text-gray-600 hover:text-green-600 transition-colors"
            >
              Tanya Jawab
            </Link>
          </nav>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/login">
              <Button
                variant="ghost"
                className="text-gray-600 hover:text-green-600"
              >
                Masuk
              </Button>
            </Link>
            <Link href="/register">
              <Button className="bg-green-500 hover:bg-green-600 text-white">
                Mulai
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <div className="w-6 h-6 flex flex-col justify-center space-y-1">
              <span
                className={`block h-0.5 w-6 bg-gray-600 transition-transform ${
                  isMenuOpen ? "rotate-45 translate-y-1.5" : ""
                }`}
              />
              <span
                className={`block h-0.5 w-6 bg-gray-600 transition-opacity ${
                  isMenuOpen ? "opacity-0" : ""
                }`}
              />
              <span
                className={`block h-0.5 w-6 bg-gray-600 transition-transform ${
                  isMenuOpen ? "-rotate-45 -translate-y-1.5" : ""
                }`}
              />
            </div>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100">
            <nav className="flex flex-col space-y-4">
              <Link
                href="#features"
                className="text-gray-600 hover:text-green-600 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Fitur
              </Link>
              <Link
                href="#how-it-works"
                className="text-gray-600 hover:text-green-600 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Cara Kerja
              </Link>
              <Link
                href="#testimonials"
                className="text-gray-600 hover:text-green-600 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Testimoni
              </Link>
              <Link
                href="#faq"
                className="text-gray-600 hover:text-green-600 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Tanya Jawab
              </Link>
              <div className="pt-4 border-t border-gray-100 space-y-2">
                <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start">
                    Masuk
                  </Button>
                </Link>
                <Link href="/register" onClick={() => setIsMenuOpen(false)}>
                  <Button className="w-full justify-start bg-green-500 hover:bg-green-600">
                    Mulai
                  </Button>
                </Link>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
