@echo off
title f1withsufi — Launcher
color 0A

echo.
echo  =========================================
echo   f1withsufi — One-Click Start
echo  =========================================
echo.

:: ─ Check Node ─
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo  [ERROR] Node.js not found. Install from https://nodejs.org
    pause
    exit /b 1
)

:: ─ Check Python ─
where python >nul 2>&1
if %errorlevel% neq 0 (
    echo  [ERROR] Python not found. Install from https://python.org
    pause
    exit /b 1
)

echo  [1/3] Installing frontend dependencies...
cd /d "%~dp0frontend"
if not exist node_modules (
    call npm install --silent
    echo       Done.
) else (
    echo       Already installed.
)

echo.
echo  [2/3] Installing backend dependencies...
cd /d "%~dp0backend"
python -m pip install -r requirements.txt -q --disable-pip-version-check --no-warn-script-location 2>nul
echo       Done.

echo.
echo  [3/3] Starting servers...
echo.

:: ─ Start backend in new window ─
set BACKEND_DIR=%~dp0backend
set FRONTEND_DIR=%~dp0frontend
start "OpenF1 Backend  [localhost:8000]" cmd /k "cd /d %BACKEND_DIR% && python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000"

:: ─ Wait 2 seconds then start frontend ─
timeout /t 2 /nobreak >nul

:: ─ Start frontend in new window ─
start "OpenF1 Frontend [localhost:5173]" cmd /k "cd /d %FRONTEND_DIR% && npx --yes vite"

:: ─ Wait and open browser ─
timeout /t 5 /nobreak >nul
start "" http://localhost:5173

echo  =========================================
echo   Backend  → http://localhost:8000
echo   Frontend → http://localhost:5173
echo   API Docs → http://localhost:8000/docs
echo  =========================================
echo.
echo  Both servers are running in separate windows.
echo  Close those windows to stop the servers.
echo.
pause
