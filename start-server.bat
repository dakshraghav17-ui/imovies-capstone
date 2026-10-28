@echo off
set "PATH=C:\Users\daksh\Downloads\node-v20.18.0-win-x64;%PATH%"
cd /d "%~dp0server"
echo ===================================================
echo   Starting IMovies Backend Server on port 5000...
echo ===================================================
npm start
pause
