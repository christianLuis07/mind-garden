


1. Konsep dan Filosofi Proyek
MindGarden adalah sebuah platform digital yang didedikasikan untuk kesehatan mental dan kesejahteraan emosional. Proyek ini bertujuan menyediakan solusi terpadu (All-in-One) bagi pengguna untuk memantau, merefleksikan, dan meningkatkan kondisi mental mereka.

Filosofi inti proyek ini adalah aksesibilitas dan privasi. MindGarden dirancang untuk selamanya gratis (didukung oleh grants dan donasi komunitas) dan menjamin 100% privasi dengan enkripsi data yang aman.

MindGarden mengatasi masalah umum dalam perawatan diri, yaitu kesulitan melacak pola emosi dan perasaan terisolasi, dengan menyatukan alat-alat canggih di bawah satu antarmuka yang indah dan intuitif.

2. Rincian Fitur dan Fungsionalitas
A. Pelacakan Mood (Mood Tracking)
Fungsionalitas utama ini memungkinkan pengguna untuk secara teratur mencatat keadaan emosi mereka.

Pencatatan Mood: Pengguna memilih tingkat mood pada skala 1 (Sangat Sedih) hingga 5 (Sangat Bahagia).

Faktor Pemicu: Pengguna dapat memasukkan faktor-faktor yang mungkin memengaruhi mood, seperti skor kualitas tidur, apakah mereka berolahraga, aktivitas sosial, dan tekanan pekerjaan. Data faktor disimpan dalam format JSON di database (MoodEntry.factors) untuk fleksibilitas.

Visualisasi Data: Data mood divisualisasikan dalam bentuk kalender berwarna (MoodCalendar) dan grafik analitik (MoodAnalytics) yang menampilkan rata-rata mood dan pola mingguan dalam kerangka waktu tertentu (7 hari, 30 hari, dll.).

B. Jurnal Reflektif (Journaling)
Fitur ini menyediakan ruang aman untuk ekspresi diri dan refleksi.

Penyimpanan Teks Panjang: Model JournalEntry di database mendukung teks panjang (@db.Text) untuk konten jurnal yang mendalam.

Analisis Sentimen: Backend service secara otomatis menghitung skor sentimen (sentiment antara -1 dan 1) berdasarkan konten yang ditulis pengguna, memberikan wawasan objektif terhadap perasaan mereka.

Gambar dan Privasi: Entri dapat mencakup lampiran gambar (images sebagai JSON array) dan memiliki flag isPublic yang memungkinkan pengguna berbagi inspirasi secara opsional dengan komunitas.

C. Latihan Pernapasan (Breathing Exercises)
Fitur ini menawarkan alat untuk ketenangan instan.

Beragam Teknik: Menyediakan berbagai teknik pernapasan terpandu (misalnya, Box Breathing, 4-7-8 Breathing, Belly Breathing, dan Alternate Nostril Breathing) dengan langkah-langkah dan manfaat yang jelas.

Pencatatan Sesi: Setiap sesi dicatat dalam model BreathingSession dengan durasi dan tingkat ketenangan yang dilaporkan pengguna setelah sesi selesai (calmLevel 1-10).

D. Komunitas Dukungan (Support Community)
MindGarden menumbuhkan lingkungan yang suportif melalui grup komunitas.

Model Grup: Model SupportGroup memungkinkan pembuatan grup publik atau privat dengan batas anggota tertentu (maxMembers).

Manajemen Anggota: Peran anggota (member, moderator, admin) disimpan di model SupportGroupMember untuk memfasilitasi moderasi dan administrasi grup.

Pesan Kaya: Model SupportGroupMessage mendukung pesan teks (messageType: 'text') dan pesan berbasis gambar (imageUrl), memungkinkan komunikasi yang lebih ekspresif.

