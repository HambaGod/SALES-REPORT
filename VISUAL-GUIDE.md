# 🎨 Visual Guide - Developer Dashboard

## 🗺️ Navigation Map

```
┌─────────────────────────────────────────────────────────────┐
│                       LOGIN PAGE                            │
│                                                             │
│  Username: [___________]    Password: [___________]         │
│                                                             │
│  123/123 → LKM Dashboard                                    │
│  321/321 → NUMETA Dashboard                                 │
│  999/999 → DEVELOPER DASHBOARD ← YOU ARE HERE!              │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                   DEVELOPER DASHBOARD                       │
│                                                             │
│  [View as LKM] [View as NUMETA] [Logout]                   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ [📊 Penjualan] [💰 LKM] [💰 NUMETA] [📦 Retur]      │   │
│  │                    [⚡ Generate Code]                │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Data Table                      [+ Tambah Bulan]   │   │
│  │  ┌──────────────────────────────────────────────┐   │   │
│  │  │ Bulan │ URL │ Status │ [Edit] [Hapus]       │   │   │
│  │  └──────────────────────────────────────────────┘   │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

---

## 📊 Tab Structure

```
Developer Dashboard
├── 📊 Data Penjualan
│   ├── Oktober
│   ├── November
│   ├── September
│   └── Desember
│
├── 💰 Budget Iklan LKM
│   ├── 2025-10
│   ├── 2025-11
│   └── 2025-12
│
├── 💰 Budget Iklan NUMETA
│   ├── 2025-10
│   └── 2025-11
│
├── 📦 Data Retur
│   ├── 2025-10
│   └── 2025-11
│
└── ⚡ Generate Code
    ├── [Generate Code Button]
    ├── Generated Code Display
    └── [Copy to Clipboard Button]
```

---

## 🔄 Workflow Diagram

### Add New Data Flow

```
START
  ↓
[Click "+ Tambah Bulan"]
  ↓
┌─────────────────────────┐
│   MODAL OPENS           │
│                         │
│  Nama Bulan: [_____]    │
│  URL: [____________]    │
│                         │
│  [🔍 Validasi URL]      │
│  [Batal] [Simpan]       │
└─────────────────────────┘
  ↓
[Click "🔍 Validasi URL"]
  ↓
┌─────────────────────────┐
│  Fetching URL...        │
│  ⏳ Please wait...      │
└─────────────────────────┘
  ↓
┌─────────────────────────┐
│  ✓ URL Valid            │
│  200 OK | 1234 lines    │
└─────────────────────────┘
  ↓
[Click "Simpan"]
  ↓
┌─────────────────────────┐
│  ✅ Data berhasil       │
│     ditambahkan!        │
└─────────────────────────┘
  ↓
[Table Updates]
  ↓
END
```

### Generate & Apply Code Flow

```
START
  ↓
[Click tab "⚡ Generate Code"]
  ↓
[Click "⚡ Generate Code"]
  ↓
┌─────────────────────────────────┐
│  Generated Code:                │
│  ┌───────────────────────────┐  │
│  │ const GOOGLE_SHEETS_URLS  │  │
│  │ = [ ... ];                │  │
│  │                           │  │
│  │ const BUDGET_IKLAN_URLS   │  │
│  │ = { ... };                │  │
│  └───────────────────────────┘  │
│                                 │
│  [📋 Copy to Clipboard]         │
└─────────────────────────────────┘
  ↓
[Click "📋 Copy to Clipboard"]
  ↓
┌─────────────────────────────────┐
│  ✅ Kode berhasil di-copy!      │
└─────────────────────────────────┘
  ↓
[Open app.js in Editor]
  ↓
[Find line 1-50 (Configuration)]
  ↓
[Select & Delete old config]
  ↓
[Paste new config]
  ↓
[Save app.js]
  ↓
[Refresh Dashboard]
  ↓
┌─────────────────────────────────┐
│  ✅ Data updated successfully!  │
└─────────────────────────────────┘
  ↓
