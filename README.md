# 📊 Sales Dashboard - LKM & NUMETA

Dashboard penjualan interaktif untuk monitoring data sales, budget iklan, dan retur untuk LKM (Luzie Kreatif Mandiri) dan NUMETA.

---

## 🚀 Quick Start

### Login Credentials

| Username | Password | Dashboard | Purpose |
|----------|----------|-----------|---------|
| **123** | **123** | LKM Dashboard | View LKM sales data |
| **321** | **321** | NUMETA Dashboard | View NUMETA sales data |
| **develop** | **123** | **Developer Dashboard** | **Manage data sources** |

### Cara Pakai

1. Buka `login.html` di browser
2. Masukkan username & password sesuai role
3. Dashboard akan otomatis load data dari Google Sheets

---

## ✨ Fitur Utama

### 📊 Sales Dashboard (LKM & NUMETA)

- **Real-time Data:** Data di-fetch langsung dari Google Sheets
- **Multi-Filter:** Filter by bulan, marketplace, toko, unit bisnis
- **Visualisasi:** 10+ chart interaktif (Chart.js)
- **Metrics:** Omset, Margin, Budget Iklan, Retur, Profit, ROI
- **Export:** Export data ke CSV
- **Dark Mode:** 3 mode tampilan (Light, Dark, Wallpaper)
- **Color Palettes:** 5 pilihan color palette
- **Responsive:** Mobile-friendly design

### 🛠️ Developer Dashboard (NEW!)

- **Data Management:** Tambah/Edit/Hapus data sources
- **URL Validation:** Validasi Google Sheets URL sebelum save
- **Code Generation:** Auto-generate JavaScript code untuk `app.js`
- **View as LKM/NUMETA:** Preview dashboard sebagai user lain
- **LocalStorage:** Data tersimpan di browser

**📚 Dokumentasi Developer Dashboard:** Lihat `INDEX-DOKUMENTASI.md`

---

## 📁 Struktur Project

```
DASHBOARD SALAES/
├── index.html                  # Landing page
├── login.html                  # Login page
├── dashboard.html              # Main dashboard (LKM & NUMETA)
├── develop.html               # Developer dashboard (NEW!)
├── app.js                     # Main logic (6000+ lines)
├── develop.js                 # Developer dashboard logic (NEW!)
├── styles.css                 # Styles
├── package.json               # Dependencies
├── netlify.toml               # Netlify config
├── vercel.json                # Vercel config
│
├── scripts/
│   └── build-dashboard-data.js
│
├── generated/
│   └── dashboard-data.js
│
└── docs/                      # Dokumentasi (NEW!)
    ├── INDEX-DOKUMENTASI.md          # Index semua dokumentasi
    ├── FITUR-BARU-DEVELOP-DASHBOARD.md
    ├── README-DEVELOP.md
    ├── CARA-UPDATE-DATA.md
    ├── QUICK-REFERENCE.md
    ├── VISUAL-GUIDE.md
    ├── TEST-DEVELOP-DASHBOARD.md
    └── SUMMARY-DEVELOP-DASHBOARD.md
```

---

## 🔧 Setup & Installation

### Prerequisites

- Node.js (v14+)
- Modern browser (Chrome, Firefox, Edge, Safari)

### Installation

```bash
# Clone repository
git clone https://github.com/HambaGod/SALES-REPORT.git

# Install dependencies
npm install

# Run local server (optional)
npm start
```

### Deployment

**Netlify:**
```bash
netlify deploy --prod
```

**Vercel:**
```bash
vercel --prod
```

**GitHub Pages:**
- Push ke repository
- Enable GitHub Pages di Settings

---

## 📊 Data Sources

Dashboard mengambil data dari Google Sheets yang sudah di-publish:

- **Data Penjualan:** Oktober, November, September, Desember
- **Budget Iklan LKM:** 2025-10, 2025-11, 2025-12
- **Budget Iklan NUMETA:** 2025-10, 2025-11
- **Data Retur:** 2025-10, 2025-11

**Cara Update Data:**
1. Login sebagai DEVELOP (999/999)
2. Gunakan Developer Dashboard untuk manage data sources
3. Generate code & paste ke `app.js`

**📚 Panduan Lengkap:** Lihat `CARA-UPDATE-DATA.md`

---

## 🎨 Features Detail

### Charts & Visualizations

1. **Omset Chart** - Total omset per minggu
2. **Margin Chart** - Margin per minggu
3. **Profit Chart** - Profit (Margin - Budget - Retur)
4. **ROI Chart** - Return on Investment
5. **Harga Jual Chart** - Harga jual per minggu
6. **Lead Lag Chart** - Lead time & lag time
7. **Store Performance** - Performance per toko
8. **Product Performance** - Performance per produk
9. **Marketplace Distribution** - Distribusi per marketplace
10. **Trend Chart** - Trend analysis