3. Rincian Tumpukan Teknologi (Tech Stack)
A. Sisi Klien (Frontend) - Frontend
Frontend dibangun dengan fokus pada kinerja dan pengalaman pengguna yang luar biasa.

Framework: Next.js versi 16.0.3, memanfaatkan App Router yang modern untuk routing dan server-side rendering.

Bahasa: TypeScript untuk memastikan konsistensi dan meminimalkan bug.

Manajemen Status: Zustand digunakan sebagai state management library yang minimalis. useAuthStore menggunakan middleware persist untuk menyimpan sesi pengguna (token dan data) secara lokal, memastikan status otentikasi dipertahankan antar sesi.

Desain: Menggunakan Tailwind CSS dengan utilitas yang dikustomisasi, dilengkapi dengan komponen UI dari Shadcn UI untuk elemen dasar seperti Button, Card, dan Input.

Koneksi API: Axios adalah klien HTTP utama. Ia memiliki interceptor yang secara otomatis melampirkan token JWT untuk permintaan terotentikasi dan merespons status 401 Unauthorized dengan membersihkan sesi dan mengarahkan pengguna kembali ke halaman login.

B. Sisi Server (Backend) - Backend
Backend adalah API RESTful yang aman dan terstruktur.

Framework: Node.js dengan Express.js.

Database: Menggunakan Prisma ORM untuk berinteraksi dengan database MySQL.

Otentikasi: Menggunakan Bcrypt untuk meng-hash kata sandi dan JWT untuk membuat dan memverifikasi token sesi.

Keamanan Jaringan: Ditingkatkan dengan Helmet (untuk header keamanan), CORS (dikonfigurasi untuk mengizinkan akses dari CLIENT_URL frontend), dan Express Rate Limit (membatasi 1000 permintaan per 15 menit per IP).

Validasi: Dilakukan di lapisan middleware dengan Express Validator, yang memvalidasi format data dan memastikan integritas data (misalnya, memastikan email unik sebelum pendaftaran).

Layanan File: Pengunggahan file menggunakan Multer dan disimpan di layanan pihak ketiga, Cloudinary, dengan konfigurasi penyimpanan spesifik untuk avatar, journal images, dan gambar support group.

4. Panduan Instalasi dan Pengembangan (Setup)
Untuk menjalankan proyek ini, Anda perlu menyiapkan dua lingkungan terpisah (backend dan frontend).

Langkah A: Persiapan Lingkungan Dasar
Pastikan Anda memiliki Node.js (rekomendasi versi >=18) dan MySQL yang terinstal.

Dapatkan kunci API untuk Cloudinary (untuk penyimpanan file) dan kredensial SMTP (untuk layanan email Nodemailer).

Langkah B: Pengaturan Backend
Instalasi Dependensi:

Bash

cd backend
npm install
Konfigurasi Environment: Buat file bernama .env di folder backend dan isi variabel rahasia yang diperlukan. Pastikan DATABASE_URL Anda sudah benar.

Migrasi Database: Sinkronkan skema database (termasuk tabel users, mood_entries, support_groups, dll.) dengan perintah Prisma:

Bash

npx prisma migrate dev --name initial_setup
Seeding Data (Opsional): Jalankan seeder untuk mengisi data awal demo:

Bash

npm run seed
# Catatan: Ini akan menghapus data yang ada dan membuat pengguna demo (misalnya, john@example.com, sandi: password123)
Menjalankan Server:

Bash

npm run dev
# Server API akan berjalan di http://localhost:5000/api/v1 (default)
Langkah C: Pengaturan Frontend
Instalasi Dependensi:

Bash

cd frontend
npm install
Konfigurasi API URL: Buat file bernama .env.local di folder frontend dan tautkan ke backend:

NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
Menjalankan Aplikasi Web:

Bash

npm run dev
# Aplikasi web akan berjalan di http://localhost:3000
Anda kini dapat mengakses aplikasi MindGarden, mendaftar, dan memulai perjalanan Anda.

