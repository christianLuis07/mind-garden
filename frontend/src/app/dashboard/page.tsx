"use client";

import { useEffect, useState } from "react";
import { Smile, BookOpen, Wind, TrendingUp } from "lucide-react";
import { ProtectedRoute } from "@/components/layout/protected-route";
import { StatsCard } from "@/components/dashboard/stats-card";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { RecentActivity } from "@/components/dashboard/recent-activity";
import { Spinner } from "@/components/ui/spinner";

// Mock data
const mockStats = {
  moodEntries: 15,
  journalEntries: 8,
  breathingSessions: 12,
  currentStreak: 5,
};

export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulasi API Call
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <ProtectedRoute>
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <Spinner className="mx-auto mb-4">
              <p className="text-gray-600">Memuat Dashboard Kamu...</p>
            </Spinner>
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
            Selamat Datang Kembali!
          </h1>
          <p className="text-gray-600">
            Berikut ringkasan kesehatan mentalmu hari ini.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Entri Mood"
            value={mockStats.moodEntries}
            description="Bulan Ini"
            icon={<Smile className="w-6 h-6" />}
            trend={{ value: 12, isPositive: true }}
          />
          <StatsCard
            title="Entri Jurnal"
            value={mockStats.journalEntries}
            description="Catatan Refleksi"
            icon={<BookOpen className="w-6 h-6" />}
          />
          <StatsCard
            title="Sesi Pernapasan"
            value={mockStats.breathingSessions}
            description="Latihan Mindfulness"
            icon={<Wind className="w-6 h-6" />}
            trend={{ value: 8, isPositive: true }}
          />
          <StatsCard
            title="Streak Saat Ini"
            value={`${mockStats.currentStreak} hari`}
            description="Pertahankan!"
            icon={<TrendingUp className="w-6 h-6" />}
          />
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">
            Aksi Cepat
          </h2>
          <QuickActions />
        </div>

        {/* Recent Activity & Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <RecentActivity />

          {/* Placeholder for Mood Chart */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Mood Trends
            </h2>
            <div className="flex items-center justify-center h-64 bg-gray-50 rounded-xl">
              <p className="text-gray-500 text-center">
                Grafik Mood akan ditampilkan disini
                <br />
                <span className="text-sm">akan datang</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
