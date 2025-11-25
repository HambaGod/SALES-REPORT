// ===== KONFIGURASI GOOGLE SHEETS =====
// URL yang sudah di-publish dari Google Sheets (3 sumber data)
const GOOGLE_SHEETS_URLS = [
  {
    name: 'Oktober',
    url: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSEhwYbLBc-Jlj1rJsY9MiFAh3qptzR094JHTx4QoSMK91sjOUBojLkd-PsT4g0U-UxVXROd73no5H8/pub?gid=1771794388&single=true&output=csv'
  },
  {
    name: 'November',
    url: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vStaRSyDbQo516ONwHIjg1bQt3okBL7QFEfAOJ1avwAY_toxltA0JB1FVLwZ49MSIy4zrqWitZZvDhr/pub?gid=1771794388&single=true&output=csv'
  },
  {
    name: 'September',
    url: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTnAs1HjcdlmcYy369WQAlBKihofg4680PsYVKUByzq1xsryAOjvsw7q2aIaGm30NzTbkMRRleupBsc/pub?gid=1771794388&single=true&output=csv'
  }
];

// ===== KONFIGURASI GOOGLE SHEETS RETUR =====
// URL retur untuk setiap bulan (hanya bulan yang memiliki data retur)
const RETUR_SHEETS_URLS = {
  // Oktober: logika khusus (kolom X, filter kolom C = "LKM")
  '2025-10': 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSX2lc2z97Z-EspZGqZn98Pk5BLlLa5bjeTdUoncvaOCBrRqIsHBW3OcFJesV1uOzADKaf_dAmsa_on/pub?gid=2023930332&single=true&output=csv',
  // November: logika standar (kolom Y, filter kolom D = "LKM")
  '2025-11': 'https://docs.google.com/spreadsheets/d/e/2PACX-1vS6hIfTqlz0foN93TERhgrI635-GTHlnh2uYKyVNi3E2yYta0tYMzwpaAzaC0L834-sPxkTHTCxWUDT/pub?gid=2023930332&single=true&output=csv'
};

// ===== KONFIGURASI GOOGLE SHEETS BUDGET IKLAN =====
// URL default budget iklan (jika monthKey belum punya URL spesifik)
const BUDGET_IKLAN_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTKcsgwf2YsGwnkDKQwfkNpC_kMUCxqIY5FDFl3uNpLOihk7h3m9WBipHmJVOJggvw0ZP4vWYQTtQIQ/pub?output=csv';

// URL budget iklan per bulan (format warehouse: TANGGAL, MARKETPLACE, PRODUK, TOTAL BIAYA IKLAN)
const BUDGET_IKLAN_URLS = {
  // Oktober 2025
  '2025-10':
    'https://docs.google.com/spreadsheets/d/e/2PACX-1vRM4Diwo8TCXyfXm2v2LwYZ1spYmTllCJ8EI9w-jYOnLO32FfCsvhOWngQ8Qf12AlU3KKYoMoO_HUxM/pub?gid=0&single=true&output=csv',
  // November 2025
  '2025-11':
    'https://docs.google.com/spreadsheets/d/e/2PACX-1vTKcsgwf2YsGwnkDKQwfkNpC_kMUCxqIY5FDFl3uNpLOihk7h3m9WBipHmJVOJggvw0ZP4vWYQTtQIQ/pub?output=csv',
};

// ===== FUNGSI UNTUK FETCH DATA DARI SATU URL =====
const fetchSingleSheet = async (url, name) => {
  try {
    console.log(`Mencoba mengambil data dari ${name}:`, url);
    const response = await fetch(url);

    console.log(`${name} - Response status:`, response.status, response.statusText);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`${name} - Error response:`, errorText);
      throw new Error(`${name}: Gagal mengambil data (${response.status} ${response.statusText})`);
    }

    const csvText = await response.text();
    console.log(`${name} - CSV data received, length:`, csvText.length);

    if (!csvText || csvText.trim().length === 0) {
      throw new Error(`${name}: Data CSV kosong`);
    }

    const parsed = parseCSV(csvText);
    console.log(`${name} - Parsed rows:`, parsed.length);
    return parsed;
  } catch (error) {
    console.error(`Error fetching ${name}:`, error);
    if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
      throw new Error(`${name}: Tidak dapat terhubung ke Google Sheets`);
    }
    throw error;
  }
};

// ===== FUNGSI UNTUK FETCH DATA DARI SEMUA GOOGLE SHEETS =====
const fetchDataFromGoogleSheets = async () => {
  try {
    console.log('Mengambil data dari', GOOGLE_SHEETS_URLS.length, 'sumber data...');

    // Fetch semua data secara parallel
    const fetchPromises = GOOGLE_SHEETS_URLS.map(({ url, name }) =>
      fetchSingleSheet(url, name).catch(error => {
        console.warn(`Warning: Gagal mengambil data dari ${name}:`, error.message);
        return []; // Return empty array jika gagal, agar tidak menghentikan proses
      })
    );

    const results = await Promise.all(fetchPromises);

    // Merge semua data
    let allRows = [];
    let successCount = 0;

    results.forEach((rows, index) => {
      if (rows && rows.length > 0) {
        allRows = allRows.concat(rows);
        successCount++;
        console.log(`✓ ${GOOGLE_SHEETS_URLS[index].name}: ${rows.length} rows`);
      } else {
        console.warn(`✗ ${GOOGLE_SHEETS_URLS[index].name}: Tidak ada data`);
      }
    });

    if (allRows.length === 0) {
      throw new Error('Tidak ada data yang berhasil diambil dari semua sumber. Pastikan Google Sheets sudah di-share dengan "Anyone with the link can view"');
    }

    console.log(`Total data dari ${successCount}/${GOOGLE_SHEETS_URLS.length} sumber: ${allRows.length} rows`);
    return allRows;
  } catch (error) {
    console.error('Error fetching data from Google Sheets:', error);
    throw error;
  }
};

// ===== FUNGSI UNTUK FETCH DATA RETUR/RTS =====
// Parameter: 
//   - monthKey: dalam format "YYYY-MM" (contoh: "2025-10" untuk Oktober)
//   - marketplaceFilter: filter marketplace/kemitraan (contoh: "TikTok", "Shopee", atau "All")
const fetchReturData = async (monthKey = null, marketplaceFilter = 'All') => {
  try {
    // Cek apakah bulan yang dipilih memiliki data retur
    if (!monthKey || !RETUR_SHEETS_URLS[monthKey]) {
      console.log(`Tidak ada data retur untuk bulan: ${monthKey || 'tidak dipilih'}. Hanya Oktober dan November yang memiliki data retur.`);
      return { total: 0, records: [] };
    }

    // Tentukan URL berdasarkan bulan
    const returUrl = RETUR_SHEETS_URLS[monthKey];

    // Parse bulan untuk menentukan logika
    const [year, month] = monthKey.split('-').map(Number);
    const isOktober = month === 10;

    console.log(`Mengambil data Retur/RTS dari Google Sheets untuk bulan: ${monthKey} (${isOktober ? 'Oktober - logika khusus' : 'November - logika standar'}), marketplace filter: ${marketplaceFilter}...`);
    const response = await fetch(returUrl);

    if (!response.ok) {
      throw new Error(`Gagal mengambil data Retur (${response.status} ${response.statusText})`);
    }

    const csvText = await response.text();
    if (!csvText || csvText.trim().length === 0) {
      throw new Error('Data CSV Retur kosong');
    }

    const rows = parseCSV(csvText);
    console.log(`Data Retur berhasil di-parse: ${rows.length} rows`);

    if (rows.length === 0) {
      console.warn('Tidak ada data retur yang ditemukan');
      return { total: 0, records: [] };
    }

    const toNumber = (value) => {
      if (value === null || value === undefined || value === '') return 0;
      const cleaned = String(value).replace(/[^\d.-]/g, '').replace(',', '.');
      const num = Number(cleaned);
      return Number.isFinite(num) ? num : 0;
    };

    const parseDate = (value) => {
      if (!value) return null;
      if (typeof value === 'string') {
        // Try DD/MM/YYYY format
        const ddmmyyyy = value.match(/(\d{1,2})\/(\d{1,2})\/(\d{4})/);
        if (ddmmyyyy) {
          const [, day, month, year] = ddmmyyyy;
          return new Date(year, month - 1, day);
        }
        // Try format "1 Oct 2025" atau "1 Oct 2025"
        const dateMatch = value.match(/(\d{1,2})\s+(\w+)\s+(\d{4})/i);
        if (dateMatch) {
          const [, day, monthName, year] = dateMatch;
          const monthNames = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
          const monthIndex = monthNames.findIndex(m => monthName.toLowerCase().startsWith(m));
          if (monthIndex !== -1) {
            return new Date(year, monthIndex, day);
          }
        }
        // Try standard Date parsing
        const parsed = new Date(value);
        if (!Number.isNaN(parsed.getTime())) {
          return parsed;
        }
      }
      return null;
    };

    const headers = rows.length > 0 ? Object.keys(rows[0]) : [];

    let total = 0;
    let count = 0;
    let skipped = 0;
    const returRecords = []; // Array untuk menyimpan records dengan tanggal dan nilai

    // Cari kolom B (index 1) untuk filter marketplace (Oktober dan November)
    let columnBIndex = -1;
    let columnBName = '';
    if (headers.length > 1) {
      columnBIndex = 1;
      columnBName = headers[1];
    }

    if (isOktober) {
      // LOGIKA OKTOBER: Total kolom X, jika kolom C = "LKM" dan kolom B sesuai marketplace filter
      console.log('Menggunakan logika Oktober: kolom X, filter kolom C = "LKM", filter kolom B = marketplace');

      // Cari kolom C (index 2) = "Lini Bisnis" (untuk Oktober)
      let columnCIndex = -1;
      let columnCName = '';
      if (headers.length > 2) {
        columnCIndex = 2;
        columnCName = headers[2];
      } else {
        // Coba cari berdasarkan nama
        const possibleNames = ['Lini Bisnis', 'Lini bisnis', 'lini bisnis', 'LINI BISNIS'];
        for (let i = 0; i < headers.length; i++) {
          const headerName = headers[i] ? headers[i].trim() : '';
          if (possibleNames.some(name => headerName.toUpperCase() === name.toUpperCase())) {
            columnCIndex = i;
            columnCName = headers[i];
            break;
          }
        }
      }

      // Cari kolom X (index 23) = "PENYESUAIAN RTS"
      let columnXIndex = -1;
      let columnXName = '';
      if (headers.length > 23) {
        columnXIndex = 23;
        columnXName = headers[23];
      } else {
        // Coba cari berdasarkan nama
        const possibleNames = ['PENYESUAIAN RTS', 'Penyesuaian RTS', 'penyesuaian rts', 'PENYESUAIAN RTS '];
        for (let i = 0; i < headers.length; i++) {
          const headerName = headers[i] ? headers[i].trim() : '';
          if (possibleNames.some(name => headerName.toUpperCase() === name.toUpperCase())) {
            columnXIndex = i;
            columnXName = headers[i];
            break;
          }
        }
      }

      // Cari kolom tanggal (TANGGAL INPUT RETUR atau TANGGAL ORDER)
      let dateColumnName = '';
      const dateColumnNames = ['TANGGAL INPUT RETUR', 'Tanggal Input Retur', 'TANGGAL ORDER', 'Tanggal Order'];
      for (let i = 0; i < headers.length; i++) {
        const headerName = headers[i] ? headers[i].trim() : '';
        if (dateColumnNames.some(name => headerName.toUpperCase() === name.toUpperCase())) {
          dateColumnName = headers[i];
          break;
        }
      }

      if (columnCIndex === -1 || !columnCName) {
        console.warn('Kolom C tidak ditemukan untuk Oktober. Headers:', headers);
        return { total: 0, records: [] };
      }

      if (columnXIndex === -1 || !columnXName) {
        console.warn('Kolom X (PENYESUAIAN RTS) tidak ditemukan untuk Oktober. Headers:', headers);
        return { total: 0, records: [] };
      }

      console.log(`Kolom B ditemukan: "${columnBName}" (index ${columnBIndex})`);
      console.log(`Kolom C ditemukan: "${columnCName}" (index ${columnCIndex})`);
      console.log(`Kolom X ditemukan: "${columnXName}" (index ${columnXIndex})`);

      // Hitung total dari kolom X, HANYA untuk baris yang kolom C = "LKM" dan kolom B sesuai filter
      for (let i = 0; i < rows.length; i++) {
        const row = rows[i];

        // Cek apakah kolom C = "LKM"
        const liniBisnis = row[columnCName];
        const liniBisnisStr = liniBisnis ? String(liniBisnis).trim().toUpperCase() : '';

        if (liniBisnisStr === 'LKM') {
          // Filter marketplace berdasarkan kolom B
          // Logika: Filter TikTok = kolom B mengandung "TIKTOK" ATAU "_T"
          //         Filter Shopee = kolom B mengandung "SHOPEE" ATAU "_S"
          //         Filter Lazada = kolom B mengandung "LAZADA" ATAU "_L"
          let shouldInclude = true;
          if (marketplaceFilter && marketplaceFilter !== 'All' && columnBName) {
            const marketplaceValue = row[columnBName];
            const marketplaceStr = marketplaceValue ? String(marketplaceValue).trim().toUpperCase() : '';
            const filterStr = marketplaceFilter.trim().toUpperCase();

            // Tentukan kondisi filter (OR: nama marketplace ATAU suffix)
            let matchesFilter = false;
            if (filterStr.includes('TIKTOK') || filterStr === 'TIKTOK') {
              matchesFilter = marketplaceStr.includes('TIKTOK') || marketplaceStr.includes('_T');
            } else if (filterStr.includes('SHOPEE') || filterStr === 'SHOPEE') {
              matchesFilter = marketplaceStr.includes('SHOPEE') || marketplaceStr.includes('_S');
            } else if (filterStr.includes('LAZADA') || filterStr === 'LAZADA') {
              matchesFilter = marketplaceStr.includes('LAZADA') || marketplaceStr.includes('_L');
            } else {
              // Fallback: logika lama (contains filter string)
              matchesFilter = marketplaceStr.includes(filterStr);
            }

            if (!matchesFilter) {
              shouldInclude = false;
              skipped++;
            }
          }

          if (shouldInclude) {
            // Jika kolom C = "LKM" dan kolom B sesuai filter, jumlahkan kolom X
            const value = row[columnXName];
            const numValue = toNumber(value);
            total += numValue;
            if (numValue !== 0) {
              count++;

              // Simpan record untuk chart
              const dateValue = dateColumnName ? parseDate(row[dateColumnName]) : null;
              if (dateValue) {
                returRecords.push({
                  date: dateValue,
                  orderTs: dateValue.getTime(),
                  returValue: numValue
                });
              }
            }
          }
        } else {
          skipped++;
        }
      }

      console.log(`Total Retur/RTS Oktober: ${total.toLocaleString('id-ID')} (dari ${rows.length} baris, ${count} baris dengan nilai, ${skipped} baris di-skip, filter marketplace: ${marketplaceFilter})`);
      return { total, records: returRecords };
    } else {
      // LOGIKA NOVEMBER+: Total kolom Y, jika kolom D = "LKM" dan kolom B sesuai marketplace filter
      console.log('Menggunakan logika November+: kolom Y, filter kolom D = "LKM", filter kolom B = marketplace');

      // Cari kolom D (index 3) = "Lini Bisnis"
      let columnDIndex = -1;
      let columnDName = '';
      if (headers.length > 3) {
        columnDIndex = 3;
        columnDName = headers[3];
      } else {
        // Coba cari berdasarkan nama
        const possibleNames = ['Lini Bisnis', 'Lini bisnis', 'lini bisnis', 'LINI BISNIS'];
        for (let i = 0; i < headers.length; i++) {
          const headerName = headers[i] ? headers[i].trim() : '';
          if (possibleNames.some(name => headerName.toUpperCase() === name.toUpperCase())) {
            columnDIndex = i;
            columnDName = headers[i];
            break;
          }
        }
      }

      // Cari kolom Y (index 24)
      let columnYIndex = -1;
      let columnYName = '';
      if (headers.length > 24) {
        columnYIndex = 24;
        columnYName = headers[24];
      } else {
        // Jika index tidak cukup, coba cari kolom setelah PENYESUAIAN RTS (kolom X)
        for (let i = 0; i < headers.length; i++) {
          const headerName = headers[i] ? headers[i].trim() : '';
          // Cari kolom setelah PENYESUAIAN RTS
          if (i > 0 && headers[i - 1] && headers[i - 1].toUpperCase().includes('PENYESUAIAN RTS')) {
            columnYIndex = i;
            columnYName = headers[i];
            break;
          }
        }
      }

      // Cari kolom tanggal (TANGGAL INPUT RETUR atau TANGGAL ORDER)
      let dateColumnName = '';
      const dateColumnNames = ['TANGGAL INPUT RETUR', 'Tanggal Input Retur', 'TANGGAL ORDER', 'Tanggal Order'];
      for (let i = 0; i < headers.length; i++) {
        const headerName = headers[i] ? headers[i].trim() : '';
        if (dateColumnNames.some(name => headerName.toUpperCase() === name.toUpperCase())) {
          dateColumnName = headers[i];
          break;
        }
      }

      if (columnDIndex === -1 || !columnDName) {
        console.warn('Kolom D (Lini Bisnis) tidak ditemukan. Headers:', headers);
        return { total: 0, records: [] };
      }

      if (columnYIndex === -1 || !columnYName) {
        console.warn('Kolom Y tidak ditemukan. Headers:', headers);
        return { total: 0, records: [] };
      }

      console.log(`Kolom B ditemukan: "${columnBName}" (index ${columnBIndex})`);
      console.log(`Kolom D (Lini Bisnis) ditemukan: "${columnDName}" (index ${columnDIndex})`);
      console.log(`Kolom Y ditemukan: "${columnYName}" (index ${columnYIndex})`);

      // Hitung total dari kolom Y, HANYA untuk baris yang kolom D = "LKM" dan kolom B sesuai filter
      for (let i = 0; i < rows.length; i++) {
        const row = rows[i];

        // Cek apakah kolom D = "LKM"
        const liniBisnis = row[columnDName];
        const liniBisnisStr = liniBisnis ? String(liniBisnis).trim().toUpperCase() : '';

        if (liniBisnisStr === 'LKM') {
          // Filter marketplace berdasarkan kolom B
          // Logika: Filter TikTok = kolom B mengandung "TIKTOK" ATAU "_T"
          //         Filter Shopee = kolom B mengandung "SHOPEE" ATAU "_S"
          //         Filter Lazada = kolom B mengandung "LAZADA" ATAU "_L"
          let shouldInclude = true;
          if (marketplaceFilter && marketplaceFilter !== 'All' && columnBName) {
            const marketplaceValue = row[columnBName];
            const marketplaceStr = marketplaceValue ? String(marketplaceValue).trim().toUpperCase() : '';
            const filterStr = marketplaceFilter.trim().toUpperCase();

            // Tentukan kondisi filter (OR: nama marketplace ATAU suffix)
            let matchesFilter = false;
            if (filterStr.includes('TIKTOK') || filterStr === 'TIKTOK') {
              matchesFilter = marketplaceStr.includes('TIKTOK') || marketplaceStr.includes('_T');
            } else if (filterStr.includes('SHOPEE') || filterStr === 'SHOPEE') {
              matchesFilter = marketplaceStr.includes('SHOPEE') || marketplaceStr.includes('_S');
            } else if (filterStr.includes('LAZADA') || filterStr === 'LAZADA') {
              matchesFilter = marketplaceStr.includes('LAZADA') || marketplaceStr.includes('_L');
            } else {
              // Fallback: logika lama (contains filter string)
              matchesFilter = marketplaceStr.includes(filterStr);
            }

            if (!matchesFilter) {
              shouldInclude = false;
              skipped++;
            }
          }

          if (shouldInclude) {
            // Jika kolom D = "LKM" dan kolom B sesuai filter, jumlahkan kolom Y
            const value = row[columnYName];
            const numValue = toNumber(value);
            total += numValue;
            if (numValue !== 0) {
              count++;

              // Simpan record untuk chart
              const dateValue = dateColumnName ? parseDate(row[dateColumnName]) : null;
              if (dateValue) {
                returRecords.push({
                  date: dateValue,
                  orderTs: dateValue.getTime(),
                  returValue: numValue
                });
              }
            }
          }
        } else {
          skipped++;
        }
      }

      console.log(`Total Retur/RTS: ${total.toLocaleString('id-ID')} (dari ${rows.length} baris, ${count} baris dengan nilai, ${skipped} baris di-skip, filter marketplace: ${marketplaceFilter})`);
      return { total, records: returRecords };
    }
  } catch (error) {
    console.error('Error fetching Retur data:', error);
    return { total: 0, records: [] };
  }
};

