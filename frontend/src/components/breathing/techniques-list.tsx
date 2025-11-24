"use client";

import { useState, useEffect } from "react";
import { Play, Clock, Target, Star, Award } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { breathingAPI } from "@/lib/breathing-api";
import { BreathingTechnique } from "@/types/breathing";
import { mockBreathingTechniques } from "@/lib/breathing/breathing-data";

interface TechniquesListProps {
  onStartSession: (technique: BreathingTechnique) => void;
}

const difficultyColors = {
  beginner: "bg-green-100 text-green-800 border-green-300",
  intermediate: "bg-yellow-100 text-yellow-800 border-yellow-300",
  advanced: "bg-red-100 text-red-800 border-red-300",
};

const difficultyLabels: Record<string, string> = {
  beginner: "Pemula",
  intermediate: "Menengah",
  advanced: "Mahir",
};

const difficultyIcons = {
  beginner: <Award className="w-4 h-4" />,
  intermediate: <Target className="w-4 h-4" />,
  advanced: <Star className="w-4 h-4" />,
};

export function TechniquesList({ onStartSession }: TechniquesListProps) {
  const [techniques, setTechniques] = useState<BreathingTechnique[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTechniques = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await breathingAPI.getTechniques();

      console.log("API Response:", response);

      if (response.data && response.data.success) {
        const techniquesData = response.data.data?.techniques;

        if (Array.isArray(techniquesData)) {
          setTechniques(techniquesData);
        } else {
          console.warn("Techniques data is not an array, using mock data");
          setTechniques(mockBreathingTechniques);
        }
      } else {
        console.warn("API response not successful, using mock data");
        setTechniques(mockBreathingTechniques);
      }
    } catch (error) {
      console.error("Failed to fetch techniques:", error);
      setError("Gagal memuat teknik pernapasan");
      // Fallback ke mock data
      setTechniques(mockBreathingTechniques);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTechniques();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 mb-4">{error}</div>
        <Button onClick={fetchTechniques} variant="outline">
          Coba Lagi
        </Button>
      </div>
    );
  }

  if (!techniques || !Array.isArray(techniques) || techniques.length === 0) {
    return (
      <div className="text-center py-12">
        <Target className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Belum Ada Teknik Tersedia
        </h3>
        <p className="text-gray-600 mb-4">
          Tidak ada teknik pernapasan yang ditemukan. Silakan coba lagi nanti.
        </p>
        <Button onClick={fetchTechniques} variant="outline">
          Muat Ulang
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Teknik Pernapasan</h2>
        <p className="text-gray-600 mt-1">
          Pilih teknik untuk memulai latihan pernapasan Anda
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {techniques.map((technique) => (
          <Card
            key={technique.id}
            className="hover:shadow-md transition-shadow"
          >
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <h3 className="font-semibold text-gray-900 text-lg">
                  {technique.name}
                </h3>
                <span
                  className={`px-2 py-1 text-xs rounded-full border flex items-center space-x-1 ${
                    difficultyColors[technique.difficulty]
                  }`}
                >
                  {difficultyIcons[technique.difficulty]}
                  <span className="capitalize">
                    {difficultyLabels[technique.difficulty] ||
                      technique.difficulty}
                  </span>
                </span>
              </div>

              <p className="text-gray-600 text-sm mb-4">
                {technique.description}
              </p>

              {/* Breathing Pattern */}
              <div className="bg-gray-50 rounded-lg p-3 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <div className="text-center">
                    <div className="font-semibold text-green-600">
                      {technique.pattern.inhale}d
                    </div>
                    <div className="text-gray-500 text-xs">Tarik</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold text-blue-600">
                      {technique.pattern.hold}d
                    </div>
                    <div className="text-gray-500 text-xs">Tahan</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold text-purple-600">
                      {technique.pattern.exhale}d
                    </div>
                    <div className="text-gray-500 text-xs">Buang</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold text-gray-600">
                      {technique.pattern.holdAfterExhale}d
                    </div>
                    <div className="text-gray-500 text-xs">Tahan</div>
                  </div>
                </div>
              </div>

              {/* Benefits */}
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-900 mb-2">
                  Manfaat:
                </h4>
                <ul className="text-xs text-gray-600 space-y-1">
                  {technique.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-center space-x-2">
                      <div className="w-1 h-1 bg-green-500 rounded-full"></div>
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1 text-sm text-gray-500">
                  <Clock className="w-4 h-4" />
                  <span>{Math.round(technique.duration / 60)} menit</span>
                </div>
                <Button
                  onClick={() => onStartSession(technique)}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Play className="w-4 h-4 mr-2" />
                  Mulai
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
