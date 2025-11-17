import { format } from "date-fns";
import { id } from "date-fns/locale";
import { Smile, BookOpen, Wind, Users } from "lucide-react";

interface Activity {
  id: string;
  type: "mood" | "journal" | "breathing" | "support";
  title: string;
  description: string;
  timestamp: string;
  value?: number;
}

const activities: Activity[] = [
  {
    id: "1",
    type: "mood",
    title: "Mood Dicatat",
    description: "Kamu melaporkan merasa baik hari ini",
    timestamp: new Date().toISOString(),
    value: 4,
  },
  {
    id: "2",
    type: "journal",
    title: "Entri Jurnal",
    description: "Kamu menuliskan refleksi mingguanmu",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "3",
    type: "breathing",
    title: "Sesi Pernapasan",
    description: "Kamu menyelesaikan latihan napas 5 menit",
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "4",
    type: "support",
    title: "Dukungan Komunitas",
    description: "Kamu bergabung dengan Grup Dukungan Kecemasan",
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

const typeIcons = {
  mood: Smile,
  journal: BookOpen,
  breathing: Wind,
  support: Users,
};

const typeColors = {
  mood: "bg-green-100 text-green-600",
  journal: "bg-blue-100 text-blue-600",
  breathing: "bg-purple-100 text-purple-600",
  support: "bg-orange-100 text-orange-600",
};

export function RecentActivity() {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">
        Aktivitas Terbaru
      </h2>

      <div className="space-y-4">
        {activities.map((activity) => {
          const Icon = typeIcons[activity.type];
          return (
            <div
              key={activity.id}
              className="flex items-start space-x-4 p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <div
                className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg ${
                  typeColors[activity.type]
                }`}
              >
                <Icon />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-medium text-gray-900">
                    {activity.title}
                  </h3>
                  <span className="text-sm text-gray-500">
                    {format(new Date(activity.timestamp), "MMM d, HH:mm", {
                      locale: id,
                    })}
                  </span>
                </div>
                <p className="text-sm text-gray-600">{activity.description}</p>
                {activity.value && (
                  <div className="flex items-center space-x-2 mt-2">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <span
                          key={i}
                          className={`text-lg ${
                            i < activity.value!
                              ? "text-yellow-400"
                              : "text-gray-300"
                          }`}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                    <span className="text-sm text-gray-500">
                      {activity.value}/5
                    </span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-6 pt-4 border-t border-gray-200">
        <button className="w-full text-center text-green-600 hover:text-green-700 font-medium text-sm">
          Lihat Semua Aktifitas
        </button>
      </div>
    </div>
  );
}
