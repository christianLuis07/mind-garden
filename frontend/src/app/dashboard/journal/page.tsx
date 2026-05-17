"use client";

import { useState } from "react";
import { JournalList } from "@/components/journal/journal-list";
import { JournalEditor } from "@/components/journal/journal-editor";
import { JournalDetail } from "@/components/journal/journal-detail";
import { JournalAnalyticsComponent } from "@/components/journal/journal-analytics";
import { JournalEntry } from "@/types/journal";
import { Feather, BarChart3, List, Users, PenTool, Scroll, Book } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { ProtectedRoute } from "@/components/layout/protected-route";

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
    setCurrentView(previousView === "community" ? "community" : "list");
    setEditingEntry(null);
  };

  const handleBackToList = () => {
    setCurrentView(previousView === "community" ? "community" : "list");
    setSelectedEntry(null);
  };

  const navigationItems = [
    { id: "list" as ViewMode, label: "Buku Jurnal", icon: Book },
    { id: "analytics" as ViewMode, label: "Analisis", icon: BarChart3 },
    { id: "community" as ViewMode, label: "Cerita Publik", icon: Users },
  ];

  return (
    <ProtectedRoute>
      <div className="space-y-10 pb-20">
        {/* Creative Header */}
        <div className="relative overflow-hidden rounded-[3rem] bg-primary/10 p-8 md:p-12">
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-primary/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
          
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
            <div className="max-w-2xl">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="inline-flex items-center space-x-2 bg-white/50 dark:bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 mb-6"
              >
                <Feather className="w-4 h-4 text-primary" />
                <span className="text-xs font-bold uppercase tracking-widest text-primary">Ruang Cerita</span>
              </motion.div>
              
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-4xl md:text-5xl font-extrabold text-foreground tracking-tight mb-4"
              >
                Tulis Apa yang <span className="text-primary italic">Kamu Pikirkan</span>
              </motion.h1>
              
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-lg text-muted-foreground font-medium leading-relaxed"
              >
                Tuliskan segalanya di sini. Jadikan jurnal ini ruang aman bagimu untuk bercerita tanpa perlu merasa takut dihakimi.
              </motion.p>
            </div>

            <motion.div
               initial={{ opacity: 0, x: 20 }}
               animate={{ opacity: 1, x: 0 }}
               transition={{ delay: 0.3 }}
            >
               {(currentView === "list" || currentView === "community") && (
                 <Button
                   onClick={handleNewEntry}
                   className="h-16 px-8 rounded-2xl bg-primary hover:bg-primary/90 text-white font-bold text-lg shadow-xl shadow-primary/20 group"
                 >
                   <PenTool className="w-5 h-5 mr-3 group-hover:rotate-12 transition-transform" />
                   Mulai Menulis
                 </Button>
               )}
            </motion.div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <AnimatePresence mode="wait">
          {currentView !== "editor" && currentView !== "detail" && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex w-full md:w-fit bg-card/50 backdrop-blur-md p-1.5 rounded-[2rem] shadow-xl shadow-primary/5 mx-auto md:mx-0 border border-border/40"
            >
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentView === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setCurrentView(item.id)}
                    className={`flex items-center space-x-2 px-6 py-3 rounded-full transition-all duration-500 text-sm font-bold uppercase tracking-widest relative ${
                      isActive
                        ? "text-white"
                        : "text-muted-foreground hover:text-primary"
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="active-tab"
                        className="absolute inset-0 bg-primary rounded-full shadow-lg shadow-primary/20"
                        transition={{ type: "spring", duration: 0.6 }}
                      />
                    )}
                    <Icon className="w-4 h-4 relative z-10" />
                    <span className="relative z-10">{item.label}</span>
                  </button>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Content Area */}
        <motion.div 
           key={currentView}
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.5 }}
           className="space-y-8"
        >
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
        </motion.div>
      </div>
    </ProtectedRoute>
  );
}
