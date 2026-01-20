# Инструкция по отправке на GitHub

Проект готов к отправке на GitHub. Из-за проблем с кодировкой пути в PowerShell, выполните следующие команды вручную:

## Вариант 1: Через командную строку (cmd)

1. Откройте командную строку (cmd)
2. Перейдите в папку проекта:
   ```
   cd /d "C:\Users\Константин\Desktop\игра 2048"
   ```
3. Выполните команды:
   ```
   git init
   git config user.name "Константин"
   git config user.email "your-email@example.com"
   git add index.html style.css script.js README.md .gitignore push-to-github.bat setup-git.ps1
   git commit -m "Initial commit: игра 2048"
   ```

4. Создайте репозиторий на GitHub:
   - Перейдите на https://github.com/new
   - Назовите репозиторий (например: `igra-2048`)
   - НЕ добавляйте README или другие файлы

5. Подключите remote и отправьте:
   ```
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
   git branch -M main
   git push -u origin main
   ```

## Вариант 2: Через GitHub CLI (gh)

Если у вас установлен GitHub CLI:

1. Авторизуйтесь (если еще не сделали):
   ```
   gh auth login
   ```

2. Создайте репозиторий и отправьте:
   ```
   cd /d "C:\Users\Константин\Desktop\игра 2048"
   git init
   git config user.name "Константин"
   git config user.email "your-email@example.com"
   git add .
   git commit -m "Initial commit: игра 2048"
   gh repo create igra-2048 --public --source=. --remote=origin --push
   ```

## Вариант 3: Через GitHub Desktop

1. Откройте GitHub Desktop
2. File -> Add Local Repository
3. Выберите папку проекта
4. Нажмите "Publish repository"
5. Выберите название и создайте репозиторий

## Все файлы проекта готовы:
- ✅ index.html
- ✅ style.css  
- ✅ script.js
- ✅ README.md
- ✅ .gitignore

Проект полностью готов к отправке!
