@echo off
title Project BB - Birthday Surprise Website
cd /d "%~dp0"
echo ===================================================
echo   Starting Project BB Birthday Surprise Website...
echo   Your browser will open automatically in a moment!
echo ===================================================
start "" http://localhost:5173
call npm.cmd run dev
pause
