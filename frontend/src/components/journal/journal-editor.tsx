"use client";

import { useState, useEffect } from "react";
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
import { JournalEntry } from "@/types/journal";

const journalSchema = z.object({
  title: z.string().max(200, "Judul maksimal 200 karakter").optional(),
  content: z.string().min(1, "Isi jurnal wajib diisi"),
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
  const [newImages, setNewImages] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);

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

  useEffect(() => {
    // Saat edit, muat gambar yang sudah ada
    if (entry?.images && entry.images.length > 0) {
      setExistingImages(entry.images);
    }
  }, [entry]);

  const handleImagesChange = (files: File[]) => {
    setNewImages(files);
  };

  const handleImageRemove = async (index: number, isExisting: boolean) => {
    if (isExisting) {
      // Hapus gambar lama dari server
      if (entry) {
        try {
          // Panggil API backend untuk hapus gambar
          await journalAPI.deleteJournalImage(entry.id, index);
          const updated = [...existingImages];
          updated.splice(index, 1);
          setExistingImages(updated);
          toast.success("Gambar berhasil dihapus");
        } catch (error) {
          toast.error("Gagal menghapus gambar");
        }
      }
    } else {
      // Hapus gambar baru dari state (belum diupload)
      const updated = [...newImages];
      updated.splice(index, 1);
      setNewImages(updated);
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
        title: data.title || "",
        content: data.content,
        tags: tagsArray,
        isPublic: data.isPublic || false,
      };

      let response;

      if (isEditing && entry) {
        response = await journalAPI.updateJournalEntry(
          entry.id,
          journalData,
          newImages
        );
      } else {
        response = await journalAPI.createJournal(journalData, newImages);
      }

      if (response.data.success) {
        toast.success(isEditing ? "Jurnal diperbarui!" : "Jurnal dibuat!");
        if (onSuccess) {
          onSuccess(response.data.data.journalEntry);
        }
      }
    } catch (error) {
      toast.error("Gagal menyimpan jurnal");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 shadow-sm border border-gray-100">
      <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 md:mb-6">
        {isEditing ? "Edit Entri Jurnal" : "Tulis Entri Jurnal Baru"}
      </h2>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4 md:space-y-6"
      >
        {/* Title */}
        <div>
          <Label htmlFor="title">Judul (Opsional)</Label>
          <Input
            id="title"
            placeholder="Beri judul momen ini..."
            {...register("title")}
            className="mt-1.5"
          />
          {/* ... error msg */}
        </div>

        {/* Rich Text - Height disesuaikan */}
        <div>
          <Label htmlFor="content">Isi Jurnal</Label>
          <div className="mt-1.5">
            <RichTextEditor
              value={content}
              onChange={(value) => setValue("content", value)}
              placeholder="Tulis pikiranmu..."
              // Tinggi editor adaptif: 200px di HP, 300px di Laptop
              height={
                typeof window !== "undefined" && window.innerWidth < 768
                  ? 200
                  : 300
              }
            />
          </div>
          {/* ... error msg */}
        </div>

        {/* Tags */}
        <div>
          <Label htmlFor="tags">Tag</Label>
          <Input
            id="tags"
            placeholder="contoh: senang, produktif, pagi"
            {...register("tags")}
            className="mt-1.5"
          />
          <p className="text-xs text-gray-500 mt-1">Pisahkan dengan koma</p>
        </div>

        {/* Image Upload Component */}
        <div>
          <Label className="mb-2 block">Gambar Kenangan</Label>
          <ImageUpload
            newImages={newImages}
            existingImages={existingImages}
            onNewImagesChange={setNewImages}
            onRemoveNew={(idx) => {
              /* ... logikanya sama ... */
            }}
            onRemoveExisting={async (idx) => {
              /* ... logikanya sama ... */
            }}
          />
        </div>

        {/* Checkbox Public */}
        <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
          <input
            type="checkbox"
            id="isPublic"
            {...register("isPublic")}
            className="w-4 h-4 rounded text-green-600 focus:ring-green-500 border-gray-300"
          />
          <div className="flex flex-col">
            <Label htmlFor="isPublic" className="cursor-pointer font-medium">
              Publikasikan ke Komunitas
            </Label>
            <span className="text-xs text-gray-500">
              Jurnal ini akan bisa dibaca oleh pengguna lain
            </span>
          </div>
        </div>

        {/* Action Buttons - Stack di Mobile */}
        <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4 border-t border-gray-100">
          {onCancel && (
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isLoading}
              className="w-full sm:w-auto" // Full width di HP
            >
              Batal
            </Button>
          )}
          <Button
            type="submit"
            disabled={isLoading || !content}
            className="w-full sm:w-auto flex-1 bg-green-600 hover:bg-green-700" // Full width di HP
          >
            {isLoading ? <Spinner className="mr-2" /> : null}
            {isEditing ? "Simpan Perubahan" : "Simpan Jurnal"}
          </Button>
        </div>
      </form>
    </div>
  );
}
