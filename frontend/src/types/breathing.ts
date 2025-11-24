export interface BreathingSession {
  id: string;
  userId: string;
  duration: number;
  technique: string;
  completed: boolean;
  calmLevel?: number;
  createdAt: string;
}

export interface BreathingAnalytics {
  totalSessions: number;
  totalDuration: number;
  averageCalmLevel: number;
  favoriteTechnique: string;
  sessionsPerDay: Record<string, number>;
  techniqueUsage: Record<string, number>;
  recentSessions: BreathingSession[];
}

export interface CreateBreathingSessionData {
  duration: number;
  technique: string;
  calmLevel?: number;
}

export interface BreathingTechnique {
  id: string;
  name: string;
  description: string;
  duration: number;
  pattern: {
    inhale: number;
    hold: number;
    exhale: number;
    holdAfterExhale: number;
  };
  benefits: string[];
  difficulty: "beginner" | "intermediate" | "advanced";
}
