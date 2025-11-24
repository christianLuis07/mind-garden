import { SectionWrapper } from "@/components/ui/section-wrapper";
import { User, BarChart, Search, Leaf, Users } from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Daftar & Siapkan Akun",
    description:
      "Buat akun Anda dalam 30 detik. Privasi Anda menjadi prioritas kami sejak awal.",
    icon: User,
  },
  {
    number: "02",
    title: "Lacak Mood Anda",
    description:
      "Mulai catat mood harian dan jurnal Anda. Hanya butuh satu menit setiap hari.",
    icon: BarChart,
  },
  {
    number: "03",
    title: "Temukan Pola",
    description:
      "Dapatkan insight tentang pola mood, pemicu, dan progres Anda dari waktu ke waktu.",
    icon: Search,
  },
  {
    number: "04",
    title: "Bangun Kebiasaan Sehat",
    description:
      "Gunakan latihan pernapasan dan dukungan komunitas untuk membangun kebiasaan kesejahteraan mental yang berkeintermediate.",
    icon: Leaf,
  },
  {
    number: "05",
    title: "Berkembang Bersama",
    description:
      "Terhubung dengan komunitas pendukung dan bagikan perjalanan Anda secara anonim jika diinginkan.",
    icon: Users,
  },
  {
    number: "06",
    title: "Mekar & Tumbuh",
    description:
      "Saksikan taman mental Anda berkembang saat Anda meningkatkan kesadaran diri dan ketahanan mental.",
    icon: Leaf,
  },
];

export function HowItWorks() {
  return (
    <SectionWrapper id="how-it-works" className="bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Mulai Berkembang dalam 6 Langkah Sederhana
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            MindGarden dirancang agar sederhana dan intuitif. Begini cara Anda
            bisa mengubah perjalanan kesejahteraan mental Anda.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {steps.map((step, index) => {
            const ICON = step.icon;
            return (
              <div
                key={index}
                className="relative text-center p-8 rounded-2xl bg-linear-to-br from-green-50 to-blue-50 hover:from-green-100 hover:to-blue-100 transition-all group"
              >
                {/* Step Number */}
                <div className="absolute -top-4 -left-4 w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-lg group-hover:scale-110 transition-transform">
                  {step.number}
                </div>

                {/* Icon */}
                <div className="flex justify-center text-4xl mb-4">
                  <ICON />
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {step.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {step.description}
                </p>

                {/* Connector Line (for desktop) */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute -right-4 top-1/2 w-8 h-0.5 bg-green-200 transform -translate-y-1/2" />
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom Note */}
        <div className="text-center mt-12 p-6 bg-gray-50 rounded-2xl">
          <p className="text-gray-600">
            <strong>Sepenuhnya gratis selamanya</strong> Tidak perlu kartu
            kredit, tanpa biaya tersembunyi, tanpa biaya tambahan.
          </p>
        </div>
      </div>
    </SectionWrapper>
  );
}
