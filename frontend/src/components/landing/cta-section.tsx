"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";

export function CTASection() {
  return (
    <section className="py-24 bg-background relative overflow-hidden">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-primary rounded-[3rem] p-12 md:p-24 text-center text-white relative overflow-hidden shadow-2xl shadow-primary/30"
        >
          {/* Decorative circles */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/20 rounded-full -ml-32 -mb-32 blur-3xl" />

          <div className="relative z-10 max-w-3xl mx-auto">
            <Sparkles className="w-12 h-12 mx-auto mb-8 animate-bounce" />
            <h2 className="text-4xl md:text-6xl font-bold mb-8 leading-tight">
              Siap untuk Menanam Benih <span className="italic">Kebahagiaan?</span>
            </h2>
            <p className="text-xl md:text-2xl mb-12 text-white/80 leading-relaxed">
              Bergabunglah dengan ribuan pengguna lainnya yang telah memulai perjalanan kesehatan mental mereka bersama MindGarden.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Button size="lg" className="bg-white text-primary hover:bg-white/90 rounded-full px-10 py-8 text-xl font-bold shadow-xl">
                Mulai Gratis <ArrowRight className="ml-2 w-6 h-6" />
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
