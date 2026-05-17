export interface MoodEntry {
  id: string;
  userId: string;
  mood: number;
  notes?: string;
  factors?: {
    sleep?: number;
    exercise?: boolean;
    social?: number;
    work?: number;
    [key: string]: any;
  };
  createdAt: string;
  updatedAt: string;
}

export interface MoodAnalytics {
  overview: {
    averageMood: number;
    totalEntries: number;
    moodDistribution: Record<number, number>;
  };
  weeklyPatterns: Record<string, { count: number; average: number }>;
  commonFactors: Record<string, any>;
  aiInsight?: string | null;
  recentEntries: MoodEntry[];
}

export interface CreateMoodData {
  mood: number;
  notes?: string;
  factors?: Record<string, any>;
}
