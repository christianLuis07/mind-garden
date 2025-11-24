"use client";

import { useState } from "react";
import { TechniquesList } from "@/components/breathing/techniques-list";
import { BreathingTimer } from "@/components/breathing/breathing-timer";
import { SessionHistory } from "@/components/breathing/session-history";
import { BreathingAnalyticsComponent } from "@/components/breathing/breathing-analytics";
import { BreathingTechnique } from "@/types/breathing";
import { Wind, BarChart3, History, Play, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { breathingAPI } from "@/lib/breathing-api";
import { mockBreathingTechniques } from "@/lib/breathing/breathing-data";

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

      setCurrentView("techniques");
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
    { id: "techniques" as ViewMode, label: "Teknik", icon: List },
    { id: "history" as ViewMode, label: "Riwayat", icon: History },
    { id: "analytics" as ViewMode, label: "Analisis", icon: BarChart3 },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div className="flex items-center space-x-4 mb-4 lg:mb-0">
            <div className="p-3 bg-blue-100 rounded-2xl">
              <Wind className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Latihan Pernapasan
              </h1>
              <p className="text-gray-600 mt-1">
                Tenangkan pikiran dengan panduan teknik pernapasan
              </p>
            </div>
          </div>

          {currentView === "techniques" && (
            <Button
              onClick={() => {
                setSelectedTechnique(mockBreathingTechniques[0]);
                setCurrentView("timer");
              }}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Play className="w-4 h-4 mr-2" />
              Quick Start
            </Button>
          )}
        </div>

        {/* Navigation */}
        <div className="flex space-x-1 bg-white rounded-2xl p-2 border border-gray-200 mb-8">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-colors flex-1 justify-center ${
                  currentView === item.id
                    ? "bg-blue-600 text-white"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="space-y-6">
          {currentView === "techniques" && (
            <TechniquesList onStartSession={handleStartSession} />
          )}

          {currentView === "timer" && selectedTechnique && (
            <BreathingTimer
              technique={selectedTechnique}
              onComplete={handleCompleteSession}
              onBack={handleBackToTechniques}
            />
          )}

          {currentView === "timer" && !selectedTechnique && (
            <div className="text-center py-12">
              <Wind className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Pilih Teknik Pernapasan
              </h3>
              <p className="text-gray-600 mb-4">
                Silakan pilih teknik pernapasan untuk memulai sesi Anda
              </p>
              <Button
                onClick={handleBackToTechniques}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <List className="w-4 h-4 mr-2" />
                Lihat Semua Teknik
              </Button>
            </div>
          )}

          {currentView === "history" && <SessionHistory />}

          {currentView === "analytics" && <BreathingAnalyticsComponent />}
        </div>
      </div>
    </div>
  );
}
