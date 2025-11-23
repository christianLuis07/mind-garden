"use client";

import { useState, useRef } from "react";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import { Button } from "../ui/button";

interface ImageUploadProps {
  onImagesChange: (files: File[]) => void;
  existingImages?: string[];
  onImageRemove?: (imageIndex: number) => void;
  maxImages?: number;
}

export function ImageUpload({
  onImagesChange,
  existingImages = [],
  onImageRemove,
  maxImages = 5,
}: ImageUploadProps) {
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);

    if (files.length + existingImages.length + previewUrls.length > maxImages) {
      alert(`Kamu hanya bisa mengunggah gambar maksimal ${maxImages}`);
      return;
    }

    // buat preivew URLs
    const newPreviewUrls = files.map((file) => URL.createObjectURL(file));
    setPreviewUrls((prev) => [...prev, ...newPreviewUrls]);

    // Convert Filelist ke array dan lewati melalui parent
    onImagesChange(files);

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removePreviewImage = (index: number) => {
    setPreviewUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = (index: number) => {
    if (onImageRemove) {
      onImageRemove(index);
    }
  };

  const totalImages = existingImages.length + previewUrls.length;
  const canUploadMore = totalImages < maxImages;

  return (
    <div className="space-y-4">
      {/* Upload Button */}
      <div className="flex items-center justify-between">
        <label className="flex items-center space-x-2 cursor-pointer">
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileSelect}
            disabled={!canUploadMore}
            className="hidden"
          />
          <Button
            type="button"
            variant={"outline"}
            disabled={!canUploadMore}
            className="flex items-center space-x-2"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="w-4 h-4">
              <span>Tambah Gambar</span>
            </Upload>
          </Button>
        </label>
        <span className="text-sm text-gray-500">
          {totalImages} / (maxImages) gambar
        </span>
      </div>

      {/* Image Previews */}
      {(existingImages.length > 0 || previewUrls.length > 0) && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {/* Existing Images */}
          {existingImages.map((imageUrl, index) => (
            <div key={`sudah ada-${index}`} className="relative group">
              <img
                src={imageUrl}
                alt={`gambar Jurnal ${index + 1}`}
                className="w-full h-24 object-cover rounded-lg border border-gray-200"
              />
              {onImageRemove && (
                <button
                  type="button"
                  onClick={() => removeExistingImage(index)}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          ))}
          {/* New Image Previews */}
          {previewUrls.map((previewUrl, index) => (
            <div key={`cuplikan-${index}`} className="relative group">
              <img
                src={previewUrl}
                alt={`Cuplikan ${index + 1}`}
                className="w-full h-24 object-cover rounded-lg border border-gray-200"
              />
              <button
                type="button"
                onClick={() => removePreviewImage(index)}
                className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}
      {/* Helper Text */}
      {!canUploadMore && (
        <p className="text-sm text-amber-600">
          Maksimal {maxImages} gambar di ijinkan. Hapus gambar untuk menambah
          gambar lainnya.
        </p>
      )}
    </div>
  );
}
