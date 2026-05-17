import { format } from "date-fns";
import { id } from "date-fns/locale";
import {
  Smile,
  BookOpen,
  Wind,
  Users,
  Activity as ActivityIcon,
  Calendar,
} from "lucide-react";
import { motion } from "framer-motion";

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
  mood: "bg-emerald-500/10 text-emerald-600",
  journal: "bg-blue-500/10 text-blue-600",
  breathing: "bg-purple-500/10 text-purple-600",
  support: "bg-orange-500/10 text-orange-600",
  unknown: "bg-muted text-muted-foreground",
};

export function RecentActivity({
  activities = [],
  isLoading = false,
}: RecentActivityProps) {
  if (isLoading) {
    return (
      <div className="glass-card rounded-[2.5rem] p-8 shadow-xl shadow-primary/5 h-full border-none">
        <div className="flex items-center space-x-3 mb-8">
          <div className="w-2 h-8 bg-primary rounded-full" />
          <h2 className="text-2xl font-bold text-foreground">Aktivitas Terbaru</h2>
        </div>
        <div className="space-y-6 animate-pulse">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-start space-x-4">
              <div className="w-12 h-12 rounded-2xl bg-muted" />
              <div className="flex-1 space-y-3">
                <div className="h-5 bg-muted rounded-full w-1/3" />
                <div className="h-4 bg-muted rounded-full w-2/3" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card rounded-[2.5rem] p-8 shadow-xl shadow-primary/5 h-full border-none">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-3">
          <div className="w-2 h-8 bg-primary rounded-full" />
          <h2 className="text-2xl font-bold text-foreground tracking-tight">Aktivitas Terbaru</h2>
        </div>
        <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          {format(new Date(), "MMMM yyyy", { locale: id })}
        </div>
      </div>

      <div className="space-y-6">
        {activities.length === 0 ? (
          <div className="text-center py-12 flex flex-col items-center">
             <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                <ActivityIcon className="text-muted-foreground w-8 h-8" />
             </div>
             <p className="text-muted-foreground font-medium">Belum ada aktivitas tercatat hari ini.</p>
          </div>
        ) : (
          activities.map((activity, index) => {
            const Icon = typeIcons[activity.type] || ActivityIcon;
            return (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group flex items-start space-x-4 p-4 rounded-[1.5rem] hover:bg-primary/5 transition-all duration-300"
              >
                <div
                  className={`w-12 h-12 shrink-0 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 ${
                    typeColors[activity.type] || typeColors.unknown
                  }`}
                >
                  <Icon className="w-6 h-6" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-bold text-foreground group-hover:text-primary transition-colors">
                      {activity.title}
                    </h3>
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-tighter">
                      {format(new Date(activity.timestamp), "d MMM, HH:mm", {
                        locale: id,
                      })}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                    {activity.description}
                  </p>
                  
                  {activity.type === "mood" && activity.value && (
                    <div className="flex items-center space-x-1 mt-3">
                        {[...Array(5)].map((_, i) => (
                          <div
                            key={i}
                            className={`w-2 h-2 rounded-full ${
                              i < activity.value!
                                ? "bg-yellow-400 shadow-[0_0_8px_rgba(250,204,21,0.5)]"
                                : "bg-muted"
                            }`}
                          />
                        ))}
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
}
