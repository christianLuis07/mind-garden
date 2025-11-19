"use client";

import { useState } from "react";
import { ProtectedRoute } from "@/components/layout/protected-route";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { MoodInputForm } from "@/components/mood/mood-input-form";
import { MoodHistory } from "@/components/mood/mood-history";
import { MoodAnalytics } from "@/components/mood/mood-analytics";
import { MoodCalendar } from "@/components/mood/mood-calendar";

export default function MoodPage() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleMoodLogged = () => {
    setRefreshTrigger((prev) => prev + 1);

    setTimeout(() => {
      setRefreshTrigger((prev) => prev + 1);
    }, 500);
  };

  return (
    <ProtectedRoute>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Tracking Mood 🌈
          </h1>
          <p className="text-gray-600">
            Lacak mood harianmu, pahami polanya, dan dapatkan wawasan tentang
            kesejahteraan emosionalmu.
          </p>
        </div>

        {/* Mood Input & Calendar */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <MoodInputForm onSuccess={handleMoodLogged} />
          <MoodCalendar />
        </div>

        {/* Analytics */}
        <MoodAnalytics />

        {/* History */}
        <MoodHistory refreshTrigger={refreshTrigger} />
      </div>
    </ProtectedRoute>
  );
}