END
```

---

## 🎯 Button Actions

```
┌──────────────────────────────────────────────────────────┐
│  BUTTON                 │  ACTION                        │
├──────────────────────────────────────────────────────────┤
│  + Tambah Bulan         │  Open modal to add new data    │
│  Edit                   │  Open modal to edit data       │
│  Hapus                  │  Delete data (with confirm)    │
│  🔍 Validasi URL        │  Validate Google Sheets URL    │
│  Simpan                 │  Save data to localStorage     │
│  Batal                  │  Close modal without saving    │
│  ⚡ Generate Code       │  Generate JavaScript code      │
│  📋 Copy to Clipboard   │  Copy code to clipboard        │
│  View as LKM            │  View dashboard as LKM user    │
│  View as NUMETA         │  View dashboard as NUMETA user │
│  🛠️ Developer           │  Back to Developer Dashboard   │
│  Logout                 │  Logout & return to login      │
└──────────────────────────────────────────────────────────┘
```

---

## 📋 Modal Structure

### Add/Edit Modal

```
┌─────────────────────────────────────────────────┐
│  Tambah Data Penjualan                     [×]  │
├─────────────────────────────────────────────────┤
│                                                 │
│  Nama Bulan                                     │
│  ┌───────────────────────────────────────────┐ │
│  │ Contoh: Desember, Januari                 │ │
│  └───────────────────────────────────────────┘ │
│  ℹ️ Untuk data penjualan, gunakan nama bulan   │
│                                                 │
│  Google Sheets URL                              │
│  ┌───────────────────────────────────────────┐ │
│  │ https://docs.google.com/spreadsheets/...  │ │
│  └───────────────────────────────────────────┘ │
│  ℹ️ Pastikan link sudah di-publish dan         │
│     mengandung &output=csv                      │
│                                                 │
│  ┌─────────────────────┐                       │
│  │ 🔍 Validasi URL     │                       │
│  └─────────────────────┘                       │
│                                                 │
│  ✓ URL Valid                                    │
│  200 OK | 1234 lines                            │
│                                                 │
│                        ┌────────┐ ┌──────────┐ │
│                        │ Batal  │ │  Simpan  │ │
│                        └────────┘ └──────────┘ │
└─────────────────────────────────────────────────┘
```

---

## 🎨 Status Badges

```
┌─────────────────────────────────────────────┐
│  STATUS          │  COLOR  │  MEANING       │
├─────────────────────────────────────────────┤
│  ✓ Active        │  Green  │  URL is set    │
│  ⚠ Empty         │  Yellow │  URL is empty  │
│  ✓ URL Valid     │  Green  │  URL works     │
│  ✗ URL Invalid   │  Red    │  URL error     │
└─────────────────────────────────────────────┘
```

---

## 📊 Data Table Example

```
┌────────────────────────────────────────────────────────────────────────┐
│  Data Penjualan                                  [+ Tambah Bulan]      │
├────────────────────────────────────────────────────────────────────────┤
│                                                                        │
│  ┌──────────┬─────────────────────────┬──────────┬─────────────────┐ │
│  │  Bulan   │  Google Sheets URL      │  Status  │  Actions        │ │
│  ├──────────┼─────────────────────────┼──────────┼─────────────────┤ │
│  │ Oktober  │ https://docs.google...  │ ✓ Active │ [Edit] [Hapus]  │ │
│  │ November │ https://docs.google...  │ ✓ Active │ [Edit] [Hapus]  │ │
│  │ September│ https://docs.google...  │ ✓ Active │ [Edit] [Hapus]  │ │
│  │ Desember │ https://docs.google...  │ ✓ Active │ [Edit] [Hapus]  │ │
│  └──────────┴─────────────────────────┴──────────┴─────────────────┘ │
│                                                                        │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 🔗 URL Validation States

### Valid URL

```
┌─────────────────────────────────────────┐
│  🔍 Validasi URL                        │
│                                         │
│  ✓ URL Valid                            │
│  Response: 200 OK                       │
│  Data: 1234 baris                       │
└─────────────────────────────────────────┘
```

### Invalid URL (No output=csv)

```
┌─────────────────────────────────────────┐
│  🔍 Validasi URL                        │
│                                         │
│  ⚠ URL harus mengandung &output=csv    │
└─────────────────────────────────────────┘
```

### Invalid URL (404)

```
┌─────────────────────────────────────────┐
│  🔍 Validasi URL                        │
│                                         │
│  ✗ URL tidak dapat diakses (404)       │
└─────────────────────────────────────────┘
```

