import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Silakan masukkan alamat email yang valid"),
  password: z.string().min(1, "silakan masukkan password"),
});

export const registerSchema = z
  .object({
    name: z.string().min(3, "Nama setidaknya 3 karakter"),
    email: z.string().email("Silakan masukkan alamat email yang valid"),
    password: z.string().min(8, "Password setidaknya 8 karakter"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Kata sandi tidak sesuai.",
    path: ["confirmPassword"],
  });

export const emailSchema = z.object({
  email: z.string().email("Silakan masukkan alamat email yang valid"),
});

export const resetPasswordSchema = z
  .object({
    token: z.string().min(1, "Token wajib diisi"),
    newPassword: z.string().min(8, "Password setidaknya 8 karakter"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Kata sandi tidak sesuai.",
    path: ["confirmPassword"],
  });

export const profileSchema = z.object({
  name: z.string().min(3, "Nama setidaknya 3 karakter"),
  avatar: z.string().optional(),
});
