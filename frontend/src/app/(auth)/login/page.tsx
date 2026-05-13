"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AuthLayout } from "@/components/layout/auth-layout";
import { Spinner } from "@/components/ui/spinner";
import { useAuthStore } from "@/store/auth-store";
import { authAPI } from "@/lib/api";
import { getErrorMessage } from "@/lib/utils";
import { loginSchema } from "@/lib/validators";
import Link from "next/link";

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { setAuth } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    try {
      setIsLoading(true);
      setError("");

      const response = await authAPI.login(data);

      if (response.data.success) {
        // Admin accounts require TOTP — redirect to admin login
        if (response.data.data?.requireTotp) {
          setError("Akun ini adalah administrator. Silakan login melalui halaman Admin.");
          return;
        }

        setAuth(response.data.data?.user, response?.data?.data?.token);
        router.push("/dashboard");
      }
    } catch (error: any) {
      setError(getErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

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
              Selamat Datang Kembali
            </h1>
            <p className="text-gray-600 text-lg">
              Login ke Akun MindGarden Kamu
            </p>
          </div>

          {/* Glassmorphism Card */}
          <Card className="border border-white/20 shadow-2xl shadow-green-500/10 backdrop-blur-xl bg-white/70 overflow-hidden">
            <CardHeader className="space-y-1 pb-6">
              <CardTitle className="text-2xl font-bold text-gray-800">
                <AuthLayout />
              </CardTitle>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                {/* Error Message - Softer styling */}
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

                {/* Password Field */}
                <div className="space-y-2">
                  <Label
                    htmlFor="password"
                    className="text-sm font-semibold text-gray-700"
                  >
                    Password
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Masukkan password Anda"
                    className="h-12 border-gray-200 bg-white/50 backdrop-blur focus:bg-white focus:border-green-500 focus:ring-green-500/20 transition-all duration-200 rounded-xl shadow-sm"
                    {...register("password")}
                  />
                  {errors.password && (
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
                      {errors.password.message}
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
                      Sebentar ya...
                    </span>
                  ) : (
                    "Masuk"
                  )}
                </Button>

                {/* Footer Links */}
                <div className="pt-4 space-y-3">
                  <div className="text-center">
                    <Link
                      href="/forgot-password"
                      className="text-sm text-green-700 hover:text-green-800 font-medium transition-colors duration-200 hover:underline underline-offset-4"
                    >
                      Lupa kata sandi?
                    </Link>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-200"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-4 bg-white/70 backdrop-blur text-gray-600">
                        atau
                      </span>
                    </div>
                  </div>
                  <div className="text-center text-sm text-gray-600">
                    Belum punya akun?{" "}
                    <Link
                      href="/register"
                      className="text-green-700 hover:text-green-800 font-semibold transition-colors duration-200 hover:underline underline-offset-4"
                    >
                      Daftar Sekarang
                    </Link>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Footer Text */}
          {/* <p className="text-center text-sm text-gray-500 mt-6">
            Dengan masuk, Anda menyetujui{" "}
            <Link
              href="/terms"
              className="text-green-700 hover:text-green-800 font-medium"
            >
              Syarat & Ketentuan
            </Link>
          </p> */}
        </div>
      </div>
    </div>
  );
}
