"use client";

import { useState, useEffect } from "react";
import { Search, Users, Lock, Globe, Plus, UserCheck } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Card, CardContent } from "../ui/card";
import { communityAPI } from "@/lib/community-api";
import { SupportGroup } from "@/types/community";
import { formatDistanceToNow } from "date-fns";
import { id } from "date-fns/locale";

interface GroupsListProps {
  onCreateGroup: () => void;
  onViewGroup: (group: SupportGroup) => void;
}

export function GroupsList({ onCreateGroup, onViewGroup }: GroupsListProps) {
  const [groups, setGroups] = useState<SupportGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchGroups = async () => {
    try {
      setLoading(true);
      const response = await communityAPI.getSupportGroups({
        search: search || undefined,
      });
      if (response.data.success) {
        setGroups(response.data.data.groups);
      }
    } catch (error) {
      console.error("Gagal memuat Groups: ", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, [search]);

  const handleJoinGroup = async (groupId: string) => {
    try {
      await communityAPI.joinSupportGroup(groupId);
      fetchGroups();
    } catch (error) {
      console.error("gagal bergabung ke group", error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
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
          onClick={onCreateGroup}
          className="bg-green-600 hover:bg-green-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Buat Grup Baru
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          placeholder="Cari grup dukungan..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Groups grid */}
      {groups.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Belum ada Grup
            </h3>
            <p className="text-gray-600 mb-4">
              {search
                ? "Tidak ada grup yang sesuai dengan pencarianmu"
                : "Jadilah yang pertama membuat grup dukungan"}
            </p>
            <Button
              onClick={onCreateGroup}
              className="bg-green-600 hover:bg-green-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Buat Grup Pertama
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {groups.map((group) => (
            <Card key={group.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="font-semibold text-gray-900 text-lg">
                    {group.name}
                  </h3>
                  {group.isPublic ? (
                    <Globe className="w-5 h-5 text-green-600" />
                  ) : (
                    <Lock className="w-5 h-5 text-amber-600" />
                  )}
                </div>
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {group.description}
                </p>

                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <div className="flex items-center space-x-1">
                    <Users className="w-4 h-4" />
                    <span>
                      {group.memberCount || 0} / {group.maxMembers} anggota
                    </span>
                  </div>
                  <span>
                    {formatDistanceToNow(new Date(group.createdAt), {
                      addSuffix: true,
                      locale: id,
                    })}
                  </span>
                </div>

                <div className="flex space-x-2">
                  <Button
                    onClick={() => onViewGroup(group)}
                    variant="outline"
                    className="flex-1"
                  >
                    Lihat Grup
                  </Button>

                  {!group.isMember && group.isPublic && (
                    <Button
                      onClick={() => handleJoinGroup(group.id)}
                      className="bg-green-600 hover:bg-green-700"
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
