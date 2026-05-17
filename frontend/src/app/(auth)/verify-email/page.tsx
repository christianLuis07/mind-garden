"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Sprout, Mail, CheckCircle2, AlertCircle, RefreshCw, ArrowLeft, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { authAPI } from "@/lib/api";
import { getErrorMessage } from "@/lib/utils";
import Link from "next/link";

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const message = searchParams.get("message");

  const [isLoading, setIsLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(!!token);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [error, setError] = useState("");

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
      const userData = localStorage.getItem("mindgarden_user");
      if (userData) {
        const user = JSON.parse(userData);
        await authAPI.resendVerification(user.email);
        setStatus("success");
      } else {
        setError("Tidak dapat menemukan email pengguna. Silakan login kembali.");
      }
    } catch (error: any) {
      setError(getErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

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
        <Card className="glass-card border-none shadow-2xl rounded-[2.5rem] overflow-hidden">
          <CardHeader className="pt-10 pb-2 text-center">
             <Link href="/" className="inline-flex items-center space-x-2 group mb-6 mx-auto">
              <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center group-hover:rotate-12 transition-transform duration-300 shadow-xl shadow-primary/20">
                <Sprout className="text-white w-7 h-7" />
              </div>
            </Link>
            <CardTitle className="text-3xl font-bold">Verifikasi Email</CardTitle>
            <CardDescription>
              {isVerifying ? "Sedang memproses tautan Anda..." : "Konfirmasi alamat email Anda"}
            </CardDescription>
          </CardHeader>

          <CardContent className="p-8 text-center">
            <AnimatePresence mode="wait">
              {isVerifying ? (
                <motion.div
                  key="verifying"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="py-8 space-y-6"
                >
                  <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                    <Spinner className="w-10 h-10 text-primary" />
                  </div>
                  <p className="text-muted-foreground">Harap tunggu, kami sedang memverifikasi akun Anda...</p>
                </motion.div>
              ) : status === "success" ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="py-8 space-y-6"
                >
                  <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto text-primary">
                    <CheckCircle2 className="w-12 h-12" />
                  </div>
                  <h3 className="text-2xl font-bold">Verifikasi Berhasil!</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Email Anda telah dikonfirmasi. Anda akan diarahkan ke dashboard dalam beberapa detik.
                  </p>
                  <div className="flex items-center justify-center gap-2 text-primary font-bold">
                    <Spinner className="w-4 h-4" /> Mengalihkan...
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="default"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-8"
                >
                  {error && (
                    <div className="p-4 rounded-2xl bg-destructive/10 border border-destructive/20 text-destructive text-sm flex items-start gap-3 text-left">
                      <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                      <span>{error}</span>
                    </div>
                  )}

                  <div className="py-6">
                    <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 text-primary">
                      <Mail className="w-10 h-10" />
                    </div>
                    <p className="text-muted-foreground leading-relaxed">
                      {message === "check-email"
                        ? "Kami telah mengirimkan tautan verifikasi. Silakan cek kotak masuk email Anda."
                        : "Anda perlu memverifikasi email sebelum dapat melanjutkan."}
                    </p>
                  </div>

                  <div className="space-y-4">
                    <Button
                      onClick={resendVerification}
                      disabled={isLoading}
                      className="w-full h-14 rounded-2xl bg-primary hover:bg-primary/90 text-white font-bold"
                    >
                      {isLoading ? (
                        <RefreshCw className="w-5 h-5 animate-spin" />
                      ) : (
                        "Kirim Ulang Email Verifikasi"
                      )}
                    </Button>
                    <Link href="/login" className="inline-flex items-center text-sm font-bold text-muted-foreground hover:text-primary gap-2 transition-colors">
                      <ArrowLeft className="w-4 h-4" /> Kembali ke Login
                    </Link>
                  </div>

                  <div className="p-4 rounded-2xl bg-muted/50 text-xs text-left text-muted-foreground space-y-2">
                    <p className="font-bold text-foreground flex items-center gap-2 mb-1">
                      <Info className="w-4 h-4" /> Belum menerima email?
                    </p>
                    <p>• Periksa folder spam atau junk email.</p>
                    <p>• Pastikan email yang didaftarkan sudah benar.</p>
                    <p>• Tunggu beberapa menit lalu coba kirim ulang.</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-background">
          <Spinner className="w-10 h-10 text-primary" />
        </div>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  );
}
