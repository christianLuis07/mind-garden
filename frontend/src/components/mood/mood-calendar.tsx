// src/components/mood/mood-calendar.tsx
"use client";

import { useState, useEffect } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  subMonths,
  addMonths,
} from "date-fns";
import { id } from "date-fns/locale";
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { moodAPI } from "@/lib/mood-api";
import { MoodEntry } from "@/types/mood";

const moodColors = [
  "bg-red-500", // 1 - Very Sad
  "bg-orange-500", // 2 - Sad
  "bg-yellow-500", // 3 - Neutral
  "bg-green-500", // 4 - Happy
  "bg-emerald-500", // 5 - Very Happy
];

const moodHoverColors = [
  "bg-red-600",
  "bg-orange-600",
  "bg-yellow-600",
  "bg-green-600",
  "bg-emerald-600",
];

interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  moodEntry?: MoodEntry;
}

interface MoodCalendarProps {
  refreshTrigger?: number;
}

export function MoodCalendar({ refreshTrigger }: MoodCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedEntry, setSelectedEntry] = useState<MoodEntry | null>(null);

  useEffect(() => {
    loadMoodEntries();
  }, [currentDate, refreshTrigger]);

  const loadMoodEntries = async () => {
    try {
      setIsLoading(true);

      const start = startOfMonth(currentDate);
      const end = endOfMonth(currentDate);

      const response = await moodAPI.getMoodEntries({
        startDate: start.toISOString().split("T")[0],
        endDate: end.toISOString().split("T")[0],
        limit: 100,
      });

      if (response.data.success) {
        setMoodEntries(response.data.data.entries);
      }
    } catch (error) {
      console.error("Failed to load mood entries:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getMoodForDate = (date: Date): MoodEntry | undefined => {
    return moodEntries.find((entry) =>
      isSameDay(new Date(entry.createdAt), date)
    );
  };

  const generateCalendarDays = (): CalendarDay[] => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const calendarStart = startOfMonth(subMonths(currentDate, 1));
    const calendarEnd = endOfMonth(addMonths(currentDate, 1));

    const days = eachDayOfInterval({
      start: calendarStart,
      end: calendarEnd,
    });

    return days.map((date) => ({
      date,
      isCurrentMonth: isSameMonth(date, currentDate),
      moodEntry: getMoodForDate(date),
    }));
  };

  const calendarDays = generateCalendarDays();
  const monthName = format(currentDate, "MMMM yyyy", { locale: id });

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentDate((current) =>
      direction === "prev" ? subMonths(current, 1) : addMonths(current, 1)
    );
  };

  const getMoodColor = (mood: number, isHover: boolean = false) => {
    const colors = isHover ? moodHoverColors : moodColors;
    return colors[mood - 1] || "bg-gray-200";
  };

  const moodEmojis = ["😢", "😞", "😐", "😊", "😄"];

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-center h-64">
          <Spinner />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Kalender mood</h2>

        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigateMonth("prev")}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>

          <span className="text-lg font-medium text-gray-900 min-w-32 text-center">
            {monthName}
          </span>

          <Button
            variant="outline"
            size="sm"
            onClick={() => navigateMonth("next")}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1 mb-4">
        {["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"].map((day) => (
          <div
            key={day}
            className="text-center text-sm font-medium text-gray-500 py-2"
          >
            {day}
          </div>
        ))}

        {calendarDays.map((day, index) => {
          return (
            <div
              key={index}
              className={`
                aspect-square p-1 relative
                ${!day.isCurrentMonth ? "opacity-30" : ""}
              `}
            >
              <button
                onClick={() => day.moodEntry && setSelectedEntry(day.moodEntry)}
                className={`
                  w-full h-full rounded-lg flex items-center justify-center text-white text-sm font-medium
                  transition-all hover:scale-105
                  ${
                    day.moodEntry
                      ? getMoodColor(day.moodEntry.mood) +
                        " hover:" +
                        getMoodColor(day.moodEntry.mood, true)
                      : "bg-gray-100 hover:bg-gray-200 text-gray-400"
                  }
                  ${
                    selectedEntry && day.moodEntry?.id === selectedEntry.id
                      ? "ring-2 ring-green-500 ring-offset-2"
                      : ""
                  }
                `}
              >
                {format(day.date, "d")}
                {day.moodEntry && (
                  <span className="absolute bottom-1 text-xs">
                    {moodEmojis[day.moodEntry.mood - 1]}
                  </span>
                )}
              </button>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex justify-center space-x-4 text-xs">
        {[1, 2, 3, 4, 5].map((mood) => (
          <div key={mood} className="flex items-center space-x-1">
            <div className={`w-3 h-3 rounded ${getMoodColor(mood)}`} />
            <span className="text-gray-600">
              {["VS", "S", "N", "H", "VH"][mood - 1]}
            </span>
          </div>
        ))}
      </div>

      {/* Selected Entry Details */}
      {selectedEntry && (
        <div className="mt-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-900">
              {format(new Date(selectedEntry.createdAt), "EEEE, MMMM d, yyyy", {
                locale: id,
              })}
            </h3>
            <button
              onClick={() => setSelectedEntry(null)}
              className="text-gray-400 hover:text-gray-600"
            >
              ×
            </button>
          </div>

          <div className="flex items-center space-x-3 mb-3">
            <div
              className={`w-8 h-8 rounded-lg flex items-center justify-center text-white ${getMoodColor(
                selectedEntry.mood
              )}`}
            >
              {moodEmojis[selectedEntry.mood - 1]}
            </div>
            <div>
              <div className="font-medium text-gray-900">
                {
                  [
                    "Sangat Sedih",
                    "Sedih",
                    "Netral",
                    "Bahagia",
                    "Sangat Bahagia",
                  ][selectedEntry.mood - 1]
                }
              </div>
              <div className="text-sm text-gray-500">
                {selectedEntry.mood}/5
              </div>
            </div>
          </div>

          {selectedEntry.notes && (
            <p className="text-gray-700 text-sm mb-3">{selectedEntry.notes}</p>
          )}

          {selectedEntry.factors && (
            <div className="flex flex-wrap gap-2">
              {selectedEntry.factors.sleep && (
                <span className="inline-flex items-center text-xs text-gray-600 bg-white px-2 py-1 rounded border">
                  😴 Tidur: {selectedEntry.factors.sleep}/10
                </span>
              )}
              {selectedEntry.factors.exercise && (
                <span className="inline-flex items-center text-xs text-gray-600 bg-white px-2 py-1 rounded border">
                  🏃 Berolahraga
                </span>
              )}
              {selectedEntry.factors.social && (
                <span className="inline-flex items-center text-xs text-gray-600 bg-white px-2 py-1 rounded border">
                  👥 Sosial: {selectedEntry.factors.social}/10
                </span>
              )}
              {selectedEntry.factors.work && (
                <span className="inline-flex items-center text-xs text-gray-600 bg-white px-2 py-1 rounded border">
                  💼 Kerja: {selectedEntry.factors.work}/10
                </span>
              )}
            </div>
          )}
        </div>
      )}

      {/* Empty State */}
      {moodEntries.length === 0 && (
        <div className="text-center py-8">
          <CalendarIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Belum Ada Data Mood di Bulan Ini
          </h3>
          <p className="text-gray-500 max-w-sm mx-auto">
            Mulai catat mood harianmu untuk melihat kalender ini terisi penuh
            warna!
          </p>
        </div>
      )}
    </div>
  );
}
