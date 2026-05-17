"use client";

import { useState } from "react";
import { ProtectedRoute } from "@/components/layout/protected-route";
import { MoodInputForm } from "@/components/mood/mood-input-form";
import { MoodHistory } from "@/components/mood/mood-history";
import { MoodAnalytics } from "@/components/mood/mood-analytics";
import { MoodCalendar } from "@/components/mood/mood-calendar";
import { motion } from "framer-motion";
import { Sparkles, Flower2, Heart, Coffee } from "lucide-react";

export default function MoodPage() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleMoodLogged = () => {
    setRefreshTrigger((prev) => prev + 1);

    setTimeout(() => {
      setRefreshTrigger((prev) => prev + 1);
    }, 500);
  };

  return (
    <ProtectedRoute>
      <div className="space-y-12 pb-20">
        {/* Creative Header */}
        <div className="relative overflow-hidden rounded-[3rem] bg-primary/10 p-8 md:p-12">
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-primary/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 bg-secondary/30 rounded-full blur-3xl animate-pulse delay-1000" />
          
          <div className="relative z-10 max-w-2xl">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center space-x-2 bg-white/50 dark:bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 mb-6"
            >
              <Heart className="w-4 h-4 text-primary" />
              <span className="text-xs font-bold uppercase tracking-widest text-primary">Jurnal Perasaan</span>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl font-extrabold text-foreground tracking-tight mb-4"
            >
              Bagaimana <span className="text-primary italic">Kabarmu Hari Ini?</span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg text-muted-foreground font-medium leading-relaxed"
            >
              Perasaanmu layak untuk didengarkan. Mari catat apa yang sedang kamu rasakan agar kamu bisa lebih mengenal dirimu sendiri.
            </motion.p>
          </div>
        </div>

        {/* Mood Input & Calendar */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-start">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="xl:col-span-2"
          >
            <MoodInputForm onSuccess={handleMoodLogged} />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="h-full"
          >
            <div className="glass-card rounded-[2.5rem] p-6 h-full border-none shadow-xl shadow-primary/5">
               <div className="flex items-center space-x-3 mb-6 px-2">
                 <div className="w-1.5 h-6 bg-primary rounded-full" />
                 <h2 className="text-xl font-bold text-foreground tracking-tight">Kalender Perasaan</h2>
               </div>
               <MoodCalendar />
            </div>
          </motion.div>
        </div>

        {/* Analytics Section */}
        <div className="space-y-6">
          <div className="flex items-center space-x-3">
             <div className="w-1.5 h-8 bg-primary rounded-full" />
             <h2 className="text-2xl font-bold text-foreground tracking-tight">Statistik Emosimu</h2>
          </div>
          <MoodAnalytics refreshTrigger={refreshTrigger} />
        </div>

        {/* History */}
        <div className="space-y-6">
          <div className="flex items-center space-x-3">
             <div className="w-1.5 h-8 bg-primary rounded-full" />
             <h2 className="text-2xl font-bold text-foreground tracking-tight">Catatan Kemarin</h2>
          </div>
          <MoodHistory refreshTrigger={refreshTrigger} />
        </div>
      </div>
    </ProtectedRoute>
  );
}
