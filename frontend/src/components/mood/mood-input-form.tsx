"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";
import { Spinner } from "../ui/spinner";
import { moodAPI } from "@/lib/mood-api";
import { getErrorMessage } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { CloudRain, Cloud, Wind, Sun, Sparkles, Send, Moon, Users, Briefcase, Dumbbell } from "lucide-react";

const moodSchema = z.object({
  mood: z.number().min(1).max(5),
  notes: z.string().max(500).optional(),
  factors: z
    .object({
      sleep: z.number().min(1).max(10).optional(),
      exercise: z.boolean().optional(),
      social: z.number().min(1).max(10).optional(),
      work: z.number().min(1).max(10).optional(),
    })
    .optional(),
});

type MoodForm = z.infer<typeof moodSchema>;

const moodIcons = [
  { icon: CloudRain, label: "Kurang Baik", color: "text-blue-500", bg: "bg-blue-500/10", border: "border-blue-500/20" },
  { icon: Cloud, label: "Agak Sedih", color: "text-slate-500", bg: "bg-slate-500/10", border: "border-slate-500/20" },
  { icon: Wind, label: "Biasa Saja", color: "text-emerald-500", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
  { icon: Sun, label: "Senang", color: "text-amber-500", bg: "bg-amber-500/10", border: "border-amber-500/20" },
  { icon: Sparkles, label: "Luar Biasa", color: "text-primary", bg: "bg-primary/10", border: "border-primary/20" },
];

interface MoodInputFormProps {
  onSuccess?: () => void;
}

export function MoodInputForm({ onSuccess }: MoodInputFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedMood, setSelectedMood] = useState<number | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm<MoodForm>({
    resolver: zodResolver(moodSchema),
    defaultValues: {
      factors: {
        exercise: false,
      },
    },
  });

  const handleMoodSelect = (mood: number) => {
    setSelectedMood(mood);
    setValue("mood", mood, { shouldValidate: true });
  };

  const onSubmit = async (data: MoodForm) => {
    try {
      setIsLoading(true);
      setError("");

      const response = await moodAPI.createMood(data);

      if (response.data.success) {
        setSelectedMood(null);
        reset({
          notes: "",
          factors: {
            exercise: false,
            sleep: undefined,
            social: undefined,
            work: undefined,
          },
        });

        toast.success("Catatan Tersimpan", {
          description: "Terima kasih sudah berbagi perasaanmu hari ini.",
        });

        if (onSuccess) onSuccess();
      }
    } catch (error: any) {
      setError(getErrorMessage(error));
      toast.error("Terjadi Kesalahan", {
        description: getErrorMessage(error),
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="glass-card rounded-[2.5rem] p-8 md:p-10 border-none shadow-2xl shadow-primary/5">
      <div className="flex items-center space-x-3 mb-8">
        <div className="w-1.5 h-8 bg-primary rounded-full" />
        <h2 className="text-2xl font-bold text-foreground tracking-tight">Apa yang sedang kamu rasakan?</h2>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-destructive/10 border border-destructive/20 text-destructive px-6 py-4 rounded-2xl text-sm font-bold flex items-center gap-3"
          >
            <div className="w-2 h-2 bg-destructive rounded-full animate-pulse" />
            {error}
          </motion.div>
        )}

        {/* Mood Selection */}
        <div className="space-y-6">
          <Label className="text-sm font-bold text-muted-foreground uppercase tracking-widest block text-center">
            Pilih Perasaanmu
          </Label>
          <div className="flex flex-wrap justify-center gap-4 md:gap-6">
            {moodIcons.map((item, index) => {
              const moodValue = index + 1;
              const isSelected = selectedMood === moodValue;
              const Icon = item.icon;

              return (
                <button
                  key={moodValue}
                  type="button"
                  onClick={() => handleMoodSelect(moodValue)}
                  className="group flex flex-col items-center space-y-3 focus:outline-none"
                >
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className={`w-16 h-16 md:w-20 md:h-20 rounded-3xl flex items-center justify-center border-2 transition-all duration-500
                      ${
                        isSelected
                          ? `${item.bg} ${item.border} shadow-xl shadow-primary/10`
                          : "bg-muted/30 border-transparent hover:bg-muted/50"
                      }`}
                  >
                    <Icon className={`w-8 h-8 md:w-10 md:h-10 transition-colors duration-500 ${isSelected ? item.color : "text-muted-foreground/60 group-hover:text-muted-foreground"}`} />
                  </motion.div>
                  <span
                    className={`text-[10px] md:text-xs font-bold uppercase tracking-tighter transition-colors duration-300 ${
                      isSelected ? "text-foreground" : "text-muted-foreground/40 group-hover:text-muted-foreground"
                    }`}
                  >
                    {item.label}
                  </span>
                </button>
              );
            })}
          </div>
          {errors.mood && (
            <p className="text-destructive text-xs font-bold text-center mt-4">{errors.mood.message}</p>
          )}
          <input type="hidden" {...register("mood", { valueAsNumber: true })} />
        </div>

        {/* Factors */}
        <div className="space-y-6">
          <Label className="text-sm font-bold text-muted-foreground uppercase tracking-widest block">
            Apa yang memengaruhimu? (Opsional)
          </Label>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Sleep */}
            <div className="space-y-3 group">
              <div className="flex items-center space-x-2 text-muted-foreground group-focus-within:text-primary transition-colors">
                <Moon className="w-4 h-4" />
                <Label htmlFor="sleep" className="text-xs font-bold uppercase">Kualitas Tidur</Label>
              </div>
              <select
                id="sleep"
                {...register("factors.sleep", { valueAsNumber: true })}
                className="w-full h-12 px-4 bg-muted/30 border-none rounded-2xl text-sm font-medium focus:ring-2 focus:ring-primary/20 transition-all appearance-none cursor-pointer"
              >
                <option value="">Pilih Skala 1-10...</option>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                  <option key={num} value={num}>{num} / 10</option>
                ))}
              </select>
            </div>

            {/* Social */}
            <div className="space-y-3 group">
              <div className="flex items-center space-x-2 text-muted-foreground group-focus-within:text-primary transition-colors">
                <Users className="w-4 h-4" />
                <Label htmlFor="social" className="text-xs font-bold uppercase">Aktivitas Sosial</Label>
              </div>
              <select
                id="social"
                {...register("factors.social", { valueAsNumber: true })}
                className="w-full h-12 px-4 bg-muted/30 border-none rounded-2xl text-sm font-medium focus:ring-2 focus:ring-primary/20 transition-all appearance-none cursor-pointer"
              >
                <option value="">Pilih Skala 1-10...</option>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                  <option key={num} value={num}>{num} / 10</option>
                ))}
              </select>
            </div>

            {/* Work */}
            <div className="space-y-3 group">
              <div className="flex items-center space-x-2 text-muted-foreground group-focus-within:text-primary transition-colors">
                <Briefcase className="w-4 h-4" />
                <Label htmlFor="work" className="text-xs font-bold uppercase">Pekerjaan/Tugas</Label>
              </div>
              <select
                id="work"
                {...register("factors.work", { valueAsNumber: true })}
                className="w-full h-12 px-4 bg-muted/30 border-none rounded-2xl text-sm font-medium focus:ring-2 focus:ring-primary/20 transition-all appearance-none cursor-pointer"
              >
                <option value="">Pilih Skala 1-10...</option>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                  <option key={num} value={num}>{num} / 10</option>
                ))}
              </select>
            </div>

             {/* Exercise */}
             <div className="flex items-center justify-between p-4 bg-muted/30 rounded-2xl border border-transparent hover:border-primary/20 transition-all">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                    <Dumbbell className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-foreground">Olahraga</p>
                    <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-tighter">Sudah aktif bergerak?</p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  id="exercise"
                  {...register("factors.exercise")}
                  className="w-6 h-6 rounded-lg border-primary/20 text-primary focus:ring-primary/20 transition-all cursor-pointer accent-primary"
                />
            </div>
          </div>
        </div>

        {/* Notes */}
        <div className="space-y-3">
          <Label htmlFor="notes" className="text-sm font-bold text-muted-foreground uppercase tracking-widest">
            Apa yang ada di pikiranmu?
          </Label>
          <div className="relative">
            <Textarea
              id="notes"
              placeholder="Ceritakan sedikit tentang harimu..."
              className="min-h-[120px] p-6 bg-muted/20 border-none rounded-[2rem] focus:ring-2 focus:ring-primary/20 transition-all resize-none italic"
              {...register("notes")}
            />
          </div>
          {errors.notes && (
            <p className="text-destructive text-xs font-bold mt-2">{errors.notes.message}</p>
          )}
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={isLoading || !selectedMood}
          className="w-full h-16 rounded-[2rem] bg-primary hover:bg-primary/90 text-white font-bold text-lg shadow-xl shadow-primary/20 group overflow-hidden relative"
        >
          {isLoading ? (
            <div className="flex items-center gap-3">
              <Spinner className="w-5 h-5" />
              <span>Sedang menyimpan...</span>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-3">
              <span>Simpan Perasaan Hari Ini</span>
              <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </div>
          )}
        </Button>
      </form>
    </div>
  );
}
