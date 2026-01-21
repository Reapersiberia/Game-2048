# Временный скрипт для коммита и пуша
chcp 65001 | Out-Null
Set-Location $PSScriptRoot

Write-Host "Добавление всех файлов..." -ForegroundColor Green
git add .

Write-Host "Создание коммита..." -ForegroundColor Green
git commit -m "Обновлены URL для Base Mini App и добавлены файлы для публикации"

Write-Host "Отправка на GitHub..." -ForegroundColor Green
git push origin main

Write-Host "`nГотово! Изменения отправлены на GitHub." -ForegroundColor Cyan
Write-Host "Vercel автоматически обновит деплой." -ForegroundColor Cyan
