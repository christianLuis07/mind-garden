"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { Search, Filter, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { moodAPI } from "@/lib/mood-api";
import { MoodEntry } from "@/types/mood";

const moodEmojis = ["😢", "😞", "😐", "😊", "😄"];
const moodColors = [
  "bg-red-100 text-red-800",
  "bg-orange-100 text-orange-800",
  "bg-yellow-100 text-yellow-800",
  "bg-green-100 text-green-800",
  "bg-emerald-100 text-emerald-800",
];

interface MoodHistoryProps {
  refreshTrigger?: number;
}

export function MoodHistory({ refreshTrigger }: MoodHistoryProps) {
  const [entries, setEntries] = useState<MoodEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(" ");
  const [dateFilter, setDateFilter] = useState<"all" | "week" | "month">("all");

  useEffect(() => {
    loadMoodEntries();
  }, [refreshTrigger]);

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
      console.error("Gagal untuk mengambil mood entries yang tersimpan");
    } finally {
      setIsLoading(false);
    }
  };

  const filteredEntries = entries.filter((entry) =>
    entry.notes?.toLocaleLowerCase().includes(searchTerm.toLowerCase())
  );

  const getMoodDisplay = (mood: number) => {
    return {
      emoji: moodEmojis[mood - 1],
      color: moodColors[mood - 1],
      label: ["Sangat Sedih", "Sedih", "Netral", "Bahagia", "Sangat Bahagia"][
        mood - 1
      ],
    };
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-center h-32">
          <Spinner />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h2 className="text-xl font-semibold text-gray-900">Riwayat Mood</h2>
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Mencari catatan..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full sm:w-48"
            />
          </div>
          {/* Date Filter */}
          <div className="flex border border-gray-300 rounded-lg overflow-hidden">
            <Button
              variant={dateFilter === "all" ? "default" : "ghost"}
              size="sm"
              onClick={() => setDateFilter("all")}
              className="rounded-none border-0"
            >
              Semua
            </Button>
            <Button
              variant={dateFilter === "week" ? "default" : "ghost"}
              size="sm"
              onClick={() => setDateFilter("week")}
              className="rounded-none border-0"
            >
              Pekan
            </Button>
            <Button
              variant={dateFilter === "month" ? "default" : "ghost"}
              size="sm"
              onClick={() => setDateFilter("month")}
              className="rounded-none border-0"
            >
              Bulan
            </Button>
          </div>
        </div>
      </div>

      {filteredEntries.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Calendar className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            tidak ada entri mood
          </h3>
          <p className="text-gray-500 max-w-sm mx-auto">
            {searchTerm || dateFilter !== "all"
              ? "Tidak ada data yang sesuai dengan filtermu. Coba ubah pencarian atau filternya."
              : "Mulai catat moodmu untuk melihat riwayat di sini"}
          </p>
        </div>
      ) : (
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {filteredEntries.map((entry) => {
            const moodDisplay = getMoodDisplay(entry.mood);

            return (
              <div
                key={entry.id}
                className="flex items-center space-x-4 p-4 rounded-xl border border-gray-200 hover:border-gray-300 transition-colors"
              >
                {/* Mood Indicator */}
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${moodDisplay.color}`}
                >
                  {moodDisplay.emoji}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${moodDisplay.color}`}
                      >
                        {moodDisplay.label}
                      </span>
                      {entry.factors?.exercise && (
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                          🏃 Berolahraga
                        </span>
                      )}
                    </div>
                    <span className="text-sm text-gray-500 whitespace-nowrap">
                      {format(
                        new Date(entry.createdAt),
                        "MMM d, yyyy • HH:mm",
                        { locale: id }
                      )}
                    </span>
                  </div>
                  {entry.notes && (
                    <p className="text-gray-700 text-sm leading-relaxed">
                      {entry.notes}
                    </p>
                  )}

                  {/* Factors */}
                  {entry.factors && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {entry.factors.sleep && (
                        <span className="inline-flex items-center text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded">
                          😴 Tidur: {entry.factors.sleep}/10
                        </span>
                      )}
                      {entry.factors.social && (
                        <span className="inline-flex items-center text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded">
                          👥 Sosial: {entry.factors.social}/10
                        </span>
                      )}
                      {entry.factors.work && (
                        <span className="inline-flex items-center text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded">
                          💼 Kerja: {entry.factors.work}/10
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
