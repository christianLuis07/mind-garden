import Link from "next/link";
import { Plus, BookOpen, Wind, Users } from "lucide-react";

const actions = [
  {
    name: "Catat Mood",
    description: "Apa yang kamu rasakan hari ini?",
    href: "/dashboard/mood",
    icon: Plus,
    color: "from-green-400 to-green-500",
  },
  {
    name: "Tulis Jurnal",
    description: "Ungkapkan isi pikiranmu",
    href: "/dashboard/journal/new",
    icon: BookOpen,
    color: "from-blue-400 to-blue-500",
  },
  {
    name: "Latihan Napas Tenang",
    description: "Tenangkan pikiranmu",
    href: "/dashboard/breathing",
    icon: Wind,
    color: "from-purple-400 to-purple-500",
  },
  {
    name: "Gabung Komunitas Dukungan",
    description: "Terhubung dengan orang lain",
    href: "/dashboard/community",
    icon: Users,
    color: "from-orange-400 to-orange-500",
  },
];

export function QuickActions() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {actions.map((action) => {
        const Icon = action.icon;

        return (
          <Link
            key={action.name}
            href={action.href}
            className="group bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-200 hover:scale-105"
          >
            <div
              className={`w-12 h-12 bg-linear-to-r ${action.color} rounded-xl flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform`}
            >
              <Icon className="w-6 h-6" />
            </div>

            <h3 className="font-semibold text-gray-900 mb-2">{action.name}</h3>
            <p className="text-sm text-gray-600">{action.description}</p>
          </Link>
        );
      })}
    </div>
  );
}
