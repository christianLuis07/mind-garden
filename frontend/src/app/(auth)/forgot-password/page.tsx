"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { Sprout, ArrowLeft, Mail, AlertCircle, CheckCircle2, Info } from "lucide-react";
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

  if (isSubmitted) {
    return (
      <div className="min-h-screen relative flex items-center justify-center bg-background overflow-hidden p-4">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/20 rounded-full blur-[120px] animate-pulse delay-700" />
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-[500px] z-10"
        >
          <Card className="glass-card border-none shadow-2xl rounded-[2.5rem] overflow-hidden p-8 text-center">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-8">
              <CheckCircle2 className="w-10 h-10 text-primary" />
            </div>
            <h2 className="text-3xl font-bold mb-4">Email Terkirim!</h2>
            <p className="text-muted-foreground mb-8">
              Kami telah mengirimkan instruksi pemulihan kata sandi ke <br />
              <span className="text-foreground font-bold">{submittedEmail}</span>
            </p>
            
            <div className="space-y-4">
              <Button
                onClick={() => router.push("/login")}
                className="w-full h-14 rounded-2xl bg-primary hover:bg-primary/90 text-white font-bold"
              >
                Kembali ke Login
              </Button>
              <button
                onClick={() => setIsSubmitted(false)}
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
              >
                Gunakan email lain
              </button>
            </div>

            <div className="mt-10 p-4 rounded-2xl bg-muted/50 text-xs text-left text-muted-foreground space-y-2">
              <p className="font-bold text-foreground flex items-center gap-2 mb-1">
                <Info className="w-4 h-4" /> Belum menerima email?
              </p>
              <p>• Periksa folder spam atau promosi.</p>
              <p>• Pastikan email yang Anda masukkan sudah benar.</p>
              <p>• Tunggu beberapa menit sebelum mencoba lagi.</p>
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
          <h1 className="text-3xl font-bold mb-2">Lupa Kata Sandi?</h1>
          <p className="text-muted-foreground">Kami akan membantu Anda memulihkannya</p>
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

              <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10 text-sm text-muted-foreground leading-relaxed">
                Masukkan email Anda dan kami akan mengirimkan tautan untuk mengatur ulang kata sandi Anda.
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Alamat Email</Label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="nama@email.com"
                    className="pl-12 h-14 rounded-2xl bg-background/50"
                    {...register("email")}
                  />
                </div>
                {errors.email && (
                  <p className="text-xs text-destructive font-medium ml-1">{errors.email.message}</p>
                )}
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-14 rounded-2xl bg-primary hover:bg-primary/90 text-white font-bold text-lg transition-all"
              >
                {isLoading ? (
                  <Spinner className="w-5 h-5" />
                ) : (
                  "Kirim Tautan Pemulihan"
                )}
              </Button>

              <div className="text-center">
                <Link href="/login" className="inline-flex items-center text-sm font-bold text-primary hover:underline gap-2">
                  <ArrowLeft className="w-4 h-4" /> Kembali ke Login
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
