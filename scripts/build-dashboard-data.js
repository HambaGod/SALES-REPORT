const fs = require('fs');
const path = require('path');
const xlsx = require('xlsx');

const SOURCE_FILE = path.resolve("#4-10 DATA WAREHOUSE OKTOBER'25.xlsx");
const OUTPUT_DIR = path.resolve('generated');
const OUTPUT_FILE = path.join(OUTPUT_DIR, 'dashboard-data.js');
const SHEET_NAME = 'Penjualan';
const excelEpoch = Date.UTC(1899, 11, 30);

const toNumber = (value) => {
  const num = Number(value);
  return Number.isFinite(num) ? num : 0;
};

const cleanText = (value, fallback = 'Tidak diketahui') => {
  if (value === null || value === undefined) {
    return fallback;
  }
  const text = String(value).trim();
  return text.length ? text : fallback;
};

const parseExcelDate = (value) => {
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value;
  }
  if (typeof value === 'number' && Number.isFinite(value)) {
    return new Date(excelEpoch + value * 86400000);
  }
  if (typeof value === 'string' && value.trim()) {
    const parsed = new Date(value);
    if (!Number.isNaN(parsed.getTime())) {
      return parsed;
    }
  }
  return null;
};

const workbook = xlsx.readFile(SOURCE_FILE, { cellDates: true });
const sheet = workbook.Sheets[SHEET_NAME];
if (!sheet) {
  throw new Error(`Sheet "${SHEET_NAME}" tidak ditemukan.`);
}

const rows = xlsx.utils.sheet_to_json(sheet, { defval: null });
const records = [];

for (const row of rows) {
  const date =
    parseExcelDate(row['Tanggal Order']) ||
    parseExcelDate(row['Tanggal Input']) ||
    null;

  if (!date) {
    continue;
  }

  const revenue =
    toNumber(row['Nilai Pembayaran']) ||
    toNumber(row['Bayar COD']) ||
    toNumber(row['BAYAR TF']);

  const margin = toNumber(row['Margin']) || toNumber(row['COD']);

  records.push({
    orderDate: date.toISOString(),
    orderTs: date.getTime(),
    year: date.getUTCFullYear(),
    month: date.getUTCMonth(),
    qty: toNumber(row.Qty),
    revenue,
    margin,
    transactionType: cleanText(row['Jenis Transaksi']),
    leadsType: cleanText(row['Jenis Leads']),
    doType: cleanText(row['Jenis DOA']),
    product: cleanText(row['Nama Barang']),
    cs: cleanText(row['Nama CS']),
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

fs.mkdirSync(OUTPUT_DIR, { recursive: true });
const payload = {
  generatedAt: new Date().toISOString(),
  meta,
  records,
};

const serialized = `window.DASHBOARD_DATA = ${JSON.stringify(payload)};`;
fs.writeFileSync(OUTPUT_FILE, serialized);

console.log(
  `Dashboard data berhasil dibuat (${records.length} baris) -> ${OUTPUT_FILE}`,
);



