# Финальный скрипт для отправки на GitHub
$ErrorActionPreference = "Continue"
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

Write-Host "===========================================" -ForegroundColor Cyan
Write-Host "ОТПРАВКА ПРОЕКТА 2048 НА GITHUB" -ForegroundColor Cyan
Write-Host "===========================================" -ForegroundColor Cyan
Write-Host ""

# Убеждаемся что все закоммичено
git add . 2>$null
$status = git status --porcelain
if ($status) {
    Write-Host "Создание коммита..." -ForegroundColor Yellow
    git commit -m "Update: игра 2048" 2>$null
}

# Переименовываем ветку в main если нужно
git branch -M main 2>$null

# Пробуем через GitHub CLI
Write-Host "Попытка через GitHub CLI..." -ForegroundColor Yellow
$ghAvailable = $false
try {
    gh --version | Out-Null
    $ghAvailable = $true
} catch {
    $ghAvailable = $false
}

if ($ghAvailable) {
    $authCheck = gh auth status 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "GitHub CLI авторизован! Создание репозитория..." -ForegroundColor Green
        
        # Пробуем создать репозиторий
        $repoName = "igra-2048"
        Write-Host "Создание репозитория: $repoName" -ForegroundColor Yellow
        $result = gh repo create $repoName --public --source=. --remote=origin --push 2>&1
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host ""
            Write-Host "===========================================" -ForegroundColor Green
            Write-Host "✅ УСПЕШНО ОТПРАВЛЕНО НА GITHUB!" -ForegroundColor Green
            Write-Host "===========================================" -ForegroundColor Green
            Write-Host ""
            $repoUrl = gh repo view $repoName --json url -q .url
            Write-Host "Репозиторий: $repoUrl" -ForegroundColor Cyan
            Write-Host ""
            git remote -v
            exit 0
        } else {
            Write-Host "Репозиторий уже существует или ошибка создания" -ForegroundColor Yellow
            Write-Host "Пробуем добавить remote и запушить..." -ForegroundColor Yellow
            
            # Пробуем добавить remote если его нет
            $remoteCheck = git remote get-url origin 2>&1
            if ($LASTEXITCODE -ne 0) {
                $username = gh api user -q .login 2>$null
                if ($username) {
                    $repoUrl = "https://github.com/$username/$repoName.git"
                    Write-Host "Добавление remote: $repoUrl" -ForegroundColor Yellow
                    git remote add origin $repoUrl 2>$null
                }
            }
            
            # Пробуем запушить
            Write-Host "Отправка на GitHub..." -ForegroundColor Yellow
            git push -u origin main 2>&1 | Out-Host
            
            if ($LASTEXITCODE -eq 0) {
                Write-Host ""
                Write-Host "===========================================" -ForegroundColor Green
                Write-Host "✅ УСПЕШНО ОТПРАВЛЕНО НА GITHUB!" -ForegroundColor Green
                Write-Host "===========================================" -ForegroundColor Green
                exit 0
            }
        }
    } else {
        Write-Host "Требуется авторизация GitHub CLI" -ForegroundColor Yellow
        Write-Host ""
        Write-Host "Выполните авторизацию:" -ForegroundColor Cyan
        Write-Host "  gh auth login" -ForegroundColor White
        Write-Host ""
        Write-Host "Затем запустите этот скрипт снова" -ForegroundColor Gray
    }
}

# Проверяем существующий remote
Write-Host ""
Write-Host "Проверка существующего remote..." -ForegroundColor Yellow
$remoteUrl = git remote get-url origin 2>$null

if ($LASTEXITCODE -eq 0 -and $remoteUrl) {
    Write-Host "Найден remote: $remoteUrl" -ForegroundColor Green
    Write-Host "Отправка на GitHub..." -ForegroundColor Yellow
    git push -u origin main 2>&1 | Out-Host
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "===========================================" -ForegroundColor Green
        Write-Host "✅ УСПЕШНО ОТПРАВЛЕНО НА GITHUB!" -ForegroundColor Green
        Write-Host "===========================================" -ForegroundColor Green
        Write-Host "Репозиторий: $remoteUrl" -ForegroundColor Cyan
        exit 0
    } else {
        Write-Host "Ошибка при отправке. Проверьте права доступа." -ForegroundColor Red
    }
} else {
    Write-Host ""
    Write-Host "===========================================" -ForegroundColor Yellow
    Write-Host "Remote не настроен" -ForegroundColor Yellow
    Write-Host "===========================================" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Для завершения:" -ForegroundColor Cyan
    Write-Host "1. Создайте репозиторий на https://github.com/new" -ForegroundColor Gray
    Write-Host "   Название: igra-2048" -ForegroundColor Gray
    Write-Host ""
    Write-Host "2. Затем выполните:" -ForegroundColor Cyan
    Write-Host "   git remote add origin https://github.com/YOUR_USERNAME/igra-2048.git" -ForegroundColor White
    Write-Host "   git push -u origin main" -ForegroundColor White
    Write-Host ""
    Write-Host "Или авторизуйтесь в GitHub CLI:" -ForegroundColor Cyan
    Write-Host "   gh auth login" -ForegroundColor White
    Write-Host "   Затем запустите этот скрипт снова" -ForegroundColor Gray
}

Write-Host ""
git status
