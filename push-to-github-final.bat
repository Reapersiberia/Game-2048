@echo off
chcp 65001 >nul
cd /d "%~dp0"

echo ==========================================
echo Отправка проекта 2048 на GitHub
echo ==========================================
echo.

REM Проверка наличия git
git --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Ошибка: Git не установлен!
    pause
    exit /b 1
)

REM Переименование ветки в main
echo Переименование ветки в main...
git branch -M main 2>nul

REM Проверка remote
git remote get-url origin >nul 2>&1
if %errorlevel% neq 0 (
    echo.
    echo ==========================================
    echo Нужно добавить remote репозиторий
    echo ==========================================
    echo.
    echo 1. Создайте репозиторий на https://github.com/new
    echo 2. Название: igra-2048 (или другое)
    echo 3. НЕ добавляйте README или другие файлы
    echo.
    set /p REPO_URL="Введите URL репозитория (например: https://github.com/username/igra-2048.git): "
    
    if "%REPO_URL%"=="" (
        echo Ошибка: URL не указан!
        pause
        exit /b 1
    )
    
    echo.
    echo Добавление remote...
    git remote add origin "%REPO_URL%"
)

REM Показываем текущий remote
echo.
echo Текущий remote:
git remote -v
echo.

REM Пуш на GitHub
echo ==========================================
echo Отправка на GitHub...
echo ==========================================
echo.

git push -u origin main

if %errorlevel% equ 0 (
    echo.
    echo ==========================================
    echo УСПЕШНО ОТПРАВЛЕНО НА GITHUB!
    echo ==========================================
    echo.
    git remote get-url origin
) else (
    echo.
    echo ==========================================
    echo ОШИБКА ПРИ ОТПРАВКЕ
    echo ==========================================
    echo.
    echo Возможные причины:
    echo 1. Репозиторий не создан на GitHub
    echo 2. Неправильный URL
    echo 3. Нужна авторизация (используйте Personal Access Token)
    echo.
    echo Создайте токен: https://github.com/settings/tokens
    echo.
)

echo.
git status
echo.
pause