// ===== FUNGSI UNTUK FETCH DATA BUDGET IKLAN =====
// Parameter: 
//   - monthKey: dalam format "YYYY-MM" (contoh: "2025-11" untuk November)
//   - marketplaceFilter: filter marketplace (contoh: "TIKTOK", "SHOPEE", atau "All")
const fetchBudgetIklanData = async (monthKey = null, marketplaceFilter = 'All') => {
  try {
    console.log(`Fetching budget iklan data for month: ${monthKey}, marketplace: ${marketplaceFilter}`);

    // Tentukan URL berdasarkan monthKey
    let budgetUrl = BUDGET_IKLAN_URL; // Default fallback
    if (monthKey && BUDGET_IKLAN_URLS[monthKey]) {
      budgetUrl = BUDGET_IKLAN_URLS[monthKey];
      console.log(`Menggunakan URL budget iklan untuk ${monthKey}`);
    } else if (monthKey) {
      console.warn(`Data budget iklan untuk ${monthKey} tidak ditemukan, menggunakan URL default`);
    }

    // Fetch CSV dari Google Sheets
    const response = await fetch(budgetUrl);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const csvText = await response.text();
    const rows = parseCSV(csvText);

    if (!rows || rows.length === 0) {
      console.log('Tidak ada data budget iklan');
      return { total: 0, byMarketplace: {} };
    }

    // Helper function untuk parse tanggal
    const parseDate = (dateStr) => {
      if (!dateStr) return null;

      // Format: "1 Nov 2025" atau "01 Nov 2025"
      const match = dateStr.match(/(\d{1,2})\s+(\w+)\s+(\d{4})/);
      if (match) {
        const [, day, monthName, year] = match;
        const monthNames = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
        const monthIndex = monthNames.findIndex(m => monthName.toLowerCase().startsWith(m));
        if (monthIndex !== -1) {
          return new Date(year, monthIndex, parseInt(day));
        }
      }

      return null;
    };

    // Helper function untuk convert ke number
    const toNumber = (value) => {
      if (value === null || value === undefined || value === '') return 0;
      // Handle format dengan koma (contoh: "44,521" atau "1,234,567")
      const cleaned = String(value).replace(/,/g, '');
      const num = parseFloat(cleaned);
      return isNaN(num) ? 0 : num;
    };

    // Get headers
    const headers = rows.length > 0 ? Object.keys(rows[0]) : [];
    console.log('Budget Iklan Headers:', headers);
    console.log('Budget Iklan Sample Row:', rows[0]);

    // Karena header CSV ter-split multi-line, kita gunakan indeks langsung
    // Kolom A = TANGGAL, Kolom B = MARKETPLACE, Kolom C = PRODUK, Kolom D = TOTAL BIAYA IKLAN
    const tanggalCol = headers[0]; // Kolom A
    const marketplaceCol = headers[1]; // Kolom B
    const totalBiayaCol = headers[3]; // Kolom D

    console.log(`Using columns by index: Tanggal="${tanggalCol}", Marketplace="${marketplaceCol}", Total="${totalBiayaCol}"`);

    // Aggregate data per marketplace
    const byMarketplace = {};
    let totalBudget = 0;
    let processedRows = 0;
    let skippedRows = 0;

    rows.forEach((row, index) => {
      const tanggalStr = row[tanggalCol];
      const marketplace = row[marketplaceCol];
      const totalBiaya = toNumber(row[totalBiayaCol]);

      // Debug log untuk 5 baris pertama
      if (index < 5) {
        console.log(`Row ${index + 1}: Tanggal="${tanggalStr}", Marketplace="${marketplace}", Total=${totalBiaya}`);
      }

      // Skip jika tidak ada tanggal atau marketplace
      if (!tanggalStr || !marketplace) {
        skippedRows++;
        return;
      }

      // Parse tanggal
      const date = parseDate(tanggalStr);
      if (!date) {
        if (index < 5) console.log(`  → Tanggal tidak valid, di-skip`);
        skippedRows++;
        return;
      }

      // Filter berdasarkan bulan jika monthKey diberikan
      if (monthKey) {
        const rowMonthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        if (rowMonthKey !== monthKey) {
          if (index < 5) console.log(`  → Bulan tidak match (${rowMonthKey} vs ${monthKey}), di-skip`);
          skippedRows++;
          return;
        }
      }

      // Normalize marketplace name
      const normalizedMarketplace = marketplace.trim().toUpperCase();

      // Filter berdasarkan marketplace jika bukan "All"
      if (marketplaceFilter !== 'All' && normalizedMarketplace !== marketplaceFilter.toUpperCase()) {
        if (index < 5) console.log(`  → Marketplace tidak match (${normalizedMarketplace} vs ${marketplaceFilter.toUpperCase()}), di-skip`);
        skippedRows++;
        return;
      }

      // Aggregate
      if (!byMarketplace[normalizedMarketplace]) {
        byMarketplace[normalizedMarketplace] = 0;
      }
      byMarketplace[normalizedMarketplace] += totalBiaya;
      totalBudget += totalBiaya;
      processedRows++;

      if (index < 5) console.log(`  → ✓ Diproses, total ${normalizedMarketplace}: ${byMarketplace[normalizedMarketplace]}`);
    });

    console.log(`Budget Iklan Summary: ${processedRows} rows processed, ${skippedRows} rows skipped`);
    console.log('Budget Iklan by Marketplace:', byMarketplace);
    console.log('Total Budget Iklan:', totalBudget.toLocaleString('id-ID'));

    return { total: totalBudget, byMarketplace };
  } catch (error) {
    console.error('Error fetching Budget Iklan data:', error);
    return { total: 0, byMarketplace: {} };
  }
};

// ===== FUNGSI UNTUK PARSE CSV =====
const parseCSV = (csvText) => {
  const lines = csvText.split('\n').filter(line => line.trim());
  if (lines.length === 0) return [];

  // Parse header
  const headers = parseCSVLine(lines[0]);

  // Log headers untuk debugging (hanya sekali saat pertama kali)
  if (!window.headersLogged) {
    console.log('=== Available Headers ===');
    headers.forEach((header, index) => {
      // Convert index to Excel column letter (A, B, C, ..., Z, AA, AB, etc.)
      const colLetter = (() => {
        let col = '';
        let num = index;
        while (num >= 0) {
          col = String.fromCharCode(65 + (num % 26)) + col;
          num = Math.floor(num / 26) - 1;
        }
        return col;
      })();
      console.log(`Column ${colLetter} (${index}): "${header}"`);
    });
    window.headersLogged = true;
  }

  // Parse rows
  const rows = [];
  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);
    if (values.length === 0) continue;

    const row = {};
    headers.forEach((header, index) => {
      row[header] = values[index] || null;
    });
    rows.push(row);
  }

  return rows;
};

