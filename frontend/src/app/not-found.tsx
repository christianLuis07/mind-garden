// src/app/not-found.tsx
"use client";

import { useRouter } from "next/navigation";
import { Home, ArrowLeft, Search, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function NotFound() {
  const router = useRouter();

  const quickActions = [
    {
      title: "Journal",
      description: "Tulis pikiran dan perasaanmu",
      icon: "📝",
      path: "/dashboard/journal",
    },
    {
      title: "Breathing",
      description: "Tenangkan pikiran dengan latihan pernapasan",
      icon: "🌬️",
      path: "/dashboard/breathing",
    },
    {
      title: "Mood Check",
      description: "Track perasaanmu hari ini",
      icon: "😊",
      path: "/dashboard/mood",
    },
    {
      title: "Community",
      description: "Temukan dukungan dari orang lain",
      icon: "👥",
      path: "/community",
    },
  ];

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-green-50 to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-4xl mx-auto text-center">
        {/* Animated Illustration */}
        <div className="relative mb-8">
          <div className="w-48 h-48 mx-auto relative">
            {/* Floating elements */}
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-4">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center text-2xl">
                🌱
              </div>
            </div>

            <div className="absolute top-12 left-8">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-xl">
                💭
              </div>
            </div>

            <div className="absolute top-12 right-8">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-xl">
                🌸
              </div>
            </div>

            <div className="absolute bottom-8 left-12">
              <div className="w-14 h-14 bg-purple-100 rounded-full flex items-center justify-center text-2xl">
                🍃
              </div>
            </div>

            <div className="absolute bottom-4 right-12">
              <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center text-lg">
                🌟
              </div>
            </div>

            {/* Central 404 */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-6xl font-bold text-gray-700 bg-white/80 backdrop-blur-sm rounded-2xl px-6 py-4 shadow-lg">
                404
              </div>
            </div>
          </div>
        </div>

        {/* Message */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Halaman Tidak Ditemukan
          </h1>
          <p className="text-xl text-gray-600 mb-6 max-w-2xl mx-auto">
            Sepertinya kamu tersesat di taman pikiran. Jangan khawatir, bahkan
            bunga terindah pun kadang tumbuh di tempat tak terduga. 🌷
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              onClick={() => router.back()}
              variant="outline"
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Kembali</span>
            </Button>

            <Button
              onClick={() => router.push("/")}
              className="bg-green-600 hover:bg-green-700 flex items-center space-x-2"
            >
              <Home className="w-4 h-4" />
              <span>Beranda</span>
            </Button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            Mungkin Yang Kamu Cari?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <Card
                key={index}
                className="hover:shadow-lg transition-all duration-300 cursor-pointer hover:scale-105 border-2 border-transparent hover:border-green-200"
                onClick={() => router.push(action.path)}
              >
                <CardContent className="p-6 text-center">
                  <div className="text-3xl mb-3">{action.icon}</div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    {action.title}
                  </h3>
                  <p className="text-sm text-gray-600">{action.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Inspirational Quote */}
        <Card className="bg-linear-to-r from-green-50 to-blue-50 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-center space-x-3">
              <Heart className="w-6 h-6 text-green-600" />
              <p className="text-lg text-gray-700 italic">
                "Setiap langkah, bahkan yang tersesat, adalah bagian dari
                perjalananmu."
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Search Suggestion */}
        <div className="mt-8 p-6 bg-white/50 backdrop-blur-sm rounded-2xl">
          <div className="flex items-center justify-center space-x-3 mb-3">
            <Search className="w-5 h-5 text-gray-500" />
            <p className="text-gray-600">
              Coba cari yang kamu butuhkan di navigasi atas
            </p>
          </div>
        </div>
      </div>

      {/* Floating Animation Styles */}
      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        .floating {
          animation: float 3s ease-in-out infinite;
        }

        .floating-delay-1 {
          animation-delay: 0.5s;
        }
        .floating-delay-2 {
          animation-delay: 1s;
        }
        .floating-delay-3 {
          animation-delay: 1.5s;
        }
        .floating-delay-4 {
          animation-delay: 2s;
        }
      `}</style>

      {/* Add floating animation to elements */}
      <style jsx global>{`
        .floating {
          animation: float 3s ease-in-out infinite;
        }
        .floating-delay-1 {
          animation-delay: 0.5s;
        }
        .floating-delay-2 {
          animation-delay: 1s;
        }
        .floating-delay-3 {
          animation-delay: 1.5s;
        }
        .floating-delay-4 {
          animation-delay: 2s;
        }

        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }
      `}</style>
    </div>
  );
}
