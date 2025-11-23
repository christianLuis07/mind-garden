// src/components/journal/journal-editor.tsx
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { RichTextEditor } from "./rich-text-editor";
import { ImageUpload } from "./image-upload";
import { journalAPI } from "@/lib/journal-api";
import { getErrorMessage } from "@/lib/utils";
import { JournalEntry } from "@/types/journal";

const journalSchema = z.object({
  title: z
    .string()
    .max(200, "Judul tidak boleh lebih dari 200 karakter")
    .optional(),
  content: z
    .string()
    .min(1, "Isi jurnal wajib diisi")
    .max(10000, "Isi jurnal tidak boleh lebih dari 10.000 karakter"),
  tags: z.string().optional(),
  isPublic: z.boolean().default(false).optional(),
});

type JournalForm = z.infer<typeof journalSchema>;

interface JournalEditorProps {
  entry?: JournalEntry;
  onSuccess?: (entry: JournalEntry) => void;
  onCancel?: () => void;
}

export function JournalEditor({
  entry,
  onSuccess,
  onCancel,
}: JournalEditorProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>(
    entry?.images || []
  );

  const isEditing = !!entry;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<JournalForm>({
    resolver: zodResolver(journalSchema),
    defaultValues: {
      title: entry?.title || "",
      content: entry?.content || "",
      tags: entry?.tags?.join(", ") || "",
      isPublic: entry?.isPublic || false,
    },
  });

  const content = watch("content");
  const isPublic = watch("isPublic");

  const handleImagesChange = (files: File[]) => {
    setImages(files);
  };

  const handleImageRemove = async (imageIndex: number) => {
    if (isEditing && entry) {
      try {
        await journalAPI.deleteJournalImage(entry.id, imageIndex);
        setExistingImages((prev) => prev.filter((_, i) => i !== imageIndex));
        toast.success("Gambar berhasil dihapus");
      } catch (error) {
        toast.error("Gagal menghapus gambar", {
          description: getErrorMessage(error),
        });
      }
    } else {
      setExistingImages((prev) => prev.filter((_, i) => i !== imageIndex));
    }
  };

  const onSubmit = async (data: JournalForm) => {
    try {
      setIsLoading(true);

      const tagsArray = data.tags
        ? data.tags
            .split(",")
            .map((tag) => tag.trim())
            .filter((tag) => tag.length > 0)
        : [];

      const journalData = {
        title: data.title,
        content: data.content,
        tags: tagsArray,
        isPublic: data.isPublic,
      };

      let response;

      if (isEditing && entry) {
        response = await journalAPI.updateJournalEntry(
          entry.id,
          journalData,
          images
        );
      } else {
        response = await journalAPI.createJournal(journalData, images);
      }

      if (response.data.success) {
        toast.success(
          isEditing
            ? "Jurnal berhasil diperbarui! 📝"
            : "Jurnal berhasil dibuat! 🌱"
        );

        if (onSuccess) {
          onSuccess(response.data.data.journalEntry);
        }
      }
    } catch (error: any) {
      toast.error(
        isEditing ? "Gagal memperbarui jurnal" : "Gagal membuat jurnal",
        {
          description: getErrorMessage(error),
        }
      );
    } finally {
      setIsLoading(false);
    }
  };

  const wordCount = content
    ? content
        .replace(/<[^>]*>/g, "")
        .split(/\s+/)
        .filter((word) => word.length > 0).length
    : 0;

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        {isEditing ? "Edit Entri Jurnal" : "Tulis Entri Jurnal Baru"}
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <Label htmlFor="title" className="text-sm font-medium text-gray-700">
            Judul (Opsional)
          </Label>
          <Input
            id="title"
            placeholder="Beri judul untuk jurnalmu..."
            {...register("title")}
            className="mt-1"
          />
          {errors.title && (
            <p className="text-red-600 text-sm mt-1">{errors.title.message}</p>
          )}
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <Label
              htmlFor="content"
              className="text-sm font-medium text-gray-700"
            >
              Isi Pikiranmu
            </Label>
            <span className="text-sm text-gray-500">{wordCount} kata</span>
          </div>
          <RichTextEditor
            value={content}
            onChange={(value) => setValue("content", value)}
            placeholder="Tulis apa yang sedang kamu rasakan, pikirkan, atau renungkan..."
            height={400}
          />
          {errors.content && (
            <p className="text-red-600 text-sm mt-1">
              {errors.content.message}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="tags" className="text-sm font-medium text-gray-700">
            Tag (Opsional)
          </Label>
          <Input
            id="tags"
            placeholder="Tambahkan tag, pisahkan dengan koma (contoh: refleksi, bersyukur, tujuan)"
            {...register("tags")}
            className="mt-1"
          />
          <p className="text-gray-500 text-xs mt-1">
            Tag membantu mengatur dan mengelompokkan entri jurnalmu.
          </p>
        </div>

        <div>
          <Label className="text-sm font-medium text-gray-700">
            Gambar (Opsional)
          </Label>
          <ImageUpload
            onImagesChange={handleImagesChange}
            existingImages={existingImages}
            onImageRemove={handleImageRemove}
            maxImages={5}
          />
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="isPublic"
            {...register("isPublic")}
            className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
          />
          <Label htmlFor="isPublic" className="text-sm text-gray-700">
            Jadikan entri ini publik
          </Label>
        </div>
        <p className="text-gray-500 text-xs -mt-4">
          Entri publik dapat dilihat oleh pengguna MindGarden lainnya di halaman
          komunitas.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
          <Button
            type="submit"
            disabled={isLoading || !content}
            className="flex-1 bg-green-500 hover:bg-green-600"
          >
            {isLoading ? (
              <>
                <Spinner className="mr-2" />
                {isEditing ? "Menyimpan..." : "Membuat..."}
              </>
            ) : isEditing ? (
              "Simpan Perubahan"
            ) : (
              "Buat Entri"
            )}
          </Button>

          {onCancel && (
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isLoading}
            >
              Batal
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}
