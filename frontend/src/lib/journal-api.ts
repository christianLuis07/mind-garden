import { api } from "./api";
import {
  JournalEntry,
  JournalAnalytics,
  CreateJournalData,
  UpdateJournalData,
} from "@/types/journal";

export const journalAPI = {
  // buat entries jurnal
  createJournal: (data: CreateJournalData, files?: File[]) => {
    const formData = new FormData();

    // tambahkan JSON data
    formData.append("data", JSON.stringify(data));

    // tambahkan gambar jika type data any
    if (files) {
      files.forEach((file) => {
        formData.append("images", file);
      });
    }

    return api.post<{
      success: boolean;
      message: string;
      data: { journalEntry: JournalEntry };
    }>("/journal", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  // ambil entries jurnal dengan pagination dan filter
  getJournalEntries: (params?: {
    page?: number;
    limit?: number;
    search?: string;
    tags?: string[];
    startDate?: string;
    endDate?: string;
    isPublic?: boolean;
  }) =>
    api.get<{
      success: boolean;
      data: {
        entries: JournalEntry[];
        pagination: {
          page: number;
          limit: number;
          total: number;
          pages: number;
        };
      };
    }>("/journal", { params }),

  // ambil entries jurnal publik
  getPublicJournals: (params?: {
    page?: number;
    limit?: number;
    search?: string;
    tags?: string[];
  }) =>
    api.get<{
      success: boolean;
      data: {
        entries: JournalEntry[];
        pagination: {
          page: number;
          limit: number;
          total: number;
          pages: number;
        };
      };
    }>("/journal/public", { params }),

  // ambil entries satu jurnal
  getJournalEntry: (id: string) =>
    api.get<{
      success: boolean;
      data: { journalEntry: JournalEntry };
    }>(`/journal/${id}`),

  // update entries jurnal
  updateJournalEntry: (id: string, data: UpdateJournalData, files?: File[]) => {
    const formData = new FormData();
    formData.append("data", JSON.stringify(data));

    if (files) {
      files.forEach((file) => {
        formData.append("images", file);
      });
    }
    return api.put<{ success: boolean; data: { journalEntry: JournalEntry } }>(
      `/journal/${id}`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
  },

  // hapus entry jurnal
  deleteJournalEntry: (id: string) =>
    api.delete<{ success: boolean; message: string }>(`/journal/${id}`),

  // hapus gambar jurnal
  deleteJournalImage: (entryId: string, imageIndex: number) =>
    api.delete<{ success: boolean; message: string }>(
      `/journal/${entryId}/images/${imageIndex}`
    ),

  // ambil analisis jurnal
  getJournalAnalytics: (timeFrame?: string) =>
    api.get<{ success: boolean; data: { analytics: JournalAnalytics } }>(
      `/journal/analytics?timeFrame=${timeFrame || "30d"}`
    ),
};
