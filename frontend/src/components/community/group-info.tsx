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
} from "lucide-react";
import { Button } from "../ui/button";
import { SupportGroup, SupportGroupMember } from "@/types/community";
import { toast } from "sonner";
import { useAuthStore } from "@/store/auth-store";
import { communityAPI } from "@/lib/community-api";

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

  // fetch Member
  const fetchMembers = async () => {
    try {
      setLoading(true); // Mulai loading
      const res = await communityAPI.getGroupMembers(group.id);

      // LOG DEBUG: Cek response di console browser jika masih error
      // console.log("Response Members:", res.data);

      if (res.data.success) {
        // Pastikan akses data sesuai struktur response backend
        const memberList = res.data.data.members || [];
        setMembers(memberList);

        // Cek admin status
        const myMembership = memberList.find(
          (m) => m.userId === currentUser?.id
        );
        setIsAdmin(myMembership?.role === "admin");
      }
    } catch (error) {
      console.error("Gagal memuat anggota grup: ", error);
      toast.error("Gagal memuat info grup");
    } finally {
      setLoading(false); // Stop loading apapun yang terjadi
    }
  };

  useEffect(() => {
    if (group?.id) {
      // Pastikan group ID ada sebelum fetch
      fetchMembers();
    }
  }, [group.id]);

  // Aksi promosi
  const handlePromote = async (userId: string) => {
    try {
      await communityAPI.promoteMember(group.id, userId);
      toast.success("Berhasil menjadi admin");
      fetchMembers(); // Refresh list
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Gagal mempromosikan anggota"
      );
    }
  };

  // aksi hapus (kick)
  const handleKick = async (userId: string) => {
    if (!confirm("Yakin ingin mengeluarkan anggota ini?")) return;
    try {
      await communityAPI.removeMember(group.id, userId);
      toast.success("Anggota berhasil dikeluarkan");
      fetchMembers(); // Refresh list
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Gagal mengeluarkan anggota"
      );
    }
  };

  // aksi keluar grup (leave)
  const handleLeave = async () => {
    if (!confirm("Yakin ingin keluar dari grup ini?")) return;

    try {
      await communityAPI.leaveSupportGroup(group.id);
      toast.success("Berhasil keluar dari grup");
      onLeaveGroup(); // Callback ke parent
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Gagal keluar dari grup");
    }
  };

  return (
    <div className="w-full md:w-[350px] bg-white border-l h-full flex flex-col animate-in slide-in-from-right duration-300 absolute right-0 top-0 z-30 shadow-xl">
      {/* Header */}
      <div className="flex items-center p-4 bg-gray-50 border-b shrink-0">
        <Button variant={"ghost"} size="sm" onClick={onClose} className="mr-2">
          <X className="w-5 h-5" />
        </Button>
        <h2 className="font-semibold text-gray-800">Info Grup</h2>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Profile grup */}
        <div className="p-6 flex flex-col items-center bg-white border-b mb-2">
          <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mb-4 text-gray-400">
            <Users className="w-12 h-12" />
          </div>
          <h3 className="text-xl font-bold text-center text-gray-900 px-2">
            {group.name}
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            Group • {members.length} Anggota
          </p>
          <p className="text-sm text-center text-gray-600 mt-4 px-4 line-clamp-3">
            {group.description || "Tidak ada deskripsi"}
          </p>
        </div>

        {/* List Member */}
        <div className="bg-white pb-4">
          <div className="p-4 pb-2 text-sm font-bold text-gray-500 bg-gray-50/50">
            {members.length} Anggota
          </div>
          <div className="px-2 pt-2">
            {loading ? (
              <div className="flex justify-center p-8">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-400"></div>
              </div>
            ) : members.length === 0 ? (
              <p className="text-center text-gray-500 p-4 text-sm">
                Tidak ada anggota.
              </p>
            ) : (
              members.map((member) => {
                const isMe = member.userId === currentUser?.id;
                const memberIsAdmin = member.role === "admin";

                return (
                  <div
                    key={member.id}
                    className="group flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <div className="flex items-center gap-3 overflow-hidden flex-1">
                      <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center shrink-0 border border-gray-200">
                        <User className="w-5 h-5 text-gray-500" />
                      </div>
                      <div className="truncate flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {isMe ? "Anda" : member.user?.name || "Pengguna"}
                        </p>
                        {memberIsAdmin && (
                          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-green-100 text-green-800 mt-0.5 border border-green-200">
                            Admin Grup
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Admin Action Buttons */}
                    {isAdmin && !isMe && (
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity focus-within:opacity-100">
                        {!memberIsAdmin && (
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => handlePromote(member.userId)}
                            title="Jadikan Admin"
                            className="h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-50"
                          >
                            <ShieldCheck className="w-4 h-4" />
                          </Button>
                        )}
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 text-red-400 hover:text-red-600 hover:bg-red-50"
                          title="Keluarkan dari Grup"
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

        {/* Exit Button */}
        <div className="p-4 mt-4 border-t bg-white pb-8 sticky bottom-0">
          <Button
            variant="destructive"
            className="w-full flex items-center justify-center gap-2 bg-red-50 text-red-600 hover:bg-red-100 border border-red-100 shadow-sm transition-colors"
            onClick={handleLeave}
          >
            <LogOut className="w-4 h-4" />
            Keluar dari Grup
          </Button>
        </div>
      </div>
    </div>
  );
}
