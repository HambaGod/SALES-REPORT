// ===== DATA STORAGE (LocalStorage) =====
const STORAGE_KEY = 'dashboard_config';

// Load configuration from localStorage
function loadConfig() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    return JSON.parse(stored);
  }
  
  // Default configuration (dari app.js yang sekarang)
  return {
    penjualan: [
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
      },
      {
        name: 'Desember',
        url: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vS3LSA3Z3e60bUzskklR1DScntT-n4TpKHbFmGiRtGMi2tNP-6swXW3_rxzIR1BnfFlCxS2CXuwH7rD/pub?gid=1771794388&single=true&output=csv'
      }
    ],
    iklanLKM: {
      '2025-10': 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRM4Diwo8TCXyfXm2v2LwYZ1spYmTllCJ8EI9w-jYOnLO32FfCsvhOWngQ8Qf12AlU3KKYoMoO_HUxM/pub?gid=0&single=true&output=csv',
      '2025-11': 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTKcsgwf2YsGwnkDKQwfkNpC_kMUCxqIY5FDFl3uNpLOihk7h3m9WBipHmJVOJggvw0ZP4vWYQTtQIQ/pub?output=csv',
      '2025-12': 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTe4NHwKCvXPnSx7xQES2CzR2N2ph1QV95h073rg3Q7ul7yDytec9d3f0v-vByddjLMhbI0aCJLQei0/pub?gid=0&single=true&output=csv'
    },
    iklanNUMETA: {
      '2025-10': '',
      '2025-11': 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQsFmsdf-SyrepTVQHgtetHOQ4RRApqYOWFUp4vN5Qu1J_21OlILYVzhfEkjHQ8HYitR6ul7Sksgq8W/pub?gid=0&single=true&output=csv'
    },
    retur: {
      '2025-10': 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTKcsgwf2YsGwnkDKQwfkNpC_kMUCxqIY5FDFl3uNpLOihk7h3m9WBipHmJVOJggvw0ZP4vWYQTtQIQ/pub?output=csv',
      '2025-11': 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTKcsgwf2YsGwnkDKQwfkNpC_kMUCxqIY5FDFl3uNpLOihk7h3m9WBipHmJVOJggvw0ZP4vWYQTtQIQ/pub?output=csv'
    }
  };
}

// Save configuration to localStorage
function saveConfig(config) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
}

// Global config
let config = loadConfig();

// ===== TAB MANAGEMENT =====
function switchTab(tabName) {
  // Remove active class from all tabs
  document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
  document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
  
  // Add active class to selected tab
  event.target.classList.add('active');
  document.getElementById(`tab-${tabName}`).classList.add('active');
}

// ===== ALERT MANAGEMENT =====
function showAlert(message, type = 'success') {
  const container = document.getElementById('alertContainer');
  const alert = document.createElement('div');
  alert.className = `alert alert-${type}`;
  alert.textContent = message;
  container.appendChild(alert);
  
  setTimeout(() => {
    alert.remove();
  }, 5000);
}

// ===== RENDER TABLES =====
function renderTables() {
  renderPenjualanTable();
  renderIklanLKMTable();
  renderIklanNUMETATable();
  renderReturTable();
}

