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

const moodEmojis = ["😢", "😞", "😐", "😊", "😄"];
const moodLabels = [
  "Sangat Sedih",
  "Sedih",
  "Netral",
  "Bahagia",
  "Sangat Bahagia",
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

  const factors = watch("factors");

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

        // tampilkan success toast
        toast.success("Mood berhasil ditambahkan! 🌟", {
          description: `Kamu merasa ${moodLabels[
            data.mood - 1
          ].toLowerCase()} today.`,
        });

        if (onSuccess) {
          onSuccess();
        }
      }
    } catch (error: any) {
      setError(getErrorMessage(error));
      toast.error("Gagal menambahkan mood", {
        description: getErrorMessage(error),
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <h2 className="text-xl font-emibold text-gray-900 mb-6">
        Gimana perasaanmu hari ini?
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* Mood Selection */}
        <div>
          <Label className="text-sm font-medium text-gray-700 mb-4 block">
            Pilih mood yang kamu rasakan saat ini
          </Label>
          <div className="grid grid-cols-5 gap-2">
            {moodEmojis.map((emoji, index) => {
              const moodValue = index + 1;
              const isSelected = selectedMood === moodValue;

              return (
                <button
                  key={moodValue}
                  type="button"
                  onClick={() => handleMoodSelect(moodValue)}
                  className={`flex flex-col items-center p-4 rounded-xl border-2 transition-all
                    ${
                      isSelected
                        ? "border-green-500 bg-green-50 scale-105"
                        : "border-gray-200 bg-gray-50 hover:border-gray-300 hover:bg-gray-100"
                    }`}
                >
                  <span className="text-3xl mb-2">{emoji}</span>
                  <span
                    className={`text-xs font-medium ${
                      isSelected ? "text-green-700" : "text-gray-600"
                    }`}
                  >
                    {moodLabels[index]}
                  </span>
                </button>
              );
            })}
          </div>
          {errors.mood && (
            <p className="text-red-600 text-sm mt-2">{errors.mood.message}</p>
          )}
          <input type="hidden" {...register("mood", { valueAsNumber: true })} />
        </div>

        {/* Factors */}
        <div className="space-y-4">
          <Label className="text-sm font-medium text-gray-700">
            Hal apa yang memengaruhi perasaanmu hari ini? (Opsional)
          </Label>

          <div className="grid grid-cols-2 gap-4">
            {/* Sleep */}
            <div>
              <Label htmlFor="sleep" className="text-sm text-gray-600">
                Kualitas Tidur
              </Label>
              <select
                id="sleep"
                {...register("factors.sleep", { valueAsNumber: true })}
                className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                <option value="">Pilih...</option>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                  <option key={num} value={num}>
                    {num}{" "}
                    {num === 10
                      ? "😴"
                      : num >= 7
                      ? "😊"
                      : num >= 4
                      ? "😐"
                      : "😫"}
                  </option>
                ))}
              </select>
            </div>
            {/* Exercise */}
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="exercise"
                {...register("factors.exercise")}
                className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
              />
              <Label htmlFor="exercise" className="text-sm text-gray-600">
                Berolahraga hari ini
              </Label>
            </div>

            {/* Social */}
            <div>
              <label htmlFor="social" className="text-sm text-gray-600">
                Aktivitas Sosial
              </label>
              <select
                id="social"
                {...register("factors.social", { valueAsNumber: true })}
                className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                <option value="">Pilih...</option>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                  <option key={num} value={num}>
                    {num}{" "}
                    {num === 10
                      ? "🥳"
                      : num >= 7
                      ? "😊"
                      : num >= 4
                      ? "😐"
                      : "😔"}
                  </option>
                ))}
              </select>
            </div>
            {/* Work */}
            <div>
              <Label htmlFor="work" className="text-sm text-gray-600">
                Tekanan Pekerjaan
              </Label>
              <select
                id="work"
                {...register("factors.work", { valueAsNumber: true })}
                className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                <option value="">Pilih...</option>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                  <option key={num} value={num}>
                    {num}{" "}
                    {num === 1
                      ? "😌"
                      : num <= 3
                      ? "😊"
                      : num <= 6
                      ? "😐"
                      : "😫"}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        {/* Notes */}
        <div>
          <Label htmlFor="notes" className="text-sm font-medium text-gray-700">
            Catatan tambahan (Opsional)
          </Label>
          <Textarea
            id="notes"
            placeholder="Ingin menuliskan sesuatu tentang perasaanmu hari ini?"
            className="mt-1 resize-none"
            rows={3}
            {...register("notes")}
          />
          {errors.notes && (
            <p className="text-red-600 text-sm mt-1">{errors.notes.message}</p>
          )}
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={isLoading || !selectedMood}
          className="w-full bg-green-500 hover:bg-green-600"
        >
          {isLoading ? (
            <>
              <Spinner className="mr-2" />
              Mencatat Mood...
            </>
          ) : (
            "Catat Mood"
          )}
        </Button>
      </form>
    </div>
  );
}