// Helper untuk parse CSV line (handle quoted values)
const parseCSVLine = (line) => {
  const result = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const nextChar = line[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        current += '"';
        i++; // Skip next quote
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
};

// ===== FUNGSI UNTUK TRANSFORM DATA DARI GOOGLE SHEETS =====
const transformGoogleSheetsData = (rows) => {
  // Simpan headers untuk akses berdasarkan index
  const headers = rows.length > 0 ? Object.keys(rows[0]) : [];

  const toNumber = (value) => {
    if (value === null || value === undefined || value === '') return 0;
    // Handle Indonesian number format (e.g., "1,234.56" or "1.234,56")
    const cleaned = String(value).replace(/[^\d.-]/g, '').replace(',', '.');
    const num = Number(cleaned);
    return Number.isFinite(num) ? num : 0;
  };

  const cleanText = (value, fallback = 'Tidak diketahui') => {
    if (value === null || value === undefined || value === '') {
      return fallback;
    }
    const text = String(value).trim();
    return text.length ? text : fallback;
  };

  const parseDate = (value) => {
    if (!value) return null;

    // Try parsing as Date object first
    if (value instanceof Date && !Number.isNaN(value.getTime())) {
      return value;
    }

    // Try parsing as string
    if (typeof value === 'string') {
      // Try DD/MM/YYYY format (most common in Indonesian data)
      const ddmmyyyy = value.match(/(\d{1,2})\/(\d{1,2})\/(\d{4})/);
      if (ddmmyyyy) {
        const [, day, month, year] = ddmmyyyy;
        return new Date(year, month - 1, day);
      }

      // Try YYYY-MM-DD format
      const yyyymmdd = value.match(/(\d{4})-(\d{1,2})-(\d{1,2})/);
      if (yyyymmdd) {
        const [, year, month, day] = yyyymmdd;
        return new Date(year, month - 1, day);
      }

      // Try standard Date parsing
      const parsed = new Date(value);
      if (!Number.isNaN(parsed.getTime())) {
        return parsed;
      }
    }

    return null;
  };

  const records = [];

  for (const row of rows) {
    const date =
      parseDate(row['Tanggal Order']) ||
      parseDate(row['Tanggal Input']) ||
      null;

    if (!date) {
      continue;
    }

    const revenue =
      toNumber(row['Nilai Pembayaran']) ||
      toNumber(row['Bayar COD']) ||
      toNumber(row['BAYAR TF']);

    const margin = toNumber(row['Margin']) || toNumber(row['COD']);

    // Omset = Total Harga Jual - Total Subsidi Ongkir
    // Kolom AA = "Harga Jual" (index 26), Kolom W = "Subsidi Ongkir" (index 22)
    let totalHargaJual = 0;
    let totalSubsidiOngkir = 0;

    // Prioritas 1: Cari berdasarkan nama header yang tepat
    if (row['Harga Jual'] !== null && row['Harga Jual'] !== undefined && row['Harga Jual'] !== '') {
      totalHargaJual = toNumber(row['Harga Jual']);
    }
    if (row['Subsidi Ongkir'] !== null && row['Subsidi Ongkir'] !== undefined && row['Subsidi Ongkir'] !== '') {
      totalSubsidiOngkir = toNumber(row['Subsidi Ongkir']);
    }

    // Prioritas 2: Jika belum ketemu, coba variasi nama
    if (totalHargaJual === 0) {
      const hargaJualKeys = [
        'Total Harga Jual', 'Total Harga', 'Harga',
        'HARGA JUAL', 'HARGA', 'harga jual', 'harga',
        'HargaJual', 'TotalHargaJual', 'TotalHarga'
      ];
      for (const key of hargaJualKeys) {
        if (row.hasOwnProperty(key) && row[key] !== null && row[key] !== undefined && row[key] !== '') {
          const val = toNumber(row[key]);
          if (val > 0) {
            totalHargaJual = val;
            break;
          }
        }
      }
    }

    if (totalSubsidiOngkir === 0) {
      const subsidiKeys = [
        'Subsidi', 'Total Diskon', 'Diskon',
        'SUBSIDI ONGKIR', 'SUBSIDI', 'subsidi ongkir', 'subsidi',
        'SubsidiOngkir', 'TotalDiskon'
      ];
      for (const key of subsidiKeys) {
        if (row.hasOwnProperty(key) && row[key] !== null && row[key] !== undefined && row[key] !== '') {
          const val = toNumber(row[key]);
          if (val !== 0) { // Bisa positif atau negatif
            totalSubsidiOngkir = Math.abs(val);
            break;
          }
        }
      }
    }

    // Prioritas 3: Jika masih belum ketemu, akses langsung berdasarkan index kolom
    // Kolom AA = index 26, Kolom W = index 22
    if (totalHargaJual === 0 && headers.length > 26) {
      const colAA = headers[26]; // Kolom AA
      if (colAA && row[colAA] !== null && row[colAA] !== undefined && row[colAA] !== '') {
        totalHargaJual = toNumber(row[colAA]);
      }
    }
    if (totalSubsidiOngkir === 0 && headers.length > 22) {
      const colW = headers[22]; // Kolom W
      if (colW && row[colW] !== null && row[colW] !== undefined && row[colW] !== '') {
        totalSubsidiOngkir = Math.abs(toNumber(row[colW]));
      }
    }

    // Log untuk debugging (hanya beberapa baris pertama)
    if (records.length < 3) {
      const allKeys = Object.keys(row);
      const relevantKeys = allKeys.filter(k =>
        k && (
          k.toLowerCase().includes('harga') ||
          k.toLowerCase().includes('subsidi') ||
          k.toLowerCase().includes('diskon')
        )
      );
      console.log('=== OMSET DEBUG ===');
      console.log('Row index:', records.length);
      console.log('Harga Jual found:', totalHargaJual, 'from column:', row['Harga Jual']);
      console.log('Subsidi Ongkir found:', totalSubsidiOngkir, 'from column:', row['Subsidi Ongkir']);
      console.log('Omset calculated:', Math.max(0, totalHargaJual - totalSubsidiOngkir));
      console.log('Relevant keys found:', relevantKeys);
      console.log('All keys sample (first 30):', allKeys.slice(0, 30));
      if (allKeys.length > 26) {
        console.log('Column AA (index 26):', allKeys[26], '=', row[allKeys[26]]);
      }
      if (allKeys.length > 22) {
        console.log('Column W (index 22):', allKeys[22], '=', row[allKeys[22]]);
      }
    }

    // Omset = Harga Jual - Subsidi Ongkir
    const omset = Math.max(0, totalHargaJual - totalSubsidiOngkir);

    // Ambil RESI dari kolom G (RESI)
    const resi = row['RESI'] || row['Resi'] || row['resi'] || '';
    const hasResi = resi && String(resi).trim().length > 0;
    
    records.push({
      orderDate: date.toISOString(),
      orderTs: date.getTime(),
      year: date.getUTCFullYear(),
      month: date.getUTCMonth(),
      qty: toNumber(row.Qty),
      revenue,
      margin,
      omset, // Omset untuk card 1
      hargaJual: totalHargaJual, // Harga Jual dari kolom AA
      resi: hasResi ? resi : null, // RESI dari kolom G
      transactionType: cleanText(row['Jenis Transaksi']),
      leadsType: cleanText(row['Jenis Leads']),
      doType: cleanText(row['Jenis DOA']),
      product: cleanText(row['Nama Barang']),
      cs: cleanText(row['Nama CS']),
      kabupaten: cleanText(row['Kabupaten'] || row['Kab/Kota'] || row['KABUPATEN'] || row['KAB/KOTA'], ''),
    });
  }

  if (!records.length) {
    throw new Error('Tidak ada data valid yang dapat diproses.');
  }

  records.sort((a, b) => a.orderTs - b.orderTs);

  const revenueTypes = Array.from(
    new Set(records.map((r) => r.transactionType)),
  ).sort();

  const subCategories = Array.from(
    new Set(records.map((r) => r.doType)),
  ).sort();

  const meta = {
    totalRecords: records.length,
    minDate: new Date(records[0].orderTs).toISOString(),
    maxDate: new Date(records[records.length - 1].orderTs).toISOString(),
    revenueTypes,
    subCategories,
  };

  return {
    generatedAt: new Date().toISOString(),
    meta,
    records,
  };
};

// ===== FUNGSI UNTUK LOAD DATA DARI GOOGLE SHEETS =====
const loadDataFromGoogleSheets = async () => {
  try {
    showLoading(true);
    console.log('Memulai load data dari Google Sheets...');

    const rows = await fetchDataFromGoogleSheets();
    console.log('Data rows berhasil di-fetch:', rows.length);

    if (!rows || rows.length === 0) {
      throw new Error('Tidak ada data yang ditemukan di Google Sheets. Pastikan sheet "Penjualan" memiliki data.');
    }

    dataset = transformGoogleSheetsData(rows);
    records = dataset.records;
    meta = dataset.meta;

    console.log('Data berhasil di-transform:', {
      totalRecords: records.length,
      minDate: meta.minDate,
      maxDate: meta.maxDate
    });

    showLoading(false);
    return true;
  } catch (error) {
    console.error('Error loading data from Google Sheets:', error);
    showLoading(false);
    showError(error.message || 'Terjadi kesalahan saat mengambil data dari Google Sheets.');
    return false;
  }
};

// ===== FUNGSI UNTUK SHOW/HIDE LOADING =====
const showLoading = (show) => {
  let loadingEl = document.getElementById('loading-indicator');
  if (!loadingEl && show) {
    loadingEl = document.createElement('div');
    loadingEl.id = 'loading-indicator';
    // SVG Pixel Art Coffee dengan animasi uap
    const coffeeSVG = `
      <div class="coffee-container">
        <svg width="80" height="100" viewBox="0 0 80 100" xmlns="http://www.w3.org/2000/svg" class="coffee-icon">
          <!-- Uap (animated) -->
          <g class="steam">
            <rect x="28" y="0" width="3" height="8" fill="#ffffff" opacity="0.8">
              <animate attributeName="y" values="0;5;0" dur="2s" repeatCount="indefinite"/>
              <animate attributeName="opacity" values="0.8;0.3;0.8" dur="2s" repeatCount="indefinite"/>
            </rect>
            <rect x="35" y="2" width="3" height="10" fill="#ffffff" opacity="0.7">
              <animate attributeName="y" values="2;7;2" dur="2.2s" repeatCount="indefinite"/>
              <animate attributeName="opacity" values="0.7;0.2;0.7" dur="2.2s" repeatCount="indefinite"/>
            </rect>
            <rect x="42" y="0" width="3" height="9" fill="#ffffff" opacity="0.8">
              <animate attributeName="y" values="0;6;0" dur="1.8s" repeatCount="indefinite"/>
              <animate attributeName="opacity" values="0.8;0.3;0.8" dur="1.8s" repeatCount="indefinite"/>
            </rect>
            <rect x="49" y="1" width="3" height="8" fill="#ffffff" opacity="0.7">
              <animate attributeName="y" values="1;5;1" dur="2.1s" repeatCount="indefinite"/>
              <animate attributeName="opacity" values="0.7;0.2;0.7" dur="2.1s" repeatCount="indefinite"/>
            </rect>
          </g>
          <!-- Cangkir -->
          <g class="cup">
            <!-- Badan cangkir -->
            <rect x="20" y="20" width="40" height="50" fill="#ffffff" rx="2"/>
            <!-- Shading kiri -->
            <rect x="20" y="20" width="8" height="50" fill="#e0e0e0" rx="2"/>
            <!-- Handle -->
            <rect x="58" y="30" width="8" height="20" fill="#ffffff" rx="1"/>
            <rect x="60" y="32" width="4" height="16" fill="#e0e0e0" rx="1"/>
            <!-- Kopi -->
            <rect x="22" y="22" width="36" height="12" fill="#4a2c1a"/>
            <!-- Permukaan kopi -->
            <rect x="22" y="22" width="36" height="2" fill="#d0d0d0"/>
            <!-- Highlight -->
            <rect x="24" y="22" width="4" height="2" fill="#ffffff" opacity="0.5"/>
          </g>
        </svg>
      </div>
    `;
    loadingEl.innerHTML = coffeeSVG + '<p>Sedang Memuat Data . . .<br>Boleh Sembari Ngopi Dulu</p>';
    document.body.appendChild(loadingEl);
  }
  if (loadingEl) {
    loadingEl.style.display = show ? 'flex' : 'none';

    // Update coffee icon color berdasarkan palette saat loading ditampilkan
    if (show && chartColors && chartColors.length > 0) {
      const coffeeIcon = loadingEl.querySelector('.coffee-icon');
      if (coffeeIcon) {
        const primaryColor = chartColors[0];
        // Update warna uap dan highlight kopi
        const steamRects = coffeeIcon.querySelectorAll('.steam rect');
        steamRects.forEach(rect => {
          rect.setAttribute('fill', primaryColor);
        });
        const highlight = coffeeIcon.querySelector('.cup rect[fill="#ffffff"][opacity="0.5"]');
        if (highlight) {
          highlight.setAttribute('fill', primaryColor);
          highlight.setAttribute('opacity', '0.6');
        }
      }
    }
  }
};

// ===== FUNGSI UNTUK SHOW ERROR =====
const showError = (message) => {
  let errorEl = document.getElementById('error-message');
  if (!errorEl) {
    errorEl = document.createElement('div');
    errorEl.id = 'error-message';
    document.body.appendChild(errorEl);
  }
  
  // Update warna background berdasarkan color palette yang aktif SEBELUM set innerHTML
  // Pastikan chartColors sudah terdefinisi, jika belum gunakan warna default
  const errorColor = (chartColors && chartColors.length > 0) ? chartColors[0] : '#ff4444';
  console.log('Setting error message color to:', errorColor, 'from palette:', chartColors);
  
  // Set warna background dengan !important agar override CSS
  errorEl.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: ${errorColor} !important;
    background-color: ${errorColor} !important;
    color: #fff !important;
    padding: 16px 20px;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    z-index: 10001;
    max-width: 400px;
    display: block;
  `;
  
  errorEl.innerHTML = `<div class="error-content"><strong>Error:</strong> ${message}</div>`;

  // Auto hide after 10 seconds
  setTimeout(() => {
    errorEl.style.display = 'none';
  }, 10000);
};

let dataset, records, meta;
const dateFormatter = new Intl.DateTimeFormat('id-ID', {
  month: 'short',
  year: '2-digit',
});

const weekFormatter = new Intl.DateTimeFormat('id-ID', {
  month: 'short',
  day: 'numeric',
});

const currencyFormatter = new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR',
  maximumFractionDigits: 0,
});

const filters = {
  start: null,
  end: null,
  revenueType: 'All', // Sekarang digunakan untuk filter Unit Bisnis LKM (LKM MP SHOPEE, LKM MP TIKTOK, dll)
  subCategory: 'LKM', // Default ke LKM (untuk filter utama)
};

let elements = {};

const colorPalettes = {
  light: {
    1: ['#2E7D32', '#FF9B2F', '#FB4141'],
    2: ['#E195AB', '#DE3163', '#CCDF92'],
    3: ['#6D67E4', '#46C2CB', '#F2F7A1'],
    4: ['#BF1A1A', '#FF6C0C', '#FFE08F'],
  },
  dark: {
    1: ['#2E7D32', '#FF9B2F', '#FB4141'],
    2: ['#E195AB', '#DE3163', '#CCDF92'],
    3: ['#6D67E4', '#46C2CB', '#F2F7A1'],
    4: ['#BF1A1A', '#FF6C0C', '#FFE08F'],
  },
};

let displayMode = 'light';
let chartColors = colorPalettes.light[4];

const charts = {};
let trendLineMode = 'revenue';
let indonesiaMap = null; // Variabel untuk menyimpan instance peta
const kabupatenCoordinatesCache = {}; // Cache untuk koordinat kabupaten

const toDateInput = (value) => value.toISOString().slice(0, 10);

const monthKey = (ts) => {
  const date = new Date(ts);
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(
    2,
    '0',
  )}`;
};

const monthLabel = (ts) => dateFormatter.format(new Date(ts));

// Format bulan untuk dropdown (contoh: "October 2025")
const monthLabelForSelect = (year, month) => {
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  return `${monthNames[month]} ${year}`;
};

// Generate list bulan dari data yang tersedia
const getAvailableMonths = () => {
  if (!records || records.length === 0) return [];

  const monthSet = new Set();
  const monthUnitCount = {}; // Untuk tracking unit bisnis per bulan

  records.forEach(record => {
    const date = new Date(record.orderTs);
    // Gunakan local time untuk konsistensi dengan filter
    const year = date.getFullYear();
    const month = date.getMonth();
    const monthKey = `${year}-${String(month + 1).padStart(2, '0')}`;
    monthSet.add(monthKey);

    // Track unit bisnis per bulan
    if (!monthUnitCount[monthKey]) {
      monthUnitCount[monthKey] = { LBM: 0, LKM: 0, NUMETA: 0, Other: 0 };
    }
    const unit = getBusinessUnit(record.doType);
    if (unit === 'LBM' || unit === 'LKM' || unit === 'NUMETA') {
      monthUnitCount[monthKey][unit]++;
    } else {
      monthUnitCount[monthKey].Other++;
    }
  });

  // Convert to array and sort
  const months = Array.from(monthSet).sort().reverse(); // Terbaru di atas

  console.log('=== AVAILABLE MONTHS & UNIT DISTRIBUTION ===');
  months.forEach(monthKey => {
    const [year, month] = monthKey.split('-').map(Number);
    const monthLabel = monthLabelForSelect(year, month - 1);
    const counts = monthUnitCount[monthKey];
    console.log(`${monthLabel}: LBM=${counts.LBM}, LKM=${counts.LKM}, NUMETA=${counts.NUMETA}, Other=${counts.Other}`);
  });

  return months.map(monthKey => {
    const [year, month] = monthKey.split('-').map(Number);
    return {
      key: monthKey,
      year,
      month: month - 1, // JavaScript month is 0-indexed
      label: monthLabelForSelect(year, month - 1)
    };
  });
};

const weekKey = (ts) => {
  const date = new Date(ts);
  const weekStart = new Date(date);
  const day = weekStart.getUTCDay();
  const diff = day === 0 ? -6 : 1 - day;
  weekStart.setUTCDate(weekStart.getUTCDate() + diff);
  weekStart.setUTCHours(0, 0, 0, 0);
  return `${weekStart.getTime()}`;
};

const weekLabel = (ts) => weekFormatter.format(new Date(Number(ts)));

// Fungsi untuk mendapatkan week number dalam bulan (1-4)
// Week 1: tanggal 1-7, Week 2: tanggal 8-14, Week 3: tanggal 15-21, Week 4: tanggal 22-akhir bulan
const getWeekInMonth = (date) => {
  const d = new Date(date);
  const dayOfMonth = d.getDate();

  // Week 1: 1-7, Week 2: 8-14, Week 3: 15-21, Week 4: 22-31
  if (dayOfMonth <= 7) return 1;
  if (dayOfMonth <= 14) return 2;
  if (dayOfMonth <= 21) return 3;
  return 4; // 22-akhir bulan
};

// Fungsi untuk aggregasi by week dalam bulan
const aggregateByWeekInMonth = (data) => {
  const weekData = {
    'Week 1': 0,
    'Week 2': 0,
    'Week 3': 0,
    'Week 4': 0
  };

  data.forEach((row) => {
    const date = new Date(row.orderTs);
    const weekNum = getWeekInMonth(date);
    const weekLabel = `Week ${weekNum}`;
    const value = row.omset || 0;
    weekData[weekLabel] = (weekData[weekLabel] || 0) + value;
  });

  return weekData;
};

const getBusinessUnit = (doType) => {
  if (!doType) return null;
  if (doType.startsWith('LBM')) return 'LBM';
  if (doType.startsWith('LKM')) return 'LKM';
  if (doType.startsWith('NUMETA')) return 'NUMETA';
  return null;
};

// Fungsi untuk mendapatkan opsi Unit Bisnis dari data
// Hanya menampilkan: SHOPEE, TIKTOK, LAZADA, KEMITRAAN (tanpa prefix LKM)
const getLKMUnitBisnisOptions = () => {
  if (!records || records.length === 0) return [];

  // Kata kunci yang dicari di kolom E (doType)
  const keywords = ['SHOPEE', 'TIKTOK', 'LAZADA', 'KEMITRAAN'];

  const foundKeywords = new Set();

  records.forEach(record => {
    if (record.doType) {
      // Normalisasi doType untuk matching (uppercase, trim)
      const normalizedDoType = record.doType.trim().toUpperCase();

      // Cek apakah doType mengandung salah satu kata kunci
      keywords.forEach(keyword => {
        if (normalizedDoType.includes(keyword)) {
          foundKeywords.add(keyword);
        }
      });
    }
  });

  // Return dalam urutan yang ditentukan
  const result = [];
  keywords.forEach(keyword => {
    if (foundKeywords.has(keyword)) {
      result.push(keyword);
    }
  });

  return result;
};

const filterRecords = () => {
  if (!records || !filters.start || !filters.end) {
    return [];
  }

  // Set start date to beginning of day (00:00:00)
  const startDate = new Date(filters.start);
  startDate.setHours(0, 0, 0, 0);
  const startTs = startDate.getTime();

  // Set end date to end of day (23:59:59.999)
  const endDate = new Date(filters.end);
  endDate.setHours(23, 59, 59, 999);
  const endTs = endDate.getTime();

  return records.filter((record) => {
    if (!record || !record.orderTs) return false;
    if (record.orderTs < startTs) return false;
    if (record.orderTs > endTs) return false;

    // Filter Unit Bisnis utama - default ke LKM
    const targetUnit = filters.subCategory || 'LKM';
    if (targetUnit !== 'All') {
      const recordUnit = getBusinessUnit(record.doType);
      if (recordUnit !== targetUnit) {
        return false;
      }
    }

    // Filter Unit Bisnis detail berdasarkan kata kunci (SHOPEE, TIKTOK, LAZADA, KEMITRAAN)
    if (filters.revenueType !== 'All') {
      if (!record.doType) return false;

      // Normalisasi untuk matching berdasarkan contains
      const normalizedFilter = filters.revenueType.trim().toUpperCase();
      const normalizedDoType = record.doType.trim().toUpperCase();

      // Cek apakah kolom E (doType) mengandung kata kunci yang dipilih
      if (!normalizedDoType.includes(normalizedFilter)) {
        return false;
      }
    }

    return true;
  });
};

const aggregateByMonth = (data, valueKey = 'revenue') => {
  const map = new Map();
  data.forEach((item) => {
    const key = monthKey(item.orderTs);
    if (!map.has(key)) {
      map.set(key, {
        key,
        ts: new Date(item.orderTs).setUTCDate(1),
        label: monthLabel(item.orderTs),
        revenue: 0,
        margin: 0,
        omset: 0,
      });
    }
    const bucket = map.get(key);
    bucket.revenue += item.revenue || 0;
    bucket.margin += item.margin || 0;
    bucket.omset += item.omset || 0;
  });
  return Array.from(map.values())
    .sort((a, b) => a.ts - b.ts)
    .map((bucket) => ({ ...bucket, value: bucket[valueKey] || 0 }));
};

const aggregateLeadLag = (data, revenueType = 'All') => {
  // Aggregasi by week dalam bulan (Week 1, Week 2, Week 3, Week 4)
  const weekData = aggregateByWeekInMonth(data);

  // Buat struktur data untuk chart
  const labels = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
  const values = labels.map(week => Math.round(weekData[week] || 0));

  // Gunakan revenueType sebagai label (jika All, tetap gunakan "All", jika TikTok gunakan "TikTok", dll)
  const chartLabel = revenueType && revenueType !== 'All' ? revenueType : 'All';

  // Buat datasets - satu dataset untuk total omset per week
  const datasets = [{
    label: chartLabel,
    backgroundColor: chartColors[0],
    data: values,
    borderRadius: 4,
  }];

  // Total menggunakan omset
  const total = data.reduce((sum, row) => sum + (row.omset || 0), 0);

  return { labels, datasets, total };
};

// Fungsi untuk aggregasi data margin per minggu
const aggregateMarginByWeek = (records) => {
  const weekData = {
    'Week 1': 0,
    'Week 2': 0,
    'Week 3': 0,
    'Week 4': 0
  };

  records.forEach((record) => {
    const weekNum = getWeekInMonth(record.orderTs);
    const weekLabel = `Week ${weekNum}`;
    const value = record.margin || 0;
    weekData[weekLabel] = (weekData[weekLabel] || 0) + value;
  });

  // Buat struktur data untuk chart
  const labels = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
  const values = labels.map(week => Math.round(weekData[week] || 0));

  // Buat datasets - satu dataset untuk total margin per week (area chart)
  const datasets = [{
    label: 'Margin',
    data: values,
    backgroundColor: chartColors[2] || chartColors[0],
    borderColor: chartColors[2] || chartColors[0],
    fill: true,
    tension: 0.4,
  }];

  // Total
  const total = records.reduce((sum, record) => sum + (record.margin || 0), 0);

  return { labels, datasets, total };
};

// Fungsi untuk aggregasi data retur per minggu
const aggregateReturByWeek = (returRecords) => {
  const weekData = {
    'Week 1': 0,
    'Week 2': 0,
    'Week 3': 0,
    'Week 4': 0
  };

  returRecords.forEach((record) => {
    const weekNum = getWeekInMonth(record.date);
    const weekLabel = `Week ${weekNum}`;
    const value = record.returValue || 0;
    weekData[weekLabel] = (weekData[weekLabel] || 0) + value;
  });

  // Buat struktur data untuk chart
  const labels = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
  const values = labels.map(week => Math.round(weekData[week] || 0));

  // Buat datasets - satu dataset untuk total retur per week (area chart)
  const datasets = [{
    label: 'RTS',
    data: values,
    backgroundColor: chartColors[0],
    borderColor: chartColors[0],
    fill: true,
    tension: 0.4,
  }];

  // Total
  const total = returRecords.reduce((sum, record) => sum + (record.returValue || 0), 0);

  return { labels, datasets, total };
};

// Fungsi untuk aggregasi data harga jual per minggu
const aggregateHargaJualByWeek = (records) => {
  const weekData = {
    'Week 1': 0,
    'Week 2': 0,
    'Week 3': 0,
    'Week 4': 0
  };

  records.forEach((record) => {
    const weekNum = getWeekInMonth(record.orderTs);
    const weekLabel = `Week ${weekNum}`;
    const value = record.hargaJual || 0;
    weekData[weekLabel] = (weekData[weekLabel] || 0) + value;
  });

  // Buat struktur data untuk chart
  const labels = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
  const values = labels.map(week => Math.round(weekData[week] || 0));

  // Buat datasets - satu dataset untuk total harga jual per week (area chart)
  const datasets = [{
    label: 'Harga Jual',
    data: values,
    backgroundColor: chartColors[1] || chartColors[0],
    borderColor: chartColors[1] || chartColors[0],
    fill: true,
    tension: 0.4,
  }];

  // Total
  const total = records.reduce((sum, record) => sum + (record.hargaJual || 0), 0);

  return { labels, datasets, total };
};

// ===== FUNGSI UNTUK GEOCODING KABUPATEN =====
// Menggunakan Nominatim (OpenStreetMap) untuk mendapatkan koordinat
const geocodeKabupaten = async (kabupatenName) => {
  if (!kabupatenName || kabupatenName.trim() === '') {
    return null;
  }

  // Cek cache dulu
  const cacheKey = kabupatenName.trim().toLowerCase();
  if (kabupatenCoordinatesCache[cacheKey]) {
    return kabupatenCoordinatesCache[cacheKey];
  }

  try {
    // Query ke Nominatim dengan fokus ke Indonesia
    const query = encodeURIComponent(`${kabupatenName}, Indonesia`);
    const url = `https://nominatim.openstreetmap.org/search?q=${query}&format=json&limit=1&countrycodes=id`;

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'SalesReportDashboard/1.0'
      }
    });

    if (!response.ok) {
      console.warn(`Geocoding failed for ${kabupatenName}: ${response.status}`);
      return null;
    }

    const data = await response.json();

    if (data && data.length > 0) {
      const result = {
        lat: parseFloat(data[0].lat),
        lon: parseFloat(data[0].lon),
        displayName: data[0].display_name
      };

      // Simpan ke cache
      kabupatenCoordinatesCache[cacheKey] = result;

      // Rate limiting: tunggu 1 detik sebelum request berikutnya
      await new Promise(resolve => setTimeout(resolve, 1000));

      return result;
    }

    return null;
  } catch (error) {
    console.warn(`Error geocoding ${kabupatenName}:`, error);
    return null;
  }
};

