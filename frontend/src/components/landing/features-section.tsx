"use client";

import { motion } from "framer-motion";
import { BookOpen, Smile, Wind, Users, BarChart3, ShieldCheck } from "lucide-react";

const features = [
  {
    title: "Reflective Journaling",
    description: "A quiet space to write what is on your mind. Automated sentiment analysis helps you spot subtle emotional shifts over time.",
    icon: BookOpen,
    color: "bg-blue-500/10 text-blue-600",
  },
  {
    title: "Daily Mood Tracking",
    description: "Check in with how you feel in seconds. Pair moods with lifestyle factors like sleep and stress to uncover clear patterns.",
    icon: Smile,
    color: "bg-orange-500/10 text-orange-600",
  },
  {
    title: "Guided Breathwork",
    description: "Evidence-backed pacing techniques including Box Breathing and 4-7-8 to downshift your nervous system whenever tension strikes.",
    icon: Wind,
    color: "bg-teal-500/10 text-teal-600",
  },
  {
    title: "Support Communities",
    description: "Safe, moderated spaces to connect with peers. Share reflections anonymously or openly with people on similar paths.",
    icon: Users,
    color: "bg-purple-500/10 text-purple-600",
  },
  {
    title: "Visual Analytics",
    description: "Clear charts and trend calendars that turn your daily check-ins into actionable awareness of your well-being habits.",
    icon: BarChart3,
    color: "bg-green-500/10 text-green-600",
  },
  {
    title: "Private by Default",
    description: "Your journals and check-ins belong solely to you. Protected with robust encryption, strict auth, and zero data selling.",
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
            Features
          </motion.h2>
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-black mb-6 tracking-tight"
          >
            Thoughtful tools for <span className="text-primary italic font-serif">everyday peace of mind</span>
          </motion.h3>
          <motion.p
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             transition={{ delay: 0.2 }}
             className="text-lg md:text-xl text-muted-foreground font-medium"
          >
            MindGarden combines practical check-ins, mindful pauses, and peer support to help you build lasting emotional resilience.
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
