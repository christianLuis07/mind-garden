"use client";

import { useState, useEffect } from "react";
import {
  Search,
  Filter,
  CalendarDays,
  Tag,
  Eye,
  EyeOff,
  Edit3,
  Trash2,
  Plus,
  Clock,
  Image as ImageIcon,
  SlidersHorizontal,
  X,
  ChevronRight,
  Globe,
  Lock,
  Feather,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { journalAPI } from "@/lib/journal-api";
import { JournalEntry } from "@/types/journal";
import { format, formatDistanceToNow } from "date-fns";
import { id } from "date-fns/locale";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

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
    if (!confirm("Apakah Anda yakin ingin menghapus tulisan ini?")) return;
    try {
      const response = await journalAPI.deleteJournalEntry(entry.id);
      if (response.data.success) {
        toast.success("Tulisan berhasil dihapus");
        fetchEntries();
      }
    } catch (error) {
      toast.error("Gagal menghapus tulisan");
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

  const truncateContent = (html: string, maxLength: number = 80) => {
    const text = html.replace(/<[^>]*>/g, "");
    return text.length > maxLength
      ? text.substring(0, maxLength) + "..."
      : text;
  };

  if (loading && entries.length === 0)
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
        <p className="text-muted-foreground font-medium animate-pulse italic">Memuat jurnal...</p>
      </div>
    );

  return (
    <div className="space-y-8">
      {/* Search & Filter */}
      <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4 group-focus-within:text-primary transition-colors" />
          <Input
            placeholder="Cari tulisanmu..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-12 h-14 bg-card/50 border-none rounded-2xl shadow-xl shadow-primary/5 focus:ring-2 focus:ring-primary/20 transition-all"
          />
        </div>
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className={`h-14 px-6 rounded-2xl border-none shadow-xl shadow-primary/5 transition-all ${
              showFilters ? "bg-primary text-white" : "bg-card/50 text-muted-foreground hover:bg-primary/10 hover:text-primary"
            }`}
          >
            <SlidersHorizontal className="w-4 h-4 mr-2" />
            Filter
            {(selectedTags.length > 0 || dateRange.start || dateRange.end) && (
               <span className="ml-2 w-5 h-5 bg-white/20 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                 {selectedTags.length + (dateRange.start ? 1 : 0) + (dateRange.end ? 1 : 0)}
               </span>
            )}
          </Button>

          {(selectedTags.length > 0 || dateRange.start || dateRange.end) && (
            <Button
              variant="ghost"
              onClick={clearFilters}
              className="h-14 px-4 rounded-2xl text-destructive hover:bg-destructive/10"
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Expanded Filters */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="glass-card rounded-[2rem] p-6 grid grid-cols-1 md:grid-cols-2 gap-8 border-none shadow-xl shadow-primary/5">
              <div className="space-y-4">
                <div className="flex items-center space-x-2 text-primary">
                  <CalendarDays className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase tracking-widest">Berdasarkan Waktu</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    type="date"
                    value={dateRange.start}
                    onChange={(e) => setDateRange((prev) => ({ ...prev, start: e.target.value }))}
                    className="bg-muted/30 border-none rounded-xl h-12 text-sm"
                  />
                  <Input
                    type="date"
                    value={dateRange.end}
                    onChange={(e) => setDateRange((prev) => ({ ...prev, end: e.target.value }))}
                    className="bg-muted/30 border-none rounded-xl h-12 text-sm"
                  />
                </div>
              </div>

              {allTags.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center space-x-2 text-primary">
                    <Tag className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase tracking-widest">Berdasarkan Topik</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {allTags.map((tag) => (
                      <button
                        key={tag}
                        onClick={() => handleTagToggle(tag)}
                        className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
                          selectedTags.includes(tag)
                            ? "bg-primary text-white shadow-lg shadow-primary/20"
                            : "bg-muted/30 text-muted-foreground hover:bg-muted/50"
                        }`}
                      >
                        #{tag}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {entries.length === 0 ? (
        <div className="glass-card rounded-[3rem] p-20 text-center border-none shadow-xl shadow-primary/5">
          <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-8">
            <Feather className="w-10 h-10 text-muted-foreground/30" />
          </div>
          <h3 className="text-2xl font-bold text-foreground mb-3">Belum Ada Tulisan</h3>
          <p className="text-muted-foreground max-w-sm mx-auto font-medium mb-8 leading-relaxed">
            {search || selectedTags.length > 0 || dateRange.start || dateRange.end
              ? "Tidak ada tulisan yang ditemukan dengan filter ini."
              : "Mulai tuliskan ceritamu hari ini. Kadang, menuangkan pikiran ke dalam tulisan bisa membuat hati lebih lega."}
          </p>
          {!showPublic && onNewEntry && (
            <Button
              onClick={onNewEntry}
              className="h-16 px-10 rounded-2xl bg-primary hover:bg-primary/90 text-white font-bold text-lg shadow-xl shadow-primary/20"
            >
              <Plus className="w-5 h-5 mr-3" />
              Mulai Menulis
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {entries.map((entry, index) => (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: index * 0.05 }}
                className="group flex flex-col h-[520px] bg-card rounded-[2.5rem] overflow-hidden shadow-xl shadow-primary/5 hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 border border-border/20"
              >
                {/* Image Section */}
                <div className="relative h-64 w-full bg-muted overflow-hidden shrink-0">
                  {entry.images && entry.images.length > 0 ? (
                    <img
                      src={getImageUrl(entry.images[0])}
                      alt={entry.title || "Jurnal"}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      onError={(e) => { (e.target as HTMLImageElement).src = "https://placehold.co/600x400/7A9A7E/white?text=MindGarden"; }}
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-primary/20 bg-primary/5">
                      <Feather className="w-16 h-16 mb-2 rotate-12" />
                    </div>
                  )}
                  
                  <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  <div className="absolute top-4 left-4 flex gap-2">
                     <div className="bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full text-[10px] font-extrabold uppercase tracking-widest shadow-sm flex items-center gap-1.5 text-foreground">
                        <Clock className="w-3 h-3 text-primary" />
                        {format(new Date(entry.createdAt), "d MMM yyyy", { locale: id })}
                     </div>
                     {entry.isPublic ? (
                        <div className="bg-primary/90 backdrop-blur-md px-3 py-1.5 rounded-full text-[10px] font-extrabold uppercase tracking-widest shadow-sm flex items-center gap-1.5 text-white">
                           <Globe className="w-3 h-3" />
                           Publik
                        </div>
                     ) : (
                        <div className="bg-slate-800/90 backdrop-blur-md px-3 py-1.5 rounded-full text-[10px] font-extrabold uppercase tracking-widest shadow-sm flex items-center gap-1.5 text-white">
                           <Lock className="w-3 h-3" />
                           Privat
                        </div>
                     )}
                  </div>
                </div>

                <div className="p-8 flex flex-col flex-1 relative">
                  {/* Public Author Info */}
                  {showPublic && entry.user && (
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center border-2 border-white shadow-sm overflow-hidden">
                        {entry.user.avatar ? (
                          <img src={getImageUrl(entry.user.avatar)} alt={entry.user.name} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-[10px] font-bold text-primary">{(entry.user.name || "U").charAt(0)}</span>
                        )}
                      </div>
                      <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{entry.user.name}</span>
                    </div>
                  )}

                  <h3
                    className="text-xl font-bold text-foreground mb-3 line-clamp-1 group-hover:text-primary transition-colors cursor-pointer"
                    onClick={() => onView?.(entry)}
                  >
                    {entry.title || "Tanpa Judul"}
                  </h3>

                  <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3 mb-6 italic">
                    &quot;{truncateContent(entry.content)}&quot;
                  </p>

                  <div className="mt-auto flex flex-col gap-4">
                    {/* Tags */}
                    {entry.tags && entry.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {entry.tags.slice(0, 2).map((tag) => (
                          <span key={tag} className="px-3 py-1 bg-primary/5 text-primary text-[10px] font-bold uppercase tracking-widest rounded-lg border border-primary/10">
                            #{tag}
                          </span>
                        ))}
                        {entry.tags.length > 2 && (
                          <span className="text-[10px] font-bold text-muted-foreground self-center">+{entry.tags.length - 2}</span>
                        )}
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center justify-between pt-4 border-t border-border/50">
                      <button
                        onClick={() => onView?.(entry)}
                        className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary hover:gap-3 transition-all"
                      >
                        Baca Cerita
                        <ChevronRight className="w-4 h-4" />
                      </button>

                      {!showPublic && (
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="w-10 h-10 rounded-xl text-muted-foreground hover:bg-primary/10 hover:text-primary transition-all"
                            onClick={() => onEdit?.(entry)}
                          >
                            <Edit3 className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="w-10 h-10 rounded-xl text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all"
                            onClick={() => handleDelete(entry)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
