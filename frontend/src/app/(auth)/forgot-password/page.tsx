// src/app/(auth)/forgot-password/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
import { emailSchema } from "@/lib/validators";
import Link from "next/link";

type ForgotPasswordForm = z.infer<typeof emailSchema>;

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState("");
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordForm>({
    resolver: zodResolver(emailSchema),
  });

  const onSubmit = async (data: ForgotPasswordForm) => {
    try {
      setIsLoading(true);
      setError("");

      const response = await authAPI.forgotPassword(data.email);

      if (response.data.success) {
        setSubmittedEmail(data.email);
        setIsSubmitted(true);
      }
    } catch (error: any) {
      setError(getErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  // Success State - Email Sent
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
                Email Terkirim!
              </h1>
              <p className="text-gray-600 text-lg">Periksa kotak masuk Anda</p>
            </div>

            {/* Glassmorphism Card */}
            <Card className="border border-white/20 shadow-2xl shadow-green-500/10 backdrop-blur-xl bg-white/70 overflow-hidden">
              <CardHeader className="space-y-1 pb-6">
                <CardTitle className="text-2xl font-bold text-gray-800 text-center">
                  <AuthLayout />
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                {/* Email Icon Illustration */}
                <div className="text-center py-6">
                  <div className="w-20 h-20 bg-linear-to-r from-blue-100 to-cyan-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                    <svg
                      className="w-10 h-10 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <p className="text-gray-700 font-medium mb-3 text-lg">
                    Tautan Reset Kata Sandi Telah Dikirim
                  </p>
                  <p className="text-sm text-gray-600 mb-2">
                    Kami telah mengirim email ke{" "}
                    <strong className="text-green-700">{submittedEmail}</strong>{" "}
                    dengan petunjuk untuk mereset kata sandi Anda.
                  </p>
                  <div className="inline-flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-700 px-3 py-2 rounded-lg text-xs mt-3">
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Tautan akan kedaluwarsa dalam 1 jam
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <Button
                    onClick={() => router.push("/login")}
                    className="w-full h-12 cursor-pointer bg-linear-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold rounded-xl shadow-lg shadow-green-500/30 hover:shadow-xl hover:shadow-green-500/40 transition-all duration-300"
                  >
                    Kembali ke Login
                  </Button>

                  <Button
                    onClick={() => setIsSubmitted(false)}
                    className="w-full h-12 cursor-pointer bg-white hover:bg-gray-50 text-gray-700 font-medium rounded-xl border border-gray-200 transition-all duration-300"
                  >
                    Gunakan Email Lain
                  </Button>
                </div>

                {/* Help Tips */}
                <div className="bg-blue-50/50 backdrop-blur border border-blue-100 rounded-xl p-4 text-sm">
                  <p className="text-gray-700 font-medium mb-3 flex items-center gap-2">
                    <svg
                      className="w-5 h-5 text-blue-600"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Belum menerima email?
                  </p>
                  <ul className="space-y-2 text-gray-600">
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600">•</span>
                      <span>Periksa folder spam atau junk email</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600">•</span>
                      <span>Pastikan alamat email yang dimasukkan benar</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600">•</span>
                      <span>Tunggu beberapa menit lalu coba kirim ulang</span>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // Default State - Request Reset
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
              Lupa Kata Sandi?
            </h1>
            <p className="text-gray-600 text-lg">
              Jangan khawatir, kami akan membantu Anda
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
                <div className="bg-green-50/50 backdrop-blur border border-green-100 rounded-xl p-4 text-sm">
                  <div className="flex items-start gap-3">
                    <svg
                      className="w-5 h-5 text-green-600 shrink-0 mt-0.5"
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
                      <p className="font-medium mb-1">Reset kata sandi Anda</p>
                      <p className="text-xs text-gray-600">
                        Masukkan alamat email yang terdaftar di akun Anda, dan
                        kami akan mengirimkan tautan untuk mereset kata sandi.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Email Field */}
                <div className="space-y-2">
                  <Label
                    htmlFor="email"
                    className="text-sm font-semibold text-gray-700"
                  >
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="nama@example.com"
                    className="h-12 border-gray-200 bg-white/50 backdrop-blur focus:bg-white focus:border-green-500 focus:ring-green-500/20 transition-all duration-200 rounded-xl shadow-sm"
                    {...register("email")}
                  />
                  {errors.email && (
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
                      {errors.email.message}
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
                      Mengirim tautan...
                    </span>
                  ) : (
                    "Kirim Tautan Reset"
                  )}
                </Button>

                {/* Footer Link */}
                <div className="pt-2">
                  <div className="text-center">
                    <Link
                      href="/login"
                      className="text-sm text-green-700 hover:text-green-800 font-medium transition-colors duration-200 hover:underline underline-offset-4 inline-flex items-center gap-2"
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
                    </Link>
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
