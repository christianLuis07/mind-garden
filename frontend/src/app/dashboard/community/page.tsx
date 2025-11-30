// src/app/community/page.tsx
"use client";

import { useState } from "react";
import { GroupsList } from "@/components/community/groups-list";
import { GroupChat } from "@/components/community/group-chat";
import { CreateGroupForm } from "@/components/community/create-group-form";
import { SupportGroup } from "@/types/community";
import { Users, MessageCircle, Users2 } from "lucide-react";

type ViewMode = "list" | "chat" | "create";

export default function CommunityPage() {
  const [currentView, setCurrentView] = useState<ViewMode>("list");
  const [selectedGroup, setSelectedGroup] = useState<SupportGroup | null>(null);

  const handleViewGroup = (group: SupportGroup) => {
    setSelectedGroup(group);
    setCurrentView("chat");
  };

  const handleCreateGroup = () => {
    setCurrentView("create");
  };

  const handleBackToList = () => {
    setCurrentView("list");
    setSelectedGroup(null);
  };

  const handleCreateSuccess = () => {
    setCurrentView("list");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div className="flex items-center space-x-4 mb-4 lg:mb-0">
            <div className="p-3 bg-purple-100 rounded-2xl">
              <Users2 className="w-8 h-8 text-purple-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Komunitas MindGarden
              </h1>
              <p className="text-gray-600 mt-1">
                Temukan dukungan dan berbagi dengan orang yang memahami
              </p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Users className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">50+</p>
                <p className="text-sm text-gray-600">Anggota Komunitas</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <MessageCircle className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">12</p>
                <p className="text-sm text-gray-600">Grup Dukungan</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Users2 className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">24/7</p>
                <p className="text-sm text-gray-600">Dukungan Tersedia</p>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-6">
          {currentView === "list" && (
            <GroupsList
              onCreateGroup={handleCreateGroup}
              onViewGroup={handleViewGroup}
            />
          )}

          {currentView === "chat" && selectedGroup && (
            <GroupChat group={selectedGroup} onBack={handleBackToList} />
          )}

          {currentView === "create" && (
            <CreateGroupForm
              onSuccess={handleCreateSuccess}
              onCancel={handleBackToList}
            />
          )}
        </div>

        {/* Community Guidelines */}
        {currentView === "list" && (
          <div className="mt-12 bg-blue-50 border border-blue-200 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-3">
              📝 Pedoman Komunitas
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
              <div className="space-y-2">
                <p>
                  • <strong>Hormati Privacy</strong> - Jaga kerahasiaan cerita
                  anggota
                </p>
                <p>
                  • <strong>Dukung, Jangan Menghakimi</strong> - Berikan empati,
                  bukan kritik
                </p>
                <p>
                  • <strong>Berbagi Pengalaman</strong> - Ceritakan perjalananmu
                  untuk menginspirasi
                </p>
              </div>
              <div className="space-y-2">
                <p>
                  • <strong>Laporkan Konten Tidak Pantas</strong> - Bantu jaga
                  keamanan komunitas
                </p>
                <p>
                  • <strong>Jangan Berikan Saran Medis</strong> - Arahkan ke
                  profesional jika perlu
                </p>
                <p>
                  • <strong>Jadilah Diri Sendiri</strong> - Semua perasaan valid
                  dan diterima
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
