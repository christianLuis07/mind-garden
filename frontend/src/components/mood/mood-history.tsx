"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { Search, Filter, Calendar, CloudRain, Cloud, Wind, Sun, Sparkles, Moon, Users, Briefcase, Dumbbell, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { moodAPI } from "@/lib/mood-api";
import { MoodEntry } from "@/types/mood";
import { motion, AnimatePresence } from "framer-motion";

const moodIcons = [
  { icon: CloudRain, label: "Sangat Sedih", color: "text-blue-500", bg: "bg-blue-500/10" },
  { icon: Cloud, label: "Sedih", color: "text-slate-500", bg: "bg-slate-500/10" },
  { icon: Wind, label: "Netral", color: "text-emerald-500", bg: "bg-emerald-500/10" },
  { icon: Sun, label: "Bahagia", color: "text-amber-500", bg: "bg-amber-500/10" },
  { icon: Sparkles, label: "Sangat Bahagia", color: "text-primary", bg: "bg-primary/10" },
];

interface MoodHistoryProps {
  refreshTrigger?: number;
}

export function MoodHistory({ refreshTrigger }: MoodHistoryProps) {
  const [entries, setEntries] = useState<MoodEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState<"all" | "week" | "month">("all");

  useEffect(() => {
    loadMoodEntries();
  }, [refreshTrigger, dateFilter]);

  const loadMoodEntries = async () => {
    try {
      setIsLoading(true);
      const params: any = { limit: 50 };
      if (dateFilter === "week") {
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        params.startDate = oneWeekAgo.toISOString().split("T")[0];
      } else if (dateFilter === "month") {
        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
        params.startDate = oneMonthAgo.toISOString().split("T")[0];
      }
      const response = await moodAPI.getMoodEntries(params);
      if (response.data.success) {
        setEntries(response.data.data.entries);
      }
    } catch (error: any) {
      console.error("Gagal mengambil riwayat mood");
    } finally {
      setIsLoading(false);
    }
  };

  const filteredEntries = entries.filter((entry) =>
    entry.notes?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="glass-card rounded-[2.5rem] p-12 flex items-center justify-center border-none">
        <Spinner className="w-8 h-8 text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search & Filter - Elegant Bar */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4 group-focus-within:text-primary transition-colors" />
          <Input
            placeholder="Cari dalam ingatan..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-12 h-14 bg-card/50 border-none rounded-2xl shadow-sm focus:ring-2 focus:ring-primary/20 transition-all"
          />
        </div>
        <div className="flex bg-card/50 p-1 rounded-2xl shadow-sm">
          {["all", "week", "month"].map((f) => (
            <button
              key={f}
              onClick={() => setDateFilter(f as any)}
              className={`px-6 h-12 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${
                dateFilter === f ? "bg-primary text-white shadow-lg shadow-primary/20" : "text-muted-foreground hover:text-primary"
              }`}
            >
              {f === "all" ? "Semua" : f === "week" ? "Pekan" : "Bulan"}
            </button>
          ))}
        </div>
      </div>

      {filteredEntries.length === 0 ? (
        <div className="glass-card rounded-[2.5rem] p-20 text-center border-none shadow-xl shadow-primary/5">
          <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
            <Calendar className="w-10 h-10 text-muted-foreground/40" />
          </div>
          <h3 className="text-xl font-bold text-foreground mb-2">Halaman Kosong</h3>
          <p className="text-muted-foreground max-w-xs mx-auto font-medium italic">
            Belum ada catatan perasaan yang mekar di periode ini.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredEntries.map((entry, index) => {
              const moodInfo = moodIcons[entry.mood - 1];
              const Icon = moodInfo.icon;

              return (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: index * 0.05 }}
                  className="glass-card rounded-[2.5rem] p-6 border-none shadow-xl shadow-primary/5 hover:shadow-primary/10 transition-all duration-500 group"
                >
                  <div className="flex items-start gap-5">
                    {/* Mood Icon Orb */}
                    <div className={`w-16 h-16 shrink-0 rounded-3xl flex items-center justify-center transition-transform duration-500 group-hover:rotate-6 ${moodInfo.bg}`}>
                      <Icon className={`w-8 h-8 ${moodInfo.color}`} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-3">
                        <span className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full ${moodInfo.bg} ${moodInfo.color}`}>
                          {moodInfo.label}
                        </span>
                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                          {format(new Date(entry.createdAt), "d MMM yyyy", { locale: id })}
                        </span>
                      </div>

                      {entry.notes ? (
                        <p className="text-foreground font-medium leading-relaxed mb-4 line-clamp-3 italic">
                          &quot;{entry.notes}&quot;
                        </p>
                      ) : (
                        <p className="text-muted-foreground/60 text-sm italic mb-4">Tanpa catatan tambahan.</p>
                      )}

                      {/* Factors - Minimalist Chips */}
                      <div className="flex flex-wrap gap-2">
                        {entry.factors?.sleep && (
                          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-muted/40 rounded-xl text-[10px] font-bold text-muted-foreground">
                            <Moon className="w-3 h-3" />
                            <span>Tidur: {entry.factors.sleep}</span>
                          </div>
                        )}
                        {entry.factors?.social && (
                          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-muted/40 rounded-xl text-[10px] font-bold text-muted-foreground">
                            <Users className="w-3 h-3" />
                            <span>Sosial: {entry.factors.social}</span>
                          </div>
                        )}
                        {entry.factors?.work && (
                          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-muted/40 rounded-xl text-[10px] font-bold text-muted-foreground">
                            <Briefcase className="w-3 h-3" />
                            <span>Kerja: {entry.factors.work}</span>
                          </div>
                        )}
                        {entry.factors?.exercise && (
                          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 rounded-xl text-[10px] font-bold text-primary">
                            <Dumbbell className="w-3 h-3" />
                            <span>Olahraga</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
