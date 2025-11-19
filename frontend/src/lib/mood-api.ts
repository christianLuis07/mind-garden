import { api } from "./api";
import { MoodEntry, MoodAnalytics, CreateMoodData } from "@/types/mood";

export const moodAPI = {
  // buat mood entri
  createMood: (data: CreateMoodData) =>
    api.post<{
      success: boolean;
      message: string;
      data: { moodEntry: MoodEntry };
    }>("/mood", data),

  // ambil mood entries dengan pagination dan juga filter
  getMoodEntries: (params?: {
    page?: number;
    limit?: number;
    startDate?: string;
    endDate?: string;
  }) =>
    api.get<{
      success: boolean;
      data: {
        entries: MoodEntry[];
        pagination: {
          page: number;
          limit: number;
          total: number;
          pages: number;
        };
      };
    }>("/mood", { params }),

  // ambil analisis mood
  getMoodAnalytics: (timeframe?: string) =>
    api.get<{ success: boolean; data: { analytics: MoodAnalytics } }>(
      `/mood/analytics?timeframe=${timeframe || "7d"}`
    ),
};
