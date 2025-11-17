import { FAQItem } from "@/components/ui/faq-item";
import { SectionWrapper } from "@/components/ui/section-wrapper";

const faqs = [
  {
    question: "Apakah data saya aman dan pribadi?",
    answer:
      "Tentu saja. Kami menggunakan enkripsi end-to-end dan tidak pernah membagikan data pribadimu. Kamu memiliki kontrol penuh atas apa yang dibagikan secara publik atau pribadi. Semua data tersimpan dengan aman dan bisa diekspor atau dihapus kapan saja.",
  },
  {
    question: "Berapa biaya menggunakan MindGarden?",
    answer:
      "MindGarden menyediakan paket gratis dengan semua fitur dasar. Website ini 100% gratis dan bisa akses ke analisis lanjutan, catatan jurnal tak terbatas, dan dukungan premium. Kamu bisa mulai gratis dan upgrade kapan saja.",
  },
  {
    question: "Apakah saya membutuhkan perangkat khusus?",
    answer:
      "Tidak sama sekali! MindGarden dapat digunakan di perangkat apa pun dengan browser ponsel, tablet, atau komputer. Tidak perlu perangkat khusus, wearable, atau instalasi tambahan (meskipun kami juga menyediakan aplikasi mobile untuk kemudahan).",
  },
  {
    question:
      "Apa yang membedakan MindGarden dari aplikasi kesehatan mental lainnya?",
    answer:
      "MindGarden menggabungkan pelacakan mood, journaling, latihan pernapasan, dan dukungan komunitas dalam satu platform terintegrasi. Berbeda dengan aplikasi lain yang fokus pada satu aspek saja, kami membantu kamu melihat keseluruhan perjalanan kesehatan mentalmu.",
  },
  {
    question: "Bisakah saya menggunakan MindGarden bersama terapis saya?",
    answer:
      "Bisa! Banyak pengguna membagikan laporan dan insight mereka dengan terapis. Kami menyediakan opsi ekspor mudah, sehingga terapis bisa melihat pola yang berguna untuk sesi mereka (tentu saja dengan izinmu).",
  },
  {
    question: "Bagaimana jika saya kurang paham teknologi?",
    answer:
      "MindGarden dirancang sangat mudah digunakan. Kami menyediakan panduan onboarding, antarmuka sederhana, dan dukungan pelanggan yang responsif. Jika kamu bisa menggunakan smartphone, kamu bisa menggunakan MindGarden!",
  },
  {
    question: "Apakah ada komunitas atau grup dukungan?",
    answer:
      "Ya! Kami memiliki grup dukungan yang dimoderasi untuk berbagai topik (kecemasan, depresi, manajemen stres, dll.). Kamu bisa berpartisipasi secara anonim jika mau, dan pedoman komunitas kami menjamin lingkungan yang aman dan mendukung.",
  },
  {
    question: "Bisakah saya membatalkan kapan saja?",
    answer:
      "Tentu saja. Tidak ada kontrak jangka panjang. Kamu bisa membatalkan langganan premium kapan saja dan tetap memiliki akses ke data dan fitur gratis. Kami percaya pada kepercayaanmu setiap bulan.",
  },
];

export function FAQSection() {
  return (
    <SectionWrapper id="faq" className="bg-white">
      <div className="max-w-4xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Pertanyaan yang Sering Diajukan
          </h2>
          <p className="text-xl text-gray-600">
            Semua yang perlu kamu ketahui tentang MindGarden. Tidak menemukan
            jawaban? Hubungi tim dukungan kami.
          </p>
        </div>

        {/* FAQ Items */}
        <div className="bg-gray-50 rounded-2xl p-8">
          {faqs.map((faq, index) => (
            <FAQItem key={index} question={faq.question} answer={faq.answer} />
          ))}
        </div>

        {/* Support CTA */}
        <div className="text-center mt-12 p-8 bg-linear-to-r from-green-50 to-blue-50 rounded-2xl">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Masih ada pertanyaan?
          </h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Tim dukungan kami siap membantumu memulai dan menjawab semua
            pertanyaan tentang perjalanan kesehatan mentalmu.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:support@mindgarden.com"
              className="inline-flex items-center px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg transition-colors"
            >
              Hubungi Dukungan
            </a>
            <a
              href="/register"
              className="inline-flex items-center px-6 py-3 border-2 border-green-500 text-green-500 hover:bg-green-500 hover:text-white font-semibold rounded-lg transition-colors"
            >
              Coba Gratis
            </a>
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}