// ===== FUNGSI UNTUK INISIALISASI PETA INDONESIA =====
const initIndonesiaMap = () => {
  const mapContainer = document.getElementById('indonesiaMap');
  if (!mapContainer) {
    console.warn('Element indonesiaMap tidak ditemukan');
    return;
  }

  // Inisialisasi peta dengan center di Indonesia
  indonesiaMap = L.map('indonesiaMap').setView([-2.5, 118.0], 5);

  // Tambahkan tile layer (peta dasar)
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors',
    maxZoom: 19,
  }).addTo(indonesiaMap);

  console.log('Peta Indonesia berhasil diinisialisasi');
};

// ===== FUNGSI UNTUK UPDATE PETA DENGAN MARKER =====
const updateIndonesiaMap = async (filteredRecords) => {
  if (!indonesiaMap) {
    initIndonesiaMap();
  }

  if (!indonesiaMap) {
    console.warn('Peta belum diinisialisasi');
    return;
  }

  // Hapus semua marker yang ada (CircleMarker dan Marker)
  const markersToRemove = [];
  indonesiaMap.eachLayer((layer) => {
    if (layer instanceof L.Marker || layer instanceof L.CircleMarker) {
      markersToRemove.push(layer);
    }
  });
  markersToRemove.forEach(marker => indonesiaMap.removeLayer(marker));

  if (!filteredRecords || filteredRecords.length === 0) {
    console.log('Tidak ada data untuk ditampilkan di peta');
    return;
  }

  // Kumpulkan semua kabupaten unik dari data yang difilter
  const kabupatenSet = new Set();
  filteredRecords.forEach(record => {
    if (record.kabupaten && record.kabupaten.trim() !== '' && record.kabupaten !== 'Tidak diketahui') {
      kabupatenSet.add(record.kabupaten.trim());
    }
  });

  console.log(`Menampilkan ${kabupatenSet.size} kabupaten di peta`);

  // Geocode dan tambahkan marker untuk setiap kabupaten
  let geocodedCount = 0;
  const maxGeocode = 50; // Limit untuk menghindari terlalu banyak request

  for (const kabupaten of Array.from(kabupatenSet).slice(0, maxGeocode)) {
    try {
      const coords = await geocodeKabupaten(kabupaten);

      if (coords) {
        // Hitung jumlah order untuk kabupaten ini
        const orderCount = filteredRecords.filter(r =>
          r.kabupaten && r.kabupaten.trim() === kabupaten
        ).length;

        // Buat marker merah
        const marker = L.circleMarker([coords.lat, coords.lon], {
          radius: Math.min(8 + Math.log(orderCount + 1) * 2, 15),
          fillColor: '#ff0000',
          color: '#cc0000',
          weight: 2,
          opacity: 1,
          fillOpacity: 0.7
        }).addTo(indonesiaMap);

        // Tambahkan popup dengan informasi
        marker.bindPopup(`
          <strong>${kabupaten}</strong><br>
          Jumlah Order: ${orderCount}
        `);

        geocodedCount++;
      }
    } catch (error) {
      console.warn(`Error menambahkan marker untuk ${kabupaten}:`, error);
    }
  }

  console.log(`Berhasil menambahkan ${geocodedCount} marker di peta`);

  // Fit bounds jika ada marker
  if (geocodedCount > 0) {
    const group = new L.featureGroup();
    indonesiaMap.eachLayer((layer) => {
      if (layer instanceof L.CircleMarker) {
        group.addLayer(layer);
      }
    });

    if (group.getLayers().length > 0) {
      indonesiaMap.fitBounds(group.getBounds().pad(0.1));
    }
  }
};

const aggregateVariance = (data) => {
  const months = aggregateByMonth(data);
  const actual = months.map((m) => m.revenue);
  const expected = months.map((value, idx) => {
    if (idx === 0) {
      return value.revenue * 1.05;
    }
    const prev = months[idx - 1].revenue || 1;
    const momentum = value.revenue / prev;
    return value.revenue * (0.92 + Math.min(momentum, 1.15) * 0.1);
  });

  return {
    labels: months.map((m) => m.label),
    actual,
    expected,
  };
};

const aggregateTrend = (data) => {
  const months = aggregateByMonth(data);
  const revenue = months.map((m) => m.revenue);
  const growth = revenue.map((value, idx) => {
    if (idx === 0) return 0;
    const prev = revenue[idx - 1] || 1;
    return ((value - prev) / prev) * 100;
  });
  return {
    labels: months.map((m) => m.label),
    revenue,
    growth,
  };
};


const aggregateBreakdown = (data, key) => {
  const totals = {};
  data.forEach((row) => {
    const label = cleanLabel(row[key]);
    totals[label] = (totals[label] || 0) + row.revenue;
  });

  const entries = Object.entries(totals).sort((a, b) => b[1] - a[1]);
  return entries;
};

// Fungsi untuk aggregate data budget iklan untuk polar area chart
const aggregateBudgetIklan = (budgetData) => {
  if (!budgetData || !budgetData.byMarketplace) {
    return { labels: [], data: [], total: 0 };
  }

  const { byMarketplace, total } = budgetData;

  // Convert object to array dan sort berdasarkan nilai (descending)
  const entries = Object.entries(byMarketplace).sort((a, b) => b[1] - a[1]);

  // Extract labels dan data
  const labels = entries.map(([marketplace]) => marketplace);
  const data = entries.map(([, value]) => value);

  return { labels, data, total };
};

const cleanLabel = (label) => {
  if (!label || label === 'Tidak diketahui') {
    return 'Tidak diketahui';
  }
  return label;
};

const aggregateTrendLine = (data) => {
  const weeks = new Map();
  data.forEach((row) => {
    const key = weekKey(row.orderTs);
    if (!weeks.has(key)) {
      weeks.set(key, { key, revenue: 0 });
    }
    weeks.get(key).revenue += row.revenue;
  });
  return Array.from(weeks.entries())
    .sort((a, b) => Number(a[0]) - Number(b[0]))
    .map(([key, value]) => ({
      label: weekLabel(key),
      revenue: value.revenue,
    }));
};

const aggregateTrendCagr = (data) => {
  const months = aggregateByMonth(data);
  if (!months.length) return [];
  const base = months[0].revenue || 1;
  return months.map((month, index) => {
    const periods = index + 1;
    const ratio = month.revenue / base;
    const cagr = Math.pow(Math.max(ratio, 0.0001), 1 / periods) - 1;
    return {
      label: month.label,
      revenue: cagr * 100,
    };
  });
};


const initSelect = (select, options) => {
  // Hapus semua opsi kecuali yang pertama (All)
  while (select.options.length > 1) {
    select.remove(1);
  }
  // Tambahkan opsi baru (skip 'All' karena sudah ada)
  options.forEach((option) => {
    if (option === 'All') return; // Skip karena sudah ada di HTML
    const el = document.createElement('option');
    el.value = option;
    el.textContent = option;
    select.appendChild(el);
  });
};

const initFilters = () => {
  // Set default Unit Bisnis ke LKM
  filters.subCategory = 'LKM';
  if (elements.subCategory) {
    elements.subCategory.value = 'LKM';
  }

  // Generate dropdown bulan dari data yang tersedia
  const availableMonths = getAvailableMonths();
  const monthSelect = document.getElementById('monthSelect');

  if (monthSelect) {
    // Clear existing options
    monthSelect.innerHTML = '';

    if (availableMonths.length === 0) {
      const option = document.createElement('option');
      option.value = '';
      option.textContent = 'Tidak ada data';
      monthSelect.appendChild(option);
    } else {
      // Add options
      availableMonths.forEach(month => {
        const option = document.createElement('option');
        option.value = month.key;
        option.textContent = month.label;
        monthSelect.appendChild(option);
      });

      // Set default ke bulan terbaru (index 0 karena sudah di-sort reverse)
      if (availableMonths.length > 0) {
        const latestMonth = availableMonths[0];
        monthSelect.value = latestMonth.key;

        // Set start dan end date berdasarkan bulan yang dipilih
        const startDate = new Date(latestMonth.year, latestMonth.month, 1);
        startDate.setHours(0, 0, 0, 0);
        const endDate = new Date(latestMonth.year, latestMonth.month + 1, 0); // Last day of month
        endDate.setHours(23, 59, 59, 999);

        filters.start = startDate;
        filters.end = endDate;

        console.log(`Default bulan: ${latestMonth.label}`);
        console.log(`Available months:`, availableMonths.map(m => m.label));
        console.log(`Start date: ${startDate.toISOString()}`);
        console.log(`End date: ${endDate.toISOString()}`);

        // Update hidden input fields
        if (elements.startDate) {
          elements.startDate.value = toDateInput(startDate);
        }
        if (elements.endDate) {
          elements.endDate.value = toDateInput(endDate);
        }
      }
    }

    // Event listener untuk dropdown bulan
    monthSelect.addEventListener('change', () => {
      const selectedKey = monthSelect.value;
      if (selectedKey) {
        const selectedMonth = availableMonths.find(m => m.key === selectedKey);
        if (selectedMonth) {
          // Set start date ke tanggal 1 bulan tersebut (00:00:00)
          const startDate = new Date(selectedMonth.year, selectedMonth.month, 1);
          startDate.setHours(0, 0, 0, 0);

          // Set end date ke tanggal terakhir bulan tersebut (23:59:59.999)
          const endDate = new Date(selectedMonth.year, selectedMonth.month + 1, 0);
          endDate.setHours(23, 59, 59, 999);

          filters.start = startDate;
          filters.end = endDate;

          console.log(`Bulan dipilih: ${selectedMonth.label}`);
          console.log(`Start date: ${startDate.toISOString()}`);
          console.log(`End date: ${endDate.toISOString()}`);
          console.log(`Total records: ${records ? records.length : 0}`);

          // Update hidden input fields
          if (elements.startDate) {
            elements.startDate.value = toDateInput(startDate);
          }
          if (elements.endDate) {
            elements.endDate.value = toDateInput(endDate);
          }

          updateDashboard();
        } else {
          console.warn('Bulan yang dipilih tidak ditemukan:', selectedKey);
        }
      }
    });
  }

  // Populate dropdown Unit Bisnis dengan opsi LKM dari data
  const lkmOptions = getLKMUnitBisnisOptions();
  initSelect(elements.revenueType, ['All', ...lkmOptions]);

  elements.revenueType.addEventListener('change', () => {
    filters.revenueType = elements.revenueType.value;
    updateDashboard();
  });

  elements.displayMode.addEventListener('change', () => {
    displayMode = elements.displayMode.value || 'light';
    const paletteId = elements.colorPalette.value || '4';
    // Pastikan chartColors selalu valid (wallpaper menggunakan light palette)
    const modeForPalette = displayMode === 'wallpaper' ? 'light' : displayMode;
    const modePalettes = colorPalettes[modeForPalette];
    if (modePalettes && modePalettes[paletteId]) {
      chartColors = modePalettes[paletteId];
    } else {
      chartColors = colorPalettes.light[4]; // Fallback
    }
    applyDisplayMode();
    applyColorPalette();
    updateDashboard();
  });

  elements.colorPalette.addEventListener('change', () => {
    const paletteId = elements.colorPalette.value || '4';
    // Pastikan chartColors selalu valid (wallpaper menggunakan light palette)
    const modeForPalette = displayMode === 'wallpaper' ? 'light' : displayMode;
    const modePalettes = colorPalettes[modeForPalette];
    if (modePalettes && modePalettes[paletteId]) {
      chartColors = modePalettes[paletteId];
    } else {
      chartColors = colorPalettes.light[4]; // Fallback
    }
    applyColorPalette();
    updateDashboard();
  });

  document.querySelectorAll('[data-trend-view]').forEach((button) => {
    button.addEventListener('click', () => {
      document
        .querySelectorAll('[data-trend-view]')
        .forEach((btn) => btn.classList.remove('active'));
      button.classList.add('active');
      trendLineMode = button.dataset.trendView;
      updateDashboard();
    });
  });
};

