# 🚀 DEPLOY VIA GITHUB & VERCEL

## LANGKAH 1: Setup Git & Push ke GitHub

### 1.1. Buka Terminal/PowerShell di folder project

Buka PowerShell di folder: `D:\VISUALLISASI DATA`

### 1.2. Konfigurasi Git (Hanya sekali)

```bash
git config --global user.email "rizkikurniawan2207@gmail.com"
git config --global user.name "Rizki Kurniawan"
```

### 1.3. Initialize Git Repository

```bash
git init
```

### 1.4. Add File ke Git

```bash
git add .
```

### 1.5. Commit File

```bash
git commit -m "Initial commit - Sales Report Dashboard LKM"
```

### 1.6. Buat Repository di GitHub

1. Buka browser → https://github.com
2. Login dengan:
   - Email: `rizkikurniawan2207@gmail.com`
   - Password: `github2207`
3. Klik tombol **"+"** di pojok kanan atas → **"New repository"**
4. Isi:
   - **Repository name**: `sales-report-lkm` (atau nama lain)
   - **Description**: (opsional) "Sales Report Dashboard LKM"
   - **Visibility**: Pilih **Public** atau **Private**
   - **JANGAN** centang "Add a README file"
   - **JANGAN** centang "Add .gitignore"
   - **JANGAN** centang "Choose a license"
5. Klik **"Create repository"**

### 1.7. Push ke GitHub

Setelah repository dibuat, GitHub akan menampilkan instruksi. Jalankan perintah ini (ganti `YOUR_USERNAME` dengan username GitHub Anda):

```bash
git remote add origin https://github.com/YOUR_USERNAME/sales-report-lkm.git
git branch -M main
git push -u origin main
```

**Saat diminta password**, masukkan: `github2207`

**Catatan**: Jika password tidak bisa, gunakan **Personal Access Token**:
1. GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Generate new token
3. Beri nama: "Deploy Token"
4. Centang scope: `repo`
5. Generate token
6. **Copy token** (hanya muncul sekali!)
7. Gunakan token sebagai password saat push

---

## LANGKAH 2: Deploy ke Vercel

### 2.1. Buka Vercel

1. Buka browser → https://vercel.com
2. Klik **"Sign Up"** atau **"Log In"**
3. Pilih **"Continue with GitHub"**
4. Authorize Vercel untuk akses GitHub

### 2.2. Import Project

1. Setelah login, klik **"Add New..."** → **"Project"**
2. Pilih repository **`sales-report-lkm`** (atau nama repo Anda)
3. Klik **"Import"**

### 2.3. Konfigurasi Deploy

1. **Framework Preset**: Pilih **"Other"** atau **"Vite"**
2. **Root Directory**: (kosongkan atau `.`)
3. **Build Command**: (kosongkan)
4. **Output Directory**: (kosongkan atau `.`)
5. **Install Command**: (kosongkan)

### 2.4. Deploy!

1. Klik **"Deploy"**
2. Tunggu sampai proses deploy selesai
3. **Dapat URL** seperti: `https://sales-report-lkm.vercel.app`

### 2.5. Selesai!

**URL dashboard Anda**: `https://sales-report-lkm.vercel.app`

**Bagikan URL ini ke teman-teman!** 🎉

---

## 🔄 UPDATE DASHBOARD (Setelah Ada Perubahan)

Setelah mengubah file, jalankan:

```bash
git add .
git commit -m "Update dashboard"
git push
```

Vercel akan **otomatis deploy ulang** dalam beberapa detik!

---

## 📝 CATATAN PENTING

1. **Password GitHub**: Jika password tidak bisa, gunakan Personal Access Token
2. **Repository**: Pastikan repository sudah dibuat di GitHub dulu
3. **Vercel**: Setelah pertama kali import, setiap push ke GitHub akan auto-deploy
4. **URL**: URL Vercel akan tetap sama, tidak berubah

---

## 🆘 TROUBLESHOOTING

### Git push error "Authentication failed"
- Gunakan Personal Access Token sebagai password
- Atau setup SSH key

### Vercel deploy error
- Pastikan file `vercel.json` sudah ada
- Pastikan `index.html` ada di root folder
- Cek log deploy di Vercel dashboard

