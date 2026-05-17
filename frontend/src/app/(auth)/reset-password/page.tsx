"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { Sprout, Lock, CheckCircle2, AlertCircle, ArrowLeft, Info, ShieldAlert, Eye, EyeOff } from "lucide-react";
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
import { Spinner } from "@/components/ui/spinner";
import { authAPI } from "@/lib/api";
import { getErrorMessage } from "@/lib/utils";
import { resetPasswordSchema } from "@/lib/validators";
import Link from "next/link";

type ResetPasswordForm = z.infer<typeof resetPasswordSchema>;

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<ResetPasswordForm>({
    resolver: zodResolver(resetPasswordSchema),
  });

  useEffect(() => {
    if (token) {
      setValue("token", token);
    }
  }, [token, setValue]);

  const onSubmit = async (data: ResetPasswordForm) => {
    try {
      setIsLoading(true);
      setError("");

      const response = await authAPI.resetPassword(data.token, data.newPassword);

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

  if (!token) {
    return (
      <div className="min-h-screen relative flex items-center justify-center bg-background overflow-hidden p-4">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px]" />
        </div>
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-[500px] z-10">
          <Card className="glass-card border-none shadow-2xl rounded-[2.5rem] p-8 text-center">
            <div className="w-20 h-20 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-8 text-destructive">
              <ShieldAlert className="w-10 h-10" />
            </div>
            <h2 className="text-3xl font-bold mb-4">Tautan Tidak Valid</h2>
            <p className="text-muted-foreground mb-8 leading-relaxed">
              Tautan reset kata sandi ini tidak valid atau telah kedaluwarsa. Silakan minta tautan baru.
            </p>
            <div className="space-y-4">
              <Button onClick={() => router.push("/forgot-password")} className="w-full h-14 rounded-2xl bg-primary text-white font-bold">
                Minta Tautan Baru
              </Button>
              <Link href="/login" className="inline-flex items-center text-sm font-bold text-muted-foreground hover:text-primary gap-2 transition-colors">
                <ArrowLeft className="w-4 h-4" /> Kembali ke Login
              </Link>
            </div>
          </Card>
        </motion.div>
      </div>
    );
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen relative flex items-center justify-center bg-background overflow-hidden p-4">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px]" />
        </div>
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-[500px] z-10 text-center">
           <Card className="glass-card border-none shadow-2xl rounded-[2.5rem] p-10">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-8 text-primary">
                <CheckCircle2 className="w-12 h-12" />
              </div>
              <h2 className="text-3xl font-bold mb-4">Berhasil!</h2>
              <p className="text-muted-foreground mb-8">Kata sandi Anda telah diperbarui. Silakan login kembali.</p>
              <div className="flex items-center justify-center gap-2 text-primary font-bold">
                <Spinner className="w-4 h-4" /> Mengalihkan...
              </div>
           </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative flex items-center justify-center bg-background overflow-hidden p-4">
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/20 rounded-full blur-[120px] animate-pulse delay-700" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-[450px] z-10"
      >
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-2 group mb-6">
            <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center group-hover:rotate-12 transition-transform duration-300 shadow-xl shadow-primary/20">
              <Sprout className="text-white w-7 h-7" />
            </div>
            <span className="font-bold text-3xl tracking-tight text-foreground">
              Mind<span className="text-primary">Garden</span>
            </span>
          </Link>
          <h1 className="text-3xl font-bold mb-2">Reset Kata Sandi</h1>
          <p className="text-muted-foreground">Buat kata sandi baru yang lebih aman</p>
        </div>

        <Card className="glass-card border-none shadow-2xl rounded-[2.5rem] overflow-hidden">
          <CardContent className="p-8 pt-10">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {error && (
                <div className="p-4 rounded-2xl bg-destructive/10 border border-destructive/20 text-destructive text-sm flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              <div className="p-4 rounded-2xl bg-muted/50 text-xs text-muted-foreground space-y-2">
                <p className="font-bold text-foreground flex items-center gap-2 mb-1">
                  <Info className="w-4 h-4" /> Tips kata sandi kuat:
                </p>
                <p>• Minimal 8 karakter dengan kombinasi angka & simbol.</p>
                <p>• Gunakan campuran huruf besar dan kecil.</p>
              </div>

              <input type="hidden" {...register("token")} />

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="newPassword">Kata Sandi Baru</Label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="newPassword"
                      type={showNewPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className="pl-12 pr-12 h-14 rounded-2xl bg-background/50"
                      {...register("newPassword")}
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors focus:outline-none"
                    >
                      {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {errors.newPassword && (
                    <p className="text-xs text-destructive font-medium ml-1">{errors.newPassword.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Konfirmasi Kata Sandi</Label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className="pl-12 pr-12 h-14 rounded-2xl bg-background/50"
                      {...register("confirmPassword")}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors focus:outline-none"
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-xs text-destructive font-medium ml-1">{errors.confirmPassword.message}</p>
                  )}
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-14 rounded-2xl bg-primary hover:bg-primary/90 text-white font-bold text-lg transition-all"
              >
                {isLoading ? (
                  <Spinner className="w-5 h-5" />
                ) : (
                  "Reset Kata Sandi"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-background">
          <Spinner className="w-10 h-10 text-primary" />
        </div>
      }
    >
      <ResetPasswordContent />
    </Suspense>
  );
}
