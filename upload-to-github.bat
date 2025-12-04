@echo off
echo ========================================
echo   Upload Project ke GitHub
echo ========================================
echo.

REM Pastikan kita di directory yang benar
cd /d "%~dp0"

echo Current directory: %CD%
echo.

REM Cek apakah git sudah terinstall
where git >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Git tidak ditemukan!
    echo.
    echo Silakan install Git terlebih dahulu dari:
    echo https://git-scm.com/download/win
    echo.
    pause
    exit /b 1
)

echo Step 1: Checking Git installation...
git --version
echo.

REM Cek apakah sudah ada git repository
if exist ".git" (
    echo Git repository sudah ada.
    echo.
) else (
    echo Git repository belum ada, membuat repository baru...
    echo.
    git init
    echo.
    
    REM Set remote jika belum ada
    git remote -v | findstr "origin" >nul 2>&1
    if %ERRORLEVEL% NEQ 0 (
        echo Menambahkan remote repository...
        git remote add origin https://github.com/HambaGod/SALES-REPORT.git
        echo Remote 'origin' ditambahkan: https://github.com/HambaGod/SALES-REPORT.git
        echo.
    )
)

REM Cek status git
echo Step 2: Checking Git status...
git status
echo.

echo Step 3: Menambahkan semua file ke staging...
git add .
echo.

echo Step 4: Membuat commit...
set /p COMMIT_MSG="Masukkan pesan commit (atau tekan Enter untuk default): "
if "%COMMIT_MSG%"=="" (
    set COMMIT_MSG=Update project - %date% %time%
)
git commit -m "%COMMIT_MSG%"
echo.

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo WARNING: Tidak ada perubahan untuk di-commit.
    echo File mungkin sudah up-to-date dengan repository.
    echo.
) else (
    echo Step 5: Push ke GitHub...
    echo.
    echo Jika ini pertama kali, Anda mungkin diminta untuk:
    echo   1. Login ke GitHub (username dan password/token)
    echo   2. Atau menggunakan Personal Access Token
    echo.
    
    REM Cek branch saat ini
    git branch --show-current >nul 2>&1
    if %ERRORLEVEL% NEQ 0 (
        echo Membuat branch 'main'...
        git branch -M main
    )
    
    REM Push ke GitHub
    git push -u origin main
    
    if %ERRORLEVEL% EQU 0 (
        echo.
        echo ========================================
        echo   Upload BERHASIL!
        echo ========================================
        echo.
        echo File Anda sudah di-upload ke:
        echo https://github.com/HambaGod/SALES-REPORT
        echo.
    ) else (
        echo.
        echo ========================================
        echo   Upload GAGAL!
        echo ========================================
        echo.
        echo Kemungkinan masalah:
        echo 1. Belum login ke GitHub
        echo 2. Belum ada akses ke repository
        echo 3. Koneksi internet bermasalah
        echo.
        echo Untuk login, gunakan:
        echo   - Username GitHub Anda
        echo   - Personal Access Token (bukan password)
        echo.
        echo Cara membuat Personal Access Token:
        echo 1. Buka https://github.com/settings/tokens
        echo 2. Klik "Generate new token (classic)"
        echo 3. Beri nama dan pilih scope "repo"
        echo 4. Copy token dan gunakan sebagai password
        echo.
    )
)

echo ========================================
echo Tekan tombol apapun untuk menutup...
echo ========================================
pause >nul

