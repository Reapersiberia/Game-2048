# Автоматическая отправка на GitHub
$ErrorActionPreference = "Continue"
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

Write-Host "===========================================" -ForegroundColor Cyan
Write-Host "Автоматическая отправка на GitHub" -ForegroundColor Cyan
Write-Host "===========================================" -ForegroundColor Cyan
Write-Host ""

# Проверка git
try {
    git --version | Out-Null
} catch {
    Write-Host "Ошибка: Git не установлен!" -ForegroundColor Red
    exit 1
}

# Убеждаемся что мы на ветке main
$currentBranch = git branch --show-current
if ($currentBranch -ne "main") {
    Write-Host "Переименование ветки в main..." -ForegroundColor Yellow
    git branch -M main 2>$null
}

# Добавляем все неотслеживаемые файлы
Write-Host "Добавление всех файлов..." -ForegroundColor Yellow
git add . 2>$null
$hasChanges = git diff --cached --quiet 2>$null
if (-not $hasChanges) {
    Write-Host "Создание коммита..." -ForegroundColor Yellow
    git commit -m "Add project files: игра 2048" 2>$null
}

# Проверяем GitHub CLI
$ghInstalled = $false
try {
    gh --version | Out-Null
    $ghInstalled = $true
} catch {
    $ghInstalled = $false
}

if ($ghInstalled) {
    Write-Host "GitHub CLI найден, проверка авторизации..." -ForegroundColor Yellow
    $authStatus = gh auth status 2>&1
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Авторизация найдена!" -ForegroundColor Green
        Write-Host "Создание репозитория на GitHub..." -ForegroundColor Yellow
        
        # Пробуем создать репозиторий
        $repoName = "igra-2048"
        $result = gh repo create $repoName --public --source=. --remote=origin --push 2>&1
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host ""
            Write-Host "===========================================" -ForegroundColor Green
            Write-Host "УСПЕШНО ОТПРАВЛЕНО НА GITHUB!" -ForegroundColor Green
            Write-Host "===========================================" -ForegroundColor Green
            Write-Host ""
            git remote -v
            exit 0
        } else {
            Write-Host "Не удалось создать репозиторий автоматически." -ForegroundColor Yellow
            Write-Host $result -ForegroundColor Gray
        }
    } else {
        Write-Host "Требуется авторизация GitHub CLI" -ForegroundColor Yellow
        Write-Host "Запускаю авторизацию..." -ForegroundColor Yellow
        
        # Пробуем авторизоваться через веб
        Start-Process "https://github.com/login/device" -ErrorAction SilentlyContinue
        gh auth login --web 2>&1 | Out-Null
        
        Start-Sleep -Seconds 5
        
        # Проверяем снова
        $authStatus2 = gh auth status 2>&1
        if ($LASTEXITCODE -eq 0) {
            Write-Host "Авторизация успешна! Создание репозитория..." -ForegroundColor Green
            $repoName = "igra-2048"
            $result = gh repo create $repoName --public --source=. --remote=origin --push 2>&1
            
            if ($LASTEXITCODE -eq 0) {
                Write-Host ""
                Write-Host "===========================================" -ForegroundColor Green
                Write-Host "УСПЕШНО ОТПРАВЛЕНО НА GITHUB!" -ForegroundColor Green
                Write-Host "===========================================" -ForegroundColor Green
                exit 0
            }
        }
    }
}

# Если не получилось через gh CLI, проверяем remote
Write-Host ""
Write-Host "Проверка настроенного remote..." -ForegroundColor Yellow
$remoteUrl = git remote get-url origin 2>$null

if ($LASTEXITCODE -eq 0 -and $remoteUrl) {
    Write-Host "Найден remote: $remoteUrl" -ForegroundColor Green
    Write-Host "Отправка на GitHub..." -ForegroundColor Yellow
    git push -u origin main 2>&1
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "===========================================" -ForegroundColor Green
        Write-Host "УСПЕШНО ОТПРАВЛЕНО НА GITHUB!" -ForegroundColor Green
        Write-Host "===========================================" -ForegroundColor Green
        exit 0
    }
}

# Если ничего не помогло
Write-Host ""
Write-Host "===========================================" -ForegroundColor Yellow
Write-Host "Автоматическая отправка не удалась" -ForegroundColor Yellow
Write-Host "===========================================" -ForegroundColor Yellow
Write-Host ""
Write-Host "Выполните вручную:" -ForegroundColor Cyan
Write-Host "1. Создайте репозиторий на https://github.com/new" -ForegroundColor Gray
Write-Host "2. Название: igra-2048" -ForegroundColor Gray
Write-Host "3. Затем выполните:" -ForegroundColor Gray
Write-Host "   git remote add origin https://github.com/ВАШ_USERNAME/igra-2048.git" -ForegroundColor White
Write-Host "   git push -u origin main" -ForegroundColor White
Write-Host ""

git status
