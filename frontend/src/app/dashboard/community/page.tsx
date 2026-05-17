"use client";

import { useState } from "react";
import { GroupsList } from "@/components/community/groups-list";
import { GroupChat } from "@/components/community/group-chat";
import { SupportGroup } from "@/types/community";
import { Users, MessageCircle, Heart, Sparkles, Compass, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ProtectedRoute } from "@/components/layout/protected-route";
import { cn } from "@/lib/utils";

type ViewMode = "list" | "chat";

export default function CommunityPage() {
  const [currentView, setCurrentView] = useState<ViewMode>("list");
  const [selectedGroup, setSelectedGroup] = useState<SupportGroup | null>(null);

  const [stats, setStats] = useState({
    totalGroups: 0,
    totalMembers: 0,
  });

  const handleViewGroup = (group: SupportGroup) => {
    setSelectedGroup(group);
    setCurrentView("chat");
  };

  const handleBackToList = () => {
    setCurrentView("list");
    setSelectedGroup(null);
  };

  const handleStatsUpdate = (newStats: {
    totalGroups: number;
    totalMembers: number;
  }) => {
    setStats(newStats);
  };

  return (
    <ProtectedRoute>
      <div className={currentView === "chat" ? "h-[calc(100vh-100px)]" : "space-y-10 pb-20"}>
        {/* Header - Sage Serenity Theme */}
        {currentView === "list" && (
          <div className="relative overflow-hidden rounded-[3rem] bg-primary/10 p-8 md:p-12 border border-primary/5">
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-primary/20 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 bg-secondary/30 rounded-full blur-3xl animate-pulse delay-1000" />
            
            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
              <div className="max-w-2xl">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="inline-flex items-center space-x-2 bg-white/50 dark:bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 mb-6"
                >
                  <Compass className="w-4 h-4 text-primary" />
                  <span className="text-xs font-bold uppercase tracking-widest text-primary">Komunitas Cerita</span>
                </motion.div>
                
                <motion.h1 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-4xl md:text-5xl font-extrabold text-foreground tracking-tight mb-4"
                >
                  Kamu Tidak <span className="text-primary italic">Berjuang Sendiri</span>
                </motion.h1>
                
                <motion.p 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-lg text-muted-foreground font-medium leading-relaxed"
                >
                  Temukan teman yang mengerti perasaanmu. Di sini, kamu bisa berbagi cerita, saling menguatkan, dan tumbuh bersama dalam ruang yang aman.
                </motion.p>
              </div>

              {/* Dynamic Stats - Glassmorphism */}
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="grid grid-cols-2 gap-4"
              >
                 <div className="bg-white/40 backdrop-blur-md p-6 rounded-3xl border border-white/40 shadow-xl shadow-primary/5 min-w-[140px]">
                    <div className="text-2xl font-black text-primary">{stats.totalMembers || "..."}</div>
                    <div className="text-[10px] font-bold uppercase tracking-widest text-primary/60">Anggota</div>
                 </div>
                 <div className="bg-white/40 backdrop-blur-md p-6 rounded-3xl border border-white/40 shadow-xl shadow-primary/5 min-w-[140px]">
                    <div className="text-2xl font-black text-primary">{stats.totalGroups || "..."}</div>
                    <div className="text-[10px] font-bold uppercase tracking-widest text-primary/60">Ruang Cerita</div>
                 </div>
              </motion.div>
            </div>
          </div>
        )}

        {/* Content Area */}
        <div className="h-full">
          {currentView === "list" && (
            <div className="space-y-12">
               <GroupsList
                 onSelectGroup={handleViewGroup}
                 onStatsUpdate={handleStatsUpdate}
               />

               {/* Community Guidelines */}
               <div className="glass-card rounded-[3rem] p-10 border-none shadow-2xl shadow-primary/5">
                 <div className="flex items-center space-x-3 mb-8">
                    <div className="w-1.5 h-8 bg-primary rounded-full" />
                    <h2 className="text-2xl font-bold text-foreground tracking-tight">Aturan Berteman</h2>
                 </div>
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                   {[
                     { title: "Jaga Privasi", desc: "Setiap cerita adalah rahasia bersama. Jangan sebar ceritamu atau temanmu ke luar sini.", icon: ShieldCheck },
                     { title: "Penuh Empati", desc: "Dukung temanmu tanpa menghakimi. Gunakan kata-kata yang menenangkan hati.", icon: Heart },
                     { title: "Saling Menjaga", desc: "Laporkan hal-hal yang membuatmu atau komunitas merasa tidak nyaman.", icon: Sparkles }
                   ].map((item, i) => (
                     <div key={i} className="space-y-3">
                        <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                           <item.icon className="w-6 h-6" />
                        </div>
                        <h4 className="font-bold text-foreground">{item.title}</h4>
                        <p className="text-sm text-muted-foreground leading-relaxed italic">&quot;{item.desc}&quot;</p>
                     </div>
                   ))}
                 </div>
               </div>
            </div>
          )}

          {currentView === "chat" && selectedGroup && (
            <motion.div 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               className="h-full"
            >
               <GroupChat group={selectedGroup} onBack={handleBackToList} />
            </motion.div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