function renderPenjualanTable() {
  const tbody = document.querySelector('#tablePenjualan tbody');
  tbody.innerHTML = '';
  
  if (config.penjualan.length === 0) {
    tbody.innerHTML = '<tr><td colspan="4" class="empty-state">Belum ada data. Klik "Tambah Bulan" untuk menambahkan.</td></tr>';
    return;
  }
  
  config.penjualan.forEach((item, index) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td><strong>${item.name}</strong></td>
      <td><div class="link-preview">${item.url}</div></td>
      <td><span class="status-badge status-success">Active</span></td>
      <td>
        <div class="action-btns">
          <button class="btn btn-sm btn-secondary" onclick="editData('penjualan', ${index})">Edit</button>
          <button class="btn btn-sm btn-danger" onclick="deleteData('penjualan', ${index})">Hapus</button>
        </div>
      </td>
    `;
    tbody.appendChild(row);
  });
}

function renderIklanLKMTable() {
  const tbody = document.querySelector('#tableIklanLKM tbody');
  tbody.innerHTML = '';
  
  const entries = Object.entries(config.iklanLKM);
  if (entries.length === 0) {
    tbody.innerHTML = '<tr><td colspan="4" class="empty-state">Belum ada data. Klik "Tambah Bulan" untuk menambahkan.</td></tr>';
    return;
  }
  
  entries.forEach(([month, url]) => {
    const row = document.createElement('tr');
    const status = url ? 'success' : 'pending';
    const statusText = url ? 'Active' : 'Empty';
    row.innerHTML = `
      <td><strong>${month}</strong></td>
      <td><div class="link-preview">${url || '-'}</div></td>
      <td><span class="status-badge status-${status}">${statusText}</span></td>
      <td>
        <div class="action-btns">
          <button class="btn btn-sm btn-secondary" onclick="editData('iklan-lkm', '${month}')">Edit</button>
          <button class="btn btn-sm btn-danger" onclick="deleteData('iklan-lkm', '${month}')">Hapus</button>
        </div>
      </td>
    `;
    tbody.appendChild(row);
  });
}

function renderIklanNUMETATable() {
  const tbody = document.querySelector('#tableIklanNUMETA tbody');
  tbody.innerHTML = '';
  
  const entries = Object.entries(config.iklanNUMETA);
  if (entries.length === 0) {
    tbody.innerHTML = '<tr><td colspan="4" class="empty-state">Belum ada data. Klik "Tambah Bulan" untuk menambahkan.</td></tr>';
    return;
  }
  
  entries.forEach(([month, url]) => {
    const row = document.createElement('tr');
    const status = url ? 'success' : 'pending';
    const statusText = url ? 'Active' : 'Empty';
    row.innerHTML = `
      <td><strong>${month}</strong></td>
      <td><div class="link-preview">${url || '-'}</div></td>
      <td><span class="status-badge status-${status}">${statusText}</span></td>
      <td>
        <div class="action-btns">
          <button class="btn btn-sm btn-secondary" onclick="editData('iklan-numeta', '${month}')">Edit</button>
          <button class="btn btn-sm btn-danger" onclick="deleteData('iklan-numeta', '${month}')">Hapus</button>
        </div>
      </td>
    `;
    tbody.appendChild(row);
  });
}

function renderReturTable() {
  const tbody = document.querySelector('#tableRetur tbody');
  tbody.innerHTML = '';
  
  const entries = Object.entries(config.retur);
  if (entries.length === 0) {
    tbody.innerHTML = '<tr><td colspan="4" class="empty-state">Belum ada data. Klik "Tambah Bulan" untuk menambahkan.</td></tr>';
    return;
  }
  
  entries.forEach(([month, url]) => {
    const row = document.createElement('tr');
    const status = url ? 'success' : 'pending';
    const statusText = url ? 'Active' : 'Empty';
    row.innerHTML = `
      <td><strong>${month}</strong></td>
      <td><div class="link-preview">${url || '-'}</div></td>
      <td><span class="status-badge status-${status}">${statusText}</span></td>
      <td>
        <div class="action-btns">
          <button class="btn btn-sm btn-secondary" onclick="editData('retur', '${month}')">Edit</button>
          <button class="btn btn-sm btn-danger" onclick="deleteData('retur', '${month}')">Hapus</button>
        </div>
      </td>
    `;
    tbody.appendChild(row);
  });
}

// ===== MODAL MANAGEMENT =====
function openAddModal(type) {
  document.getElementById('modalType').value = type;
  document.getElementById('modalMode').value = 'add';
  document.getElementById('modalIndex').value = '';
  document.getElementById('modalTitle').textContent = `Tambah Data ${getTypeName(type)}`;
  document.getElementById('inputMonth').value = '';
  document.getElementById('inputURL').value = '';
  document.getElementById('validationResult').innerHTML = '';
  
  // Update label and help text based on type
  if (type === 'penjualan') {
    document.getElementById('labelMonth').textContent = 'Nama Bulan';
    document.getElementById('helpMonth').textContent = 'Contoh: Desember, Januari, Februari';
  } else {
    document.getElementById('labelMonth').textContent = 'Bulan (YYYY-MM)';
    document.getElementById('helpMonth').textContent = 'Contoh: 2025-12, 2025-01, 2025-02';
  }
  
  document.getElementById('dataModal').classList.add('active');
}

function editData(type, index) {
  document.getElementById('modalType').value = type;
  document.getElementById('modalMode').value = 'edit';
  document.getElementById('modalIndex').value = index;
  document.getElementById('modalTitle').textContent = `Edit Data ${getTypeName(type)}`;
  document.getElementById('validationResult').innerHTML = '';
  
  // Update label and help text based on type
  if (type === 'penjualan') {
    document.getElementById('labelMonth').textContent = 'Nama Bulan';
    document.getElementById('helpMonth').textContent = 'Contoh: Desember, Januari, Februari';
  } else {
    document.getElementById('labelMonth').textContent = 'Bulan (YYYY-MM)';
    document.getElementById('helpMonth').textContent = 'Contoh: 2025-12, 2025-01, 2025-02';
  }
  
  // Load existing data
  if (type === 'penjualan') {
    const item = config.penjualan[index];
    document.getElementById('inputMonth').value = item.name;
    document.getElementById('inputURL').value = item.url;
  } else {
    const configKey = type === 'iklan-lkm' ? 'iklanLKM' : type === 'iklan-numeta' ? 'iklanNUMETA' : 'retur';
    document.getElementById('inputMonth').value = index;
    document.getElementById('inputURL').value = config[configKey][index];
  }
  
  document.getElementById('dataModal').classList.add('active');
}

function closeModal() {
  document.getElementById('dataModal').classList.remove('active');
}

function getTypeName(type) {
  const names = {
    'penjualan': 'Penjualan',
    'iklan-lkm': 'Budget Iklan LKM',
    'iklan-numeta': 'Budget Iklan NUMETA',
    'retur': 'Retur'
  };
  return names[type] || type;
}

// ===== VALIDATE URL =====
async function validateURL() {
  const url = document.getElementById('inputURL').value;
  const resultDiv = document.getElementById('validationResult');
  const btnValidate = document.getElementById('btnValidate');
  
  if (!url) {
    resultDiv.innerHTML = '<span class="status-badge status-error">URL tidak boleh kosong</span>';
    return;
  }
  
  // Check if URL contains output=csv
  if (!url.includes('output=csv')) {
    resultDiv.innerHTML = '<span class="status-badge status-error">URL harus mengandung &output=csv</span>';
    return;
  }
  
  btnValidate.innerHTML = 'Validating...';
  btnValidate.disabled = true;
  
  try {
    const response = await fetch(url);
    if (response.ok) {
      const text = await response.text();
      const lines = text.split('\n').filter(line => line.trim());
      resultDiv.innerHTML = `
        <span class="status-badge status-success">URL Valid</span>
        <p class="help-text">Response: ${response.status} ${response.statusText} | ${lines.length} baris data</p>
      `;
    } else {
      resultDiv.innerHTML = `<span class="status-badge status-error">URL tidak dapat diakses (${response.status})</span>`;
    }
  } catch (error) {
    resultDiv.innerHTML = `<span class="status-badge status-error">Error: ${error.message}</span>`;
  }
  
  btnValidate.innerHTML = 'Validasi URL';
  btnValidate.disabled = false;
}

// ===== SAVE DATA =====
function saveData(event) {
  event.preventDefault();
  
  const type = document.getElementById('modalType').value;
  const mode = document.getElementById('modalMode').value;
  const index = document.getElementById('modalIndex').value;
  const month = document.getElementById('inputMonth').value.trim();
  const url = document.getElementById('inputURL').value.trim();
  
  if (type === 'penjualan') {
    if (mode === 'add') {
      config.penjualan.push({ name: month, url: url });
    } else {
      config.penjualan[index] = { name: month, url: url };
    }
  } else {
    const configKey = type === 'iklan-lkm' ? 'iklanLKM' : type === 'iklan-numeta' ? 'iklanNUMETA' : 'retur';
    config[configKey][month] = url;
  }
  
  saveConfig(config);
  renderTables();
  closeModal();
    showAlert(`Data ${getTypeName(type)} berhasil ${mode === 'add' ? 'ditambahkan' : 'diupdate'}`, 'success');
}

// ===== DELETE DATA =====
function deleteData(type, index) {
  if (!confirm('Yakin ingin menghapus data ini?')) {
    return;
  }
  
  if (type === 'penjualan') {
    config.penjualan.splice(index, 1);
  } else {
    const configKey = type === 'iklan-lkm' ? 'iklanLKM' : type === 'iklan-numeta' ? 'iklanNUMETA' : 'retur';
    delete config[configKey][index];
  }
  
  saveConfig(config);
  renderTables();
  showAlert(`Data ${getTypeName(type)} berhasil dihapus`, 'success');
}

// ===== GENERATE CODE =====
function generateCode() {
  const code = `// ===== KONFIGURASI GOOGLE SHEETS =====
// URL yang sudah di-publish dari Google Sheets (${config.penjualan.length} sumber data)
const GOOGLE_SHEETS_URLS = [
${config.penjualan.map(item => `  {
    name: '${item.name}',
    url: '${item.url}'
  }`).join(',\n')}
];

// ===== KONFIGURASI GOOGLE SHEETS RETUR =====
// URL retur untuk setiap bulan (hanya bulan yang memiliki data retur)
const RETUR_SHEETS_URLS = {
${Object.entries(config.retur).map(([month, url]) => `  '${month}': '${url}'`).join(',\n')}
};

// ===== KONFIGURASI BUDGET IKLAN =====
// URL default budget iklan (jika monthKey belum punya URL spesifik)
const BUDGET_IKLAN_URL_LKM = '${config.iklanLKM['2025-11'] || 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTKcsgwf2YsGwnkDKQwfkNpC_kMUCxqIY5FDFl3uNpLOihk7h3m9WBipHmJVOJggvw0ZP4vWYQTtQIQ/pub?output=csv'}';
const BUDGET_IKLAN_URL_NUMETA = '${config.iklanNUMETA['2025-11'] || 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTKcsgwf2YsGwnkDKQwfkNpC_kMUCxqIY5FDFl3uNpLOihk7h3m9WBipHmJVOJggvw0ZP4vWYQTtQIQ/pub?output=csv'}';

