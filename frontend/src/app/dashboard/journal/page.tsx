"use client";

import { useState } from "react";
import { JournalList } from "@/components/journal/journal-list";
import { JournalEditor } from "@/components/journal/journal-editor";
import { JournalDetail } from "@/components/journal/journal-detail";
import { JournalAnalyticsComponent } from "@/components/journal/journal-analytics";
import { JournalEntry } from "@/types/journal";
import { Book, BarChart3, Plus, List, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

type ViewMode = "list" | "editor" | "detail" | "analytics" | "community";

export default function JournalPage() {
  const [currentView, setCurrentView] = useState<ViewMode>("list");
  const [previousView, setPreviousView] = useState<ViewMode>("list");
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null);
  const [editingEntry, setEditingEntry] = useState<JournalEntry | null>(null);

  const handleNewEntry = () => {
    setEditingEntry(null);
    setPreviousView(currentView);
    setCurrentView("editor");
  };

  const handleEditEntry = (entry: JournalEntry) => {
    setEditingEntry(entry);
    setPreviousView(currentView);
    setCurrentView("editor");
  };

  const handleViewEntry = (entry: JournalEntry) => {
    setSelectedEntry(entry);
    setPreviousView(currentView);
    setCurrentView("detail");
  };

  const handleEditorSuccess = (entry: JournalEntry) => {
    setCurrentView("list");
    setEditingEntry(null);
  };

  const handleEditorCancel = () => {
    // Kembali ke view sebelumnya jika memungkinkan, atau default ke list
    setCurrentView(previousView === "community" ? "community" : "list");
    setEditingEntry(null);
  };

  const handleBackToList = () => {
    // Kembali ke list yang sesuai (Komunitas atau Jurnal Saya)
    setCurrentView(previousView === "community" ? "community" : "list");
    setSelectedEntry(null);
  };

  const navigationItems = [
    { id: "list" as ViewMode, label: "Jurnal Saya", icon: List },
    { id: "analytics" as ViewMode, label: "Analisis", icon: BarChart3 },
    { id: "community" as ViewMode, label: "Komunitas", icon: Users },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div className="flex items-center space-x-4 mb-4 lg:mb-0">
            <div className="p-3 bg-green-100 rounded-2xl">
              <Book className="w-8 h-8 text-green-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                MindGarden Jurnal
              </h1>
              <p className="text-gray-600 mt-1">
                Biarkan pikiranmu tumbuh dan berkembang dengan setiap tulisan.
              </p>
            </div>
          </div>

          {currentView === "list" && (
            <Button
              onClick={handleNewEntry}
              className="bg-green-600 hover:bg-green-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Entri Baru
            </Button>
          )}
        </div>

        {/* Navigation - Sembunyikan saat di mode Editor atau Detail */}
        {currentView !== "editor" && currentView !== "detail" && (
          <div className="flex w-full gap-1 sm:gap-3 flex-col sm:flex-row mb-4">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentView(item.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-colors flex-1 justify-center ${
                    currentView === item.id
                      ? "bg-green-600 text-white"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="font-medium">{item.label}</span>
                </button>
              );
            })}
          </div>
        )}

        <div className="space-y-6">
          {currentView === "list" && (
            <JournalList
              onEdit={handleEditEntry}
              onNewEntry={handleNewEntry}
              onView={handleViewEntry}
              showPublic={false}
            />
          )}

          {currentView === "community" && (
            <JournalList
              onEdit={handleEditEntry}
              onNewEntry={handleNewEntry}
              onView={handleViewEntry}
              showPublic={true}
            />
          )}

          {currentView === "editor" && (
            <JournalEditor
              entry={editingEntry || undefined}
              onSuccess={handleEditorSuccess}
              onCancel={handleEditorCancel}
            />
          )}

          {currentView === "detail" && selectedEntry && (
            <JournalDetail
              entryId={selectedEntry.id}
              onEdit={handleEditEntry}
              onBack={handleBackToList}
              showActions={previousView !== "community"}
            />
          )}

          {currentView === "analytics" && <JournalAnalyticsComponent />}
        </div>
      </div>
    </div>
  );
}
