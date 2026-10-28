@echo off
set "PATH=C:\Users\daksh\Downloads\node-v20.18.0-win-x64;%PATH%"
cd /d "%~dp0client"
echo ===================================================
echo   Starting IMovies Frontend Client on port 5173...
echo ===================================================
npm run dev
pause
