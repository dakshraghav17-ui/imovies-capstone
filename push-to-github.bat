@echo off
set "PATH=C:\Users\daksh\Downloads\mingit\cmd;%PATH%"
cd /d "%~dp0"
echo ========================================================
echo   Pushing IMovies Capstone to GitHub...
echo   Remote: https://github.com/dakshraghav17-ui/imovies-capstone.git
echo ========================================================
echo.
git branch -M main
git push -u origin main
echo.
echo ========================================================
echo   Done! Check above output for push status.
echo ========================================================
pause
