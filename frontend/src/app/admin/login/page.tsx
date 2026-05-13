"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { useAuthStore } from "@/store/auth-store";
import { authAPI } from "@/lib/api";
import { adminAPI } from "@/lib/admin-api";
import { getErrorMessage } from "@/lib/utils";
import { ShieldAlert, ShieldCheck } from "lucide-react";

const loginSchema = z.object({
  email: z.string().email("Email tidak valid"),
  password: z.string().min(1, "Password dibutuhkan"),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function AdminLoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { setAuth } = useAuthStore();

  const [step, setStep] = useState<"login" | "totp" | "setup">("login");
  const [tempToken, setTempToken] = useState("");
  const [totpCode, setTotpCode] = useState("");
  const [qrCode, setQrCode] = useState("");
  const [totpSecret, setTotpSecret] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmitLogin = async (data: LoginForm) => {
    try {
      setIsLoading(true);
      setError("");

      const response = await authAPI.login(data);

      if (response.data.data?.requireTotp) {
        setTempToken(response.data.data.tempToken);
        
        if (response.data.data.isTotpEnabled) {
          setStep("totp");
        } else {
          // Trigger setup
          const setupRes = await adminAPI.setupTotp(response.data.data.tempToken);
          if (setupRes.data.success) {
            setQrCode(setupRes.data.data.qrCodeUrl);
            setTotpSecret(setupRes.data.data.secret);
            setStep("setup");
          }
        }
      } else if (response.data.data?.user?.role === "admin") {
         // Should not happen if backend enforces requireTotp for admin
         setAuth(response.data.data?.user, response.data.data?.token);
         router.push("/admin/dashboard");
      } else {
         setError("Akun ini bukan administrator.");
      }
    } catch (error: any) {
      setError(getErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmitTotp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (totpCode.length !== 6) {
      setError("Kode TOTP harus 6 angka");
      return;
    }
    
    try {
      setIsLoading(true);
      setError("");

      const response = await adminAPI.validateTotpLogin(tempToken, totpCode);

      if (response.data.success) {
        setAuth(response.data.data?.user, response.data.data?.token);
        router.push("/admin/dashboard");
      }
    } catch (error: any) {
      setError(getErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmitSetup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (totpCode.length !== 6) {
      setError("Kode TOTP harus 6 angka");
      return;
    }
    
    try {
      setIsLoading(true);
      setError("");

      const response = await adminAPI.verifyTotp(tempToken, totpCode);

      if (response.data.success) {
        // Setup successful, now validate the login
        const loginRes = await adminAPI.validateTotpLogin(tempToken, totpCode);
        if (loginRes.data.success) {
          setAuth(loginRes.data.data?.user, loginRes.data.data?.token);
          router.push("/admin/dashboard");
        }
      }
    } catch (error: any) {
      setError(getErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-slate-900">
      <div className="absolute top-0 left-0 w-96 h-96 bg-slate-800/50 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-slate-800/50 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

      <div className="relative flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="text-center mb-8 space-y-2">
            <div className="flex justify-center mb-4">
               {step === 'login' ? <ShieldAlert className="w-16 h-16 text-slate-400" /> : <ShieldCheck className="w-16 h-16 text-green-400" />}
            </div>
            <h1 className="text-3xl font-bold text-white">
              Sistem Admin Global
            </h1>
            <p className="text-slate-400 text-sm">
              Area Terbatas. Hanya untuk Administrator.
            </p>
          </div>

          <Card className="border border-slate-700 shadow-2xl bg-slate-800/80 backdrop-blur-xl overflow-hidden">
            <CardHeader className="space-y-1 pb-6 border-b border-slate-700">
              <CardTitle className="text-xl font-bold text-white text-center">
                {step === "login" && "Kredensial Admin"}
                {step === "totp" && "Verifikasi 2 Langkah (TOTP)"}
                {step === "setup" && "Pengaturan Keamanan 2 Langkah"}
              </CardTitle>
            </CardHeader>

            <CardContent className="pt-6">
              {error && (
                <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg text-sm shadow-sm mb-6 flex items-start gap-2">
                  <span className="mt-0.5">⚠️</span>
                  <span>{error}</span>
                </div>
              )}

              {step === "login" ? (
                <form onSubmit={handleSubmit(onSubmitLogin)} className="space-y-5">
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-slate-300">Email</Label>
                    <Input
                      type="email"
                      className="bg-slate-900 border-slate-700 text-white focus:ring-slate-500"
                      {...register("email")}
                    />
                    {errors.email && (
                      <p className="text-sm text-red-400">{errors.email.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-slate-300">Password</Label>
                    <Input
                      type="password"
                      className="bg-slate-900 border-slate-700 text-white focus:ring-slate-500"
                      {...register("password")}
                    />
                    {errors.password && (
                      <p className="text-sm text-red-400">{errors.password.message}</p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-12 bg-slate-200 text-slate-900 hover:bg-white font-bold"
                    disabled={isLoading}
                  >
                    {isLoading ? <Spinner className="w-5 h-5 text-slate-900" /> : "Verifikasi Identitas"}
                  </Button>
                </form>
              ) : step === "totp" ? (
                <form onSubmit={onSubmitTotp} className="space-y-6">
                  <div className="space-y-2 text-center">
                    <Label className="text-sm font-semibold text-slate-300">
                      Masukkan 6 Angka dari Aplikasi Authenticator Anda
                    </Label>
                    <Input
                      type="text"
                      maxLength={6}
                      value={totpCode}
                      onChange={(e) => setTotpCode(e.target.value.replace(/\D/g, ''))}
                      className="text-center text-2xl tracking-widest h-14 bg-slate-900 border-slate-700 text-white focus:ring-slate-500 font-mono"
                      placeholder="000000"
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-12 bg-green-600 hover:bg-green-500 text-white font-bold"
                    disabled={isLoading || totpCode.length !== 6}
                  >
                    {isLoading ? <Spinner className="w-5 h-5 text-white" /> : "Masuk Dashboard"}
                  </Button>
                  
                  <button type="button" onClick={() => setStep('login')} className="w-full text-sm text-slate-400 hover:text-white text-center mt-4">
                     Batal
                  </button>
                </form>
              ) : (
                <form onSubmit={onSubmitSetup} className="space-y-6">
                  <div className="space-y-4 text-center flex flex-col items-center">
                    <p className="text-sm text-slate-300">
                      Pindai QR Code di bawah ini menggunakan aplikasi seperti <strong>Google Authenticator</strong> atau <strong>Authy</strong>.
                    </p>
                    
                    {qrCode && (
                      <div className="bg-white p-2 rounded-xl">
                        <img src={qrCode} alt="TOTP QR Code" className="w-48 h-48" />
                      </div>
                    )}

                    <div className="w-full space-y-2">
                       <Label className="text-sm font-semibold text-slate-300">
                         Setelah dipindai, masukkan 6 angka verifikasinya:
                       </Label>
                       <Input
                         type="text"
                         maxLength={6}
                         value={totpCode}
                         onChange={(e) => setTotpCode(e.target.value.replace(/\D/g, ''))}
                         className="text-center text-2xl tracking-widest h-14 bg-slate-900 border-slate-700 text-white focus:ring-slate-500 font-mono"
                         placeholder="000000"
                       />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-12 bg-green-600 hover:bg-green-500 text-white font-bold"
                    disabled={isLoading || totpCode.length !== 6}
                  >
                    {isLoading ? <Spinner className="w-5 h-5 text-white" /> : "Aktifkan & Masuk"}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
