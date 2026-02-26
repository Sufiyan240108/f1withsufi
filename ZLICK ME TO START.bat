@echo off
setlocal enabledelayedexpansion
title f1withsufi — Launcher
color 0A

:: Get the directory of the script
set "BASE_DIR=%~dp0"
cd /d "%BASE_DIR%"

echo.
echo  =========================================
echo   f1withsufi — One-Click Start
echo  =========================================
echo.

:: ─ Check Node ─
where node >nul 2>&1
if !errorlevel! neq 0 (
    echo  [ERROR] Node.js not found. Install from https://nodejs.org
    pause
    exit /b 1
)

:: ─ Check Python ─
where python >nul 2>&1
if !errorlevel! neq 0 (
    echo  [ERROR] Python not found. Install from https://python.org
    pause
    exit /b 1
)

echo  [1/3] Installing frontend dependencies...
if exist "frontend" (
    cd /d "frontend"
    if not exist node_modules (
        call npm install --silent
        echo       Done.
    ) else (
        echo       Already installed.
    )
    cd /d "%BASE_DIR%"
) else (
    echo  [ERROR] Frontend directory not found!
    pause
    exit /b 1
)

echo.
echo  [2/3] Installing backend dependencies...
if exist "backend" (
    cd /d "backend"
    python -m pip install -r requirements.txt -q --disable-pip-version-check --no-warn-script-location 2>nul
    echo       Done.
    cd /d "%BASE_DIR%"
) else (
    echo  [ERROR] Backend directory not found!
    pause
    exit /b 1
)

echo.
echo  [3/3] Starting servers...
echo.

:: ─ Start backend in new window ─
start "OpenF1 Backend  [localhost:8000]" cmd /c "cd /d "%BASE_DIR%backend" && python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000"

:: ─ Wait 2 seconds then start frontend ─
timeout /t 2 /nobreak >nul

:: ─ Start frontend in new window ─
start "OpenF1 Frontend [localhost:5173]" cmd /c "cd /d "%BASE_DIR%frontend" && npx --yes vite"

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
