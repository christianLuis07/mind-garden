"use client";

import { useState, useEffect, useRef } from "react";
import { Play, Pause, RotateCcw, Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BreathingTechnique } from "@/types/breathing";
import { breathingAPI } from "@/lib/breathing-api";

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

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);

  const phaseConfig = {
    inhale: {
      duration: technique.pattern.inhale,
      color: "bg-green-500",
      text: "Tarik Napas",
      instruction: "Tarik napas perlahan melalui hidung",
    },
    hold: {
      duration: technique.pattern.hold,
      color: "bg-blue-500",
      text: "Tahan",
      instruction: "Tahan napas sejenak",
    },
    exhale: {
      duration: technique.pattern.exhale,
      color: "bg-purple-500",
      text: "Buang Napas",
      instruction: "Hembuskan perlahan melalui mulut",
    },
    holdAfterExhale: {
      duration: technique.pattern.holdAfterExhale,
      color: "bg-gray-500",
      text: "Tahan",
      instruction: "Tetap rileks dan tahan napas",
    },
  };

  const moveToNextPhase = () => {
    const phases: TimerPhase[] = [
      "inhale",
      "hold",
      "exhale",
      "holdAfterExhale",
    ];
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
        case "inhale":
          frequency = 300;
          break;
        case "exhale":
          frequency = 150;
          break;
        case "hold":
        case "holdAfterExhale":
          frequency = 250;
          duration = 0.1;
          break;
      }

      oscillator.type = "sine";
      oscillator.frequency.value = frequency;

      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(
        0.01,
        audioContext.currentTime + duration
      );

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.start();
      oscillator.stop(audioContext.currentTime + duration);

      oscillatorRef.current = oscillator;
    } catch (error) {
      console.error("Error playing sound:", error);
    }
  };

  useEffect(() => {
    // Initialize audio context on user interaction
    const initAudio = () => {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext ||
          (window as any).webkitAudioContext)();
      }
    };

    document.addEventListener("click", initAudio, { once: true });

    return () => {
      document.removeEventListener("click", initAudio);
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  useEffect(() => {
    if (!isPlaying) return;

    timerRef.current = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          moveToNextPhase();
          return phaseConfig[currentPhase].duration;
        }
        return prevTime - 1;
      });

      setTotalTime((prev) => prev + 1);
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isPlaying, currentPhase]);

  const startTimer = () => {
    setIsPlaying(true);
    setTimeLeft(phaseConfig.inhale.duration);
    setCurrentPhase("inhale");
    playPhaseSound("inhale");
  };

  const pauseTimer = () => {
    setIsPlaying(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const resetTimer = () => {
    pauseTimer();
    setTimeLeft(phaseConfig.inhale.duration);
    setCurrentPhase("inhale");
    setCycleCount(0);
    setTotalTime(0);
  };

  const handleComplete = async (duration: number, calmLevel?: number) => {
    pauseTimer();

    console.log("Session completed:", {
      duration,
      calmLevel,
      technique: technique.name,
    });

    try {
      const response = await breathingAPI.createSession({
        duration,
        technique: technique.name,
        calmLevel,
      });

      console.log("Session saved:", response.data);
    } catch (error) {
      console.error("Failed to save session:", error);
    }

    onComplete(duration, calmLevel);
  };

  const handleCompleteClick = () => {
    pauseTimer();

    // Ask for calm level rating
    const calmLevelInput = prompt(
      "Seberapa tenang perasaanmu sekarang? (skala 1-10)"
    );
    const calmLevel = calmLevelInput ? parseInt(calmLevelInput) : undefined;

    if (calmLevel && calmLevel >= 1 && calmLevel <= 10) {
      saveSession(totalTime, calmLevel);
    } else {
      saveSession(totalTime);
    }
  };

  const saveSession = async (duration: number, calmLevel?: number) => {
    console.log("Session completed:", {
      duration,
      calmLevel,
      technique: technique.name,
    });

    try {
      const response = await breathingAPI.createSession({
        duration,
        technique: technique.name,
        calmLevel,
      });

      console.log("Session saved:", response.data);
    } catch (error) {
      console.error("Failed to save session:", error);
    }

    onComplete(duration, calmLevel);
  };

  const currentConfig = phaseConfig[currentPhase];
  const progress = (timeLeft / currentConfig.duration) * 100;

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          {technique.name}
        </h2>
        <p className="text-gray-600">Ikuti panduan pola pernapasan</p>
      </div>

      {/* Breathing Visual */}
      <div className="flex justify-center">
        <div className="relative w-64 h-64">
          <div className="absolute inset-0 flex items-center justify-center">
            <div
              className={`rounded-full transition-all duration-1000 ease-in-out ${
                currentPhase === "inhale"
                  ? "w-48 h-48 opacity-100"
                  : currentPhase === "exhale"
                  ? "w-32 h-32 opacity-80"
                  : "w-40 h-40 opacity-90"
              } ${currentConfig.color}`}
              style={{
                transition: "all 1s ease-in-out",
              }}
            />
          </div>

          {/* Progress Indicator */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-56 h-56 rounded-full border-4 border-gray-200">
              <div
                className="w-full h-full rounded-full border-4 border-green-500 border-t-transparent border-r-transparent transition-all duration-1000 ease-linear"
                style={{
                  transform: `rotate(${360 - (progress / 100) * 360}deg)`,
                }}
              />
            </div>
          </div>

          {/* Center Content */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-4xl font-bold mb-2 text-gray-800">
                {timeLeft}s
              </div>
              <div className="text-lg font-semibold text-gray-700">
                {currentConfig.text}
              </div>
              <div className="text-sm text-gray-600 mt-1">
                {currentConfig.instruction}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 text-center">
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="text-2xl font-bold text-gray-900">{cycleCount}</div>
          <div className="text-sm text-gray-600">Siklus</div>
        </div>
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="text-2xl font-bold text-gray-900">
            {Math.floor(totalTime / 60)}:
            {(totalTime % 60).toString().padStart(2, "0")}
          </div>
          <div className="text-sm text-gray-600">Durasi</div>
        </div>
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="text-2xl font-bold text-gray-900 capitalize">
            {technique.difficulty}
          </div>
          <div className="text-sm text-gray-600">Level</div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex justify-center space-x-4">
        <Button
          variant="outline"
          onClick={() => setIsSoundEnabled(!isSoundEnabled)}
        >
          {isSoundEnabled ? (
            <Volume2 className="w-4 h-4" />
          ) : (
            <VolumeX className="w-4 h-4" />
          )}
        </Button>

        {!isPlaying ? (
          <Button
            onClick={startTimer}
            className="bg-green-600 hover:bg-green-700"
          >
            <Play className="w-4 h-4 mr-2" />
            Mulai
          </Button>
        ) : (
          <Button onClick={pauseTimer} variant="outline">
            <Pause className="w-4 h-4 mr-2" />
            Jeda
          </Button>
        )}

        <Button onClick={resetTimer} variant="outline">
          <RotateCcw className="w-4 h-4 mr-2" />
          Ulang
        </Button>

        <Button onClick={handleCompleteClick} variant="outline">
          Selesai
        </Button>

        <Button onClick={onBack} variant="ghost">
          Kembali
        </Button>
      </div>

      {/* Pattern Guide */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="font-semibold text-gray-900 mb-3">Pola Pernapasan</h4>
        <div className="grid grid-cols-4 gap-4 text-center">
          {Object.entries(phaseConfig).map(([phase, config]) => (
            <div
              key={phase}
              className={`p-3 rounded-lg transition-colors ${
                currentPhase === phase ? "bg-white shadow-sm border" : ""
              }`}
            >
              <div
                className={`text-lg font-semibold ${config.color.replace(
                  "bg-",
                  "text-"
                )}`}
              >
                {config.duration}s
              </div>
              <div className="text-sm text-gray-600 capitalize">
                {config.text}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Debug Info - Hapus di production */}
      <div className="text-xs text-gray-400 text-center">
        Debug: Fase: {currentPhase}, Sisa Waktu: {timeLeft}s, Siklus:{" "}
        {cycleCount}
      </div>
    </div>
  );
}
