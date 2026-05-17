"use client";

import { useState, useEffect, useRef } from "react";
import { PlayCircle, PauseCircle, RotateCcw, Volume2, VolumeX, ArrowLeft, CheckCircle2, Sparkles, Wind, Waves } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BreathingTechnique } from "@/types/breathing";
import { breathingAPI } from "@/lib/breathing-api";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface BreathingTimerProps {
  technique: BreathingTechnique;
  onComplete: (duration: number, calmLevel?: number) => void;
  onBack: () => void;
}

type TimerPhase = "inhale" | "hold" | "exhale" | "holdAfterExhale";

export function BreathingTimer({
  technique,
  onComplete,
  onBack,
}: BreathingTimerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [currentPhase, setCurrentPhase] = useState<TimerPhase>("inhale");
  const [cycleCount, setCycleCount] = useState(0);
  const [totalTime, setTotalTime] = useState(0);
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);
  const [showRating, setShowRating] = useState(false);
  const [selectedRating, setSelectedRating] = useState<number | null>(null);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);

  const phaseConfig = {
    inhale: {
      duration: technique.pattern.inhale,
      color: "bg-primary",
      glow: "shadow-[0_0_50px_rgba(122,154,126,0.4)]",
      text: "Tarik Napas",
      instruction: "Hirup ketenangan melalui hidung",
      scale: 1.4,
    },
    hold: {
      duration: technique.pattern.hold,
      color: "bg-secondary",
      glow: "shadow-[0_0_50px_rgba(233,220,201,0.4)]",
      text: "Tahan",
      instruction: "Rasakan udara memenuhi dirimu",
      scale: 1.4,
    },
    exhale: {
      duration: technique.pattern.exhale,
      color: "bg-primary/60",
      glow: "shadow-[0_0_50px_rgba(122,154,126,0.2)]",
      text: "Hembuskan",
      instruction: "Lepaskan semua beban perlahan",
      scale: 1.0,
    },
    holdAfterExhale: {
      duration: technique.pattern.holdAfterExhale,
      color: "bg-slate-400/40",
      glow: "shadow-[0_0_50px_rgba(148,163,184,0.2)]",
      text: "Tahan",
      instruction: "Nikmati keheningan sejenak",
      scale: 1.0,
    },
  };

  const moveToNextPhase = () => {
    const phases: TimerPhase[] = ["inhale", "hold", "exhale", "holdAfterExhale"];
    const currentIndex = phases.indexOf(currentPhase);
    const nextIndex = (currentIndex + 1) % phases.length;
    const nextPhase = phases[nextIndex];

    setCurrentPhase(nextPhase);
    setTimeLeft(phaseConfig[nextPhase].duration);
    playPhaseSound(nextPhase);

    if (nextPhase === "inhale") {
      setCycleCount((prev) => prev + 1);
    }
  };

  const playPhaseSound = (phase: TimerPhase) => {
    if (!isSoundEnabled || !audioContextRef.current) return;
    try {
      if (oscillatorRef.current) {
        oscillatorRef.current.stop();
        oscillatorRef.current.disconnect();
      }
      const audioContext = audioContextRef.current;
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      let frequency = 200;
      let duration = 0.3;
      switch (phase) {
        case "inhale": frequency = 280; break;
        case "exhale": frequency = 180; break;
        case "hold":
        case "holdAfterExhale": frequency = 240; duration = 0.1; break;
      }
      oscillator.type = "sine";
      oscillator.frequency.value = frequency;
      gainNode.gain.setValueAtTime(0.05, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + duration);
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      oscillator.start();
      oscillator.stop(audioContext.currentTime + duration);
      oscillatorRef.current = oscillator;
    } catch (e) {}
  };

  useEffect(() => {
    const initAudio = () => {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
    };
    document.addEventListener("mousedown", initAudio, { once: true });
    return () => {
      document.removeEventListener("mousedown", initAudio);
      if (timerRef.current) clearInterval(timerRef.current);
      if (audioContextRef.current) audioContextRef.current.close();
    };
  }, []);

  useEffect(() => {
    if (!isPlaying) return;
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          moveToNextPhase();
          return phaseConfig[currentPhase].duration;
        }
        return prev - 1;
      });
      setTotalTime((prev) => prev + 1);
    }, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [isPlaying, currentPhase]);

  const startTimer = () => {
    setIsPlaying(true);
    if (timeLeft === 0) setTimeLeft(phaseConfig.inhale.duration);
    playPhaseSound(currentPhase);
  };

  const pauseTimer = () => setIsPlaying(false);

  const resetTimer = () => {
    pauseTimer();
    setTimeLeft(phaseConfig.inhale.duration);
    setCurrentPhase("inhale");
    setCycleCount(0);
    setTotalTime(0);
  };

  const handleSaveSession = async (rating?: number) => {
    try {
      await breathingAPI.createSession({
        duration: totalTime,
        technique: technique.name,
        calmLevel: rating,
      });
    } catch (e) {}
    onComplete(totalTime, rating);
  };

  const currentConfig = phaseConfig[currentPhase];

  if (showRating) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-xl mx-auto text-center space-y-10 py-12 glass-card rounded-[3rem] p-10 border-none shadow-2xl shadow-primary/5"
      >
        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto text-primary">
          <CheckCircle2 className="w-12 h-12" />
        </div>
        <div>
          <h2 className="text-3xl font-bold text-foreground mb-3 tracking-tight">Sesi Selesai</h2>
          <p className="text-muted-foreground font-medium italic">Bagaimana perasaanmu sekarang?</p>
        </div>
        
        <div className="flex justify-center flex-wrap gap-3">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
            <button
              key={num}
              onClick={() => setSelectedRating(num)}
              className={cn(
                "w-12 h-12 rounded-2xl text-sm font-bold transition-all duration-300",
                selectedRating === num
                  ? "bg-primary text-white shadow-xl scale-110"
                  : "bg-muted/40 text-muted-foreground hover:bg-muted/60"
              )}
            >
              {num}
            </button>
          ))}
        </div>
        
        <div className="flex justify-between items-center px-4 text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground/60">
          <span>Kurang Tenang</span>
          <span>Sangat Tenang</span>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 pt-6">
           <Button variant="ghost" onClick={() => handleSaveSession()} className="flex-1 h-14 rounded-2xl font-bold">
             Lewati
           </Button>
           <Button 
             onClick={() => handleSaveSession(selectedRating || undefined)} 
             disabled={selectedRating === null} 
             className="flex-1 h-14 rounded-2xl bg-primary text-white font-bold shadow-xl shadow-primary/20"
           >
             Simpan Penilaian
           </Button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto flex flex-col items-center">
      {/* Immersive Timer UI */}
      <div className="relative w-80 h-80 md:w-[400px] md:h-[400px] flex items-center justify-center mb-16">
        {/* Background Ripple Animation */}
        <AnimatePresence>
          {isPlaying && (
            <>
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 2, opacity: 0 }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeOut" }}
                className={cn("absolute inset-0 rounded-full border-2 border-primary/20", currentConfig.color.replace('bg-', 'border-'))}
              />
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 2.5, opacity: 0 }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeOut", delay: 1 }}
                className={cn("absolute inset-0 rounded-full border-2 border-primary/10", currentConfig.color.replace('bg-', 'border-'))}
              />
            </>
          )}
        </AnimatePresence>

        {/* The Breathing Orb */}
        <motion.div
          animate={{
            scale: currentConfig.scale,
            backgroundColor: isPlaying ? undefined : "rgba(122, 154, 126, 0.1)",
          }}
          transition={{ duration: currentConfig.duration, ease: "easeInOut" }}
          className={cn(
            "w-48 h-48 md:w-64 md:h-64 rounded-full flex flex-col items-center justify-center relative z-10 transition-all duration-1000 shadow-2xl",
            currentConfig.color,
            currentConfig.glow
          )}
        >
          <div className="text-white text-center">
             <motion.div 
               key={currentPhase}
               initial={{ opacity: 0, y: 5 }}
               animate={{ opacity: 1, y: 0 }}
               className="text-4xl md:text-6xl font-black mb-1"
             >
               {timeLeft}
             </motion.div>
             <div className="text-[10px] md:text-xs font-black uppercase tracking-[0.2em] opacity-80">detik</div>
          </div>
        </motion.div>

        {/* Outer Ring / Progress */}
        <svg className="absolute inset-0 w-full h-full -rotate-90">
          <circle
            cx="50%"
            cy="50%"
            r="48%"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="text-muted/10"
          />
          <motion.circle
            cx="50%"
            cy="50%"
            r="48%"
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
            strokeDasharray="100 100"
            animate={{ strokeDashoffset: isPlaying ? [100, 0] : 100 }}
            transition={{ duration: currentConfig.duration, ease: "linear" }}
            className={cn("text-primary transition-colors duration-1000", currentConfig.color.replace('bg-', 'text-'))}
          />
        </svg>
      </div>

      {/* Instruction Overlay */}
      <div className="text-center space-y-3 mb-12 relative z-10">
        <motion.h3 
          key={currentConfig.text}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-3xl md:text-4xl font-black text-foreground tracking-tight"
        >
          {currentConfig.text}
        </motion.h3>
        <p className="text-muted-foreground font-medium italic">
          {currentConfig.instruction}
        </p>
      </div>

      {/* Stats Bar */}
      <div className="w-full max-w-lg grid grid-cols-3 gap-4 mb-12">
         {[
           { label: "Siklus", value: cycleCount, icon: Wind },
           { label: "Durasi", value: `${Math.floor(totalTime / 60)}:${(totalTime % 60).toString().padStart(2, '0')}`, icon: Waves },
           { label: "Level", value: technique.difficulty, icon: Sparkles }
         ].map((item, i) => (
           <div key={i} className="glass-card p-4 rounded-3xl text-center border-none shadow-xl shadow-primary/5">
              <item.icon className="w-4 h-4 text-primary mx-auto mb-2 opacity-40" />
              <div className="text-lg font-bold text-foreground capitalize">{item.value}</div>
              <div className="text-[9px] font-extrabold uppercase tracking-widest text-muted-foreground">{item.label}</div>
           </div>
         ))}
      </div>

      {/* Control Bar - Floating */}
      <div className="flex items-center gap-4 bg-card/50 backdrop-blur-xl p-3 rounded-[2.5rem] shadow-2xl shadow-primary/10 border border-border/40">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsSoundEnabled(!isSoundEnabled)}
          className="w-14 h-14 rounded-full hover:bg-primary/10 text-muted-foreground hover:text-primary transition-all"
        >
          {isSoundEnabled ? <Volume2 className="w-6 h-6" /> : <VolumeX className="w-6 h-6" />}
        </Button>

        {!isPlaying ? (
          <Button
            onClick={startTimer}
            className="w-20 h-20 rounded-full bg-primary text-white shadow-xl shadow-primary/30 hover:scale-110 active:scale-95 transition-all flex items-center justify-center"
          >
            <PlayCircle className="w-10 h-10 fill-white/20" />
          </Button>
        ) : (
          <Button 
            onClick={pauseTimer} 
            className="w-20 h-20 rounded-full bg-card border-4 border-primary text-primary shadow-xl hover:scale-110 active:scale-95 transition-all flex items-center justify-center"
          >
            <PauseCircle className="w-10 h-10 fill-primary/10" />
          </Button>
        )}

        <Button 
          variant="ghost"
          size="icon"
          onClick={resetTimer} 
          className="w-14 h-14 rounded-full hover:bg-primary/10 text-muted-foreground"
        >
          <RotateCcw className="w-6 h-6" />
        </Button>

        <div className="h-8 w-px bg-border/50 mx-2" />

        <Button onClick={() => setShowRating(true)} variant="ghost" className="px-6 h-14 rounded-2xl font-bold text-xs uppercase tracking-widest text-primary hover:bg-primary/10">
          Selesai
        </Button>
      </div>

      <button
        onClick={onBack}
        className="mt-8 flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-[0.2em] text-muted-foreground hover:text-primary transition-colors group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Kembali ke Teknik
      </button>
    </div>
  );
}
