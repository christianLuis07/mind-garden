"use client";

import { useState } from "react";
import { X, Globe, Lock, Users, Sparkles } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Card, CardContent } from "../ui/card";
import { communityAPI } from "@/lib/community-api";
import { CreateSupportGroupData, SupportGroup } from "@/types/community";
import { motion } from "framer-motion";

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
      console.error("Gagal membuat komunitas:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="glass-card rounded-[2.5rem] border-none shadow-2xl overflow-hidden">
      <CardContent className="p-8 md:p-10">
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                <Sparkles className="w-5 h-5" />
             </div>
             <h2 className="text-2xl font-bold text-foreground tracking-tight">
               Bangun Komunitas Baru
             </h2>
          </div>
          <Button variant="ghost" size="icon" onClick={onCancel} className="rounded-full">
            <X className="w-5 h-5 text-muted-foreground" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Group Name */}
          <div className="space-y-3">
            <label className="text-sm font-bold text-muted-foreground uppercase tracking-widest block">
              Nama Komunitas
            </label>
            <Input
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
              placeholder="Contoh: Ruang Berbagi Kecemasan"
              className="h-14 bg-muted/20 border-none rounded-2xl px-6 focus:ring-2 focus:ring-primary/20 transition-all font-medium"
              required
              maxLength={100}
            />
          </div>

          {/* Description */}
          <div className="space-y-3">
            <label className="text-sm font-bold text-muted-foreground uppercase tracking-widest block">
              Tentang Komunitas Ini
            </label>
            <Textarea
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              placeholder="Ceritakan sedikit tentang apa yang akan dibahas di ruang ini agar teman-teman lain tertarik bergabung..."
              className="min-h-[120px] bg-muted/20 border-none rounded-[2rem] p-6 focus:ring-2 focus:ring-primary/20 transition-all resize-none italic font-medium"
              required
              maxLength={500}
            />
            <div className="flex justify-end">
               <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest bg-muted/40 px-2 py-1 rounded-md">
                 {formData.description.length} / 500
               </span>
            </div>
          </div>

          {/* Privacy Settings */}
          <div className="space-y-4">
            <label className="text-sm font-bold text-muted-foreground uppercase tracking-widest block">
              Siapa yang bisa bergabung?
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() =>
                  setFormData((prev) => ({ ...prev, isPublic: true }))
                }
                className={`p-6 rounded-[2rem] text-left transition-all duration-300 border-2 ${
                  formData.isPublic
                    ? "border-primary bg-primary/5 shadow-xl shadow-primary/5"
                    : "border-border/50 bg-transparent hover:border-primary/30"
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${formData.isPublic ? "bg-primary text-white" : "bg-muted text-muted-foreground"}`}>
                   <Globe className="w-5 h-5" />
                </div>
                <div className="font-bold text-foreground mb-1">Terbuka untuk Umum</div>
                <p className="text-xs text-muted-foreground leading-relaxed font-medium">
                  Siapa saja bisa menemukan dan masuk ke ruang cerita ini.
                </p>
              </button>

              <button
                type="button"
                onClick={() =>
                  setFormData((prev) => ({ ...prev, isPublic: false }))
                }
                className={`p-6 rounded-[2rem] text-left transition-all duration-300 border-2 ${
                  !formData.isPublic
                    ? "border-amber-500 bg-amber-500/5 shadow-xl shadow-amber-500/5"
                    : "border-border/50 bg-transparent hover:border-amber-500/30"
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${!formData.isPublic ? "bg-amber-500 text-white" : "bg-muted text-muted-foreground"}`}>
                   <Lock className="w-5 h-5" />
                </div>
                <div className="font-bold text-foreground mb-1">Ruang Terbatas</div>
                <p className="text-xs text-muted-foreground leading-relaxed font-medium">
                  Hanya orang yang kamu undang secara personal yang bisa masuk.
                </p>
              </button>
            </div>
          </div>

          {/* Max Members */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
               <label className="text-sm font-bold text-muted-foreground uppercase tracking-widest block">
                 Batas Anggota
               </label>
               <span className="text-xs font-bold text-primary">{formData.maxMembers} Orang</span>
            </div>
            <input
              type="range"
              value={formData.maxMembers}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  maxMembers: parseInt(e.target.value),
                }))
              }
              min={3}
              max={100}
              className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
            />
            <p className="text-[10px] text-muted-foreground font-medium italic">
              Tips: Ruang dengan 20-40 anggota biasanya terasa lebih hangat dan akrab.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Button
              type="submit"
              disabled={loading || !formData.name || !formData.description}
              className="h-16 flex-1 rounded-2xl bg-primary hover:bg-primary/90 text-white font-extrabold text-lg shadow-xl shadow-primary/20 transition-all hover:scale-[1.02]"
            >
              {loading ? "Sedang menyiapkan ruang..." : "Buat Ruang Cerita"}
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={onCancel}
              disabled={loading}
              className="h-16 px-8 rounded-2xl font-bold text-muted-foreground"
            >
              Nanti Saja
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
