@echo off
setlocal EnableDelayedExpansion

echo =============================================
echo  TAMBAH DATA BUDGET IKLAN PER BULAN
echo =============================================
echo.

set /p BULAN_NAMA="Masukkan nama bulan (contoh: Desember): "
set /p BULAN_KEY="Masukkan key bulan (format: YYYY-MM, contoh: 2025-12): "
set /p URL="Paste URL Google Sheets Budget Iklan: "

if "%BULAN_NAMA%"=="" (
    echo Error: Nama bulan tidak boleh kosong!
    pause
    exit /b 1
)

if "%BULAN_KEY%"=="" (
    echo Error: Key bulan tidak boleh kosong!
    pause
    exit /b 1
)

if "%URL%"=="" (
    echo Error: URL tidak boleh kosong!
    pause
    exit /b 1
)

REM Normalisasi URL ke format CSV (mendukung link pubhtml langsung dari Google Sheets)
echo.
echo Mengonversi URL ke format CSV (jika perlu)...
for /f "usebackq delims=" %%i in (`powershell -NoLogo -NoProfile -Command ^
  "$u='%URL%';" ^
  "if ($u -match 'pubhtml\?gid=([0-9]+)&single=true') {" ^
  "  $id = $Matches[1];" ^
  "  $u = $u -replace 'pubhtml\?gid=\d+&single=true', \"pub?gid=$id&single=true&output=csv\";" ^
  "} elseif ($u -notmatch 'output=csv') {" ^
  "  if ($u -match '\?') { $u += '&output=csv' } else { $u += '?output=csv' }" ^
  "};" ^
  "$u"`) do set "URL=%%i"

echo URL terkonversi: %URL%

echo.
echo Menambahkan data budget iklan...
echo Bulan: %BULAN_NAMA%
echo Key: %BULAN_KEY%
echo URL: %URL%
echo.

REM Cari baris yang berisi "const BUDGET_IKLAN_URLS = {"
findstr /n "const BUDGET_IKLAN_URLS = {" app.js >nul
if errorlevel 1 (
    echo Error: Struktur BUDGET_IKLAN_URLS tidak ditemukan di app.js
    echo.
    echo Membuat struktur baru...
    
    REM Cari baris BUDGET_IKLAN_URL untuk dijadikan acuan
    for /f "tokens=1 delims=:" %%a in ('findstr /n "const BUDGET_IKLAN_URL" app.js') do set LINE_NUM=%%a
    
    if not defined LINE_NUM (
        echo Error: Tidak dapat menemukan BUDGET_IKLAN_URL di app.js
        pause
        exit /b 1
    )
    
    REM Buat file temporary dengan struktur baru
    set /a INSERT_LINE=%LINE_NUM%+1
    
    powershell -Command "(Get-Content app.js)[0..(%LINE_NUM%-1)] | Set-Content temp_app.js"
    echo. >> temp_app.js
    echo const BUDGET_IKLAN_URLS = { >> temp_app.js
    echo   '%BULAN_KEY%': '%URL%', >> temp_app.js
    echo }; >> temp_app.js
    echo. >> temp_app.js
    powershell -Command "(Get-Content app.js)[%LINE_NUM%..(Get-Content app.js).Length] | Add-Content temp_app.js"
    
    move /y temp_app.js app.js >nul
    
    echo.
    echo Struktur BUDGET_IKLAN_URLS berhasil dibuat!
) else (
    REM Cari baris penutup kurung kurawal dari BUDGET_IKLAN_URLS
    set FOUND=0
    for /f "tokens=1 delims=:" %%a in ('findstr /n "const BUDGET_IKLAN_URLS = {" app.js') do (
        set START_LINE=%%a
        set FOUND=1
    )
    
    if !FOUND!==0 (
        echo Error: Tidak dapat menemukan const BUDGET_IKLAN_URLS
        pause
        exit /b 1
    )
    
    REM Cari baris penutup
    set /a SEARCH_FROM=!START_LINE!+1
    set CLOSE_LINE=0
    for /f "skip=!SEARCH_FROM! tokens=1 delims=:" %%a in ('findstr /n "^};" app.js') do (
        if !CLOSE_LINE!==0 set CLOSE_LINE=%%a
    )
    
    if !CLOSE_LINE!==0 (
        echo Error: Tidak dapat menemukan penutup BUDGET_IKLAN_URLS
        pause
        exit /b 1
    )
    
    REM Insert data baru sebelum penutup
    set /a INSERT_LINE=!CLOSE_LINE!-1
    
    powershell -Command "$content = Get-Content app.js; $content[0..!INSERT_LINE!] + \"  '%BULAN_KEY%': '%URL%',\" + $content[(!INSERT_LINE!+1)..($content.Length-1)] | Set-Content temp_app.js"
    
    move /y temp_app.js app.js >nul
    
    echo.
    echo Data budget iklan berhasil ditambahkan!
)

echo.
echo =============================================
echo  SELESAI!
echo =============================================
echo.
echo Data budget iklan %BULAN_NAMA% (%BULAN_KEY%) telah ditambahkan ke app.js
echo.
echo Jangan lupa:
echo 1. Push perubahan ke GitHub dengan push-to-github.bat
echo 2. Refresh browser untuk melihat data baru
echo.
pause
endlocal

