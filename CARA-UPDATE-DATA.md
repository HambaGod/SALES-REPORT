# 📚 Cara Update Data Dashboard

## 🔐 Login sebagai DEVELOP

1. Buka `login.html`
2. Masukkan credentials:
   - **Username:** `develop`
   - **Password:** `123`
3. Klik **Login**
4. Anda akan otomatis diarahkan ke **Developer Dashboard**

---

## 🛠️ Fitur Developer Dashboard

### 1️⃣ **Data Penjualan**
Mengelola sumber data penjualan bulanan (format: Nama Bulan)

**Cara Tambah Data:**
- Klik tombol **"+ Tambah Bulan"**
- Isi **Nama Bulan** (contoh: `Desember`, `Januari`)
- Paste **Google Sheets URL** (pastikan sudah publish & ada `output=csv`)
- Klik **"🔍 Validasi URL"** untuk memastikan link bisa diakses
- Jika validasi berhasil, klik **"Simpan"**

**Cara Edit Data:**
- Klik tombol **"Edit"** pada baris yang ingin diubah
- Update nama bulan atau URL
- Klik **"Simpan"**

**Cara Hapus Data:**
- Klik tombol **"Hapus"** pada baris yang ingin dihapus
- Konfirmasi penghapusan

---

### 2️⃣ **Budget Iklan LKM**
Mengelola data budget iklan untuk LKM (format: YYYY-MM)

**Cara Tambah Data:**
- Klik tombol **"+ Tambah Bulan"**
- Isi **Bulan** dalam format `YYYY-MM` (contoh: `2025-12`, `2025-01`)
- Paste **Google Sheets URL**
- Klik **"🔍 Validasi URL"**
- Klik **"Simpan"**

---

### 3️⃣ **Budget Iklan NUMETA**
Mengelola data budget iklan untuk NUMETA (format: YYYY-MM)

Cara penggunaannya sama dengan Budget Iklan LKM.

---

### 4️⃣ **Data Retur**
Mengelola data retur/RTS (format: YYYY-MM)

Cara penggunaannya sama dengan Budget Iklan.

---

### 5️⃣ **Generate Code** ⚡

Setelah selesai menambah/edit data, Anda perlu update `app.js`:

1. Klik tab **"⚡ Generate Code"**
2. Klik tombol **"⚡ Generate Code"**
3. Kode JavaScript akan muncul di layar
4. Klik **"📋 Copy to Clipboard"**
5. Buka file `app.js` di editor (VS Code, Notepad++, dll)
6. **Cari bagian konfigurasi** di awal file (sekitar line 1-50)
7. **Replace/ganti** konfigurasi lama dengan kode yang baru di-copy
8. **Save** file `app.js`
9. **Refresh** dashboard untuk melihat perubahan

---

## 📋 Checklist Update Data

- [ ] Login ke Developer Dashboard (999/999)
- [ ] Tambah/Edit data di tab yang sesuai
- [ ] Validasi semua URL (pastikan status ✓ Active)
- [ ] Generate Code
- [ ] Copy code ke clipboard
- [ ] Buka `app.js` di editor
- [ ] Replace konfigurasi lama dengan kode baru
- [ ] Save `app.js`
- [ ] Refresh dashboard
- [ ] Test data di dashboard LKM & NUMETA

---

## ⚠️ Catatan Penting

1. **Format URL Google Sheets:**
   - Harus sudah di-**publish** (File → Share → Publish to web)
   - Harus mengandung `&output=csv` di akhir URL
   - Contoh: `https://docs.google.com/spreadsheets/d/e/2PACX-.../pub?gid=1771794388&single=true&output=csv`

2. **Format Bulan:**
   - **Data Penjualan:** Nama bulan (Desember, Januari, dll)
   - **Data Lainnya:** Format YYYY-MM (2025-12, 2025-01, dll)

3. **Validasi URL:**
   - Selalu klik tombol **"🔍 Validasi URL"** sebelum menyimpan
   - Pastikan status validasi **"✓ URL Valid"**

4. **Backup:**
   - Sebelum replace kode di `app.js`, sebaiknya backup dulu file aslinya
   - Copy isi `app.js` ke file baru (misal: `app.js.backup`)

5. **Testing:**
   - Setelah update `app.js`, test login sebagai user LKM (123/123)
   - Test juga login sebagai user NUMETA (321/321)
   - Pastikan data muncul dengan benar di kedua dashboard

---

## 🆘 Troubleshooting

### Data tidak muncul setelah update
- Pastikan sudah **save** file `app.js`
- Lakukan **hard refresh** di browser (Ctrl + Shift + R)
- Clear cache browser

### URL tidak valid
- Pastikan Google Sheets sudah di-publish
- Pastikan URL mengandung `&output=csv`
- Test buka URL di browser baru, harusnya download file CSV

### Generate Code tidak muncul
- Pastikan sudah menambahkan minimal 1 data
- Refresh halaman Developer Dashboard
- Check console browser (F12) untuk error

---

## 👨‍💻 User Credentials

| User Type | Username | Password | Akses Dashboard |
|-----------|----------|----------|-----------------|
| LKM       | 123      | 123      | Dashboard LKM   |
| NUMETA    | 321      | 321      | Dashboard NUMETA|
| DEVELOP   | develop  | 123      | Developer Dashboard |

---

**Happy Coding! 🚀**

