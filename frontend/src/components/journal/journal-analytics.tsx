// src/components/journal/journal-analytics.tsx
"use client";

import { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
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
  Smile,
  Frown,
  Meh,
  Clock,
  Target,
  BarChart3,
  Activity,
  FileText,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { journalAPI } from "@/lib/journal-api";
import { JournalAnalytics } from "@/types/journal";
import { format } from "date-fns";

const timeframes = [
  { value: "7h", label: "7 Hari Terakhir" },
  { value: "30h", label: "30 Hari Terakhir" },
  { value: "90h", label: "90 Hari Terakhir" },
  { value: "1t", label: "1 Tahun Terakhir" },
  { value: "keseluruhan", label: "Keseluruhan" },
];

const sentimentColors = {
  positif: "#10b981",
  negatif: "#ef4444",
  netral: "#f59e0b",
};

const COLORS = [
  "#10b981",
  "#3b82f6",
  "#8b5cf6",
  "#f59e0b",
  "#ef4444",
  "#6b7280",
];

export function JournalAnalyticsComponent() {
  const [analytics, setAnalytics] = useState<JournalAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState("30d");

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await journalAPI.getJournalAnalytics(timeframe);

      // PERBAIKAN: Akses response.data terlebih dahulu
      if (response.data.success) {
        setAnalytics(response.data.data.analytics);
      }
    } catch (error) {
      console.error("Failed to fetch analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [timeframe]);

  const getSentimentIcon = (type: "positif" | "negatif" | "netral") => {
    switch (type) {
      case "positif":
        return <Smile className="w-5 h-5 text-green-600" />;
      case "negatif":
        return <Frown className="w-5 h-5 text-red-600" />;
      case "netral":
        return <Meh className="w-5 h-5 text-yellow-600" />;
    }
  };

  const prepareWritingFrequencyData = () => {
    if (!analytics) return [];

    const dailyData = analytics.overview.writingFrequency.daily;
    return Object.entries(dailyData)
      .map(([date, count]) => ({
        date: format(new Date(date), "MMM dd"),
        entries: count,
        fullDate: date,
      }))
      .sort(
        (a, b) =>
          new Date(a.fullDate).getTime() - new Date(b.fullDate).getTime()
      );
  };

  const prepareTagsData = () => {
    if (!analytics) return [];

    return Object.entries(analytics.tags)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 10);
  };

  const prepareSentimentData = () => {
    if (!analytics) return [];

    return [
      {
        name: "Positif",
        value: analytics.sentiment.positive,
        type: "positif",
      },
      {
        name: "netral",
        value: analytics.sentiment.neutral,
        type: "netral",
      },
      {
        name: "negatif",
        value: analytics.sentiment.negative,
        type: "negatif",
      },
    ];
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
          Tidak Ada Statistik Penulisan
        </h3>
        <p className="text-gray-600">
          Mulailah menulis jurnal agar analisis menulismu bisa muncul di sini.
        </p>
      </div>
    );
  }

  const writingFrequencyData = prepareWritingFrequencyData();
  const tagsData = prepareTagsData();
  const sentimentData = prepareSentimentData();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Statistik Penulisan
          </h2>
          <p className="text-gray-600 mt-1">
            Wawasan tentang kebiasaan menulismu dan perjalanan emosionalmu
          </p>
        </div>

        <div className="flex items-center space-x-2 bg-white rounded-lg border border-gray-200 p-1">
          {timeframes.map((tf) => (
            <button
              key={tf.value}
              onClick={() => setTimeframe(tf.value)}
              className={`px-3 py-1 text-sm rounded-md transition-colors ${
                timeframe === tf.value
                  ? "bg-green-600 text-white"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              {tf.label}
            </button>
          ))}
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Entries
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {analytics.overview.totalEntries}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {analytics.overview.writingFrequency.totalDays} hari aktif
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <Book className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Jumlah Kata Rata-rata
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {analytics.wordCount.average}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {analytics.wordCount.totalWords} total kata
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <Target className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Frekuensi Menulis
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {analytics.overview.writingFrequency.entriesPerDay.toFixed(1)}
                </p>
                <p className="text-xs text-gray-500 mt-1">entries per hari</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <Clock className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Sentimen Rata-rata
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {(analytics.overview.averageSentiment * 100).toFixed(0)}%
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {analytics.overview.averageSentiment > 0.1
                    ? "positif"
                    : analytics.overview.averageSentiment < -0.1
                    ? "negatif"
                    : "netral"}
                </p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Writing Frequency Chart */}
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Frekuensi Menulis
            </h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={writingFrequencyData}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
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
                    dataKey="entries"
                    fill="#10b981"
                    radius={[4, 4, 0, 0]}
                    name="Entries"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Sentiment Distribution */}
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Penyebaran Sentimen
            </h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={sentimentData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) =>
                      `${name} (${((percent || 0) * 100).toFixed(0)}%)`
                    }
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {sentimentData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={
                          sentimentColors[
                            entry.type as keyof typeof sentimentColors
                          ]
                        }
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => [`${value} entries`, "Count"]}
                    contentStyle={{
                      backgroundColor: "white",
                      border: "1px solid #e5e7eb",
                      borderRadius: "0.5rem",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-3 gap-4 mt-4">
              {sentimentData.map((item) => (
                <div key={item.name} className="text-center">
                  <div className="flex items-center justify-center space-x-2">
                    {getSentimentIcon(
                      item.type as "positif" | "negatif" | "netral"
                    )}
                    <span className="font-medium text-gray-900">
                      {item.name}
                    </span>
                  </div>
                  <p className="text-2xl font-bold mt-1">{item.value}</p>
                  <p className="text-sm text-gray-500">entries</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Tags */}
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Tag Teratas
            </h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={tagsData}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis type="number" />
                  <YAxis
                    type="category"
                    dataKey="name"
                    width={80}
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      border: "1px solid #e5e7eb",
                      borderRadius: "0.5rem",
                    }}
                  />
                  <Bar
                    dataKey="value"
                    fill="#3b82f6"
                    radius={[0, 4, 4, 0]}
                    name="Jumlah Penggunaan"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Word Count Statistics */}
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Statistik Jumlah Kata
            </h3>
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <FileText className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-gray-900">
                    {analytics.wordCount.average}
                  </p>
                  <p className="text-sm text-gray-600">Rata-Rata</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <Activity className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-gray-900">
                    {analytics.wordCount.max}
                  </p>
                  <p className="text-sm text-gray-600">Maksimal</p>
                </div>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="font-semibold text-green-800 mb-2">
                  Detail Penulisan
                </h4>
                <ul className="text-sm text-green-700 space-y-1">
                  <li>
                    • Total kata yang ditulis: {analytics.wordCount.totalWords}
                  </li>
                  <li>
                    • Rata-rata panjang entri: {analytics.wordCount.average}{" "}
                    kata
                  </li>
                  <li>• Entri terpanjang: {analytics.wordCount.max} kata</li>
                  <li>
                    • Hari paling aktif:{" "}
                    {writingFrequencyData.sort(
                      (a, b) => b.entries - a.entries
                    )[0]?.date || "N/A"}
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Aktivitas Terbaru
          </h3>
          <div className="space-y-3">
            {analytics.recentActivity.slice(0, 5).map((entry, index) => (
              <div
                key={entry.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <FileText className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {entry.title || "Entrie tidak memiliki judul"}
                    </p>
                    <p className="text-sm text-gray-500">
                      {format(new Date(entry.createdAt), "MMM d, yyyy")}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">
                    Content{" "}
                    {
                      entry.content
                        .replace(/<[^>]*>/g, "")
                        .split(/\s+/)
                        .filter((word) => word.length > 0).length
                    }{" "}
                    kata
                  </p>
                  <p
                    className={`text-xs px-2 py-1 rounded-full ${
                      entry.sentiment && entry.sentiment > 0.1
                        ? "bg-green-100 text-green-800"
                        : entry.sentiment && entry.sentiment < -0.1
                        ? "bg-red-100 text-red-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {getSentimentLabel(entry.sentiment)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Helper function for sentiment label
function getSentimentLabel(sentiment?: number): string {
  if (!sentiment) return "netral";
  if (sentiment > 0.1) return "positif";
  if (sentiment < -0.1) return "negatif";
  return "netral";
}
