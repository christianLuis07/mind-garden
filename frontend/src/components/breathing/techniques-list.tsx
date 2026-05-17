"use client";

import { useState, useEffect } from "react";
import { Play, Clock, Target, Star, Award, Shield, Compass, Zap, PlayCircle, ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { breathingAPI } from "@/lib/breathing-api";
import { BreathingTechnique } from "@/types/breathing";
import { mockBreathingTechniques } from "@/lib/breathing/breathing-data";
import { motion } from "framer-motion";

interface TechniquesListProps {
  onStartSession: (technique: BreathingTechnique) => void;
}

const difficultyConfig = {
  beginner: { 
    label: "Pemula", 
    icon: Shield, 
    color: "text-emerald-500", 
    bg: "bg-emerald-500/10", 
    border: "border-emerald-500/20" 
  },
  intermediate: { 
    label: "Menengah", 
    icon: Compass, 
    color: "text-blue-500", 
    bg: "bg-blue-500/10", 
    border: "border-blue-500/20" 
  },
  advanced: { 
    label: "Mahir", 
    icon: Zap, 
    color: "text-purple-500", 
    bg: "bg-purple-500/10", 
    border: "border-purple-500/20" 
  },
};

export function TechniquesList({ onStartSession }: TechniquesListProps) {
  const [techniques, setTechniques] = useState<BreathingTechnique[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTechniques();
  }, []);

  const fetchTechniques = async () => {
    try {
      setLoading(true);
      const response = await breathingAPI.getTechniques();
      if (response.data && response.data.success && Array.isArray(response.data.data?.techniques)) {
        setTechniques(response.data.data.techniques);
      } else {
        setTechniques(mockBreathingTechniques);
      }
    } catch (error) {
      setTechniques(mockBreathingTechniques);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
        <p className="text-muted-foreground font-medium animate-pulse italic">Menyiapkan ruang udara...</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
      {techniques.map((technique, index) => {
        const config = difficultyConfig[technique.difficulty as keyof typeof difficultyConfig] || difficultyConfig.beginner;
        const DiffIcon = config.icon;

        return (
          <motion.div
            key={technique.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="group h-full bg-card rounded-[2.5rem] border-none shadow-xl shadow-blue-500/5 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 overflow-hidden">
              <CardContent className="p-8 flex flex-col h-full">
                <div className="flex items-start justify-between mb-6">
                  <div className={`w-14 h-14 ${config.bg} rounded-2xl flex items-center justify-center transition-transform duration-500 group-hover:rotate-6`}>
                    <DiffIcon className={`w-7 h-7 ${config.color}`} />
                  </div>
                  <div className={`px-4 py-1.5 rounded-full border ${config.border} ${config.bg} ${config.color} text-[10px] font-extrabold uppercase tracking-widest`}>
                    {config.label}
                  </div>
                </div>

                <h3 className="text-2xl font-bold text-foreground mb-3 tracking-tight group-hover:text-blue-500 transition-colors">
                  {technique.name}
                </h3>

                <p className="text-muted-foreground text-sm leading-relaxed mb-8">
                  {technique.description}
                </p>

                {/* Breathing Pattern Visualization */}
                <div className="bg-muted/30 rounded-3xl p-6 mb-8 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-blue-500/20" />
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { val: technique.pattern.inhale, label: "Tarik" },
                      { val: technique.pattern.hold, label: "Tahan" },
                      { val: technique.pattern.exhale, label: "Buang" },
                      { val: technique.pattern.holdAfterExhale, label: "Tahan" }
                    ].map((p, i) => (
                      <div key={i} className="text-center">
                        <div className="text-lg font-black text-foreground">{p.val}s</div>
                        <div className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">{p.label}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Benefits List */}
                <div className="mb-8 flex-1">
                  <h4 className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-[0.2em] mb-4">Manfaat Latihan</h4>
                  <ul className="space-y-3">
                    {technique.benefits.slice(0, 3).map((benefit, i) => (
                      <li key={i} className="flex items-center text-sm font-medium text-foreground/80">
                        <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mr-3 shadow-[0_0_8px_rgba(96,165,250,0.6)]" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex items-center justify-between pt-6 border-t border-border/50">
                  <div className="flex items-center space-x-2 text-muted-foreground font-bold">
                    <Clock className="w-4 h-4 text-blue-400" />
                    <span className="text-xs uppercase tracking-widest">{Math.round(technique.duration / 60)} menit</span>
                  </div>
                  <Button
                    onClick={() => onStartSession(technique)}
                    className="h-12 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-lg shadow-blue-500/20 group/btn"
                  >
                    Mulai Sesi
                    <PlayCircle className="w-4 h-4 ml-2 group-hover/btn:scale-110 transition-transform" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}
