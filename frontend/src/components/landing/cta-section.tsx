import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SectionWrapper } from "@/components/ui/section-wrapper";
import { Leaf, Lock, Users, Zap } from "lucide-react";

export function CTASection() {
  return (
    <SectionWrapper className="bg-linear-to-br from-green-500 to-blue-500 text-white">
      <div className="max-w-4xl mx-auto text-center">
        {/* Main CTA */}
        <h2 className="text-3xl lg:text-5xl font-bold mb-6">
          Siap Menumbuhkan Taman Kesehatan Mentalmu?
        </h2>

        <p className="text-xl lg:text-2xl mb-8 opacity-90 leading-relaxed">
          Bergabunglah dengan ribuan orang yang telah mengubah perjalanan
          kesehatan mental mereka. Mulai menumbuhkan hari ini gratis, pribadi,
          dan dibuat untuk kehidupan nyata.
        </p>

        {/* Benefits Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          <div className="text-center">
            <div className="text-2xl mb-2 flex justify-center">
              <Leaf />
            </div>
            <div className="font-semibold">Selamanya Gratis</div>
          </div>
          <div className="text-center">
            <div className="text-2xl mb-2 flex justify-center">
              <Lock />
            </div>
            <div className="font-semibold">100% Pribadi</div>
          </div>
          <div className="text-center">
            <div className="text-2xl mb-2 flex justify-center">
              <Zap />
            </div>
            <div className="font-semibold">Setup 2 Menit</div>
          </div>
          <div className="text-center">
            <div className="text-2xl mb-2 flex justify-center">
              <Users />
            </div>
            <div className="font-semibold">Komunitas Dukungan</div>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link href="/register">
            <Button
              size="lg"
              className="bg-white text-green-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold"
            >
              Mulai Perjalanan Gratismu
            </Button>
          </Link>
          <Link href="#features">
            <Button
              size="lg"
              variant="outline"
              className="border-white text-green-600 hover:bg-white hover:text-green-600 px-8 py-4 text-lg font-semibold"
            >
              Lihat Fitur
            </Button>
          </Link>
        </div>

        {/* Trust Note */}
        <div className="mt-8 text-sm opacity-80">
          <p>
            Tidak perlu kartu kredit • Pendaftaran 30 detik • Bisa dibatalkan
            kapan saja
          </p>
        </div>
      </div>
    </SectionWrapper>
  );
}
