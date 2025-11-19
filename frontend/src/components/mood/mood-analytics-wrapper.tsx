"use client";

import dynamic from "next/dynamic";
import { Spinner } from "@/components/ui/spinner";

// Disable SSR untuk komponen analytics
const MoodAnalytics = dynamic(
  () =>
    import("./mood-analytics").then((mod) => ({ default: mod.MoodAnalytics })),
  {
    ssr: false,
    loading: () => (
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-center h-64">
          <Spinner />
        </div>
      </div>
    ),
  }
);

export { MoodAnalytics };
