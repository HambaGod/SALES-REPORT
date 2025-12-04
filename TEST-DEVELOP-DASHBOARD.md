# 🧪 Testing Developer Dashboard

## ✅ Checklist Testing

### 1. Login Test
- [ ] Buka `login.html` di browser
- [ ] Input username: `999`
- [ ] Input password: `999`
- [ ] Klik Login
- [ ] **Expected:** Redirect ke `develop.html`
- [ ] **Expected:** Header menampilkan "🛠️ Developer Dashboard"

---

### 2. Tab Navigation Test
- [ ] Klik tab "📊 Data Penjualan" → **Expected:** Tabel muncul
- [ ] Klik tab "💰 Budget Iklan LKM" → **Expected:** Tabel muncul
- [ ] Klik tab "💰 Budget Iklan NUMETA" → **Expected:** Tabel muncul
- [ ] Klik tab "📦 Data Retur" → **Expected:** Tabel muncul
- [ ] Klik tab "⚡ Generate Code" → **Expected:** Form generate muncul

---

### 3. Data Penjualan Test

#### Test: View Existing Data
- [ ] Tab "Data Penjualan" menampilkan 4 bulan (Oktober, November, September, Desember)
- [ ] Setiap row menampilkan: Nama Bulan, URL, Status ✓ Active, Actions (Edit/Hapus)

#### Test: Add New Data
- [ ] Klik tombol "+ Tambah Bulan"
- [ ] Modal muncul dengan title "Tambah Data Penjualan"
- [ ] Input Nama Bulan: `Januari`
- [ ] Input URL: `https://docs.google.com/spreadsheets/d/e/2PACX-1vS3LSA3Z3e60bUzskklR1DScntT-n4TpKHbFmGiRtGMi2tNP-6swXW3_rxzIR1BnfFlCxS2CXuwH7rD/pub?gid=1771794388&single=true&output=csv`
- [ ] Klik "🔍 Validasi URL"
- [ ] **Expected:** Status badge "✓ URL Valid" muncul
- [ ] Klik "Simpan"
- [ ] **Expected:** Modal close, alert success muncul, tabel update dengan data baru

#### Test: Edit Data
- [ ] Klik tombol "Edit" pada row "Januari"
- [ ] Modal muncul dengan title "Edit Data Penjualan"
- [ ] Form sudah terisi dengan data existing
- [ ] Ubah Nama Bulan menjadi: `Januari 2025`
- [ ] Klik "Simpan"
- [ ] **Expected:** Modal close, alert success muncul, tabel update

#### Test: Delete Data
- [ ] Klik tombol "Hapus" pada row "Januari 2025"
- [ ] **Expected:** Konfirmasi dialog muncul
- [ ] Klik "OK"
- [ ] **Expected:** Alert success muncul, row hilang dari tabel

---

### 4. Budget Iklan LKM Test

#### Test: View Existing Data
- [ ] Tab "Budget Iklan LKM" menampilkan 3 bulan (2025-10, 2025-11, 2025-12)
- [ ] Status: ✓ Active untuk semua

#### Test: Add New Data
- [ ] Klik "+ Tambah Bulan"
- [ ] Input Bulan: `2025-01`
- [ ] Input URL: `https://docs.google.com/spreadsheets/d/e/2PACX-1vTe4NHwKCvXPnSx7xQES2CzR2N2ph1QV95h073rg3Q7ul7yDytec9d3f0v-vByddjLMhbI0aCJLQei0/pub?gid=0&single=true&output=csv`
- [ ] Klik "🔍 Validasi URL"
- [ ] **Expected:** Status "✓ URL Valid"
- [ ] Klik "Simpan"
- [ ] **Expected:** Data tersimpan

#### Test: Edit & Delete
- [ ] Test Edit: Ubah URL untuk 2025-01
- [ ] Test Delete: Hapus 2025-01

---

### 5. Budget Iklan NUMETA Test

#### Test: View Existing Data
- [ ] Tab "Budget Iklan NUMETA" menampilkan 2 bulan (2025-10, 2025-11)
- [ ] 2025-10 status: ⚠ Empty (URL kosong)
- [ ] 2025-11 status: ✓ Active

#### Test: Edit Empty Data
- [ ] Klik "Edit" pada 2025-10
- [ ] Input URL yang valid
- [ ] Validasi & Simpan
- [ ] **Expected:** Status berubah menjadi ✓ Active

---

### 6. Data Retur Test

