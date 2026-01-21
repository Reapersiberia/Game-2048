# Скрипт для автоматического обновления URL после деплоя на Vercel
# Использование: .\UPDATE-URLS.ps1 -Domain "your-app.vercel.app"

param(
    [Parameter(Mandatory=$true)]
    [string]$Domain
)

$baseUrl = "https://$Domain"

Write-Host "Обновление URL на: $baseUrl" -ForegroundColor Green

# Обновление farcaster.json
$farcasterPath = ".\.well-known\farcaster.json"
if (Test-Path $farcasterPath) {
    $farcaster = Get-Content $farcasterPath -Raw | ConvertFrom-Json
    
    $farcaster.miniapp.homeUrl = $baseUrl
    $farcaster.miniapp.iconUrl = "$baseUrl/icon.png"
    $farcaster.miniapp.splashImageUrl = "$baseUrl/splash.png"
    $farcaster.miniapp.heroImageUrl = "$baseUrl/og.png"
    $farcaster.miniapp.ogImageUrl = "$baseUrl/og.png"
    $farcaster.miniapp.screenshotUrls = @("$baseUrl/screenshot-1.png")
    
    $farcaster | ConvertTo-Json -Depth 10 | Set-Content $farcasterPath
    Write-Host "✓ Обновлен farcaster.json" -ForegroundColor Green
} else {
    Write-Host "✗ Файл farcaster.json не найден!" -ForegroundColor Red
}

# Обновление index.html
$indexPath = "index.html"
if (Test-Path $indexPath) {
    $indexContent = Get-Content $indexPath -Raw
    
    # Обновление fc:miniapp мета-тега
    $newMetaContent = @"
{
      "version":"next",
      "imageUrl":"$baseUrl/embed-image.png",
      "button":{
          "title":"Play 2048",
          "action":{
              "type":"launch_miniapp",
              "name":"Game 2048",
              "url":"$baseUrl"
          }
      }
    }
"@
    
    $indexContent = $indexContent -replace '(?s)<meta name="fc:miniapp" content=''\{.*?\}''>', "<meta name=`"fc:miniapp`" content='$newMetaContent'>"
    
    Set-Content $indexPath $indexContent
    Write-Host "✓ Обновлен index.html" -ForegroundColor Green
} else {
    Write-Host "✗ Файл index.html не найден!" -ForegroundColor Red
}

Write-Host "`nГотово! Теперь закоммитьте и запушьте изменения на GitHub." -ForegroundColor Cyan
Write-Host "После этого Vercel автоматически обновит деплой." -ForegroundColor Cyan
