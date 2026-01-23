# Полностью автоматизированный скрипт для Account Association
# Выполняет все шаги после получения данных от пользователя

$ErrorActionPreference = "Continue"
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

Write-Host "===========================================" -ForegroundColor Cyan
Write-Host "AUTOMATIC ACCOUNT ASSOCIATION SETUP" -ForegroundColor Cyan
Write-Host "===========================================" -ForegroundColor Cyan
Write-Host ""

# Проверка манифеста
Write-Host "Checking manifest availability..." -ForegroundColor Yellow
$manifestUrl = "https://game-2048-theta-eosin.vercel.app/.well-known/farcaster.json"

try {
    $response = Invoke-WebRequest -Uri $manifestUrl -Method Get -TimeoutSec 10 -UseBasicParsing -ErrorAction Stop
    Write-Host "OK: Manifest is available (HTTP $($response.StatusCode))" -ForegroundColor Green
} catch {
    Write-Host "WARNING: Manifest returns 404" -ForegroundColor Yellow
    Write-Host "Wait 1-2 minutes for Vercel to redeploy, then run this script again" -ForegroundColor Yellow
    exit 1
}

Write-Host ""
Write-Host "Opening Farcaster Manifest Tool..." -ForegroundColor Cyan
Start-Process "https://farcaster.xyz/~/developers/mini-apps/manifest"
Start-Sleep -Seconds 2

Write-Host ""
Write-Host "===========================================" -ForegroundColor Cyan
Write-Host "INSTRUCTIONS:" -ForegroundColor White
Write-Host "===========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. In the opened browser, login to your Farcaster account" -ForegroundColor Yellow
Write-Host ""
Write-Host "2. In the 'Domain' field, enter:" -ForegroundColor Yellow
Write-Host "   game-2048-theta-eosin.vercel.app" -ForegroundColor Cyan
Write-Host ""
Write-Host "3. Click 'Refresh' button" -ForegroundColor Yellow
Write-Host ""
Write-Host "4. Click 'Generate Account Association' button" -ForegroundColor Yellow
Write-Host ""
Write-Host "5. Copy the three values: header, payload, signature" -ForegroundColor Yellow
Write-Host ""
Write-Host "===========================================" -ForegroundColor Cyan
Write-Host ""

# Получение данных от пользователя
Write-Host "After copying the data, paste them below:" -ForegroundColor White
Write-Host ""

$header = Read-Host "Enter header"
$payload = Read-Host "Enter payload"
$signature = Read-Host "Enter signature"

# Валидация
if ([string]::IsNullOrWhiteSpace($header) -or [string]::IsNullOrWhiteSpace($payload) -or [string]::IsNullOrWhiteSpace($signature)) {
    Write-Host ""
    Write-Host "ERROR: All fields must be filled!" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "Updating farcaster.json..." -ForegroundColor Yellow

# Обновление файла
$farcasterPath = ".\.well-known\farcaster.json"

if (-not (Test-Path $farcasterPath)) {
    Write-Host "ERROR: farcaster.json not found!" -ForegroundColor Red
    exit 1
}

try {
    # Читаем JSON
    $farcaster = Get-Content $farcasterPath -Raw | ConvertFrom-Json
    
    # Обновляем accountAssociation
    $farcaster.accountAssociation.header = $header
    $farcaster.accountAssociation.payload = $payload
    $farcaster.accountAssociation.signature = $signature
    
    # Сохраняем
    $farcaster | ConvertTo-Json -Depth 10 | Set-Content $farcasterPath -Encoding UTF8
    
    Write-Host "OK: Account Association data updated!" -ForegroundColor Green
    Write-Host ""
    
    # Автоматический коммит и пуш
    Write-Host "Committing and pushing changes..." -ForegroundColor Yellow
    git add .well-known/farcaster.json
    git commit -m "Add account association data"
    git push
    
    Write-Host ""
    Write-Host "===========================================" -ForegroundColor Green
    Write-Host "SUCCESS! All done!" -ForegroundColor Green
    Write-Host "===========================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "Changes have been pushed to GitHub." -ForegroundColor Cyan
    Write-Host "Wait 1-2 minutes for Vercel to redeploy." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Then check in Farcaster Manifest Tool:" -ForegroundColor Cyan
    Write-Host "Account Association should show 'Verified' (green checkmark)" -ForegroundColor White
    
} catch {
    Write-Host ""
    Write-Host "ERROR: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}
