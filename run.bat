@echo off
title RE-BORN Web Server
cd /d "%~dp0"
cls
echo ========================================================
echo    RE-BORN - Khoi dong May chu Website
echo ========================================================
echo.
echo Dang kiem tra Node.js va khoi dong may chu...

where node >nul 2>nul
if %errorlevel% neq 0 (
    echo.
    echo [THONG BAO] May tinh chua nhan dien duoc lenh 'node'.
    echo Dang tu dong mo truc tiep website bang trinh duyet...
    start index.html
    echo.
    echo Website da duoc mo!
    pause
    exit /b
)

node server.js
pause