### Error

```
┌─────────────────────────────────────────┐
│  🔍 Validasi URL                        │
│                                         │
│  ✗ Error: Network error                │
└─────────────────────────────────────────┘
```

---

## 💻 Generated Code Preview

```
┌────────────────────────────────────────────────────────────────┐
│  Generated Code:                                               │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │ // ===== KONFIGURASI GOOGLE SHEETS =====                 │ │
│  │ const GOOGLE_SHEETS_URLS = [                             │ │
│  │   {                                                      │ │
│  │     name: 'Oktober',                                     │ │
│  │     url: 'https://docs.google.com/spreadsheets/...'     │ │
│  │   },                                                     │ │
│  │   {                                                      │ │
│  │     name: 'November',                                    │ │
│  │     url: 'https://docs.google.com/spreadsheets/...'     │ │
│  │   }                                                      │ │
│  │ ];                                                       │ │
│  │                                                          │ │
│  │ const BUDGET_IKLAN_URLS_LKM = {                         │ │
│  │   '2025-10': 'https://docs.google.com/...',            │ │
│  │   '2025-11': 'https://docs.google.com/...'             │ │
│  │ };                                                       │ │
│  └──────────────────────────────────────────────────────────┘ │
│                                                                │
│  ┌──────────────────────┐                                     │
│  │ 📋 Copy to Clipboard │                                     │
│  └──────────────────────┘                                     │
└────────────────────────────────────────────────────────────────┘
```

---

## 🎯 Quick Actions Cheat Sheet

```
╔════════════════════════════════════════════════════════════╗
║  TASK                          │  SHORTCUT / ACTION        ║
╠════════════════════════════════════════════════════════════╣
║  Login as Developer            │  999 / 999                ║
║  Add new month                 │  Click "+ Tambah Bulan"   ║
║  Validate URL                  │  Click "🔍 Validasi URL"  ║
║  Generate code                 │  Tab "⚡" → Generate      ║
║  Copy code                     │  Click "📋 Copy"          ║
║  View as LKM                   │  Click "View as LKM"      ║
║  View as NUMETA                │  Click "View as NUMETA"   ║
║  Back to Developer             │  Click "🛠️ Developer"     ║
║  Logout                        │  Click "Logout"           ║
╚════════════════════════════════════════════════════════════╝
```

---

## 🎨 Color Legend

```
┌─────────────────────────────────────────────────┐
│  COLOR          │  HEX       │  USAGE           │
├─────────────────────────────────────────────────┤
│  Purple         │  #667eea   │  Primary buttons │
│  Dark Purple    │  #764ba2   │  Gradient end    │
│  Green          │  #10b981   │  Success states  │
│  Red            │  #ef4444   │  Error/Delete    │
│  Blue           │  #3b82f6   │  Info messages   │
│  Yellow         │  #f59e0b   │  Warning states  │
│  Gray           │  #6b7280   │  Text/Borders    │
└─────────────────────────────────────────────────┘
```

---

## 📱 Responsive Layout

### Desktop View (> 1024px)

```
┌─────────────────────────────────────────────────────────┐
│  Header: Full width with buttons on right              │
├─────────────────────────────────────────────────────────┤
│  Tabs: Horizontal, all visible                         │
├─────────────────────────────────────────────────────────┤
│  Table: Full width, all columns visible                │
│  ┌──────┬──────────────────┬────────┬──────────────┐   │
│  │ Col1 │ Col2             │ Col3   │ Col4         │   │
│  └──────┴──────────────────┴────────┴──────────────┘   │
└─────────────────────────────────────────────────────────┘
```

### Mobile View (< 768px)

```
┌──────────────────────────┐
│  Header: Stacked         │
│  [Button]                │
│  [Button]                │
├──────────────────────────┤
│  Tabs: Scrollable        │
│  [Tab1][Tab2][Tab3]→     │
├──────────────────────────┤
│  Table: Stacked cards    │
│  ┌────────────────────┐  │
│  │ Bulan: Oktober     │  │
│  │ Status: ✓ Active   │  │
│  │ [Edit] [Hapus]     │  │
│  └────────────────────┘  │
└──────────────────────────┘
```

---

**Print this guide for visual reference! 📄**

