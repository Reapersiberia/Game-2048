@echo off
chcp 65001 >nul
cd /d "%~dp0"
git add .
git commit -m "Обновлены URL для Base Mini App и добавлены файлы для публикации"
git push origin main
echo.
echo Готово! Изменения отправлены на GitHub.
echo Vercel автоматически обновит деплой.
