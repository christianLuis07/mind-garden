"use client";

import { useEffect, useState } from "react";
import {
  Users,
  Search,
  Plus,
  ArrowRight,
  Globe,
  Lock,
  UserCheck,
  Compass,
  MessageSquare,
  House,
  Trees,
  Flower2,
  Tent,
} from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { communityAPI } from "@/lib/community-api";
import { SupportGroup } from "@/types/community";
import { CreateGroupForm } from "./create-group-form";
import { formatDistanceToNow } from "date-fns";
import { id } from "date-fns/locale";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface GroupsListProps {
  onSelectGroup: (group: SupportGroup) => void;
  onStatsUpdate?: (stats: {
    totalGroups: number;
    totalMembers: number;
  }) => void;
}

const groupPatterns = [
  { bg: "bg-primary/5", icon: Trees, color: "text-primary" },
  { bg: "bg-secondary/10", icon: Tent, color: "text-primary/70" },
  { bg: "bg-primary/10", icon: Flower2, color: "text-primary" },
  { bg: "bg-muted/40", icon: House, color: "text-primary/60" },
];

export function GroupsList({ onSelectGroup, onStatsUpdate }: GroupsListProps) {
  const [groups, setGroups] = useState<SupportGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);

  const fetchGroups = async () => {
    try {
      setLoading(true);
      const response = await communityAPI.getSupportGroups({
        search: searchQuery || undefined,
        limit: 100,
      });
      if (response.data.success) {
        const fetchedGroups = response.data.data.groups;
        setGroups(fetchedGroups);
        if (onStatsUpdate) {
          const totalMembers = fetchedGroups.reduce((acc, curr) => acc + (curr.memberCount || curr._count?.members || 0), 0);
          onStatsUpdate({
            totalGroups: response.data.data.pagination.total || fetchedGroups.length,
            totalMembers,
          });
        }
      }
    } catch (error) {
      toast.error("Gagal memuat daftar komunitas");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => fetchGroups(), 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleCreateSuccess = (newGroup: SupportGroup) => {
    setShowCreateForm(false);
    toast.success("Komunitas Berhasil Dibuat");
    fetchGroups();
  };

  const handleJoinGroup = async (e: React.MouseEvent, groupId: string) => {
    e.stopPropagation();
    try {
      await communityAPI.joinSupportGroup(groupId);
      toast.success("Selamat Bergabung!");
      fetchGroups();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Gagal bergabung");
    }
  };

  if (showCreateForm) {
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <CreateGroupForm onCancel={() => setShowCreateForm(false)} onSuccess={handleCreateSuccess} />
      </motion.div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Search & Action Bar */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4 group-focus-within:text-primary transition-colors" />
          <Input
            placeholder="Cari komunitas untukmu..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 h-14 bg-card/50 border-none rounded-2xl shadow-xl shadow-primary/5 focus:ring-2 focus:ring-primary/20 transition-all"
          />
        </div>
        <Button
          onClick={() => setShowCreateForm(true)}
          className="h-14 px-8 rounded-2xl bg-primary hover:bg-primary/90 text-white font-bold shadow-xl shadow-primary/20 group"
        >
          <Plus className="w-5 h-5 mr-3 group-hover:rotate-90 transition-transform duration-300" />
          Buat Komunitas
        </Button>
      </div>

      {loading && groups.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
          <p className="text-muted-foreground font-medium animate-pulse italic">Mencari teman cerita...</p>
        </div>
      ) : groups.length === 0 ? (
        <div className="glass-card rounded-[3rem] p-20 text-center border-none shadow-xl shadow-primary/5">
           <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-8">
              <Compass className="w-10 h-10 text-muted-foreground/30" />
           </div>
           <h3 className="text-2xl font-bold text-foreground mb-3">Belum Ada Komunitas</h3>
           <p className="text-muted-foreground max-w-sm mx-auto mb-8 font-medium leading-relaxed italic">
             {searchQuery ? "Tidak ada grup yang sesuai dengan pencarianmu." : "Jadilah penggerak pertama dan bangun komunitas pendukungmu sendiri di sini."}
           </p>
           <Button onClick={() => setShowCreateForm(true)} className="h-14 px-8 rounded-2xl bg-primary text-white font-bold">
              Buat Komunitas Pertama
           </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {groups.map((group, index) => {
            const pattern = groupPatterns[index % groupPatterns.length];
            const PatternIcon = pattern.icon;

            return (
              <motion.div
                key={group.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="group relative flex flex-col bg-card rounded-[2.5rem] overflow-hidden shadow-xl shadow-primary/5 hover:shadow-2xl transition-all duration-500 border border-border/20 cursor-pointer"
                onClick={() => onSelectGroup(group)}
              >
                {/* Decorative Background Icon */}
                <div className={`absolute top-[-20px] right-[-20px] w-40 h-40 ${pattern.color} opacity-5 group-hover:scale-125 transition-transform duration-700`}>
                   <PatternIcon className="w-full h-full rotate-12" />
                </div>

                <div className="p-8 flex flex-col h-full relative z-10">
                  <div className="flex items-center justify-between mb-6">
                    <div className={cn("p-3 rounded-2xl", pattern.bg, pattern.color)}>
                       {group.isPublic ? <Globe className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
                    </div>
                    {group.isMember && (
                      <div className="px-3 py-1 bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest rounded-full border border-primary/20">
                        Sudah Bergabung
                      </div>
                    )}
                  </div>

                  <h3 className="text-xl font-bold text-foreground mb-3 line-clamp-1 group-hover:text-primary transition-colors tracking-tight">
                    {group.name}
                  </h3>
                  
                  <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2 h-10 mb-8 italic">
                    &quot;{group.description || "Komunitas hangat untuk berbagi cerita dan saling menguatkan."}&quot;
                  </p>

                  <div className="mt-auto pt-6 border-t border-border/50 flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                       <div className="flex items-center text-xs font-bold text-muted-foreground uppercase tracking-widest gap-1.5">
                          <Users className="w-3.5 h-3.5 text-primary" />
                          <span>{group.memberCount || group._count?.members || 0} Anggota</span>
                       </div>
                    </div>

                    {!group.isMember && group.isPublic && (
                      <Button
                        size="icon"
                        variant="outline"
                        className="w-10 h-10 rounded-xl border-primary/20 text-primary hover:bg-primary hover:text-white transition-all shadow-lg shadow-primary/5"
                        onClick={(e) => handleJoinGroup(e, group.id)}
                      >
                        <UserCheck className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                  
                  <div className="mt-4 flex items-center gap-2 text-[10px] font-bold text-muted-foreground/40 uppercase tracking-widest">
                     <span>Dibuat {formatDistanceToNow(new Date(group.createdAt), { addSuffix: true, locale: id })}</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
