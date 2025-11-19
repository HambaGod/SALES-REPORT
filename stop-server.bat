@echo off
echo ========================================
echo   Stopping Dashboard Server
echo ========================================
echo.

set FOUND=0

REM Cari PID yang menggunakan port 4173
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :4173 ^| findstr LISTENING') do (
    set PID=%%a
    set FOUND=1
    echo Menemukan server di port 4173 (PID: %%a)
    echo Menghentikan server...
    taskkill /PID %%a /F >nul 2>&1
    if errorlevel 1 (
        echo Gagal menghentikan server dengan PID %%a
    ) else (
        echo Server berhasil dihentikan!
    )
)

if %FOUND%==0 (
    echo Server tidak ditemukan di port 4173.
    echo Mungkin server sudah tidak berjalan.
)

echo.
pause

