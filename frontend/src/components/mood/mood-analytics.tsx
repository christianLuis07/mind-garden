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
  AreaChart,
  Area,
} from "recharts";
import {
  Calendar,
  TrendingUp,
  BarChart3,
  PieChart as PieChartIcon,
  Sparkles,
  Zap,
  Heart,
  BrainCircuit,
  Waves,
  Lightbulb,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { moodAPI } from "@/lib/mood-api";
import { MoodAnalytics as MoodAnalyticsType } from "@/types/mood";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const timeframes = [
  { value: "7d", label: "7 Hari" },
  { value: "30d", label: "30 Hari" },
  { value: "90d", label: "90 Hari" },
];

const chartTypes = [
  { value: "area", label: "Tren", icon: TrendingUp },
  { value: "bar", label: "Harian", icon: BarChart3 },
  { value: "pie", label: "Porsi", icon: PieChartIcon },
];

const moodColors = ["#3b82f6", "#64748b", "#10b981", "#f59e0b", "#7A9A7E"];
const moodLabels = ["Kurang Baik", "Agak Sedih", "Biasa Saja", "Senang", "Luar Biasa"];

interface MoodAnalyticsProps {
  refreshTrigger?: number;
}

const defaultAnalytics: MoodAnalyticsType = {
  overview: {
    averageMood: 0,
    totalEntries: 0,
    moodDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
  },
  weeklyPatterns: {},
  commonFactors: {},
  aiInsight: null,
  recentEntries: [],
};

export function MoodAnalytics({ refreshTrigger }: MoodAnalyticsProps) {
  const [analytics, setAnalytics] = useState<MoodAnalyticsType>(defaultAnalytics);
  const [isLoading, setIsLoading] = useState(true);
  const [timeframe, setTimeframe] = useState("7d");
  const [chartType, setChartType] = useState("area");

  useEffect(() => {
    loadAnalytics();
  }, [timeframe, refreshTrigger]);

  const loadAnalytics = async () => {
    try {
      setIsLoading(true);
      const response = await moodAPI.getMoodAnalytics(timeframe);

      if (response.data.success && response.data.data?.analytics) {
        // Ensure that sub-objects exist even if partially missing from API
        const fetchedData = response.data.data.analytics;
        setAnalytics({
          ...defaultAnalytics,
          ...fetchedData,
          overview: {
            ...defaultAnalytics.overview,
            ...(fetchedData.overview || {})
          }
        });
      }
    } catch (error) {
      console.error("Gagal memuat analitik");
      setAnalytics(defaultAnalytics);
    } finally {
      setIsLoading(false);
    }
  };

  // Safe variables with fallbacks
  const overview = analytics?.overview || defaultAnalytics.overview;
  const moodDistribution = overview?.moodDistribution || defaultAnalytics.overview.moodDistribution;
  const weeklyPatterns = analytics?.weeklyPatterns || defaultAnalytics.weeklyPatterns;
  const recentEntries = analytics?.recentEntries || defaultAnalytics.recentEntries;

  // Prepare Chart Data safely
  const distributionData = Object.entries(moodDistribution || {}).map(([mood, count]) => ({
    name: moodLabels[parseInt(mood) - 1] || `Mood ${mood}`,
    value: Number(count) || 0,
    fill: moodColors[parseInt(mood) - 1] || "#ccc",
  }));

  const weeklyData = Object.entries(weeklyPatterns || {}).map(([day, data]: [string, any]) => ({
    day: day === "Mon" ? "Sen" : day === "Tue" ? "Sel" : day === "Wed" ? "Rab" : day === "Thu" ? "Kam" : day === "Fri" ? "Jum" : day === "Sat" ? "Sab" : "Min",
    average: data?.average || 0,
    count: data?.count || 0,
  }));

  const trendData = (recentEntries || []).map((entry: any) => ({
    date: new Date(entry.createdAt).toLocaleDateString("id-ID", { day: 'numeric', month: 'short' }),
    mood: entry.mood,
    label: moodLabels[entry.mood - 1] || "Netral",
  }));

  // Fallback dinamis jika AI insight belum tersedia
  const avg = overview?.averageMood || 0;
  const fallbackInsight = avg >= 4
    ? "Mood-mu sedang dalam kondisi yang baik! Pertahankan kebiasaan positif yang sudah kamu jalani dan teruslah merawat dirimu."
    : avg >= 3
      ? "Mood-mu terlihat stabil belakangan ini. Coba perhatikan momen-momen kecil yang membuatmu merasa lebih ringan dan perbanyak hal tersebut."
      : avg >= 2
        ? "Sepertinya ada beberapa hari yang terasa berat. Ingat, merawat diri bukan kemewahan — itu kebutuhan. Satu langkah kecil sudah cukup untuk hari ini."
        : "Konsistensi mencatat perasaanmu adalah langkah berani. Teruslah merawat dirimu, satu catatan kecil sudah sangat berarti.";

  const displayInsight = analytics?.aiInsight || fallbackInsight;

  if (isLoading) {
    return (
      <div className="glass-card rounded-[2.5rem] p-12 flex items-center justify-center border-none shadow-xl shadow-primary/5">
        <div className="text-center space-y-4">
          <Spinner className="w-8 h-8 text-primary mx-auto" />
          <p className="text-sm font-bold text-muted-foreground animate-pulse">Menghitung statistik...</p>
        </div>
      </div>
    );
  }

  if (!overview || overview.totalEntries === 0) {
    return (
      <div className="glass-card rounded-[2.5rem] p-12 text-center border-none shadow-xl shadow-primary/5">
        <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
          <BarChart3 className="w-10 h-10 text-muted-foreground/30" />
        </div>
        <h3 className="text-xl font-bold text-foreground mb-2">Belum Ada Data</h3>
        <p className="text-muted-foreground max-w-xs mx-auto italic">
          Teruslah mencatat perasaanmu setiap hari untuk melihat wawasan emosional yang mendalam di sini.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Quick Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6 rounded-[2rem] border-none shadow-xl shadow-primary/5 flex items-center gap-5">
          <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary shrink-0">
            <Heart className="w-7 h-7" />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Rata-rata Mood</p>
            <div className="flex items-end gap-2">
              <h4 className="text-3xl font-black text-foreground">{(overview?.averageMood || 0).toFixed(1)}</h4>
              <div className="flex mb-1.5 gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className={`w-1.5 h-1.5 rounded-full ${i < Math.round(overview?.averageMood || 0) ? "bg-yellow-400" : "bg-muted"}`} />
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-6 rounded-[2rem] border-none shadow-xl shadow-primary/5 flex items-center gap-5">
          <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary shrink-0">
            <Sparkles className="w-7 h-7" />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Total Catatan</p>
            <h4 className="text-3xl font-black text-foreground">{overview?.totalEntries || 0} <span className="text-sm font-bold text-muted-foreground uppercase ml-1">Hari</span></h4>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card p-6 rounded-[2rem] border-none shadow-xl shadow-primary/5 flex items-center gap-5">
          <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary shrink-0">
            <Zap className="w-7 h-7" />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Kekuatan Mental</p>
            <h4 className="text-3xl font-black text-foreground">Sangat Kuat</h4>
          </div>
        </motion.div>
      </div>

      {/* Main Insights Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">

        {/* Chart Card */}
        <div className="xl:col-span-2 glass-card rounded-[2.5rem] p-8 md:p-10 border-none shadow-xl shadow-primary/5 space-y-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-8 bg-primary rounded-full" />
              <h3 className="text-2xl font-bold text-foreground tracking-tight">Visualisasi Mood</h3>
            </div>

            <div className="flex gap-2 bg-muted/30 p-1.5 rounded-2xl shrink-0">
              {chartTypes.map(ct => (
                <button
                  key={ct.value}
                  onClick={() => setChartType(ct.value)}
                  className={cn(
                    "p-2.5 rounded-xl transition-all",
                    chartType === ct.value ? "bg-white text-primary shadow-md" : "text-muted-foreground hover:text-primary"
                  )}
                  title={ct.label}
                >
                  <ct.icon className="w-5 h-5" />
                </button>
              ))}
            </div>
          </div>

          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              {chartType === "area" ? (
                <AreaChart data={trendData}>
                  <defs>
                    <linearGradient id="colorMood" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#7A9A7E" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#7A9A7E" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 'bold' }} />
                  <YAxis hide domain={[1, 5]} />
                  <Tooltip
                    contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', fontWeight: 'bold' }}
                    formatter={(v: number) => [moodLabels[v - 1] || "Netral", "Perasaan"]}
                  />
                  <Area type="monotone" dataKey="mood" stroke="#7A9A7E" strokeWidth={4} fillOpacity={1} fill="url(#colorMood)" />
                </AreaChart>
              ) : chartType === "bar" ? (
                <BarChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 'bold' }} />
                  <YAxis hide domain={[0, 5]} />
                  <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', fontWeight: 'bold' }} />
                  <Bar dataKey="average" radius={[12, 12, 12, 12]} barSize={40}>
                    {weeklyData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={moodColors[Math.round(entry.average) - 1] || "#ccc"} />
                    ))}
                  </Bar>
                </BarChart>
              ) : (
                <PieChart>
                  <Pie
                    data={distributionData.filter(d => d.value > 0)}
                    cx="50%" cy="50%"
                    innerRadius={80} outerRadius={120}
                    paddingAngle={8}
                    dataKey="value"
                  >
                    {distributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} stroke="none" />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', fontWeight: 'bold' }} />
                </PieChart>
              )}
            </ResponsiveContainer>
          </div>

          <div className="flex flex-wrap justify-center gap-4 pt-4">
            {timeframes.map(tf => (
              <button
                key={tf.value}
                onClick={() => setTimeframe(tf.value)}
                className={cn(
                  "px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all",
                  timeframe === tf.value ? "bg-primary text-white shadow-lg shadow-primary/20" : "bg-muted/30 text-muted-foreground hover:bg-muted/50"
                )}
              >
                {tf.label}
              </button>
            ))}
          </div>
        </div>

        {/* AI Wisdom Card */}
        <div className="space-y-8">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="rounded-[2.5rem] p-8 border-none shadow-xl shadow-primary/15 relative overflow-hidden group"
            style={{ background: "linear-gradient(145deg, #3B5E42 0%, #2E4A38 60%, #263E30 100%)" }}
          >
            {/* Subtle sage glow — stays within earthy palette */}
            <div className="absolute top-[-30px] right-[-30px] w-44 h-44 rounded-full blur-3xl opacity-20 pointer-events-none" style={{ background: "radial-gradient(circle, #A8C5AB 0%, transparent 70%)" }} />

            {/* Decorative elements - Animated Brain */}
            <div className="absolute top-[-20px] right-[-20px] opacity-[0.07] group-hover:scale-110 group-hover:rotate-12 transition-transform duration-700">
              <BrainCircuit className="w-40 h-40 text-white" />
            </div>

            <div className="relative z-10 space-y-6">
              <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20">
                <Sparkles className="w-3.5 h-3.5" style={{ color: "#B8D4BB" }} />
                <span className="text-[10px] font-black uppercase tracking-[0.2em]" style={{ color: "#C8DEC9" }}>Refleksi AI berdasarkan Catatan Mood-mu</span>
              </div>


              <div className="relative">
                <div className="absolute -left-4 top-0 w-1 h-full rounded-full" style={{ background: "rgba(168, 197, 171, 0.5)" }} />
                <p className="text-sm font-medium leading-relaxed italic pl-2" style={{ color: "#C5DCC7" }}>
                  &quot;{displayInsight}&quot;
                </p>
              </div>

              <div className="pt-4 flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.2em]" style={{ color: "#9DC1A0" }}>
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Analisis Lokal &amp; Privat</span>
              </div>
            </div>
          </motion.div>
          {/* Small Distribution List */}
          <div className="glass-card rounded-[2.5rem] p-8 border-none shadow-xl shadow-primary/5">
            <h3 className="text-sm font-black uppercase tracking-widest text-muted-foreground mb-6">Porsi Perasaan</h3>
            <div className="space-y-4">
              {(distributionData || []).map((item, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-foreground/80">{item.name}</span>
                    <span className="text-muted-foreground">{item.value}x</span>
                  </div>
                  <div className="h-1.5 w-full bg-muted/50 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${overview?.totalEntries ? (item.value / overview.totalEntries) * 100 : 0}%` }}
                      transition={{ duration: 1, delay: i * 0.1 }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: item.fill }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