const initCharts = () => {
  const leadLagEl = document.getElementById('leadLagChart');
  if (leadLagEl) {
    charts.leadLag = new Chart(leadLagEl, {
      type: 'bar',
      data: { labels: [], datasets: [] },
      options: {
        responsive: true,
        scales: {
          x: {
            stacked: true,
          },
          y: {
            stacked: true,
            ticks: {
              callback: (value) => `${(value / 1_000_000).toFixed(1)}jt`,
            },
          },
        },
        plugins: {
          legend: { position: 'bottom' },
        },
      },
    });
  } else {
    console.warn('Element leadLagChart tidak ditemukan');
  }

  const omsetKotorEl = document.getElementById('omsetKotorChart');
  if (omsetKotorEl) {
    charts.omsetKotor = new Chart(omsetKotorEl, {
      type: 'bar',
      data: { labels: [], datasets: [] },
      options: {
        responsive: true,
        scales: {
          x: {
            stacked: true,
          },
          y: {
            stacked: true,
            ticks: {
              callback: (value) => `${(value / 1_000_000).toFixed(1)}jt`,
            },
          },
        },
        plugins: {
          legend: { position: 'bottom' },
        },
      },
    });
  } else {
    console.warn('Element omsetKotorChart tidak ditemukan');
  }

  const returChartEl = document.getElementById('returChart');
  if (returChartEl) {
    // Ambil tinggi chart Omset sebagai referensi
    const leadLagChartEl = document.getElementById('leadLagChart');
    const targetHeight = leadLagChartEl ? leadLagChartEl.offsetHeight : 300;

    charts.retur = new Chart(returChartEl, {
      type: 'line',
      data: { labels: [], datasets: [] },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          mode: 'index',
          intersect: false,
        },
        scales: {
          x: {
            stacked: true,
          },
          y: {
            stacked: true,
            ticks: {
              callback: (value) => `${(value / 1_000_000).toFixed(1)}jt`,
            },
          },
        },
        plugins: {
          legend: { position: 'bottom' },
        },
        elements: {
          point: {
            radius: 0,
          },
        },
      },
    });

    // Set tinggi chart Retur sama dengan chart Omset
    if (returChartEl.parentElement) {
      returChartEl.parentElement.style.height = `${targetHeight}px`;
    }
  } else {
    console.warn('Element returChart tidak ditemukan');
  }

  const hargaJualChartEl = document.getElementById('hargaJualChart');
  if (hargaJualChartEl) {
    // Ambil tinggi chart Omset sebagai referensi (sama seperti chart Retur)
    const leadLagChartEl = document.getElementById('leadLagChart');
    const targetHeight = leadLagChartEl ? leadLagChartEl.offsetHeight : 300;

    charts.hargaJual = new Chart(hargaJualChartEl, {
      type: 'line',
      data: { labels: [], datasets: [] },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          mode: 'index',
          intersect: false,
        },
        scales: {
          x: {
            stacked: true,
          },
          y: {
            stacked: true,
            ticks: {
              callback: (value) => `${(value / 1_000_000).toFixed(1)}jt`,
            },
          },
        },
        plugins: {
          legend: { position: 'bottom' },
        },
        elements: {
          point: {
            radius: 0,
          },
        },
      },
    });

    // Set tinggi chart Harga Jual sama dengan chart Retur (menggunakan parentElement)
    if (hargaJualChartEl.parentElement) {
      hargaJualChartEl.parentElement.style.height = `${targetHeight}px`;
    }
  } else {
    console.warn('Element hargaJualChart tidak ditemukan');
  }

  const marginChartEl = document.getElementById('marginChart');
  if (marginChartEl) {
    // Ambil tinggi chart Omset sebagai referensi (sama seperti chart Retur)
    const leadLagChartEl = document.getElementById('leadLagChart');
    const targetHeight = leadLagChartEl ? leadLagChartEl.offsetHeight : 300;

    charts.margin = new Chart(marginChartEl, {
      type: 'line',
      data: { labels: [], datasets: [] },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          mode: 'index',
          intersect: false,
        },
        scales: {
          x: {
            stacked: true,
          },
          y: {
            stacked: true,
            ticks: {
              callback: (value) => `${(value / 1_000_000).toFixed(1)}jt`,
            },
          },
        },
        plugins: {
          legend: { position: 'bottom' },
        },
        elements: {
          point: {
            radius: 0,
          },
        },
      },
    });

    // Set tinggi chart Margin sama dengan chart Retur (menggunakan parentElement)
    if (marginChartEl.parentElement) {
      marginChartEl.parentElement.style.height = `${targetHeight}px`;
    }
  } else {
    console.warn('Element marginChart tidak ditemukan');
  }

  const varianceEl = document.getElementById('varianceChart');
  if (varianceEl) {
    charts.variance = new Chart(varianceEl, {
      type: 'bar',
      data: {
        labels: [],
        datasets: [
          {
            label: 'Actual',
            backgroundColor: chartColors[0],
            borderRadius: 4,
            data: [],
          },
          {
            label: 'Expected',
            backgroundColor: chartColors[1] || chartColors[0],
            borderRadius: 4,
            data: [],
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'bottom' },
        },
        scales: {
          y: {
            ticks: {
              callback: (value) => `${(value / 1_000_000).toFixed(1)}jt`,
            },
          },
        },
      },
    });
  } else {
    console.warn('Element varianceChart tidak ditemukan');
  }

  const trendComboEl = document.getElementById('trendComboChart');
  if (trendComboEl) {
    charts.trendCombo = new Chart(trendComboEl, {
      data: {
        labels: [],
        datasets: [
          {
            type: 'bar',
            label: 'Revenue',
            backgroundColor: chartColors[0],
            borderRadius: 4,
            data: [],
            yAxisID: 'y',
          },
          {
            type: 'line',
            label: 'Growth %',
            borderColor: chartColors[1] || chartColors[0],
            backgroundColor: chartColors[1] || chartColors[0],
            data: [],
            yAxisID: 'y1',
            tension: 0.4,
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          y: {
            position: 'left',
            ticks: {
              callback: (value) => `${(value / 1_000_000).toFixed(1)}M`,
            },
          },
          y1: {
            position: 'right',
            grid: { drawOnChartArea: false },
            ticks: {
              callback: (value) => `${value.toFixed(0)}%`,
            },
          },
        },
      },
    });
  } else {
    console.warn('Element trendComboChart tidak ditemukan');
  }

  const trendLineEl = document.getElementById('trendLineChart');
  if (trendLineEl) {
    charts.trendLine = new Chart(trendLineEl, {
      type: 'line',
      data: { labels: [], datasets: [] },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false },
        },
        tension: 0.4,
        scales: {
          y: {
            ticks: {
              callback: (value) => `${(value / 1_000_000).toFixed(1)}M`,
            },
          },
        },
      },
    });
  } else {
    console.warn('Element trendLineChart tidak ditemukan');
  }

  // Set border untuk doughnut chart berdasarkan mode
  const isDarkInit = displayMode === 'dark';
  const borderWidth = isDarkInit ? 0 : 2;
  const borderColor = isDarkInit ? 'transparent' : '#fff';

  const breakdownEl = document.getElementById('breakdownChart');
  if (breakdownEl) {
    // Set tinggi chart Budget Iklan sama dengan chart Retur
    const returChartEl = document.getElementById('returChart');
    const targetHeight = returChartEl ? returChartEl.offsetHeight : 300;
    
    charts.breakdown = new Chart(breakdownEl, {
      type: 'polarArea',
      data: {
        labels: [],
        datasets: [{
          data: [],
          backgroundColor: chartColors,
          borderWidth: borderWidth,
          borderColor: borderColor,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (context) => {
                const label = context.label || '';
                const value = context.parsed.r || 0;
                const formatted = new Intl.NumberFormat('id-ID', {
                  style: 'currency',
                  currency: 'IDR',
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0
                }).format(value);
                return `${label}: ${formatted}`;
              }
            }
          }
        },
        scales: {
          r: {
            beginAtZero: true,
            ticks: {
              display: false
            },
            grid: {
              color: displayMode === 'dark' ? '#444' : '#e0e0e0'
            }
          }
        }
      },
    });
    
    // Set tinggi container chart (div pembungkus canvas)
    const chartContainer = breakdownEl.parentElement;
    if (chartContainer && chartContainer.style) {
      chartContainer.style.height = `${targetHeight}px`;
      chartContainer.style.maxHeight = `${targetHeight}px`;
    }
  } else {
    console.warn('Element breakdownChart tidak ditemukan');
  }

  // Chart Profit (di bawah Budget Iklan di Card 3)
  const profitEl = document.getElementById('profitChart');
  if (profitEl) {
    charts.profit = new Chart(profitEl, {
      type: 'bar',
      data: { labels: [], datasets: [] },
      options: {
        indexAxis: 'y', // Horizontal bar chart
        responsive: true,
        maintainAspectRatio: false,
        layout: {
          padding: {
            top: 10,
            bottom: 10,
            left: 10,
            right: 10
          }
        },
        scales: {
          x: {
            stacked: true,
            ticks: {
              callback: (value) => `${(value / 1_000_000).toFixed(1)}jt`,
            },
          },
          y: {
            stacked: true,
            ticks: {
              autoSkip: false, // Jangan skip label apapun
            },
          },
        },
        plugins: {
          legend: { position: 'bottom' },
        },
      },
    });
  } else {
    console.warn('Element profitChart tidak ditemukan');
  }

  const contributionEl = document.getElementById('contributionChart');
  if (contributionEl) {
    charts.contribution = new Chart(contributionEl, {
      type: 'doughnut',
      data: {
        labels: [],
        datasets: [{
          data: [],
          backgroundColor: chartColors,
          borderWidth: borderWidth,
          borderColor: borderColor,
        }],
      },
      options: {
        plugins: { legend: { position: 'bottom' } },
        cutout: '50%',
      },
    });
  } else {
    console.warn('Element contributionChart tidak ditemukan');
  }

};

const updateTrendLine = (data) => {
  let points = [];
  if (trendLineMode === 'revenue') {
    points = aggregateTrendLine(data);
  } else {
    points = aggregateTrendCagr(data);
  }
  const primaryColor = chartColors[0];
  // Convert hex to rgba for background
  const hexToRgba = (hex, alpha) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  if (charts.trendLine) {
    charts.trendLine.data.labels = points.map((item) => item.label);
    charts.trendLine.data.datasets = [
      {
        label: trendLineMode === 'revenue' ? 'Weekly Revenue' : 'CAGR %',
        data: points.map((item) =>
          trendLineMode === 'revenue' ? item.revenue : item.revenue,
        ),
        borderColor: primaryColor,
        backgroundColor: hexToRgba(primaryColor, 0.4),
        fill: true,
        tension: 0.4,
      },
    ];
    charts.trendLine.options.scales.y.ticks.callback =
      trendLineMode === 'revenue'
        ? (value) => `${(value / 1_000_000).toFixed(1)}jt`
        : (value) => `${value.toFixed(1)}%`;
    charts.trendLine.update();
  }
};

const updateBreakdownLegend = (entries) => {
  elements.breakdownLegend.textContent = '';
  
  entries.forEach(([label, value], index) => {
    const item = document.createElement('div');
    item.className = 'legend-item';
    const swatch = document.createElement('span');
    swatch.className = 'legend-swatch';
    swatch.style.backgroundColor = chartColors[index % chartColors.length];
    const text = document.createElement('span');
    // Hilangkan persentase, hanya tampilkan nama marketplace
    text.textContent = label;
    item.append(swatch, text);
    elements.breakdownLegend.appendChild(item);
  });
};

// Fungsi untuk update chart theme (hanya options, tidak update chart)
const updateChartTheme = (chart, isDark) => {
  if (!chart || !chart.options) return;

  const textColor = isDark ? '#e0e0e0' : '#666';
  const gridColor = isDark ? '#444' : '#e0e0e0';

  if (chart.options.scales) {
    Object.keys(chart.options.scales).forEach(scaleKey => {
      const scale = chart.options.scales[scaleKey];
      if (scale.ticks) {
        scale.ticks.color = textColor;
      }
      if (scale.grid) {
        scale.grid.color = gridColor;
      }
    });
  }

  if (chart.options.plugins && chart.options.plugins.legend) {
    if (!chart.options.plugins.legend.labels) {
      chart.options.plugins.legend.labels = {};
    }
    chart.options.plugins.legend.labels.color = textColor;
  }

  // Hilangkan border pada doughnut chart saat dark mode
  if (chart.config && chart.config.type === 'doughnut' && chart.data && chart.data.datasets) {
    chart.data.datasets.forEach(dataset => {
      if (isDark) {
        dataset.borderWidth = 0;
        dataset.borderColor = 'transparent';
      } else {
        // Kembalikan border default untuk light mode (jika diperlukan)
        if (dataset.borderWidth === 0) {
          dataset.borderWidth = 2;
          dataset.borderColor = '#fff';
        }
      }
    });
  }
};

// Fungsi untuk apply display mode (hanya styling DOM, TIDAK update chart)
const applyDisplayMode = () => {
  const body = document.body;
  const isDark = displayMode === 'dark';
  const isWallpaper = displayMode === 'wallpaper';

  if (isWallpaper) {
    // Wallpaper mode: background dengan gambar 1.png (ukuran sama seperti login)
    body.classList.remove('dark-mode');
    body.style.backgroundImage = "url('gambar 1.png')";
    body.style.backgroundSize = 'cover';
    body.style.backgroundPosition = 'center';
    body.style.backgroundRepeat = 'no-repeat';
    body.style.backgroundAttachment = 'fixed';
    body.style.backgroundColor = '';
    body.style.color = '';

    // Card tetap putih dengan transparansi (termasuk card 3)
    document.querySelectorAll('.card').forEach(card => {
      card.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
      card.style.color = '';
    });

    const filterCard = document.querySelector('.filters-card');
    if (filterCard) {
      filterCard.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
    }

    document.querySelectorAll('input, select').forEach(el => {
      el.style.backgroundColor = '';
      el.style.color = '';
      el.style.borderColor = '';
    });

    document.querySelectorAll('label').forEach(label => {
      label.style.color = '';
    });

    document.querySelectorAll('h2, .subtitle').forEach(el => {
      el.style.color = '';
    });

    document.querySelectorAll('.caption').forEach(caption => {
      caption.style.color = '#1f2b4a';
    });

    document.querySelectorAll('.chart-separator').forEach(div => {
      div.style.borderTopColor = '#e0e0e0';
    });

    // Tambahkan efek glow/shadow pada header untuk wallpaper mode agar lebih terlihat
    const headerH1 = document.querySelector('.dashboard-header h1');
    const companyName = document.querySelector('.dashboard-header .company-name');
    
    if (headerH1) {
      // Text shadow dengan efek glow yang kuat (multiple shadows untuk efek bersinar)
      headerH1.style.textShadow = '0 0 10px rgba(255, 255, 255, 0.8), 0 0 20px rgba(255, 255, 255, 0.6), 0 0 30px rgba(255, 255, 255, 0.4), 0 2px 4px rgba(0, 0, 0, 0.5)';
      headerH1.style.color = '#fff';
      headerH1.style.fontWeight = '700';
    }
    
    if (companyName) {
      // Text shadow dengan efek glow yang lebih halus untuk company name
      companyName.style.textShadow = '0 0 8px rgba(255, 255, 255, 0.7), 0 0 15px rgba(255, 255, 255, 0.5), 0 0 25px rgba(255, 255, 255, 0.3), 0 1px 2px rgba(0, 0, 0, 0.4)';
      companyName.style.color = '#fff';
    }

    // Disable color palette select dan set ke palette 4 saat wallpaper mode
    if (elements.colorPalette) {
      elements.colorPalette.disabled = true;
      elements.colorPalette.value = '4';
      // Update chartColors ke palette 4
      const modeForPalette = 'light'; // Wallpaper menggunakan light palette
      const modePalettes = colorPalettes[modeForPalette];
      if (modePalettes && modePalettes[4]) {
        chartColors = modePalettes[4];
        applyColorPalette();
      }
    }

    const returOktoberNote = document.getElementById('returOktoberNote');
    if (returOktoberNote) {
      returOktoberNote.style.color = '#7b88a8';
    }

    const dashboardHeader = document.querySelector('.dashboard-header h1');
    if (dashboardHeader) {
      dashboardHeader.style.color = '';
    }

    const footerTexts = document.querySelectorAll('.dashboard-footer p');
    footerTexts.forEach(footer => {
      if (footer.classList.contains('motivation')) {
        footer.style.color = '#7b88a8';
      } else {
        footer.style.color = '#7b88a8';
      }
    });

    const returValue = document.getElementById('returValue');
    if (returValue) {
      returValue.style.color = '';
    }
    const returSubtitle = document.getElementById('returSubtitle');
    if (returSubtitle) {
      returSubtitle.style.color = '#7b88a8';
    }
    const returDisplay = document.getElementById('returDisplay');
    if (returDisplay) {
      returDisplay.style.color = '';
    }

    const returChartLoading = document.getElementById('returChartLoading');
    if (returChartLoading) {
      returChartLoading.style.background = 'rgba(255, 255, 255, 0.9)';
      const spinner = returChartLoading.querySelector('.retur-spinner');
      if (spinner) {
        spinner.style.borderColor = 'rgba(90, 100, 199, 0.2)';
        spinner.style.borderTopColor = '#5a64c7';
      }
    }
  } else if (isDark) {
    body.classList.add('dark-mode');
    body.style.backgroundColor = '#1a1a1a';
    body.style.color = '#e0e0e0';

    document.querySelectorAll('.card').forEach(card => {
      card.style.backgroundColor = '#2d2d2d';
      card.style.color = '#e0e0e0';
    });

    // Reset card 3 (breakdown/profit) saat dark mode (akan di-handle oleh applyColorPalette)
    const card3 = document.querySelector('.card.breakdown');
    if (card3) {
      card3.style.backgroundColor = '#2d2d2d';
      card3.style.color = '#e0e0e0';
    }

    // Update card number styling for dark mode (warna akan di-update oleh applyColorPalette)
    // Tidak perlu set manual di sini karena applyColorPalette akan handle

    const filterCard = document.querySelector('.filters-card');
    if (filterCard) {
      filterCard.style.backgroundColor = '#2d2d2d';
    }

    document.querySelectorAll('input, select').forEach(el => {
      el.style.backgroundColor = '#3d3d3d';
      el.style.color = '#e0e0e0';
      el.style.borderColor = '#555';
    });

    document.querySelectorAll('label').forEach(label => {
      label.style.color = '#e0e0e0';
    });

    document.querySelectorAll('h2, .subtitle').forEach(el => {
      el.style.color = '#e0e0e0';
    });

    // Update caption untuk dark mode
    document.querySelectorAll('.caption').forEach(caption => {
      caption.style.color = '#e0e0e0';
    });

    // Reset text shadow untuk header saat dark mode (tidak perlu glow)
    const headerH1 = document.querySelector('.dashboard-header h1');
    const companyName = document.querySelector('.dashboard-header .company-name');
    
    if (headerH1) {
      headerH1.style.textShadow = '';
      headerH1.style.color = '#e0e0e0';
    }
    
    if (companyName) {
      companyName.style.textShadow = '';
      companyName.style.color = 'rgba(255, 255, 255, 0.7)';
    }

    // Enable color palette select saat dark mode
    if (elements.colorPalette) {
      elements.colorPalette.disabled = false;
    }

    // Update border pembatas untuk dark mode
    document.querySelectorAll('.chart-separator').forEach(div => {
      div.style.borderTopColor = '#444';
    });

    // Update keterangan Oktober untuk dark mode
    const returOktoberNote = document.getElementById('returOktoberNote');
    if (returOktoberNote) {
      returOktoberNote.style.color = '#9ba5c0';
    }

    // Update dashboard header
    const dashboardHeader = document.querySelector('.dashboard-header h1');
    if (dashboardHeader) {
      dashboardHeader.style.color = '#e0e0e0';
    }

    // Update footer
    const footerTexts = document.querySelectorAll('.dashboard-footer p');
    footerTexts.forEach(footer => {
      if (footer.classList.contains('motivation')) {
        footer.style.color = '#9ba5c0';
      } else {
        footer.style.color = '#7b88a8';
      }
    });

    // Update retur value dan subtitle untuk dark mode
    const returValue = document.getElementById('returValue');
    if (returValue) {
      returValue.style.color = '#e0e0e0';
    }
    const returSubtitle = document.getElementById('returSubtitle');
    if (returSubtitle) {
      returSubtitle.style.color = '#b0b0b0';
    }
    const returDisplay = document.getElementById('returDisplay');
    if (returDisplay) {
      returDisplay.style.color = '#e0e0e0';
    }
    // Update loading spinner untuk dark mode
    const returChartLoading = document.getElementById('returChartLoading');
    if (returChartLoading) {
      returChartLoading.style.background = 'rgba(45, 45, 45, 0.9)';
      const spinner = returChartLoading.querySelector('.retur-spinner');
      if (spinner) {
        spinner.style.borderColor = 'rgba(224, 224, 224, 0.2)';
        spinner.style.borderTopColor = '#e0e0e0';
      }
    }

    // Update refresh button (warna akan di-update oleh applyColorPalette)
    // Tidak perlu set manual di sini karena applyColorPalette akan handle
  } else {
    // Light mode
    body.classList.remove('dark-mode');
    body.style.backgroundImage = '';
    body.style.backgroundSize = '';
    body.style.backgroundPosition = '';
    body.style.backgroundRepeat = '';
    body.style.backgroundAttachment = '';
    body.style.backgroundColor = '';
    body.style.color = '';

    document.querySelectorAll('.card').forEach(card => {
      card.style.backgroundColor = '';
      card.style.color = '';
    });

    // Reset card 3 (breakdown/profit) saat keluar dari wallpaper mode
    const card3 = document.querySelector('.card.breakdown');
    if (card3) {
      card3.style.backgroundColor = '';
      card3.style.color = '';
      // Reset text colors di dalam card 3
      const card3Texts = card3.querySelectorAll('h2, .subtitle, p, span, div');
      card3Texts.forEach(text => {
        if (!text.classList.contains('caption')) {
          text.style.color = '';
        }
      });
    }

    // Reset card number styling for light mode (warna akan di-update oleh applyColorPalette)
    // Tidak perlu reset manual di sini karena applyColorPalette akan handle

    const filterCard = document.querySelector('.filters-card');
    if (filterCard) {
      filterCard.style.backgroundColor = '';
    }

    document.querySelectorAll('input, select').forEach(el => {
      el.style.backgroundColor = '';
      el.style.color = '';
      el.style.borderColor = '';
    });

    document.querySelectorAll('label').forEach(label => {
      label.style.color = '';
    });

    document.querySelectorAll('h2, .subtitle').forEach(el => {
      el.style.color = '';
    });

    // Reset caption untuk light mode
    document.querySelectorAll('.caption').forEach(caption => {
      caption.style.color = '';
    });

    // Reset text shadow untuk header saat keluar dari wallpaper mode
    const headerH1 = document.querySelector('.dashboard-header h1');
    const companyName = document.querySelector('.dashboard-header .company-name');
    
    if (headerH1) {
      headerH1.style.textShadow = '';
      headerH1.style.color = '';
    }
    
    if (companyName) {
      companyName.style.textShadow = '';
      companyName.style.color = '';
    }

    // Reset border pembatas untuk light mode
    document.querySelectorAll('.chart-separator').forEach(div => {
      div.style.borderTopColor = '#e0e0e0';
    });

    // Enable color palette select saat light mode
    if (elements.colorPalette) {
      elements.colorPalette.disabled = false;
    }

    // Reset keterangan Oktober untuk light mode
    const returOktoberNote = document.getElementById('returOktoberNote');
    if (returOktoberNote) {
      returOktoberNote.style.color = '#7b88a8';
    }

    // Reset dashboard header
    const dashboardHeader = document.querySelector('.dashboard-header h1');
    if (dashboardHeader) {
      dashboardHeader.style.color = '';
    }

    // Reset footer
    const footerTexts = document.querySelectorAll('.dashboard-footer p');
    footerTexts.forEach(footer => {
      footer.style.color = '';
    });

    // Reset retur value dan subtitle untuk light mode
    const returValue = document.getElementById('returValue');
    if (returValue) {
      returValue.style.color = '';
    }
    const returSubtitle = document.getElementById('returSubtitle');
    if (returSubtitle) {
      returSubtitle.style.color = '#666';
    }
    const returDisplay = document.getElementById('returDisplay');
    if (returDisplay) {
      returDisplay.style.color = '';
    }
    // Reset loading spinner untuk light mode
    const returChartLoading = document.getElementById('returChartLoading');
    if (returChartLoading) {
      returChartLoading.style.background = 'rgba(255, 255, 255, 0.9)';
      const spinner = returChartLoading.querySelector('.retur-spinner');
      if (spinner) {
        spinner.style.borderColor = 'rgba(90, 100, 199, 0.2)';
        spinner.style.borderTopColor = '#5a64c7';
      }
    }

    // Reset refresh button
    const refreshBtn = document.getElementById('refreshBtn');
    if (refreshBtn) {
      refreshBtn.style.backgroundColor = '';
      refreshBtn.style.color = '';
    }
  }

  // Update chart theme options (TIDAK update chart, hanya set options)
  // Wallpaper mode menggunakan light theme untuk chart
  if (charts && Object.keys(charts).length > 0) {
    Object.values(charts).forEach(chart => {
      updateChartTheme(chart, isDark && !isWallpaper);
    });
  }

  // Update card number colors setelah display mode berubah
  if (chartColors && chartColors.length > 0) {
    applyColorPalette();
  }
};

