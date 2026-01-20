@echo off
chcp 65001 >nul
cd /d "%~dp0"

echo ==========================================
echo СОЗДАНИЕ РЕПОЗИТОРИЯ И ОТПРАВКА НА GITHUB
echo ==========================================
echo.

REM Проверка авторизации
gh auth status >nul 2>&1
if %errorlevel% neq 0 (
    echo ТРЕБУЕТСЯ АВТОРИЗАЦИЯ
    echo.
    echo Выполните команду:
    echo   gh auth login
    echo.
    echo Затем запустите этот файл снова
    pause
    exit /b 1
)

echo GitHub CLI авторизован!
echo.

REM Убеждаемся что все закоммичено
git add . 2>nul
git commit -m "Update: игра 2048" 2>nul

REM Переименовываем ветку
git branch -M main 2>nul

REM Создаем репозиторий и пушим
echo Создание репозитория igra-2048 на GitHub...
gh repo create igra-2048 --public --source=. --remote=origin --push

if %errorlevel% equ 0 (
    echo.
    echo ==========================================
    echo УСПЕШНО СОЗДАН И ОТПРАВЛЕН НА GITHUB!
    echo ==========================================
    echo.
    git remote -v
    echo.
    echo Репозиторий доступен по адресу:
    gh repo view igra-2048 --web
) else (
    echo.
    echo Ошибка при создании репозитория.
    echo Возможно, репозиторий уже существует.
    echo.
    echo Пробуем добавить remote и запушить...
    git remote get-url origin >nul 2>&1
    if %errorlevel% neq 0 (
        echo Добавление remote...
        for /f "tokens=*" %%i in ('gh api user -q .login') do set USERNAME=%%i
        git remote add origin https://github.com/%USERNAME%/igra-2048.git 2>nul
    )
    git push -u origin main
    if %errorlevel% equ 0 (
        echo.
        echo ==========================================
        echo УСПЕШНО ОТПРАВЛЕНО НА GITHUB!
        echo ==========================================
    )
)

echo.
pause
