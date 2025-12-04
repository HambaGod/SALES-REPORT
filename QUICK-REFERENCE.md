# 🚀 Quick Reference Card

## 🔐 All Login Credentials

| Username | Password | Dashboard | Purpose |
|----------|----------|-----------|---------|
| **123** | **123** | LKM Dashboard | View LKM sales data |
| **321** | **321** | NUMETA Dashboard | View NUMETA sales data |
| **develop** | **123** | **Developer Dashboard** | **Manage data sources** |

---

## ⚡ Quick Update Data (5 Steps)

```
1. Login: 999/999
2. Add/Edit: Tambah atau edit data di tab yang sesuai
3. Validate: Klik 🔍 Validasi URL
4. Generate: Tab "Generate Code" → Copy code
5. Apply: Paste ke app.js (line 1-50) → Save → Refresh
```

---

## 📊 4 Tab di Developer Dashboard

| Tab | Data Type | Format Bulan | Example |
|-----|-----------|--------------|---------|
| 📊 Data Penjualan | Sales data | Nama bulan | Desember, Januari |
| 💰 Budget Iklan LKM | LKM ads budget | YYYY-MM | 2025-12 |
| 💰 Budget Iklan NUMETA | NUMETA ads budget | YYYY-MM | 2025-12 |
| 📦 Data Retur | Return/RTS data | YYYY-MM | 2025-12 |

---

## 🔗 URL Format Google Sheets

**WAJIB mengandung:**
```
&output=csv
```

**Contoh URL yang benar:**
```
https://docs.google.com/spreadsheets/d/e/2PACX-1vS3LSA.../pub?gid=1771794388&single=true&output=csv
```

**Cara publish Google Sheets:**
```
File → Share → Publish to web → Link → Entire Document → Web page → Publish
Lalu tambahkan &output=csv di akhir URL
```

---

## 🎯 Common Tasks

### Add New Month
```
Developer Dashboard → Tab yang sesuai → + Tambah Bulan → Input data → Validasi → Save
```

### Edit Existing Month
```
Developer Dashboard → Tab yang sesuai → Edit → Update data → Validasi → Save
```

### Delete Month
```
Developer Dashboard → Tab yang sesuai → Hapus → Confirm
```

### Apply Changes to Dashboard
```
Tab "Generate Code" → Generate → Copy → Open app.js → Paste (line 1-50) → Save → Refresh dashboard
```

### View Dashboard as LKM/NUMETA
```
Developer Dashboard → View as LKM / View as NUMETA → 🛠️ Developer (untuk kembali)
```

---

## 🐛 Troubleshooting

| Problem | Solution |
|---------|----------|
| Data tidak muncul | Hard refresh (Ctrl+Shift+R) atau clear cache |
| URL tidak valid | Pastikan ada `&output=csv` dan sudah di-publish |
| Generate code tidak muncul | Refresh Developer Dashboard |
| Dashboard kosong setelah update | Check apakah `app.js` sudah di-save |

---

## 📚 Documentation Files

| File | Description |
|------|-------------|
| `FITUR-BARU-DEVELOP-DASHBOARD.md` | Overview fitur baru |
| `CARA-UPDATE-DATA.md` | Dokumentasi lengkap |
| `README-DEVELOP.md` | Quick guide |
| `TEST-DEVELOP-DASHBOARD.md` | Testing checklist |
| `QUICK-REFERENCE.md` | This file (cheat sheet) |

---

## 💡 Pro Tips

1. **Backup dulu** sebelum replace `app.js`
2. **Validasi URL** sebelum save (tombol 🔍)
3. **Test di 2 dashboard** (LKM & NUMETA) setelah update
4. **Hard refresh** browser jika data tidak update
5. **Check console** (F12) jika ada error

---

## 🎨 Color Palette Default

- **LKM User:** Palette 1 (default)
- **NUMETA User:** Palette 4 (default)

---

**Print this page for quick reference! 📄**

