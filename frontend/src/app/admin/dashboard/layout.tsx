"use client";

import { useAuthStore } from "@/store/auth-store";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import { Users, BarChart3, LogOut, ShieldAlert } from "lucide-react";

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, clearAuth } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!user || user.role !== "admin") {
      router.push("/admin/login");
    }
  }, [user, router]);

  if (!user || user.role !== "admin") return null;

  const handleLogout = () => {
    clearAuth();
    router.push("/admin/login");
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col hidden md:flex">
        <div className="h-16 flex items-center px-6 border-b border-slate-800">
          <ShieldAlert className="w-6 h-6 mr-2 text-red-500" />
          <span className="font-bold text-lg">Admin Panel</span>
        </div>
        
        <nav className="flex-1 py-6 px-3 space-y-1">
          <Link
            href="/admin/dashboard"
            className={`flex items-center px-3 py-2.5 rounded-lg transition-colors ${
              pathname === "/admin/dashboard"
                ? "bg-slate-800 text-white"
                : "text-slate-400 hover:bg-slate-800 hover:text-white"
            }`}
          >
            <BarChart3 className="w-5 h-5 mr-3" />
            Ringkasan
          </Link>
          <Link
            href="/admin/dashboard/users"
            className={`flex items-center px-3 py-2.5 rounded-lg transition-colors ${
              pathname === "/admin/dashboard/users"
                ? "bg-slate-800 text-white"
                : "text-slate-400 hover:bg-slate-800 hover:text-white"
            }`}
          >
            <Users className="w-5 h-5 mr-3" />
            Pengguna
          </Link>
        </nav>

        <div className="p-4 border-t border-slate-800">
           <div className="mb-4 px-2">
             <p className="text-sm font-medium text-white">{user.name}</p>
             <p className="text-xs text-slate-400 truncate">{user.email}</p>
           </div>
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-3 py-2 text-sm text-red-400 hover:bg-slate-800 hover:text-red-300 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Keluar
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-8">
        {children}
      </main>
    </div>
  );
}
