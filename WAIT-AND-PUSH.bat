@echo off
chcp 65001 >nul
cd /d "%~dp0"

echo ==========================================
echo ОЖИДАНИЕ АВТОРИЗАЦИИ И ОТПРАВКА НА GITHUB
echo ==========================================
echo.

REM Проверяем авторизацию
gh auth status >nul 2>&1
if %errorlevel% equ 0 (
    echo GitHub CLI уже авторизован!
    goto :create_repo
)

echo Запускаю авторизацию...
echo Откройте браузер и авторизуйтесь на GitHub
echo.
gh auth login --web --git-protocol https --scopes repo

echo.
echo Ожидание завершения авторизации...
timeout /t 5 /nobreak >nul

REM Ждем авторизации (проверяем каждые 5 секунд, максимум 3 минуты)
set /a attempts=0
set /a max_attempts=36

:check_auth
gh auth status >nul 2>&1
if %errorlevel% equ 0 (
    echo Авторизация успешна!
    goto :create_repo
)

set /a attempts+=1
if %attempts% geq %max_attempts% (
    echo.
    echo Авторизация не завершена за отведенное время.
    echo Пожалуйста, выполните: gh auth login
    pause
    exit /b 1
)

timeout /t 5 /nobreak >nul
echo Ожидание...
goto :check_auth

:create_repo
echo.
echo Подготовка репозитория...
git add . >nul 2>&1
git commit -m "Final: игра 2048" >nul 2>&1
git branch -M main >nul 2>&1

echo Создание репозитория igra-2048 на GitHub...
gh repo create igra-2048 --public --source=. --remote=origin --push

if %errorlevel% equ 0 (
    echo.
    echo ==========================================
    echo УСПЕШНО ОТПРАВЛЕНО НА GITHUB!
    echo ==========================================
    echo.
    git remote -v
    echo.
    gh repo view igra-2048 --web
) else (
    echo.
    echo Проверка существующего репозитория...
    gh repo view igra-2048 >nul 2>&1
    if %errorlevel% equ 0 (
        echo Репозиторий уже существует, добавляю remote...
        git remote get-url origin >nul 2>&1
        if %errorlevel% neq 0 (
            for /f "tokens=*" %%i in ('gh api user -q .login') do set USERNAME=%%i
            git remote add origin https://github.com/%USERNAME%/igra-2048.git
        )
        git push -u origin main
        if %errorlevel% equ 0 (
            echo.
            echo ==========================================
            echo УСПЕШНО ОТПРАВЛЕНО НА GITHUB!
            echo ==========================================
        )
    )
)

echo.
pause
