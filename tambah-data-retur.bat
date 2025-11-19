@echo off
chcp 65001 >nul
echo ========================================
echo   Tambah Data Retur Bulan Baru
echo ========================================
echo.

cd /d "%~dp0"

set /p tahun="Masukkan tahun (contoh: 2025): "
if "%tahun%"=="" (
    echo Error: Tahun tidak boleh kosong!
    pause
    exit /b 1
)

set /p bulan="Masukkan bulan dalam angka (contoh: 12 untuk Desember): "
if "%bulan%"=="" (
    echo Error: Bulan tidak boleh kosong!
    pause
    exit /b 1
)

REM Validasi format bulan (1-12)
if %bulan% LSS 1 (
    echo Error: Bulan harus antara 1-12!
    pause
    exit /b 1
)
if %bulan% GTR 12 (
    echo Error: Bulan harus antara 1-12!
    pause
    exit /b 1
)

REM Format bulan dengan leading zero jika perlu
if %bulan% LSS 10 set bulan=0%bulan%

set bulan_key=%tahun%-%bulan%

echo.
set /p link="Paste link Google Sheets Retur untuk %bulan_key%: "
if "%link%"=="" (
    echo Error: Link tidak boleh kosong!
    pause
    exit /b 1
)

echo.
echo Menambahkan data retur %bulan_key% ke app.js...
echo.

REM Buat PowerShell script untuk edit app.js
powershell -Command ^
"$content = Get-Content 'app.js' -Raw -Encoding UTF8; ^
$newEntry = \"  // %bulan_key%: logika standar (kolom Y, filter kolom D = `\"LKM`\")\r\n  '%bulan_key%': '%link%',\r\n\"; ^
$pattern = '(\};\r?\n\r?\n// ===== FUNGSI UNTUK FETCH DATA DARI SATU URL)'; ^
if ($content -match $pattern) { ^
    $content = $content -replace $pattern, ($newEntry + '$1'); ^
    Set-Content 'app.js' -Value $content -Encoding UTF8 -NoNewline; ^
    Write-Host '✓ Berhasil menambahkan data retur %bulan_key%!' -ForegroundColor Green; ^
} else { ^
    Write-Host '✗ Error: Tidak dapat menemukan lokasi untuk menambahkan data' -ForegroundColor Red; ^
    exit 1; ^
}"

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo   Selesai!
    echo ========================================
    echo.
    echo Data retur %bulan_key% sudah ditambahkan ke app.js
    echo Jangan lupa test dashboard untuk memastikan data muncul!
    echo.
    echo Catatan: Data retur menggunakan logika standar (kolom Y, filter kolom D = `"LKM`")
    echo Jika bulan ini menggunakan logika khusus (seperti Oktober), edit app.js secara manual.
    echo.
) else (
    echo.
    echo ========================================
    echo   Error!
    echo ========================================
    echo.
    echo Gagal menambahkan data. Silakan cek file app.js secara manual.
    echo.
)

pause

