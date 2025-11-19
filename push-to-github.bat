@echo off
echo ========================================
echo   Push ke GitHub
echo ========================================
echo.

cd /d "%~dp0"

echo Menambahkan semua file...
git add .

echo.
echo Membuat commit...
git commit -m "Update dashboard - %date% %time%"

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

