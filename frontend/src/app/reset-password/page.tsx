// src/app/(auth)/reset-password/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AuthLayout } from "@/components/layout/auth-layout";
import { Spinner } from "@/components/ui/spinner";
import { authAPI } from "@/lib/api";
import { getErrorMessage } from "@/lib/utils";
import { resetPasswordSchema } from "@/lib/validators";

type ResetPasswordForm = z.infer<typeof resetPasswordSchema>;

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<ResetPasswordForm>({
    resolver: zodResolver(resetPasswordSchema),
  });

  // Set token value ketika component mount
  useEffect(() => {
    if (token) {
      setValue("token", token);
    }
  }, [token, setValue]);

  const onSubmit = async (data: ResetPasswordForm) => {
    try {
      setIsLoading(true);
      setError("");

      const response = await authAPI.resetPassword(
        data.token,
        data.newPassword
      );

      if (response.data.success) {
        setIsSubmitted(true);
        setTimeout(() => {
          router.push("/login?message=password-reset");
        }, 3000);
      }
    } catch (error: any) {
      setError(getErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  // Invalid Token State
  if (!token) {
    return (
      <div className="min-h-screen relative overflow-hidden bg-linear-to-br from-green-50 via-emerald-50 to-teal-50">
        {/* Decorative gradient orbs */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-green-200/30 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-emerald-200/30 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

        <div className="relative flex items-center justify-center min-h-screen p-4">
          <div className="w-full max-w-2xl animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header Section */}
            <div className="text-center mb-8 space-y-2">
              <h1 className="text-4xl font-bold bg-linear-to-r from-red-700 via-rose-600 to-pink-600 bg-clip-text text-transparent">
                Tautan Tidak Valid
              </h1>
              <p className="text-gray-600 text-lg">
                Oops! Ada masalah dengan tautan Anda
              </p>
            </div>

            {/* Glassmorphism Card */}
            <Card className="border border-white/20 shadow-2xl shadow-red-500/10 backdrop-blur-xl bg-white/70 overflow-hidden">
              <CardHeader className="space-y-1 pb-6">
                <CardTitle className="text-2xl font-bold text-gray-800 text-center">
                  <AuthLayout />
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                {/* Warning Icon */}
                <div className="text-center py-6">
                  <div className="w-20 h-20 bg-linear-to-r from-red-100 to-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg
                      className="w-10 h-10 text-red-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                      />
                    </svg>
                  </div>
                  <p className="text-gray-700 font-medium mb-2 text-lg">
                    Tautan Reset Tidak Valid
                  </p>
                  <p className="text-sm text-gray-600">
                    Tautan untuk mereset kata sandi tidak valid atau sudah
                    kedaluwarsa.
                  </p>
                </div>

                {/* Info Box */}
                <div className="bg-amber-50/50 backdrop-blur border border-amber-100 rounded-xl p-4 text-sm">
                  <div className="flex items-start gap-3">
                    <svg
                      className="w-5 h-5 text-amber-600 shrink-0 mt-0.5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <div className="text-gray-700">
                      <p className="font-medium mb-1">Kenapa ini terjadi?</p>
                      <ul className="text-xs text-gray-600 space-y-1">
                        <li>• Tautan sudah kedaluwarsa (lebih dari 1 jam)</li>
                        <li>• Tautan sudah pernah digunakan</li>
                        <li>• Tautan tidak lengkap atau rusak</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Action Button */}
                <Button
                  onClick={() => router.push("/forgot-password")}
                  className="w-full h-12 cursor-pointer bg-linear-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold rounded-xl shadow-lg shadow-green-500/30 hover:shadow-xl hover:shadow-green-500/40 transition-all duration-300"
                >
                  Minta Tautan Reset Baru
                </Button>

                <div className="text-center">
                  <button
                    onClick={() => router.push("/login")}
                    className="text-sm text-gray-600 hover:text-gray-800 font-medium transition-colors duration-200 hover:underline underline-offset-4"
                  >
                    Kembali ke Login
                  </button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // Success State
  if (isSubmitted) {
    return (
      <div className="min-h-screen relative overflow-hidden bg-linear-to-br from-green-50 via-emerald-50 to-teal-50">
        {/* Decorative gradient orbs */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-green-200/30 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-emerald-200/30 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

        <div className="relative flex items-center justify-center min-h-screen p-4">
          <div className="w-full max-w-2xl animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header Section */}
            <div className="text-center mb-8 space-y-2">
              <h1 className="text-4xl font-bold bg-linear-to-r from-green-700 via-emerald-600 to-teal-600 bg-clip-text text-transparent">
                Berhasil!
              </h1>
              <p className="text-gray-600 text-lg">
                Kata sandi Anda telah diperbarui
              </p>
            </div>

            {/* Glassmorphism Card */}
            <Card className="border border-white/20 shadow-2xl shadow-green-500/10 backdrop-blur-xl bg-white/70 overflow-hidden">
              <CardHeader className="space-y-1 pb-6">
                <CardTitle className="text-2xl font-bold text-gray-800 text-center">
                  <AuthLayout />
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center py-8">
                <div className="w-20 h-20 bg-linear-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
                  <svg
                    className="w-10 h-10 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <p className="text-gray-700 font-medium mb-2 text-lg">
                  Kata Sandi Berhasil Direset!
                </p>
                <p className="text-sm text-gray-600 mb-6">
                  Anda sekarang dapat login dengan kata sandi baru Anda
                </p>
                <div className="flex items-center justify-center gap-2">
                  <Spinner className="w-5 h-5 text-green-600" />
                  <span className="text-sm text-gray-600">
                    Mengarahkan ke halaman login...
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // Default State - Reset Password Form
  return (
    <div className="min-h-screen relative overflow-hidden bg-linear-to-br from-green-50 via-emerald-50 to-teal-50">
      {/* Decorative gradient orbs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-green-200/30 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-emerald-200/30 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

      <div className="relative flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-2xl animate-in fade-in slide-in-from-bottom-4 duration-700">
          {/* Header Section */}
          <div className="text-center mb-8 space-y-2">
            <h1 className="text-4xl font-bold bg-linear-to-r from-green-700 via-emerald-600 to-teal-600 bg-clip-text text-transparent">
              Reset Kata Sandi
            </h1>
            <p className="text-gray-600 text-lg">
              Buat kata sandi baru yang aman
            </p>
          </div>

          {/* Glassmorphism Card */}
          <Card className="border border-white/20 shadow-2xl shadow-green-500/10 backdrop-blur-xl bg-white/70 overflow-hidden">
            <CardHeader className="space-y-1 pb-6">
              <CardTitle className="text-2xl font-bold text-gray-800 text-center">
                <AuthLayout />
              </CardTitle>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                {/* Error Message */}
                {error && (
                  <div className="bg-red-50/80 backdrop-blur border border-red-200/50 text-red-700 px-4 py-3 rounded-xl text-sm shadow-sm animate-in fade-in slide-in-from-top-2 duration-300">
                    <div className="flex items-start gap-2">
                      <svg
                        className="w-5 h-5 shrink-0 mt-0.5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span>{error}</span>
                    </div>
                  </div>
                )}

                {/* Info Box */}
                <div className="bg-blue-50/50 backdrop-blur border border-blue-100 rounded-xl p-4 text-sm">
                  <div className="flex items-start gap-3">
                    <svg
                      className="w-5 h-5 text-blue-600 shrink-0 mt-0.5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <div className="text-gray-700">
                      <p className="font-medium mb-1">
                        Tips kata sandi yang kuat:
                      </p>
                      <ul className="text-xs text-gray-600 space-y-1">
                        <li>• Minimal 8 karakter</li>
                        <li>• Gunakan kombinasi huruf besar & kecil</li>
                        <li>• Sertakan angka dan simbol</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <input type="hidden" {...register("token")} />

                {/* New Password Field */}
                <div className="space-y-2">
                  <Label
                    htmlFor="newPassword"
                    className="text-sm font-semibold text-gray-700"
                  >
                    Kata Sandi Baru
                  </Label>
                  <Input
                    id="newPassword"
                    type="password"
                    placeholder="Buat kata sandi baru yang kuat"
                    className="h-12 border-gray-200 bg-white/50 backdrop-blur focus:bg-white focus:border-green-500 focus:ring-green-500/20 transition-all duration-200 rounded-xl shadow-sm"
                    {...register("newPassword")}
                  />
                  {errors.newPassword && (
                    <p className="text-sm text-red-600/90 flex items-center gap-1.5 animate-in fade-in slide-in-from-left-1 duration-300">
                      <svg
                        className="w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {errors.newPassword.message}
                    </p>
                  )}
                </div>

                {/* Confirm Password Field */}
                <div className="space-y-2">
                  <Label
                    htmlFor="confirmPassword"
                    className="text-sm font-semibold text-gray-700"
                  >
                    Konfirmasi Kata Sandi Baru
                  </Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Masukkan ulang kata sandi baru"
                    className="h-12 border-gray-200 bg-white/50 backdrop-blur focus:bg-white focus:border-green-500 focus:ring-green-500/20 transition-all duration-200 rounded-xl shadow-sm"
                    {...register("confirmPassword")}
                  />
                  {errors.confirmPassword && (
                    <p className="text-sm text-red-600/90 flex items-center gap-1.5 animate-in fade-in slide-in-from-left-1 duration-300">
                      <svg
                        className="w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {errors.confirmPassword.message}
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full h-12 cursor-pointer bg-linear-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold rounded-xl shadow-lg shadow-green-500/30 hover:shadow-xl hover:shadow-green-500/40 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <Spinner className="w-5 h-5" />
                      Menyimpan kata sandi...
                    </span>
                  ) : (
                    "Reset Kata Sandi"
                  )}
                </Button>

                {/* Footer Link */}
                <div className="pt-2">
                  <div className="text-center">
                    <button
                      type="button"
                      onClick={() => router.push("/login")}
                      className="text-sm text-gray-600 hover:text-gray-800 font-medium transition-colors duration-200 hover:underline underline-offset-4 inline-flex items-center gap-2"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10 19l-7-7m0 0l7-7m-7 7h18"
                        />
                      </svg>
                      Kembali ke Login
                    </button>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
