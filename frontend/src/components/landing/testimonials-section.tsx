"use client";

import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Sarah Lin",
    role: "Product Designer",
    content: "The mood charts helped me realize that consecutive late nights directly caused my mid-week burnouts. Seeing it on paper changed how I protect my evenings.",
    avatar: "S",
  },
  {
    name: "Marcus Vance",
    role: "Software Engineer",
    content: "MindGarden became my favorite end-of-day ritual. The clean, quiet interface makes journaling feel completely effortless rather than a chore.",
    avatar: "M",
  },
  {
    name: "Elena Rostova",
    role: "Graduate Researcher",
    content: "The Box Breathing tool is my go-to whenever anxiety spikes before presentations. It's so refreshing to have an app that respects your focus and privacy.",
    avatar: "E",
  },
];

export function TestimonialsSection() {
  return (
    <section id="testimonials" className="py-24 glass dark:bg-black/10 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Real Experiences</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            How individuals use MindGarden daily to build emotional clarity, decompress, and stay grounded.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass-card p-8 rounded-3xl relative"
            >
              <Quote className="absolute top-4 right-4 w-10 h-10 text-primary/10" />
              <div className="flex space-x-1 mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-secondary text-secondary" />
                ))}
              </div>
              <p className="text-lg mb-8 italic text-muted-foreground">&quot;{t.content}&quot;</p>
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center font-bold">
                  {t.avatar}
                </div>
                <div>
                  <h4 className="font-bold">{t.name}</h4>
                  <p className="text-sm text-muted-foreground">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
