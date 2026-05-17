"use client";

import { useState, useEffect } from "react";
import {
  ArrowLeft,
  Calendar,
  Tag,
  Eye,
  EyeOff,
  Edit,
  Trash2,
  BrainCircuit,
  AlertTriangle,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { journalAPI } from "@/lib/journal-api";
import { JournalEntry } from "@/types/journal";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { toast } from "sonner";
import parse from "html-react-parser";
import { cn } from "@/lib/utils";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

interface JournalDetailProps {
  entryId: string;
  onEdit?: (entry: JournalEntry) => void;
  onBack?: () => void;
  showActions?: boolean;
}

export function JournalDetail({
  entryId,
  onEdit,
  onBack,
  showActions = true,
}: JournalDetailProps) {
  const [entry, setEntry] = useState<JournalEntry | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  const fetchEntry = async () => {
    try {
      setLoading(true);
      const response = await journalAPI.getJournalEntry(entryId);
      if (response.data.success) setEntry(response.data.data.journalEntry);
    } catch {
      toast.error("Gagal memuat jurnal");
      onBack?.();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (entryId) fetchEntry();
  }, [entryId]);

  const handleDelete = async () => {
    if (!entry || !confirm("Yakin hapus?")) return;
    try {
      setDeleting(true);
      await journalAPI.deleteJournalEntry(entry.id);
      toast.success("Terhapus");
      onBack?.();
    } catch {
      toast.error("Gagal hapus");
    } finally {
      setDeleting(false);
    }
  };

  const getImageUrl = (path: string) => {
    if (!path) return "";
    if (path.startsWith("http")) return path;
    const cleanPath = path.startsWith("/") ? path : `/${path}`;
    return `${API_BASE_URL}${cleanPath}`;
  };

  if (loading)
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
      </div>
    );
  if (!entry) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-4 md:space-y-6 pb-20 md:pb-0">
      {/* HEADER ACTIONS: Stack vertikal di HP, Baris di Desktop */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3 md:space-x-4">
          <Button
            variant="outline"
            onClick={onBack}
            size="sm"
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali</span>
          </Button>
          <div className="h-6 border-l border-gray-300 hidden sm:block" />
          <h1 className="text-xl md:text-2xl font-bold text-gray-900 line-clamp-1">
            {showActions ? "Detail Jurnal" : "Baca Jurnal"}
          </h1>
        </div>

        {showActions && (
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit?.(entry)}
              className="flex items-center space-x-2"
            >
              <Edit className="w-4 h-4" />
              <span className="hidden sm:inline">Edit</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDelete}
              disabled={deleting}
              className="flex items-center space-x-2 text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4" />
              <span className="hidden sm:inline">Hapus</span>
            </Button>
          </div>
        )}
      </div>

      {/* CONTENT CARD */}
      <div className="bg-white rounded-xl md:rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
        {/* Meta Header */}
        <div className="border-b border-gray-200 p-4 md:p-8 bg-gray-50/50">
          <div className="flex flex-col gap-6">
            <div className="space-y-3">
              <h2 className="text-2xl md:text-4xl font-bold text-gray-900 leading-tight wrap-break-word">
                {entry.title || "Tanpa Judul"}
              </h2>

              <div className="flex flex-wrap items-center gap-2 md:gap-3 text-xs md:text-sm text-gray-600">
                <div className="flex items-center space-x-2 bg-white px-2.5 py-1 md:px-3 md:py-1.5 rounded-full border border-gray-200 shadow-sm">
                  <Calendar className="w-3.5 h-3.5 md:w-4 md:h-4 text-green-600" />
                  <span>
                    {format(new Date(entry.createdAt), "EEEE, d MMM yyyy", {
                      locale: id,
                    })}
                  </span>
                </div>

                {/* Badge Status */}
                <span
                  className={`px-2.5 py-1 md:px-3 md:py-1.5 rounded-full border text-xs md:text-sm font-medium flex items-center space-x-2 ${
                    entry.isPublic
                      ? "border-blue-200 bg-blue-50 text-blue-700"
                      : "border-gray-200 bg-white text-gray-700"
                  }`}
                >
                  {entry.isPublic ? (
                    <Eye className="w-3.5 h-3.5" />
                  ) : (
                    <EyeOff className="w-3.5 h-3.5" />
                  )}
                  <span>{entry.isPublic ? "Publik" : "Pribadi"}</span>
                </span>
              </div>

              {/* Tags */}
              {entry.tags && entry.tags.length > 0 && (
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <Tag className="w-3.5 h-3.5 md:w-4 md:h-4 text-gray-400" />
                  {entry.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 md:px-3 md:py-1 bg-white text-gray-700 text-xs md:text-sm rounded-md border border-gray-200 shadow-sm"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* AI Analysis Section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
               <div className="bg-white/60 backdrop-blur-md p-5 rounded-[1.5rem] border border-primary/20 shadow-sm flex items-center gap-4 group hover:shadow-md transition-all">
                  <div className={cn(
                    "w-12 h-12 rounded-2xl flex items-center justify-center transition-colors",
                    entry.aiSentiment === 'Positive' ? 'bg-emerald-100 text-emerald-600' :
                    entry.aiSentiment === 'Depression' || entry.aiSentiment === 'Anxiety' ? 'bg-rose-100 text-rose-600' :
                    'bg-slate-100 text-slate-600'
                  )}>
                    <BrainCircuit className="w-6 h-6 group-hover:scale-110 transition-transform" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-0.5">Analisis Perasaan</p>
                    <p className="text-sm font-bold text-foreground">
                      {entry.aiSentiment === 'Anxiety' ? 'Kecemasan' :
                       entry.aiSentiment === 'Depression' ? 'Kesedihan Mendalam' :
                       entry.aiSentiment === 'Positive' ? 'Positif & Bahagia' :
                       entry.aiSentiment === 'Neutral' ? 'Tenang / Netral' : 'Menganalisis...'}
                    </p>
                  </div>
               </div>

               <div className={cn(
                 "p-5 rounded-[1.5rem] border shadow-sm flex items-center gap-4 group hover:shadow-md transition-all",
                 (entry.riskScore || 0) >= 7 ? 'bg-rose-50 border-rose-200' : 'bg-white/60 border-primary/20'
               )}>
                  <div className={cn(
                    "w-12 h-12 rounded-2xl flex items-center justify-center transition-colors",
                    (entry.riskScore || 0) >= 7 ? 'bg-rose-100 text-rose-600' : 'bg-primary/10 text-primary'
                  )}>
                    {(entry.riskScore || 0) >= 7 ? <AlertTriangle className="w-6 h-6 animate-pulse" /> : <ShieldCheck className="w-6 h-6 group-hover:scale-110 transition-transform" />}
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-0.5">Tingkat Risiko</p>
                    <p className="text-sm font-bold text-foreground flex items-center gap-2">
                      {entry.riskScore !== undefined ? `${entry.riskScore} / 10` : "Menganalisis..."}
                      {(entry.riskScore || 0) >= 7 && <span className="text-[9px] bg-rose-600 text-white px-2 py-0.5 rounded-full font-black uppercase tracking-tighter">Butuh Bantuan</span>}
                    </p>
                  </div>
               </div>
            </div>

            {/* User Info (Mobile: Compact, Desktop: Card) */}
            {entry.user && (
              <div className="flex items-center space-x-3 bg-white p-3 rounded-xl border border-gray-100 shadow-sm md:self-start md:min-w-[200px]">
                {entry.user.avatar ? (
                  <img
                    src={getImageUrl(entry.user.avatar)}
                    alt={entry.user.name}
                    className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover border border-gray-200"
                  />
                ) : (
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-linear-to-br from-green-500 to-emerald-700 flex items-center justify-center text-white font-bold text-sm md:text-lg">
                    {entry.user.name?.charAt(0).toUpperCase() || "U"}
                  </div>
                )}
                <div>
                  <p className="font-semibold text-gray-900 text-sm md:text-base">
                    {entry.user.name}
                  </p>
                  <p className="text-xs text-gray-500">Penulis</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* BODY CONTENT */}
        <div className="p-4 md:p-8 space-y-6 md:space-y-8">
          {/* Gambar Utama Grid */}
          {entry.images && entry.images.length > 0 && (
            <div
              className={`grid gap-3 md:gap-4 ${
                entry.images.length === 1
                  ? "grid-cols-1"
                  : "grid-cols-1 sm:grid-cols-2" // Mobile 1 kolom, Tablet+ 2 kolom
              }`}
            >
              {entry.images.map((image, index) => (
                <div
                  key={index}
                  className="group relative rounded-lg md:rounded-xl overflow-hidden border border-gray-200 shadow-sm aspect-video bg-gray-100"
                >
                  <img
                    src={getImageUrl(image)}
                    alt={`Gambar ${index + 1}`}
                    className="w-full h-full object-cover transition-transform hover:scale-105 duration-500"
                  />
                </div>
              ))}
            </div>
          )}

          {/* Rich Text Content */}
          {/* Class prose-img sangat PENTING untuk responsivitas gambar dalam teks */}
          <div
            className="prose prose-sm md:prose-lg max-w-none text-gray-800 leading-relaxed
          prose-headings:font-bold prose-headings:text-gray-900
          prose-p:text-gray-700 prose-a:text-green-600 
          prose-img:rounded-xl prose-img:w-full prose-img:h-auto prose-img:shadow-sm prose-img:my-6"
          >
            {parse(entry.content)}
          </div>
        </div>
      </div>
    </div>
  );
}
