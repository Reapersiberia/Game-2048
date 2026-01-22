# Simple Account Association Script
$ErrorActionPreference = "Continue"
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

Write-Host "===========================================" -ForegroundColor Cyan
Write-Host "ШАГ 4: ACCOUNT ASSOCIATION" -ForegroundColor Cyan
Write-Host "===========================================" -ForegroundColor Cyan
Write-Host ""

$domain = "game-2048-theta-eosin.vercel.app"
$manifestUrl = "https://$domain/.well-known/farcaster.json"
$toolUrl = "https://farcaster.xyz/~/developers/mini-apps/manifest"

Write-Host "Домен приложения: $domain" -ForegroundColor Green
Write-Host "URL манифеста: $manifestUrl" -ForegroundColor Green
Write-Host ""

Write-Host "Открываю Farcaster Manifest Tool..." -ForegroundColor Cyan
Start-Process $toolUrl

Write-Host ""
Write-Host "===========================================" -ForegroundColor Cyan
Write-Host "ИНСТРУКЦИЯ:" -ForegroundColor Cyan
Write-Host "===========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. В открывшемся браузере войдите в свой Farcaster аккаунт" -ForegroundColor Yellow
Write-Host "2. В поле 'Domain' введите: $domain" -ForegroundColor Yellow
Write-Host "3. Нажмите кнопку 'Refresh' для загрузки манифеста" -ForegroundColor Yellow
Write-Host "4. Нажмите кнопку 'Generate Account Association'" -ForegroundColor Yellow
Write-Host "5. Скопируйте три значения: header, payload, signature" -ForegroundColor Yellow
Write-Host ""
Write-Host "После получения данных, введите их ниже:" -ForegroundColor Cyan
Write-Host ""

$header = Read-Host "Введите header"
$payload = Read-Host "Введите payload"
$signature = Read-Host "Введите signature"

if ([string]::IsNullOrWhiteSpace($header) -or [string]::IsNullOrWhiteSpace($payload) -or [string]::IsNullOrWhiteSpace($signature)) {
    Write-Host ""
    Write-Host "Не все поля заполнены. Операция отменена." -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "Обновление farcaster.json..." -ForegroundColor Green

$farcasterPath = ".\.well-known\farcaster.json"

if (-not (Test-Path $farcasterPath)) {
    Write-Host "Файл farcaster.json не найден!" -ForegroundColor Red
    exit 1
}

try {
    $farcaster = Get-Content $farcasterPath -Raw -Encoding UTF8 | ConvertFrom-Json
    
    $farcaster.accountAssociation.header = $header
    $farcaster.accountAssociation.payload = $payload
    $farcaster.accountAssociation.signature = $signature
    
    $farcaster | ConvertTo-Json -Depth 10 | Set-Content $farcasterPath -Encoding UTF8
    
    Write-Host "Account Association данные обновлены!" -ForegroundColor Green
    Write-Host ""
    Write-Host "===========================================" -ForegroundColor Green
    Write-Host "ГОТОВО!" -ForegroundColor Green
    Write-Host "===========================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "Теперь закоммитьте и запушьте изменения:" -ForegroundColor Cyan
    Write-Host "  git add .well-known/farcaster.json" -ForegroundColor Yellow
    Write-Host "  git commit -m 'Add account association data'" -ForegroundColor Yellow
    Write-Host "  git push" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "После пуша Vercel автоматически обновит деплой." -ForegroundColor Cyan
    
} catch {
    Write-Host "Ошибка при обновлении: $_" -ForegroundColor Red
    exit 1
}
