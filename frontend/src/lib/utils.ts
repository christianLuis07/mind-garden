import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getErrorMessage(error: any): string {
  if (typeof error === "string") return error;
  
  if (error?.response?.data) {
    const data = error.response.data;
    
    // Jika ada detail error validasi (array)
    if (data.errors && Array.isArray(data.errors)) {
      return data.errors.map((err: any) => err.message).join(", ");
    }
    
    // Jika ada message tunggal
    if (data.message) return data.message;
  }
  
  if (error?.message) return error.message;
  return "Ada kesalahan";
}

