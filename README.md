#  MindGarden

**Platform digital terpadu untuk kesehatan mental dan kesejahteraan emosional.**

MindGarden menyediakan solusi All-in-One bagi pengguna untuk memantau, merefleksikan, dan meningkatkan kondisi mental mereka — mulai dari pelacakan mood, jurnal reflektif, latihan pernapasan, hingga komunitas dukungan.

---

## 📋 Daftar Isi

- [Prasyarat](#-prasyarat)
- [Instalasi](#-instalasi)
  - [1. Clone Repository](#1-clone-repository)
  - [2. Setup Backend](#2-setup-backend)
  - [3. Setup Frontend](#3-setup-frontend)
- [Menjalankan Aplikasi](#-menjalankan-aplikasi)
- [Akun Demo](#-akun-demo)
- [Fitur Utama](#-fitur-utama)
- [Tech Stack](#-tech-stack)
- [Struktur Proyek](#-struktur-proyek)
- [Keamanan](#-keamanan)
- [Environment Variables](#-environment-variables)

---

## ✅ Prasyarat

Pastikan perangkat Anda sudah terinstal:

| Software   | Versi Minimum | Keterangan                         |
| ---------- | ------------- | ---------------------------------- |
| **Node.js** | `>= 18.x`    | [Download](https://nodejs.org/)   |
| **npm**     | `>= 9.x`     | Terinstal bersama Node.js          |
| **MySQL**   | `>= 8.0`     | [Download](https://dev.mysql.com/) |
| **Git**     | Terbaru       | [Download](https://git-scm.com/)  |

Anda juga membutuhkan:
- **Akun Cloudinary** — untuk penyimpanan file/gambar ([cloudinary.com](https://cloudinary.com/))
- **Akun Email SMTP** — untuk pengiriman email verifikasi (bisa menggunakan Gmail App Password)

---

## 🚀 Instalasi

### 1. Clone Repository

```bash
git clone https://github.com/christianLuis07/mind-garden.git
cd mind-garden
```

---

### 2. Setup Backend

#### a. Install Dependensi

```bash
cd backend
npm install
```

#### b. Buat File Environment

Buat file `.env` di folder `backend/` dan isi dengan konfigurasi berikut:

```env
# Environment
NODE_ENV=development
PORT=5000

# Database (sesuaikan dengan MySQL Anda)
DATABASE_URL="mysql://USER:PASSWORD@localhost:3306/mindgarden"

# JWT (ganti dengan secret key Anda sendiri)
JWT_SECRET=your-super-secret-jwt-key-ganti-ini-dengan-string-acak-yang-panjang
JWT_EXPIRES_IN=30d
JWT_COOKIE_EXPIRE=30

# Cloudinary (dari dashboard Cloudinary Anda)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Email SMTP (contoh menggunakan Gmail)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_gmail_app_password
EMAIL_FROM=MindGarden <noreply@mindgarden.com>

# Client & Backend URL
CLIENT_URL=http://localhost:3000
BACKEND_URL=http://localhost:5000

# File Upload Limits
MAX_FILE_SIZE=5242880
```

> **💡 Tips:** Untuk `JWT_SECRET`, jalankan perintah ini di terminal untuk membuat secret key acak:
> ```bash
> node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
> ```

> **💡 Tips Gmail:** Untuk `EMAIL_PASS`, gunakan **App Password** dari Google. Buka [Google Account → Security → App Passwords](https://myaccount.google.com/apppasswords), buat password baru untuk "Mail".

#### c. Buat Database MySQL

Buka MySQL client Anda (MySQL Workbench, terminal, phpMyAdmin, dsb.) dan buat database:

```sql
CREATE DATABASE mindgarden;
```

Pastikan `DATABASE_URL` di file `.env` sudah sesuai dengan username, password, host, port, dan nama database Anda.

#### d. Sinkronisasi Skema Database

```bash
npx prisma db push
```

Perintah ini akan membuat semua tabel yang diperlukan (`users`, `mood_entries`, `journal_entries`, `breathing_sessions`, `support_groups`, dsb.) berdasarkan skema di `prisma/schema.prisma`.

#### e. Generate Prisma Client

```bash
npx prisma generate
```

#### f. Seed Data Demo (Opsional)

Untuk mengisi database dengan data demo:

```bash
npm run seed
```

> ⚠️ **Peringatan:** Seeder akan menghapus data yang ada dan membuat pengguna demo baru.

#### g. Buat Akun Admin (Opsional)

Untuk membuat akun Global Admin dengan proteksi TOTP:

```bash
node seed-admin.js
```

Ini membuat akun admin dengan email `admin@mindgarden.local` dan password `password123`.

---

### 3. Setup Frontend

#### a. Install Dependensi

```bash
cd frontend
npm install
```

#### b. Buat File Environment

Buat file `.env.local` di folder `frontend/` dan isi:

```env
# Backend API
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

Pastikan `NEXT_PUBLIC_API_URL` mengarah ke alamat dan port backend Anda.

---

## ▶️ Menjalankan Aplikasi

Anda perlu menjalankan **dua terminal terpisah** — satu untuk backend, satu untuk frontend.

### Terminal 1 — Backend

```bash
cd backend
npm run dev
```

Server API akan berjalan di `http://localhost:5000`.

> **Catatan:** Jika `nodemon` belum terinstal global, Anda juga bisa menjalankan langsung:
> ```bash
> node server.js
> ```

### Terminal 2 — Frontend

```bash
cd frontend
npm run dev
```

Aplikasi web akan berjalan di `http://localhost:3000`.
Anda kini dapat mengakses aplikasi MindGarden, mendaftar, dan memulai perjalanan Anda.

---

## 👤 Akun Demo

Setelah menjalankan seeder, Anda bisa login dengan akun berikut:

| Tipe   | Email                     | Password      | Keterangan                     |
| ------ | ------------------------- | ------------- | ------------------------------ |
| User   | `john@example.com`        | `password123` | Akun demo pengguna biasa       |
| Admin  | `admin@mindgarden.local`  | `password123` | Akun admin (perlu `seed-admin.js`) |

**Login Admin:**
1. Buka `http://localhost:3000/admin/login`
2. Masukkan email dan password admin
3. Saat pertama kali login, Anda akan diminta memindai QR Code menggunakan aplikasi **Google Authenticator** atau **Authy** di smartphone
4. Masukkan 6 digit kode TOTP dari aplikasi authenticator
5. Setelah berhasil, Anda akan masuk ke Dashboard Admin

---

## 🧩 Fitur Utama

### 📊 Pelacakan Mood
- Catat mood harian pada skala 1–5
- Masukkan faktor pemicu (tidur, olahraga, stress, dll.)
- Visualisasi kalender mood dan grafik analitik

### 📝 Jurnal Reflektif
- Editor teks kaya untuk ekspresi diri yang mendalam
- Analisis sentimen otomatis (-1 s/d 1)
- Lampiran gambar dan opsi berbagi publik

### 🧘 Latihan Pernapasan
- Teknik terpandu: Box Breathing, 4-7-8, Belly Breathing, dll.
- Pencatatan durasi sesi dan tingkat ketenangan (1–10)

### 💬 Komunitas Dukungan
- Grup publik dan privat
- Chat real-time dengan Socket.io
- Peran anggota: member, moderator, admin grup

### 🛡️ Dashboard Admin Global
- Statistik platform (total pengguna, jurnal, sentimen)
- Manajemen pengguna (blokir/pulihkan akun)
- Proteksi 2 langkah (TOTP) wajib untuk admin

---

## 🛠️ Tech Stack

### Frontend
| Teknologi    | Versi    | Keterangan                        |
| ------------ | -------- | --------------------------------- |
| Next.js      | 16.0.3   | React Framework (App Router)      |
| TypeScript   | 5.x      | Bahasa pemrograman                |
| Tailwind CSS | 4.x      | Utility-first CSS                 |
| Zustand      | 5.x      | State management                  |
| Axios        | 1.x      | HTTP client                       |
| Recharts     | 3.x      | Visualisasi grafik                |
| Socket.io    | 4.x      | Real-time communication (client)  |
| Shadcn UI    | —        | Komponen UI (Radix-based)         |

### Backend
| Teknologi       | Versi   | Keterangan                       |
| --------------- | ------- | -------------------------------- |
| Node.js         | >= 18   | Runtime                          |
| Express.js      | 5.x     | Web framework                    |
| Prisma          | 5.x     | ORM (MySQL)                      |
| JWT             | 9.x     | Autentikasi token                |
| Bcrypt          | 6.x     | Hashing password                 |
| Speakeasy       | 2.x     | TOTP 2FA                         |
| Socket.io       | 4.x     | Real-time communication (server) |
| Helmet          | 8.x     | HTTP security headers            |
| Multer          | 2.x     | File upload handling             |
| Cloudinary      | 1.x     | Cloud storage gambar             |
| Nodemailer      | 7.x     | Pengiriman email                 |

---

## 📁 Struktur Proyek

```
mind-garden/
├── README.md
├── backend/
│   ├── .env                    # Konfigurasi environment (tidak di-commit)
│   ├── server.js               # Entry point server
│   ├── seed.js                 # Seeder data demo
│   ├── seed-admin.js           # Seeder akun admin
│   ├── package.json
│   ├── prisma/
│   │   └── schema.prisma       # Definisi skema database
│   └── src/
│       ├── app.js              # Setup Express
│       ├── config/
│       │   └── database.js     # Koneksi Prisma
│       ├── controllers/        # Handler request
│       ├── middleware/          # Auth, validation, error handler
│       ├── routes/             # Definisi endpoint API
│       ├── services/           # Business logic
│       └── utils/              # Helper & logger
├── frontend/
│   ├── .env.local              # Konfigurasi environment (tidak di-commit)
│   ├── package.json
│   ├── next.config.ts
│   └── src/
│       ├── app/                # Halaman (App Router)
│       │   ├── (auth)/         # Login, Register, Verifikasi
│       │   ├── admin/          # Dashboard Admin
│       │   └── dashboard/      # Dashboard User
│       ├── components/         # Komponen UI reusable
│       ├── lib/                # API client & utilities
│       ├── store/              # Zustand stores
│       └── types/              # TypeScript type definitions
```

---

## 🔒 Keamanan

| Fitur                     | Implementasi                                        |
| ------------------------- | --------------------------------------------------- |
| Hashing Password          | Bcrypt dengan salt rounds 12                        |
| Token Autentikasi         | JWT dengan expiry 30 hari                           |
| 2FA Admin                 | TOTP (Time-based OTP) via Speakeasy + QR Code       |
| HTTP Security Headers     | Helmet.js                                           |
| CORS                      | Dikonfigurasi hanya untuk `CLIENT_URL`              |
| Rate Limiting             | 1000 request / 15 menit per IP                      |
| Input Validation          | Express Validator di middleware                      |
| SQL Injection Prevention  | Prisma ORM (parameterized queries)                  |
| XSS Prevention            | Sanitasi input + Helmet                             |
| File Upload Security      | Multer dengan batas ukuran & filter tipe file       |

---

## 🔑 Environment Variables

### Backend (`backend/.env`)

| Variabel                 | Wajib | Deskripsi                                    |
| ------------------------ | ----- | -------------------------------------------- |
| `NODE_ENV`               | Ya    | `development` atau `production`              |
| `PORT`                   | Ya    | Port server (default: `5000`)                |
| `DATABASE_URL`           | Ya    | Connection string MySQL                      |
| `JWT_SECRET`             | Ya    | Secret key untuk signing JWT                 |
| `JWT_EXPIRES_IN`         | Ya    | Masa berlaku token (contoh: `30d`)           |
| `CLOUDINARY_CLOUD_NAME`  | Ya    | Nama cloud Cloudinary                        |
| `CLOUDINARY_API_KEY`     | Ya    | API key Cloudinary                           |
| `CLOUDINARY_API_SECRET`  | Ya    | API secret Cloudinary                        |
| `EMAIL_HOST`             | Ya    | SMTP host (contoh: `smtp.gmail.com`)         |
| `EMAIL_PORT`             | Ya    | SMTP port (contoh: `587`)                    |
| `EMAIL_USER`             | Ya    | Alamat email pengirim                        |
| `EMAIL_PASS`             | Ya    | Password atau App Password email             |
| `EMAIL_FROM`             | Ya    | Nama pengirim email                          |
| `CLIENT_URL`             | Ya    | URL frontend (contoh: `http://localhost:3000`)|
| `BACKEND_URL`            | Ya    | URL backend (contoh: `http://localhost:5000`) |
| `MAX_FILE_SIZE`          | Tidak | Batas ukuran upload dalam bytes (default: 5MB)|

### Frontend (`frontend/.env.local`)

| Variabel                 | Wajib | Deskripsi                                    |
| ------------------------ | ----- | -------------------------------------------- |
| `NEXT_PUBLIC_API_URL`    | Ya    | URL API backend (contoh: `http://localhost:5000/api/v1`) |
| `NEXT_PUBLIC_APP_URL`    | Ya    | URL aplikasi frontend                        |

---

## 🆘 Troubleshooting

### `Error: P1001 - Can't reach database server`
- Pastikan MySQL sudah berjalan
- Periksa `DATABASE_URL` di `.env` (username, password, port, nama database)

### `Error: ECONNREFUSED` saat mengakses frontend
- Pastikan backend sudah berjalan di terminal terpisah
- Pastikan `NEXT_PUBLIC_API_URL` di `.env.local` sesuai dengan port backend

### `npx prisma db push` gagal
- Pastikan database `mindgarden` sudah dibuat di MySQL
- Pastikan `DATABASE_URL` sudah benar

### TOTP tidak valid saat login admin
- Pastikan jam di smartphone dan komputer sudah tersinkronisasi
- Kode TOTP berubah setiap 30 detik — masukkan kode yang paling baru

---

## 📄 Lisensi

ISC

---

<p align="center">
  Dibuat dengan 💚 oleh Tim MindGarden
</p>
