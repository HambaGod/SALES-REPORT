@echo off
chcp 65001 >nul
echo ========================================
echo   Tambah Data Warehouse Bulan Baru
echo ========================================
echo.

cd /d "%~dp0"

set /p bulan="Masukkan nama bulan (contoh: Desember): "
if "%bulan%"=="" (
    echo Error: Nama bulan tidak boleh kosong!
    pause
    exit /b 1
)

echo.
set /p link="Paste link Google Sheets untuk %bulan%: "
if "%link%"=="" (
    echo Error: Link tidak boleh kosong!
    pause
    exit /b 1
)

echo.
echo Menambahkan data %bulan% ke app.js...
echo.

REM Buat PowerShell script untuk edit app.js
powershell -Command ^
"$content = Get-Content 'app.js' -Raw -Encoding UTF8; ^
$newEntry = \"  {\r\n    name: '%bulan%',\r\n    url: '%link%'\r\n  },\r\n\"; ^
$pattern = '(\];\r?\n\r?\n// ===== KONFIGURASI GOOGLE SHEETS RETUR)'; ^
if ($content -match $pattern) { ^
    $content = $content -replace $pattern, ($newEntry + '$1'); ^
    Set-Content 'app.js' -Value $content -Encoding UTF8 -NoNewline; ^
    Write-Host '✓ Berhasil menambahkan data %bulan%!' -ForegroundColor Green; ^
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
    echo Data %bulan% sudah ditambahkan ke app.js
    echo Jangan lupa test dashboard untuk memastikan data muncul!
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

