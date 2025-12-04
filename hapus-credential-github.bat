@echo off
echo ========================================
echo   Hapus Credential GitHub
echo ========================================
echo.
echo Script ini akan membuka Windows Credential Manager
echo untuk menghapus credential GitHub yang tersimpan.
echo.
echo CARA MANUAL:
echo 1. Windows akan membuka Credential Manager
echo 2. Pilih "Windows Credentials"
echo 3. Cari entry yang mengandung "github.com"
echo 4. Klik entry tersebut
echo 5. Klik "Remove" atau "Delete"
echo 6. Tutup Credential Manager
echo.
pause
echo.

REM Buka Credential Manager
start control /name Microsoft.CredentialManager

echo.
echo ========================================
echo Credential Manager sudah dibuka.
echo.
echo Ikuti langkah di atas untuk menghapus credential GitHub.
echo Setelah selesai, tekan tombol apapun untuk melanjutkan...
echo ========================================
pause
echo.

REM Alternatif: Coba hapus via command line jika memungkinkan
echo Mencoba menghapus credential via command line...
echo (Jika tidak berhasil, gunakan cara manual di atas)
echo.

REM Untuk Windows 10/11, coba hapus via cmdkey
cmdkey /list | findstr "github" >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo Menemukan credential GitHub, mencoba menghapus...
    for /f "tokens=2 delims=:" %%a in ('cmdkey /list ^| findstr "github"') do (
        set CRED_NAME=%%a
        set CRED_NAME=!CRED_NAME: =!
        echo Menghapus: !CRED_NAME!
        cmdkey /delete:!CRED_NAME!
    )
    echo.
    echo Credential sudah dihapus!
) else (
    echo Tidak menemukan credential GitHub di cmdkey.
    echo Gunakan cara manual via Credential Manager.
)

echo.
echo ========================================
echo Selesai!
echo ========================================
echo.
echo Sekarang coba jalankan setup-github.bat lagi.
echo.
pause

