@echo off
REM Script de démarrage du projet Viande-TP1 (Windows)
REM Utilisation: start.bat ou double-clic

cls
echo.
echo ╔════════════════════════════════════════════╗
echo ║   🚀 DÉMARRAGE VIANDE-TP1                 ║
echo ╚════════════════════════════════════════════╝
echo.

REM Vérifier que Node.js est installé
where node >nul 2>nul
if %errorlevel% neq 0 (
  echo ❌ Erreur: Node.js n'est pas installé
  pause
  exit /b 1
)

for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
for /f "tokens=*" %%i in ('npm --version') do set NPM_VERSION=%%i

echo ✓ Node.js: %NODE_VERSION%
echo ✓ npm: %NPM_VERSION%
echo.

REM Démarrer le backend dans une nouvelle fenêtre
echo 📡 Démarrage du BACKEND sur le port 5000...
start "Backend - Viande-TP1" cmd /k "cd backend && npm run dev"
timeout /t 2 /nobreak

REM Démarrer le frontend dans une nouvelle fenêtre
echo.
echo 🎨 Démarrage du FRONTEND sur le port 8080...
start "Frontend - Viande-TP1" cmd /k "cd frontend && npm run dev"

echo.
echo ╔════════════════════════════════════════════╗
echo ║   ✅ PROJET DÉMARRÉ AVEC SUCCÈS           ║
echo ╠════════════════════════════════════════════╣
echo ║ Frontend:  http://localhost:8080           ║
echo ║ Backend:   http://localhost:5000           ║
echo ║ Admin:     http://localhost:8080/admin     ║
echo ║ Test:      http://localhost:8080/test      ║
echo ╠════════════════════════════════════════════╣
echo ║ Fermer cette fenêtre pour terminer         ║
echo ╚════════════════════════════════════════════╝
echo.
pause
