@echo off
chcp 65001 >nul
cd /d "%~dp0"

echo ===========================================
echo ПОЛНОСТЬЮ АВТОМАТИЧЕСКАЯ НАСТРОЙКА
echo ===========================================
echo.

echo Шаг 1: Проверка манифеста...
powershell -Command "try { $r = Invoke-WebRequest -Uri 'https://game-2048-theta-eosin.vercel.app/.well-known/farcaster.json' -UseBasicParsing -TimeoutSec 10; Write-Host 'OK: Манифест доступен!' } catch { Write-Host 'WARNING: Манифест недоступен' }"

echo.
echo Шаг 2: Открытие Farcaster Manifest Tool...
start https://farcaster.xyz/~/developers/mini-apps/manifest

echo.
echo ===========================================
echo ИНСТРУКЦИЯ:
echo ===========================================
echo.
echo 1. В браузере войдите в Farcaster
echo 2. Введите домен: game-2048-theta-eosin.vercel.app
echo 3. Нажмите Refresh
echo 4. Нажмите Generate Account Association
echo 5. Скопируйте header, payload, signature
echo.
echo После копирования данных, запустите:
echo   .\UPDATE-AND-PUSH.ps1
echo.
echo Или введите данные напрямую:
echo   .\UPDATE-ACCOUNT-ASSOCIATION.ps1 -Header "..." -Payload "..." -Signature "..."
echo.
pause
