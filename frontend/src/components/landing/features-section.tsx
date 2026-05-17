"use client";

import { motion } from "framer-motion";
import { BookOpen, Smile, Wind, Users, BarChart3, ShieldCheck } from "lucide-react";

const features = [
  {
    title: "Jurnal Pintar",
    description: "Tuliskan apa saja yang ada di pikiranmu. Analisis kami membantu kamu mengenali pola emosi dari setiap tulisan.",
    icon: BookOpen,
    color: "bg-blue-500/10 text-blue-600",
  },
  {
    title: "Pantau Mood",
    description: "Catat bagaimana perasaanmu setiap hari. Lihat perkembangan emosimu melalui grafik yang cantik dan mudah dipahami.",
    icon: Smile,
    color: "bg-orange-500/10 text-orange-600",
  },
  {
    title: "Ruang Napas",
    description: "Tenangkan pikiran yang bising dengan teknik pernapasan terpandu yang dirancang untuk meredakan stres instan.",
    icon: Wind,
    color: "bg-teal-500/10 text-teal-600",
  },
  {
    title: "Komunitas Hangat",
    description: "Kamu tidak sendirian. Temukan teman cerita di grup dukungan yang aman, anonim, dan penuh empati.",
    icon: Users,
    color: "bg-purple-500/10 text-purple-600",
  },
  {
    title: "Wawasan Diri",
    description: "Dapatkan laporan mingguan tentang kesehatan mentalmu. Pahami apa yang membuatmu bahagia atau cemas.",
    icon: BarChart3,
    color: "bg-green-500/10 text-green-600",
  },
  {
    title: "Privasi Total",
    description: "Keamananmu adalah prioritas kami. Semua data dienkripsi sehingga hanya kamu yang bisa membacanya.",
    icon: ShieldCheck,
    color: "bg-red-500/10 text-red-600",
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="py-24 bg-background relative overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-primary font-bold text-sm tracking-widest uppercase mb-4"
          >
            Layanan Kami
          </motion.h2>
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-black mb-6 tracking-tight"
          >
            Segala hal untuk menjaga <span className="text-primary italic font-serif">kesehatan mentalmu</span>
          </motion.h3>
          <motion.p
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             transition={{ delay: 0.2 }}
             className="text-lg md:text-xl text-muted-foreground font-medium"
          >
            MindGarden menyediakan berbagai alat yang dirancang untuk membantumu mengelola stres dan membangun ketahanan emosional yang lebih baik.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="glass-card p-10 rounded-[2.5rem] hover:shadow-2xl transition-all duration-500 group border-white/40 dark:border-white/5"
            >
              <div className={`w-16 h-16 rounded-2xl ${feature.color} flex items-center justify-center mb-8 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500`}>
                <feature.icon className="w-8 h-8" />
              </div>
              <h4 className="text-2xl font-bold mb-4 tracking-tight">{feature.title}</h4>
              <p className="text-muted-foreground leading-relaxed font-medium">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
