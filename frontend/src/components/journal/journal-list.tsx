// src/components/journal/journal-list.tsx
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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { journalAPI } from "@/lib/journal-api";
import { JournalEntry } from "@/types/journal";
import { formatDistanceToNow } from "date-fns";
import { id } from "date-fns/locale";
import { toast } from "sonner";

interface JournalListProps {
  onEdit?: (entry: JournalEntry) => void;
  onNewEntry?: () => void;
  showPublic?: boolean;
}

export function JournalList({
  onEdit,
  onNewEntry,
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

      // PERBAIKAN: Akses response.data terlebih dahulu
      if (response.data.success) {
        setEntries(response.data.data.entries);

        // PERBAIKAN: Gunakan optional chaining dan type assertion
        const tags = Array.from(
          new Set(
            response.data.data.entries.flatMap(
              (entry: JournalEntry) => entry.tags || [] // Handle undefined tags
            )
          )
        ) as string[]; // Type assertion untuk string[]

        setAllTags(tags);
      }
    } catch (error) {
      toast.error("Failed to load entries");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEntries();
  }, [search, selectedTags, dateRange, showPublic]);

  const handleDelete = async (entry: JournalEntry) => {
    if (!confirm("Are you sure you want to delete this journal entry?")) {
      return;
    }

    try {
      const response = await journalAPI.deleteJournalEntry(entry.id);
      // PERBAIKAN: Akses response.data
      if (response.data.success) {
        toast.success("Journal entry deleted successfully");
        fetchEntries();
      }
    } catch (error) {
      toast.error("Failed to delete entry");
    }
  };

  const handleTagToggle = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const clearFilters = () => {
    setSearch("");
    setSelectedTags([]);
    setDateRange({ start: "", end: "" });
  };

  const truncateContent = (html: string, maxLength: number = 150) => {
    const text = html.replace(/<[^>]*>/g, "");
    return text.length > maxLength
      ? text.substring(0, maxLength) + "..."
      : text;
  };

  if (loading && entries.length === 0) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
      </div>
    );
  }

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
            className="bg-green-600 hover:bg-green-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Entries Baru
          </Button>
        )}
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Mencari Entries..."
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
                <span>Filters</span>
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
                  Bersihkan Semua
                </Button>
              )}
            </div>

            {showFilters && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center space-x-2">
                    <Calendar className="w-4 h-4" />
                    <span>Date Range</span>
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      type="date"
                      placeholder="Start Date"
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
                      placeholder="End Date"
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
                      <span>Tags</span>
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

      {/* Entries List */}
      {entries.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <div className="text-gray-400 mb-4">
              <Edit className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No entries found
            </h3>
            <p className="text-gray-600 mb-4">
              {search ||
              selectedTags.length > 0 ||
              dateRange.start ||
              dateRange.end
                ? "Try adjusting your search or filters"
                : showPublic
                ? "No public entries available yet"
                : "Start writing your first journal entry"}
            </p>
            {!showPublic && onNewEntry && (
              <Button
                onClick={onNewEntry}
                className="bg-green-600 hover:bg-green-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Write Your First Entry
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {entries.map((entry) => (
            <Card key={entry.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 text-lg mb-1">
                          {entry.title || "Untitled Entry"}
                        </h3>
                        <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500">
                          <div className="flex items-center space-x-1">
                            <Clock className="w-3 h-3" />
                            <span>
                              {formatDistanceToNow(new Date(entry.createdAt), {
                                addSuffix: true,
                                locale: id,
                              })}
                            </span>
                          </div>

                          {entry.isPublic ? (
                            <span className="px-2 py-1 text-xs rounded-full border bg-blue-100 text-blue-800 border-blue-300 flex items-center space-x-1">
                              <Eye className="w-3 h-3" />
                              <span>Public</span>
                            </span>
                          ) : (
                            <span className="px-2 py-1 text-xs rounded-full border bg-gray-100 text-gray-700 border-gray-300 flex items-center space-x-1">
                              <EyeOff className="w-3 h-3" />
                              <span>Private</span>
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <p className="text-gray-600 line-clamp-3">
                      {truncateContent(entry.content)}
                    </p>

                    {/* PERBAIKAN: Gunakan optional chaining untuk tags */}
                    {entry.tags && entry.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {entry.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full border border-gray-300"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* PERBAIKAN: Gunakan optional chaining untuk images */}
                    {entry.images && entry.images.length > 0 && (
                      <div className="flex space-x-2">
                        {entry.images.slice(0, 3).map((image, index) => (
                          <img
                            key={index}
                            src={image}
                            alt={`Journal image ${index + 1}`}
                            className="w-16 h-16 object-cover rounded border border-gray-200"
                          />
                        ))}
                        {entry.images.length > 3 && (
                          <div className="w-16 h-16 bg-gray-100 rounded border border-gray-200 flex items-center justify-center text-xs text-gray-500">
                            +{entry.images.length - 3}
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {!showPublic && (
                    <div className="flex space-x-2 sm:flex-col sm:space-x-0 sm:space-y-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onEdit?.(entry)}
                        className="flex items-center space-x-1"
                      >
                        <Edit className="w-3 h-3" />
                        <span>Edit</span>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(entry)}
                        className="flex items-center space-x-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Delete</span>
                      </Button>
                    </div>
                  )}
                </div>

                {showPublic && entry.user && (
                  <div className="flex items-center space-x-2 mt-4 pt-4 border-t border-gray-200">
                    <img
                      src={entry.user.avatar}
                      alt={entry.user.name}
                      className="w-6 h-6 rounded-full"
                    />
                    <span className="text-sm text-gray-600">
                      {entry.user.name}
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
