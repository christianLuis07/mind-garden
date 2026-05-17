"use client";

import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Siska Putri",
    role: "Mahasiswa",
    content: "MindGarden membantu saya mengatasi kecemasan saat skripsi. Fitur jurnalnya benar-benar menenangkan.",
    avatar: "S",
  },
  {
    name: "Budi Santoso",
    role: "Software Engineer",
    content: "Analisis mood mingguan sangat membantu saya menyadari kapan saya harus beristirahat sejenak.",
    avatar: "B",
  },
  {
    name: "Maya Sari",
    role: "Ibu Rumah Tangga",
    content: "Grup dukungannya sangat hangat. Saya merasa tidak sendirian lagi dalam menghadapi tantangan hidup.",
    avatar: "M",
  },
];

export function TestimonialsSection() {
  return (
    <section id="testimonials" className="py-24 glass dark:bg-black/10 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Apa Kata Mereka?</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Kisah nyata dari mereka yang telah menemukan ketenangan bersama MindGarden.
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
