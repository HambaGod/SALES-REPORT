@echo off
echo ========================================
echo   Push ke GitHub (Custom Message)
echo ========================================
echo.

cd /d "%~dp0"

echo Menambahkan semua file...
git add .

echo.
set /p commit_msg="Masukkan pesan commit (contoh: Update dashboard - tambah fitur baru): "
if "%commit_msg%"=="" set commit_msg=Update dashboard

echo.
echo Membuat commit dengan pesan: %commit_msg%
git commit -m "%commit_msg%"

echo.
echo Push ke GitHub...
git push

echo.
echo ========================================
echo   Selesai!
echo ========================================
echo.
echo Dashboard akan otomatis terupdate di Vercel dalam beberapa detik.
echo.
pause

