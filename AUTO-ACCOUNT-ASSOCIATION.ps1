# Автоматический скрипт для генерации Account Association
# Этот скрипт откроет нужные страницы и поможет вам выполнить все шаги

$ErrorActionPreference = "Continue"

Write-Host "Автоматическая настройка Account Association" -ForegroundColor Cyan
Write-Host ""

# Шаг 1: Проверка манифеста
Write-Host "Шаг 1: Проверка доступности манифеста..." -ForegroundColor Yellow
$manifestUrl = "https://game-2048-theta-eosin.vercel.app/.well-known/farcaster.json"

try {
    $response = Invoke-WebRequest -Uri $manifestUrl -Method Get -TimeoutSec 10 -ErrorAction Stop -UseBasicParsing
    Write-Host "OK: Манифест доступен! (HTTP $($response.StatusCode))" -ForegroundColor Green
    Write-Host ""
} catch {
    Write-Host "WARNING: Манифест пока недоступен (404)" -ForegroundColor Yellow
    Write-Host "   Подождите еще 1-2 минуты после пуша на GitHub" -ForegroundColor Yellow
    Write-Host "   Затем запустите этот скрипт снова" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "   Проверьте вручную: $manifestUrl" -ForegroundColor Cyan
    Write-Host ""
    Read-Host "Нажмите Enter для продолжения"
}

# Шаг 2: Открытие Farcaster Manifest Tool
Write-Host "Шаг 2: Открытие Farcaster Manifest Tool..." -ForegroundColor Yellow
$manifestToolUrl = "https://farcaster.xyz/~/developers/mini-apps/manifest"
Start-Process $manifestToolUrl
Write-Host "OK: Открыт Farcaster Manifest Tool в браузере" -ForegroundColor Green
Write-Host ""

# Инструкции
Write-Host "===========================================" -ForegroundColor Cyan
Write-Host "ИНСТРУКЦИИ ДЛЯ ВЫПОЛНЕНИЯ:" -ForegroundColor White
Write-Host "===========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. В открывшемся окне браузера:" -ForegroundColor Yellow
Write-Host "   - Войдите в свой Farcaster аккаунт (если не вошли)" -ForegroundColor White
Write-Host ""
Write-Host "2. В поле 'Domain' введите (без https://):" -ForegroundColor Yellow
Write-Host "   game-2048-theta-eosin.vercel.app" -ForegroundColor Cyan
Write-Host ""
Write-Host "3. Нажмите кнопку 'Refresh'" -ForegroundColor Yellow
Write-Host "   (Должен загрузиться ваш манифест)" -ForegroundColor Gray
Write-Host ""
Write-Host "4. Нажмите фиолетовую кнопку 'Generate Account Association'" -ForegroundColor Yellow
Write-Host ""
Write-Host "5. Скопируйте три значения:" -ForegroundColor Yellow
Write-Host "   - header" -ForegroundColor Cyan
Write-Host "   - payload" -ForegroundColor Cyan
Write-Host "   - signature" -ForegroundColor Cyan
Write-Host ""
Write-Host "===========================================" -ForegroundColor Cyan
Write-Host ""

# Ожидание ввода данных
Write-Host "После того, как скопируете данные, введите их ниже:" -ForegroundColor White
Write-Host ""

$header = Read-Host "Введите header"
$payload = Read-Host "Введите payload"
$signature = Read-Host "Введите signature"

# Валидация
if ([string]::IsNullOrWhiteSpace($header) -or [string]::IsNullOrWhiteSpace($payload) -or [string]::IsNullOrWhiteSpace($signature)) {
    Write-Host ""
    Write-Host "ERROR: Все поля должны быть заполнены!" -ForegroundColor Red
    Write-Host "   Запустите скрипт снова и введите все данные" -ForegroundColor Yellow
    exit 1
}

Write-Host ""
Write-Host "Обновление файла farcaster.json..." -ForegroundColor Yellow

# Обновление файла
$farcasterPath = ".\.well-known\farcaster.json"

if (-not (Test-Path $farcasterPath)) {
    Write-Host "ERROR: Файл farcaster.json не найден!" -ForegroundColor Red
    exit 1
}

try {
    # Читаем текущий JSON
    $farcaster = Get-Content $farcasterPath -Raw | ConvertFrom-Json
    
    # Обновляем accountAssociation
    $farcaster.accountAssociation.header = $header
    $farcaster.accountAssociation.payload = $payload
    $farcaster.accountAssociation.signature = $signature
    
    # Сохраняем обратно
    $farcaster | ConvertTo-Json -Depth 10 | Set-Content $farcasterPath -Encoding UTF8
    
    Write-Host "OK: Account Association данные обновлены!" -ForegroundColor Green
    Write-Host ""
    
    # Показываем обновленные данные
    Write-Host "===========================================" -ForegroundColor Cyan
    Write-Host "Обновленные данные:" -ForegroundColor White
    Write-Host "===========================================" -ForegroundColor Cyan
    $headerPreview = if ($header.Length -gt 50) { $header.Substring(0, 50) + "..." } else { $header }
    $payloadPreview = if ($payload.Length -gt 50) { $payload.Substring(0, 50) + "..." } else { $payload }
    $signaturePreview = if ($signature.Length -gt 50) { $signature.Substring(0, 50) + "..." } else { $signature }
    Write-Host "Header:    $headerPreview" -ForegroundColor Gray
    Write-Host "Payload:   $payloadPreview" -ForegroundColor Gray
    Write-Host "Signature: $signaturePreview" -ForegroundColor Gray
    Write-Host ""
    
    # Предложение закоммитить
    Write-Host "===========================================" -ForegroundColor Cyan
    Write-Host "Следующий шаг: Закоммитить и запушить изменения" -ForegroundColor White
    Write-Host "===========================================" -ForegroundColor Cyan
    Write-Host ""
    
    $commit = Read-Host "Хотите закоммитить и запушить изменения автоматически? (y/n)"
    
    if ($commit -eq "y" -or $commit -eq "Y" -or $commit -eq "yes" -or $commit -eq "Yes") {
        Write-Host ""
        Write-Host "Добавление файла в Git..." -ForegroundColor Yellow
        git add .well-known/farcaster.json
        
        Write-Host "Создание коммита..." -ForegroundColor Yellow
        git commit -m "Add account association data"
        
        Write-Host "Отправка на GitHub..." -ForegroundColor Yellow
        git push
        
        Write-Host ""
        Write-Host "OK: Готово! Изменения отправлены на GitHub" -ForegroundColor Green
        Write-Host ""
        Write-Host "Подождите 1-2 минуты, пока Vercel переразвернет проект" -ForegroundColor Yellow
        Write-Host ""
        Write-Host "Затем проверьте в Farcaster Manifest Tool:" -ForegroundColor Cyan
        Write-Host "   - Account Association должна показывать 'Verified' (зеленая галочка)" -ForegroundColor White
    } else {
        Write-Host ""
        Write-Host "Выполните команды вручную:" -ForegroundColor Yellow
        Write-Host "   git add .well-known/farcaster.json" -ForegroundColor Cyan
        Write-Host "   git commit -m 'Add account association data'" -ForegroundColor Cyan
        Write-Host "   git push" -ForegroundColor Cyan
    }
    
    Write-Host ""
    Write-Host "Все готово!" -ForegroundColor Green
    
} catch {
    Write-Host ""
    Write-Host "ERROR: Ошибка при обновлении: $_" -ForegroundColor Red
    exit 1
}
