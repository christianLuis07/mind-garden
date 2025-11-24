// src/lib/breathing-api.ts
import { api } from "./api";
import {
  BreathingSession,
  BreathingAnalytics,
  CreateBreathingSessionData,
  BreathingTechnique,
} from "@/types/breathing";
import {
  mockBreathingTechniques,
  mockBreathingSessions,
} from "@/lib/breathing/breathing-data";

// VARIABEL GLOBAL untuk menyimpan sessions (simulasi database)
let userSessions: BreathingSession[] = [...mockBreathingSessions];

// FUNCTION untuk generate analytics berdasarkan sessions
const generateAnalytics = (
  sessions: BreathingSession[]
): BreathingAnalytics => {
  if (sessions.length === 0) {
    return {
      totalSessions: 0,
      totalDuration: 0,
      averageCalmLevel: 0,
      favoriteTechnique: "-",
      sessionsPerDay: {},
      techniqueUsage: {},
      recentSessions: [],
    };
  }

  // Hitung total sessions dan duration
  const totalSessions = sessions.length;
  const totalDuration =
    sessions.reduce((sum, session) => sum + session.duration, 0) / 60; // konversi ke menit

  // Hitung average calm level
  const sessionsWithCalm = sessions.filter((s) => s.calmLevel);
  const averageCalmLevel =
    sessionsWithCalm.length > 0
      ? sessionsWithCalm.reduce(
          (sum, session) => sum + (session.calmLevel || 0),
          0
        ) / sessionsWithCalm.length
      : 0;

  // Cari teknik favorit
  const techniqueCount: Record<string, number> = {};
  sessions.forEach((session) => {
    techniqueCount[session.technique] =
      (techniqueCount[session.technique] || 0) + 1;
  });
  const favoriteTechnique =
    Object.entries(techniqueCount).sort(([, a], [, b]) => b - a)[0]?.[0] || "-";

  // Hitung sessions per hari (7 hari terakhir)
  const sessionsPerDay: Record<string, number> = {};
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    return date.toISOString().split("T")[0];
  });

  last7Days.forEach((date) => {
    sessionsPerDay[date] = sessions.filter(
      (session) => session.createdAt.split("T")[0] === date
    ).length;
  });

  // Hitung penggunaan teknik
  const techniqueUsage: Record<string, number> = {};
  sessions.forEach((session) => {
    techniqueUsage[session.technique] =
      (techniqueUsage[session.technique] || 0) + 1;
  });

  // Sesi terakhir (max 5)
  const recentSessions = [...sessions]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, 5);

  return {
    totalSessions,
    totalDuration: Math.round(totalDuration),
    averageCalmLevel: Number(averageCalmLevel.toFixed(1)),
    favoriteTechnique,
    sessionsPerDay,
    techniqueUsage,
    recentSessions,
  };
};

export const breathingAPI = {
  // Buat sesi pernapasan - PERBAIKAN: Simpan session baru
  createSession: async (data: CreateBreathingSessionData) => {
    try {
      const response = await api.post<{
        success: boolean;
        message: string;
        data: { session: BreathingSession };
      }>("/breathing/sessions", data);
      return response;
    } catch (error) {
      console.warn("Error API, menggunakan data tiruan:", error);

      // BUAT SESSION BARU dan tambahkan ke array
      const newSession: BreathingSession = {
        id: Date.now().toString(),
        userId: "mock-user",
        duration: data.duration,
        technique: data.technique,
        completed: true,
        calmLevel: data.calmLevel,
        createdAt: new Date().toISOString(),
      };

      userSessions.push(newSession);
      console.log("Session baru ditambahkan:", newSession);
      console.log("Total sessions sekarang:", userSessions.length);

      return {
        data: {
          success: true,
          message: "Sesi disimpan secara lokal",
          data: {
            session: newSession,
          },
        },
      };
    }
  },

  // Ambil sesi pernapasan dengan paginasi - PERBAIKAN: Gunakan userSessions
  getSessions: async (params?: {
    page?: number;
    limit?: number;
    technique?: string;
    startDate?: string;
    endDate?: string;
  }) => {
    try {
      const response = await api.get<{
        success: boolean;
        data: {
          sessions: BreathingSession[];
          pagination: {
            page: number;
            limit: number;
            total: number;
            pages: number;
          };
        };
      }>("/breathing/sessions", { params });
      return response;
    } catch (error) {
      console.warn("Error API, menggunakan data tiruan:", error);

      // Filter userSessions berdasarkan parameter
      let filteredSessions = [...userSessions];

      if (params?.technique) {
        filteredSessions = filteredSessions.filter((session) =>
          session.technique
            .toLowerCase()
            .includes(params.technique!.toLowerCase())
        );
      }

      if (params?.startDate) {
        filteredSessions = filteredSessions.filter(
          (session) =>
            new Date(session.createdAt) >= new Date(params.startDate!)
        );
      }

      if (params?.endDate) {
        filteredSessions = filteredSessions.filter(
          (session) => new Date(session.createdAt) <= new Date(params.endDate!)
        );
      }

      return {
        data: {
          success: true,
          data: {
            sessions: filteredSessions,
            pagination: {
              page: params?.page || 1,
              limit: params?.limit || 10,
              total: filteredSessions.length,
              pages: Math.ceil(filteredSessions.length / (params?.limit || 10)),
            },
          },
        },
      };
    }
  },

  // Ambil analitik pernapasan - PERBAIKAN: Generate dari userSessions
  getAnalytics: async (timeframe?: string) => {
    try {
      const response = await api.get<{
        success: boolean;
        data: { analytics: BreathingAnalytics };
      }>(`/breathing/analytics?timeframe=${timeframe || "30d"}`);
      return response;
    } catch (error) {
      console.warn("Error API, menggunakan data tiruan:", error);

      // GENERATE ANALYTICS REAL-TIME dari userSessions
      const analytics = generateAnalytics(userSessions);
      console.log("Generated analytics:", analytics);

      return {
        data: {
          success: true,
          data: { analytics },
        },
      };
    }
  },

  // Ambil teknik yang tersedia - TETAP SAMA
  getTechniques: async () => {
    try {
      const response = await api.get<{
        success: boolean;
        data: { techniques: BreathingTechnique[] };
      }>("/breathing/techniques");

      if (
        response.data &&
        response.data.success &&
        Array.isArray(response.data.data?.techniques)
      ) {
        return response;
      } else {
        console.warn(
          "Struktur respons API tidak valid, menggunakan data tiruan"
        );
        return {
          data: {
            success: true,
            data: { techniques: mockBreathingTechniques },
          },
        };
      }
    } catch (error) {
      console.warn("Error API, menggunakan data tiruan:", error);
      return {
        data: {
          success: true,
          data: { techniques: mockBreathingTechniques },
        },
      };
    }
  },
};
