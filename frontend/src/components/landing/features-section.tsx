import { FeatureCard } from "@/components/ui/feature-card";
import { SectionWrapper } from "@/components/ui/section-wrapper";
import {
  BarChart,
  FileText,
  Wind,
  Users,
  TrendingUp,
  Lock,
} from "lucide-react";

const features = [
  {
    icon: BarChart,
    title: "Pelacakan Mood Pintar",
    description:
      "Catat mood harian Anda dengan analitik cerdas yang membantu memahami pola dan pemicu.",
    features: [
      "Grafik dan tren mood visual",
      "Pengenalan pola",
      "Faktor mood kustom",
      "Insight mingguan",
    ],
    color: "green" as const,
  },
  {
    icon: FileText,
    title: "Jurnal Reflektif",
    description:
      "Ungkapkan pikiran Anda di ruang aman dengan analisis sentimen dan kontrol privasi bawaan.",
    features: [
      "Editor teks kaya fitur",
      "Analisis sentimen",
      "Lampiran gambar",
      "Entri publik/pribadi",
    ],
    color: "blue" as const,
  },
  {
    icon: Wind,
    title: "Latihan Pernapasan Terpandu",
    description:
      "Tenangkan pikiran dengan latihan pernapasan berbasis sains dan teknik meditasi.",
    features: [
      "Beragam teknik",
      "Panduan visual",
      "Pelacakan progres",
      "Monitoring tingkat ketenangan",
    ],
    color: "purple" as const,
  },
  {
    icon: Users,
    title: "Komunitas Pendukung",
    description:
      "Terhubung dengan orang lain di ruang aman dan termoderasi untuk berbagi pengalaman dan dukungan.",
    features: [
      "Grup berdasarkan topik",
      "Berbagi anonim",
      "Chat real-time",
      "Moderasi ahli",
    ],
    color: "green" as const,
  },
  {
    icon: TrendingUp,
    title: "Analitik Perkembangan",
    description:
      "Dapatkan insight mendalam tentang perjalanan kesejahteraan mental Anda dengan analitik komprehensif.",
    features: [
      "Skor kesejahteraan",
      "Pelacakan pembentukan kebiasaan",
      "Lencana pencapaian",
      "Laporan progres",
    ],
    color: "blue" as const,
  },
  {
    icon: Lock,
    title: "Privasi Lengkap",
    description:
      "Data Anda terenkripsi dan aman. Anda mengontrol apa yang dibagikan dan dengan siapa.",
    features: [
      "Enkripsi end-to-end",
      "Alat ekspor data",
      "Kontrol privasi",
      "Mode anonim",
    ],
    color: "purple" as const,
  },
];

export function FeaturesSection() {
  return (
    <SectionWrapper id="features" className="bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Semua yang Anda Butuhkan untuk Kesejahteraan Mental
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            MindGarden menggabungkan alat yang kuat dengan antarmuka yang indah
            dan intuitif untuk mendukung perjalanan kesehatan mental Anda.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <FeatureCard
                key={index}
                icon={<Icon />}
                title={feature.title}
                description={feature.description}
                features={feature.features}
                color={feature.color}
              />
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-12">
          <p className="text-gray-600 mb-6">
            Siap memulai perjalanan kesejahteraan mental Anda?
          </p>
          <a
            href="/register"
            className="inline-flex items-center px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg transition-colors"
          >
            Bergabung dengan MindGarden Sekarang
          </a>
        </div>
      </div>
    </SectionWrapper>
  );
}
