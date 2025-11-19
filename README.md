# Sales Report Dashboard LKM

Dashboard visualisasi data penjualan dengan data real-time dari Google Sheets. Dashboard ini menampilkan berbagai metrik penjualan, retur, dan analisis data dalam bentuk chart interaktif.

## 📋 Daftar Isi

1. [Cara Menjalankan Dashboard](#cara-menjalankan-dashboard)
2. [Sistem Login](#sistem-login)
3. [Fitur-Fitur Dashboard](#fitur-fitur-dashboard)
4. [Penjelasan Per Card](#penjelasan-per-card)
5. [Logika Perhitungan](#logika-perhitungan)
6. [Deployment](#deployment)

---

## 🚀 Cara Menjalankan Dashboard

### Langkah 1: Buka Laptop dan Aktifkan Server

Setiap kali pertama kali membuka laptop, Anda perlu menjalankan server lokal terlebih dahulu:

1. **Buka folder project** di File Explorer
2. **Double-click file `start-server.bat`**
   - File ini akan otomatis menjalankan server lokal di port 4173
   - Server akan berjalan di background
   - Terminal akan menampilkan pesan: `Serving! - Local: http://localhost:4173`

3. **Untuk menghentikan server**, double-click file `stop-server.bat`

### Langkah 2: Akses Dashboard

1. Buka browser (Chrome, Firefox, Edge, dll)
2. Ketik atau paste URL: `http://localhost:4173`
3. Browser akan otomatis redirect ke halaman login

---

## 🔐 Sistem Login

### Halaman Login

Dashboard dilindungi dengan sistem autentikasi sederhana:

- **Username**: `user`
- **Password**: `123`

### Fitur Login

- **Background**: Menggunakan gambar "gambar 1.png" dengan efek glassmorphism
- **Input Fields**: Username dan password menggunakan efek glass (transparan dengan blur)
- **Validasi**: Form akan menampilkan error jika username/password salah
- **Session**: Menggunakan `sessionStorage`, akan logout otomatis saat browser ditutup

### Cara Login

1. Masukkan username: `user`
2. Masukkan password: `123`
3. Klik tombol **Login**
4. Jika berhasil, akan redirect ke dashboard

### Logout

- Klik tombol **Logout** (merah) di header dashboard
- Session akan dihapus dan redirect ke halaman login

---

## 🎨 Fitur-Fitur Dashboard

### 1. Filter Data

Dashboard memiliki beberapa filter untuk memfilter data:

#### a. Pilih Bulan
- Dropdown untuk memilih bulan yang ingin ditampilkan
- Data yang tersedia: September, Oktober, November
- Data diambil dari Google Sheets yang berbeda untuk setiap bulan

#### b. Markeplace/Kemitraan
- Filter berdasarkan marketplace/kemitraan (TikTok, Shopee, dll)
- Opsi "All" untuk menampilkan semua marketplace
- Filter ini mempengaruhi:
  - Data omset
  - Data retur/RTS
  - Label chart (jika pilih TikTok, label chart menjadi "TikTok")

#### c. Mode Tampilan
- **Light Mode**: Tampilan terang dengan background putih
- **Dark Mode**: Tampilan gelap dengan background hitam
- **Wallpaper**: Background menggunakan gambar "gambar 1.png" dengan efek fixed (tidak ikut scroll)

#### d. Color Palette
- 4 pilihan color palette (Palette 1, 2, 3, 4)
- Mempengaruhi warna chart dan elemen UI
- Setiap palette memiliki warna berbeda untuk light dan dark mode

### 2. Tombol Refresh

- Tombol **Refresh** (orange) di header
- Berfungsi untuk mengambil data terbaru dari Google Sheets
- Menampilkan loading indicator saat proses refresh

### 3. Responsive Design

- Dashboard responsive untuk berbagai ukuran layar
- Card akan menyesuaikan layout secara otomatis

---

## 📊 Penjelasan Per Card

Dashboard terdiri dari 7 card utama yang menampilkan berbagai visualisasi data:

### Card 1: Omset Bersih & Omset

Card ini menampilkan 2 chart yang dipisahkan dengan garis separator:

#### a. Omset Bersih (Bagian Atas)
- **Judul**: "Omset Bersih"
- **Subtitle**: "Total Omset - Retur/RTS"
- **Chart Type**: Bar Chart
- **Data**: Menampilkan omset bersih per minggu (Week 1-4)
- **Total**: Menampilkan total omset bersih di caption kanan
- **Warna**: Menggunakan warna kedua dari color palette (sama dengan Total Harga Jual)

**Logika Perhitungan**:
```
Omset Bersih = Total Omset - Total Retur/RTS
```

#### b. Omset (Bagian Bawah)
- **Judul**: "Omset"
- **Subtitle**: "Harga Jual - Subsidi Ongkir"
- **Chart Type**: Bar Chart
- **Data**: Menampilkan omset per minggu (Week 1-4)
- **Total**: Menampilkan total omset di caption kanan
- **Warna**: Menggunakan warna pertama dari color palette
- **Label**: Mengikuti pilihan Markeplace/Kemitraan (jika pilih TikTok, label menjadi "TikTok")

**Logika Perhitungan**:
```
Omset = Harga Jual (Kolom AA) - Subsidi Ongkir (Kolom W)
```

**Sumber Data**:
- Kolom "Harga Jual" (Kolom AA)
- Kolom "Subsidi Ongkir" (Kolom W)

---

### Card 2: Retur/RTS & Total Harga Jual

Card ini menampilkan 2 chart yang dipisahkan dengan garis separator:

#### a. Retur/RTS (Bagian Atas)
- **Judul**: "Retur/RTS"
- **Subtitle**: "RTS Harga Jual - RTS Nominal Diskon"
- **Chart Type**: Area Chart (Line Chart dengan fill)
- **Data**: Menampilkan retur/RTS per minggu (Week 1-4)
- **Total**: Menampilkan total retur/RTS di caption kanan
- **Loading**: Menampilkan spinner saat data sedang diambil
- **Keterangan Oktober**: Jika bulan Oktober dipilih, akan muncul keterangan "Perhitungan Retur Oktober Masih Dalam Penyesuaian"

**Logika Perhitungan**:

**Untuk Bulan Oktober**:
- Jumlahkan semua data di **Kolom X** (PENYESUAIAN RTS)
- Filter: Kolom C = "LKM"
- Filter: Kolom B sesuai dengan pilihan Markeplace/Kemitraan

**Untuk Bulan November dan seterusnya**:
- Jumlahkan semua data di **Kolom Y**
- Filter: Kolom D = "LKM"
- Filter: Kolom B sesuai dengan pilihan Markeplace/Kemitraan

**Sumber Data**:
- Google Sheets Retur (URL berbeda untuk setiap bulan)
- Oktober: URL khusus untuk Oktober
- November: URL khusus untuk November
- Bulan lain: Tidak ada data retur (menampilkan Rp 0)

**Catatan**: Data retur hanya tersedia untuk bulan Oktober dan November. Bulan lain akan menampilkan Rp 0.

#### b. Total Harga Jual (Bagian Bawah)
- **Judul**: "Total Harga Jual"
- **Subtitle**: "Harga yang di berikan kepada Customer"
- **Chart Type**: Area Chart (Line Chart dengan fill)
- **Data**: Menampilkan total harga jual per minggu (Week 1-4)
- **Total**: Menampilkan total harga jual di caption kanan
- **Warna**: Menggunakan warna kedua dari color palette (sama dengan Omset Bersih)

**Logika Perhitungan**:
```
Total Harga Jual = Sum dari Kolom AA (Harga Jual) per minggu
```

**Sumber Data**:
- Kolom "Harga Jual" (Kolom AA) dari Google Sheets utama

---

### Card 3: Breakdown

- **Judul**: "Breakdown"
- **Chart Type**: Donut Chart
- **Data**: Breakdown berdasarkan Revenue Type
- **Dropdown**: "Revenue Type" (fixed, tidak bisa diubah)
- **Legend**: Menampilkan persentase untuk setiap kategori

**Logika Perhitungan**:
- Mengelompokkan data berdasarkan Revenue Type (TRANSFER, COD, dll)
- Menghitung total untuk setiap kategori
- Menampilkan dalam bentuk persentase

**Sumber Data**:
- Kolom "Revenue Type" dari Google Sheets utama

---

### Card 4: Variance Analysis

- **Judul**: "Variance Analysis"
- **Subtitle**: "Actual vs Expected"
- **Chart Type**: Bar Chart
- **Data**: Perbandingan antara actual dan expected revenue

**Logika Perhitungan**:
- Menghitung variance antara actual dan expected
- Actual: Data real dari Google Sheets
- Expected: Data yang diharapkan (jika ada)

---

### Card 5: Trend Analysis

- **Judul**: "Trend Analysis"
- **Subtitle**: "Weekly view"
- **Chart Type**: Line Chart
- **Toggle**: 
  - **Revenue**: Menampilkan trend revenue per minggu
  - **CAGR**: Menampilkan Compound Annual Growth Rate

**Logika Perhitungan**:
- **Revenue**: Menampilkan total revenue per minggu
- **CAGR**: Menghitung pertumbuhan compound dari minggu ke minggu

---

### Card 6: Contribution Analysis

- **Judul**: "Contribution Analysis"
- **Subtitle**: "Top DOA categories"
- **Chart Type**: Horizontal Bar Chart
- **Data**: Top 4 kategori DOA berdasarkan kontribusi

**Logika Perhitungan**:
- Mengelompokkan data berdasarkan DOA Type
- Mengurutkan berdasarkan total kontribusi (tertinggi ke terendah)
- Menampilkan top 4 kategori

**Sumber Data**:
- Kolom "DOA Type" dari Google Sheets utama

---

### Card 8: Peta Distribusi Order

- **Judul**: "Peta Distribusi Order"
- **Subtitle**: "Daerah yang memiliki order"
- **Chart Type**: Interactive Map (Leaflet.js)
- **Data**: Menampilkan titik merah di peta Indonesia untuk setiap kabupaten yang memiliki order

**Logika Perhitungan**:
- Mengambil data dari Kolom L (Kabupaten)
- Mengelompokkan berdasarkan kabupaten
- Menggunakan geocoding (Nominatim API) untuk mendapatkan koordinat
- Menampilkan marker di peta untuk setiap kabupaten yang memiliki order

**Sumber Data**:
- Kolom "Kabupaten" (Kolom L) dari Google Sheets utama

**Fitur**:
- Peta interaktif dengan zoom in/out
- Marker merah untuk setiap kabupaten
- Filter berdasarkan bulan dan marketplace/kemitraan

---

## 🧮 Logika Perhitungan Detail

### 1. Perhitungan Omset

```javascript
Omset = Harga Jual (Kolom AA) - Subsidi Ongkir (Kolom W)
```

**Sumber Data**:
- **Harga Jual**: Kolom AA dari Google Sheets
- **Subsidi Ongkir**: Kolom W dari Google Sheets

**Aggregasi**:
- Data dikelompokkan per minggu (Week 1-4) berdasarkan tanggal order
- Week 1: Hari 1-7
- Week 2: Hari 8-14
- Week 3: Hari 15-21
- Week 4: Hari 22-akhir bulan

### 2. Perhitungan Omset Bersih

```javascript
Omset Bersih = Total Omset - Total Retur/RTS
```

**Catatan**: 
- Omset Bersih dihitung setelah data retur selesai diambil
- Jika retur belum tersedia, Omset Bersih = Total Omset

### 3. Perhitungan Retur/RTS

#### Untuk Bulan Oktober:
```javascript
Total Retur = Sum(Kolom X) 
WHERE Kolom C = "LKM" 
AND Kolom B = [Markeplace/Kemitraan yang dipilih]
```

#### Untuk Bulan November dan seterusnya:
```javascript
Total Retur = Sum(Kolom Y) 
WHERE Kolom D = "LKM" 
AND Kolom B = [Markeplace/Kemitraan yang dipilih]
```

**Sumber Data**:
- Google Sheets Retur (URL berbeda untuk setiap bulan)
- Data retur hanya tersedia untuk Oktober dan November

**Filter Marketplace**:
- Jika pilih "TikTok", hanya mengambil data retur untuk TikTok
- Jika pilih "All", mengambil semua data retur

### 4. Perhitungan Total Harga Jual

```javascript
Total Harga Jual = Sum(Kolom AA) per minggu
```

**Aggregasi**:
- Data dikelompokkan per minggu (Week 1-4)
- Menggunakan tanggal order untuk menentukan minggu

### 5. Perhitungan Breakdown

```javascript
Breakdown = Group by Revenue Type
Total per kategori = Sum(Revenue) WHERE Revenue Type = [kategori]
Persentase = (Total per kategori / Total semua) * 100%
```

### 6. Perhitungan Variance Analysis

```javascript
Variance = Actual - Expected
```

### 7. Perhitungan Trend Analysis

#### Revenue:
```javascript
Revenue per minggu = Sum(Revenue) WHERE Week = [minggu]
```

#### CAGR:
```javascript
CAGR = ((Revenue Week N / Revenue Week 1) ^ (1/N)) - 1
```

### 8. Perhitungan Contribution Analysis

```javascript
Contribution = Group by DOA Type
Total per kategori = Sum(Revenue) WHERE DOA Type = [kategori]
Top 4 = Sort by Total DESC, Take 4
```

### 9. Perhitungan Peta Distribusi

```javascript
Kabupaten = Unique values from Kolom L
For each kabupaten:
  - Geocode kabupaten name to coordinates
  - Count orders for that kabupaten
  - Display marker on map
```

---

## 📁 Struktur File

```
VISUALLISASI DATA/
├── dashboard.html          # Halaman utama dashboard
├── login.html              # Halaman login
├── index.html              # Redirect ke login/dashboard
├── app.js                  # Logika utama dashboard
├── styles.css              # Styling dashboard
├── start-server.bat        # Script untuk menjalankan server
├── stop-server.bat         # Script untuk menghentikan server
├── gambar 1.png            # Background image untuk login dan wallpaper mode
├── netlify.toml            # Konfigurasi Netlify
├── .gitignore              # File yang diabaikan Git
└── README.md               # Dokumentasi ini
```

---

## 🔧 Konfigurasi Google Sheets

### Data Utama (Omset, Harga Jual, dll)

Dashboard mengambil data dari Google Sheets yang sudah di-publish. URL untuk setiap bulan:

- **Oktober**: URL khusus Oktober
- **November**: URL khusus November
- **September**: URL khusus September

### Data Retur

Data retur diambil dari Google Sheets terpisah:

- **Oktober**: URL retur Oktober (logika: Kolom X, filter Kolom C = "LKM")
- **November**: URL retur November (logika: Kolom Y, filter Kolom D = "LKM")

**Catatan**: Pastikan Google Sheets sudah di-share dengan "Anyone with the link can view" agar bisa diakses oleh dashboard.

---

## 🚀 Deployment ke Netlify

Dashboard ini menggunakan **Netlify** untuk deployment. Netlify adalah platform hosting gratis yang sangat mudah digunakan.

### Cara 1: Deploy via Netlify CLI (Recommended)

#### Langkah 1: Install Node.js (Jika Belum Ada)

1. Download Node.js dari: https://nodejs.org/
2. Install Node.js (pilih versi LTS)
3. Restart terminal/PowerShell setelah install

#### Langkah 2: Install Netlify CLI

Buka terminal/PowerShell di folder project, lalu jalankan:

```bash
npm install -g netlify-cli
```

**Catatan**: Perlu koneksi internet untuk download. Tunggu sampai selesai.

#### Langkah 3: Login ke Netlify

Jalankan perintah:

```bash
netlify login
```

- Browser akan otomatis terbuka
- Login dengan akun GitHub/Email/Google
- Authorize Netlify untuk mengakses akun Anda
- Setelah berhasil, kembali ke terminal

#### Langkah 4: Deploy ke Netlify

Masih di folder project, jalankan:

```bash
netlify deploy --prod
```

**Pertanyaan yang akan muncul**:

1. **Link to existing site?** 
   - Pilih **No** (kalau pertama kali deploy)
   - Atau **Yes** kalau sudah pernah deploy sebelumnya

2. **Publish directory?**
   - Tekan **Enter** saja (karena folder project langsung di-root)
   - Atau ketik `.` (titik) lalu Enter

3. **Site name?** (opsional)
   - Bisa dikosongkan, Netlify akan generate nama random
   - Atau ketik nama yang diinginkan (contoh: `sales-report-lkm`)

**Tunggu sampai proses selesai!**

Setelah berhasil, Anda akan mendapat URL seperti:
```
https://your-site-name.netlify.app
```

**Simpan URL ini!** URL ini adalah alamat dashboard Anda yang bisa diakses dari mana saja.

---

### Cara 2: Deploy via Drag & Drop (Paling Mudah)

Jika tidak ingin install CLI, bisa pakai cara ini:

1. **Buka browser**, kunjungi: https://app.netlify.com/drop
2. **Login** dengan akun GitHub/Email/Google
3. **Drag & Drop** seluruh folder project ke halaman Netlify
4. **Tunggu** sampai upload selesai
5. **Dapat URL** dashboard Anda!

**Catatan**: 
- File `node_modules` akan diabaikan otomatis (sudah ada di `.gitignore`)
- Pastikan semua file penting sudah ada (dashboard.html, login.html, app.js, styles.css, dll)

---

### Cara 3: Deploy via GitHub Integration

Jika project sudah di GitHub:

1. **Buka** https://app.netlify.com
2. **Klik** "Add new site" → "Import an existing project"
3. **Pilih** "Deploy with GitHub"
4. **Authorize** Netlify untuk akses GitHub
5. **Pilih repository** `VISUAL_DATA` (atau nama repo Anda)
6. **Deploy settings**:
   - Build command: (kosongkan)
   - Publish directory: `.` (titik)
7. **Klik** "Deploy site"

**Keuntungan**: Setiap kali push ke GitHub, Netlify akan otomatis deploy ulang!

---

### Akses Dashboard Setelah Deploy

Setelah deploy berhasil, Anda akan mendapat URL seperti:
```
https://your-site-name.netlify.app
```

**URL ini bisa:**
- Dibagikan ke team
- Diakses dari mana saja (tidak perlu server lokal)
- Diakses 24/7 (selama Netlify masih aktif)

**Catatan Penting**:
- Dashboard akan otomatis online setelah deploy
- Tidak perlu menjalankan server lokal lagi
- Login tetap sama: Username `user`, Password `123`

---

### Update Dashboard (Setelah Perubahan)

Jika sudah pernah deploy dan ingin update:

#### Via CLI:
```bash
netlify deploy --prod
```

#### Via GitHub:
- Push perubahan ke GitHub
- Netlify akan otomatis deploy ulang (jika pakai GitHub Integration)

#### Via Drag & Drop:
- Ulangi proses drag & drop folder yang sudah di-update

---

## 📝 Catatan Penting

1. **Server Lokal**: Setiap kali buka laptop, harus menjalankan `start-server.bat` terlebih dahulu
2. **Login**: Username `user`, Password `123`
3. **Data Retur**: Hanya tersedia untuk bulan Oktober dan November
4. **Google Sheets**: Pastikan sudah di-share dengan "Anyone with the link can view"
5. **Session**: Login menggunakan `sessionStorage`, akan logout otomatis saat browser ditutup
6. **Mode Wallpaper**: Background fixed (tidak ikut scroll), hanya card yang scroll

---

## 🎨 Customization

### Mengubah Background Login

Ganti file `gambar 1.png` dengan gambar yang diinginkan. Nama file harus tetap `gambar 1.png`.

### Mengubah Color Palette

Edit file `app.js`, cari bagian `colorPalettes` dan ubah warna sesuai kebutuhan.

### Menambah Bulan Baru

1. Tambahkan URL Google Sheets baru di `GOOGLE_SHEETS_URLS` di `app.js`
2. Tambahkan URL retur (jika ada) di `RETUR_SHEETS_URLS` di `app.js`

---

## 📞 Support

Jika ada pertanyaan atau masalah, hubungi IT Team Division.

---

**Copyright © 2025 IT Team Division**

*"Bersyukur Itu Gratis , Tetapi Dampaknya Luar Biasa"*