// URL budget iklan per bulan untuk LKM (format warehouse: TANGGAL, MARKETPLACE, PRODUK, TOTAL BIAYA IKLAN)
const BUDGET_IKLAN_URLS_LKM = {
${Object.entries(config.iklanLKM).map(([month, url]) => `  '${month}': '${url}'`).join(',\n')}
};

// URL budget iklan per bulan untuk NUMETA (format warehouse: TANGGAL, MARKETPLACE, PRODUK, TOTAL BIAYA IKLAN)
const BUDGET_IKLAN_URLS_NUMETA = {
${Object.entries(config.iklanNUMETA).map(([month, url]) => `  '${month}': '${url}'`).join(',\n')}
};`;

  document.getElementById('generatedCode').textContent = code;
  document.getElementById('codeOutput').style.display = 'block';
  
  // Scroll to code output
  document.getElementById('codeOutput').scrollIntoView({ behavior: 'smooth' });
}

// ===== COPY CODE =====
function copyCode() {
  const code = document.getElementById('generatedCode').textContent;
  navigator.clipboard.writeText(code).then(() => {
    showAlert('Kode berhasil di-copy ke clipboard', 'success');
  }).catch(err => {
    showAlert('Gagal copy kode: ' + err.message, 'error');
  });
}

// ===== VIEW DASHBOARD AS =====
function viewDashboardAs(userType) {
  // Temporarily set userType to view dashboard
  const originalUserType = sessionStorage.getItem('userType');
  sessionStorage.setItem('userType', userType);
  sessionStorage.setItem('originalUserType', originalUserType);
  window.location.href = 'dashboard.html';
}

// ===== LOGOUT =====
function logout() {
  if (confirm('Yakin ingin logout?')) {
    sessionStorage.clear();
    window.location.href = 'login.html';
  }
}

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
  renderTables();
});

