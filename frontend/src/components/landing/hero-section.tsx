"use client";

import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Heart, Wind, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden pt-20 text-foreground">
      {/* Background Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-[120px] animate-pulse delay-700" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center space-x-2 bg-white/40 dark:bg-white/5 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/20 mb-8"
          >
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-semibold tracking-wide">Ruang aman untuk kesehatan mentalmu</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-5xl md:text-8xl font-black tracking-tighter mb-8 leading-[0.9]"
          >
            Rawat <span className="text-primary italic">Ketenanganmu</span> <br />
            Mulai Hari Ini
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-lg md:text-2xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed font-medium"
          >
            Pahami dirimu lebih dalam melalui jurnal harian, pantau suasana hati, dan temukan dukungan di komunitas yang peduli.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6"
          >
            <Link href="/register">
              <Button size="lg" className="rounded-2xl px-10 py-8 text-xl font-bold bg-primary hover:bg-primary/90 text-white shadow-2xl shadow-primary/20 transition-all hover:scale-105 active:scale-95">
                Coba Gratis <ArrowRight className="ml-2 w-6 h-6" />
              </Button>
            </Link>
            <Link href="#features">
              <Button variant="outline" size="lg" className="rounded-2xl px-10 py-8 text-xl font-bold border-2 backdrop-blur-sm transition-all hover:bg-white/30 active:scale-95">
                Kenali Fitur
              </Button>
            </Link>
          </motion.div>

          {/* Quick Metrics */}
          <div className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-6">
             {[
               { icon: Heart, label: "Self Care", color: "text-rose-500" },
               { icon: Wind, label: "Rileks", color: "text-sky-500" },
               { icon: Zap, label: "Fokus", color: "text-amber-500" },
               { icon: Sparkles, label: "Bahagia", color: "text-primary" }
             ].map((item, index) => (
               <motion.div
                 key={index}
                 initial={{ opacity: 0, scale: 0.8 }}
                 animate={{ opacity: 1, scale: 1 }}
                 transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                 className="glass-card p-6 rounded-[2rem] flex flex-col items-center justify-center space-y-3 hover:shadow-2xl transition-all group"
               >
                 <div className="w-12 h-12 rounded-2xl bg-muted/50 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <item.icon className={cn("w-6 h-6", item.color)} />
                 </div>
                 <span className="text-xs font-black uppercase tracking-[0.2em] opacity-60">{item.label}</span>
               </motion.div>
             ))}
          </div>
        </div>
      </div>
    </section>
  );
}
