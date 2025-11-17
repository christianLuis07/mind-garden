import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SectionWrapper } from "@/components/ui/section-wrapper";
import { Leaf } from "lucide-react";

export function HeroSection() {
  return (
    <SectionWrapper className="pt-32 pb-20 lg:pt-40 lg:pb-28 bg-linear-to-br from-green-50 via-blue-50 to-purple-50">
      <div className="max-w-7xl mx-auto text-center">
        {/* Badge */}
        <div className="inline-flex items-center px-4 py-2 rounded-full bg-green-100 text-green-700 text-sm font-medium mb-8">
          <Leaf className="mr-2" /> Sahabat Perjalanan Kesehatan Mentalmu
        </div>

        {/* Main Headline */}
        <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
          Kembangkan{" "}
          <span className="bg-linear-to-r from-green-500 to-blue-500 bg-clip-text text-transparent">
            {" "}
            Pikiran
          </span>
          , Raih{" "}
          <span className="bg-linear-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
            {" "}
            Kesejahteraanmu
          </span>
        </h1>

        {/* Subheadline */}
        <p className="text-xl lg:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
          Dengan MindGarden, kamu bisa memantau kesehatan mental, membangun
          kebiasaan sehat, dan bergabung dengan komunitas yang peduli, semua
          dalam satu platform yang aman dan menyenangkan.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
          <Link href="/register">
            <Button
              size="lg"
              className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 text-lg"
            >
              Mulai Perjalananmu - Gratis
            </Button>
          </Link>
          <Link href="#how-it-works">
            <Button
              size="lg"
              variant="outline"
              className="px-8 py-3 text-lg border-2"
            >
              Lihat Cara Kerjanya
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 max-w-2xl mx-auto">
          <div className="text-center">
            <div className="text-2xl lg:text-3xl font-bold text-gray-900">
              10K+
            </div>
            <div className="text-gray-600 text-sm">Pengguna Aktif</div>
          </div>
          <div className="text-center">
            <div className="text-2xl lg:text-3xl font-bold text-gray-900">
              50K+
            </div>
            <div className="text-gray-600 text-sm">Catatan Jurnal</div>
          </div>
          <div className="text-center">
            <div className="text-2xl lg:text-3xl font-bold text-gray-900">
              99%
            </div>
            <div className="text-gray-600 text-sm">Kepuasan Pengguna</div>
          </div>
          <div className="text-center">
            <div className="text-2xl lg:text-3xl font-bold text-gray-900">
              24/7
            </div>
            <div className="text-gray-600 text-sm">Dukungan</div>
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}
