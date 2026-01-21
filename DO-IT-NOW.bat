@echo off
chcp 65001 >nul
cd /d "%~dp0"

echo ==========================================
echo АВТОМАТИЧЕСКАЯ ОТПРАВКА НА GITHUB
echo ==========================================
echo.

REM Проверка авторизации
gh auth status >nul 2>&1
if %errorlevel% neq 0 (
    echo Запускаю авторизацию...
    echo Пожалуйста, авторизуйтесь в браузере
    echo.
    gh auth login --web --git-protocol https --scopes repo
    echo.
    echo Ожидание 10 секунд для завершения авторизации...
    timeout /t 10 /nobreak >nul
)

REM Проверяем еще раз
gh auth status >nul 2>&1
if %errorlevel% neq 0 (
    echo Ошибка: Авторизация не завершена
    echo Пожалуйста, выполните: gh auth login
    pause
    exit /b 1
)

echo GitHub CLI авторизован!
echo.

REM Подготовка
echo Подготовка репозитория...
git add . >nul 2>&1
git commit -m "Final: игра 2048" >nul 2>&1
git branch -M main >nul 2>&1

REM Создание репозитория
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
    echo Открываю репозиторий в браузере...
    gh repo view igra-2048 --web
) else (
    echo.
    echo Репозиторий уже существует или ошибка
    echo Пробую добавить remote и запушить...
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

echo.
pause
