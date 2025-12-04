# 🛠️ Developer Dashboard - Quick Guide

## 🚀 Quick Start

1. **Login:** Username `develop` / Password `123`
2. **Manage Data:** Tambah/Edit/Hapus data di 4 tab tersedia
3. **Generate Code:** Klik tab "Generate Code" → Copy kode
4. **Update app.js:** Paste kode ke `app.js` (line 1-50)
5. **Done!** Refresh dashboard untuk lihat perubahan

---

## 📊 4 Tab Tersedia

| Tab | Deskripsi | Format Bulan |
|-----|-----------|--------------|
| 📊 Data Penjualan | Sumber data sales | Nama bulan (Desember, Januari) |
| 💰 Budget Iklan LKM | Budget ads LKM | YYYY-MM (2025-12) |
| 💰 Budget Iklan NUMETA | Budget ads NUMETA | YYYY-MM (2025-12) |
| 📦 Data Retur | Data return/RTS | YYYY-MM (2025-12) |

---

## ✅ Workflow Update Data

```
Login (develop/123) 
  → Tambah/Edit Data 
    → Validasi URL ✓ 
      → Generate Code 
        → Copy Code 
          → Paste ke app.js 
            → Save 
              → Refresh Dashboard ✓
```

---

## 🔗 Format URL Google Sheets

**WAJIB:**
- ✅ Sudah di-publish (File → Share → Publish to web)
- ✅ Mengandung `&output=csv`

**Contoh URL yang benar:**
```
https://docs.google.com/spreadsheets/d/e/2PACX-1vS3LSA3Z3e60bUzskklR1DScntT-n4TpKHbFmGiRtGMi2tNP-6swXW3_rxzIR1BnfFlCxS2CXuwH7rD/pub?gid=1771794388&single=true&output=csv
```

---

## 💡 Tips

- **Selalu validasi URL** sebelum save (klik tombol 🔍)
- **Backup app.js** sebelum replace kode
- **Test di 2 dashboard** (LKM & NUMETA) setelah update
- **Hard refresh** browser (Ctrl + Shift + R) jika data tidak muncul

---

## 🔐 All User Credentials

| Username | Password | Dashboard |
|----------|----------|-----------|
| 123 | 123 | LKM Dashboard |
| 321 | 321 | NUMETA Dashboard |
| develop | 123 | **Developer Dashboard** |

---

**Dokumentasi lengkap:** Lihat `CARA-UPDATE-DATA.md`

