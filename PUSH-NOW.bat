@echo off
chcp 65001 >nul
cd /d "%~dp0"

echo ==========================================
echo ОТПРАВКА ПРОЕКТА 2048 НА GITHUB
echo ==========================================
echo.

REM Убеждаемся что все закоммичено
git add . 2>nul
git commit -m "Update project files" 2>nul

REM Переименовываем ветку
git branch -M main 2>nul

REM Пробуем через GitHub CLI
echo Попытка через GitHub CLI...
gh auth status >nul 2>&1
if %errorlevel% equ 0 (
    echo GitHub CLI авторизован!
    echo Создание репозитория igra-2048...
    gh repo create igra-2048 --public --source=. --remote=origin --push
    if %errorlevel% equ 0 (
        echo.
        echo ==========================================
        echo УСПЕШНО ОТПРАВЛЕНО НА GITHUB!
        echo ==========================================
        git remote -v
        pause
        exit /b 0
    )
)

REM Проверяем существующий remote
echo.
echo Проверка remote...
git remote get-url origin >nul 2>&1
if %errorlevel% equ 0 (
    echo Найден remote, отправка...
    git push -u origin main
    if %errorlevel% equ 0 (
        echo.
        echo ==========================================
        echo УСПЕШНО ОТПРАВЛЕНО НА GITHUB!
        echo ==========================================
        pause
        exit /b 0
    )
)

REM Если не получилось
echo.
echo ==========================================
echo ТРЕБУЕТСЯ НАСТРОЙКА
echo ==========================================
echo.
echo Вариант 1: Авторизуйтесь в GitHub CLI
echo   gh auth login
echo   Затем запустите этот файл снова
echo.
echo Вариант 2: Создайте репозиторий вручную
echo   1. Откройте https://github.com/new
echo   2. Название: igra-2048
echo   3. Затем выполните:
echo      git remote add origin https://github.com/ВАШ_USERNAME/igra-2048.git
echo      git push -u origin main
echo.
pause