const applyColorPalette = () => {
  const isDark = displayMode === 'dark';

  // Update warna untuk chart yang sudah ada
  if (charts.leadLag && charts.leadLag.data.datasets) {
    charts.leadLag.data.datasets.forEach((dataset, idx) => {
      dataset.backgroundColor = chartColors[idx % chartColors.length];
    });
    charts.leadLag.update('none');
  }

  if (charts.omsetKotor && charts.omsetKotor.data.datasets) {
    charts.omsetKotor.data.datasets.forEach((dataset, idx) => {
      // Gunakan warna yang sama dengan chart Total Harga Jual (warna kedua)
      dataset.backgroundColor = chartColors[1] || chartColors[0];
    });
    charts.omsetKotor.update('none');
  }

  if (charts.retur && charts.retur.data.datasets) {
    charts.retur.data.datasets.forEach((dataset, idx) => {
      dataset.backgroundColor = chartColors[idx % chartColors.length];
      dataset.borderColor = chartColors[idx % chartColors.length];
    });
    charts.retur.update('none');
  }

  if (charts.hargaJual && charts.hargaJual.data.datasets) {
    charts.hargaJual.data.datasets.forEach((dataset, idx) => {
      dataset.backgroundColor = chartColors[(idx + 1) % chartColors.length] || chartColors[0];
      dataset.borderColor = chartColors[(idx + 1) % chartColors.length] || chartColors[0];
    });
    charts.hargaJual.update('none');
  }

  if (charts.margin && charts.margin.data.datasets) {
    charts.margin.data.datasets.forEach((dataset, idx) => {
      dataset.backgroundColor = chartColors[2] || chartColors[0];
      dataset.borderColor = chartColors[2] || chartColors[0];
    });
    charts.margin.update('none');
  }

  if (charts.variance && charts.variance.data.datasets) {
    charts.variance.data.datasets[0].backgroundColor = chartColors[0];
    charts.variance.data.datasets[1].backgroundColor = chartColors[1] || chartColors[0];
    charts.variance.update('none');
  }

  if (charts.trendCombo && charts.trendCombo.data.datasets) {
    charts.trendCombo.data.datasets[0].backgroundColor = chartColors[0];
    charts.trendCombo.data.datasets[1].borderColor = chartColors[1] || chartColors[0];
    charts.trendCombo.data.datasets[1].backgroundColor = chartColors[1] || chartColors[0];
    charts.trendCombo.update('none');
  }

  if (charts.breakdown && charts.breakdown.data.datasets[0]) {
    charts.breakdown.data.datasets[0].backgroundColor = chartColors;
    // Hilangkan border untuk semua mode
    charts.breakdown.data.datasets[0].borderWidth = 0;
    charts.breakdown.data.datasets[0].borderColor = 'transparent';
    charts.breakdown.update('none');
  }

  if (charts.contribution && charts.contribution.data.datasets[0]) {
    charts.contribution.data.datasets[0].backgroundColor = chartColors;
    // Hilangkan border saat dark mode
    if (isDark) {
      charts.contribution.data.datasets[0].borderWidth = 0;
      charts.contribution.data.datasets[0].borderColor = 'transparent';
    } else {
      charts.contribution.data.datasets[0].borderWidth = 2;
      charts.contribution.data.datasets[0].borderColor = '#fff';
    }
    charts.contribution.update('none');
  }

  if (charts.trendLine && charts.trendLine.data.datasets[0]) {
    const primaryColor = chartColors[0];
    const hexToRgba = (hex, alpha) => {
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    };
    charts.trendLine.data.datasets[0].borderColor = primaryColor;
    charts.trendLine.data.datasets[0].backgroundColor = hexToRgba(primaryColor, 0.4);
    charts.trendLine.update('none');
  }


  // Update card number colors berdasarkan palette (semua menggunakan warna pertama)
  const cardNumbers = document.querySelectorAll('.card-number');
  cardNumbers.forEach((num) => {
    // Semua card number menggunakan warna pertama dari palette
    num.style.backgroundColor = chartColors[0];
    // Pastikan text tetap putih untuk kontras
    num.style.color = '#fff';
  });

  // Helper function untuk convert hex to rgba
  const hexToRgba = (hex, alpha) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };
  
  const hexToRgb = (hex) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return { r, g, b };
  };

  // Update refresh button color berdasarkan palette
  const refreshBtn = document.getElementById('refreshBtn');
  if (refreshBtn && chartColors && chartColors.length > 0) {
    refreshBtn.style.backgroundColor = chartColors[0];
    refreshBtn.style.color = '#fff';

    // Tambahkan box-shadow untuk efek 3D
    if (isDark) {
      refreshBtn.style.setProperty('box-shadow', '0 4px 12px rgba(0, 0, 0, 0.4), 0 2px 4px rgba(0, 0, 0, 0.2)', 'important');
    } else {
      const shadowColor = hexToRgba(chartColors[0], 0.3);
      refreshBtn.style.setProperty('box-shadow', `0 4px 12px ${shadowColor}, 0 2px 4px ${hexToRgba(chartColors[0], 0.2)}`, 'important');
    }

    // Update hover effect dengan warna yang sedikit lebih gelap
    const rgb = hexToRgb(chartColors[0]);
    // Buat warna lebih gelap untuk hover (kurangi 20 dari setiap channel)
    const hoverR = Math.max(0, rgb.r - 20);
    const hoverG = Math.max(0, rgb.g - 20);
    const hoverB = Math.max(0, rgb.b - 20);
    refreshBtn.style.setProperty('--hover-color', `rgb(${hoverR}, ${hoverG}, ${hoverB})`);
  }
  
  // Update logout button color berdasarkan palette (gunakan warna kedua atau pertama)
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn && chartColors && chartColors.length > 0) {
    // Gunakan warna kedua dari palette, atau warna pertama jika tidak ada
    const logoutColor = chartColors.length > 1 ? chartColors[1] : chartColors[0];
    logoutBtn.style.backgroundColor = logoutColor;
    logoutBtn.style.color = '#fff';

    // Tambahkan box-shadow untuk efek 3D
    if (isDark) {
      logoutBtn.style.setProperty('box-shadow', '0 4px 12px rgba(0, 0, 0, 0.4), 0 2px 4px rgba(0, 0, 0, 0.2)', 'important');
    } else {
      const shadowColor = hexToRgba(logoutColor, 0.3);
      logoutBtn.style.setProperty('box-shadow', `0 4px 12px ${shadowColor}, 0 2px 4px ${hexToRgba(logoutColor, 0.2)}`, 'important');
    }

    // Update hover effect dengan warna yang sedikit lebih gelap
    const rgb = hexToRgb(logoutColor);
    const hoverR = Math.max(0, rgb.r - 20);
    const hoverG = Math.max(0, rgb.g - 20);
    const hoverB = Math.max(0, rgb.b - 20);
    logoutBtn.style.setProperty('--hover-color', `rgb(${hoverR}, ${hoverG}, ${hoverB})`);
  }

  // Update error message background color berdasarkan palette
  const errorEl = document.getElementById('error-message');
  if (errorEl && chartColors && chartColors.length > 0) {
    // Gunakan warna pertama dari palette untuk error message
    const errorColor = chartColors[0];
    // Update semua style properties dengan !important
    errorEl.style.setProperty('background', errorColor, 'important');
    errorEl.style.setProperty('background-color', errorColor, 'important');
    errorEl.style.color = '#fff';
    // Pastikan display tetap block jika error sedang ditampilkan
    if (errorEl.style.display !== 'none') {
      errorEl.style.display = 'block';
    }
  }

  // Update filters-card background color berdasarkan palette
  const filtersCard = document.querySelector('.filters-card');
  if (filtersCard && chartColors && chartColors.length > 0) {
    // Gunakan warna pertama dari palette untuk background filter card
    const filterBgColor = chartColors[0];
    
    // Convert hex to rgba dengan opacity untuk background yang lebih soft
    const hexToRgba = (hex, alpha) => {
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    };
    
    // Gunakan warna dengan opacity 0.25 untuk background yang lebih terlihat tapi tetap soft
    const bgOpacity = isDark ? 0.3 : 0.2;
    filtersCard.style.background = hexToRgba(filterBgColor, bgOpacity);
    filtersCard.style.backgroundColor = hexToRgba(filterBgColor, bgOpacity);
    
    // Tambahkan box-shadow seperti card lainnya (mirip dengan ROI dan Qty AWB box)
    // Shadow yang lebih terlihat dan konsisten dengan card lainnya
    if (isDark) {
      filtersCard.style.setProperty('box-shadow', '0 4px 12px rgba(0, 0, 0, 0.4), 0 2px 4px rgba(0, 0, 0, 0.2)', 'important');
    } else {
      const shadowColor = hexToRgba(filterBgColor, 0.3);
      filtersCard.style.setProperty('box-shadow', `0 4px 12px ${shadowColor}, 0 2px 4px ${hexToRgba(filterBgColor, 0.2)}`, 'important');
    }
    
    // Update box-shadow untuk semua card (card 1-6) agar mengikuti color palette
    const allCards = document.querySelectorAll('.card:not(.filters-card)');
    allCards.forEach(card => {
      if (chartColors && chartColors.length > 0) {
        const cardShadowColor = chartColors[0];
        if (isDark) {
          card.style.setProperty('box-shadow', '0 4px 12px rgba(0, 0, 0, 0.4), 0 2px 4px rgba(0, 0, 0, 0.2)', 'important');
        } else {
          const shadowColor = hexToRgba(cardShadowColor, 0.3);
          card.style.setProperty('box-shadow', `0 4px 12px ${shadowColor}, 0 2px 4px ${hexToRgba(cardShadowColor, 0.2)}`, 'important');
        }
      }
    });
    
    // Update background color untuk card 3 (breakdown/profit) agar mengikuti color palette
    // Skip jika wallpaper mode (card 3 akan menggunakan background putih seperti card lainnya)
    const card3 = document.querySelector('.card.breakdown');
    if (card3 && chartColors && chartColors.length > 0 && displayMode !== 'wallpaper') {
      const card3BgColor = chartColors[0];
      // Gunakan warna dengan opacity yang lebih tinggi untuk background yang lebih pekat
      const card3BgOpacity = isDark ? 0.3 : 0.25;
      card3.style.background = hexToRgba(card3BgColor, card3BgOpacity);
      card3.style.backgroundColor = hexToRgba(card3BgColor, card3BgOpacity);
      
      // Pastikan text tetap readable
      if (isDark) {
        card3.style.color = '#fff';
      } else {
        card3.style.color = '#1f2b4a';
      }
    } else if (card3 && displayMode === 'wallpaper') {
      // Saat wallpaper mode, card 3 sama seperti card lainnya (putih dengan opacity 0.95)
      card3.style.background = 'rgba(255, 255, 255, 0.95)';
      card3.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
      card3.style.color = '#1f2b4a';
    }
    
    // Pastikan text tetap readable (gunakan warna gelap untuk kontras)
    // Jika mode dark, gunakan warna putih untuk text
    if (isDark) {
      filtersCard.style.color = '#fff';
      const labels = filtersCard.querySelectorAll('.filter label');
      labels.forEach(label => {
        label.style.color = 'rgba(255, 255, 255, 0.9)';
      });
      const selects = filtersCard.querySelectorAll('.filter select');
      selects.forEach(select => {
        select.style.color = '#fff';
        select.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
        select.style.borderColor = 'rgba(255, 255, 255, 0.2)';
        // Pastikan options juga memiliki warna yang terlihat saat dropdown dibuka
        // Options akan memiliki background putih dan text gelap agar terlihat
        const options = select.querySelectorAll('option');
        options.forEach(option => {
          // Force styling untuk option elements agar terlihat di dark mode
          option.style.setProperty('color', '#1f2b4a', 'important');
          option.style.setProperty('background-color', '#fff', 'important');
          option.style.setProperty('background', '#fff', 'important');
        });
      });
    } else {
      filtersCard.style.color = '#1f2b4a';
      const labels = filtersCard.querySelectorAll('.filter label');
      labels.forEach(label => {
        label.style.color = '#7b88a8';
      });
      const selects = filtersCard.querySelectorAll('.filter select');
      selects.forEach(select => {
        select.style.color = '#1f2b4a';
        select.style.backgroundColor = '#fff';
        select.style.borderColor = '#d7ddf1';
      });
    }
  }

  // Update box-shadow untuk Qty AWB dan Qty PCS box agar mengikuti color palette
  const qtyAwbBox = document.getElementById('qtyAwbBox');
  const qtyPcsBox = document.getElementById('qtyPcsBox');
  
  if (chartColors && chartColors.length > 0) {
    // Helper function untuk convert hex to rgba
    const hexToRgba = (hex, alpha) => {
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    };
    
    if (qtyAwbBox) {
      const awbColor = chartColors[0];
      if (isDark) {
        qtyAwbBox.style.setProperty('box-shadow', '0 4px 12px rgba(0, 0, 0, 0.4), 0 2px 4px rgba(0, 0, 0, 0.2)', 'important');
      } else {
        const shadowColor = hexToRgba(awbColor, 0.3);
        qtyAwbBox.style.setProperty('box-shadow', `0 4px 12px ${shadowColor}, 0 2px 4px ${hexToRgba(awbColor, 0.2)}`, 'important');
      }
    }
    
    if (qtyPcsBox && chartColors.length > 1) {
      const pcsColor = chartColors[1] || chartColors[0];
      if (isDark) {
        qtyPcsBox.style.setProperty('box-shadow', '0 4px 12px rgba(0, 0, 0, 0.4), 0 2px 4px rgba(0, 0, 0, 0.2)', 'important');
      } else {
        const shadowColor = hexToRgba(pcsColor, 0.3);
        qtyPcsBox.style.setProperty('box-shadow', `0 4px 12px ${shadowColor}, 0 2px 4px ${hexToRgba(pcsColor, 0.2)}`, 'important');
      }
    }
    
    // Update box-shadow untuk ROI box agar mengikuti color palette
    const roiBox = document.getElementById('roiBox');
    if (roiBox) {
      const roiColor = chartColors[0];
      if (isDark) {
        roiBox.style.setProperty('box-shadow', '0 4px 12px rgba(0, 0, 0, 0.4), 0 2px 4px rgba(0, 0, 0, 0.2)', 'important');
      } else {
        const shadowColor = hexToRgba(roiColor, 0.3);
        roiBox.style.setProperty('box-shadow', `0 4px 12px ${shadowColor}, 0 2px 4px ${hexToRgba(roiColor, 0.2)}`, 'important');
      }
    }
    
    // Update semua caption chart dengan background box sesuai palette dan ukuran sama dengan profit
    const allCaptions = document.querySelectorAll('.caption');
    allCaptions.forEach((caption, index) => {
      if (chartColors && chartColors.length > 0) {
        // Gunakan warna yang sama untuk semua caption (warna pertama dari palette)
        const captionColor = chartColors[0];
        
        // Set background color
        caption.style.backgroundColor = captionColor;
        caption.style.color = '#fff';
        
        // Set ukuran yang sama dengan profit caption (kecil)
        caption.style.padding = '4px 8px';
        caption.style.borderRadius = '6px';
        caption.style.fontSize = '0.75rem';
        caption.style.display = 'inline-block';
        caption.style.fontWeight = '600';
        caption.style.whiteSpace = 'nowrap';
        
        // Tambahkan box-shadow untuk efek 3D
        if (isDark) {
          caption.style.setProperty('box-shadow', '0 4px 12px rgba(0, 0, 0, 0.4), 0 2px 4px rgba(0, 0, 0, 0.2)', 'important');
        } else {
          const shadowColor = hexToRgba(captionColor, 0.3);
          caption.style.setProperty('box-shadow', `0 4px 12px ${shadowColor}, 0 2px 4px ${hexToRgba(captionColor, 0.2)}`, 'important');
        }
      }
    });
  }
};

