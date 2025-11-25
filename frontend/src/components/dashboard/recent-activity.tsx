import { format } from "date-fns";
import { id } from "date-fns/locale";
import {
  Smile,
  BookOpen,
  Wind,
  Users,
  Activity as ActivityIcon,
} from "lucide-react";

export interface Activity {
  id: string;
  type: "mood" | "journal" | "breathing" | "support" | "unknown";
  title: string;
  description: string;
  timestamp: string;
  value?: number;
}

interface RecentActivityProps {
  activities?: Activity[];
  isLoading?: boolean;
}

const typeIcons = {
  mood: Smile,
  journal: BookOpen,
  breathing: Wind,
  support: Users,
  unknown: ActivityIcon,
};

const typeColors = {
  mood: "bg-green-100 text-green-600",
  journal: "bg-blue-100 text-blue-600",
  breathing: "bg-purple-100 text-purple-600",
  support: "bg-orange-100 text-orange-600",
  unknown: "bg-gray-100 text-gray-600",
};

export function RecentActivity({
  activities = [],
  isLoading = false,
}: RecentActivityProps) {
  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 h-full">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">
          Aktivitas Terbaru
        </h2>
        <div className="space-y-4 animate-pulse">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="flex items-start space-x-4 p-4 rounded-xl bg-gray-50"
            >
              <div className="w-10 h-10 rounded-lg bg-gray-200"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 h-full">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">
        Aktivitas Terbaru
      </h2>

      <div className="space-y-4">
        {activities.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            Belum ada aktivitas tercatat. Mulai perjalananmu hari ini!
          </div>
        ) : (
          activities.map((activity) => {
            const Icon = typeIcons[activity.type] || ActivityIcon;
            return (
              <div
                key={activity.id}
                className="flex items-start space-x-4 p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg ${
                    typeColors[activity.type] || typeColors.unknown
                  }`}
                >
                  <Icon className="w-6 h-6" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-medium text-gray-900">
                      {activity.title}
                    </h3>
                    <span className="text-xs text-gray-500">
                      {format(new Date(activity.timestamp), "d MMM, HH:mm", {
                        locale: id,
                      })}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {activity.description}
                  </p>
                  {activity.value && (
                    <div className="flex items-center space-x-2 mt-2">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <span
                            key={i}
                            className={`text-sm ${
                              i < activity.value!
                                ? "text-yellow-400"
                                : "text-gray-300"
                            }`}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
