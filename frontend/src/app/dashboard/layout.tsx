"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/auth-store";
import { DashboardLayout as Layout } from "@/components/layout/dashboard-layout";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { setAuth, hasHydrated } = useAuthStore();

  useEffect(() => {
    if (hasHydrated && typeof window !== "undefined") {
      const token = localStorage.getItem("mindgarden_token");
      const userStr = localStorage.getItem("mindgarden_user");

      if (token && userStr) {
        try {
          const user = JSON.parse(userStr);
          setAuth(user, token);
        } catch (error) {
          console.error("Failed to parse user data:", error);
          localStorage.removeItem("mindgarden_token");
          localStorage.removeItem("mindgarden_user");
        }
      }
    }
  }, [hasHydrated, setAuth]);

  return <Layout>{children}</Layout>;
}
