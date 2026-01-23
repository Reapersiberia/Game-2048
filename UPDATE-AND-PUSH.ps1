# Автоматическое обновление Account Association и пуш на GitHub
# Использование: .\UPDATE-AND-PUSH.ps1 -Header "..." -Payload "..." -Signature "..."

param(
    [Parameter(Mandatory=$true)]
    [string]$Header,
    
    [Parameter(Mandatory=$true)]
    [string]$Payload,
    
    [Parameter(Mandatory=$true)]
    [string]$Signature
)

$ErrorActionPreference = "Continue"

Write-Host "===========================================" -ForegroundColor Cyan
Write-Host "AUTOMATIC UPDATE AND PUSH" -ForegroundColor Cyan
Write-Host "===========================================" -ForegroundColor Cyan
Write-Host ""

# Обновление файла
Write-Host "Updating farcaster.json..." -ForegroundColor Yellow
$farcasterPath = ".\.well-known\farcaster.json"

if (-not (Test-Path $farcasterPath)) {
    Write-Host "ERROR: farcaster.json not found!" -ForegroundColor Red
    exit 1
}

try {
    # Читаем JSON
    $farcaster = Get-Content $farcasterPath -Raw | ConvertFrom-Json
    
    # Обновляем accountAssociation
    $farcaster.accountAssociation.header = $Header
    $farcaster.accountAssociation.payload = $Payload
    $farcaster.accountAssociation.signature = $Signature
    
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
