Dokumentasi Lengkap Proyek MindGarden: Teman Digital Kesehatan Mental

1. Konsep dan Tujuan Proyek
MindGarden adalah sebuah platform digital yang dirancang untuk menjadi sahabat Anda dalam perjalanan menuju kesejahteraan mental yang lebih baik.

Tujuannya sederhana: menyatukan semua alat yang dibutuhkan untuk merawat pikiran dalam satu ruang yang aman, intuitif, dan, yang terpenting, gratis selamanya.

MindGarden mengatasi masalah umum yaitu merasa sendirian dan kurang memiliki wawasan tentang pola emosi diri, dengan menyediakan alat-alat berikut:

2. Fitur-Fitur Inti
Fitur,Deskripsi untuk Pengguna,Detail Teknis (Data Model)
Pantau Mood,"Catat perasaan Anda pada skala 1 hingga 5, dan tandai faktor-faktor apa yang memengaruhinya (seperti kualitas tidur, olahraga, atau tekanan pekerjaan). Anda bisa melihat tren ini di kalender dan grafik analitik.","Menyimpan mood (Int 1-5), notes, dan factors (JSON, untuk fleksibilitas faktor pemicu) pada model MoodEntry."
Jurnal Reflektif,Tuangkan pikiran Anda di ruang pribadi. Sistem akan memberikan analisis sentimen dasar (-1 hingga 1) untuk membantu Anda memahami nada emosi dalam tulisan Anda. Jurnal bisa diatur menjadi publik (untuk berbagi inspirasi) atau pribadi.,"Menggunakan model JournalEntry dengan content (tipe Text untuk catatan panjang), sentiment (Float), tags (JSON), dan isPublic (Boolean)."
Latihan Pernapasan,Latihan terpandu seperti Box Breathing atau 4-7-8 untuk menenangkan sistem saraf Anda. Aplikasi mencatat durasi dan tingkat ketenangan yang dirasakan setelah sesi.,"Model BreathingSession menyimpan duration, technique, dan calmLevel."
Komunitas Dukungan,"Bergabung dengan grup yang dimoderasi berdasarkan topik (misalnya: kecemasan, depresi). Anda dapat berbagi pengalaman dan mendapatkan dukungan. Pesan dapat berupa teks atau gambar.","Model SupportGroup, SupportGroupMember (dengan peran: admin, moderator, member), dan SupportGroupMessage (dengan bidang imageUrl)."

3. (Tech Stack)
MindGarden dibangun dengan arsitektur monorepo virtual menggunakan teknologi modern dan full-stack JavaScript/TypeScript.

Komponen,Teknologi Utama,Peran
Frontend,"Next.js 16 (App Router), React, TypeScript","Menghadirkan antarmuka pengguna yang cepat, responsive, dan terautentikasi (menggunakan ProtectedRoute dan zustand untuk state sesi)."
,Tailwind CSS & Shadcn UI,"Styling dan komponen UI yang bersih, modern, dan mudah disesuaikan."
Backend (API),Node.js & Express.js,"Menyediakan API RESTful yang aman, cepat, dan rate-limited (dibatasi laju permintaan) menggunakan express-rate-limit."
,Prisma & MySQL,Prisma sebagai Object-Relational Mapper (ORM) yang andal untuk interaksi database MySQL.
Layanan Kritis,JWT & Bcrypt,JSON Web Tokens untuk sesi dan Bcrypt untuk mengamankan kata sandi.
,Nodemailer,"Untuk pengiriman email (verifikasi, reset kata sandi)."
,Cloudinary & Multer,Menangani upload file dengan aman ke Cloudinary.
,Winston,Logging terstruktur untuk melacak aktivitas server dan kesalahan.

4.Ringkasan API Backend
API diorganisir menggunakan pola Routes -> Controllers -> Services untuk memisahkan masalah (separation of concerns), memastikan bahwa logika bisnis utama tersimpan di lapisan Services.

Berikut adalah endpoint API utama yang tersedia di bawah awalan /api/v1:
Kategori,Endpoint,Metode,Otentikasi,Fungsi
Otentikasi,"/auth/register, /auth/login",POST,Publik,Pendaftaran dan masuk pengguna.
,"/auth/me, /auth/profile","GET, PUT",Wajib,Mengambil data pengguna atau memperbarui profil.
Verifikasi,/email/verify-email,POST,Publik,Memverifikasi akun dengan token.
,"/email/forgot-password, /email/reset-password",POST,Publik,Mengelola permintaan reset kata sandi.
Mood,/mood,"POST, GET",Wajib,Membuat atau melihat riwayat mood.
,/mood/analytics,GET,Wajib,Mengambil data untuk grafik dan tren mood.
Jurnal,/journal,"POST, GET",Wajib,Membuat atau melihat jurnal pribadi.
,/journal/public,GET,Opsional,Melihat entri jurnal yang ditandai publik.
Dukungan,/support/groups,GET,Opsional,Mencari daftar grup dukungan.
,"/support/groups/:id/join, /support/groups/:id/messages",POST,Wajib,Bergabung dengan grup atau mengirim pesan.
