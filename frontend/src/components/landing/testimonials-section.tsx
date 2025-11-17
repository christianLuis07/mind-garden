import { TestimonialCard } from "@/components/ui/testimonial-card";
import { SectionWrapper } from "@/components/ui/section-wrapper";

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Software Engineer",
    content:
      "MindGarden membantu saya memahami pola kecemasan saya. Fitur pelacakan mood dan jurnal memberi wawasan yang tidak akan saya temukan sendiri.",
    avatar: "SC",
    rating: 5,
  },
  {
    name: "Marcus Rodriguez",
    role: "Guru",
    content:
      "Sebagai seseorang yang berjuang dengan depresi, latihan pernapasan dan komunitas pendukung sangat mengubah hidup saya. Saya merasa tidak sendirian lagi.",
    avatar: "MR",
    rating: 5,
  },
  {
    name: "Emily Watson",
    role: "Mahasiswa Pascasarjana",
    content:
      "Kontrol privasi membuat saya merasa aman untuk menjadi terbuka. Bisa memilih apa yang dibagikan secara publik atau pribadi sangat penting bagi saya.",
    avatar: "EW",
    rating: 5,
  },
  {
    name: "David Kim",
    role: "Manajer Pemasaran",
    content:
      "Analitik membantu saya mengidentifikasi bahwa mood saya turun karena kualitas tidur. Perubahan kecil memberikan dampak besar.",
    avatar: "DK",
    rating: 5,
  },
  {
    name: "Lisa Thompson",
    role: "Perawat",
    content:
      "Setelah mencoba banyak aplikasi kesehatan mental, MindGarden adalah satu-satunya yang konsisten saya gunakan. Antarmukanya indah dan fiturnya benar-benar bekerja bersama.",
    avatar: "LT",
    rating: 5,
  },
  {
    name: "Alex Morgan",
    role: "Desainer Freelance",
    content:
      "Grup dukungannya luar biasa. Saya menemukan orang-orang yang benar-benar memahami apa yang saya alami. Opsi anonim sangat pas.",
    avatar: "AM",
    rating: 5,
  },
];

export function TestimonialsSection() {
  return (
    <SectionWrapper id="testimonials" className="bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Dicintai oleh Ribuan Pengguna di Seluruh Dunia
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Bergabunglah dengan orang-orang dari berbagai latar belakang yang
            telah mengubah perjalanan kesehatan mental mereka bersama
            MindGarden.
          </p>
        </div>

        {/* Grid Testimonial */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard
              key={index}
              name={testimonial.name}
              role={testimonial.role}
              content={testimonial.content}
              avatar={testimonial.avatar}
              rating={testimonial.rating}
            />
          ))}
        </div>

        {/* Trust Indicators */}
        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">
            Dipercaya oleh profesional dan individu di seluruh dunia
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
            <div className="text-gray-400 font-semibold">Terapis</div>
            <div className="text-gray-400 font-semibold">Mahasiswa</div>
            <div className="text-gray-400 font-semibold">Profesional</div>
            <div className="text-gray-400 font-semibold">Orang Tua</div>
            <div className="text-gray-400 font-semibold">Pengasuh</div>
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}
