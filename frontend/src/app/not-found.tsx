"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Compass, Home, ArrowLeft, Wind } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-[120px] animate-pulse delay-700" />
      </div>

      <div className="max-w-2xl w-full text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-8"
        >
          {/* Creative 404 Illustration */}
          <div className="relative flex justify-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="w-48 h-48 md:w-64 md:h-64 rounded-full border-2 border-dashed border-primary/30 flex items-center justify-center"
            >
              <Compass className="w-24 h-24 md:w-32 md:h-32 text-primary opacity-20" />
            </motion.div>
            <div className="absolute inset-0 flex items-center justify-center">
              <h1 className="text-8xl md:text-9xl font-black text-primary tracking-tighter">404</h1>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight">
              Sepertinya Kamu Tersesat...
            </h2>
            <p className="text-lg text-muted-foreground max-w-md mx-auto leading-relaxed">
              Halaman yang kamu cari mungkin telah dipindahkan atau memang tidak pernah ada di taman ini.
            </p>
          </div>

          <motion.div
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             transition={{ delay: 0.5 }}
             className="p-6 bg-primary/5 rounded-[2rem] border border-primary/10 max-w-sm mx-auto flex items-center gap-4"
          >
             <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary shrink-0">
                <Wind className="w-6 h-6" />
             </div>
             <p className="text-sm text-left text-muted-foreground font-medium italic leading-relaxed">
               &quot;Tarik napas dalam-dalam sejenak, mari kita kembali ke jalan yang benar.&quot;
             </p>
          </motion.div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link href="/" className="w-full sm:w-auto">
              <Button size="lg" className="w-full rounded-2xl px-8 h-14 bg-primary hover:bg-primary/90 text-white font-bold shadow-xl shadow-primary/20 transition-all hover:scale-105 active:scale-95">
                <Home className="mr-2 w-5 h-5" />
                Kembali ke Beranda
              </Button>
            </Link>
            <Button 
              variant="outline" 
              size="lg" 
              onClick={() => window.history.back()}
              className="w-full sm:w-auto rounded-2xl px-8 h-14 border-2 font-bold transition-all hover:bg-white/30 active:scale-95"
            >
              <ArrowLeft className="mr-2 w-5 h-5" />
              Kembali ke Sebelumnya
            </Button>
          </div>
        </motion.div>
      </div>

      {/* Footer Info */}
      <div className="absolute bottom-8 left-0 right-0 text-center">
         <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground opacity-40">
           MindGarden &bull; Personal Wellness
         </p>
      </div>
    </div>
  );
}
