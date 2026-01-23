@echo off
chcp 65001 >nul
echo ===========================================
echo Opening Farcaster Manifest Tool...
echo ===========================================
start https://farcaster.xyz/~/developers/mini-apps/manifest
timeout /t 2 >nul
echo.
echo ===========================================
echo INSTRUCTIONS:
echo ===========================================
echo.
echo 1. In the opened browser:
echo    - Login to your Farcaster account
echo.
echo 2. In the "Domain" field, enter (without https://):
echo    game-2048-theta-eosin.vercel.app
echo.
echo 3. Click "Refresh" button
echo.
echo 4. Click "Generate Account Association" button
echo.
echo 5. Copy three values: header, payload, signature
echo.
echo 6. Run this command with your data:
echo    .\UPDATE-ACCOUNT-ASSOCIATION.ps1 -Header "..." -Payload "..." -Signature "..."
echo.
echo ===========================================
pause
