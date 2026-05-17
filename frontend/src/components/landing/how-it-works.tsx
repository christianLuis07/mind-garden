"use client";

import { motion } from "framer-motion";
import { UserPlus, Calendar, Smile, Sprout } from "lucide-react";

const steps = [
  {
    title: "Buat Akun Anda",
    description: "Daftar dalam hitungan detik untuk memulai perjalanan kesehatan mental Anda.",
    icon: UserPlus,
  },
  {
    title: "Catat Setiap Hari",
    description: "Gunakan jurnal dan mood tracker untuk merekam apa yang Anda rasakan.",
    icon: Calendar,
  },
  {
    title: "Pahami Diri Sendiri",
    description: "Dapatkan insight dari analisis data dan emosi Anda dari waktu ke waktu.",
    icon: Smile,
  },
  {
    title: "Tumbuh Bersama",
    description: "Berbagi dan belajar dalam grup dukungan untuk perkembangan yang berkelanjutan.",
    icon: Sprout,
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Cara Kerja MindGarden</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Proses sederhana yang dirancang untuk membantu Anda membangun kebiasaan positif setiap hari.
          </p>
        </div>

        <div className="relative">
          {/* Connector Line (Desktop) */}
          <div className="hidden lg:block absolute top-1/2 left-0 w-full h-0.5 bg-primary/20 -translate-y-1/2 z-0" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex flex-col items-center text-center"
              >
                <div className="w-20 h-20 rounded-full bg-primary text-white flex items-center justify-center mb-6 shadow-xl shadow-primary/20 border-8 border-background">
                  <step.icon className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
