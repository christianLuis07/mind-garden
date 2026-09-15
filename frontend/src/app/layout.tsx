import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://mindgarden-porting.my.id"
  ),
  title: {
    default:
      "MindGarden — Platform Kesehatan Mental & Emosional | Christian Luis Paskalis Ginting",
    template: "%s | MindGarden — Christian Luis Paskalis Ginting",
  },
  description:
    "MindGarden adalah platform kesehatan mental & kesejahteraan emosional komprehensif karya Christian Luis Paskalis Ginting. Dilengkapi pelacakan suasana hati (mood tracker), jurnal reflektif dengan analisis sentimen AI, panduan pernapasan relaksasi, dan komunitas dukungan aman.",
  keywords: [
    "Christian Luis Paskalis Ginting",
    "Christian Luis",
    "Christian Luis Ginting",
    "Christian Ginting",
    "Christian Luis Developer",
    "Christian Luis Portfolio",
    "Christian Luis Web Developer",
    "MindGarden",
    "MindGarden Christian Luis",
    "Aplikasi Kesehatan Mental",
    "Mood Tracker Indonesia",
    "Mental Health App",
    "Fullstack Developer Portfolio Indonesia",
    "Next.js Portfolio Project",
  ],
  authors: [
    {
      name: "Christian Luis Paskalis Ginting",
      url: "https://github.com/christianLuis07",
    },
  ],
  creator: "Christian Luis Paskalis Ginting",
  publisher: "Christian Luis Paskalis Ginting",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "https://mind-garden.vercel.app",
    siteName: "MindGarden by Christian Luis Paskalis Ginting",
    title:
      "MindGarden — Platform Kesehatan Mental karya Christian Luis Paskalis Ginting",
    description:
      "Platform digital inovatif untuk pelacakan mood, jurnal refleksi bertenaga AI, dan komunitas dukungan emosional. Dikembangkan oleh Christian Luis Paskalis Ginting.",
  },
  twitter: {
    card: "summary_large_image",
    title: "MindGarden — Christian Luis Paskalis Ginting",
    description:
      "Platform digital kesehatan mental & emosional inovatif karya Christian Luis Paskalis Ginting.",
    creator: "@christianluis",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://mind-garden.vercel.app",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": "https://mind-garden.vercel.app/#author",
      name: "Christian Luis Paskalis Ginting",
      alternateName: [
        "Christian Luis",
        "Christian Luis Ginting",
        "Christian Ginting",
        "christianLuis07",
      ],
      jobTitle: "Full-Stack Software Engineer",
      description:
        "Software Engineer dan kreator platform MindGarden — aplikasi terintegrasi untuk kesehatan mental dan kesejahteraan emosional.",
      url: "https://github.com/christianLuis07",
      sameAs: [
        "https://github.com/christianLuis07",
      ],
    },
    {
      "@type": "WebApplication",
      "@id": "https://mind-garden.vercel.app/#webapp",
      name: "MindGarden",
      alternateName: "MindGarden by Christian Luis Paskalis Ginting",
      applicationCategory: "HealthApplication, LifestyleApplication",
      operatingSystem: "All",
      description:
        "MindGarden adalah platform kesehatan mental dan pelacak suasana hati (mood tracker) karya Christian Luis Paskalis Ginting. Menyediakan fitur jurnal reflektif, analisis sentimen emosi AI, latihan pernapasan terpandu, dan komunitas dukungan.",
      author: {
        "@id": "https://mind-garden.vercel.app/#author",
      },
      creator: {
        "@id": "https://mind-garden.vercel.app/#author",
      },
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "IDR",
      },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <Toaster position="top-right" toastOptions={{ duration: 4000 }} />
      </body>
    </html>
  );
}
