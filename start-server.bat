@echo off
echo ========================================
echo   Starting Dashboard Server
echo ========================================
echo.
echo Server akan berjalan di: http://localhost:4173
echo.
echo Tekan Ctrl+C untuk menghentikan server
echo.
cd /d "%~dp0"
npx serve -l 4173
pause

