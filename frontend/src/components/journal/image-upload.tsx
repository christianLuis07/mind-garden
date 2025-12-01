"use client";

import { useState, useRef } from "react";
import { Upload, X } from "lucide-react";
import { Button } from "../ui/button";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

interface ImageUploadProps {
  newImages: File[];
  existingImages: string[];
  onNewImagesChange: (files: File[]) => void;
  onRemoveNew: (index: number) => void;
  onRemoveExisting: (index: number) => void;
  maxImages?: number;
}

export function ImageUpload({
  newImages,
  existingImages,
  onNewImagesChange,
  onRemoveNew,
  onRemoveExisting,
  maxImages = 5,
}: ImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const filesArray = Array.from(event.target.files);
      if (
        newImages.length + existingImages.length + filesArray.length >
        maxImages
      ) {
        alert(`Maksimal ${maxImages} gambar`);
        return;
      }
      onNewImagesChange([...newImages, ...filesArray]);
    }
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Helper untuk menampilkan gambar dari server
  const getImageUrl = (path: string) => {
    if (path.startsWith("http")) return path;
    const cleanPath = path.startsWith("/") ? path : `/${path}`;
    return `${API_BASE_URL}${cleanPath}`;
  };

  return (
    <div className="space-y-4 mt-2">
      <div
        onClick={() => fileInputRef.current?.click()}
        className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors"
      >
        <Upload className="w-8 h-8 text-gray-400 mb-2" />
        <p className="text-sm text-gray-500">Klik untuk upload gambar</p>
        <p className="text-xs text-gray-400 mt-1">
          Maksimal {maxImages} gambar
        </p>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          accept="image/*"
          multiple
          className="hidden"
        />
      </div>

      {(existingImages.length > 0 || newImages.length > 0) && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Gambar Lama (Dari Server) */}
          {existingImages.map((src, index) => (
            <div
              key={`existing-${index}`}
              className="relative group aspect-square rounded-lg overflow-hidden border border-gray-200"
            >
              <img
                src={getImageUrl(src)}
                alt="Existing"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    "https://placehold.co/100x100?text=Error";
                }}
              />
              <button
                type="button"
                onClick={() => onRemoveExisting(index)}
                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-3 h-3" />
              </button>
              <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-[10px] px-2 py-1 text-center">
                Tersimpan
              </div>
            </div>
          ))}

          {/* Gambar Baru (Preview Lokal) */}
          {newImages.map((file, index) => (
            <div
              key={`new-${index}`}
              className="relative group aspect-square rounded-lg overflow-hidden border border-green-200"
            >
              <img
                src={URL.createObjectURL(file)}
                alt="Preview"
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={() => onRemoveNew(index)}
                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-3 h-3" />
              </button>
              <div className="absolute bottom-0 left-0 right-0 bg-green-500/80 text-white text-[10px] px-2 py-1 text-center">
                Baru
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
