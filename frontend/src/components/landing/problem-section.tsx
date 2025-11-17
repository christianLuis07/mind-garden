import { SectionWrapper } from "@/components/ui/section-wrapper";
import { Frown, BarChart2, Users, Clock } from "lucide-react";

const problems = [
  {
    icon: Frown,
    title: "Sulit Melacak Kesehatan Mental",
    description:
      "Metode tradisional sering terpisah catatan di sini, aplikasi di sana, sehingga perjalanan kesejahteraanmu kurang jelas.",
  },
  {
    icon: BarChart2,
    title: "Kurangnya Wawasan yang Bermakna",
    description:
      "Kamu mencatat suasana hati, tapi tanpa analisis, pola-pola tetap tersembunyi dan peluang untuk berkembang terlewatkan.",
  },
  {
    icon: Users,
    title: "Merasa Sendiri dalam Perjalananmu",
    description:
      "Kesehatan mental bisa terasa isolatif tanpa komunitas pendukung yang memahami perjuanganmu.",
  },
  {
    icon: Clock,
    title: "Tidak Ada Waktu untuk Perawatan Diri",
    description:
      "Kesibukan sehari-hari membuat sulit memprioritaskan kesejahteraan mental dan membangun kebiasaan yang konsisten.",
  },
];

export function ProblemSection() {
  return (
    <SectionWrapper id="problem" className="bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Kesehatan Mental Itu Penting
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Banyak dari kita ingin merasa lebih baik secara mental, tapi
            cara-cara tradisional sering terasa membingungkan, kaku, atau
            terlalu formal.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {problems.map((problem, index) => {
            const Icon = problem.icon;
            return (
              <div
                key={index}
                className="flex items-start space-x-4 p-6 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                <div className="text-3xl shrink-0">
                  <Icon className="text-green-500" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {problem.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {problem.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Solution Teaser */}
        <div className="text-center mt-12 p-8 bg-linear-to-r from-green-50 to-blue-50 rounded-2xl">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Ada Cara yang Lebih Baik
          </h3>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            MindGarden menyatukan semuanya dalam satu platform yang indah dan
            intuitif, dirancang khusus untuk perjalanan kesejahteraan mentalmu.
          </p>
        </div>
      </div>
    </SectionWrapper>
  );
}
