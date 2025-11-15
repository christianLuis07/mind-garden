"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AuthLayout } from "@/components/layout/auth-layout";
import { Spinner } from "@/components/ui/spinner";
import { authAPI } from "@/lib/api";
import { getErrorMessage } from "@/lib/utils";

export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const message = searchParams.get("message");

  const [isLoading, setIsLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(!!token);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [error, setError] = useState("");

  // Auto-verify jika ada token di URL
  useEffect(() => {
    if (token) {
      verifyEmail(token);
    }
  }, [token]);

  const verifyEmail = async (verificationToken: string) => {
    try {
      setIsLoading(true);
      setError("");

      const response = await authAPI.verifyEmail(verificationToken);

      if (response.data.success) {
        setStatus("success");
        setTimeout(() => {
          router.push("/dashboard");
        }, 3000);
      }
    } catch (error: any) {
      setStatus("error");
      setError(getErrorMessage(error));
    } finally {
      setIsLoading(false);
      setIsVerifying(false);
    }
  };

  const resendVerification = async () => {
    try {
      setIsLoading(true);
      setError("");

      // Get email from localStorage atau minta input
      const userData = localStorage.getItem("mindgarden_user");
      if (userData) {
        const user = JSON.parse(userData);
        await authAPI.resendVerification(user.email);
        setStatus("success");
      } else {
        setError(
          "Tidak dapat menemukan email pengguna. Silakan login kembali."
        );
      }
    } catch (error: any) {
      setError(getErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  // Verifying State
  if (isVerifying) {
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
                Memverifikasi Email
              </h1>
              <p className="text-gray-600 text-lg">Harap tunggu sebentar...</p>
            </div>

            {/* Glassmorphism Card */}
            <Card className="border border-white/20 shadow-2xl shadow-green-500/10 backdrop-blur-xl bg-white/70 overflow-hidden">
              <CardHeader className="space-y-1 pb-6">
                <CardTitle className="text-2xl font-bold text-gray-800 text-center">
                  <AuthLayout />
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center py-8">
                <div className="w-20 h-20 bg-linear-to-r from-green-100 to-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
                  <Spinner className="w-10 h-10 text-green-600" />
                </div>
                <p className="text-gray-700 font-medium mb-2">
                  Sedang memverifikasi email Anda
                </p>
                <p className="text-sm text-gray-500">
                  Proses ini hanya memakan waktu beberapa detik
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // Success State
  if (status === "success" && !isVerifying) {
    return (
      <div className="min-h-screen relative overflow-hidden bg-linear-to-br from-green-50 via-emerald-50 to-teal-50">
        {/* Decorative gradient orbs */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-green-200/30 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-emerald-200/30 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

        <div className="relative flex items-center justify-center min-h-screen p-4">
          <div className="w-full max-w-2xl  animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header Section */}
            <div className="text-center mb-8 space-y-2">
              <h1 className="text-4xl font-bold bg-linear-to-r from-green-700 via-emerald-600 to-teal-600 bg-clip-text text-transparent">
                Verifikasi Berhasil!
              </h1>
              <p className="text-gray-600 text-lg">
                Email Anda telah dikonfirmasi
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
                  Email Berhasil Diverifikasi!
                </p>
                <p className="text-sm text-gray-500 mb-6">
                  Anda akan diarahkan ke dashboard dalam beberapa saat
                </p>
                <div className="flex items-center justify-center gap-2">
                  <Spinner className="w-5 h-5 text-green-600" />
                  <span className="text-sm text-gray-600">
                    Mengarahkan ke dashboard...
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // Default State (Check Email / Error)
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
              Verifikasi Email
            </h1>
            <p className="text-gray-600 text-lg">
              {message === "check-email"
                ? "Cek kotak masuk email Anda"
                : "Konfirmasi alamat email Anda"}
            </p>
          </div>

          {/* Glassmorphism Card */}
          <Card className="border border-white/20 shadow-2xl shadow-green-500/10 backdrop-blur-xl bg-white/70 overflow-hidden">
            <CardHeader className="space-y-1 pb-6">
              <CardTitle className="text-2xl font-bold text-gray-800 text-center">
                <AuthLayout />
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
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

              {/* Status Error Warning */}
              {status === "error" && (
                <div className="bg-yellow-50/80 backdrop-blur border border-yellow-200/50 text-yellow-700 px-4 py-3 rounded-xl text-sm shadow-sm animate-in fade-in slide-in-from-top-2 duration-300">
                  <div className="flex items-start gap-2">
                    <svg
                      className="w-5 h-5 shrink-0 mt-0.5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>
                      Verifikasi gagal. Tautan mungkin sudah kadaluarsa atau
                      tidak valid.
                    </span>
                  </div>
                </div>
              )}

              {/* Email Icon Illustration */}
              <div className="text-center py-6">
                <div className="w-20 h-20 bg-linear-to-r from-green-100 to-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-10 h-10 text-green-600"
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
                <p className="text-gray-700 font-medium mb-2">
                  {message === "check-email"
                    ? "Email Verifikasi Telah Dikirim"
                    : "Verifikasi Email Diperlukan"}
                </p>
                <p className="text-sm text-gray-600">
                  {message === "check-email"
                    ? "Kami telah mengirim tautan verifikasi ke email Anda. Silakan cek kotak masuk Anda."
                    : "Anda perlu memverifikasi alamat email sebelum dapat mengakses akun Anda."}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <Button
                  onClick={resendVerification}
                  className="w-full h-12 cursor-pointer bg-white hover:bg-gray-200 text-green-700 font-semibold rounded-xl border-2 border-green-600 shadow-lg shadow-green-500/10 hover:shadow-xl hover:shadow-green-500/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <Spinner className="w-5 h-5" />
                      Mengirim ulang...
                    </span>
                  ) : (
                    "Kirim Ulang Email Verifikasi"
                  )}
                </Button>

                <Button
                  onClick={() => router.push("/login")}
                  className="w-full h-12 cursor-pointer bg-transparent hover:bg-gray-50 text-gray-700 font-medium rounded-xl border border-gray-200 transition-all duration-300"
                >
                  Kembali ke Login
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
