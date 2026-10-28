@echo off
set "PATH=C:\Users\daksh\Downloads\mingit\cmd;%PATH%"
cd /d "%~dp0"
echo ========================================================
echo   Pushing IMovies Capstone to GitHub...
echo   Remote: https://github.com/dakshraghav17-ui/imovies-capstone.git
echo ========================================================
echo.
git status
echo.
echo Pushing branch 'main' to origin...
git branch -M main
git push -u origin main
echo.
echo ========================================================
echo   Finished! If prompted to log in, complete the browser
echo   or token prompt in this window.
echo ========================================================
pause
