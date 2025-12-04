@echo off
echo ========================================
echo   Setup Git Repository untuk GitHub
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

echo Step 1: Initialize Git repository...
if exist ".git" (
    echo Git repository sudah ada.
    echo.
) else (
    echo Membuat Git repository baru...
    git init
    echo.
    echo Git repository berhasil dibuat!
    echo.
)

echo Step 2: Setting up remote repository...
git remote -v | findstr "origin" >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo Remote 'origin' sudah ada:
    git remote -v
    echo.
    set /p CHANGE_REMOTE="Apakah ingin mengubah remote ke SALES-REPORT? (y/n): "
    if /i "%CHANGE_REMOTE%"=="y" (
        git remote remove origin
        git remote add origin https://github.com/HambaGod/SALES-REPORT.git
        echo Remote sudah diubah ke: https://github.com/HambaGod/SALES-REPORT.git
        echo.
    )
) else (
    echo Menambahkan remote repository...
    git remote add origin https://github.com/HambaGod/SALES-REPORT.git
    echo Remote 'origin' ditambahkan: https://github.com/HambaGod/SALES-REPORT.git
    echo.
)

echo Step 3: Menambahkan semua file...
git add .
echo.

echo Step 4: Membuat commit pertama...
git commit -m "Initial commit - Upload project files"
echo.

if %ERRORLEVEL% EQU 0 (
    echo Step 5: Setting branch ke 'main'...
    git branch -M main
    echo.
    
    echo ========================================
    echo   Setup Selesai!
    echo ========================================
    echo.
    echo Repository sudah siap untuk di-upload ke GitHub.
    echo.
    echo Sekarang jalankan: upload-to-github.bat
    echo Atau lanjutkan dengan push sekarang? (y/n)
    set /p CONTINUE=""
    if /i "%CONTINUE%"=="y" (
        echo.
        echo Step 6: Push ke GitHub...
        echo.
        echo Jika ini pertama kali, Anda akan diminta login:
        echo   Username: HambaGod
        echo   Password: Personal Access Token (bukan password biasa)
        echo.
        pause
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
            echo Pastikan:
            echo 1. Repository SALES-REPORT sudah dibuat di GitHub
            echo 2. Anda sudah login dengan Personal Access Token
            echo.
        )
    )
) else (
    echo.
    echo WARNING: Tidak ada file untuk di-commit.
    echo.
)

echo ========================================
echo Tekan tombol apapun untuk menutup...
echo ========================================
pause >nul

