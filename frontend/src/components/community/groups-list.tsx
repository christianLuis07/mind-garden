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
} from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Card, CardContent } from "../ui/card";
import { communityAPI } from "@/lib/community-api";
import { SupportGroup } from "@/types/community";
import { CreateGroupForm } from "./create-group-form";
import { formatDistanceToNow } from "date-fns";
import { id } from "date-fns/locale";
import { toast } from "sonner";

interface GroupsListProps {
  onSelectGroup: (group: SupportGroup) => void;
}

export function GroupsList({ onSelectGroup }: GroupsListProps) {
  const [groups, setGroups] = useState<SupportGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);

  // Fungsi untuk mengambil data grup dari API
  const fetchGroups = async () => {
    try {
      setLoading(true);
      const response = await communityAPI.getSupportGroups({
        search: searchQuery || undefined,
        limit: 20, // Batasi 20 grup agar tidak terlalu berat
      });
      if (response.data.success) {
        setGroups(response.data.data.groups);
      }
    } catch (error) {
      console.error("Gagal memuat Groups: ", error);
      toast.error("Gagal memuat daftar komunitas");
    } finally {
      setLoading(false);
    }
  };

  // Efek untuk memanggil fetchGroups saat searchQuery berubah (dengan debounce)
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchGroups();
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Handler saat grup berhasil dibuat
  const handleCreateSuccess = (newGroup: SupportGroup) => {
    setShowCreateForm(false);
    setGroups((prev) => [newGroup, ...prev]); // Masukkan grup baru ke paling atas
    toast.success("Grup berhasil dibuat!");
  };

  // Handler untuk Quick Join (Opsional)
  const handleJoinGroup = async (e: React.MouseEvent, groupId: string) => {
    e.stopPropagation(); // Mencegah card diklik
    try {
      await communityAPI.joinSupportGroup(groupId);
      toast.success("Berhasil bergabung!");
      fetchGroups(); // Refresh status member
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Gagal bergabung");
    }
  };

  // Tampilkan Form Buat Grup jika state true
  if (showCreateForm) {
    return (
      <CreateGroupForm
        onCancel={() => setShowCreateForm(false)}
        onSuccess={handleCreateSuccess}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header & Search */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Grup Dukungan Komunitas
          </h2>
          <p className="text-gray-600 mt-1">
            Temukan dukungan dan berbagi dengan orang lain
          </p>
        </div>
        <Button
          onClick={() => setShowCreateForm(true)}
          className="bg-green-600 hover:bg-green-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Buat Grup Baru
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          placeholder="Cari grup dukungan..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Grid Groups */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
        </div>
      ) : groups.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="p-8 text-center">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Belum ada Grup
            </h3>
            <p className="text-gray-600 mb-4">
              {searchQuery
                ? "Tidak ada grup yang sesuai dengan pencarianmu"
                : "Jadilah yang pertama membuat grup dukungan"}
            </p>
            <Button
              onClick={() => setShowCreateForm(true)}
              variant="outline"
              className="mt-2"
            >
              <Plus className="w-4 h-4 mr-2" />
              Buat Grup Pertama
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {groups.map((group) => (
            <Card
              key={group.id}
              className="hover:shadow-lg transition-all cursor-pointer group border-gray-200"
              onClick={() => onSelectGroup(group)}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div
                    className={`p-2 rounded-lg ${
                      group.isPublic
                        ? "bg-green-50 text-green-600"
                        : "bg-orange-50 text-orange-600"
                    }`}
                  >
                    {group.isPublic ? (
                      <Globe className="w-5 h-5" />
                    ) : (
                      <Lock className="w-5 h-5" />
                    )}
                  </div>
                  {group.isMember && (
                    <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-medium">
                      Member
                    </span>
                  )}
                </div>

                <h3 className="font-bold text-gray-900 text-lg mb-2 line-clamp-1 group-hover:text-green-600 transition-colors">
                  {group.name}
                </h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2 h-10 leading-relaxed">
                  {group.description || "Tidak ada deskripsi"}
                </p>

                <div className="flex items-center justify-between text-sm text-gray-500 pt-4 border-t border-gray-100">
                  <div className="flex items-center space-x-1">
                    <Users className="w-4 h-4" />
                    <span>
                      {group.memberCount || group._count?.members || 0} Anggota
                    </span>
                  </div>
                  <span>
                    {formatDistanceToNow(new Date(group.createdAt), {
                      addSuffix: true,
                      locale: id,
                    })}
                  </span>
                </div>

                <div className="mt-4 flex gap-2">
                  <Button
                    variant="ghost"
                    className="flex-1 justify-between group-hover:bg-green-50 text-gray-600 group-hover:text-green-700"
                  >
                    Lihat Detail <ArrowRight className="w-4 h-4" />
                  </Button>

                  {!group.isMember && group.isPublic && (
                    <Button
                      size="icon"
                      variant="outline"
                      className="shrink-0 text-green-600 hover:bg-green-600 hover:text-white"
                      onClick={(e) => handleJoinGroup(e, group.id)}
                      title="Gabung Cepat"
                    >
                      <UserCheck className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
