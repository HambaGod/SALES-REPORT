# 🌐 CARA MEMBUAT PROJECT BISA DI AKSES ONLINE

Ada 2 cara untuk membuat project bisa diakses teman-teman Anda:

---

## 🚀 CARA 1: Deploy ke Netlify (PERMANEN - RECOMMENDED)

**Keuntungan:**
- ✅ Bisa diakses 24/7 dari mana saja
- ✅ Tidak perlu server lokal jalan
- ✅ URL tetap (tidak berubah)
- ✅ GRATIS!

### Langkah-langkah:

1. **Buka Browser** → Kunjungi: https://app.netlify.com/drop

2. **Login** dengan GitHub/Email/Google

3. **Drag & Drop FOLDER `DEPLOY-NETLIFY`** ke halaman Netlify
   - **JANGAN** drag file satu-satu
   - **DRAG SELURUH FOLDER** `DEPLOY-NETLIFY`

4. **Tunggu** sampai upload selesai

5. **Dapat URL** seperti: `https://random-name-12345.netlify.app`

6. **Bagikan URL** ke teman-teman Anda!

**Selesai!** Dashboard bisa diakses dari mana saja!

---

## ⚡ CARA 2: Pakai ngrok (CEPAT - SEMENTARA)

**Keuntungan:**
- ✅ Cepat (langsung bisa)
- ✅ Tidak perlu upload

**Kekurangan:**
- ❌ Harus server lokal jalan
- ❌ URL berubah setiap kali restart
- ❌ Laptop harus nyala

### Langkah-langkah:

1. **Install ngrok**:
   - Download dari: https://ngrok.com/download
   - Extract file `ngrok.exe`
   - Simpan di folder project atau folder yang mudah diakses

2. **Jalankan server lokal**:
   - Double-click `start-server.bat`
   - Pastikan server jalan di `http://localhost:4173`

3. **Jalankan ngrok**:
   - Buka terminal/PowerShell baru
   - Masuk ke folder tempat `ngrok.exe`
   - Jalankan:
     ```bash
     ngrok http 4173
     ```

4. **Dapat URL**:
   - ngrok akan memberikan URL seperti: `https://abc123.ngrok.io`
   - **Copy URL ini**

5. **Bagikan URL** ke teman-teman!

**Catatan**: 
- URL ngrok akan berubah setiap kali restart ngrok
- Server lokal harus tetap jalan
- Laptop harus tetap nyala

---

## 📋 REKOMENDASI

**Pakai CARA 1 (Netlify)** karena:
- ✅ Permanen (tidak perlu server lokal)
- ✅ URL tetap
- ✅ Bisa diakses kapan saja
- ✅ Lebih praktis untuk dibagikan

---

## 🎯 CARA TERMUDAH: Deploy ke Netlify

1. **Buka**: https://app.netlify.com/drop
2. **Login**
3. **Drag folder `DEPLOY-NETLIFY`** ke Netlify
4. **Dapat URL** → Bagikan ke teman!

**SELESAI!** 🎉