// Fungsi untuk update chart Profit
const updateProfitChart = (filtered, returData, budgetAggregated) => {
  console.log('=== updateProfitChart CALLED ===');
  console.log('Filtered records:', filtered.length);
  console.log('Retur data:', returData);
  console.log('Budget aggregated:', budgetAggregated);
  
  try {
    // ===== HITUNG PROFIT =====
    // Profit = Total Margin - Total Biaya Iklan - Total RTS
    
    // Ambil total margin dari filtered data
    const totalMargin = filtered.reduce((sum, record) => sum + (record.margin || 0), 0);
    
    // Total RTS dari returData
    const totalRTS = returData.total || 0;
    
    // Total Budget Iklan dari budgetAggregated
    const totalBudgetIklan = budgetAggregated.data.reduce((sum, val) => sum + val, 0);
    
    // Hitung profit
    const totalProfit = totalMargin - totalBudgetIklan - totalRTS;
    
    console.log('=== PROFIT CALCULATION ===');
    console.log('Total Margin:', totalMargin);
    console.log('Total Budget Iklan:', totalBudgetIklan);
    console.log('Total RTS:', totalRTS);
    console.log('Total Profit:', totalProfit);
    
    // Update caption profit
    const profitCaption = document.querySelector('[data-profit-total]');
    console.log('Profit caption element:', profitCaption);
    if (profitCaption) {
      profitCaption.innerHTML = `<strong>Rp ${totalProfit.toLocaleString('id-ID')}</strong> total`;
      console.log('Profit caption updated:', profitCaption.textContent);
    } else {
      console.error('Element [data-profit-total] tidak ditemukan!');
    }
    
    // Hitung dan update ROI
    const roi = totalBudgetIklan > 0 ? (totalProfit / totalBudgetIklan) * 100 : 0;
    const roiElement = document.querySelector('[data-roi-value]');
    const roiBox = document.getElementById('roiBox');
    
    if (roiElement) {
      roiElement.textContent = `${roi.toFixed(2)}%`;
      console.log('ROI calculated:', roi.toFixed(2) + '%');
    }
    
    // Set background color ROI box sesuai palette
    if (roiBox && chartColors.length > 0) {
      const roiColor = chartColors[0]; // Gunakan warna pertama dari palette
      roiBox.style.background = `linear-gradient(135deg, ${roiColor}20, ${roiColor}40)`;
      roiBox.style.borderLeft = `4px solid ${roiColor}`;
      roiBox.style.color = displayMode === 'dark' ? '#e0e0e0' : '#1f2b4a';
      
      // Tambahkan box-shadow seperti card lainnya untuk efek 3D
      // Helper function untuk convert hex to rgba
      const hexToRgba = (hex, alpha) => {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
      };
      
      if (displayMode === 'dark') {
        roiBox.style.setProperty('box-shadow', '0 4px 12px rgba(0, 0, 0, 0.4), 0 2px 4px rgba(0, 0, 0, 0.2)', 'important');
      } else {
        const shadowColor = hexToRgba(roiColor, 0.3);
        roiBox.style.setProperty('box-shadow', `0 4px 12px ${shadowColor}, 0 2px 4px ${hexToRgba(roiColor, 0.2)}`, 'important');
      }
    }
    
    // Update chart profit (per week)
    if (charts.profit) {
      // Aggregate margin by week
      const marginByWeek = aggregateByWeekInMonth(filtered.map(record => ({
        ...record,
        revenue: record.margin || 0 // Gunakan margin sebagai revenue untuk aggregasi
      })));
      
      console.log('Margin by week:', marginByWeek);
      
      // Convert object to array for easier processing
      const weeks = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
      const weekLabels = weeks;
      
      // Hitung profit per week (proporsional)
      const profitData = weeks.map((weekLabel) => {
        // Untuk setiap week, hitung profit = margin - (budget + rts) proporsional
        const weekMargin = marginByWeek[weekLabel] || 0;
        const weekRatio = weekMargin / (totalMargin || 1);
        const weekBudget = totalBudgetIklan * weekRatio;
        const weekRTS = totalRTS * weekRatio;
        const weekProfit = weekMargin - weekBudget - weekRTS;
        console.log(`${weekLabel}: Margin=${weekMargin.toLocaleString()}, Budget=${weekBudget.toLocaleString()}, RTS=${weekRTS.toLocaleString()}, Profit=${weekProfit.toLocaleString()}`);
        // Return profit atau null jika 0 (Chart.js akan tetap tampilkan label tapi tanpa bar)
        return weekProfit === 0 ? null : weekProfit;
      });
      
      // Determine if dark mode
      const isDarkMode = displayMode === 'dark';
      
      charts.profit.data.labels = weekLabels;
      charts.profit.data.datasets = [
        {
          label: filters.revenueType === 'All' ? 'All' : filters.revenueType,
          data: profitData,
          backgroundColor: chartColors[0],
          borderColor: 'transparent',
          borderWidth: 0,
          barThickness: 22,
          borderRadius: 8,
          borderSkipped: false,
          categoryPercentage: 0.7,
          barPercentage: 0.85,
        },
      ];
      
      console.log('Profit chart data:', charts.profit.data);
      console.log('Profit chart labels:', charts.profit.data.labels);
      console.log('Profit chart values:', profitData);
      charts.profit.update();
    }
  } catch (error) {
    console.error('Error updating profit chart:', error);
  }
};

