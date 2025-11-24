"use client";

import { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  Calendar,
  TrendingUp,
  Book,
  Clock,
  Target,
  BarChart3,
  Activity,
  Award,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { breathingAPI } from "@/lib/breathing-api";
import { BreathingAnalytics } from "@/types/breathing";
import { format } from "date-fns";

const timeframes = [
  { value: "7d", label: "7 Hari Terakhir" },
  { value: "30d", label: "30 Hari Terakhir" },
  { value: "90d", label: "90 Hari Terakhir" },
  { value: "1y", label: "1 Tahun Terakhir" },
  { value: "all", label: "Semua Waktu" },
];

const COLORS = ["#10b981", "#3b82f6", "#8b5cf6", "#f59e0b", "#ef4444"];

export function BreathingAnalyticsComponent() {
  const [analytics, setAnalytics] = useState<BreathingAnalytics | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await breathingAPI.getAnalytics();
      if (response.data?.success) {
        setAnalytics(response.data.data?.analytics || null);
      }
    } catch (error) {
      console.error("Failed to fetch analytics:", error);
      setAnalytics(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const prepareSessionsData = () => {
    if (!analytics?.sessionsPerDay) return [];

    return Object.entries(analytics.sessionsPerDay)
      .map(([date, count]) => ({
        date: format(new Date(date), "MMM dd"),
        sessions: count,
        fullDate: date,
      }))
      .sort(
        (a, b) =>
          new Date(a.fullDate).getTime() - new Date(b.fullDate).getTime()
      );
  };

  const prepareTechniqueData = () => {
    if (!analytics?.techniqueUsage) return [];

    return Object.entries(analytics.techniqueUsage)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="text-center py-12">
        <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Belum Ada Data Analitik
        </h3>
        <p className="text-gray-600">
          Mulai latihan pernapasan untuk melihat statistik perkembanganmu di
          sini.
        </p>
      </div>
    );
  }

  const sessionsData = prepareSessionsData();
  const techniqueData = prepareTechniqueData();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Analisis Pernapasan
          </h2>
          <p className="text-gray-600 mt-1">
            Pantau perkembangan dan rutinitas latihan pernapasanmu
          </p>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Sesi</p>
                <p className="text-2xl font-bold text-gray-900">
                  {analytics?.totalSessions || 0}
                </p>
                <p className="text-xs text-gray-500 mt-1">latihan selesai</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <Target className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Durasi
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {Math.round(analytics?.totalDuration || 0)}
                </p>
                <p className="text-xs text-gray-500 mt-1">menit latihan</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <Clock className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Rata-rata Ketenangan
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {(analytics?.averageCalmLevel || 0).toFixed(1)}
                </p>
                <p className="text-xs text-gray-500 mt-1">skala dari 10</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Teknik Favorit
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {analytics?.favoriteTechnique || "-"}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  paling sering digunakan
                </p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-lg">
                <Award className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sessions Frequency */}
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Frekuensi Latihan
            </h3>
            <div className="h-80">
              {sessionsData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={sessionsData}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      className="opacity-30"
                    />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "white",
                        border: "1px solid #e5e7eb",
                        borderRadius: "0.5rem",
                      }}
                    />
                    <Bar
                      dataKey="sessions"
                      fill="#10b981"
                      radius={[4, 4, 0, 0]}
                      name="Sesi"
                    />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500">
                  Belum ada data sesi latihan
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Technique Usage */}
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Penggunaan Teknik
            </h3>
            <div className="h-80">
              {techniqueData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={techniqueData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) =>
                        `${name} (${percent ? (percent * 100).toFixed(0) : 0}%)`
                      }
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {techniqueData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value) => [`${value} sesi`, "Jumlah"]}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500">
                  Belum ada data penggunaan teknik
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Sessions */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Sesi Terakhir
          </h3>
          <div className="space-y-3">
            {analytics.recentSessions && analytics.recentSessions.length > 0 ? (
              analytics.recentSessions.slice(0, 5).map((session, index) => (
                <div
                  key={session.id || index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <Activity className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {session.technique || "Teknik Tidak Diketahui"}
                      </p>
                      <p className="text-sm text-gray-500">
                        {session.createdAt
                          ? format(new Date(session.createdAt), "MMM d, yyyy")
                          : "Tanggal tidak diketahui"}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">
                      {Math.round((session.duration || 0) / 60)} menit
                    </p>
                    <p
                      className={`text-xs px-2 py-1 rounded-full ${
                        session.calmLevel && session.calmLevel >= 7
                          ? "bg-green-100 text-green-800"
                          : session.calmLevel && session.calmLevel >= 4
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      Ketenangan: {session.calmLevel || "-"}/10
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                Belum ada riwayat sesi baru-baru ini
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
