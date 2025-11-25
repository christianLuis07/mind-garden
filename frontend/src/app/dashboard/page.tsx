"use client";

import { useEffect, useState } from "react";
import { Smile, BookOpen, Wind, TrendingUp } from "lucide-react";
import { ProtectedRoute } from "@/components/layout/protected-route";
import { StatsCard } from "@/components/dashboard/stats-card";
import { QuickActions } from "@/components/dashboard/quick-actions";
import {
  RecentActivity,
  Activity,
} from "@/components/dashboard/recent-activity";
import { MoodAnalytics } from "@/components/mood/mood-analytics";
import { Spinner } from "@/components/ui/spinner";
import { moodAPI } from "@/lib/mood-api";
import { journalAPI } from "@/lib/journal-api";
import { breathingAPI } from "@/lib/breathing-api";
import { useAuthStore } from "@/store/auth-store";
import { differenceInDays, parseISO } from "date-fns";

export default function DashboardPage() {
  const { user } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    moodEntries: 0,
    journalEntries: 0,
    breathingSessions: 0,
    currentStreak: 0,
  });
  const [recentActivities, setRecentActivities] = useState<Activity[]>([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);

        const [
          moodAnalyticsRes,
          journalAnalyticsRes,
          breathingAnalyticsRes,
          moodEntriesRes,
          journalEntriesRes,
          breathingSessionRes,
        ] = await Promise.all([
          moodAPI.getMoodAnalytics("30d"),
          journalAPI.getJournalAnalytics("30d"),
          breathingAPI.getAnalytics("30d"),
          moodAPI.getMoodEntries({ limit: 5 }),
          journalAPI.getJournalEntries({ limit: 5 }),
          breathingAPI.getSessions({ limit: 5 }),
        ]);

        const moodData = moodAnalyticsRes.data?.success
          ? moodAnalyticsRes.data.data.analytics
          : null;
        const journalData = journalAnalyticsRes.data?.success
          ? journalAnalyticsRes.data.data.analytics
          : null;
        const breathingData = breathingAnalyticsRes.data?.success
          ? breathingAnalyticsRes.data.data.analytics
          : null;

        let streak = 0;
        if (
          moodEntriesRes.data?.success &&
          moodEntriesRes.data.data.entries.length > 0
        ) {
          const entries = moodEntriesRes.data.data.entries;
          const today = new Date();
          let currentDateCheck = today;

          const lastEntryDate = parseISO(entries[0].createdAt);
          const diff = differenceInDays(today, lastEntryDate);

          if (diff <= 1) {
            streak = 1;
            streak = entries.length > 1 ? Math.min(entries.length, 5) : 1;
          }
        }

        setStats({
          moodEntries: moodData?.overview?.totalEntries || 0,
          journalEntries: journalData?.overview?.totalEntries || 0,
          breathingSessions: breathingData?.totalSessions || 0,
          currentStreak: streak,
        });

        const activities: Activity[] = [];

        // Map Mood Entries
        if (moodEntriesRes.data?.success) {
          moodEntriesRes.data.data.entries.forEach((entry) => {
            activities.push({
              id: `mood-${entry.id}`,
              type: "mood",
              title: "Mood Dicatat",
              description: entry.notes || `Merasa ${getMoodLabel(entry.mood)}`,
              timestamp: entry.createdAt,
              value: entry.mood,
            });
          });
        }

        // Map Journal Entries
        if (journalEntriesRes.data?.success) {
          journalEntriesRes.data.data.entries.forEach((entry) => {
            const cleanContent =
              entry.content.replace(/<[^>]*>/g, "").substring(0, 60) + "...";
            activities.push({
              id: `journal-${entry.id}`,
              type: "journal",
              title: entry.title || "Entri Jurnal",
              description: cleanContent,
              timestamp: entry.createdAt,
            });
          });
        }

        // Map Breathing Sessions
        if (breathingSessionRes.data?.success) {
          breathingSessionRes.data.data.sessions.forEach((session) => {
            activities.push({
              id: `breath-${session.id}`,
              type: "breathing",
              title: "Latihan Pernapasan",
              description: `Menyelesaikan teknik ${
                session.technique
              } (${Math.round(session.duration / 60)} menit)`,
              timestamp: session.createdAt,
              value: session.calmLevel,
            });
          });
        }

        const sortedActivities = activities
          .sort(
            (a, b) =>
              new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
          )
          .slice(0, 5);

        setRecentActivities(sortedActivities);
      } catch (error) {
        console.error("gagal memuat dashboard", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const getMoodLabel = (mood: number) => {
    const labels = [
      "Sangat Sedih",
      "Sedih",
      "Netral",
      "Bahagia",
      "Sangat Bahagia",
    ];
    return labels[mood - 1] || "Netral";
  };

  if (isLoading) {
    return (
      <ProtectedRoute>
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <Spinner className="mx-auto mb-4 w-8 h-8 text-green-600" />
            <p className="text-gray-600">Menyiapkan taman mentalmu...</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="space-y-8">
        {/* Welcome Section */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Selamat Datang, {user?.name?.split(" ")[0] || "Sahabat"}!
          </h1>
          <p className="text-gray-600">
            Berikut ringkasan kesehatan mentalmu dalam 30 hari terakhir.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Entri Mood"
            value={stats.moodEntries}
            description="Bulan Ini"
            icon={<Smile className="w-6 h-6" />}
            className="border-l-4 border-l-green-500"
          />
          <StatsCard
            title="Entri Jurnal"
            value={stats.journalEntries}
            description="Catatan Refleksi"
            icon={<BookOpen className="w-6 h-6" />}
            className="border-l-4 border-l-blue-500"
          />
          <StatsCard
            title="Sesi Pernapasan"
            value={stats.breathingSessions}
            description="Latihan Mindfulness"
            icon={<Wind className="w-6 h-6" />}
            className="border-l-4 border-l-purple-500"
          />
          <StatsCard
            title="Aktivitas Beruntun"
            value={`${stats.currentStreak} hari`}
            description="Pertahankan!"
            icon={<TrendingUp className="w-6 h-6" />}
            className="border-l-4 border-l-orange-500"
          />
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">
            Mulai Sesuatu yang Baru
          </h2>
          <QuickActions />
        </div>

        {/* Recent Activity & Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <RecentActivity activities={recentActivities} isLoading={isLoading} />

          {/* Mood Chart */}
          <div className="h-full">
            <MoodAnalytics />
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
