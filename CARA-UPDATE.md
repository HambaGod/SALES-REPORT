# Cara Update Aplikasi di Netlify

Setelah Anda melakukan perubahan pada kode, ikuti langkah-langkah berikut untuk memperbarui aplikasi di Netlify:

## 🚀 Cara 1: Menggunakan Script (Paling Mudah)

1. **Double-click file:** `deploy-netlify.bat`
   
   Atau buka Command Prompt/PowerShell di folder project dan jalankan:
   ```bash
   deploy-netlify.bat
   ```

2. Script akan otomatis:
   - Upload file yang berubah
   - Deploy ke production
   - Memberikan URL baru

## 🚀 Cara 2: Menggunakan Command Manual

Buka Command Prompt/PowerShell di folder project dan jalankan:

```bash
npx netlify-cli deploy --prod --dir "D:\DASHBOARD SALAES"
```

## 🚀 Cara 3: Menggunakan Netlify Drop (Alternatif)

Jika cara CLI tidak bekerja:

1. Buka https://app.netlify.com/drop
2. Drag & drop seluruh folder project lagi
3. Netlify akan membuat deployment baru

## 📝 Tips Penting

### ✅ Yang Perlu Dilakukan Setiap Update:
1. Pastikan semua perubahan sudah disimpan
2. Jalankan `deploy-netlify.bat` atau command di atas
3. Tunggu sampai muncul pesan "Deploy is live!"
4. Buka URL aplikasi untuk verifikasi

### ⚡ Deployment Cepat:
- Netlify hanya akan upload file yang berubah (incremental deployment)
- Proses biasanya hanya butuh 10-30 detik
- URL aplikasi tetap sama: `https://bejewelled-raindrop-f796c4.netlify.app`

### 🔍 Cara Cek Update Berhasil:
1. Buka URL aplikasi di browser
2. Tekan `Ctrl + F5` (hard refresh) untuk melihat versi terbaru
3. Atau buka Netlify Dashboard untuk melihat log deployment

## 🎯 Workflow Update yang Disarankan

```
1. Edit kode di aplikasi
   ↓
2. Simpan semua file
   ↓
3. Jalankan deploy-netlify.bat
   ↓
4. Tunggu deployment selesai
   ↓
5. Test aplikasi di browser
```

## 📊 Melihat History Deployment

Untuk melihat semua deployment yang pernah dilakukan:

1. Buka https://app.netlify.com
2. Pilih site Anda: `bejewelled-raindrop-f796c4`
3. Klik tab "Deploys" untuk melihat history

## ⚠️ Troubleshooting

**Jika deployment gagal:**
- Pastikan semua file sudah disimpan
- Cek apakah ada error di terminal
- Pastikan koneksi internet stabil
- Coba jalankan command lagi

**Jika perubahan tidak muncul:**
- Hard refresh browser: `Ctrl + F5`
- Clear cache browser
- Cek Netlify Dashboard untuk memastikan deployment berhasil


