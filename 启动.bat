@echo off
chcp 65001 >nul
cd /d "%~dp0"

python "%~dp0serve.py"

if errorlevel 1 (
  echo.
  echo   ======================================================
  echo   Startup failed.
  echo.
  echo   Most likely Python is not installed, or it was not
  echo   added to PATH during installation.
  echo.
  echo   Install it once from:  https://www.python.org/downloads/
  echo   and be sure to tick "Add python.exe to PATH".
  echo   ======================================================
  echo.
  pause
)
