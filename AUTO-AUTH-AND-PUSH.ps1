# Автоматическая авторизация и отправка на GitHub
$ErrorActionPreference = "Continue"
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

Write-Host "===========================================" -ForegroundColor Cyan
Write-Host "АВТОМАТИЧЕСКАЯ ОТПРАВКА НА GITHUB" -ForegroundColor Cyan
Write-Host "===========================================" -ForegroundColor Cyan
Write-Host ""

# Проверяем текущую авторизацию
$authCheck = gh auth status 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "GitHub CLI уже авторизован!" -ForegroundColor Green
    $alreadyAuth = $true
} else {
    Write-Host "Требуется авторизация..." -ForegroundColor Yellow
    Write-Host "Запускаю процесс авторизации..." -ForegroundColor Yellow
    Write-Host ""
    
    # Запускаем авторизацию в фоне
    $authProcess = Start-Process -FilePath "gh" -ArgumentList "auth", "login", "--web", "--git-protocol", "https", "--scopes", "repo" -PassThru -NoNewWindow
    
    Write-Host "Откройте браузер и авторизуйтесь на GitHub" -ForegroundColor Cyan
    Write-Host "Ожидание авторизации (до 2 минут)..." -ForegroundColor Yellow
    Write-Host ""
    
    # Ждем авторизации (проверяем каждые 5 секунд, максимум 2 минуты)
    $maxWait = 24  # 24 попытки по 5 секунд = 2 минуты
    $attempt = 0
    $alreadyAuth = $false
    
    while ($attempt -lt $maxWait -and -not $alreadyAuth) {
        Start-Sleep -Seconds 5
        $attempt++
        $authStatus = gh auth status 2>&1
        if ($LASTEXITCODE -eq 0) {
            Write-Host "Авторизация успешна!" -ForegroundColor Green
            $alreadyAuth = $true
            break
        }
        Write-Host "." -NoNewline -ForegroundColor Gray
    }
    Write-Host ""
}

if (-not $alreadyAuth) {
    Write-Host ""
    Write-Host "Авторизация не завершена." -ForegroundColor Red
    Write-Host "Пожалуйста, выполните вручную: gh auth login" -ForegroundColor Yellow
    exit 1
}

# Убеждаемся что все закоммичено
Write-Host ""
Write-Host "Подготовка репозитория..." -ForegroundColor Yellow
git add . 2>$null
git commit -m "Final update: игра 2048" 2>$null
git branch -M main 2>$null

# Создаем репозиторий и пушим
Write-Host "Создание репозитория igra-2048 на GitHub..." -ForegroundColor Yellow
$result = gh repo create igra-2048 --public --source=. --remote=origin --push 2>&1

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "===========================================" -ForegroundColor Green
    Write-Host "УСПЕШНО ОТПРАВЛЕНО НА GITHUB!" -ForegroundColor Green
    Write-Host "===========================================" -ForegroundColor Green
    Write-Host ""
    
    $repoUrl = gh repo view igra-2048 --json url -q .url 2>$null
    if ($repoUrl) {
        Write-Host "Репозиторий: $repoUrl" -ForegroundColor Cyan
    }
    
    Write-Host ""
    git remote -v
    Write-Host ""
    Write-Host "Готово! Проект успешно отправлен на GitHub." -ForegroundColor Green
} else {
    Write-Host ""
    Write-Host "Проверка существующего репозитория..." -ForegroundColor Yellow
    
    # Проверяем, может репозиторий уже существует
    $repoExists = gh repo view igra-2048 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Репозиторий уже существует, добавляю remote и пушим..." -ForegroundColor Yellow
        
        $remoteCheck = git remote get-url origin 2>&1
        if ($LASTEXITCODE -ne 0) {
            $username = gh api user -q .login 2>$null
            if ($username) {
                $repoUrl = "https://github.com/$username/igra-2048.git"
                git remote add origin $repoUrl 2>$null
            }
        }
        
        git push -u origin main 2>&1 | Out-Host
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host ""
            Write-Host "===========================================" -ForegroundColor Green
            Write-Host "УСПЕШНО ОТПРАВЛЕНО НА GITHUB!" -ForegroundColor Green
            Write-Host "===========================================" -ForegroundColor Green
        } else {
            Write-Host "Ошибка при отправке." -ForegroundColor Red
        }
    } else {
        Write-Host "Ошибка при создании репозитория:" -ForegroundColor Red
        Write-Host $result -ForegroundColor Gray
    }
}