### Filters

- **Bulan:** Pilih bulan data
- **Marketplace:** All / Shopee / TikTok / Lazada / dll
- **Toko:** Filter by specific store
- **Unit Bisnis:** LKM / NUMETA / LBM
- **Date Range:** Custom date range

### Display Modes

- **Light Mode:** Default light theme
- **Dark Mode:** Dark theme untuk malam hari
- **Wallpaper Mode:** Transparent background untuk wallpaper

### Color Palettes

5 pilihan color palette untuk customization:
- Palette 1: Blue tones (default LKM)
- Palette 2: Green tones
- Palette 3: Purple tones
- Palette 4: Orange tones (default NUMETA)
- Palette 5: Red tones

---

## 🔐 Security

- **Password Hashing:** SHA-256 hashing untuk semua password
- **Session Management:** SessionStorage untuk login state
- **No Backend:** Pure frontend, no server-side code
- **HTTPS:** Recommended untuk production

---

## 🧪 Testing

**Manual Testing:**
1. Test login untuk 3 user types
2. Test semua filters & charts
3. Test export CSV
4. Test responsive design
5. Test dark mode & color palettes

**Developer Dashboard Testing:**
- Lihat `TEST-DEVELOP-DASHBOARD.md` untuk checklist lengkap

---

## 📚 Dokumentasi

### Untuk End User
- 📄 `README.md` (file ini)
- 📄 `QUICK-REFERENCE.md` - Cheat sheet
- 📄 `CARA-UPDATE-DATA.md` - Panduan update data

### Untuk Developer
- 📄 `SUMMARY-DEVELOP-DASHBOARD.md` - Technical details
- 📄 `TEST-DEVELOP-DASHBOARD.md` - Testing guide

### Index Dokumentasi
- 📄 `INDEX-DOKUMENTASI.md` - Index semua dokumentasi

---

## 🐛 Troubleshooting

### Data tidak muncul
- Hard refresh browser (Ctrl + Shift + R)
- Clear browser cache
- Check console (F12) untuk error

### Login tidak berhasil
- Pastikan username & password benar
- Clear sessionStorage: `sessionStorage.clear()`

### Chart tidak render
- Pastikan Chart.js loaded
- Check console untuk error
- Refresh page

### Data tidak update setelah edit app.js
- Pastikan file sudah di-save
- Hard refresh browser
- Check apakah kode di-paste dengan benar

**📚 Troubleshooting Lengkap:** Lihat `CARA-UPDATE-DATA.md`

---

## 🚀 Deployment URLs

- **Production:** https://sales-dashboard-lkm.netlify.app (example)
- **Staging:** https://sales-dashboard-staging.netlify.app (example)
- **GitHub:** https://github.com/HambaGod/SALES-REPORT

---

## 📝 Changelog

### v2.0.0 (Dec 4, 2025) - Developer Dashboard
- ✨ Added Developer Dashboard
- ✨ Added data management (CRUD)
- ✨ Added URL validation
- ✨ Added code generation
- ✨ Added "View as" feature
- 📚 Added comprehensive documentation (8 files)
- 🐛 Fixed December data loading
- 🐛 Fixed NUMETA default color palette

### v1.0.0 (Nov 2025) - Initial Release
- ✨ Initial dashboard for LKM & NUMETA
- ✨ 10+ interactive charts
- ✨ Multi-filter system
- ✨ Dark mode & color palettes
- ✨ Export to CSV

---

## 👥 Contributors

- **Developer:** AI Assistant
- **Client:** HambaGod

---

## 📄 License

Private project - All rights reserved

---

## 🆘 Support

Untuk bantuan:
1. Baca dokumentasi di folder `docs/`
2. Check `QUICK-REFERENCE.md` untuk quick help
3. Check `CARA-UPDATE-DATA.md` untuk panduan lengkap
4. Contact developer/admin

---

## 🎉 What's New in v2.0?

### 🛠️ Developer Dashboard
**No more manual editing `app.js`!**

Sekarang Anda bisa manage data sources melalui UI yang user-friendly:
- ✅ Tambah/Edit/Hapus data dengan mudah
- ✅ Validasi URL sebelum save
- ✅ Generate JavaScript code otomatis
- ✅ Copy-paste ke `app.js`
- ✅ Preview dashboard sebagai LKM/NUMETA

**Login:** Username `999` / Password `999`

**📚 Dokumentasi:** Lihat `FITUR-BARU-DEVELOP-DASHBOARD.md`

---

**Built with ❤️ using Chart.js, Vanilla JavaScript, and lots of coffee ☕**

**Last Updated:** December 4, 2025

