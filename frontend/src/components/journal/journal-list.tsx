"use client";

import { useState, useEffect } from "react";
import {
  Search,
  Filter,
  Calendar,
  Tag,
  Eye,
  EyeOff,
  Edit,
  Trash2,
  Plus,
  Clock,
  Image as ImageIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { journalAPI } from "@/lib/journal-api";
import { JournalEntry } from "@/types/journal";
import { formatDistanceToNow } from "date-fns";
import { id } from "date-fns/locale";
import { toast } from "sonner";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

interface JournalListProps {
  onEdit?: (entry: JournalEntry) => void;
  onNewEntry?: () => void;
  onView?: (entry: JournalEntry) => void;
  showPublic?: boolean;
}

export function JournalList({
  onEdit,
  onNewEntry,
  onView,
  showPublic = false,
}: JournalListProps) {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState<{ start: string; end: string }>({
    start: "",
    end: "",
  });
  const [allTags, setAllTags] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  const fetchEntries = async () => {
    try {
      setLoading(true);
      const params: any = {};
      if (search) params.search = search;
      if (selectedTags.length > 0) params.tags = selectedTags;
      if (dateRange.start) params.startDate = dateRange.start;
      if (dateRange.end) params.endDate = dateRange.end;

      const response = showPublic
        ? await journalAPI.getPublicJournals(params)
        : await journalAPI.getJournalEntries(params);

      if (response.data.success) {
        setEntries(response.data.data.entries);
        const tags = Array.from(
          new Set(
            response.data.data.entries.flatMap(
              (entry: JournalEntry) => entry.tags || []
            )
          )
        ) as string[];
        setAllTags(tags);
      }
    } catch (error) {
      toast.error("Gagal memuat entri jurnal");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEntries();
  }, [search, selectedTags, dateRange, showPublic]);

  const handleDelete = async (entry: JournalEntry) => {
    if (!confirm("Apakah Anda yakin ingin menghapus entri ini?")) return;
    try {
      const response = await journalAPI.deleteJournalEntry(entry.id);
      if (response.data.success) {
        toast.success("Jurnal berhasil dihapus");
        fetchEntries();
      }
    } catch (error) {
      toast.error("Gagal menghapus entri");
    }
  };

  const getImageUrl = (path: string) => {
    if (!path) return "";
    if (path.startsWith("http")) return path;
    const cleanPath = path.startsWith("/") ? path : `/${path}`;
    return `${API_BASE_URL}${cleanPath}`;
  };

  const handleTagToggle = (tag: string) =>
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );

  const clearFilters = () => {
    setSearch("");
    setSelectedTags([]);
    setDateRange({ start: "", end: "" });
  };

  const truncateContent = (html: string, maxLength: number = 100) => {
    const text = html.replace(/<[^>]*>/g, "");
    return text.length > maxLength
      ? text.substring(0, maxLength) + "..."
      : text;
  };

  if (loading && entries.length === 0)
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
      </div>
    );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            {showPublic ? "Jurnal Komunitas" : "Entri Jurnal Saya"}
          </h2>
          <p className="text-gray-600 mt-1">
            {showPublic
              ? "Dapatkan inspirasi dari pengalaman orang lain"
              : "Renungkan kembali pikiran dan pengalamanmu"}
          </p>
        </div>
        {!showPublic && onNewEntry && (
          <Button
            onClick={onNewEntry}
            className="bg-green-600 hover:bg-green-700 w-full sm:w-auto"
          >
            <Plus className="w-4 h-4 mr-2" />
            Entri Baru
          </Button>
        )}
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Cari entri..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2"
              >
                <Filter className="w-4 h-4" />
                <span>Filter</span>
                {(selectedTags.length > 0 ||
                  dateRange.start ||
                  dateRange.end) && (
                  <span className="ml-2 w-6 h-6 bg-green-600 text-white text-xs rounded-full flex items-center justify-center">
                    {selectedTags.length +
                      (dateRange.start ? 1 : 0) +
                      (dateRange.end ? 1 : 0)}
                  </span>
                )}
              </Button>
              {(selectedTags.length > 0 ||
                dateRange.start ||
                dateRange.end) && (
                <Button
                  variant="ghost"
                  onClick={clearFilters}
                  className="text-sm"
                >
                  Hapus Filter
                </Button>
              )}
            </div>
            {showFilters && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center space-x-2">
                    <Calendar className="w-4 h-4" />
                    <span>Rentang Tanggal</span>
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      type="date"
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
                {allTags.length > 0 && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center space-x-2">
                      <Tag className="w-4 h-4" />
                      <span>Tag</span>
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {allTags.map((tag) => (
                        <button
                          key={tag}
                          onClick={() => handleTagToggle(tag)}
                          className={`px-3 py-1 text-sm rounded-full border transition-colors ${
                            selectedTags.includes(tag)
                              ? "bg-green-600 text-white border-green-600"
                              : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200"
                          }`}
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {entries.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center text-gray-500">
            <div className="flex justify-center mb-4">
              <Edit className="w-16 h-16 text-gray-300" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Tidak ada entri ditemukan
            </h3>
            <p className="text-gray-600 mb-4">
              {search ||
              selectedTags.length > 0 ||
              dateRange.start ||
              dateRange.end
                ? "Coba sesuaikan pencarian atau filter Anda"
                : showPublic
                ? "Belum ada entri publik"
                : "Mulai tulis entri jurnal pertamamu"}
            </p>
            {!showPublic && onNewEntry && (
              <Button
                onClick={onNewEntry}
                className="bg-green-600 hover:bg-green-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Tulis Entri Pertama
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        // --- PERBAIKAN GRID DI SINI ---
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {entries.map((entry) => (
            <Card
              key={entry.id}
              className="hover:shadow-lg transition-all border-gray-200 group flex flex-col h-full overflow-hidden"
            >
              {/* GAMBAR HEADER - FIXED ASPECT RATIO */}
              <div className="relative h-48 w-full bg-gray-100 overflow-hidden shrink-0">
                {entry.images && entry.images.length > 0 ? (
                  <img
                    src={getImageUrl(entry.images[0])}
                    alt={entry.title || "Jurnal"}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "https://placehold.co/400x300?text=No+Image";
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                    <ImageIcon className="w-10 h-10 mb-2 opacity-50" />
                  </div>
                )}
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-medium shadow-sm">
                  {formatDistanceToNow(new Date(entry.createdAt), {
                    addSuffix: true,
                    locale: id,
                  })}
                </div>
              </div>

              <CardContent className="p-5 flex flex-col flex-1">
                {/* Header User (Jika Public) */}
                {showPublic && entry.user && (
                  <div className="flex items-center gap-2 mb-3 pb-3 border-b border-gray-100">
                    {entry.user.avatar ? (
                      <img
                        src={getImageUrl(entry.user.avatar)}
                        alt={entry.user.name}
                        className="w-6 h-6 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-6 h-6 rounded-full bg-green-100 text-green-700 flex items-center justify-center text-xs font-bold">
                        {(entry.user.name || "U").charAt(0).toUpperCase()}
                      </div>
                    )}
                    <span className="text-xs text-gray-600 font-medium truncate">
                      {entry.user.name}
                    </span>
                  </div>
                )}

                <h3
                  className="font-bold text-lg text-gray-900 mb-2 line-clamp-1 cursor-pointer hover:text-green-600"
                  onClick={() => onView?.(entry)}
                >
                  {entry.title || "Tanpa Judul"}
                </h3>

                {/* Content Preview */}
                <p className="text-gray-600 text-sm leading-relaxed line-clamp-3 mb-4 flex-1">
                  {truncateContent(entry.content)}
                </p>

                {/* Tags */}
                {entry.tags && entry.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {entry.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 bg-green-50 text-green-700 text-xs rounded-md"
                      >
                        #{tag}
                      </span>
                    ))}
                    {entry.tags.length > 3 && (
                      <span className="text-xs text-gray-400">
                        +{entry.tags.length - 3}
                      </span>
                    )}
                  </div>
                )}

                {/* Footer Buttons */}
                <div className="mt-auto pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-green-600 hover:text-green-700 hover:bg-green-50 px-2 h-8 text-xs font-medium"
                    onClick={() => onView?.(entry)}
                  >
                    Baca <Eye className="w-3 h-3 ml-1.5" />
                  </Button>

                  {!showPublic && (
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-gray-500 hover:text-blue-600"
                        onClick={() => onEdit?.(entry)}
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-gray-500 hover:text-red-600"
                        onClick={() => handleDelete(entry)}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
