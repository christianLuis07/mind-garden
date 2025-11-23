// src/components/journal/journal-detail.tsx
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
  Share,
  Clock,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { journalAPI } from "@/lib/journal-api";
import { JournalEntry } from "@/types/journal";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { toast } from "sonner";
import parse from "html-react-parser";

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

      if (response.data.success) {
        setEntry(response.data.data.journalEntry);
      }
    } catch (error) {
      toast.error("gagal memuat jurnal entries");
      onBack?.();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (entryId) {
      fetchEntry();
    }
  }, [entryId]);

  const handleDelete = async () => {
    if (
      !entry ||
      !confirm("Apakah kamu yakin ingin menghapus entri jurnal ini?")
    ) {
      return;
    }

    try {
      setDeleting(true);
      await journalAPI.deleteJournalEntry(entry.id);
      toast.success("Entri jurnal berhasil dihapus");
      onBack?.();
    } catch (error) {
      toast.error("Gagal menghapus entri jurnal");
    } finally {
      setDeleting(false);
    }
  };

  const handleShare = async () => {
    if (!entry) return;

    try {
      if (navigator.share) {
        await navigator.share({
          title: entry.title || "Journal Entry",
          text: entry.content.replace(/<[^>]*>/g, "").substring(0, 100),
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast.success("tautan telah disalin");
      }
    } catch (error: any) {
      throw new Error(error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (!entry) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Entri tidak ditemukan
        </h3>
        <p className="text-gray-600 mb-4">
          Entri jurnal yang kamu cari tidak tersedia.
        </p>
        <Button onClick={onBack} variant="outline">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Kembali ke Jurnal
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            onClick={onBack}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </Button>
          <div className="h-6 border-l border-gray-300" />
          <h1 className="text-2xl font-bold text-gray-900">Entries Jurnal</h1>
        </div>

        {showActions && (
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              onClick={handleShare}
              className="flex items-center space-x-2"
            >
              <Share className="w-4 h-4" />
              <span>Bagikan</span>
            </Button>
            <Button
              variant="outline"
              onClick={() => onEdit?.(entry)}
              className="flex items-center space-x-2"
            >
              <Edit className="w-4 h-4" />
              <span>Edit</span>
            </Button>
            <Button
              variant="outline"
              onClick={handleDelete}
              disabled={deleting}
              className="flex items-center space-x-2 text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              {deleting ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
              ) : (
                <Trash2 className="w-4 h-4" />
              )}
              <span>Hapus</span>
            </Button>
          </div>
        )}
      </div>

      {/* Entry Card */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {/* Header with Metadata */}
        <div className="border-b border-gray-200 p-6 bg-gray-50">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
            <div className="flex-1 space-y-3">
              <h2 className="text-3xl font-bold text-gray-900">
                {entry.title || "entries tidak memiliki judul"}
              </h2>

              <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
                <div className="flex items-center space-x-2 bg-white px-3 py-1 rounded-full border border-gray-200">
                  <Calendar className="w-4 h-4" />
                  <span>
                    {format(new Date(entry.createdAt), "EEEE, MMMM d, yyyy", {
                      locale: id,
                    })}
                  </span>
                </div>

                {entry.isPublic ? (
                  <span className="px-3 py-1 rounded-full border border-blue-300 bg-blue-100 text-blue-800 text-sm font-medium flex items-center space-x-2">
                    <Eye className="w-4 h-4" />
                    <span>Publik</span>
                  </span>
                ) : (
                  <span className="px-3 py-1 rounded-full border border-gray-300 bg-gray-100 text-gray-800 text-sm font-medium flex items-center space-x-2">
                    <EyeOff className="w-4 h-4" />
                    <span>Pribadi</span>
                  </span>
                )}
              </div>

              {/* Tags */}
              {entry.tags && entry.tags.length > 0 && (
                <div className="flex items-center space-x-3">
                  <Tag className="w-4 h-4 text-gray-400" />
                  <div className="flex flex-wrap gap-2">
                    {entry.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 bg-white text-gray-700 text-sm rounded-full border border-gray-300"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Author for public entries */}
            {entry.user && (
              <div className="flex items-center space-x-3 bg-white rounded-lg p-3 border border-gray-200">
                <img
                  src={entry.user.avatar}
                  alt={entry.user.name}
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <p className="font-medium text-gray-900">{entry.user.name}</p>
                  <p className="text-sm text-gray-500">Penulis</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Images Gallery */}
          {entry.images && entry.images.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {entry.images.map((image, index) => (
                <div key={index} className="group relative">
                  <img
                    src={image}
                    alt={`Gambar jurnal ${index + 1}`}
                    className="w-full h-48 object-cover rounded-lg border border-gray-200"
                  />
                </div>
              ))}
            </div>
          )}

          {/* Journal Content */}
          <div className="prose prose-lg max-w-none">
            <div>{parse(entry.content)}</div>
          </div>

          {/* Last Updated */}
          {entry.updatedAt !== entry.createdAt && (
            <div className="pt-6 border-t border-gray-200">
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <Clock className="w-4 h-4" />
                <span>
                  Diperbarui terakhir:{" "}
                  {format(
                    new Date(entry.updatedAt),
                    "MMM d, yyyy 'at' h:mm a",
                    { locale: id }
                  )}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
