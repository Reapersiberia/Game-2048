@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo ==========================================
echo Подготовка проекта для GitHub
echo ==========================================
echo.
echo Инициализация git репозитория...
if not exist .git git init
echo.
echo Настройка git config...
git config user.name "Константин" 2>nul
git config user.email "user@example.com" 2>nul
echo.
echo Добавление файлов в git...
git add index.html style.css script.js README.md .gitignore push-to-github.bat 2>nul
if %errorlevel% neq 0 (
    echo Попытка добавить все файлы...
    git add . 2>nul
)
echo.
echo Создание коммита...
git commit -m "Initial commit: игра 2048" 2>nul
if %errorlevel% neq 0 (
    echo Проверка статуса...
    git status
    echo.
    echo Если файлы уже закоммичены, продолжаем...
)
echo.
echo ==========================================
echo Репозиторий готов!
echo ==========================================
echo.
echo Теперь выполняется push на GitHub через gh CLI...
gh repo create "igra-2048" --public --source=. --remote=origin --push 2>nul
if %errorlevel% equ 0 (
    echo.
    echo ==========================================
    echo Успешно отправлено на GitHub!
    echo ==========================================
) else (
    echo.
    echo Не удалось автоматически отправить на GitHub.
    echo Возможно, нужно выполнить авторизацию:
    echo   gh auth login
    echo.
    echo Или выполните вручную:
    echo   1. Создайте репозиторий на https://github.com/new
    echo   2. git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
    echo   3. git branch -M main
    echo   4. git push -u origin main
)
echo.
git status
pause
