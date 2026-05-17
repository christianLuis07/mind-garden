"use client";

import { useState } from "react";
import { TechniquesList } from "@/components/breathing/techniques-list";
import { BreathingTimer } from "@/components/breathing/breathing-timer";
import { SessionHistory } from "@/components/breathing/session-history";
import { BreathingAnalyticsComponent } from "@/components/breathing/breathing-analytics";
import { BreathingTechnique } from "@/types/breathing";
import { Wind, BarChart3, History, Play, List, Sparkles, Waves } from "lucide-react";
import { Button } from "@/components/ui/button";
import { breathingAPI } from "@/lib/breathing-api";
import { mockBreathingTechniques } from "@/lib/breathing/breathing-data";
import { motion, AnimatePresence } from "framer-motion";
import { ProtectedRoute } from "@/components/layout/protected-route";

type ViewMode = "techniques" | "timer" | "history" | "analytics";

export default function BreathingPage() {
  const [currentView, setCurrentView] = useState<ViewMode>("techniques");
  const [selectedTechnique, setSelectedTechnique] =
    useState<BreathingTechnique | null>(null);

  const handleStartSession = (technique: BreathingTechnique) => {
    setSelectedTechnique(technique);
    setCurrentView("timer");
  };

  const handleCompleteSession = async (
    duration: number,
    calmLevel?: number
  ) => {
    if (!selectedTechnique) return;

    try {
      await breathingAPI.createSession({
        duration,
        technique: selectedTechnique.name,
        calmLevel,
      });

      setCurrentView("history");
      setSelectedTechnique(null);
    } catch (error) {
      console.error("Failed to save session:", error);
    }
  };

  const handleBackToTechniques = () => {
    setCurrentView("techniques");
    setSelectedTechnique(null);
  };

  const navigationItems = [
    { id: "techniques" as ViewMode, label: "Pilih Teknik", icon: Wind },
    { id: "history" as ViewMode, label: "Riwayat Sesi", icon: History },
    { id: "analytics" as ViewMode, label: "Wawasan", icon: BarChart3 },
  ];

  return (
    <ProtectedRoute>
      <div className="space-y-10 pb-20">
        {/* Creative Header - Sage Serenity Version */}
        <div className="relative overflow-hidden rounded-[3rem] bg-primary/10 p-8 md:p-12 border border-primary/5">
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-primary/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 bg-secondary/30 rounded-full blur-3xl animate-pulse delay-700" />
          
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
            <div className="max-w-2xl">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="inline-flex items-center space-x-2 bg-white/50 dark:bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 mb-6"
              >
                <Waves className="w-4 h-4 text-primary" />
                <span className="text-xs font-bold uppercase tracking-widest text-primary">Latihan Napas</span>
              </motion.div>
              
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-4xl md:text-5xl font-extrabold text-foreground tracking-tight mb-4"
              >
                Ambil Napas, <span className="text-primary italic">Lepaskan Penat</span>
              </motion.h1>
              
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-lg text-muted-foreground font-medium leading-relaxed"
              >
                Luangkan beberapa menit untuk bernapas dengan sadar. Bantu pikiranmu kembali tenang, jernih, dan lebih fokus.
              </motion.p>
            </div>

            <motion.div
               initial={{ opacity: 0, x: 20 }}
               animate={{ opacity: 1, x: 0 }}
               transition={{ delay: 0.3 }}
            >
               {currentView === "techniques" && (
                 <Button
                   onClick={() => {
                     setSelectedTechnique(mockBreathingTechniques[0]);
                     setCurrentView("timer");
                   }}
                   className="h-16 px-8 rounded-2xl bg-primary hover:bg-primary/90 text-white font-bold text-lg shadow-xl shadow-primary/20 group"
                 >
                   <Play className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" />
                   Mulai Cepat
                 </Button>
               )}
            </motion.div>
          </div>
        </div>

        {/* Navigation Tabs - Unified Style */}
        <AnimatePresence mode="wait">
          {currentView !== "timer" && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex w-full md:w-fit bg-card/50 backdrop-blur-md p-1.5 rounded-[2rem] shadow-xl shadow-primary/5 mx-auto md:mx-0 border border-border/40"
            >
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentView === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setCurrentView(item.id)}
                    className={`flex items-center space-x-2 px-6 py-3 rounded-full transition-all duration-500 text-sm font-bold uppercase tracking-widest relative ${
                      isActive
                        ? "text-white"
                        : "text-muted-foreground hover:text-primary"
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="active-breathing-tab"
                        className="absolute inset-0 bg-primary rounded-full shadow-lg shadow-primary/20"
                        transition={{ type: "spring", duration: 0.6 }}
                      />
                    )}
                    <Icon className="w-4 h-4 relative z-10" />
                    <span className="relative z-10">{item.label}</span>
                  </button>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Content Area */}
        <motion.div 
           key={currentView}
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.5 }}
        >
          {currentView === "techniques" && (
            <TechniquesList onStartSession={handleStartSession} />
          )}

          {currentView === "timer" && selectedTechnique && (
            <div className="py-10">
              <BreathingTimer
                technique={selectedTechnique}
                onComplete={handleCompleteSession}
                onBack={handleBackToTechniques}
              />
            </div>
          )}

          {currentView === "history" && <SessionHistory />}

          {currentView === "analytics" && <BreathingAnalyticsComponent />}
        </motion.div>
      </div>
    </ProtectedRoute>
  );
}