#### Test: View Existing Data
- [ ] Tab "Data Retur" menampilkan 2 bulan (2025-10, 2025-11)
- [ ] Semua status: ✓ Active

#### Test: Add New Data
- [ ] Tambah bulan 2025-12
- [ ] Validasi & Simpan
- [ ] **Expected:** Data tersimpan

---

### 7. Generate Code Test

#### Test: Generate JavaScript Code
- [ ] Klik tab "⚡ Generate Code"
- [ ] Klik tombol "⚡ Generate Code"
- [ ] **Expected:** Code output muncul dalam dark theme box
- [ ] **Expected:** Code berisi:
  - `const GOOGLE_SHEETS_URLS = [...]`
  - `const RETUR_SHEETS_URLS = {...}`
  - `const BUDGET_IKLAN_URLS_LKM = {...}`
  - `const BUDGET_IKLAN_URLS_NUMETA = {...}`
- [ ] Klik tombol "📋 Copy to Clipboard"
- [ ] **Expected:** Alert "Kode berhasil di-copy ke clipboard!" muncul
- [ ] Paste di Notepad untuk verify
- [ ] **Expected:** Code ter-copy dengan benar

---

### 8. URL Validation Test

#### Test: Valid URL
- [ ] Input URL dengan `output=csv`
- [ ] Klik "🔍 Validasi URL"
- [ ] **Expected:** Badge hijau "✓ URL Valid" + info response (200 OK, X baris data)

#### Test: Invalid URL (No output=csv)
- [ ] Input URL tanpa `output=csv`
- [ ] Klik "🔍 Validasi URL"
- [ ] **Expected:** Badge merah "⚠ URL harus mengandung &output=csv"

#### Test: Invalid URL (404)
- [ ] Input URL yang tidak exist
- [ ] Klik "🔍 Validasi URL"
- [ ] **Expected:** Badge merah "✗ URL tidak dapat diakses (404)"

---

### 9. Integration Test dengan app.js

#### Test: Apply Generated Code
- [ ] Generate code dari Developer Dashboard
- [ ] Copy code
- [ ] Buka `app.js` di editor
- [ ] Cari bagian konfigurasi (line 1-50)
- [ ] Replace dengan code yang baru
- [ ] Save `app.js`
- [ ] Buka `login.html` di browser
- [ ] Login sebagai LKM (123/123)
- [ ] **Expected:** Dashboard LKM muncul dengan data yang benar
- [ ] Logout, login sebagai NUMETA (321/321)
- [ ] **Expected:** Dashboard NUMETA muncul dengan data yang benar
- [ ] Check dropdown "Pilih Bulan"
- [ ] **Expected:** Bulan yang ditambahkan muncul di dropdown

---

### 10. Logout Test
- [ ] Klik tombol "Logout" di Developer Dashboard
- [ ] **Expected:** Konfirmasi dialog muncul
- [ ] Klik "OK"
- [ ] **Expected:** Redirect ke `login.html`
- [ ] Try akses `develop.html` langsung via URL
- [ ] **Expected:** Auto redirect ke `login.html` (karena belum login)

---

### 11. View Dashboard Button Test
- [ ] Dari Developer Dashboard, klik tombol "View Dashboard"
- [ ] **Expected:** Redirect ke `dashboard.html`
- [ ] **Expected:** Dashboard menampilkan data sesuai userType DEVELOP
  - (Note: Mungkin perlu adjust logic di dashboard.html untuk handle userType DEVELOP)

---

### 12. LocalStorage Persistence Test
- [ ] Tambah data baru di Developer Dashboard
- [ ] Refresh halaman (F5)
- [ ] **Expected:** Data yang ditambahkan masih ada (tersimpan di localStorage)
- [ ] Close browser
- [ ] Buka lagi `develop.html`
- [ ] Login (999/999)
- [ ] **Expected:** Data masih ada

---

## 🐛 Bug Report Template

Jika menemukan bug, catat dengan format:

```
**Bug:** [Deskripsi singkat]
**Steps to Reproduce:**
1. [Step 1]
2. [Step 2]
3. [Step 3]

**Expected Result:** [Apa yang seharusnya terjadi]
**Actual Result:** [Apa yang terjadi]
**Browser:** [Chrome/Firefox/Edge + versi]
**Console Error:** [Copy error dari console (F12)]
```

---

## ✅ Testing Complete!

Jika semua checklist di atas ✅, Developer Dashboard siap digunakan! 🎉

