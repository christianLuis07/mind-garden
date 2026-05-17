"use client";

import { useEffect, useState } from "react";
import {
  X,
  Users,
  Shield,
  LogOut,
  Trash2,
  ShieldCheck,
  User,
  Info,
} from "lucide-react";
import { Button } from "../ui/button";
import { SupportGroup, SupportGroupMember } from "@/types/community";
import { toast } from "sonner";
import { useAuthStore } from "@/store/auth-store";
import { communityAPI } from "@/lib/community-api";
import { Spinner } from "../ui/spinner";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface GroupInfoProps {
  group: SupportGroup;
  onClose: () => void;
  onLeaveGroup: () => void;
}

export function GroupInfo({ group, onClose, onLeaveGroup }: GroupInfoProps) {
  const { user: currentUser } = useAuthStore();
  const [members, setMembers] = useState<SupportGroupMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const res = await communityAPI.getGroupMembers(group.id);
      if (res.data.success) {
        const memberList = res.data.data.members || [];
        setMembers(memberList);
        const myMembership = memberList.find(
          (m) => m.userId === currentUser?.id
        );
        setIsAdmin(myMembership?.role === "admin");
      }
    } catch (error) {
      toast.error("Gagal memuat info komunitas");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (group?.id) {
      fetchMembers();
    }
  }, [group.id]);

  const handlePromote = async (userId: string) => {
    try {
      await communityAPI.promoteMember(group.id, userId);
      toast.success("Berhasil diangkat menjadi penjaga ruang");
      fetchMembers();
    } catch (error: any) {
      toast.error("Gagal mempromosikan teman");
    }
  };

  const handleKick = async (userId: string) => {
    if (!confirm("Kamu yakin ingin mengeluarkan teman ini dari ruang cerita?")) return;
    try {
      await communityAPI.removeMember(group.id, userId);
      toast.success("Teman telah dikeluarkan dari ruang");
      fetchMembers();
    } catch (error: any) {
      toast.error("Gagal mengeluarkan teman");
    }
  };

  const handleLeave = async () => {
    if (!confirm("Kamu yakin ingin meninggalkan ruang cerita ini?")) return;

    try {
      await communityAPI.leaveSupportGroup(group.id);
      toast.success("Kamu telah meninggalkan ruang cerita");
      onLeaveGroup();
    } catch (error: any) {
      toast.error("Gagal meninggalkan ruang");
    }
  };

  return (
    <motion.div 
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      className="w-full md:w-[380px] bg-card/95 backdrop-blur-xl border-l border-border/40 h-full flex flex-col absolute right-0 top-0 z-30 shadow-2xl"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-border/40 shrink-0">
        <div className="flex items-center gap-3">
           <Info className="w-5 h-5 text-primary" />
           <h2 className="font-bold text-foreground">Tentang Ruang Ini</h2>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full hover:bg-primary/10">
          <X className="w-5 h-5" />
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {/* Group Profile */}
        <div className="p-8 flex flex-col items-center text-center space-y-4 border-b border-border/20">
          <div className="w-24 h-24 bg-primary/10 rounded-[2rem] flex items-center justify-center text-primary shadow-inner">
            <Users className="w-10 h-10" />
          </div>
          <div>
             <h3 className="text-xl font-bold text-foreground px-2 tracking-tight">
               {group.name}
             </h3>
             <p className="text-xs font-bold text-primary uppercase tracking-widest mt-1">
               {members.length} Teman Bergabung
             </p>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed italic px-4">
            &quot;{group.description || "Ruang cerita ini belum memiliki deskripsi."}&quot;
          </p>
        </div>

        {/* Members List */}
        <div className="pb-8">
          <div className="p-6 pb-2 text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">
            Daftar Teman
          </div>
          <div className="px-4 space-y-1">
            {loading ? (
              <div className="flex justify-center p-12">
                <Spinner className="w-6 h-6 text-primary" />
              </div>
            ) : members.length === 0 ? (
              <p className="text-center text-muted-foreground p-8 text-sm italic">
                Belum ada teman di sini.
              </p>
            ) : (
              members.map((member) => {
                const isMe = member.userId === currentUser?.id;
                const memberIsAdmin = member.role === "admin";

                return (
                  <div
                    key={member.id}
                    className="group flex items-center justify-between p-4 hover:bg-primary/5 rounded-2xl transition-all duration-300"
                  >
                    <div className="flex items-center gap-4 overflow-hidden flex-1">
                      <div className="w-10 h-10 bg-muted/50 rounded-xl flex items-center justify-center shrink-0 border border-border/40 font-bold text-primary">
                        {(member.user?.name || "P").charAt(0)}
                      </div>
                      <div className="truncate flex-1 min-w-0">
                        <p className={cn("text-sm font-bold truncate", isMe ? "text-primary" : "text-foreground")}>
                          {isMe ? "Kamu" : member.user?.name || "Teman Cerita"}
                        </p>
                        {memberIsAdmin && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-tighter bg-primary/10 text-primary border border-primary/20 mt-1">
                            Penjaga Ruang
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Admin Actions */}
                    {isAdmin && !isMe && (
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {!memberIsAdmin && (
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => handlePromote(member.userId)}
                            className="h-9 w-9 text-emerald-600 hover:bg-emerald-50 rounded-full"
                            title="Jadikan Penjaga"
                          >
                            <ShieldCheck className="w-4 h-4" />
                          </Button>
                        )}
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-9 w-9 text-rose-500 hover:bg-rose-50 rounded-full"
                          title="Keluarkan"
                          onClick={() => handleKick(member.userId)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="p-6 border-t border-border/40 bg-card">
        <Button
          variant="ghost"
          className="w-full h-14 rounded-2xl flex items-center justify-center gap-3 bg-rose-500/5 text-rose-500 hover:bg-rose-500/10 font-bold transition-all"
          onClick={handleLeave}
        >
          <LogOut className="w-5 h-5" />
          Tinggalkan Ruang Cerita
        </Button>
      </div>
    </motion.div>
  );
}