const updateDashboard = () => {
  if (!records || records.length === 0) {
    console.warn('Tidak ada data records');
    return;
  }

  const isDark = displayMode === 'dark';
  const filtered = filterRecords();

  console.log('=== FILTER DEBUG ===');
  console.log('Filter settings:', {
    start: filters.start ? filters.start.toISOString() : null,
    end: filters.end ? filters.end.toISOString() : null,
    revenueType: filters.revenueType,
    subCategory: filters.subCategory,
    totalRecords: records.length
  });
  console.log(`Filtered records: ${filtered.length}`);

  if (filtered.length === 0) {
    console.warn('Tidak ada data yang sesuai dengan filter');
    // Debug: cek beberapa record pertama
    if (records && records.length > 0) {
      console.log('Sample records (first 5):');
      records.slice(0, 5).forEach((record, idx) => {
        const date = new Date(record.orderTs);
        const unit = getBusinessUnit(record.doType);
        console.log(`Record ${idx + 1}:`, {
          date: date.toISOString(),
          year: date.getFullYear(),
          month: date.getMonth() + 1,
          unit: unit,
          doType: record.doType,
          inRange: record.orderTs >= filters.start?.getTime() && record.orderTs <= filters.end?.getTime()
        });
      });
    }
  }

  const leadLag = aggregateLeadLag(filtered, filters.revenueType);
  if (charts.leadLag) {
    charts.leadLag.data.labels = leadLag.labels;
    charts.leadLag.data.datasets = leadLag.datasets;
    charts.leadLag.update();
  }
  if (elements.leadTotal) {
    const formattedAmount = currencyFormatter.format(leadLag.total);
    elements.leadTotal.innerHTML = `<strong>${formattedAmount}</strong> total`;
  }

  // Hitung Total Omset terlebih dahulu
  const totalOmset = aggregateLeadLag(filtered, filters.revenueType);

  // Update chart Omset Bersih (masih menggunakan data total omset untuk chart)
  if (charts.omsetKotor) {
    charts.omsetKotor.data.labels = totalOmset.labels;
    charts.omsetKotor.data.datasets = totalOmset.datasets;
    // Set warna sama dengan chart Total Harga Jual (warna kedua)
    if (charts.omsetKotor.data.datasets && charts.omsetKotor.data.datasets[0]) {
      charts.omsetKotor.data.datasets[0].backgroundColor = chartColors[1] || chartColors[0];
    }
    charts.omsetKotor.update();
  }

  // Hitung nilai maksimum dari semua data untuk menyelaraskan skala Y-axis
  // (akan dihitung setelah data retur dimuat)

  // Fetch dan update Retur/RTS data berdasarkan bulan yang dipilih dan marketplace filter
  // Dapatkan monthKey dari dropdown bulan
  const monthSelect = document.getElementById('monthSelect');
  const monthKey = monthSelect && monthSelect.value ? monthSelect.value : null;

  // Tampilkan/sembunyikan keterangan Oktober (cek awal sebelum fetch)
  const returOktoberNote = document.getElementById('returOktoberNote');
  if (returOktoberNote) {
    if (monthKey) {
      const [year, month] = monthKey.split('-').map(Number);
      if (month === 10) { // Oktober
        returOktoberNote.style.display = 'block';
      } else {
        returOktoberNote.style.display = 'none';
      }
    } else {
      returOktoberNote.style.display = 'none';
    }
  }

  // Dapatkan marketplace filter dari dropdown revenueType
  const marketplaceFilter = filters.revenueType || 'All';

  // Tampilkan loading spinner untuk chart retur
  const returChartLoadingEl = document.getElementById('returChartLoading');
  const returChartEl = document.getElementById('returChart');
  if (returChartLoadingEl && returChartEl) {
    returChartEl.style.opacity = '0.3';
    returChartLoadingEl.style.display = 'block';
  }

  fetchReturData(monthKey, marketplaceFilter).then(returData => {
    // Sembunyikan loading spinner
    if (returChartLoadingEl && returChartEl) {
      returChartEl.style.opacity = '1';
      returChartLoadingEl.style.display = 'none';
    }

    // Tampilkan/sembunyikan keterangan Oktober
    const returOktoberNote = document.getElementById('returOktoberNote');
    if (returOktoberNote) {
      if (monthKey) {
        const [year, month] = monthKey.split('-').map(Number);
        if (month === 10) { // Oktober
          returOktoberNote.style.display = 'block';
        } else {
          returOktoberNote.style.display = 'none';
        }
      } else {
        returOktoberNote.style.display = 'none';
      }
    }

    const totalRetur = returData.total || 0;
    const returRecords = returData.records || [];

    // Hitung Omset Bersih = Total Omset - Retur/RTS
    const omsetBersih = Math.max(0, totalOmset.total - totalRetur);

    // Update Omset Bersih total
    if (elements.omsetKotorTotal) {
      const formattedAmount = currencyFormatter.format(omsetBersih);
      elements.omsetKotorTotal.innerHTML = `<strong>${formattedAmount}</strong> total`;
    }
    
    // Hitung Qty AWB (jumlah resi dari kolom G yang tidak kosong) dan Qty PCS (jumlah total qty dari kolom M)
    const qtyAwb = filtered.filter(record => record.resi !== null).length;
    const qtyPcs = filtered.reduce((sum, record) => sum + (record.qty || 0), 0);
    
    // Update Qty AWB
    const qtyAwbElement = document.querySelector('[data-qty-awb]');
    const qtyAwbBox = document.getElementById('qtyAwbBox');
    if (qtyAwbElement) {
      qtyAwbElement.textContent = qtyAwb.toLocaleString('id-ID');
    }
    
    // Update Qty PCS
    const qtyPcsElement = document.querySelector('[data-qty-pcs]');
    const qtyPcsBox = document.getElementById('qtyPcsBox');
    if (qtyPcsElement) {
      qtyPcsElement.textContent = qtyPcs.toLocaleString('id-ID');
    }
    
    // Set background color AWB dan PCS box sesuai palette
    // Helper function untuk convert hex to rgba
    const hexToRgba = (hex, alpha) => {
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    };
    
    if (qtyAwbBox && chartColors.length > 0) {
      const awbColor = chartColors[0];
      qtyAwbBox.style.background = `linear-gradient(135deg, ${awbColor}20, ${awbColor}40)`;
      qtyAwbBox.style.borderLeft = `4px solid ${awbColor}`;
      qtyAwbBox.style.color = displayMode === 'dark' ? '#e0e0e0' : '#1f2b4a';
      
      // Tambahkan box-shadow seperti card lainnya untuk efek 3D
      if (displayMode === 'dark') {
        qtyAwbBox.style.setProperty('box-shadow', '0 4px 12px rgba(0, 0, 0, 0.4), 0 2px 4px rgba(0, 0, 0, 0.2)', 'important');
      } else {
        const shadowColor = hexToRgba(awbColor, 0.3);
        qtyAwbBox.style.setProperty('box-shadow', `0 4px 12px ${shadowColor}, 0 2px 4px ${hexToRgba(awbColor, 0.2)}`, 'important');
      }
    }
    
    if (qtyPcsBox && chartColors.length > 1) {
      const pcsColor = chartColors[1] || chartColors[0];
      qtyPcsBox.style.background = `linear-gradient(135deg, ${pcsColor}20, ${pcsColor}40)`;
      qtyPcsBox.style.borderLeft = `4px solid ${pcsColor}`;
      qtyPcsBox.style.color = displayMode === 'dark' ? '#e0e0e0' : '#1f2b4a';
      
      // Tambahkan box-shadow seperti card lainnya untuk efek 3D
      if (displayMode === 'dark') {
        qtyPcsBox.style.setProperty('box-shadow', '0 4px 12px rgba(0, 0, 0, 0.4), 0 2px 4px rgba(0, 0, 0, 0.2)', 'important');
      } else {
        const shadowColor = hexToRgba(pcsColor, 0.3);
        qtyPcsBox.style.setProperty('box-shadow', `0 4px 12px ${shadowColor}, 0 2px 4px ${hexToRgba(pcsColor, 0.2)}`, 'important');
      }
    }

    if (elements.returTotal) {
      if (totalRetur === 0) {
        elements.returTotal.innerHTML = `<strong>Rp 0</strong> total`;
      } else {
        const formattedAmount = currencyFormatter.format(totalRetur);
        elements.returTotal.innerHTML = `<strong>${formattedAmount}</strong> total`;
      }
    }

    const hargaJualAggregated = aggregateHargaJualByWeek(filtered);

    // Update chart retur
    if (charts.retur) {
      // Set tinggi chart Retur sama dengan chart Omset
      const leadLagChartEl = document.getElementById('leadLagChart');
      if (leadLagChartEl && charts.retur.canvas.parentElement) {
        const targetHeight = leadLagChartEl.offsetHeight;
        charts.retur.canvas.parentElement.style.height = `${targetHeight}px`;
      }

      if (returRecords.length > 0) {
        const returAggregated = aggregateReturByWeek(returRecords);
        charts.retur.data.labels = returAggregated.labels;
        charts.retur.data.datasets = returAggregated.datasets;
        // Update warna sesuai palette
        if (charts.retur.data.datasets[0]) {
          charts.retur.data.datasets[0].backgroundColor = chartColors[0];
          charts.retur.data.datasets[0].borderColor = chartColors[0];
        }
        charts.retur.update();
      } else {
        // Jika tidak ada data, set chart kosong
        charts.retur.data.labels = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
        charts.retur.data.datasets = [{
          label: 'RTS',
          data: [0, 0, 0, 0],
          backgroundColor: chartColors[0],
          borderColor: chartColors[0],
          fill: true,
          tension: 0.4,
        }];
        charts.retur.update();
      }
    }

    // Update chart harga jual
    if (charts.hargaJual) {
      // Set tinggi chart Harga Jual sama dengan chart Retur (menggunakan leadLagChart sebagai referensi)
      const leadLagChartEl = document.getElementById('leadLagChart');
      if (leadLagChartEl && charts.hargaJual.canvas && charts.hargaJual.canvas.parentElement) {
        const targetHeight = leadLagChartEl.offsetHeight;
        charts.hargaJual.canvas.parentElement.style.height = `${targetHeight}px`;
      }

      charts.hargaJual.data.labels = hargaJualAggregated.labels;
      charts.hargaJual.data.datasets = hargaJualAggregated.datasets;
      // Update warna sesuai palette
      if (charts.hargaJual.data.datasets[0]) {
        charts.hargaJual.data.datasets[0].backgroundColor = chartColors[1] || chartColors[0];
        charts.hargaJual.data.datasets[0].borderColor = chartColors[1] || chartColors[0];
      }
      charts.hargaJual.update();
    }

    // Update total harga jual
    if (elements.hargaJualTotal) {
      const hargaJualAggregated = aggregateHargaJualByWeek(filtered);
      const totalHargaJual = hargaJualAggregated.total || 0;
      if (totalHargaJual === 0) {
        elements.hargaJualTotal.innerHTML = `<strong>Rp 0</strong> total`;
      } else {
        const formattedAmount = currencyFormatter.format(totalHargaJual);
        elements.hargaJualTotal.innerHTML = `<strong>${formattedAmount}</strong> total`;
      }
    }

    // Update chart margin
    const marginAggregated = aggregateMarginByWeek(filtered);
    if (charts.margin) {
      // Set tinggi chart Margin sama dengan chart Retur (menggunakan leadLagChart sebagai referensi)
      const leadLagChartEl = document.getElementById('leadLagChart');
      if (leadLagChartEl && charts.margin.canvas && charts.margin.canvas.parentElement) {
        const targetHeight = leadLagChartEl.offsetHeight;
        charts.margin.canvas.parentElement.style.height = `${targetHeight}px`;
      }

      charts.margin.data.labels = marginAggregated.labels;
      charts.margin.data.datasets = marginAggregated.datasets;
      // Update warna sesuai palette
      if (charts.margin.data.datasets[0]) {
        charts.margin.data.datasets[0].backgroundColor = chartColors[2] || chartColors[0];
        charts.margin.data.datasets[0].borderColor = chartColors[2] || chartColors[0];
      }
      charts.margin.update();
    }

    // Update total margin
    if (elements.marginTotal) {
      const totalMargin = marginAggregated.total || 0;
      if (totalMargin === 0) {
        elements.marginTotal.innerHTML = `<strong>Rp 0</strong> total`;
      } else {
        const formattedAmount = currencyFormatter.format(totalMargin);
        elements.marginTotal.innerHTML = `<strong>${formattedAmount}</strong> total`;
      }
    }

    // Simpan data retur untuk perhitungan profit
    window.returDataCache = returData;
    console.log('Retur data saved. Checking budget data...', window.budgetIklanData ? 'READY' : 'NOT READY');

    // Trigger update profit jika data budget iklan sudah tersedia
    if (window.budgetIklanData) {
      console.log('Calling updateProfitChart from retur callback...');
      updateProfitChart(filtered, returData, window.budgetIklanData.aggregated);
    } else {
      console.log('Budget data not ready yet, waiting...');
    }

  }).catch(error => {
    console.error('Error loading Retur data:', error);

    // Sembunyikan loading spinner
    if (returChartLoadingEl && returChartEl) {
      returChartEl.style.opacity = '1';
      returChartLoadingEl.style.display = 'none';
    }

    // Jika error, Omset Bersih = Total Omset (karena retur tidak bisa dihitung)
    if (elements.omsetKotorTotal) {
      const formattedAmount = currencyFormatter.format(totalOmset.total);
      elements.omsetKotorTotal.innerHTML = `<strong>${formattedAmount}</strong> total`;
    }

    if (elements.returTotal) {
      elements.returTotal.textContent = 'Error loading data';
    }

    // Tampilkan/sembunyikan keterangan Oktober (meskipun error)
    const returOktoberNote = document.getElementById('returOktoberNote');
    if (returOktoberNote) {
      const [year, month] = monthKey ? monthKey.split('-').map(Number) : [null, null];
      if (month === 10) { // Oktober
        returOktoberNote.style.display = 'block';
      } else {
        returOktoberNote.style.display = 'none';
      }
    }

    const hargaJualAggregatedError = aggregateHargaJualByWeek(filtered);

    // Update chart dengan error state
    if (charts.retur) {
      charts.retur.data.labels = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
      charts.retur.data.datasets = [{
        label: 'RTS',
        data: [0, 0, 0, 0],
        backgroundColor: chartColors[0],
        borderColor: chartColors[0],
        fill: true,
        tension: 0.4,
      }];
      charts.retur.update();
    }

    // Update chart harga jual dengan error state
    if (charts.hargaJual) {
      charts.hargaJual.data.labels = hargaJualAggregatedError.labels;
      charts.hargaJual.data.datasets = hargaJualAggregatedError.datasets;
      if (charts.hargaJual.data.datasets[0]) {
        charts.hargaJual.data.datasets[0].backgroundColor = chartColors[1] || chartColors[0];
        charts.hargaJual.data.datasets[0].borderColor = chartColors[1] || chartColors[0];
      }
      charts.hargaJual.update();
    }

    // Update total harga jual (tetap update meskipun error retur)
    if (elements.hargaJualTotal) {
      const hargaJualAggregated = aggregateHargaJualByWeek(filtered);
      const totalHargaJual = hargaJualAggregated.total || 0;
      if (totalHargaJual === 0) {
        elements.hargaJualTotal.innerHTML = `<strong>Rp 0</strong> total`;
      } else {
        const formattedAmount = currencyFormatter.format(totalHargaJual);
        elements.hargaJualTotal.innerHTML = `<strong>${formattedAmount}</strong> total`;
      }
    }

    // Update chart margin dengan error state
    const marginAggregatedError = aggregateMarginByWeek(filtered);
    if (charts.margin) {
      charts.margin.data.labels = marginAggregatedError.labels;
      charts.margin.data.datasets = marginAggregatedError.datasets;
      if (charts.margin.data.datasets[0]) {
        charts.margin.data.datasets[0].backgroundColor = chartColors[2] || chartColors[0];
        charts.margin.data.datasets[0].borderColor = chartColors[2] || chartColors[0];
      }
      charts.margin.update();
    }

    // Update total margin (tetap update meskipun error retur)
    if (elements.marginTotal) {
      const totalMargin = marginAggregatedError.total || 0;
      if (totalMargin === 0) {
        elements.marginTotal.innerHTML = `<strong>Rp 0</strong> total`;
      } else {
        const formattedAmount = currencyFormatter.format(totalMargin);
        elements.marginTotal.innerHTML = `<strong>${formattedAmount}</strong> total`;
      }
    }

    });

  // Update peta Indonesia dengan data yang difilter
  updateIndonesiaMap(filtered).catch(error => {
    console.error('Error updating Indonesia map:', error);
  });

  const variance = aggregateVariance(filtered);
  if (charts.variance) {
    charts.variance.data.labels = variance.labels;
    charts.variance.data.datasets[0].data = variance.actual;
    charts.variance.data.datasets[0].backgroundColor = chartColors[0];
    charts.variance.data.datasets[1].data = variance.expected;
    charts.variance.data.datasets[1].backgroundColor = chartColors[1] || chartColors[0];
    charts.variance.update();
  }

  const trend = aggregateTrend(filtered);
  if (charts.trendCombo) {
    charts.trendCombo.data.labels = trend.labels;
    charts.trendCombo.data.datasets[0].data = trend.revenue;
    charts.trendCombo.data.datasets[0].backgroundColor = chartColors[0];
    charts.trendCombo.data.datasets[1].data = trend.growth;
    charts.trendCombo.data.datasets[1].borderColor = chartColors[1] || chartColors[0];
    charts.trendCombo.data.datasets[1].backgroundColor = chartColors[1] || chartColors[0];
    charts.trendCombo.update();
  }

  // Fetch dan update Budget Iklan chart (Card 3)
  // Gunakan async/await untuk fetch data budget iklan
  (async () => {
    try {
      // Get selected month key (sama seperti untuk retur data)
      const selectedMonthKey = monthSelect && monthSelect.value ? monthSelect.value : null;

      // Fetch budget iklan data
      const budgetData = await fetchBudgetIklanData(selectedMonthKey, filters.revenueType);
      const budgetAggregated = aggregateBudgetIklan(budgetData);

      // Update chart
      if (charts.breakdown) {
        // Set tinggi chart Budget Iklan sama dengan chart Retur
        const returChartEl = document.getElementById('returChart');
        const breakdownEl = document.getElementById('breakdownChart');
        if (returChartEl && breakdownEl) {
          const chartContainer = breakdownEl.parentElement;
          if (chartContainer && chartContainer.style) {
            const targetHeight = returChartEl.offsetHeight;
            chartContainer.style.height = `${targetHeight}px`;
            chartContainer.style.maxHeight = `${targetHeight}px`;
          }
        }
        
        charts.breakdown.data.labels = budgetAggregated.labels;
        charts.breakdown.data.datasets[0].data = budgetAggregated.data;
        charts.breakdown.data.datasets[0].backgroundColor = chartColors;

        // Hilangkan border untuk semua mode
        charts.breakdown.data.datasets[0].borderWidth = 0;
        charts.breakdown.data.datasets[0].borderColor = 'transparent';

        charts.breakdown.update();
      }

      // Update legend untuk budget iklan
      updateBreakdownLegend(budgetAggregated.labels.map((label, index) => [label, budgetAggregated.data[index]]));
      
      // Update caption dengan total budget iklan (format sama dengan caption lainnya)
      const totalBudgetIklan = budgetAggregated.data.reduce((sum, val) => sum + val, 0);
      const budgetIklanCaption = document.querySelector('[data-budget-iklan-total]');
      if (budgetIklanCaption) {
        const formattedAmount = currencyFormatter.format(totalBudgetIklan);
        budgetIklanCaption.innerHTML = `<strong>${formattedAmount}</strong> total`;
      }

      // Simpan data budget iklan untuk perhitungan profit
      window.budgetIklanData = {
        total: totalBudgetIklan,
        aggregated: budgetAggregated
      };
      console.log('Budget Iklan data saved. Checking retur data...', window.returDataCache ? 'READY' : 'NOT READY');

      // Trigger update profit jika data retur sudah tersedia
      if (window.returDataCache) {
        console.log('Calling updateProfitChart from budget callback...');
        updateProfitChart(filtered, window.returDataCache, budgetAggregated);
      } else {
        console.log('Retur data not ready yet, waiting...');
      }
    } catch (error) {
      console.error('Error updating budget iklan chart:', error);
    }
  })();

  const contributionEntries = aggregateBreakdown(filtered, 'doType').slice(
    0,
    4,
  );
  if (charts.contribution) {
    charts.contribution.data.labels = contributionEntries.map(
      ([label]) => label,
    );
    charts.contribution.data.datasets[0].data = contributionEntries.map(
      ([, value]) => value,
    );
    charts.contribution.data.datasets[0].backgroundColor = chartColors;
    // Hilangkan border saat dark mode
    if (isDark) {
      charts.contribution.data.datasets[0].borderWidth = 0;
      charts.contribution.data.datasets[0].borderColor = 'transparent';
    } else {
      charts.contribution.data.datasets[0].borderWidth = 2;
      charts.contribution.data.datasets[0].borderColor = '#fff';
    }
    charts.contribution.update();
  }

  updateTrendLine(filtered);


  // Update chart theme setelah semua data di-update
  if (charts && Object.keys(charts).length > 0) {
    Object.values(charts).forEach(chart => {
      updateChartTheme(chart, isDark);
    });
  }
};

const bootstrap = async () => {
  if (typeof Chart === 'undefined') {
    console.error('Chart.js belum dimuat. Pastikan CDN Chart.js dapat diakses.');
    return;
  }

  try {
    // Load data dari Google Sheets (ONLINE)
    let dataLoaded = false;

    // Coba load dari Google Sheets
    dataLoaded = await loadDataFromGoogleSheets();

    // Fallback ke window.DASHBOARD_DATA jika Google Sheets tidak tersedia (untuk development)
    if (!dataLoaded && window.DASHBOARD_DATA) {
      console.log('Menggunakan data dari window.DASHBOARD_DATA (fallback untuk development)');
      dataset = window.DASHBOARD_DATA;
      records = dataset.records;
      meta = dataset.meta;
      dataLoaded = true;
    }

    if (!dataLoaded) {
      throw new Error('Tidak ada sumber data yang tersedia. Pastikan Google Sheets dapat diakses.');
    }

    // Initialize dates properly
    const minDate = new Date(meta.minDate);
    const maxDate = new Date(meta.maxDate);

    // Set to local date (remove time component)
    filters.start = new Date(minDate.getFullYear(), minDate.getMonth(), minDate.getDate());
    filters.end = new Date(maxDate.getFullYear(), maxDate.getMonth(), maxDate.getDate());

    elements = {
      startDate: document.getElementById('startDate'),
      endDate: document.getElementById('endDate'),
      monthSelect: document.getElementById('monthSelect'),
      revenueType: document.getElementById('revenueType'),
      subCategory: document.getElementById('subCategory'),
      displayMode: document.getElementById('displayMode'),
      colorPalette: document.getElementById('colorPalette'),
      leadTotal: document.querySelector('[data-lead-total]'),
      omsetKotorTotal: document.querySelector('[data-omset-kotor-total]'),
      returTotal: document.querySelector('[data-retur-total]'),
      hargaJualTotal: document.querySelector('[data-harga-jual-total]'),
      marginTotal: document.querySelector('[data-margin-total]'),
      breakdownLegend: document.getElementById('breakdownLegend'),
    };

    // Set default filter Unit Bisnis ke LKM
    filters.subCategory = 'LKM';

    // Initialize display mode dan color palette dengan validasi
    displayMode = elements.displayMode ? (elements.displayMode.value || 'light') : 'light';
    const paletteId = elements.colorPalette ? (elements.colorPalette.value || '4') : '4';

    // Pastikan chartColors selalu valid (wallpaper menggunakan light palette)
    const modeForPalette = displayMode === 'wallpaper' ? 'light' : displayMode;
    const modePalettes = colorPalettes[modeForPalette];
    if (modePalettes && modePalettes[paletteId]) {
      chartColors = modePalettes[paletteId];
    } else {
      chartColors = colorPalettes.light[4]; // Fallback ke light mode palette 4
    }

    initFilters();
    initCharts();
    // Inisialisasi peta Indonesia (tunggu sedikit agar Leaflet sudah dimuat)
    setTimeout(() => {
      if (typeof L !== 'undefined') {
        initIndonesiaMap();
      } else {
        console.warn('Leaflet belum dimuat');
      }
    }, 100);
    // Apply display mode styling (TIDAK update chart, hanya styling DOM)
    applyDisplayMode();
    // Apply color palette (termasuk update error message jika ada)
    applyColorPalette();
    // Update dashboard dengan data (ini yang akan update chart dengan data)
    updateDashboard();

    // Setup refresh button
    const refreshBtn = document.getElementById('refreshBtn');
    if (refreshBtn) {
      refreshBtn.addEventListener('click', async () => {
        try {
          refreshBtn.classList.add('loading');
          refreshBtn.disabled = true;

          showLoading(true);
          const success = await loadDataFromGoogleSheets();
          if (success) {
            // Re-initialize filters and update dashboard
            initFilters();
            updateDashboard();
          }
          showLoading(false);
        } catch (error) {
          console.error('Error saat refresh:', error);
          showError(error.message || 'Terjadi kesalahan saat refresh data');
          showLoading(false);
        } finally {
          refreshBtn.classList.remove('loading');
          refreshBtn.disabled = false;
        }
      });
    }

    // Setup logout button
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => {
        // Clear session
        sessionStorage.removeItem('isLoggedIn');
        sessionStorage.removeItem('username');
        // Redirect to login
        window.location.href = 'login.html';
      });
    }

    // Setup event listener untuk memastikan option styling ter-apply saat select dibuka
    const allSelects = document.querySelectorAll('.filter select');
    allSelects.forEach(select => {
      select.addEventListener('focus', () => {
        // Saat select dibuka, pastikan options memiliki styling yang benar
        const options = select.querySelectorAll('option');
        const isDark = displayMode === 'dark';
        options.forEach(option => {
          if (isDark) {
            option.style.color = '#1f2b4a';
            option.style.backgroundColor = '#fff';
          } else {
            option.style.color = '#1f2b4a';
            option.style.backgroundColor = '#fff';
          }
        });
      });
    });
  } catch (error) {
    console.error('Error saat inisialisasi dashboard:', error);
    showError(error.message);
  }
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bootstrap);
} else {
  bootstrap();
}

