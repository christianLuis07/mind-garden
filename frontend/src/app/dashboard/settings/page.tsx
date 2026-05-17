"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { 
  User, 
  Lock, 
  Bell, 
  Trash2, 
  Camera, 
  CheckCircle2, 
  AlertCircle,
  ShieldCheck,
  Eye,
  EyeOff,
  ChevronRight,
  LogOut,
  Sparkles,
  ArrowLeft
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { useAuthStore } from "@/store/auth-store";
import { authAPI } from "@/lib/api";
import { getErrorMessage } from "@/lib/utils";
import { profileSchema, changePasswordSchema } from "@/lib/validators";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";
import { ProtectedRoute } from "@/components/layout/protected-route";
import Link from "next/link";
import { cn } from "@/lib/utils";

type ProfileFormValues = z.infer<typeof profileSchema>;
type PasswordFormValues = z.infer<typeof changePasswordSchema>;

export default function SettingsPage() {
  const { user, setAuth, clearAuth } = useAuthStore();
  const [activeTab, setActiveTab] = useState<"profile" | "security" | "account">("profile");
  const [isLoading, setIsLoading] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [avatarPreview, setImagePreview] = useState<string | null>(user?.avatar || null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  // Profile Form
  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || "",
    },
  });

  // Password Form
  const passwordForm = useForm<PasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 2 * 1024 * 1024) {
        toast.error("Ukuran file terlalu besar (Maks 2MB)");
        return;
      }
      setAvatarFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const onUpdateProfile = async (data: ProfileFormValues) => {
    try {
      setIsLoading(true);
      const formData = new FormData();
      formData.append("name", data.name);
      if (avatarFile) {
        formData.append("avatar", avatarFile);
      }

      const response = await authAPI.updateProfile(formData);
      if (response.data.success) {
        setAuth(response.data.data.user);
        toast.success("Profil Diperbarui", {
          description: "Perubahan profilmu telah berhasil disimpan.",
        });
      }
    } catch (error: any) {
      toast.error("Gagal Memperbarui Profil", {
        description: getErrorMessage(error),
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onChangePassword = async (data: PasswordFormValues) => {
    try {
      setIsLoading(true);
      const response = await authAPI.changePassword({
        oldPassword: data.oldPassword,
        newPassword: data.newPassword,
      });

      if (response.data.success) {
        passwordForm.reset();
        toast.success("Password Berhasil Diubah", {
          description: "Gunakan password barumu untuk masuk di sesi berikutnya.",
        });
      }
    } catch (error: any) {
      toast.error("Gagal Mengubah Password", {
        description: getErrorMessage(error),
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onDeleteAccount = async () => {
    if (!confirm("Apakah kamu yakin ingin menghapus akun MindGarden milikmu? Seluruh data ceritamu akan hilang selamanya.")) return;

    try {
      setIsLoading(true);
      const response = await authAPI.deleteAccount();
      if (response.data.success) {
        toast.success("Akun Berhasil Dihapus", {
          description: "Terima kasih telah menjadi bagian dari MindGarden.",
        });
        clearAuth();
        window.location.href = "/";
      }
    } catch (error: any) {
      toast.error("Gagal Menghapus Akun", {
        description: getErrorMessage(error),
      });
    } finally {
      setIsLoading(false);
    }
  };

  const tabs = [
    { id: "profile", label: "Profil", icon: User },
    { id: "security", label: "Keamanan", icon: Lock },
    { id: "account", label: "Akun", icon: AlertCircle },
  ];

  return (
    <ProtectedRoute>
      <div className="space-y-10 pb-20">
        {/* Creative Header */}
        <div className="relative overflow-hidden rounded-[3rem] bg-primary/10 p-8 md:p-12">
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-primary/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 bg-secondary/30 rounded-full blur-3xl animate-pulse delay-1000" />
          
          <div className="relative z-10">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center space-x-2 bg-white/50 dark:bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 mb-6"
            >
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-xs font-bold uppercase tracking-widest text-primary">Ruang Pengaturan</span>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl font-extrabold text-foreground tracking-tight mb-4"
            >
              Kelola <span className="text-primary italic">Kenyamananmu</span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg text-muted-foreground font-medium leading-relaxed max-w-2xl"
            >
              Sesuaikan profil dan tingkatkan keamanan akunmu agar pengalaman di MindGarden tetap nyaman dan aman.
            </motion.p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Tabs */}
          <div className="lg:col-span-1 space-y-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={cn(
                    "w-full flex items-center justify-between px-6 py-4 rounded-[1.5rem] text-sm font-bold transition-all duration-300 relative overflow-hidden group",
                    isActive 
                      ? "bg-primary text-white shadow-xl shadow-primary/20" 
                      : "bg-card/50 text-muted-foreground hover:bg-primary/5 hover:text-primary"
                  )}
                >
                  <div className="flex items-center gap-3 relative z-10">
                    <Icon className={cn("w-5 h-5", isActive ? "text-white" : "group-hover:scale-110 transition-transform")} />
                    <span>{tab.label}</span>
                  </div>
                  <ChevronRight className={cn("w-4 h-4 relative z-10 transition-transform", isActive ? "opacity-100" : "opacity-0 group-hover:opacity-40")} />
                </button>
              );
            })}
          </div>

          {/* Tab Content */}
          <div className="lg:col-span-3">
            <AnimatePresence mode="wait">
              {activeTab === "profile" && (
                <motion.div
                  key="profile"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="glass-card rounded-[2.5rem] border-none shadow-2xl shadow-primary/5 overflow-hidden">
                    <CardContent className="p-8 md:p-12 space-y-10">
                      <div className="flex items-center gap-3">
                        <div className="w-1.5 h-8 bg-primary rounded-full" />
                        <h2 className="text-2xl font-bold text-foreground">Detail Profil</h2>
                      </div>

                      <form onSubmit={profileForm.handleSubmit(onUpdateProfile)} className="space-y-8">
                        {/* Avatar Upload */}
                        <div className="flex flex-col items-center sm:flex-row sm:items-end gap-6">
                           <div className="relative group">
                              <div className="w-32 h-32 rounded-[2.5rem] bg-primary/10 overflow-hidden border-4 border-white shadow-xl">
                                 {avatarPreview ? (
                                    <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
                                 ) : (
                                    <div className="w-full h-full flex items-center justify-center text-primary/40">
                                       <User className="w-12 h-12" />
                                    </div>
                                 )}
                              </div>
                              <label 
                                 htmlFor="avatar-upload" 
                                 className="absolute -bottom-2 -right-2 w-10 h-10 bg-primary text-white rounded-xl shadow-lg flex items-center justify-center cursor-pointer hover:scale-110 active:scale-95 transition-all border-2 border-white"
                              >
                                 <Camera className="w-5 h-5" />
                                 <input type="file" id="avatar-upload" className="hidden" accept="image/*" onChange={handleAvatarChange} />
                              </label>
                           </div>
                           <div className="flex-1 text-center sm:text-left">
                              <p className="text-sm font-bold text-foreground mb-1">Foto Profil</p>
                              <p className="text-xs text-muted-foreground leading-relaxed italic">Gunakan foto yang paling mewakili ketenanganmu. Format JPG atau PNG, Maks 2MB.</p>
                           </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <Label htmlFor="name" className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Nama Lengkap</Label>
                            <Input
                              id="name"
                              className="h-14 bg-muted/20 border-none rounded-2xl px-6 focus:ring-2 focus:ring-primary/20 transition-all font-bold"
                              {...profileForm.register("name")}
                            />
                            {profileForm.formState.errors.name && (
                              <p className="text-xs text-destructive font-bold ml-1">{profileForm.formState.errors.name.message}</p>
                            )}
                          </div>
                          
                          <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Email (Hanya Baca)</Label>
                            <Input
                              value={user?.email || ""}
                              disabled
                              className="h-14 bg-muted/10 border-none rounded-2xl px-6 font-medium text-muted-foreground"
                            />
                          </div>
                        </div>

                        <div className="pt-4">
                          <Button
                            type="submit"
                            disabled={isLoading}
                            className="h-16 px-10 rounded-2xl bg-primary hover:bg-primary/90 text-white font-extrabold shadow-xl shadow-primary/20 transition-all hover:scale-[1.02]"
                          >
                            {isLoading ? <Spinner className="w-5 h-5" /> : "Simpan Perubahan"}
                          </Button>
                        </div>
                      </form>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {activeTab === "security" && (
                <motion.div
                  key="security"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="glass-card rounded-[2.5rem] border-none shadow-2xl shadow-primary/5 overflow-hidden">
                    <CardContent className="p-8 md:p-12 space-y-10">
                      <div className="flex items-center gap-3">
                        <div className="w-1.5 h-8 bg-primary rounded-full" />
                        <h2 className="text-2xl font-bold text-foreground">Keamanan Akun</h2>
                      </div>

                      <form onSubmit={passwordForm.handleSubmit(onChangePassword)} className="space-y-8">
                        <div className="p-6 bg-primary/5 rounded-[2rem] border border-primary/10 flex items-start gap-4">
                           <ShieldCheck className="w-6 h-6 text-primary shrink-0 mt-1" />
                           <div className="space-y-1">
                              <p className="text-sm font-bold text-foreground">Tips Kata Sandi</p>
                              <p className="text-xs text-muted-foreground leading-relaxed italic">Pastikan kata sandimu unik dan mengandung kombinasi huruf besar, kecil, angka, serta simbol untuk perlindungan maksimal.</p>
                           </div>
                        </div>

                        <div className="space-y-6">
                           <div className="space-y-2">
                              <Label htmlFor="oldPassword text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Kata Sandi Lama</Label>
                              <div className="relative">
                                 <Input
                                    id="oldPassword"
                                    type={showOldPassword ? "text" : "password"}
                                    className="h-14 bg-muted/20 border-none rounded-2xl px-6 pr-12 focus:ring-2 focus:ring-primary/20 transition-all"
                                    {...passwordForm.register("oldPassword")}
                                 />
                                 <button
                                    type="button"
                                    onClick={() => setShowOldPassword(!showOldPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
                                 >
                                    {showOldPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                 </button>
                              </div>
                              {passwordForm.formState.errors.oldPassword && (
                                 <p className="text-xs text-destructive font-bold">{passwordForm.formState.errors.oldPassword.message}</p>
                              )}
                           </div>

                           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div className="space-y-2">
                                 <Label htmlFor="newPassword text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Kata Sandi Baru</Label>
                                 <div className="relative">
                                    <Input
                                       id="newPassword"
                                       type={showNewPassword ? "text" : "password"}
                                       className="h-14 bg-muted/20 border-none rounded-2xl px-6 pr-12 focus:ring-2 focus:ring-primary/20 transition-all"
                                       {...passwordForm.register("newPassword")}
                                    />
                                    <button
                                       type="button"
                                       onClick={() => setShowNewPassword(!showNewPassword)}
                                       className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
                                    >
                                       {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                 </div>
                                 {passwordForm.formState.errors.newPassword && (
                                    <p className="text-xs text-destructive font-bold">{passwordForm.formState.errors.newPassword.message}</p>
                                 )}
                              </div>

                              <div className="space-y-2">
                                 <Label htmlFor="confirmPassword text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Konfirmasi Kata Sandi</Label>
                                 <Input
                                    id="confirmPassword"
                                    type="password"
                                    className="h-14 bg-muted/20 border-none rounded-2xl px-6 focus:ring-2 focus:ring-primary/20 transition-all"
                                    {...passwordForm.register("confirmPassword")}
                                 />
                                 {passwordForm.formState.errors.confirmPassword && (
                                    <p className="text-xs text-destructive font-bold">{passwordForm.formState.errors.confirmPassword.message}</p>
                                 )}
                              </div>
                           </div>
                        </div>

                        <div className="pt-4">
                          <Button
                            type="submit"
                            disabled={isLoading}
                            className="h-16 px-10 rounded-2xl bg-primary hover:bg-primary/90 text-white font-extrabold shadow-xl shadow-primary/20 transition-all"
                          >
                            {isLoading ? <Spinner className="w-5 h-5" /> : "Perbarui Kata Sandi"}
                          </Button>
                        </div>
                      </form>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {activeTab === "account" && (
                <motion.div
                  key="account"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="glass-card rounded-[2.5rem] border-none shadow-2xl shadow-primary/5 overflow-hidden">
                    <CardContent className="p-8 md:p-12 space-y-12">
                      <div className="flex items-center gap-3">
                        <div className="w-1.5 h-8 bg-rose-500 rounded-full" />
                        <h2 className="text-2xl font-bold text-foreground">Zona Bahaya</h2>
                      </div>

                      <div className="space-y-8">
                         <div className="p-8 bg-rose-500/5 rounded-[2.5rem] border border-rose-500/10 space-y-4">
                            <div className="flex items-center gap-4 text-rose-600 mb-4">
                               <div className="w-12 h-12 bg-rose-500/10 rounded-2xl flex items-center justify-center">
                                  <Trash2 className="w-6 h-6" />
                               </div>
                               <h3 className="text-xl font-bold">Hapus Akun Selamanya</h3>
                            </div>
                            <p className="text-sm text-muted-foreground leading-relaxed font-medium italic">
                               Tindakan ini tidak dapat dibatalkan. Seluruh riwayat jurnal, catatan mood, dan keanggotaan komunitasmu akan dihapus permanen dari server kami.
                            </p>
                            <div className="pt-4">
                               <Button
                                 onClick={onDeleteAccount}
                                 disabled={isLoading}
                                 variant="destructive"
                                 className="h-14 px-8 rounded-2xl bg-rose-500 hover:bg-rose-600 text-white font-extrabold shadow-xl shadow-rose-500/20"
                               >
                                 Hapus Akun Saya
                               </Button>
                            </div>
                         </div>

                         <div className="text-center pt-8">
                            <p className="text-xs text-muted-foreground font-medium mb-6 uppercase tracking-widest">Sesi Login Kamu</p>
                            <Button 
                              onClick={() => { clearAuth(); window.location.href = "/"; }}
                              variant="ghost" 
                              className="h-14 px-10 rounded-2xl font-bold text-muted-foreground hover:bg-primary/5 hover:text-primary transition-all border border-border/50"
                            >
                               <LogOut className="w-5 h-5 mr-3" />
                               Keluar dari Aplikasi
                            </Button>
                         </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="text-center">
           <Link href="/dashboard" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground hover:text-primary transition-colors">
              <ArrowLeft className="w-3 h-3" /> Kembali ke Beranda
           </Link>
        </div>
      </div>
    </ProtectedRoute>
  );
}
