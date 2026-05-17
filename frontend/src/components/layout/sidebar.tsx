"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Smile,
  BookOpen,
  Wind,
  Users,
  Settings,
  LogOut,
  X,
  Sprout,
  ChevronRight,
} from "lucide-react";
import { useAuthStore } from "@/store/auth-store";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { motion } from "framer-motion";

interface SidebarProps {
  onClose?: () => void;
}

const navigation = [
  { name: "Beranda", href: "/dashboard", icon: LayoutDashboard },
  { name: "Pantau Mood", href: "/dashboard/mood", icon: Smile },
  { name: "Jurnal", href: "/dashboard/journal", icon: BookOpen },
  { name: "Latihan Nafas", href: "/dashboard/breathing", icon: Wind },
  { name: "Komunitas", href: "/dashboard/community", icon: Users },
  { name: "Pengaturan", href: "/dashboard/settings", icon: Settings },
];

export function Sidebar({ onClose }: SidebarProps) {
  const pathname = usePathname();
  const { user, clearAuth } = useAuthStore();

  const handleLogout = () => {
    clearAuth();
    window.location.href = "/";
  };

  return (
    <div className="flex flex-col h-full bg-transparent">
      {/* Header / Logo Section */}
      <div className="flex items-center space-x-3 px-6 py-8">
        <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20 rotate-3 hover:rotate-0 transition-transform duration-300">
          <Sprout className="text-white w-7 h-7" />
        </div>
        <div>
          <h1 className="font-bold text-xl text-foreground tracking-tight">
            Mind<span className="text-primary">Garden</span>
          </h1>
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">
            Personal Wellness
          </p>
        </div>
        {onClose && (
           <Button variant="ghost" size="sm" onClick={onClose} className="lg:hidden ml-auto">
             <X className="w-5 h-5" />
           </Button>
        )}
      </div>

      {/* Profile Mini Card */}
      <div className="px-4 mb-6">
        <div className="bg-primary/5 rounded-2xl p-4 border border-primary/10 flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
            {user?.name?.charAt(0) || "U"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-foreground truncate">{user?.name || "User"}</p>
            <p className="text-[10px] text-muted-foreground truncate">{user?.email}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-2 overflow-y-auto custom-scrollbar">
        {navigation.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={onClose}
              className={cn(
                "group flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-semibold transition-all duration-300 relative overflow-hidden",
                isActive 
                  ? "bg-primary text-white shadow-lg shadow-primary/20" 
                  : "text-muted-foreground hover:bg-primary/10 hover:text-primary"
              )}
            >
              <div className="flex items-center space-x-3 relative z-10">
                <Icon className={cn("w-5 h-5", isActive ? "text-white" : "group-hover:scale-110 transition-transform")} />
                <span>{item.name}</span>
              </div>
              {isActive && (
                <motion.div layoutId="sidebar-active" className="relative z-10">
                  <ChevronRight className="w-4 h-4 text-white/70" />
                </motion.div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Logout Button */}
      <div className="p-4 mt-auto border-t border-border/50">
        <button
          onClick={handleLogout}
          className="flex items-center space-x-3 px-4 py-3 rounded-2xl text-sm font-bold text-destructive hover:bg-destructive/10 transition-all duration-300 w-full"
        >
          <LogOut className="w-5 h-5" />
          <span>Keluar</span>
        </button>
      </div>
    </div>
  );
}
