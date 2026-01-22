# Скрипт для обновления Account Association данных
# Использование: .\UPDATE-ACCOUNT-ASSOCIATION.ps1 -Header "..." -Payload "..." -Signature "..."

param(
    [Parameter(Mandatory=$true)]
    [string]$Header,
    
    [Parameter(Mandatory=$true)]
    [string]$Payload,
    
    [Parameter(Mandatory=$true)]
    [string]$Signature
)

$farcasterPath = ".\.well-known\farcaster.json"

if (-not (Test-Path $farcasterPath)) {
    Write-Host "✗ Файл farcaster.json не найден!" -ForegroundColor Red
    exit 1
}

Write-Host "Обновление Account Association данных..." -ForegroundColor Green

try {
    # Читаем текущий JSON
    $farcaster = Get-Content $farcasterPath -Raw | ConvertFrom-Json
    
    # Обновляем accountAssociation
    $farcaster.accountAssociation.header = $Header
    $farcaster.accountAssociation.payload = $Payload
    $farcaster.accountAssociation.signature = $Signature
    
    # Сохраняем обратно
    $farcaster | ConvertTo-Json -Depth 10 | Set-Content $farcasterPath
    
    Write-Host "✓ Account Association данные обновлены!" -ForegroundColor Green
    Write-Host "`nТеперь закоммитьте и запушьте изменения:" -ForegroundColor Cyan
    Write-Host "  git add .well-known/farcaster.json" -ForegroundColor Yellow
    Write-Host "  git commit -m 'Add account association data'" -ForegroundColor Yellow
    Write-Host "  git push" -ForegroundColor Yellow
} catch {
    Write-Host "✗ Ошибка при обновлении: $_" -ForegroundColor Red
    exit 1
}
