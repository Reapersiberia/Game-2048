# Скрипт для автоматической настройки git и отправки на GitHub
$ErrorActionPreference = "Stop"
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
chcp 65001 | Out-Null

# Получаем директорию скрипта
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $scriptDir

Write-Host "===========================================" -ForegroundColor Cyan
Write-Host "Подготовка проекта для GitHub" -ForegroundColor Cyan
Write-Host "===========================================" -ForegroundColor Cyan
Write-Host ""

# Инициализация git
if (-not (Test-Path .git)) {
    Write-Host "Инициализация git репозитория..." -ForegroundColor Yellow
    git init
}

# Настройка git config
Write-Host "Настройка git config..." -ForegroundColor Yellow
git config user.name "Константин"
git config user.email "user@example.com"

# Добавление файлов
Write-Host "Добавление файлов..." -ForegroundColor Yellow
git add index.html style.css script.js README.md .gitignore push-to-github.bat 2>$null
if ($LASTEXITCODE -ne 0) {
    git add .
}

# Создание коммита
Write-Host "Создание коммита..." -ForegroundColor Yellow
git commit -m "Initial commit: игра 2048" 2>$null

Write-Host ""
Write-Host "===========================================" -ForegroundColor Green
Write-Host "Репозиторий готов!" -ForegroundColor Green
Write-Host "===========================================" -ForegroundColor Green
Write-Host ""

# Попытка отправить на GitHub через gh CLI
Write-Host "Попытка отправить на GitHub..." -ForegroundColor Yellow
$result = gh repo create igra-2048 --public --source=. --remote=origin --push 2>&1

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "===========================================" -ForegroundColor Green
    Write-Host "Успешно отправлено на GitHub!" -ForegroundColor Green
    Write-Host "===========================================" -ForegroundColor Green
} else {
    Write-Host "Не удалось автоматически отправить. Выполните:" -ForegroundColor Yellow
    Write-Host "  gh auth login" -ForegroundColor Cyan
    Write-Host "  Затем запустите скрипт снова" -ForegroundColor Cyan
}

git status
