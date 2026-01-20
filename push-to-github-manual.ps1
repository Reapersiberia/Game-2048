# Скрипт для пуша в существующий GitHub репозиторий
$ErrorActionPreference = "Stop"
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

Write-Host "===========================================" -ForegroundColor Cyan
Write-Host "Отправка проекта на GitHub" -ForegroundColor Cyan
Write-Host "===========================================" -ForegroundColor Cyan
Write-Host ""

# Проверка наличия git репозитория
if (-not (Test-Path .git)) {
    Write-Host "Ошибка: Git репозиторий не инициализирован!" -ForegroundColor Red
    Write-Host "Запустите сначала setup-git.ps1" -ForegroundColor Yellow
    exit 1
}

# Проверка наличия коммитов
$commits = git log --oneline 2>$null
if (-not $commits) {
    Write-Host "Создание начального коммита..." -ForegroundColor Yellow
    git add .
    git commit -m "Initial commit: игра 2048"
}

# Переименование ветки в main (если нужно)
$currentBranch = git branch --show-current
if ($currentBranch -eq "master") {
    Write-Host "Переименование ветки master в main..." -ForegroundColor Yellow
    git branch -M main
}

# Проверка наличия remote
$remote = git remote get-url origin 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "Введите URL вашего GitHub репозитория:" -ForegroundColor Yellow
    Write-Host "Пример: https://github.com/username/igra-2048.git" -ForegroundColor Gray
    $repoUrl = Read-Host "URL репозитория"
    
    if ($repoUrl) {
        Write-Host "Добавление remote origin..." -ForegroundColor Yellow
        git remote add origin $repoUrl
    } else {
        Write-Host "Ошибка: URL не указан!" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "Найден remote: $remote" -ForegroundColor Green
}

# Пуш на GitHub
Write-Host ""
Write-Host "Отправка на GitHub..." -ForegroundColor Yellow
git push -u origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "===========================================" -ForegroundColor Green
    Write-Host "Успешно отправлено на GitHub!" -ForegroundColor Green
    Write-Host "===========================================" -ForegroundColor Green
} else {
    Write-Host ""
    Write-Host "Ошибка при отправке на GitHub!" -ForegroundColor Red
    Write-Host "Проверьте:" -ForegroundColor Yellow
    Write-Host "  1. Репозиторий создан на GitHub" -ForegroundColor Gray
    Write-Host "  2. URL репозитория правильный" -ForegroundColor Gray
    Write-Host "  3. У вас есть права на запись" -ForegroundColor Gray
}

git status
