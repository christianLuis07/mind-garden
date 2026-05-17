"use client";

import { useEffect, useState } from "react";
import { Smile, BookOpen, Wind, TrendingUp, Sparkles, Coffee } from "lucide-react";
import { ProtectedRoute } from "@/components/layout/protected-route";
import { StatsCard } from "@/components/dashboard/stats-card";
import { QuickActions } from "@/components/dashboard/quick-actions";
import {
  RecentActivity,
  Activity,
} from "@/components/dashboard/recent-activity";
import { MoodAnalytics } from "@/components/mood/mood-analytics";
import { moodAPI } from "@/lib/mood-api";
import { journalAPI } from "@/lib/journal-api";
import { breathingAPI } from "@/lib/breathing-api";
import { useAuthStore } from "@/store/auth-store";
import { differenceInDays, parseISO, format } from "date-fns";
import { id } from "date-fns/locale";
import { motion } from "framer-motion";

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
          const lastEntryDate = parseISO(entries[0].createdAt);
          const diff = differenceInDays(today, lastEntryDate);

          if (diff <= 1) {
            streak = 1;
            streak = Math.min(entries.length, 7); 
          }
        }

        setStats({
          moodEntries: moodData?.overview?.totalEntries || 0,
          journalEntries: journalData?.overview?.totalEntries || 0,
          breathingSessions: breathingData?.totalSessions || 0,
          currentStreak: streak,
        });

        const activities: Activity[] = [];

        if (moodEntriesRes.data?.success) {
          moodEntriesRes.data.data.entries.forEach((entry) => {
            activities.push({
              id: `mood-${entry.id}`,
              type: "mood",
              title: "Catatan Mood",
              description: entry.notes || `Kamu merasa ${getMoodLabel(entry.mood)}`,
              timestamp: entry.createdAt,
              value: entry.mood,
            });
          });
        }

        if (journalEntriesRes.data?.success) {
          journalEntriesRes.data.data.entries.forEach((entry) => {
            const cleanContent =
              entry.content.replace(/<[^>]*>/g, "").substring(0, 60) + "...";
            activities.push({
              id: `journal-${entry.id}`,
              type: "journal",
              title: entry.title || "Tulisan Baru",
              description: cleanContent,
              timestamp: entry.createdAt,
            });
          });
        }

        if (breathingSessionRes.data?.success) {
          breathingSessionRes.data.data.sessions.forEach((session) => {
            activities.push({
              id: `breath-${session.id}`,
              type: "breathing",
              title: "Latihan Napas",
              description: `Sesi ${session.technique} selama ${Math.round(session.duration / 60)} menit`,
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
    const labels = ["sedang kurang baik", "agak sedih", "biasa saja", "cukup senang", "sangat bahagia"];
    return labels[mood - 1] || "netral";
  };

  if (isLoading) {
    return (
      <ProtectedRoute>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center space-y-4">
            <div className="relative">
               <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto" />
               <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-primary w-6 h-6 animate-pulse" />
            </div>
            <p className="text-muted-foreground font-medium animate-pulse italic">Menyiapkan ruang tenangmu...</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="space-y-10 pb-12">
        {/* Welcome Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="inline-flex items-center space-x-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-3">
              <Coffee className="w-3 h-3" />
              <span>Waktunya Rehat Sejenak</span>
            </div>
            <h1 className="text-4xl font-extrabold text-foreground tracking-tight">
              Halo, <span className="text-primary">{user?.name?.split(" ")[0] || "Teman"}</span>.
            </h1>
            <p className="text-muted-foreground mt-2 font-medium">
              Senang bertemu lagi. Mari luangkan waktu sejenak untuk dirimu sendiri hari ini.
            </p>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-right"
          >
             <p className="text-sm font-bold text-foreground uppercase tracking-widest">
               {format(new Date(), "EEEE, d MMMM", { locale: id })}
             </p>
             <p className="text-xs text-muted-foreground font-medium italic">Bagaimana perasaanmu saat ini?</p>
          </motion.div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Mood Tercatat"
            value={stats.moodEntries}
            description="Perasaanmu bulan ini"
            icon={<Smile className="w-6 h-6" />}
          />
          <StatsCard
            title="Jurnal Ditulis"
            value={stats.journalEntries}
            description="Total ceritamu"
            icon={<BookOpen className="w-6 h-6" />}
          />
          <StatsCard
            title="Sesi Napas"
            value={stats.breathingSessions}
            description="Waktu mindfulness"
            icon={<Wind className="w-6 h-6" />}
          />
          <StatsCard
            title="Konsistensi"
            value={`${stats.currentStreak} hari`}
            description="Lanjutkan kebiasaan baikmu!"
            icon={<TrendingUp className="w-6 h-6" />}
          />
        </div>

        {/* Quick Actions */}
        <div className="space-y-6">
          <div className="flex items-center space-x-3">
            <div className="w-1.5 h-8 bg-primary rounded-full" />
            <h2 className="text-2xl font-bold text-foreground tracking-tight">
              Apa yang ingin kamu lakukan?
            </h2>
          </div>
          <QuickActions />
        </div>

        {/* Recent Activity & Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          <RecentActivity activities={recentActivities} isLoading={isLoading} />

          {/* Mood Chart */}
          <motion.div 
             initial={{ opacity: 0, scale: 0.98 }}
             animate={{ opacity: 1, scale: 1 }}
             className="glass-card rounded-[2.5rem] p-8 shadow-xl shadow-primary/5 h-full flex flex-col"
          >
             <div className="flex items-center space-x-3 mb-8">
                <div className="w-1.5 h-8 bg-primary rounded-full" />
                <h2 className="text-2xl font-bold text-foreground tracking-tight">Grafik Perasaan</h2>
             </div>
             <div className="flex-1 min-h-[300px]">
                <MoodAnalytics />
             </div>
          </motion.div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
