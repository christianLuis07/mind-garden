"use client";

import { useState, useEffect } from "react";
import { Calendar, Clock, Target, Filter } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { breathingAPI } from "@/lib/breathing-api";
import { BreathingSession } from "@/types/breathing";
import { format, formatDistanceToNow } from "date-fns";
import { id } from "date-fns/locale";

export function SessionHistory() {
  const [sessions, setSessions] = useState<BreathingSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [showFilters, setShowFilters] = useState(false);

  const fetchSessions = async () => {
    try {
      setLoading(true);
      const params: any = {};

      if (search) params.technique = search;
      if (dateRange.start) params.startDate = dateRange.start;
      if (dateRange.end) params.endDate = dateRange.end;

      const response = await breathingAPI.getSessions(params);
      if (response.data.success) {
        setSessions(response.data.data.sessions);
      }
    } catch (error) {
      console.error("Gagal mengambil sesi:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  const clearFilters = () => {
    setSearch("");
    setDateRange({ start: "", end: "" });
  };

  const getCalmLevelColor = (level?: number) => {
    if (!level) return "bg-gray-100 text-gray-700";
    if (level >= 7) return "bg-green-100 text-green-800";
    if (level >= 4) return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Riwayat Sesi</h2>
        <p className="text-gray-600 mt-1">
          Lihat catatan latihan pernapasanmu sebelumnya
        </p>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2"
              >
                <Filter className="w-4 h-4" />
                <span>Filter</span>
              </Button>

              {(search || dateRange.start || dateRange.end) && (
                <Button
                  variant="ghost"
                  onClick={clearFilters}
                  className="text-sm"
                >
                  Hapus Semua
                </Button>
              )}
            </div>

            {showFilters && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Teknik
                  </label>
                  <Input
                    placeholder="Cari teknik..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Rentang Tanggal
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      type="date"
                      placeholder="Tanggal Mulai"
                      value={dateRange.start}
                      onChange={(e) =>
                        setDateRange((prev) => ({
                          ...prev,
                          start: e.target.value,
                        }))
                      }
                    />
                    <Input
                      type="date"
                      placeholder="Tanggal Selesai"
                      value={dateRange.end}
                      onChange={(e) =>
                        setDateRange((prev) => ({
                          ...prev,
                          end: e.target.value,
                        }))
                      }
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Sessions List */}
      {sessions.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <Target className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Tidak ada sesi
            </h3>
            <p className="text-gray-600">
              {search || dateRange.start || dateRange.end
                ? "Coba sesuaikan filtermu"
                : "Mulai latihan pernapasan pertama untuk melihat riwayatmu"}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {sessions.map((session) => (
            <Card
              key={session.id}
              className="hover:shadow-md transition-shadow"
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4">
                      <div>
                        <h3 className="font-semibold text-gray-900 text-lg">
                          {session.technique}
                        </h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-4 h-4" />
                            <span>
                              {formatDistanceToNow(
                                new Date(session.createdAt),
                                {
                                  addSuffix: true,
                                  locale: id,
                                }
                              )}
                            </span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="w-4 h-4" />
                            <span>
                              {Math.round(session.duration / 60)} menit
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {session.calmLevel && (
                    <div
                      className={`px-3 py-1 rounded-full border text-sm font-medium ${getCalmLevelColor(
                        session.calmLevel
                      )}`}
                    >
                      Tenang: {session.calmLevel}/10
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
                  <div className="text-sm text-gray-500">
                    {format(
                      new Date(session.createdAt),
                      "dd MMM yyyy 'pukul' HH:mm",
                      {
                        locale: id,
                      }
                    )}
                  </div>
                  <div
                    className={`px-2 py-1 text-xs rounded-full ${
                      session.completed
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {session.completed ? "Selesai" : "Belum selesai"}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
