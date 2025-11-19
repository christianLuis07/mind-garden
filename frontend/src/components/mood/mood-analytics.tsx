// src/components/mood/mood-analytics.tsx
"use client";

import { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";
import {
  Calendar,
  TrendingUp,
  BarChart3,
  PieChart as PieChartIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { moodAPI } from "@/lib/mood-api";
import { MoodAnalytics as MoodAnalyticsType } from "@/types/mood";

const timeframes = [
  { value: "7d", label: "7 Days" },
  { value: "30d", label: "30 Days" },
  { value: "90d", label: "90 Days" },
];

const chartTypes = [
  { value: "bar", label: "Bar Chart", icon: BarChart3 },
  { value: "line", label: "Trend Line", icon: TrendingUp },
  { value: "pie", label: "Distribution", icon: PieChartIcon },
];

const moodColors = ["#ef4444", "#f97316", "#eab308", "#22c55e", "#10b981"];
const moodLabels = ["Very Sad", "Sad", "Neutral", "Happy", "Very Happy"];

interface MoodAnalyticsProps {
  refreshTrigger?: number;
}

// Default empty analytics data dengan safe structure
const defaultAnalytics: MoodAnalyticsType = {
  overview: {
    averageMood: 0,
    totalEntries: 0,
    moodDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
  },
  weeklyPatterns: {},
  commonFactors: {},
  recentEntries: [],
};

// Safe data access helper functions
const getSafeOverview = (analytics: any) => {
  return analytics?.overview || defaultAnalytics.overview;
};

const getSafeMoodDistribution = (analytics: any) => {
  const overview = getSafeOverview(analytics);
  return (
    overview.moodDistribution || defaultAnalytics.overview.moodDistribution
  );
};

const getSafeWeeklyPatterns = (analytics: any) => {
  return analytics?.weeklyPatterns || defaultAnalytics.weeklyPatterns;
};

const getSafeRecentEntries = (analytics: any) => {
  return analytics?.recentEntries || defaultAnalytics.recentEntries;
};

export function MoodAnalytics({ refreshTrigger }: MoodAnalyticsProps) {
  const [analytics, setAnalytics] = useState<MoodAnalyticsType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [timeframe, setTimeframe] = useState("7d");
  const [chartType, setChartType] = useState("bar");

  useEffect(() => {
    loadAnalytics();
  }, [timeframe, refreshTrigger]);

  const loadAnalytics = async () => {
    try {
      setIsLoading(true);
      const response = await moodAPI.getMoodAnalytics(timeframe);

      console.log("Analytics API Response:", response.data); // Debug log

      if (response.data.success && response.data.data?.analytics) {
        setAnalytics(response.data.data.analytics);
      } else {
        // Jika response tidak sesuai expected structure
        console.warn("Unexpected API response structure:", response.data);
        setAnalytics(defaultAnalytics);
      }
    } catch (error) {
      console.error("Failed to load analytics:", error);
      setAnalytics(defaultAnalytics);
    } finally {
      setIsLoading(false);
    }
  };

  // GUNAKAN SAFE ACCESSORS di semua tempat
  const overview = getSafeOverview(analytics);
  const moodDistribution = getSafeMoodDistribution(analytics);
  const weeklyPatterns = getSafeWeeklyPatterns(analytics);
  const recentEntries = getSafeRecentEntries(analytics);

  // Prepare data for charts - SELALU GUNAKAN SAFE DATA
  const distributionData = Object.entries(moodDistribution).map(
    ([mood, count], index) => ({
      name: moodLabels[parseInt(mood) - 1] || `Mood ${mood}`,
      value: count as number,
      mood: parseInt(mood),
      fill: moodColors[parseInt(mood) - 1] || moodColors[0],
    })
  );

  const weeklyData = Object.entries(weeklyPatterns).map(
    ([day, data]: [string, any]) => ({
      day,
      average: data?.average || 0,
      count: data?.count || 0,
    })
  );

  const trendData = recentEntries.slice(-14).map((entry: any) => ({
    date: new Date(entry.createdAt).toLocaleDateString(),
    mood: entry.mood || 3,
    name: moodLabels[(entry.mood || 3) - 1] || "Neutral",
  }));

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-center h-64">
          <Spinner />
        </div>
      </div>
    );
  }

  // Check if there's actual data
  const hasData = overview.totalEntries > 0;

  if (!hasData) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="text-center py-12">
          <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No Analytics Data
          </h3>
          <p className="text-gray-500">
            Start logging your mood to see analytics and insights.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            Mood Analytics
          </h2>
          <p className="text-gray-600 text-sm">
            Understand your mood patterns and trends
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {/* Timeframe Selector */}
          <div className="flex border border-gray-300 rounded-lg overflow-hidden">
            {timeframes.map((tf) => (
              <Button
                key={tf.value}
                variant={timeframe === tf.value ? "default" : "ghost"}
                size="sm"
                onClick={() => setTimeframe(tf.value)}
                className="rounded-none border-0"
              >
                {tf.label}
              </Button>
            ))}
          </div>

          {/* Chart Type Selector */}
          <div className="flex border border-gray-300 rounded-lg overflow-hidden">
            {chartTypes.map((type) => {
              const Icon = type.icon;
              return (
                <Button
                  key={type.value}
                  variant={chartType === type.value ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setChartType(type.value)}
                  className="rounded-none border-0"
                >
                  <Icon className="w-4 h-4" />
                </Button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Overview Stats - GUNAKAN OVERVIEW YANG SAFE */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-linear-to-br from-blue-50 to-blue-100 rounded-xl p-4">
          <div className="text-2xl font-bold text-blue-900">
            {overview.averageMood.toFixed(1)}
          </div>
          <div className="text-blue-700 text-sm">Average Mood</div>
          <div className="flex mt-1">
            {[...Array(5)].map((_, i) => (
              <span
                key={i}
                className={`text-lg ${
                  i < Math.round(overview.averageMood)
                    ? "text-yellow-400"
                    : "text-blue-200"
                }`}
              >
                ★
              </span>
            ))}
          </div>
        </div>

        <div className="bg-linear-to-br from-green-50 to-green-100 rounded-xl p-4">
          <div className="text-2xl font-bold text-green-900">
            {overview.totalEntries}
          </div>
          <div className="text-green-700 text-sm">Total Entries</div>
        </div>

        <div className="bg-linear-to-br from-purple-50 to-purple-100 rounded-xl p-4">
          <div className="text-2xl font-bold text-purple-900">
            {Math.max(...Object.values(moodDistribution).map((v) => Number(v)))}
          </div>
          <div className="text-purple-700 text-sm">Most Frequent Mood</div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Main Chart */}
        <div className="lg:col-span-2 h-80">
          {chartType === "bar" && weeklyData.length > 0 && (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="day" stroke="#6b7280" />
                <YAxis stroke="#6b7280" domain={[0, 5]} />
                <Tooltip
                  formatter={(value: number) => [
                    value.toFixed(1),
                    "Average Mood",
                  ]}
                  labelFormatter={(label) => `Day: ${label}`}
                />
                <Bar dataKey="average" fill="#10b981" radius={[4, 4, 0, 0]}>
                  {weeklyData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={
                        moodColors[Math.round(entry.average) - 1] ||
                        moodColors[2]
                      }
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}

          {chartType === "line" && trendData.length > 0 && (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" stroke="#6b7280" />
                <YAxis stroke="#6b7280" domain={[1, 5]} />
                <Tooltip
                  formatter={(value: number) => [
                    moodLabels[value - 1] || "Unknown",
                    "Mood",
                  ]}
                />
                <Line
                  type="monotone"
                  dataKey="mood"
                  stroke="#10b981"
                  strokeWidth={3}
                  dot={{ fill: "#10b981", strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, fill: "#059669" }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}

          {chartType === "pie" &&
            distributionData.some((item) => item.value > 0) && (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={distributionData.filter((item) => item.value > 0)}
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
                    {distributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => [value, "Entries"]} />
                </PieChart>
              </ResponsiveContainer>
            )}

          {/* Fallback jika tidak ada data untuk chart */}
          {(chartType === "bar" && weeklyData.length === 0) ||
            (chartType === "line" && trendData.length === 0) ||
            (chartType === "pie" &&
              !distributionData.some((item) => item.value > 0) && (
                <div className="flex items-center justify-center h-full text-gray-500">
                  No data available for this chart type
                </div>
              ))}
        </div>

        {/* Mood Distribution */}
        <div className="h-64">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Mood Distribution
          </h3>
          <div className="space-y-3">
            {distributionData.map((item, index) => (
              <div
                key={item.mood}
                className="flex items-center justify-between"
              >
                <div className="flex items-center space-x-3">
                  <div
                    className="w-4 h-4 rounded"
                    style={{ backgroundColor: item.fill }}
                  />
                  <span className="text-sm font-medium text-gray-700">
                    {item.name}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div
                      className="h-2 rounded-full"
                      style={{
                        backgroundColor: item.fill,
                        width: `${(item.value / overview.totalEntries) * 100}%`,
                      }}
                    />
                  </div>
                  <span className="text-sm text-gray-600 w-8">
                    {item.value}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Weekly Patterns */}
        <div className="h-64">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Weekly Patterns
          </h3>
          <div className="space-y-3">
            {weeklyData.map((day) => (
              <div key={day.day} className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700 capitalize">
                  {day.day}
                </span>
                <div className="flex items-center space-x-3">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <span
                        key={i}
                        className={`text-sm ${
                          i < Math.round(day.average)
                            ? "text-yellow-400"
                            : "text-gray-300"
                        }`}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                  <span className="text-sm text-gray-600 w-12 text-right">
                    {day.average.toFixed(1)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
