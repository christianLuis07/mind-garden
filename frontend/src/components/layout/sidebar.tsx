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
} from "lucide-react";
import { useAuthStore } from "@/store/auth-store";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";

interface SidebarProps {
  onClose?: () => void;
}

const navigation = [
  { name: "Beranda", href: "/dashboard", icon: LayoutDashboard },
  { name: "Pantau Mood", href: "/dashboard/mood", icon: Smile },
  { name: "Jurnal", href: "/dashboard/journal", icon: BookOpen },
  { name: "Latihan Nafas", href: "/dashboard/breathing", icon: Wind },
  { name: "Dukungan", href: "/dashboard/community", icon: Users },
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
    <div className="flex flex-col w-64 bg-white border-r border-gray-200 h-full">
      {/* Mobile Close Button */}
      <div className="lg:hidden flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-linear-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-sm">MG</span>
          </div>
          <div>
            <h1 className="font-bold text-gray-900">MindGarden</h1>
            <p className="text-xs text-gray-500">
              Hello, {user?.name || "User"}!
            </p>
          </div>
        </div>
        <Button variant="ghost" size="sm" onClick={onClose} className="p-1">
          <X className="w-5 h-5" />
        </Button>
      </div>

      {/* Desktop Logo (hidden on mobile) */}
      {/* Logo */}
      <div className="hidden lg:flex items-center space-x-3 px-6 py-4 border-b border-gray-200">
        <div className="w-8 h-8 bg-linear-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
          <span className="text-white font-bold text-sm">MG</span>
        </div>
        <div>
          <h1 className="font-bold text-gray-900">MindGarden</h1>
          <p className="text-xs text-gray-500">Halo, {user?.name}</p>
        </div>
      </div>
      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navigation.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
              )}
            >
              <Icon className="w-5 h-5" />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={handleLogout}
          className="flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 w-full transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span>Log Out</span>
        </button>
      </div>
    </div>
  );
}
