@echo off
echo Opening Farcaster Manifest Tool...
start https://farcaster.xyz/~/developers/mini-apps/manifest
echo.
echo ===========================================
echo INSTRUCTIONS:
echo ===========================================
echo.
echo 1. Login to your Farcaster account
echo 2. Enter domain: game-2048-theta-eosin.vercel.app
echo 3. Click "Refresh" to load manifest
echo 4. Click "Generate Account Association"
echo 5. Copy header, payload, signature
echo.
echo After you get the data, run:
echo UPDATE-ACCOUNT-ASSOCIATION.ps1 -Header "..." -Payload "..." -Signature "..."
echo.
pause
