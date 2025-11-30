"use client";

import { useState } from "react";
import { X, Globe, Lock } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Card, CardContent } from "../ui/card";
import { communityAPI } from "@/lib/community-api";
import { CreateSupportGroupData, SupportGroup } from "@/types/community";

interface CreateGroupFormProps {
  onSuccess: (group: SupportGroup) => void;
  onCancel: () => void;
}

export function CreateGroupForm({ onSuccess, onCancel }: CreateGroupFormProps) {
  const [formData, setFormData] = useState<CreateSupportGroupData>({
    name: "",
    description: "",
    isPublic: true,
    maxMembers: 50,
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);
      const response = await communityAPI.createSupportGroup(formData);

      if (response.data.success) {
        onSuccess(response.data.data.group);
      }
    } catch (error) {
      console.error("Gagal membuat group:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">
            Buat Grup Dukungan Baru
          </h2>
          <Button variant="ghost" size="sm" onClick={onCancel}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Group Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nama Grup
            </label>
            <Input
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
              placeholder="Contoh: Support Anxiety & Depression"
              required
              maxLength={100}
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Deskripsi Grup
            </label>
            <Textarea
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              placeholder="Jelaskan tujuan dan fokus grup ini..."
              required
              rows={4}
              maxLength={500}
            />
            <p className="text-xs text-gray-500 mt-1">
              {formData.description.length}/500 karakter
            </p>
          </div>

          {/* Privacy Settings */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Pengaturan Privasi
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() =>
                  setFormData((prev) => ({ ...prev, isPublic: true }))
                }
                className={`p-4 border-2 rounded-lg text-left transition-colors ${
                  formData.isPublic
                    ? "border-green-500 bg-green-50"
                    : "border-gray-300 hover:border-gray-400"
                }`}
              >
                <Globe className="w-5 h-5 txet-green-600 mb-2" />
                <div className="font-medium text-gray-900">Publik</div>
                <p className="text-sm text-gray-600 mt-1">
                  Semua orang bisa melihat dan bergabung
                </p>
              </button>

              <button
                type="button"
                onClick={() =>
                  setFormData((prev) => ({ ...prev, isPublic: false }))
                }
                className={`p-4 border-2 rounded-lg text-left transition-colors ${
                  !formData.isPublic
                    ? "border-amber-500 bg-amber-50"
                    : "border-gray-300 hover:border-gray-400"
                }`}
              >
                <Lock className="w-5 h-5 text-amber-600 mb-2" />
                <div className="font-medium text-gray-900">Privat</div>
                <p className="text-sm text-gray-600 mt-1">
                  Hanya dengan undangan
                </p>
              </button>
            </div>
          </div>

          {/* Max Members */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Jumlah Anggota Maksimal
            </label>
            <Input
              type="number"
              value={formData.maxMembers}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  maxMembers: parseInt(e.target.value),
                }))
              }
              min={3}
              max={100}
            />
            <p className="text-xs text-gray-500 mt-1">
              Rekomendasi: 20-50 anggota untuk grup yang efektif
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-4 pt-4">
            <Button
              type="submit"
              disabled={loading || !formData.name || !formData.description}
              className="flex-1 bg-green-600 hover:bg-green700"
            >
              {loading ? "Membuat Grup..." : "Buat Grup"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={loading}
            >
              Batal
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
