import Link from "next/link";
import { Plus, BookOpen, Wind, Users, ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";

const actions = [
  {
    name: "Catat Mood",
    description: "Apa yang kamu rasakan hari ini?",
    href: "/dashboard/mood",
    icon: Plus,
    color: "bg-emerald-500/10 text-emerald-600",
  },
  {
    name: "Tulis Jurnal",
    description: "Ungkapkan isi pikiranmu",
    href: "/dashboard/journal",
    icon: BookOpen,
    color: "bg-blue-500/10 text-blue-600",
  },
  {
    name: "Latihan Napas",
    description: "Tenangkan pikiranmu",
    href: "/dashboard/breathing",
    icon: Wind,
    color: "bg-purple-500/10 text-purple-600",
  },
  {
    name: "Komunitas",
    description: "Terhubung dengan teman",
    href: "/dashboard/community",
    icon: Users,
    color: "bg-orange-500/10 text-orange-600",
  },
];

export function QuickActions() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {actions.map((action, index) => {
        const Icon = action.icon;

        return (
          <motion.div
            key={action.name}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Link
              href={action.href}
              className="group glass-card flex flex-col h-full rounded-[2rem] p-6 hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 relative overflow-hidden"
            >
              {/* Subtle background icon */}
              <Icon className="absolute -right-4 -bottom-4 w-32 h-32 text-primary/5 group-hover:scale-110 transition-transform duration-700" />
              
              <div className="flex justify-between items-start mb-8 relative z-10">
                <div
                  className={`w-14 h-14 ${action.color} rounded-2xl flex items-center justify-center group-hover:rotate-6 transition-transform duration-300`}
                >
                  <Icon className="w-7 h-7" />
                </div>
                <div className="w-10 h-10 rounded-full border border-border/50 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all duration-300">
                   <ArrowUpRight className="w-5 h-5" />
                </div>
              </div>

              <div className="relative z-10">
                <h3 className="text-lg font-bold text-foreground mb-1">{action.name}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{action.description}</p>
              </div>
            </Link>
          </motion.div>
        );
      })}
    </div>
  );
}
