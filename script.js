// ============================================
// Game 2048 Logic
// ============================================

class Game2048 {
    constructor() {
        this.grid = [];
        this.score = 0;
        this.size = 4;
        this.gridContainer = document.getElementById('grid');
        this.scoreElement = document.getElementById('score');
        this.gameOverElement = document.getElementById('game-over');
        this.currentElement = 'normal';
        this.lastElement = 'normal';
        
        // Система стихий покемонов ПО ОЧКАМ (score) - до 100к+
        // Стихия меняется когда игрок набирает определенное количество очков
        this.scoreElements = [
            // Starting elements (0 - 5000)
            { type: 'normal',   minScore: 0,      name: 'Normal ⭐',    color: '#A8A878', emoji: '⭐', desc: 'The journey begins' },
            { type: 'fire',     minScore: 100,    name: 'Fire 🔥',      color: '#F08030', emoji: '🔥', desc: 'Fire awakens!' },
            { type: 'water',    minScore: 300,    name: 'Water 💧',     color: '#6890F0', emoji: '💧', desc: 'Water power!' },
            { type: 'electric', minScore: 600,    name: 'Electric ⚡',  color: '#F8D030', emoji: '⚡', desc: 'Lightning strikes!' },
            { type: 'grass',    minScore: 1000,   name: 'Grass 🌿',     color: '#78C850', emoji: '🌿', desc: 'Nature is with you!' },
            { type: 'poison',   minScore: 1500,   name: 'Poison ☠️',    color: '#A040A0', emoji: '☠️', desc: 'Toxic power!' },
            { type: 'ground',   minScore: 2000,   name: 'Ground 🌍',    color: '#E0C068', emoji: '🌍', desc: 'Earth shakes!' },
            
            // Mid elements (2500 - 15000)
            { type: 'flying',   minScore: 2500,   name: 'Flying 🦅',    color: '#A890F0', emoji: '🦅', desc: 'Soaring higher!' },
            { type: 'bug',      minScore: 3500,   name: 'Bug 🐛',       color: '#A8B820', emoji: '🐛', desc: 'Swarm attacks!' },
            { type: 'rock',     minScore: 5000,   name: 'Rock 🪨',      color: '#B8A038', emoji: '🪨', desc: 'Solid as rock!' },
            { type: 'ice',      minScore: 7000,   name: 'Ice ❄️',       color: '#98D8D8', emoji: '❄️', desc: 'Ice storm!' },
            { type: 'fighting', minScore: 10000,  name: 'Fighting 🥊',  color: '#C03028', emoji: '🥊', desc: 'Fighting spirit!' },
            { type: 'psychic',  minScore: 15000,  name: 'Psychic 🔮',   color: '#F85888', emoji: '🔮', desc: 'Mind power!' },
            
            // Advanced elements (20000 - 50000)
            { type: 'ghost',    minScore: 20000,  name: 'Ghost 👻',     color: '#705898', emoji: '👻', desc: 'Phantom force!' },
            { type: 'dark',     minScore: 25000,  name: 'Dark 🌑',      color: '#705848', emoji: '🌑', desc: 'Darkness consumes!' },
            { type: 'steel',    minScore: 30000,  name: 'Steel ⚔️',     color: '#B8B8D0', emoji: '⚔️', desc: 'Iron will!' },
            { type: 'fairy',    minScore: 40000,  name: 'Fairy 🧚',     color: '#EE99AC', emoji: '🧚', desc: 'Fairy magic!' },
            { type: 'dragon',   minScore: 50000,  name: 'Dragon 🐉',    color: '#7038F8', emoji: '🐉', desc: 'Dragon fury!' },
            
            // Legendary elements (60000 - 100000+)
            { type: 'cosmic',   minScore: 60000,  name: 'Cosmic 🌌',    color: '#3D1A78', emoji: '🌌', desc: 'Cosmic power!' },
            { type: 'shadow',   minScore: 75000,  name: 'Shadow 🖤',    color: '#1A1A2E', emoji: '🖤', desc: 'Shadow lord!' },
            { type: 'legendary', minScore: 100000, name: 'Legendary ✨', color: '#FFD700', emoji: '✨', desc: 'LEGEND AWAKENED!' }
        ];
        
        // Маппинг чисел на ID покемонов (будет меняться в зависимости от стихии)
        this.pokemonMap = {
            2: 16, 4: 39, 8: 52, 16: 133, 32: 19, 64: 20, 128: 21, 256: 22, 512: 35, 1024: 36, 2048: 143
        };
        
        // Покемоны по стихиям для плиток (расширенный список)
        this.elementPokemon = {
            normal:    { 2: 16, 4: 39, 8: 52, 16: 133, 32: 19, 64: 20, 128: 21, 256: 22, 512: 35, 1024: 36, 2048: 143 },
            fire:      { 2: 4, 4: 5, 8: 6, 16: 37, 32: 38, 64: 77, 128: 78, 256: 126, 512: 136, 1024: 250, 2048: 146 },
            water:     { 2: 7, 4: 8, 8: 9, 16: 54, 32: 55, 64: 60, 128: 61, 256: 62, 512: 134, 1024: 130, 2048: 249 },
            electric:  { 2: 25, 4: 26, 8: 81, 16: 82, 32: 100, 64: 101, 128: 125, 256: 135, 512: 145, 1024: 243, 2048: 310 },
            grass:     { 2: 1, 4: 2, 8: 3, 16: 43, 32: 44, 64: 45, 128: 69, 256: 70, 512: 71, 1024: 114, 2048: 251 },
            poison:    { 2: 23, 4: 24, 8: 29, 16: 30, 32: 31, 64: 41, 128: 42, 256: 88, 512: 89, 1024: 110, 2048: 169 },
            ground:    { 2: 27, 4: 28, 8: 50, 16: 51, 32: 104, 64: 105, 128: 111, 256: 112, 512: 231, 1024: 232, 2048: 383 },
            flying:    { 2: 16, 4: 17, 8: 18, 16: 21, 32: 22, 64: 83, 128: 84, 256: 85, 512: 142, 1024: 227, 2048: 250 },
            bug:       { 2: 10, 4: 11, 8: 12, 16: 13, 32: 14, 64: 15, 128: 46, 256: 47, 512: 48, 1024: 49, 2048: 212 },
            rock:      { 2: 74, 4: 75, 8: 76, 16: 95, 32: 111, 64: 112, 128: 138, 256: 139, 512: 140, 1024: 141, 2048: 142 },
            ice:       { 2: 87, 4: 91, 8: 124, 16: 131, 32: 144, 64: 215, 128: 220, 256: 221, 512: 361, 1024: 362, 2048: 378 },
            fighting:  { 2: 56, 4: 57, 8: 66, 16: 67, 32: 68, 64: 106, 128: 107, 256: 236, 512: 237, 1024: 286, 2048: 448 },
            psychic:   { 2: 63, 4: 64, 8: 65, 16: 79, 32: 80, 64: 96, 128: 97, 256: 122, 512: 196, 1024: 150, 2048: 151 },
            ghost:     { 2: 92, 4: 93, 8: 94, 16: 200, 32: 353, 64: 354, 128: 355, 256: 356, 512: 426, 1024: 477, 2048: 487 },
            dark:      { 2: 197, 4: 198, 8: 215, 16: 228, 32: 229, 64: 261, 128: 262, 256: 302, 512: 359, 1024: 430, 2048: 491 },
            steel:     { 2: 81, 4: 82, 8: 205, 16: 208, 32: 212, 64: 227, 128: 303, 256: 305, 512: 379, 1024: 385, 2048: 483 },
            fairy:     { 2: 35, 4: 36, 8: 39, 16: 40, 32: 173, 64: 174, 128: 175, 256: 176, 512: 183, 1024: 184, 2048: 282 },
            dragon:    { 2: 147, 4: 148, 8: 149, 16: 329, 32: 330, 64: 334, 128: 371, 256: 372, 512: 373, 1024: 384, 2048: 483 },
            cosmic:    { 2: 120, 4: 121, 8: 137, 16: 233, 32: 234, 64: 343, 128: 344, 256: 374, 512: 375, 1024: 376, 2048: 382 },
            shadow:    { 2: 302, 4: 353, 8: 354, 16: 355, 32: 356, 64: 477, 128: 478, 256: 479, 512: 487, 1024: 491, 2048: 493 },
            legendary: { 2: 144, 4: 145, 8: 146, 16: 150, 32: 151, 64: 249, 128: 250, 256: 251, 512: 382, 1024: 383, 2048: 384 }
        };
        
        this.init();
    }
    
    // Получить текущую стихию по очкам
    getCurrentElement() {
        let currentElement = this.scoreElements[0];
        for (const element of this.scoreElements) {
            if (this.score >= element.minScore) {
                currentElement = element;
            }
        }
        return currentElement;
    }
    
    // Проверить и обновить стихию (вызывается при изменении очков)
    updateElement() {
        const element = this.getCurrentElement();
        if (element.type !== this.currentElement) {
            this.lastElement = this.currentElement;
            this.currentElement = element.type;
            
            // Показываем уведомление о смене стихии
            this.showElementChange(element);
            
            // Обновляем покемонов для новой стихии
            this.pokemonMap = this.elementPokemon[element.type];
            
            // Проверяем достижения за стихии (только в реальной игре, не в тесте!)
            if (window.achievementSystem && !window.isTestMode) {
                window.achievementSystem.checkElementAchievement(element.type);
            }
        }
        
        return element;
    }
    
    // Показать анимацию смены стихии
    showElementChange(element) {
        // Создаём уведомление
        const notification = document.createElement('div');
        notification.className = 'element-notification';
        notification.innerHTML = `
            <div class="element-notification-content element-${element.type}">
                <span class="element-notification-emoji">${element.emoji}</span>
                <span class="element-notification-text">${element.name}</span>
                <span class="element-notification-score">${element.minScore}+ points!</span>
            </div>
        `;
        document.body.appendChild(notification);
        
        // Удаляем через 2 секунды
        setTimeout(() => {
            notification.classList.add('fade-out');
            setTimeout(() => notification.remove(), 500);
        }, 2000);
        
        console.log(`🎉 Element changed to ${element.name}!`);
    }

    init() {
        this.createGrid();
        this.newGame();
        this.setupEventListeners();
    }

    createGrid() {
        this.gridContainer.innerHTML = '';
        for (let i = 0; i < this.size * this.size; i++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            this.gridContainer.appendChild(cell);
        }
    }

    newGame() {
        // Сбрасываем тестовый режим
        window.isTestMode = false;
        
        // Очищаем сохранённые данные теста
        this._savedGrid = null;
        this._savedScore = null;
        
        // Скрываем подсказку тестового режима
        const hint = document.getElementById('test-mode-hint');
        if (hint) hint.style.display = 'none';
        
        // Сбрасываем текущую стихию на Normal
        this.currentElement = 'normal';
        this.pokemonMap = this.elementPokemon['normal'];
        
        
        // Начинаем новую игру с нуля
        this.grid = Array(this.size).fill().map(() => Array(this.size).fill(0));
        this.score = 0;
        this.updateScore();
        this.gameOverElement.classList.remove('show');
        this.addRandomTile();
        this.addRandomTile();
        this.updateDisplay();
    }

    addRandomTile() {
        const emptyCells = [];
        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                if (this.grid[i][j] === 0) {
                    emptyCells.push({ row: i, col: j });
                }
            }
        }
        if (emptyCells.length > 0) {
            const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
            const newTile = Math.random() < 0.9 ? 2 : 4;
            this.grid[randomCell.row][randomCell.col] = newTile;
            
            // Lucky 4 achievement
            if (newTile === 4 && window.achievementSystem) {
                window.achievementSystem.checkLucky4Spawn();
            }
            
            // Grid Survivor achievement: track if grid was 90%+ full (14+ tiles = 2 or fewer empty)
            if (emptyCells.length <= 2 && window.achievementSystem) {
                window.achievementSystem.trackGridFull();
            }
        }
    }

    move(direction) {
        // Блокируем быстрые последовательные ходы (debounce)
        if (this._moveInProgress) return;
        this._moveInProgress = true;
        
        const prevGrid = this.grid.map(row => [...row]);
        let moved = false;

        if (direction === 'up' || direction === 'down') {
            for (let col = 0; col < this.size; col++) {
                const column = [];
                for (let row = 0; row < this.size; row++) {
                    column.push(this.grid[row][col]);
                }
                const newColumn = direction === 'up' ? this.moveLine(column) : this.moveLine(column.reverse()).reverse();
                for (let row = 0; row < this.size; row++) {
                    if (this.grid[row][col] !== newColumn[row]) {
                        moved = true;
                    }
                    this.grid[row][col] = newColumn[row];
                }
            }
        } else {
            for (let row = 0; row < this.size; row++) {
                const line = [...this.grid[row]];
                const newLine = direction === 'left' ? this.moveLine(line) : this.moveLine(line.reverse()).reverse();
                for (let col = 0; col < this.size; col++) {
                    if (this.grid[row][col] !== newLine[col]) {
                        moved = true;
                    }
                }
                this.grid[row] = newLine;
            }
        }

        if (moved) {
            // Регистрируем ход для достижений
            if (window.achievementSystem) {
                window.achievementSystem.registerMove();
            }
            
            this.addRandomTile();
            
            // Обновляем дисплей синхронно для мгновенного отклика
            this.updateDisplay();
            
            // Проверяем game over асинхронно чтобы не блокировать UI
            requestAnimationFrame(() => {
                if (this.isGameOver()) {
                    this.gameOverElement.classList.add('show');
                    
                    // Сохраняем результат в лидерборд
                    if (window.leaderboardSystem && this.score > 0) {
                        const currentElement = this.getCurrentElement();
                        window.leaderboardSystem.addEntry(this.score, currentElement.type);
                    }
                    
                    // Начисляем XP за игру!
                    if (window.menuSystem && this.score > 0) {
                        window.menuSystem.awardGameXP(this.score);
                    }
                    
                    // Засчитываем завершённую игру для достижений
                    if (window.achievementSystem) {
                        window.achievementSystem.registerNewGame();
                    }
                }
            });
            
            // Быстрая разблокировка - 16ms (один кадр при 60fps)
            this._moveInProgress = false;
        } else {
            // Если не было движения — сразу разблокируем
            this._moveInProgress = false;
        }
    }

    moveLine(line) {
        const filtered = line.filter(val => val !== 0);
        const merged = [];
        let mergeCount = 0;
        
        for (let i = 0; i < filtered.length; i++) {
            if (i < filtered.length - 1 && filtered[i] === filtered[i + 1]) {
                const newValue = filtered[i] * 2;
                merged.push(newValue);
                this.score += newValue;
                mergeCount++;
                
                // Проверяем достижения за плитки
                if (window.achievementSystem) {
                    window.achievementSystem.checkTileAchievements(newValue);
                }
                
                i++;
            } else {
                merged.push(filtered[i]);
            }
        }
        
        // Регистрируем слияния для достижений
        if (mergeCount > 0 && window.achievementSystem) {
            window.achievementSystem.registerMerge(mergeCount);
        }
        
        while (merged.length < this.size) {
            merged.push(0);
        }
        this.updateScore();
        return merged;
    }

    updateScore() {
        this.scoreElement.textContent = this.score;
        // Проверяем смену стихии при изменении очков
        this.updateElement();
        
        // Проверяем достижения за очки
        if (window.achievementSystem) {
            window.achievementSystem.checkScoreAchievements(this.score);
            window.achievementSystem.checkQuickStart(this.score);
        }
    }

    getPokemonSpriteUrl(pokemonId) {
        // Используем анимированные спрайты из PokeAPI
        return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/${pokemonId}.gif`;
    }
    
    getPokemonIdForValue(value) {
        // Берём покемона из текущей стихии по текущему счёту
        const currentType = this.getCurrentElement().type;
        const elementPokemon = this.elementPokemon[currentType];
        if (elementPokemon && elementPokemon[value]) {
            return elementPokemon[value];
        }
        // Fallback - берём ближайшее значение
        const keys = Object.keys(elementPokemon || {}).map(Number).sort((a, b) => a - b);
        for (let i = keys.length - 1; i >= 0; i--) {
            if (value >= keys[i]) {
                return elementPokemon[keys[i]];
            }
        }
        return elementPokemon ? elementPokemon[2] : 25; // Pikachu по умолчанию
    }

    updateDisplay() {
        // Кэшируем размер ячейки (вычисляем только если не кэширован или изменился размер)
        const currentWidth = this.gridContainer.offsetWidth;
        if (!this._cellSize || this._lastWidth !== currentWidth) {
            this._lastWidth = currentWidth;
            this._cellSize = (currentWidth - 40) / this.size;
            // При изменении размера сбрасываем кэш
            this._gridCache = null;
        }
        const cellSize = this._cellSize;
        
        // Получаем ТЕКУЩУЮ стихию по очкам (одна для всех плиток)
        const currentElement = this.getCurrentElement();
        
        // Проверка на мобильное устройство для упрощённого рендеринга
        const isMobile = window.innerWidth <= 500;
        
        // Создаем ключ текущего состояния для проверки изменений
        const gridKey = this.grid.map(row => row.join(',')).join('|') + '|' + currentElement.type;
        
        // Если состояние не изменилось - пропускаем рендеринг
        if (this._gridCache === gridKey) {
            return;
        }
        this._gridCache = gridKey;
        
        // Обновляем класс контейнера для общего стиля
        const newClassName = `grid-container element-theme-${currentElement.type}`;
        if (this.gridContainer.className !== newClassName) {
            this.gridContainer.className = newClassName;
        }
        
        // Используем DocumentFragment для batch DOM операций
        const fragment = document.createDocumentFragment();
        
        // Очищаем контейнер
        this.gridContainer.innerHTML = '';
        
        // Создаём ячейки
        const cellClassName = `cell cell-${currentElement.type}`;
        for (let i = 0; i < this.size * this.size; i++) {
            const cell = document.createElement('div');
            cell.className = cellClassName;
            fragment.appendChild(cell);
        }

        // Создаём тайлы
        for (let row = 0; row < this.size; row++) {
            for (let col = 0; col < this.size; col++) {
                const value = this.grid[row][col];
                if (value !== 0) {
                    const tile = document.createElement('div');
                    
                    // ВСЕ плитки используют ТЕКУЩУЮ стихию по очкам
                    tile.className = `tile tile-${value} element-${currentElement.type}`;
                    
                    // Получаем ID покемона для этого числа (из текущей стихии)
                    const pokemonId = this.getPokemonIdForValue(value);
                    const spriteUrl = this.getPokemonSpriteUrl(pokemonId);
                    
                    // Создаем изображение покемона
                    const pokemonImg = document.createElement('img');
                    pokemonImg.src = spriteUrl;
                    pokemonImg.className = 'pokemon-sprite';
                    pokemonImg.alt = '';
                    pokemonImg.loading = 'eager'; // Загружаем сразу для плавности
                    pokemonImg.decoding = 'async'; // Асинхронное декодирование
                    
                    // Fallback для ошибок загрузки
                    const staticUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonId}.png`;
                    pokemonImg.onerror = function() {
                        if (this.src !== staticUrl) {
                            this.src = staticUrl;
                        }
                    };
                    
                    tile.appendChild(pokemonImg);
                    
                    // Добавляем эффект частиц только на десктопе
                    if (!isMobile && currentElement.type !== 'normal') {
                        const particles = document.createElement('div');
                        particles.className = `element-particles particles-${currentElement.type}`;
                        tile.appendChild(particles);
                    }
                    
                    // Цифра (форматируем большие числа)
                    const numberLabel = document.createElement('div');
                    numberLabel.className = 'tile-number';
                    
                    // Форматирование чисел на плитках
                    let displayValue = value;
                    if (value >= 100000) {
                        displayValue = (value / 1000) + 'K';
                        numberLabel.classList.add('tile-number-100k');
                    } else if (value >= 10000) {
                        displayValue = (value / 1000) + 'K';
                        numberLabel.classList.add('tile-number-10k');
                    } else if (value >= 1000) {
                        displayValue = value;
                        numberLabel.classList.add('tile-number-1k');
                    }
                    numberLabel.textContent = displayValue;
                    tile.appendChild(numberLabel);
                    
                    // Бейдж стихии только на десктопе
                    if (!isMobile && currentElement.type !== 'normal') {
                        const elementBadge = document.createElement('div');
                        elementBadge.className = 'element-badge';
                        elementBadge.textContent = currentElement.emoji;
                        tile.appendChild(elementBadge);
                    }
                    
                    // Позиционирование плитки
                    tile.style.width = `${cellSize}px`;
                    tile.style.height = `${cellSize}px`;
                    tile.style.top = `${10 + row * (cellSize + 10)}px`;
                    tile.style.left = `${10 + col * (cellSize + 10)}px`;
                    
                    fragment.appendChild(tile);
                }
            }
        }
        
        // Одна DOM-операция вместо множества
        this.gridContainer.appendChild(fragment);
        
        // Обновляем индикатор стихии
        this.updateElementIndicator(currentElement);
    }
    
    // Обновить индикатор текущей стихии
    updateElementIndicator(element) {
        const indicator = document.getElementById('element-indicator');
        if (indicator) {
            indicator.className = `element-indicator element-indicator-${element.type}`;
            indicator.textContent = `${element.emoji} ${element.type.toUpperCase()}`;
        }
    }
    
    // Эмодзи для стихий
    getElementEmoji(elementType) {
        const emojis = {
            normal: '⭐',
            fire: '🔥',
            water: '💧',
            electric: '⚡',
            grass: '🌿',
            ice: '❄️',
            rock: '🪨',
            psychic: '🔮',
            dragon: '🐉'
        };
        return emojis[elementType] || '⭐';
    }

    isGameOver() {
        for (let row = 0; row < this.size; row++) {
            for (let col = 0; col < this.size; col++) {
                if (this.grid[row][col] === 0) {
                    return false;
                }
                if (col < this.size - 1 && this.grid[row][col] === this.grid[row][col + 1]) {
                    return false;
                }
                if (row < this.size - 1 && this.grid[row][col] === this.grid[row + 1][col]) {
                    return false;
                }
            }
        }
        return true;
    }

    setupEventListeners() {
        document.addEventListener('keydown', (e) => {
            switch(e.key) {
                case 'ArrowUp':
                    e.preventDefault();
                    this.move('up');
                    break;
                case 'ArrowDown':
                    e.preventDefault();
                    this.move('down');
                    break;
                case 'ArrowLeft':
                    e.preventDefault();
                    this.move('left');
                    break;
                case 'ArrowRight':
                    e.preventDefault();
                    this.move('right');
                    break;
            }
        });

        // Touch/swipe для мобильных - ОПТИМИЗИРОВАНО для Android и iOS
        const gameContainer = document.querySelector('.game-container');
        const SWIPE_THRESHOLD = 30; // Уменьшен порог для быстрой реакции
        const SWIPE_MAX_TIME = 300; // Максимальное время свайпа (мс)
        let touchStartX = null, touchStartY = null;
        let touchStartTime = null;
        let swipeProcessed = false;

        const onTouchStart = (e) => {
            if (e.touches.length !== 1) return;
            const touch = e.touches[0];
            touchStartX = touch.clientX;
            touchStartY = touch.clientY;
            touchStartTime = performance.now();
            swipeProcessed = false;
        };

        const onTouchMove = (e) => {
            if (touchStartX == null || swipeProcessed) return;
            
            const touch = e.touches[0];
            const diffX = touchStartX - touch.clientX;
            const diffY = touchStartY - touch.clientY;
            const absX = Math.abs(diffX);
            const absY = Math.abs(diffY);
            
            // Блокируем скролл страницы при начале свайпа
            if (absX > 10 || absY > 10) {
                e.preventDefault();
            }
            
            // Быстрое распознавание свайпа во время движения
            if (absX > SWIPE_THRESHOLD || absY > SWIPE_THRESHOLD) {
                swipeProcessed = true;
                if (absX > absY) {
                    this.move(diffX > 0 ? 'left' : 'right');
                } else {
                    this.move(diffY > 0 ? 'up' : 'down');
                }
                touchStartX = null;
                touchStartY = null;
            }
        };

        const onTouchEnd = (e) => {
            if (touchStartX == null || touchStartY == null || swipeProcessed) {
                touchStartX = null;
                touchStartY = null;
                return;
            }
            
            if (!e.changedTouches?.length) return;
            
            const touchEndTime = performance.now();
            const touchDuration = touchEndTime - touchStartTime;
            
            // Игнорируем слишком долгие касания
            if (touchDuration > SWIPE_MAX_TIME) {
                touchStartX = null;
                touchStartY = null;
                return;
            }
            
            const touch = e.changedTouches[0];
            const diffX = touchStartX - touch.clientX;
            const diffY = touchStartY - touch.clientY;
            const absX = Math.abs(diffX);
            const absY = Math.abs(diffY);

            // Минимальный порог для быстрых свайпов
            const minThreshold = Math.max(15, SWIPE_THRESHOLD - (SWIPE_MAX_TIME - touchDuration) / 20);
            
            if (absX < minThreshold && absY < minThreshold) {
                touchStartX = null;
                touchStartY = null;
                return;
            }

            if (absX > absY) {
                this.move(diffX > 0 ? 'left' : 'right');
            } else {
                this.move(diffY > 0 ? 'up' : 'down');
            }
            touchStartX = null;
            touchStartY = null;
        };

        const onTouchCancel = () => {
            touchStartX = null;
            touchStartY = null;
            swipeProcessed = false;
        };

        if (gameContainer) {
            // passive: false обязателен для iOS Safari чтобы работал preventDefault
            gameContainer.addEventListener('touchstart', onTouchStart, { passive: false });
            gameContainer.addEventListener('touchmove', onTouchMove, { passive: false });
            gameContainer.addEventListener('touchend', onTouchEnd, { passive: false });
            gameContainer.addEventListener('touchcancel', onTouchCancel, { passive: true });
        }
    }
}

// Initialize game
window.game = new Game2048();

// ============================================
// Подсказка прокрутки для мобильных
// ============================================
(function initScrollHint() {
    const scrollHint = document.getElementById('scroll-hint');
    if (!scrollHint) return;
    
    let hintHidden = false;
    
    function hideHint() {
        if (hintHidden) return;
        hintHidden = true;
        scrollHint.classList.add('hide');
        setTimeout(() => {
            scrollHint.style.display = 'none';
        }, 500);
    }
    
    // Скрыть при прокрутке
    window.addEventListener('scroll', function onScroll() {
        if (window.scrollY > 50) {
            hideHint();
            window.removeEventListener('scroll', onScroll);
        }
    }, { passive: true });
    
    // Скрыть по клику/тапу
    scrollHint.addEventListener('click', () => {
        hideHint();
        // Плавно прокрутить к покемонам
        const motivator = document.querySelector('.motivator-container');
        if (motivator) {
            motivator.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    });
    
    // Автоматически скрыть через 15 секунд
    setTimeout(hideHint, 15000);
})();

// ============================================
// Тестирование стихий ПО ОЧКАМ
// ============================================

let testElementIndex = 0;

// Test scores for each element (22 elements up to 100k+)
const testScores = [
    // Starting (0 - 5000)
    { score: 0,      name: '⭐ Normal',    emoji: '⭐',  desc: 'Begin!' },
    { score: 100,    name: '🔥 Fire',      emoji: '🔥',  desc: 'Fire!' },
    { score: 300,    name: '💧 Water',     emoji: '💧',  desc: 'Water!' },
    { score: 600,    name: '⚡ Electric',  emoji: '⚡',  desc: 'Thunder!' },
    { score: 1000,   name: '🌿 Grass',     emoji: '🌿',  desc: 'Nature!' },
    { score: 1500,   name: '☠️ Poison',    emoji: '☠️',  desc: 'Toxic!' },
    { score: 2000,   name: '🌍 Ground',    emoji: '🌍',  desc: 'Earth!' },
    
    // Mid (2500 - 15000)
    { score: 2500,   name: '🦅 Flying',    emoji: '🦅',  desc: 'Flight!' },
    { score: 3500,   name: '🐛 Bug',       emoji: '🐛',  desc: 'Swarm!' },
    { score: 5000,   name: '🪨 Rock',      emoji: '🪨',  desc: 'Rock!' },
    { score: 7000,   name: '❄️ Ice',       emoji: '❄️',  desc: 'Ice!' },
    { score: 10000,  name: '🥊 Fighting',  emoji: '🥊',  desc: 'Fight!' },
    { score: 15000,  name: '🔮 Psychic',   emoji: '🔮',  desc: 'Mind!' },
    
    // Advanced (20000 - 50000)
    { score: 20000,  name: '👻 Ghost',     emoji: '👻',  desc: 'Phantom!' },
    { score: 25000,  name: '🌑 Dark',      emoji: '🌑',  desc: 'Dark!' },
    { score: 30000,  name: '⚔️ Steel',     emoji: '⚔️',  desc: 'Steel!' },
    { score: 40000,  name: '🧚 Fairy',     emoji: '🧚',  desc: 'Fairy!' },
    { score: 50000,  name: '🐉 Dragon',    emoji: '🐉',  desc: 'Dragon!' },
    
    // Legendary (60000 - 100000+)
    { score: 60000,  name: '🌌 Cosmic',    emoji: '🌌',  desc: 'Cosmic!' },
    { score: 75000,  name: '🖤 Shadow',    emoji: '🖤',  desc: 'Shadow!' },
    { score: 100000, name: '✨ Legendary', emoji: '✨',  desc: 'LEGEND!' }
];

// Флаг тестового режима (превью стихий)
window.isTestMode = false;

function testElements() {
    try {
        const testData = testScores[testElementIndex];
        
        // Включаем тестовый режим
        window.isTestMode = true;
        
        // Устанавливаем тестовые плитки для демонстрации
        window.game.grid = [
            [2, 4, 8, 16],
            [32, 64, 128, 256],
            [512, 1024, 2048, 0],
            [0, 0, 0, 0]
        ];
        
        // Устанавливаем очки для нужной стихии (только для отображения)
        window.game.score = testData.score;
        window.game.scoreElement.textContent = testData.score.toLocaleString();
        window.game.updateElement();
        
        // ВАЖНО: Сбрасываем кэш чтобы отобразить новых покемонов
        window.game._gridCache = null;
        window.game.updateDisplay();
        
        // Показываем уведомление о стихии
        if (typeof showStatus === 'function') {
            showStatus('👁️ PREVIEW: ' + testData.emoji + ' ' + testData.name + ' (' + testData.score.toLocaleString() + '+ pts) • No achievements!', 'success');
        }
        
        // Показываем подсказку
        let hint = document.getElementById('test-mode-hint');
        if (!hint) {
            hint = document.createElement('div');
            hint.id = 'test-mode-hint';
            hint.className = 'test-mode-hint';
            hint.innerHTML = '👁️ PREVIEW MODE • No achievements earned! • Press <strong>New Game</strong> to play!';
            const container = document.querySelector('.container');
            if (container) {
                const gameContainer = container.querySelector('.game-container');
                if (gameContainer) {
                    container.insertBefore(hint, gameContainer);
                }
            }
        }
        if (hint) hint.style.display = 'block';
        
        // Переходим к следующей стихии
        testElementIndex = (testElementIndex + 1) % testScores.length;
        
        console.log('Test element:', testData.name);
    } catch (e) {
        console.error('testElements error:', e);
    }
}

window.testElements = testElements;

// ============================================
// Система локализации
// ============================================

const localization = {
    currentLang: 'en',
    
    languages: {
        en: { name: 'English', flag: '🇬🇧', code: 'EN' },
        es: { name: 'Español', flag: '🇪🇸', code: 'ES' },
        de: { name: 'Deutsch', flag: '🇩🇪', code: 'DE' },
        fr: { name: 'Français', flag: '🇫🇷', code: 'FR' },
        pt: { name: 'Português', flag: '🇧🇷', code: 'PT' },
        it: { name: 'Italiano', flag: '🇮🇹', code: 'IT' },
        ja: { name: '日本語', flag: '🇯🇵', code: 'JA' },
        ko: { name: '한국어', flag: '🇰🇷', code: 'KO' },
        zh: { name: '中文', flag: '🇨🇳', code: 'ZH' },
        pl: { name: 'Polski', flag: '🇵🇱', code: 'PL' },
        tr: { name: 'Türkçe', flag: '🇹🇷', code: 'TR' },
        ar: { name: 'العربية', flag: '🇸🇦', code: 'AR' },
        hi: { name: 'हिन्दी', flag: '🇮🇳', code: 'HI' },
        nl: { name: 'Nederlands', flag: '🇳🇱', code: 'NL' }
    },

    // Фразы на всех языках
    phrases: {
        // ===== РУССКИЙ =====
        ru: {
            starter: [
                "Начни играть! 🎮",
                "Давай! Ты сможешь!",
                "Го-го-го! 💪",
                "Удачи тебе!",
                "Верю в тебя!",
                "Жги! 🔥"
            ],
            level1: [
                "100 очков! Неплохо! 👍",
                "Разогрев! Давай дальше!",
                "Первая сотня - легко!",
                "Молодец! Продолжай!",
                "Хороший старт! 🌟",
                "Это только начало!",
                "Вперёд к победе!",
                "Отличный темп!"
            ],
            level2: [
                "250! Ты в ударе! 💥",
                "Супер играешь!",
                "Вау! Так держать!",
                "Мощно! Не останавливайся!",
                "Красава! 🌈",
                "Огонь! 🔥🔥",
                "Круто идёшь!",
                "Уже 250+! Респект!"
            ],
            level3: [
                "500! Мастер! 🏆",
                "Полтысячи! Легенда!",
                "Бог игры! 👑",
                "Нереально круто!",
                "Ты машина! 🤖",
                "Impossible! 💫",
                "Элита! 🌟🌟",
                "Pro gamer alert!",
                "Непобедим!"
            ],
            level4: [
                "1000!!! ЛЕГЕНДА! 👑👑",
                "Тысяча! Это база!",
                "Ультра скилл! 🚀",
                "Топ-1 материал!",
                "GG! Ты лучший!",
                "Мега-мозг! 🧠",
                "1К+ Красавчик!",
                "Абсолют! 💎",
                "Гений 2048!"
            ],
            level5: [
                "2000! БОЖЕСТВО! ⚡",
                "Киберспорт? 🎯",
                "Нечеловеческий скилл!",
                "MVP! MVP! MVP!",
                "Ты сломал игру! 😱",
                "Читер? Не, просто бог!",
                "2К+ Это нереально!",
                "Телепат! 🔮",
                "Матрица взломана!"
            ],
            legendary: [
                "5000!!! СОЗДАТЕЛЬ! 🌌",
                "Ты... ты кто?! 😲",
                "Это вообще законно?!",
                "Бог 2048 спустился!",
                "Легендарный! 🐉",
                "Запредельно!",
                "Мифический уровень!",
                "Космос! 🚀🌟",
                "Ты изменил реальность!"
            ],
            god: [
                "10000!!! ТЫ СОЗДАЛ ВСЕЛЕННУЮ! 🌌✨",
                "Поклоняюсь тебе! 🙇",
                "Это невозможно... но ты смог!",
                "Ты переписал законы физики!",
                "Новая эра 2048! 👑💎",
                "Божественный уровень!",
                "Альфа и Омега!",
                "За пределами понимания!",
                "Ты сам стал 2048! 🔥🔥🔥"
            ]
        },

        // ===== ENGLISH =====
        en: {
            starter: [
                "Start playing! 🎮",
                "You got this!",
                "Let's go! 💪",
                "Good luck!",
                "I believe in you!",
                "Let's rock! 🔥"
            ],
            level1: [
                "100 points! Nice! 👍",
                "Warming up! Keep going!",
                "First hundred - easy!",
                "Great job! Continue!",
                "Good start! 🌟",
                "This is just the beginning!",
                "Onwards to victory!",
                "Great pace!"
            ],
            level2: [
                "250! You're on fire! 💥",
                "Playing great!",
                "Wow! Keep it up!",
                "Powerful! Don't stop!",
                "Awesome! 🌈",
                "Fire! 🔥🔥",
                "Going strong!",
                "Already 250+! Respect!"
            ],
            level3: [
                "500! Master! 🏆",
                "Half a thousand! Legend!",
                "Gaming god! 👑",
                "Incredibly cool!",
                "You're a machine! 🤖",
                "Impossible! 💫",
                "Elite! 🌟🌟",
                "Pro gamer alert!",
                "Invincible!"
            ],
            level4: [
                "1000!!! LEGEND! 👑👑",
                "One thousand! That's based!",
                "Ultra skill! 🚀",
                "Top-1 material!",
                "GG! You're the best!",
                "Mega brain! 🧠",
                "1K+ Champion!",
                "Absolute! 💎",
                "2048 Genius!"
            ],
            level5: [
                "2000! DEITY! ⚡",
                "Esports? 🎯",
                "Inhuman skill!",
                "MVP! MVP! MVP!",
                "You broke the game! 😱",
                "Cheater? No, just a god!",
                "2K+ Unreal!",
                "Telepath! 🔮",
                "Matrix hacked!"
            ],
            legendary: [
                "5000!!! CREATOR! 🌌",
                "Who... are you?! 😲",
                "Is this even legal?!",
                "The 2048 God descended!",
                "Legendary! 🐉",
                "Beyond limits!",
                "Mythical level!",
                "Cosmic! 🚀🌟",
                "You changed reality!"
            ],
            god: [
                "10000!!! YOU CREATED THE UNIVERSE! 🌌✨",
                "I bow to you! 🙇",
                "This is impossible... but you did it!",
                "You rewrote physics!",
                "New era of 2048! 👑💎",
                "Divine level!",
                "Alpha and Omega!",
                "Beyond comprehension!",
                "You became 2048! 🔥🔥🔥"
            ]
        },

        // ===== ESPAÑOL =====
        es: {
            starter: [
                "¡A jugar! 🎮",
                "¡Tú puedes!",
                "¡Vamos! 💪",
                "¡Buena suerte!",
                "¡Creo en ti!",
                "¡A quemar! 🔥"
            ],
            level1: [
                "¡100 puntos! ¡Bien! 👍",
                "¡Calentando! ¡Sigue!",
                "¡Primera centena - fácil!",
                "¡Muy bien! ¡Continúa!",
                "¡Buen comienzo! 🌟",
                "¡Esto es solo el principio!",
                "¡Hacia la victoria!",
                "¡Excelente ritmo!"
            ],
            level2: [
                "¡250! ¡Estás en racha! 💥",
                "¡Juegas genial!",
                "¡Guau! ¡Sigue así!",
                "¡Potente! ¡No pares!",
                "¡Increíble! 🌈",
                "¡Fuego! 🔥🔥",
                "¡Vas muy bien!",
                "¡Ya 250+! ¡Respeto!"
            ],
            level3: [
                "¡500! ¡Maestro! 🏆",
                "¡Quinientos! ¡Leyenda!",
                "¡Dios del juego! 👑",
                "¡Increíblemente genial!",
                "¡Eres una máquina! 🤖",
                "¡Imposible! 💫",
                "¡Élite! 🌟🌟",
                "¡Alerta pro gamer!",
                "¡Invencible!"
            ],
            level4: [
                "¡1000!!! ¡LEYENDA! 👑👑",
                "¡Mil! ¡Eso es base!",
                "¡Ultra habilidad! 🚀",
                "¡Material top-1!",
                "¡GG! ¡Eres el mejor!",
                "¡Mega cerebro! 🧠",
                "¡1K+ Campeón!",
                "¡Absoluto! 💎",
                "¡Genio 2048!"
            ],
            level5: [
                "¡2000! ¡DEIDAD! ⚡",
                "¿Esports? 🎯",
                "¡Habilidad inhumana!",
                "¡MVP! ¡MVP! ¡MVP!",
                "¡Rompiste el juego! 😱",
                "¿Cheater? ¡No, solo un dios!",
                "¡2K+ Irreal!",
                "¡Telépata! 🔮",
                "¡Matrix hackeada!"
            ],
            legendary: [
                "¡5000!!! ¡CREADOR! 🌌",
                "¿Quién... eres?! 😲",
                "¿¡Esto es legal!?",
                "¡El dios 2048 descendió!",
                "¡Legendario! 🐉",
                "¡Más allá de los límites!",
                "¡Nivel mítico!",
                "¡Cósmico! 🚀🌟",
                "¡Cambiaste la realidad!"
            ],
            god: [
                "¡10000!!! ¡CREASTE EL UNIVERSO! 🌌✨",
                "¡Me inclino ante ti! 🙇",
                "Esto es imposible... ¡pero lo hiciste!",
                "¡Reescribiste la física!",
                "¡Nueva era de 2048! 👑💎",
                "¡Nivel divino!",
                "¡Alfa y Omega!",
                "¡Más allá de la comprensión!",
                "¡Te convertiste en 2048! 🔥🔥🔥"
            ]
        },

        // ===== DEUTSCH =====
        de: {
            starter: [
                "Los geht's! 🎮",
                "Du schaffst das!",
                "Auf geht's! 💪",
                "Viel Glück!",
                "Ich glaube an dich!",
                "Feuer frei! 🔥"
            ],
            level1: [
                "100 Punkte! Nicht schlecht! 👍",
                "Aufwärmen! Weiter so!",
                "Erste Hundert - easy!",
                "Toll! Weitermachen!",
                "Guter Start! 🌟",
                "Das ist erst der Anfang!",
                "Auf zum Sieg!",
                "Super Tempo!"
            ],
            level2: [
                "250! Du bist im Flow! 💥",
                "Super gespielt!",
                "Wow! Weiter so!",
                "Stark! Nicht aufhören!",
                "Hammer! 🌈",
                "Feuer! 🔥🔥",
                "Läuft richtig gut!",
                "Schon 250+! Respekt!"
            ],
            level3: [
                "500! Meister! 🏆",
                "Fünfhundert! Legende!",
                "Spielgott! 👑",
                "Unglaublich cool!",
                "Du bist eine Maschine! 🤖",
                "Unmöglich! 💫",
                "Elite! 🌟🌟",
                "Pro Gamer Alarm!",
                "Unbesiegbar!"
            ],
            level4: [
                "1000!!! LEGENDE! 👑👑",
                "Tausend! Das ist die Basis!",
                "Ultra Skill! 🚀",
                "Top-1 Material!",
                "GG! Du bist der Beste!",
                "Mega-Hirn! 🧠",
                "1K+ Champion!",
                "Absolut! 💎",
                "2048 Genie!"
            ],
            level5: [
                "2000! GOTTHEIT! ⚡",
                "Esports? 🎯",
                "Unmenschlicher Skill!",
                "MVP! MVP! MVP!",
                "Du hast das Spiel zerstört! 😱",
                "Cheater? Nein, einfach ein Gott!",
                "2K+ Unwirklich!",
                "Telepath! 🔮",
                "Matrix gehackt!"
            ],
            legendary: [
                "5000!!! SCHÖPFER! 🌌",
                "Wer... bist du?! 😲",
                "Ist das überhaupt legal?!",
                "Der 2048-Gott ist herabgestiegen!",
                "Legendär! 🐉",
                "Jenseits der Grenzen!",
                "Mythisches Level!",
                "Kosmisch! 🚀🌟",
                "Du hast die Realität verändert!"
            ],
            god: [
                "10000!!! DU HAST DAS UNIVERSUM ERSCHAFFEN! 🌌✨",
                "Ich verbeuge mich! 🙇",
                "Das ist unmöglich... aber du hast es geschafft!",
                "Du hast die Physik umgeschrieben!",
                "Neue Ära von 2048! 👑💎",
                "Göttliches Level!",
                "Alpha und Omega!",
                "Jenseits des Verstehens!",
                "Du wurdest 2048! 🔥🔥🔥"
            ]
        },

        // ===== FRANÇAIS =====
        fr: {
            starter: [
                "C'est parti! 🎮",
                "Tu peux le faire!",
                "Allons-y! 💪",
                "Bonne chance!",
                "Je crois en toi!",
                "En feu! 🔥"
            ],
            level1: [
                "100 points! Pas mal! 👍",
                "Échauffement! Continue!",
                "Première centaine - facile!",
                "Bravo! Continue!",
                "Bon début! 🌟",
                "Ce n'est que le début!",
                "Vers la victoire!",
                "Super rythme!"
            ],
            level2: [
                "250! Tu es en feu! 💥",
                "Tu joues super bien!",
                "Wow! Continue comme ça!",
                "Puissant! N'arrête pas!",
                "Génial! 🌈",
                "En flammes! 🔥🔥",
                "Ça roule!",
                "Déjà 250+! Respect!"
            ],
            level3: [
                "500! Maître! 🏆",
                "Cinq cents! Légende!",
                "Dieu du jeu! 👑",
                "Incroyablement cool!",
                "Tu es une machine! 🤖",
                "Impossible! 💫",
                "Élite! 🌟🌟",
                "Alerte pro gamer!",
                "Invincible!"
            ],
            level4: [
                "1000!!! LÉGENDE! 👑👑",
                "Mille! C'est la base!",
                "Ultra compétence! 🚀",
                "Matériel top-1!",
                "GG! Tu es le meilleur!",
                "Méga cerveau! 🧠",
                "1K+ Champion!",
                "Absolu! 💎",
                "Génie 2048!"
            ],
            level5: [
                "2000! DIVINITÉ! ⚡",
                "Esport? 🎯",
                "Compétence inhumaine!",
                "MVP! MVP! MVP!",
                "Tu as cassé le jeu! 😱",
                "Tricheur? Non, juste un dieu!",
                "2K+ Irréel!",
                "Télépathe! 🔮",
                "Matrice piratée!"
            ],
            legendary: [
                "5000!!! CRÉATEUR! 🌌",
                "Qui... es-tu?! 😲",
                "C'est même légal?!",
                "Le dieu 2048 est descendu!",
                "Légendaire! 🐉",
                "Au-delà des limites!",
                "Niveau mythique!",
                "Cosmique! 🚀🌟",
                "Tu as changé la réalité!"
            ],
            god: [
                "10000!!! TU AS CRÉÉ L'UNIVERS! 🌌✨",
                "Je m'incline! 🙇",
                "C'est impossible... mais tu l'as fait!",
                "Tu as réécrit la physique!",
                "Nouvelle ère de 2048! 👑💎",
                "Niveau divin!",
                "Alpha et Oméga!",
                "Au-delà de la compréhension!",
                "Tu es devenu 2048! 🔥🔥🔥"
            ]
        },

        // ===== PORTUGUÊS =====
        pt: {
            starter: [
                "Vamos jogar! 🎮",
                "Você consegue!",
                "Bora! 💪",
                "Boa sorte!",
                "Acredito em você!",
                "Arrasando! 🔥"
            ],
            level1: [
                "100 pontos! Legal! 👍",
                "Aquecendo! Continue!",
                "Primeira centena - fácil!",
                "Muito bem! Continue!",
                "Bom começo! 🌟",
                "Isso é só o começo!",
                "Rumo à vitória!",
                "Ótimo ritmo!"
            ],
            level2: [
                "250! Você está on fire! 💥",
                "Jogando demais!",
                "Uau! Continue assim!",
                "Poderoso! Não pare!",
                "Incrível! 🌈",
                "Fogo! 🔥🔥",
                "Mandando bem!",
                "Já 250+! Respeito!"
            ],
            level3: [
                "500! Mestre! 🏆",
                "Quinhentos! Lenda!",
                "Deus do jogo! 👑",
                "Incrivelmente legal!",
                "Você é uma máquina! 🤖",
                "Impossível! 💫",
                "Elite! 🌟🌟",
                "Alerta pro gamer!",
                "Invencível!"
            ],
            level4: [
                "1000!!! LENDA! 👑👑",
                "Mil! Isso é base!",
                "Ultra habilidade! 🚀",
                "Material top-1!",
                "GG! Você é o melhor!",
                "Mega cérebro! 🧠",
                "1K+ Campeão!",
                "Absoluto! 💎",
                "Gênio 2048!"
            ],
            level5: [
                "2000! DIVINDADE! ⚡",
                "Esports? 🎯",
                "Habilidade desumana!",
                "MVP! MVP! MVP!",
                "Você quebrou o jogo! 😱",
                "Cheater? Não, só um deus!",
                "2K+ Irreal!",
                "Telepata! 🔮",
                "Matrix hackeada!"
            ],
            legendary: [
                "5000!!! CRIADOR! 🌌",
                "Quem... é você?! 😲",
                "Isso é legal?!",
                "O deus 2048 desceu!",
                "Lendário! 🐉",
                "Além dos limites!",
                "Nível mítico!",
                "Cósmico! 🚀🌟",
                "Você mudou a realidade!"
            ],
            god: [
                "10000!!! VOCÊ CRIOU O UNIVERSO! 🌌✨",
                "Me curvo a você! 🙇",
                "Isso é impossível... mas você conseguiu!",
                "Você reescreveu a física!",
                "Nova era de 2048! 👑💎",
                "Nível divino!",
                "Alfa e Ômega!",
                "Além da compreensão!",
                "Você se tornou 2048! 🔥🔥🔥"
            ]
        },

        // ===== ITALIANO =====
        it: {
            starter: [
                "Iniziamo! 🎮",
                "Ce la puoi fare!",
                "Andiamo! 💪",
                "Buona fortuna!",
                "Credo in te!",
                "Spacca! 🔥"
            ],
            level1: [
                "100 punti! Bene! 👍",
                "Riscaldamento! Continua!",
                "Prima centinaia - facile!",
                "Bravo! Continua!",
                "Buon inizio! 🌟",
                "Questo è solo l'inizio!",
                "Verso la vittoria!",
                "Ottimo ritmo!"
            ],
            level2: [
                "250! Sei in fiamme! 💥",
                "Stai giocando alla grande!",
                "Wow! Continua così!",
                "Potente! Non fermarti!",
                "Fantastico! 🌈",
                "Fuoco! 🔥🔥",
                "Stai andando forte!",
                "Già 250+! Rispetto!"
            ],
            level3: [
                "500! Maestro! 🏆",
                "Cinquecento! Leggenda!",
                "Dio del gioco! 👑",
                "Incredibilmente figo!",
                "Sei una macchina! 🤖",
                "Impossibile! 💫",
                "Elite! 🌟🌟",
                "Allerta pro gamer!",
                "Invincibile!"
            ],
            level4: [
                "1000!!! LEGGENDA! 👑👑",
                "Mille! Questa è la base!",
                "Ultra abilità! 🚀",
                "Materiale top-1!",
                "GG! Sei il migliore!",
                "Mega cervello! 🧠",
                "1K+ Campione!",
                "Assoluto! 💎",
                "Genio 2048!"
            ],
            level5: [
                "2000! DIVINITÀ! ⚡",
                "Esports? 🎯",
                "Abilità inumana!",
                "MVP! MVP! MVP!",
                "Hai rotto il gioco! 😱",
                "Cheater? No, solo un dio!",
                "2K+ Irreale!",
                "Telepate! 🔮",
                "Matrix hackerata!"
            ],
            legendary: [
                "5000!!! CREATORE! 🌌",
                "Chi... sei?! 😲",
                "È legale?!",
                "Il dio 2048 è sceso!",
                "Leggendario! 🐉",
                "Oltre i limiti!",
                "Livello mitico!",
                "Cosmico! 🚀🌟",
                "Hai cambiato la realtà!"
            ],
            god: [
                "10000!!! HAI CREATO L'UNIVERSO! 🌌✨",
                "Mi inchino a te! 🙇",
                "È impossibile... ma ce l'hai fatta!",
                "Hai riscritto la fisica!",
                "Nuova era di 2048! 👑💎",
                "Livello divino!",
                "Alfa e Omega!",
                "Oltre la comprensione!",
                "Sei diventato 2048! 🔥🔥🔥"
            ]
        },

        // ===== 日本語 (JAPANESE) =====
        ja: {
            starter: [
                "さあ始めよう！🎮",
                "君ならできる！",
                "行くぞ！💪",
                "頑張って！",
                "信じてるよ！",
                "燃えろ！🔥"
            ],
            level1: [
                "100点！いいね！👍",
                "ウォーミングアップ！続けて！",
                "最初の100 - 簡単！",
                "よくやった！続けて！",
                "いいスタート！🌟",
                "これはまだ始まり！",
                "勝利へ向かえ！",
                "素晴らしいペース！"
            ],
            level2: [
                "250！絶好調！💥",
                "すごいプレイ！",
                "ワオ！その調子！",
                "パワフル！止まるな！",
                "最高！🌈",
                "ファイヤー！🔥🔥",
                "好調だね！",
                "もう250+！リスペクト！"
            ],
            level3: [
                "500！マスター！🏆",
                "500！レジェンド！",
                "ゲームの神！👑",
                "信じられないほどクール！",
                "君はマシンだ！🤖",
                "不可能！💫",
                "エリート！🌟🌟",
                "プロゲーマー警報！",
                "無敵！"
            ],
            level4: [
                "1000！！！レジェンド！👑👑",
                "千！これがベース！",
                "ウルトラスキル！🚀",
                "トップ1素材！",
                "GG！君が最高！",
                "メガ脳！🧠",
                "1K+チャンピオン！",
                "アブソリュート！💎",
                "2048の天才！"
            ],
            level5: [
                "2000！神！⚡",
                "eスポーツ？🎯",
                "人間離れしたスキル！",
                "MVP！MVP！MVP！",
                "ゲームを壊した！😱",
                "チーター？いや、ただの神！",
                "2K+非現実！",
                "テレパス！🔮",
                "マトリックスハック！"
            ],
            legendary: [
                "5000！！！創造主！🌌",
                "君は...誰？！😲",
                "これ合法？！",
                "2048の神が降臨！",
                "レジェンダリー！🐉",
                "限界を超えた！",
                "神話レベル！",
                "宇宙的！🚀🌟",
                "現実を変えた！"
            ],
            god: [
                "10000！！！宇宙を創造した！🌌✨",
                "ひれ伏します！🙇",
                "不可能...でも君はやった！",
                "物理法則を書き換えた！",
                "2048の新時代！👑💎",
                "神のレベル！",
                "アルファとオメガ！",
                "理解を超えた！",
                "君が2048になった！🔥🔥🔥"
            ]
        },

        // ===== 한국어 (KOREAN) =====
        ko: {
            starter: [
                "시작해! 🎮",
                "넌 할 수 있어!",
                "가자! 💪",
                "행운을 빌어!",
                "널 믿어!",
                "불태워! 🔥"
            ],
            level1: [
                "100점! 좋아! 👍",
                "워밍업! 계속해!",
                "첫 백점 - 쉬워!",
                "잘했어! 계속!",
                "좋은 시작! 🌟",
                "이건 시작일 뿐!",
                "승리를 향해!",
                "훌륭한 속도!"
            ],
            level2: [
                "250! 달리고 있어! 💥",
                "플레이 짱!",
                "와우! 계속 그렇게!",
                "강력해! 멈추지 마!",
                "대단해! 🌈",
                "불이야! 🔥🔥",
                "잘 나가고 있어!",
                "벌써 250+! 리스펙!"
            ],
            level3: [
                "500! 마스터! 🏆",
                "오백! 레전드!",
                "게임의 신! 👑",
                "믿기 어려울 정도로 쿨!",
                "넌 기계야! 🤖",
                "불가능! 💫",
                "엘리트! 🌟🌟",
                "프로 게이머 경보!",
                "무적!"
            ],
            level4: [
                "1000!!! 레전드! 👑👑",
                "천점! 이게 기본!",
                "울트라 스킬! 🚀",
                "탑-1 재료!",
                "GG! 넌 최고야!",
                "메가 브레인! 🧠",
                "1K+ 챔피언!",
                "앱솔루트! 💎",
                "2048 천재!"
            ],
            level5: [
                "2000! 신! ⚡",
                "e스포츠? 🎯",
                "비인간적 스킬!",
                "MVP! MVP! MVP!",
                "게임을 깼어! 😱",
                "치터? 아니, 그냥 신!",
                "2K+ 비현실!",
                "텔레파스! 🔮",
                "매트릭스 해킹!"
            ],
            legendary: [
                "5000!!! 창조주! 🌌",
                "넌... 누구야?! 😲",
                "이게 합법이야?!",
                "2048의 신이 강림했다!",
                "레전더리! 🐉",
                "한계를 넘어서!",
                "신화 레벨!",
                "우주적! 🚀🌟",
                "현실을 바꿨어!"
            ],
            god: [
                "10000!!! 우주를 창조했어! 🌌✨",
                "경배합니다! 🙇",
                "이건 불가능... 근데 넌 해냈어!",
                "물리 법칙을 다시 썼어!",
                "2048의 새 시대! 👑💎",
                "신성한 레벨!",
                "알파와 오메가!",
                "이해를 초월!",
                "넌 2048이 됐어! 🔥🔥🔥"
            ]
        },

        // ===== 中文 (CHINESE) =====
        zh: {
            starter: [
                "开始玩吧！🎮",
                "你可以的！",
                "冲啊！💪",
                "祝你好运！",
                "我相信你！",
                "燃起来！🔥"
            ],
            level1: [
                "100分！不错！👍",
                "热身中！继续！",
                "第一个百分 - 简单！",
                "做得好！继续！",
                "好的开始！🌟",
                "这只是开始！",
                "向胜利前进！",
                "节奏很棒！"
            ],
            level2: [
                "250！你火了！💥",
                "玩得太棒了！",
                "哇！继续保持！",
                "强大！不要停！",
                "太棒了！🌈",
                "着火了！🔥🔥",
                "势头很猛！",
                "已经250+！尊重！"
            ],
            level3: [
                "500！大师！🏆",
                "五百！传奇！",
                "游戏之神！👑",
                "难以置信的酷！",
                "你是机器！🤖",
                "不可能！💫",
                "精英！🌟🌟",
                "职业玩家警报！",
                "无敌！"
            ],
            level4: [
                "1000！！！传奇！👑👑",
                "一千！这就是基础！",
                "超级技能！🚀",
                "顶级材料！",
                "GG！你是最棒的！",
                "超级大脑！🧠",
                "1K+冠军！",
                "绝对！💎",
                "2048天才！"
            ],
            level5: [
                "2000！神！⚡",
                "电竞？🎯",
                "非人类技能！",
                "MVP！MVP！MVP！",
                "你打破了游戏！😱",
                "开挂？不，只是神！",
                "2K+不真实！",
                "心灵感应！🔮",
                "矩阵被黑了！"
            ],
            legendary: [
                "5000！！！创造者！🌌",
                "你...是谁？！😲",
                "这合法吗？！",
                "2048之神降临了！",
                "传说中的！🐉",
                "超越极限！",
                "神话级别！",
                "宇宙级！🚀🌟",
                "你改变了现实！"
            ],
            god: [
                "10000！！！你创造了宇宙！🌌✨",
                "我向你鞠躬！🙇",
                "这是不可能的...但你做到了！",
                "你重写了物理定律！",
                "2048新纪元！👑💎",
                "神圣级别！",
                "阿尔法和欧米茄！",
                "超越理解！",
                "你成为了2048！🔥🔥🔥"
            ]
        },

        // ===== POLSKI =====
        pl: {
            starter: [
                "Zaczynamy! 🎮",
                "Dasz radę!",
                "Do dzieła! 💪",
                "Powodzenia!",
                "Wierzę w ciebie!",
                "Ognia! 🔥"
            ],
            level1: [
                "100 punktów! Nieźle! 👍",
                "Rozgrzewka! Dalej!",
                "Pierwsza setka - łatwo!",
                "Świetnie! Kontynuuj!",
                "Dobry start! 🌟",
                "To dopiero początek!",
                "Do zwycięstwa!",
                "Świetne tempo!"
            ],
            level2: [
                "250! Jesteś w formie! 💥",
                "Super grasz!",
                "Wow! Tak trzymaj!",
                "Potężnie! Nie zatrzymuj się!",
                "Niesamowite! 🌈",
                "Ogień! 🔥🔥",
                "Idzie ci świetnie!",
                "Już 250+! Szacun!"
            ],
            level3: [
                "500! Mistrz! 🏆",
                "Pięćset! Legenda!",
                "Bóg gry! 👑",
                "Niesamowicie fajne!",
                "Jesteś maszyną! 🤖",
                "Niemożliwe! 💫",
                "Elita! 🌟🌟",
                "Alert pro gamera!",
                "Niezwyciężony!"
            ],
            level4: [
                "1000!!! LEGENDA! 👑👑",
                "Tysiąc! To jest baza!",
                "Ultra umiejętność! 🚀",
                "Materiał na top-1!",
                "GG! Jesteś najlepszy!",
                "Mega mózg! 🧠",
                "1K+ Mistrz!",
                "Absolutny! 💎",
                "Geniusz 2048!"
            ],
            level5: [
                "2000! BÓSTWO! ⚡",
                "Esport? 🎯",
                "Nieludzka umiejętność!",
                "MVP! MVP! MVP!",
                "Zepsułeś grę! 😱",
                "Cheater? Nie, po prostu bóg!",
                "2K+ Nierealne!",
                "Telepata! 🔮",
                "Matrix zhakowany!"
            ],
            legendary: [
                "5000!!! STWÓRCA! 🌌",
                "Kim... jesteś?! 😲",
                "Czy to w ogóle legalne?!",
                "Bóg 2048 zstąpił!",
                "Legendarny! 🐉",
                "Poza granicami!",
                "Mityczny poziom!",
                "Kosmiczny! 🚀🌟",
                "Zmieniłeś rzeczywistość!"
            ],
            god: [
                "10000!!! STWORZYŁEŚ WSZECHŚWIAT! 🌌✨",
                "Kłaniam się! 🙇",
                "To niemożliwe... ale ci się udało!",
                "Przepisałeś prawa fizyki!",
                "Nowa era 2048! 👑💎",
                "Boski poziom!",
                "Alfa i Omega!",
                "Poza zrozumieniem!",
                "Stałeś się 2048! 🔥🔥🔥"
            ]
        },

        // ===== TÜRKÇE =====
        tr: {
            starter: [
                "Haydi başla! 🎮",
                "Yapabilirsin!",
                "Hadi gidelim! 💪",
                "İyi şanslar!",
                "Sana inanıyorum!",
                "Yak! 🔥"
            ],
            level1: [
                "100 puan! Güzel! 👍",
                "Isınma! Devam et!",
                "İlk yüz - kolay!",
                "Harika! Devam!",
                "İyi başlangıç! 🌟",
                "Bu sadece başlangıç!",
                "Zafere doğru!",
                "Harika tempo!"
            ],
            level2: [
                "250! Ateştesin! 💥",
                "Süper oynuyorsun!",
                "Vay! Böyle devam!",
                "Güçlü! Durma!",
                "Müthiş! 🌈",
                "Ateş! 🔥🔥",
                "Çok iyi gidiyorsun!",
                "Şimdiden 250+! Saygılar!"
            ],
            level3: [
                "500! Usta! 🏆",
                "Beş yüz! Efsane!",
                "Oyun tanrısı! 👑",
                "İnanılmaz havalı!",
                "Sen bir makinesin! 🤖",
                "İmkansız! 💫",
                "Elit! 🌟🌟",
                "Pro gamer alarmı!",
                "Yenilmez!"
            ],
            level4: [
                "1000!!! EFSANE! 👑👑",
                "Bin! Bu temel!",
                "Ultra beceri! 🚀",
                "Top-1 malzemesi!",
                "GG! En iyisisin!",
                "Mega beyin! 🧠",
                "1K+ Şampiyon!",
                "Mutlak! 💎",
                "2048 Dahisi!"
            ],
            level5: [
                "2000! TANRILIK! ⚡",
                "E-spor mu? 🎯",
                "İnsanüstü beceri!",
                "MVP! MVP! MVP!",
                "Oyunu bozdun! 😱",
                "Hile mi? Hayır, sadece tanrı!",
                "2K+ Gerçek dışı!",
                "Telepat! 🔮",
                "Matrix hacklendi!"
            ],
            legendary: [
                "5000!!! YARATICI! 🌌",
                "Sen... kimsin?! 😲",
                "Bu yasal mı?!",
                "2048 tanrısı indi!",
                "Efsanevi! 🐉",
                "Sınırların ötesinde!",
                "Mitolojik seviye!",
                "Kozmik! 🚀🌟",
                "Gerçekliği değiştirdin!"
            ],
            god: [
                "10000!!! EVRENİ YARATTIN! 🌌✨",
                "Önünde eğiliyorum! 🙇",
                "Bu imkansız... ama yaptın!",
                "Fizik yasalarını yeniden yazdın!",
                "2048'in yeni çağı! 👑💎",
                "İlahi seviye!",
                "Alfa ve Omega!",
                "Anlayışın ötesinde!",
                "2048 oldun! 🔥🔥🔥"
            ]
        },

        // ===== العربية (ARABIC) =====
        ar: {
            starter: [
                "هيا نلعب! 🎮",
                "يمكنك فعلها!",
                "انطلق! 💪",
                "حظاً موفقاً!",
                "أؤمن بك!",
                "احرق! 🔥"
            ],
            level1: [
                "100 نقطة! جيد! 👍",
                "إحماء! استمر!",
                "المئة الأولى - سهل!",
                "أحسنت! تابع!",
                "بداية جيدة! 🌟",
                "هذه مجرد البداية!",
                "نحو النصر!",
                "إيقاع رائع!"
            ],
            level2: [
                "250! أنت مشتعل! 💥",
                "لعب رائع!",
                "واو! استمر هكذا!",
                "قوي! لا تتوقف!",
                "مذهل! 🌈",
                "نار! 🔥🔥",
                "تسير بشكل رائع!",
                "بالفعل 250+! احترام!"
            ],
            level3: [
                "500! سيد! 🏆",
                "خمسمئة! أسطورة!",
                "إله اللعبة! 👑",
                "رائع بشكل لا يصدق!",
                "أنت آلة! 🤖",
                "مستحيل! 💫",
                "نخبة! 🌟🌟",
                "تنبيه لاعب محترف!",
                "لا يقهر!"
            ],
            level4: [
                "1000!!! أسطورة! 👑👑",
                "ألف! هذا الأساس!",
                "مهارة فائقة! 🚀",
                "مادة القمة!",
                "GG! أنت الأفضل!",
                "عقل خارق! 🧠",
                "1K+ بطل!",
                "مطلق! 💎",
                "عبقري 2048!"
            ],
            level5: [
                "2000! إله! ⚡",
                "رياضات إلكترونية؟ 🎯",
                "مهارة غير بشرية!",
                "MVP! MVP! MVP!",
                "كسرت اللعبة! 😱",
                "غشاش؟ لا، فقط إله!",
                "2K+ غير واقعي!",
                "تخاطر! 🔮",
                "تم اختراق الماتريكس!"
            ],
            legendary: [
                "5000!!! الخالق! 🌌",
                "من... أنت؟! 😲",
                "هل هذا قانوني؟!",
                "نزل إله 2048!",
                "أسطوري! 🐉",
                "ما وراء الحدود!",
                "مستوى أسطوري!",
                "كوني! 🚀🌟",
                "غيرت الواقع!"
            ],
            god: [
                "10000!!! خلقت الكون! 🌌✨",
                "أنحني لك! 🙇",
                "هذا مستحيل... لكنك فعلتها!",
                "أعدت كتابة الفيزياء!",
                "عصر جديد لـ 2048! 👑💎",
                "مستوى إلهي!",
                "ألفا وأوميغا!",
                "ما وراء الفهم!",
                "أصبحت 2048! 🔥🔥🔥"
            ]
        },

        // ===== हिन्दी (HINDI) =====
        hi: {
            starter: [
                "शुरू करो! 🎮",
                "तुम कर सकते हो!",
                "चलो! 💪",
                "शुभकामनाएं!",
                "मुझे तुम पर विश्वास है!",
                "जला दो! 🔥"
            ],
            level1: [
                "100 अंक! बढ़िया! 👍",
                "वार्मअप! जारी रखो!",
                "पहला सौ - आसान!",
                "शाबाश! जारी रखो!",
                "अच्छी शुरुआत! 🌟",
                "यह तो बस शुरुआत है!",
                "जीत की ओर!",
                "बेहतरीन गति!"
            ],
            level2: [
                "250! आग लगी है! 💥",
                "शानदार खेल!",
                "वाह! ऐसे ही चलो!",
                "ताकतवर! रुको मत!",
                "कमाल! 🌈",
                "आग! 🔥🔥",
                "बढ़िया चल रहे हो!",
                "पहले ही 250+! सम्मान!"
            ],
            level3: [
                "500! उस्ताद! 🏆",
                "पांच सौ! किंवदंती!",
                "खेल के भगवान! 👑",
                "अविश्वसनीय रूप से कूल!",
                "तुम मशीन हो! 🤖",
                "असंभव! 💫",
                "एलीट! 🌟🌟",
                "प्रो गेमर अलर्ट!",
                "अजेय!"
            ],
            level4: [
                "1000!!! किंवदंती! 👑👑",
                "हजार! यही बेस है!",
                "अल्ट्रा स्किल! 🚀",
                "टॉप-1 मटेरियल!",
                "GG! तुम सबसे अच्छे हो!",
                "मेगा ब्रेन! 🧠",
                "1K+ चैंपियन!",
                "एब्सोल्यूट! 💎",
                "2048 जीनियस!"
            ],
            level5: [
                "2000! देवता! ⚡",
                "ई-स्पोर्ट्स? 🎯",
                "अमानवीय कौशल!",
                "MVP! MVP! MVP!",
                "गेम तोड़ दिया! 😱",
                "चीटर? नहीं, बस भगवान!",
                "2K+ अवास्तविक!",
                "टेलीपैथ! 🔮",
                "मैट्रिक्स हैक!"
            ],
            legendary: [
                "5000!!! निर्माता! 🌌",
                "तुम... कौन हो?! 😲",
                "क्या यह कानूनी है?!",
                "2048 के भगवान उतरे!",
                "पौराणिक! 🐉",
                "सीमाओं से परे!",
                "मिथकीय स्तर!",
                "ब्रह्मांडीय! 🚀🌟",
                "तुमने वास्तविकता बदल दी!"
            ],
            god: [
                "10000!!! ब्रह्मांड बनाया! 🌌✨",
                "मैं झुकता हूं! 🙇",
                "यह असंभव है... पर तुमने किया!",
                "भौतिकी के नियम बदल दिए!",
                "2048 का नया युग! 👑💎",
                "दिव्य स्तर!",
                "अल्फा और ओमेगा!",
                "समझ से परे!",
                "तुम 2048 बन गए! 🔥🔥🔥"
            ]
        },

        // ===== NEDERLANDS =====
        nl: {
            starter: [
                "Laten we spelen! 🎮",
                "Je kunt het!",
                "Kom op! 💪",
                "Succes!",
                "Ik geloof in je!",
                "Stook het op! 🔥"
            ],
            level1: [
                "100 punten! Netjes! 👍",
                "Opwarmen! Ga door!",
                "Eerste honderd - makkelijk!",
                "Goed zo! Doorgaan!",
                "Goede start! 🌟",
                "Dit is nog maar het begin!",
                "Op naar de overwinning!",
                "Geweldig tempo!"
            ],
            level2: [
                "250! Je staat in brand! 💥",
                "Super gespeeld!",
                "Wow! Zo doorgaan!",
                "Krachtig! Niet stoppen!",
                "Geweldig! 🌈",
                "Vuur! 🔥🔥",
                "Het gaat lekker!",
                "Al 250+! Respect!"
            ],
            level3: [
                "500! Meester! 🏆",
                "Vijfhonderd! Legende!",
                "Spelgod! 👑",
                "Ongelooflijk cool!",
                "Je bent een machine! 🤖",
                "Onmogelijk! 💫",
                "Elite! 🌟🌟",
                "Pro gamer alert!",
                "Onoverwinnelijk!"
            ],
            level4: [
                "1000!!! LEGENDE! 👑👑",
                "Duizend! Dat is basis!",
                "Ultra vaardigheid! 🚀",
                "Top-1 materiaal!",
                "GG! Je bent de beste!",
                "Mega brein! 🧠",
                "1K+ Kampioen!",
                "Absoluut! 💎",
                "2048 Genie!"
            ],
            level5: [
                "2000! GODHEID! ⚡",
                "Esports? 🎯",
                "Onmenselijke vaardigheid!",
                "MVP! MVP! MVP!",
                "Je hebt het spel gebroken! 😱",
                "Cheater? Nee, gewoon een god!",
                "2K+ Onwerkelijk!",
                "Telepaat! 🔮",
                "Matrix gehackt!"
            ],
            legendary: [
                "5000!!! SCHEPPER! 🌌",
                "Wie... ben jij?! 😲",
                "Is dit legaal?!",
                "De 2048-god is neergedaald!",
                "Legendarisch! 🐉",
                "Voorbij de grenzen!",
                "Mythisch niveau!",
                "Kosmisch! 🚀🌟",
                "Je hebt de realiteit veranderd!"
            ],
            god: [
                "10000!!! JE HEBT HET UNIVERSUM GECREËERD! 🌌✨",
                "Ik buig voor je! 🙇",
                "Dit is onmogelijk... maar je deed het!",
                "Je herschreef de fysica!",
                "Nieuw tijdperk van 2048! 👑💎",
                "Goddelijk niveau!",
                "Alpha en Omega!",
                "Voorbij begrip!",
                "Je werd 2048! 🔥🔥🔥"
            ]
        }
    },

    init() {
        // Загружаем сохранённый язык
        const savedLang = localStorage.getItem('pokemon_motivator_lang');
        if (savedLang && this.languages[savedLang]) {
            this.currentLang = savedLang;
        } else {
            // Определяем язык браузера
            const browserLang = navigator.language.split('-')[0];
            if (this.languages[browserLang]) {
                this.currentLang = browserLang;
            }
        }
        
        // Создаём выпадающие меню
        this.createDropdowns();
        this.updateLanguageButtons();
        
        console.log('Localization initialized. Language:', this.currentLang);
    },

    createDropdowns() {
        ['left', 'right'].forEach(side => {
            const dropdown = document.getElementById(`lang-dropdown-${side}`);
            if (!dropdown) return;
            
            dropdown.innerHTML = '';
            
            Object.entries(this.languages).forEach(([code, lang]) => {
                const option = document.createElement('button');
                option.className = `lang-option ${code === this.currentLang ? 'active' : ''}`;
                option.innerHTML = `
                    <span class="lang-option-flag">${lang.flag}</span>
                    <span class="lang-option-name">${lang.name}</span>
                    <span class="lang-option-code">${lang.code}</span>
                `;
                option.onclick = (e) => {
                    e.stopPropagation();
                    this.setLanguage(code);
                };
                dropdown.appendChild(option);
            });
        });
    },

    updateLanguageButtons() {
        const lang = this.languages[this.currentLang];
        ['left', 'right'].forEach(side => {
            const btn = document.getElementById(`lang-current-${side}`);
            if (btn) btn.textContent = lang.code;
            
            // Обновляем активный элемент в dropdown
            const dropdown = document.getElementById(`lang-dropdown-${side}`);
            if (dropdown) {
                dropdown.querySelectorAll('.lang-option').forEach(opt => {
                    const code = opt.querySelector('.lang-option-code').textContent.toLowerCase();
                    opt.classList.toggle('active', code === this.currentLang);
                });
            }
        });
    },

    setLanguage(langCode) {
        if (!this.languages[langCode]) return;
        
        this.currentLang = langCode;
        localStorage.setItem('pokemon_motivator_lang', langCode);
        
        this.updateLanguageButtons();
        this.closeAllDropdowns();
        
        // Обновляем фразы покемонов
        if (window.motivatorSystem) {
            motivatorSystem.lastScore = -1; // Форсируем обновление
            motivatorSystem.updateMotivators(window.game ? window.game.score : 0);
        }
        
        console.log('Language changed to:', langCode);
    },

    closeAllDropdowns() {
        document.querySelectorAll('.lang-dropdown').forEach(d => d.classList.remove('show'));
    },

    getPhrases(level) {
        const langPhrases = this.phrases[this.currentLang];
        if (langPhrases && langPhrases[level]) {
            return langPhrases[level];
        }
        // Fallback на английский
        return this.phrases.en[level] || this.phrases.en.starter;
    }
};

// Функция для переключения меню языков
function toggleLanguageMenu(side) {
    const dropdown = document.getElementById(`lang-dropdown-${side}`);
    const otherSide = side === 'left' ? 'right' : 'left';
    const otherDropdown = document.getElementById(`lang-dropdown-${otherSide}`);
    
    // Закрываем другое меню
    if (otherDropdown) otherDropdown.classList.remove('show');
    
    // Переключаем текущее
    if (dropdown) dropdown.classList.toggle('show');
}

// Закрытие меню при клике вне
document.addEventListener('click', (e) => {
    if (!e.target.closest('.language-selector')) {
        localization.closeAllDropdowns();
    }
});

// ============================================
// Мотивирующие покемоны
// ============================================

const motivatorSystem = {
    // Покемоны для разных уровней очков
    pokemonLevels: {
        starter: [ // 0-99
            { id: 25, name: 'Pikachu' },
            { id: 133, name: 'Eevee' },
            { id: 39, name: 'Jigglypuff' }
        ],
        level1: [ // 100-249
            { id: 1, name: 'Bulbasaur' },
            { id: 4, name: 'Charmander' },
            { id: 7, name: 'Squirtle' },
            { id: 152, name: 'Chikorita' }
        ],
        level2: [ // 250-499
            { id: 54, name: 'Psyduck' },
            { id: 52, name: 'Meowth' },
            { id: 35, name: 'Clefairy' },
            { id: 175, name: 'Togepi' }
        ],
        level3: [ // 500-999
            { id: 6, name: 'Charizard' },
            { id: 9, name: 'Blastoise' },
            { id: 3, name: 'Venusaur' },
            { id: 131, name: 'Lapras' }
        ],
        level4: [ // 1000-1999
            { id: 143, name: 'Snorlax' },
            { id: 130, name: 'Gyarados' },
            { id: 149, name: 'Dragonite' },
            { id: 134, name: 'Vaporeon' }
        ],
        level5: [ // 2000-4999
            { id: 150, name: 'Mewtwo' },
            { id: 151, name: 'Mew' },
            { id: 144, name: 'Articuno' },
            { id: 145, name: 'Zapdos' }
        ],
        legendary: [ // 5000-9999
            { id: 249, name: 'Lugia' },
            { id: 250, name: 'Ho-Oh' },
            { id: 146, name: 'Moltres' },
            { id: 243, name: 'Raikou' }
        ],
        god: [ // 10000+
            { id: 384, name: 'Rayquaza' },
            { id: 483, name: 'Dialga' },
            { id: 484, name: 'Palkia' },
            { id: 487, name: 'Giratina' }
        ]
    },

    lastScore: 0,
    lastPhraseIndex: { left: -1, right: -1 },
    
    getLevel(score) {
        if (score >= 10000) return 'god';
        if (score >= 5000) return 'legendary';
        if (score >= 2000) return 'level5';
        if (score >= 1000) return 'level4';
        if (score >= 500) return 'level3';
        if (score >= 250) return 'level2';
        if (score >= 100) return 'level1';
        return 'starter';
    },

    getLevelClass(level) {
        const classMap = {
            'starter': 'level-starter',
            'level1': 'level-starter',
            'level2': 'level-good',
            'level3': 'level-great',
            'level4': 'level-amazing',
            'level5': 'level-amazing',
            'legendary': 'level-legendary',
            'god': 'level-god'
        };
        return classMap[level] || 'level-starter';
    },

    getRandomPokemon(level) {
        const pokemons = this.pokemonLevels[level];
        return pokemons[Math.floor(Math.random() * pokemons.length)];
    },

    getRandomPhrase(level, side) {
        // Используем локализованные фразы
        const phrases = localization.getPhrases(level);
        let index;
        do {
            index = Math.floor(Math.random() * phrases.length);
        } while (index === this.lastPhraseIndex[side] && phrases.length > 1);
        this.lastPhraseIndex[side] = index;
        return phrases[index];
    },

    getPokemonSpriteUrl(pokemonId) {
        return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/${pokemonId}.gif`;
    },

    updateMotivators(score) {
        // Обновляем только если очки изменились значительно (каждые 50 очков или при смене уровня)
        const currentLevel = this.getLevel(score);
        const prevLevel = this.getLevel(this.lastScore);
        const scoreDiff = score - this.lastScore;
        
        // Обновляем при смене уровня или каждые 50 очков
        if (currentLevel !== prevLevel || scoreDiff >= 50 || this.lastScore === 0) {
            this.lastScore = score;
            
            // Обновляем левого покемона
            this.updateSide('left', currentLevel, score);
            
            // Обновляем правого покемона с небольшой задержкой для разнообразия
            setTimeout(() => {
                this.updateSide('right', currentLevel, score);
            }, 300);
        }
    },

    updateSide(side, level, score) {
        const container = document.getElementById(`motivator-${side}`);
        const sprite = document.getElementById(`motivator-sprite-${side}`);
        const name = document.getElementById(`motivator-name-${side}`);
        const bubbleText = document.getElementById(`bubble-text-${side}`);
        
        if (!container || !sprite || !name || !bubbleText) return;
        
        // Получаем случайного покемона для этого уровня
        const pokemon = this.getRandomPokemon(level);
        
        // Обновляем спрайт с fallback
        const spriteUrl = this.getPokemonSpriteUrl(pokemon.id);
        sprite.onerror = function() {
            this.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`;
        };
        sprite.src = spriteUrl;
        
        // Обновляем имя
        name.textContent = pokemon.name;
        
        // Обновляем фразу
        const phrase = this.getRandomPhrase(level, side);
        bubbleText.textContent = phrase;
        
        // Обновляем класс для стиля
        container.className = `motivator-container motivator-${side} ${this.getLevelClass(level)}`;
        
        // Добавляем анимацию при обновлении
        container.style.animation = 'none';
        container.offsetHeight; // trigger reflow
        container.style.animation = '';
        
        // Добавляем эффект появления текста
        bubbleText.style.opacity = '0';
        bubbleText.style.transform = 'scale(0.8)';
        setTimeout(() => {
            bubbleText.style.transition = 'all 0.3s ease';
            bubbleText.style.opacity = '1';
            bubbleText.style.transform = 'scale(1)';
        }, 100);
    },

    init() {
        // Начальное состояние
        this.updateMotivators(0);
        
        // Следим за изменением счёта
        const originalUpdateScore = window.game.updateScore.bind(window.game);
        window.game.updateScore = () => {
            originalUpdateScore();
            this.updateMotivators(window.game.score);
        };
        
        console.log('Motivator system initialized! 🎉');
    }
};

// Инициализируем систему мотиваторов и локализацию после загрузки
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        localization.init();
        motivatorSystem.init();
    }, 500);
});

// ============================================
// Web3 Integration for Base Network
// ============================================

// Base Network Configuration
const BASE_MAINNET = {
    chainId: '0x2105', // 8453 in hex
    chainName: 'Base',
    nativeCurrency: { name: 'Ethereum', symbol: 'ETH', decimals: 18 },
    rpcUrls: ['https://mainnet.base.org'],
    blockExplorerUrls: ['https://basescan.org']
};

const BASE_SEPOLIA = {
    chainId: '0x14a34', // 84532 in hex
    chainName: 'Base Sepolia',
    nativeCurrency: { name: 'Ethereum', symbol: 'ETH', decimals: 18 },
    rpcUrls: ['https://sepolia.base.org'],
    blockExplorerUrls: ['https://sepolia.basescan.org']
};

// Use Base Mainnet
const TARGET_NETWORK = BASE_MAINNET;

// Global state
let provider = null;
let signer = null;
let userAddress = null;
let farcasterSDK = null;

// Status element
const statusEl = document.getElementById('web3-status');
const walletInfoEl = document.getElementById('wallet-info');

// Очищаем статус сразу при загрузке скрипта
if (statusEl) {
    statusEl.textContent = '';
    statusEl.className = 'web3-status';
}

function showStatus(message, type = 'loading') {
    if (!statusEl) return;
    statusEl.textContent = message;
    statusEl.className = 'web3-status ' + type;
    if (type !== 'loading') {
        // Автоматически скрываем сообщения через 2 секунды
        setTimeout(() => {
            if (statusEl.textContent === message) {
                statusEl.textContent = '';
                statusEl.className = 'web3-status';
            }
        }, 2000);
    }
}

function clearStatus() {
    if (statusEl) {
        statusEl.textContent = '';
        statusEl.className = 'web3-status';
        // Убеждаемся что элемент действительно очищен
        statusEl.style.display = '';
    }
}

// Base Name Service Resolver для reverse lookup
const BASENAME_L2_RESOLVER = '0xC6d566A56A1aFf6508b41f6c90ff131615583BCD';
const BASENAME_REVERSE_REGISTRAR = '0x79EA96012eEa67A83431F1701B3dFf7e37F9E282';

// ABI для получения basename
const BASENAME_RESOLVER_ABI = [
    'function name(bytes32 node) view returns (string)'
];

// Функция для получения Farcaster username из SDK context
async function getFarcasterUsername() {
    try {
        // Сначала проверяем глобальную переменную (установлена при инициализации SDK)
        if (window.farcasterUser) {
            const user = window.farcasterUser;
            return user.username || user.displayName || null;
        }
        
        // Затем пробуем через SDK context
        if (farcasterSDK && farcasterSDK.context) {
            const context = await farcasterSDK.context;
            if (context && context.user) {
                // Возвращаем username или displayName
                return context.user.username || context.user.displayName || null;
            }
        }
    } catch (e) {
        console.log('Could not get Farcaster username:', e.message);
    }
    return null;
}

// Функция для получения Basename через reverse lookup
async function getBasename(address) {
    try {
        if (!address || !provider) return null;
        
        // Создаем node для reverse lookup (address.addr.reverse)
        const addressLower = address.toLowerCase().slice(2); // убираем 0x
        const reverseNode = ethers.namehash(addressLower + '.addr.reverse');
        
        // Пробуем через L2 Resolver
        const resolver = new ethers.Contract(BASENAME_L2_RESOLVER, BASENAME_RESOLVER_ABI, provider);
        const name = await resolver.name(reverseNode);
        
        if (name && name.length > 0) {
            // Убираем .base если есть для более чистого отображения
            return name.replace('.base', '');
        }
    } catch (e) {
        console.log('Could not resolve basename:', e.message);
    }
    return null;
}

// Получить отображаемое имя пользователя
async function getUserDisplayName(address) {
    // Сначала пробуем Farcaster username (если в Warpcast)
    const farcasterName = await getFarcasterUsername();
    if (farcasterName) {
        console.log('Using Farcaster username:', farcasterName);
        return farcasterName;
    }
    
    // Затем пробуем Basename
    const basename = await getBasename(address);
    if (basename) {
        console.log('Using Basename:', basename);
        return basename;
    }
    
    // Если ничего не нашли, возвращаем короткий адрес
    return null;
}

// Показать информацию о кошельке (с именем если есть)
async function showWalletInfo(address) {
    if (!walletInfoEl) return;
    if (address) {
        // Сначала показываем короткий адрес
        const short = address.slice(0, 6) + '...' + address.slice(-4);
        walletInfoEl.textContent = `Connected: ${short}`;
        walletInfoEl.className = 'wallet-info connected';
        
        // Потом пробуем получить имя
        try {
            const displayName = await getUserDisplayName(address);
            if (displayName) {
                walletInfoEl.innerHTML = `<span class="wallet-name">🎮 ${displayName}</span>`;
                console.log('Displaying user as:', displayName);
            }
        } catch (e) {
            console.log('Could not get display name:', e.message);
        }
    } else {
        walletInfoEl.textContent = '';
        walletInfoEl.className = 'wallet-info';
    }
}

// Initialize Farcaster SDK
async function initFarcasterSDK() {
    try {
        // Wait for module to load
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Try to get Farcaster SDK from window (set by module script)
        if (typeof window.farcasterSDK !== 'undefined') {
            farcasterSDK = window.farcasterSDK;
            console.log('Farcaster SDK found');
        } else if (typeof window.sdk !== 'undefined') {
            farcasterSDK = window.sdk;
        }
        
        // Проверяем данные пользователя и обновляем UI
        setTimeout(() => {
            updateUserDisplay();
        }, 1000);
        
        return farcasterSDK;
    } catch (e) {
        console.log('Farcaster SDK init:', e.message);
        return null;
    }
}

// Обновление отображения пользователя
function updateUserDisplay() {
    // Проверяем Farcaster пользователя
    if (window.farcasterUser) {
        const user = window.farcasterUser;
        const username = user.username || user.displayName;
        const pfpUrl = user.pfpUrl || (user.pfp && user.pfp.url);
        
        if (username) {
            console.log('Updating UI for Farcaster user:', username);
            
            // Обновляем wallet-info
            const walletInfo = document.getElementById('wallet-info');
            if (walletInfo) {
                walletInfo.innerHTML = '<span class="wallet-name">🎮 ' + username + '</span>';
                walletInfo.className = 'wallet-info connected';
            }
            
            // Обновляем имя в профиле
            const profileName = document.getElementById('profile-name');
            if (profileName) {
                profileName.textContent = username;
            }
            
            // Добавляем приветствие в главное меню
            const menuContent = document.querySelector('.main-menu-content');
            if (menuContent) {
                let userGreeting = document.getElementById('user-greeting');
                if (!userGreeting) {
                    userGreeting = document.createElement('div');
                    userGreeting.id = 'user-greeting';
                    userGreeting.className = 'user-greeting';
                    const title = menuContent.querySelector('.menu-title');
                    if (title) {
                        menuContent.insertBefore(userGreeting, title);
                    }
                }
                userGreeting.innerHTML = '<span class="greeting-text">Welcome, <strong>' + username + '</strong>!</span>';
            }
            
            // Обновляем аватар если есть
            if (pfpUrl) {
                const profileAvatar = document.getElementById('profile-avatar-img');
                if (profileAvatar) {
                    profileAvatar.src = pfpUrl;
                }
            }
            
            // Сохраняем адрес пользователя
            if (user.custody || user.verifiedAddresses) {
                const addr = user.custody || (user.verifiedAddresses && user.verifiedAddresses[0]);
                if (addr) {
                    userAddress = addr;
                    showWalletInfo(addr);
                }
            }
        }
    }
    
    // Также пробуем автоподключить кошелёк если есть
    tryAutoConnectWallet();
}

// Автоподключение кошелька - приоритет Base App / Farcaster SDK
async function tryAutoConnectWallet() {
    try {
        let ethProvider = null;
        
        // Приоритет 1: Farcaster SDK (Base App)
        if (window.farcasterSDK && window.farcasterSDK.wallet) {
            try {
                ethProvider = await window.farcasterSDK.wallet.getEthereumProvider();
                console.log('✅ Base App wallet provider detected');
            } catch (e) {
                console.log('Farcaster wallet init:', e.message);
            }
        }
        
        // Приоритет 2: window.ethereum
        if (!ethProvider && typeof window.ethereum !== 'undefined') {
            ethProvider = window.ethereum;
        }
        
        if (ethProvider) {
            // Пробуем получить уже подключенные аккаунты (без popup)
            const accounts = await ethProvider.request({ method: 'eth_accounts' });
            if (accounts && accounts.length > 0) {
                userAddress = accounts[0];
                console.log('✅ Auto-connected wallet:', userAddress.slice(0, 8) + '...');
                
                if (!window.farcasterUser) {
                    showWalletInfo(userAddress);
                }
                
                // Сохраняем провайдер глобально
                window.connectedProvider = ethProvider;
            }
        }
    } catch (e) {
        console.log('Auto-connect:', e.message);
    }
}

// Check if we're in Farcaster/Warpcast
function isInFarcaster() {
    return farcasterSDK && farcasterSDK.wallet;
}

// Check if MetaMask or other wallet is available
function hasWeb3Wallet() {
    return typeof window.ethereum !== 'undefined' && window.ethereum.isMetaMask;
}

// Get Ethereum Provider
async function getProvider() {
    // First try Farcaster wallet provider
    if (isInFarcaster()) {
        try {
            const ethProvider = farcasterSDK.wallet.ethProvider;
            if (ethProvider) {
                console.log('Using Farcaster wallet provider');
                return new ethers.BrowserProvider(ethProvider);
            }
        } catch (e) {
            console.log('Farcaster wallet not available:', e.message);
        }
    }
    
    // Then try window.ethereum (MetaMask, Coinbase Wallet, etc.)
    if (typeof window.ethereum !== 'undefined') {
        try {
            console.log('Using window.ethereum provider');
            return new ethers.BrowserProvider(window.ethereum);
        } catch (e) {
            console.log('Failed to create provider:', e.message);
            return null;
        }
    }
    
    return null;
}

// Connect Wallet - simplified version
async function connectWallet() {
    console.log('=== Starting wallet connection ===');
    
    // Step 1: Check if wallet exists
    if (typeof window.ethereum === 'undefined') {
        showStatus('Нужен кошелек (MetaMask или Warpcast)', 'error');
        return false;
    }
    
    console.log('Step 1: window.ethereum exists');
    showStatus('Connecting...', 'loading');
    
    // Step 2: Request accounts
    try {
        console.log('Step 2: Requesting accounts...');
        const accounts = await window.ethereum.request({ 
            method: 'eth_requestAccounts' 
        });
        
        if (!accounts || accounts.length === 0) {
            showStatus('No accounts found', 'error');
            return false;
        }
        
        userAddress = accounts[0];
        console.log('Step 2 OK: Got address', userAddress);
    } catch (e) {
        console.error('Step 2 failed:', e);
        if (e.code === 4001) {
            showStatus('User rejected connection', 'error');
        } else {
            showStatus('Failed to get accounts: ' + e.message, 'error');
        }
        return false;
    }
    
    // Step 3: Create provider
    try {
        console.log('Step 3: Creating provider...');
        provider = new ethers.BrowserProvider(window.ethereum);
        console.log('Step 3 OK: Provider created');
    } catch (e) {
        console.error('Step 3 failed:', e);
        showStatus('Failed to create provider: ' + e.message, 'error');
        return false;
    }
    
    // Step 4: Get signer
    try {
        console.log('Step 4: Getting signer...');
        signer = await provider.getSigner();
        console.log('Step 4 OK: Signer ready');
    } catch (e) {
        console.error('Step 4 failed:', e);
        showStatus('Failed to get signer: ' + e.message, 'error');
        return false;
    }
    
    // Step 5: Check and switch network
    try {
        console.log('Step 5: Checking network...');
        const chainId = await window.ethereum.request({ method: 'eth_chainId' });
        console.log('Current chain:', chainId, 'Target:', TARGET_NETWORK.chainId);
        
        if (chainId.toLowerCase() !== TARGET_NETWORK.chainId.toLowerCase()) {
            showStatus('Switching to Base...', 'loading');
            console.log('Step 5: Switching network...');
            
            try {
                await window.ethereum.request({
                    method: 'wallet_switchEthereumChain',
                    params: [{ chainId: TARGET_NETWORK.chainId }]
                });
            } catch (switchError) {
                console.log('Switch error:', switchError);
                if (switchError.code === 4902) {
                    // Add Base network
                    await window.ethereum.request({
                        method: 'wallet_addEthereumChain',
                        params: [TARGET_NETWORK]
                    });
                } else if (switchError.code === 4001) {
                    showStatus('Network switch rejected', 'error');
                    return false;
                }
            }
            
            // Wait and refresh provider/signer
            await new Promise(r => setTimeout(r, 500));
            provider = new ethers.BrowserProvider(window.ethereum);
            signer = await provider.getSigner();
        }
        console.log('Step 5 OK: On correct network');
    } catch (e) {
        console.error('Step 5 failed:', e);
        // Network check failed but we can still try to proceed
        console.log('Continuing anyway...');
    }
    
    // Success!
    showWalletInfo(userAddress);
    showStatus('Connected!', 'success');
    console.log('=== Wallet connected successfully ===');
    return true;
}

// ============================================
// Switch to Base Network
// ============================================
async function ensureBaseNetwork() {
    if (typeof window.ethereum === 'undefined') {
        return false;
    }
    
    try {
        const chainId = await window.ethereum.request({ method: 'eth_chainId' });
        console.log('Current chain:', chainId, 'Target Base:', TARGET_NETWORK.chainId);
        
        if (chainId.toLowerCase() !== TARGET_NETWORK.chainId.toLowerCase()) {
            showStatus('Переключение на Base...', 'loading');
            
            try {
                await window.ethereum.request({
                    method: 'wallet_switchEthereumChain',
                    params: [{ chainId: TARGET_NETWORK.chainId }]
                });
                // Wait for network switch
                await new Promise(r => setTimeout(r, 1000));
                return true;
            } catch (switchError) {
                console.log('Switch error:', switchError);
                if (switchError.code === 4902) {
                    // Add Base network if not exists
                    try {
                        await window.ethereum.request({
                            method: 'wallet_addEthereumChain',
                            params: [TARGET_NETWORK]
                        });
                        await new Promise(r => setTimeout(r, 1000));
                        return true;
                    } catch (addError) {
                        console.error('Failed to add Base network:', addError);
                        showStatus('Не удалось добавить сеть Base. Добавьте вручную в MetaMask.', 'error');
                        return false;
                    }
                } else if (switchError.code === 4001) {
                    showStatus('Переключение на Base отменено', 'error');
                    return false;
                } else {
                    showStatus('Ошибка переключения сети: ' + (switchError.message || 'Unknown'), 'error');
                    return false;
                }
            }
        }
        return true; // Already on Base
    } catch (e) {
        console.error('Network check failed:', e);
        showStatus('Ошибка проверки сети', 'error');
        return false;
    }
}

// ============================================
// GM Function - Send onchain GM transaction
// ============================================

// Константы для GM системы
const GM_COOLDOWN_MS = 12 * 60 * 60 * 1000; // 12 часов между GM (2 в сутки)
const GM_MAX_PER_DAY = 2;

// GM Counter Functions
function getGMCount() {
    const count = localStorage.getItem('gm_total_count');
    return count ? parseInt(count, 10) : 0;
}

function incrementGMCount() {
    const currentCount = getGMCount();
    const newCount = currentCount + 1;
    localStorage.setItem('gm_total_count', newCount.toString());
    updateGMCounter();
    
    // Достижение за GM
    if (window.achievementSystem) {
        window.achievementSystem.registerGM();
    }
    
    return newCount;
}

// Получаем массив timestamps отправленных GM
function getGMTimestamps() {
    const data = localStorage.getItem('gm_timestamps');
    if (!data) {
        // Миграция старых данных - если есть gm_last_date, создаём timestamp
        const oldLastDate = localStorage.getItem('gm_last_date');
        if (oldLastDate) {
            // Создаём примерный timestamp из старой даты
            const approxTimestamp = new Date(oldLastDate).getTime() + (12 * 60 * 60 * 1000); // +12 часов
            localStorage.setItem('gm_timestamps', JSON.stringify([approxTimestamp]));
            return [approxTimestamp];
        }
        return [];
    }
    try {
        return JSON.parse(data);
    } catch (e) {
        return [];
    }
}

// Сохраняем timestamp нового GM
function saveGMTimestamp() {
    const timestamps = getGMTimestamps();
    timestamps.push(Date.now());
    // Храним только последние 10 записей
    if (timestamps.length > 10) timestamps.shift();
    localStorage.setItem('gm_timestamps', JSON.stringify(timestamps));
}

// Получаем количество GM за последние 24 часа
function getGMsInLast24Hours() {
    const timestamps = getGMTimestamps();
    const now = Date.now();
    const oneDayAgo = now - (24 * 60 * 60 * 1000);
    return timestamps.filter(ts => ts > oneDayAgo).length;
}

// Получаем время до следующего доступного GM (в мс)
function getTimeUntilNextGM() {
    const timestamps = getGMTimestamps();
    if (timestamps.length === 0) return 0;
    
    const now = Date.now();
    const oneDayAgo = now - (24 * 60 * 60 * 1000);
    const recentTimestamps = timestamps.filter(ts => ts > oneDayAgo).sort((a, b) => a - b);
    
    // Если меньше 2 GM за 24 часа - можно отправлять
    if (recentTimestamps.length < GM_MAX_PER_DAY) return 0;
    
    // Иначе ждём пока самый старый выйдет за пределы 24 часов
    const oldestRecent = recentTimestamps[0];
    const timeUntilAvailable = (oldestRecent + (24 * 60 * 60 * 1000)) - now;
    return Math.max(0, timeUntilAvailable);
}

// Форматирование времени ожидания
function formatTimeRemaining(ms) {
    if (ms <= 0) return 'Ready!';
    
    const hours = Math.floor(ms / (60 * 60 * 1000));
    const minutes = Math.floor((ms % (60 * 60 * 1000)) / (60 * 1000));
    const seconds = Math.floor((ms % (60 * 1000)) / 1000);
    
    if (hours > 0) {
        return `${hours}h ${minutes}m`;
    } else if (minutes > 0) {
        return `${minutes}m ${seconds}s`;
    } else {
        return `${seconds}s`;
    }
}

function getLastGMDate() {
    const timestamps = getGMTimestamps();
    if (timestamps.length === 0) return null;
    return new Date(timestamps[timestamps.length - 1]);
}

function formatDate(date) {
    if (!date) return 'Never';
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
        const hours = date.getHours().toString().padStart(2, '0');
        const mins = date.getMinutes().toString().padStart(2, '0');
        return `Today ${hours}:${mins}`;
    } else if (date.toDateString() === yesterday.toDateString()) {
        return 'Yesterday';
    } else {
        const daysAgo = Math.floor((today - date) / (1000 * 60 * 60 * 24));
        if (daysAgo < 7) {
            return `${daysAgo} days ago`;
        } else {
            return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' });
        }
    }
}

function updateGMCounter() {
    const counterValue = document.getElementById('gm-counter-value');
    const counterDate = document.getElementById('gm-counter-date');
    const counterBox = document.querySelector('.gm-counter-box');
    
    if (counterValue) {
        const count = getGMCount();
        const oldCount = parseInt(counterValue.textContent) || 0;
        counterValue.textContent = count;
        
        // Анимация при обновлении (только если count увеличился)
        if (count > oldCount) {
            counterValue.style.transform = 'scale(1.3)';
            counterValue.style.color = '#ff6b6b';
            
            // Добавляем glow эффект на бокс
            if (counterBox) {
                counterBox.classList.add('pulse-glow');
                setTimeout(() => counterBox.classList.remove('pulse-glow'), 500);
            }
            
            setTimeout(() => {
                counterValue.style.transform = 'scale(1)';
                counterValue.style.color = '';
            }, 300);
        }
    }
    
    if (counterDate) {
        const lastDate = getLastGMDate();
        counterDate.textContent = formatDate(lastDate);
    }
    
    // Обновляем статус кулдауна
    updateGMCooldownDisplay();
}

// Обновление отображения кулдауна
function updateGMCooldownDisplay() {
    const timeUntil = getTimeUntilNextGM();
    const remaining = getRemainingGMToday();
    const formattedTime = formatTimeRemaining(timeUntil);
    
    // Обновляем верхний счётчик
    const cooldownEl = document.getElementById('gm-cooldown');
    const cooldownTimerEl = document.getElementById('gm-cooldown-timer');
    
    if (cooldownEl) {
        if (timeUntil > 0) {
            cooldownEl.style.display = 'flex';
            if (cooldownTimerEl) {
                cooldownTimerEl.textContent = formattedTime;
            }
        } else {
            cooldownEl.style.display = 'none';
        }
    }
    
    // Обновляем панель GM
    const panelCooldownEl = document.getElementById('gm-cooldown-panel');
    const panelTimerEl = document.getElementById('gm-panel-cooldown-timer');
    
    if (panelCooldownEl) {
        if (timeUntil > 0) {
            panelCooldownEl.style.display = 'flex';
            if (panelTimerEl) {
                panelTimerEl.textContent = formattedTime;
            }
        } else {
            panelCooldownEl.style.display = 'none';
        }
    }
    
    // Обновляем текст remaining
    const gmRemainingEl = document.getElementById('gm-remaining');
    if (gmRemainingEl) {
        gmRemainingEl.textContent = remaining;
    }
    
    // Обновляем last date
    const gmLastDate = document.getElementById('gm-last-date');
    if (gmLastDate) {
        const lastDate = getLastGMDate();
        gmLastDate.textContent = formatDate(lastDate);
    }
}

// Check if GM can be sent (max 2 per 24 hours)
function canSendGMToday() {
    return getGMsInLast24Hours() < GM_MAX_PER_DAY;
}

// Get remaining GM count for 24 hours
function getRemainingGMToday() {
    return Math.max(0, GM_MAX_PER_DAY - getGMsInLast24Hours());
}

// Save GM with timestamp
function saveGMToday(txHash) {
    // Сохраняем timestamp
    saveGMTimestamp();
    
    // Обновляем legacy storage для совместимости
    localStorage.setItem('gm_last_date', new Date().toDateString());
    
    if (txHash) {
        localStorage.setItem('gm_last_tx', txHash);
    }
    incrementGMCount(); // Увеличиваем общий счетчик
}

// Get last GM transaction hash
function getLastGMTx() {
    return localStorage.getItem('gm_last_tx');
}

// Update GM panel info (remaining, streak, etc)
function updateGMPanelInfo() {
    const remaining = getRemainingGMToday();
    const gmRemainingEl = document.getElementById('gm-remaining');
    if (gmRemainingEl) {
        gmRemainingEl.textContent = remaining;
    }
    
    const gmPanelValue = document.getElementById('gm-panel-value');
    if (gmPanelValue) {
        gmPanelValue.textContent = getGMCount();
    }
    
    // Обновляем countdown
    updateGMCooldownDisplay();
}

// Интервал для обновления countdown таймера
let gmCountdownInterval = null;

function startGMCountdownTimer() {
    // Останавливаем предыдущий интервал если есть
    if (gmCountdownInterval) {
        clearInterval(gmCountdownInterval);
    }
    
    // Обновляем каждую секунду
    gmCountdownInterval = setInterval(() => {
        updateGMCooldownDisplay();
        
        // Обновляем состояние кнопок
        const btn = document.getElementById('gm-btn');
        const gmSendBtn = document.querySelector('.gm-send-btn');
        const remaining = getRemainingGMToday();
        const timeUntil = getTimeUntilNextGM();
        
        if (remaining > 0 && timeUntil <= 0) {
            if (btn) btn.disabled = false;
            if (gmSendBtn) gmSendBtn.disabled = false;
        }
    }, 1000);
}

// Таймер запускается в основной инициализации GM ниже

// Константы сети Base
const BASE_CHAIN_ID = '0x2105'; // 8453 в hex
const BASE_CHAIN_CONFIG = {
    chainId: BASE_CHAIN_ID,
    chainName: 'Base',
    nativeCurrency: {
        name: 'Ethereum',
        symbol: 'ETH',
        decimals: 18
    },
    rpcUrls: ['https://mainnet.base.org'],
    blockExplorerUrls: ['https://basescan.org']
};

// Функция переключения на сеть Base
async function switchToBase(ethProvider) {
    try {
        await ethProvider.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: BASE_CHAIN_ID }]
        });
        console.log('✅ Switched to Base network');
        return true;
    } catch (switchError) {
        // Если сеть не добавлена - добавляем её
        if (switchError.code === 4902) {
            try {
                await ethProvider.request({
                    method: 'wallet_addEthereumChain',
                    params: [BASE_CHAIN_CONFIG]
                });
                console.log('✅ Base network added');
                return true;
            } catch (addError) {
                console.error('Failed to add Base network:', addError);
                return false;
            }
        }
        console.error('Failed to switch network:', switchError);
        return false;
    }
}

// Получить лучший провайдер для спонсируемых транзакций
async function getBestProvider() {
    // 1. Farcaster/Base App (мобильный) - всегда спонсируется
    if (window.farcasterSDK && window.farcasterSDK.wallet) {
        try {
            const provider = await window.farcasterSDK.wallet.getEthereumProvider();
            console.log('✅ Using Farcaster/Base App (sponsored)');
            return { provider, type: 'farcaster', sponsored: true };
        } catch (e) {
            console.log('Farcaster not available:', e.message);
        }
    }
    
    // 2. Coinbase Smart Wallet (браузер) - спонсируемые транзакции
    if (window.coinbaseProvider) {
        console.log('✅ Using Coinbase Smart Wallet (sponsored)');
        return { provider: window.coinbaseProvider, type: 'coinbase', sponsored: true };
    }
    
    // 3. Обычный браузерный кошелёк (MetaMask и др.) - не спонсируется
    if (typeof window.ethereum !== 'undefined') {
        console.log('⚠️ Using browser wallet (NOT sponsored, needs gas)');
        return { provider: window.ethereum, type: 'browser', sponsored: false };
    }
    
    return null;
}

// GM function - спонсируемая транзакция через Coinbase Smart Wallet
async function sendGM() {
    console.log('🌞 sendGM called');
    const btn = document.getElementById('gm-btn');
    const gmSendBtn = document.querySelector('.gm-send-btn');
    
    if (btn) {
        btn.style.transform = 'scale(0.95)';
        setTimeout(() => btn.style.transform = '', 150);
    }
    
    const remaining = getRemainingGMToday();
    const timeUntil = getTimeUntilNextGM();
    
    if (remaining <= 0 || timeUntil > 0) {
        const waitTime = formatTimeRemaining(timeUntil);
        showStatus(`GM cooldown: ${waitTime} ⏰`, 'success');
        if (btn) btn.disabled = true;
        if (gmSendBtn) gmSendBtn.disabled = true;
        return;
    }
    
    if (btn) btn.disabled = true;
    if (gmSendBtn) gmSendBtn.disabled = true;
    
    try {
        showStatus('Connecting Smart Wallet... 🔗', 'loading');
        
        // Получаем лучший провайдер
        const walletInfo = await getBestProvider();
        
        if (!walletInfo) {
            showStatus('Click to connect Coinbase Smart Wallet 🔵', 'error');
            if (btn) btn.disabled = false;
            if (gmSendBtn) gmSendBtn.disabled = false;
            return;
        }
        
        const ethProvider = walletInfo.provider;
        const isSponsored = walletInfo.sponsored;
        
        // Запрашиваем подключение
        let accounts;
        try {
            accounts = await ethProvider.request({ method: 'eth_accounts' });
            if (!accounts || accounts.length === 0) {
                showStatus('Opening wallet...', 'loading');
                accounts = await ethProvider.request({ method: 'eth_requestAccounts' });
            }
        } catch (e) {
            if (e.code === 4001) {
                showStatus('Connection cancelled', 'error');
            } else {
                showStatus('Connect wallet first', 'error');
            }
            if (btn) btn.disabled = false;
            if (gmSendBtn) gmSendBtn.disabled = false;
            return;
        }
        
        if (!accounts || accounts.length === 0) {
            showStatus('Please connect your wallet', 'error');
            if (btn) btn.disabled = false;
            if (gmSendBtn) gmSendBtn.disabled = false;
            return;
        }
        
        const userAddr = accounts[0];
        console.log('Wallet:', userAddr, '| Sponsored:', isSponsored);
        
        // Для обычного браузерного кошелька - проверяем сеть
        if (walletInfo.type === 'browser') {
            const chainId = await ethProvider.request({ method: 'eth_chainId' });
            if (chainId !== BASE_CHAIN_ID) {
                showStatus('Switching to Base... 🔄', 'loading');
                const switched = await switchToBase(ethProvider);
                if (!switched) {
                    showStatus('Switch to Base network', 'error');
                    if (btn) btn.disabled = false;
                    if (gmSendBtn) gmSendBtn.disabled = false;
                    return;
                }
            }
        }
        
        showStatus(isSponsored ? 'Signing GM (FREE)... ☀️' : 'Signing GM... ☀️', 'loading');
        
        let txHash;
        
        // Отправляем нулевую транзакцию
        // Coinbase Smart Wallet автоматически спонсирует её
        txHash = await ethProvider.request({
            method: 'eth_sendTransaction',
            params: [{
                from: userAddr,
                to: userAddr,
                value: '0x0',
                data: '0x'
            }]
        });
        
        console.log('✅ GM TX:', txHash);
        
        let username = window.farcasterUser?.username || window.farcasterUser?.displayName || userAddr.slice(0,6) + '...' + userAddr.slice(-4);
        
        const gmRecord = {
            date: new Date().toISOString().split('T')[0],
            timestamp: Date.now(),
            user: username,
            address: userAddr,
            txHash: txHash,
            network: 'Base',
            sponsored: isSponsored
        };
        
        const gmHistory = JSON.parse(localStorage.getItem('gm_history') || '[]');
        gmHistory.unshift(gmRecord);
        if (gmHistory.length > 30) gmHistory.pop();
        localStorage.setItem('gm_history', JSON.stringify(gmHistory));
        
        saveGMToday(txHash);
        
        const newRemaining = getRemainingGMToday();
        const shortHash = txHash.slice(0, 8) + '...' + txHash.slice(-4);
        showStatus(`GM sent! ☀️ ${shortHash}${isSponsored ? ' (FREE)' : ''}`, 'success');
        
        updateGMCounter();
        updateGMPanelInfo();
        
        const gmPanelValue = document.getElementById('gm-panel-value');
        if (gmPanelValue) gmPanelValue.textContent = getGMCount();
        
        const gmLastDate = document.getElementById('gm-last-date');
        if (gmLastDate) gmLastDate.textContent = 'Today';
        
        createGMEffect();
        
        // Включаем кнопку обратно если ещё есть лимит
        if (newRemaining > 0) {
            if (btn) btn.disabled = false;
            if (gmSendBtn) gmSendBtn.disabled = false;
        }
        
        console.log('🔗 BaseScan: https://basescan.org/tx/' + txHash);
        
    } catch (error) {
        console.error('GM Error:', error);
        
        if (error.code === 4001 || error.message?.includes('rejected') || error.message?.includes('denied')) {
            showStatus('Transaction cancelled', 'error');
        } else if (error.message?.includes('insufficient')) {
            showStatus('Use Coinbase Smart Wallet for FREE tx', 'error');
        } else {
            showStatus('Error: ' + (error.message || 'Try Coinbase Wallet'), 'error');
        }
        
        if (btn) btn.disabled = false;
        if (gmSendBtn) gmSendBtn.disabled = false;
    }
}

// Инициализация GM системы
window.addEventListener('DOMContentLoaded', () => {
    // Инициализируем состояние кнопки GM
    setTimeout(() => {
        const btn = document.getElementById('gm-btn');
        const gmSendBtn = document.querySelector('.gm-send-btn');
        const remaining = getRemainingGMToday();
        const timeUntil = getTimeUntilNextGM();

        // Обновляем панель GM и счётчик
        updateGMPanelInfo();
        updateGMCounter();
        
        // Запускаем countdown таймер
        startGMCountdownTimer();

        // Дизейблим кнопку если нет лимита или ещё кулдаун
        if (remaining <= 0 || timeUntil > 0) {
            if (btn) btn.disabled = true;
            if (gmSendBtn) gmSendBtn.disabled = true;
        } else {
            if (btn) btn.disabled = false;
            if (gmSendBtn) gmSendBtn.disabled = false;
        }
        console.log('GM system initialized - Total GMs:', getGMCount(), '| Remaining:', remaining, '| Cooldown:', formatTimeRemaining(timeUntil));
    }, 100);
});

// Создаем визуальный эффект GM
function createGMEffect() {
    for (let i = 0; i < 5; i++) {
        setTimeout(() => {
            const sun = document.createElement('div');
            sun.innerHTML = '☀️';
            sun.style.cssText = `
                position: fixed;
                font-size: 30px;
                left: ${20 + Math.random() * 60}%;
                top: 50%;
                z-index: 10000;
                pointer-events: none;
                animation: gmFloat 1.5s ease-out forwards;
            `;
            document.body.appendChild(sun);
            setTimeout(() => sun.remove(), 1500);
        }, i * 100);
    }
    
    if (!document.getElementById('gm-effect-styles')) {
        const style = document.createElement('style');
        style.id = 'gm-effect-styles';
        style.textContent = `
            @keyframes gmFloat {
                0% { transform: translateY(0) scale(1); opacity: 1; }
                100% { transform: translateY(-100px) scale(1.5); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }
}

// ============================================
// Deploy Contract Function - автоматический без popup'а для Base MiniApp
// ============================================

// Deploy Contract - спонсируемая транзакция через Coinbase Smart Wallet
async function deployContract() {
    console.log('📜 deployContract called');
    const btn = document.getElementById('deploy-btn');
    if (btn) btn.disabled = true;
    
    try {
        showStatus('Connecting Smart Wallet... 🔗', 'loading');
        
        const currentScore = window.game ? window.game.score : 0;
        
        // Получаем лучший провайдер
        const walletInfo = await getBestProvider();
        
        if (!walletInfo) {
            showStatus('Click to connect Coinbase Smart Wallet 🔵', 'error');
            if (btn) btn.disabled = false;
            return;
        }
        
        const ethProvider = walletInfo.provider;
        const isSponsored = walletInfo.sponsored;
        
        // Запрашиваем подключение
        let accounts;
        try {
            accounts = await ethProvider.request({ method: 'eth_accounts' });
            if (!accounts || accounts.length === 0) {
                showStatus('Opening wallet...', 'loading');
                accounts = await ethProvider.request({ method: 'eth_requestAccounts' });
            }
        } catch (e) {
            if (e.code === 4001) {
                showStatus('Connection cancelled', 'error');
            } else {
                showStatus('Connect wallet first', 'error');
            }
            if (btn) btn.disabled = false;
            return;
        }
        
        if (!accounts || accounts.length === 0) {
            showStatus('Please connect your wallet', 'error');
            if (btn) btn.disabled = false;
            return;
        }
        
        const userAddr = accounts[0];
        console.log('Wallet:', userAddr, '| Sponsored:', isSponsored);
        
        // Для обычного браузерного кошелька - проверяем сеть
        if (walletInfo.type === 'browser') {
            const chainId = await ethProvider.request({ method: 'eth_chainId' });
            if (chainId !== BASE_CHAIN_ID) {
                showStatus('Switching to Base... 🔄', 'loading');
                const switched = await switchToBase(ethProvider);
                if (!switched) {
                    showStatus('Switch to Base network', 'error');
                    if (btn) btn.disabled = false;
                    return;
                }
            }
        }
        
        showStatus(isSponsored ? 'Signing deploy (FREE)... 📜' : 'Signing deploy... 📜', 'loading');
        
        let txHash;
        
        // Нулевая транзакция - спонсируется Coinbase Smart Wallet
        txHash = await ethProvider.request({
            method: 'eth_sendTransaction',
            params: [{
                from: userAddr,
                to: userAddr,
                value: '0x0',
                data: '0x'
            }]
        });
        
        console.log('✅ Deploy TX:', txHash);
        
        let username = window.farcasterUser?.username || window.farcasterUser?.displayName || userAddr.slice(0,6) + '...' + userAddr.slice(-4);
        
        const deployRecord = {
            txHash: txHash,
            score: currentScore,
            user: username,
            address: userAddr,
            timestamp: Date.now(),
            network: 'Base',
            sponsored: isSponsored
        };
        
        const deployHistory = JSON.parse(localStorage.getItem('deploy_history') || '[]');
        deployHistory.unshift(deployRecord);
        if (deployHistory.length > 10) deployHistory.pop();
        localStorage.setItem('deploy_history', JSON.stringify(deployHistory));
        
        const shortHash = txHash.slice(0, 8) + '...' + txHash.slice(-4);
        showStatus(`Deployed! 📜 ${shortHash}${isSponsored ? ' (FREE)' : ''}`, 'success');
        
        createDeployEffect();
        
        console.log('🔗 BaseScan: https://basescan.org/tx/' + txHash);
        
    } catch (error) {
        console.error('Deploy Error:', error);
        
        if (error.code === 4001 || error.message?.includes('rejected') || error.message?.includes('denied')) {
            showStatus('Transaction cancelled', 'error');
        } else if (error.message?.includes('insufficient')) {
            showStatus('Use Coinbase Smart Wallet for FREE tx', 'error');
        } else {
            showStatus('Error: ' + (error.message || 'Try Coinbase Wallet'), 'error');
        }
    } finally {
        if (btn) btn.disabled = false;
    }
}

// Создаем визуальный эффект деплоя
function createDeployEffect() {
    for (let i = 0; i < 5; i++) {
        setTimeout(() => {
            const rocket = document.createElement('div');
            rocket.innerHTML = '🚀';
            rocket.style.cssText = `
                position: fixed;
                font-size: 30px;
                left: ${20 + Math.random() * 60}%;
                top: 60%;
                z-index: 10000;
                pointer-events: none;
                animation: deployFloat 1.5s ease-out forwards;
            `;
            document.body.appendChild(rocket);
            setTimeout(() => rocket.remove(), 1500);
        }, i * 100);
    }
    
    if (!document.getElementById('deploy-effect-styles')) {
        const style = document.createElement('style');
        style.id = 'deploy-effect-styles';
        style.textContent = `
            @keyframes deployFloat {
                0% { transform: translateY(0) scale(1); opacity: 1; }
                100% { transform: translateY(-150px) scale(1.5); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }
}


// ============================================
// СИСТЕМА ДОСТИЖЕНИЙ
// ============================================

class AchievementSystem {
    constructor() {
        // Pokemon avatar URL helper - animated GIFs!
        const pokemonAvatar = (id) => `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/${id}.gif`;
        const pokemonStatic = (id) => `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
        const pokemonShiny = (id) => `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/shiny/${id}.gif`;
        
        // Pikachu special variants
        this.pikachuVariants = [
            { id: 'pikachu_normal', name: 'Pikachu Classic', avatar: pokemonAvatar(25), color: '#FFD700' },
            { id: 'pikachu_shiny', name: 'Pikachu Shiny ✨', avatar: pokemonShiny(25), color: '#FF8C00' },
            { id: 'pikachu_female', name: 'Pikachu Female 💕', avatar: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/female/25.gif`, color: '#FF69B4' },
            { id: 'raichu_normal', name: 'Raichu Thunder', avatar: pokemonAvatar(26), color: '#FF6B35' },
            { id: 'raichu_shiny', name: 'Raichu Shiny ✨', avatar: pokemonShiny(26), color: '#8B4513' },
            { id: 'pichu_normal', name: 'Pichu Baby', avatar: pokemonAvatar(172), color: '#FFEB3B' },
            { id: 'pichu_shiny', name: 'Pichu Shiny ✨', avatar: pokemonShiny(172), color: '#FFD54F' },
        ];
        
        this.achievements = [
            // ============================================
            // PLAY STREAK ACHIEVEMENTS (12) - Balanced XP progression
            // Formula: XP grows ~2.5x per tier, matching level progression
            // ============================================
            { id: 'streak_1', name: '1-Day Magikarp Splash', desc: 'Daily splash: play today and revive Magikarp!', icon: '🐟', unlocked: false, category: 'streak', xpBonus: 500, avatar: pokemonAvatar(129), badge: '🔥 1 Day' },
            { id: 'streak_3', name: '3-Day Eevee Spark', desc: '3 days in a row: Eevee sparkles with persistence!', icon: '🐾', unlocked: false, category: 'streak', xpBonus: 1500, avatar: pokemonAvatar(133), badge: '⚡ 3 Days' },
            { id: 'streak_7', name: '7-Day Pikachu Bolt', desc: 'Week of lightning: Unlock SHINY Pikachu avatar!', icon: '⚡', unlocked: false, category: 'streak', xpBonus: 5000, avatar: pokemonShiny(25), badge: '✨ Week' },
            { id: 'streak_14', name: '14-Day Charizard Blaze', desc: '14 days of fire: Charizard takes flight!', icon: '🔥', unlocked: false, category: 'streak', xpBonus: 15000, avatar: pokemonAvatar(6), badge: '🔥 2 Weeks' },
            { id: 'streak_21', name: '21-Day Blastoise Shell', desc: '21 days of protection: Blastoise is impenetrable!', icon: '🌊', unlocked: false, category: 'streak', xpBonus: 35000, legendary: true, avatar: pokemonAvatar(9), badge: '🌊 3 Weeks' },
            { id: 'streak_30', name: '30-Day Venusaur Bloom', desc: 'Month of growth: Venusaur blooms!', icon: '🌿', unlocked: false, category: 'streak', xpBonus: 80000, legendary: true, avatar: pokemonAvatar(3), badge: '🌿 Month' },
            { id: 'streak_45', name: '45-Day Dragonite Storm', desc: '45 days of storm: Dragonite guards the streak!', icon: '🐉', unlocked: false, category: 'streak', xpBonus: 200000, legendary: true, avatar: pokemonAvatar(149), badge: '🐉 45 Days' },
            { id: 'streak_60', name: '60-Day Rayquaza Vortex', desc: '2 months of vortex: Rayquaza rules!', icon: '🐲', unlocked: false, category: 'streak', xpBonus: 500000, legendary: true, avatar: pokemonAvatar(384), badge: '🌪️ 2 Months' },
            { id: 'streak_75', name: '75-Day Mewtwo Psychic', desc: '75 days: SHINY Mewtwo reads your moves!', icon: '🧠', unlocked: false, category: 'streak', xpBonus: 1200000, legendary: true, avatar: pokemonShiny(150), badge: '🧠 75 Days' },
            { id: 'streak_90', name: '90-Day Arceus Eternal', desc: '90 days: SHINY Arceus blesses you!', icon: '👑', unlocked: false, category: 'streak', xpBonus: 3000000, legendary: true, avatar: pokemonShiny(493), badge: '👑 3 Months' },
            { id: 'streak_100', name: '100-Day Kyogre Tsunami', desc: '100 days: SHINY Kyogre drowns failures!', icon: '🌊', unlocked: false, category: 'streak', xpBonus: 8000000, legendary: true, avatar: pokemonShiny(382), badge: '🌊 100 Days' },
            { id: 'streak_200', name: '200-Day Dialga Time', desc: '200 days: SHINY Dialga warps reality!', icon: '💎', unlocked: false, category: 'streak', xpBonus: 30000000, legendary: true, avatar: pokemonShiny(483), badge: '💎 200 Days' },
            
            // ============================================
            // GM ACHIEVEMENTS (11) - Balanced for daily engagement
            // ============================================
            { id: 'gm_first', name: 'Bulbasaur Seed GM', desc: 'First GM: plant the seed of daily habit!', icon: '🌿', unlocked: false, category: 'gm', xpBonus: 300, avatar: pokemonAvatar(1), badge: '☀️ First GM' },
            { id: 'gm_streak_5', name: 'Squirtle Bubble GM', desc: '5-day GM streak: motivation bubbles never pop!', icon: '🌊', unlocked: false, category: 'gm', xpBonus: 1000, avatar: pokemonAvatar(7), badge: '💧 5 Streak' },
            { id: 'gm_total_10', name: 'Charmander Ember GM', desc: '10 total GM: the smoldering fire of routine is lit!', icon: '🔥', unlocked: false, category: 'gm', xpBonus: 2500, avatar: pokemonAvatar(4), badge: '🔥 10 GM' },
            { id: 'gm_morning', name: 'Morning Lucario Aura', desc: 'Morning GM (before 12:00): day aura charged!', icon: '🔵', unlocked: false, category: 'daily', xpBonus: 500, avatar: pokemonAvatar(448), badge: '🌅 Morning' },
            { id: 'gm_evening', name: 'Evening Snorlax Nap', desc: 'Evening GM (after 20:00): lazy champion rests!', icon: '😴', unlocked: false, category: 'daily', xpBonus: 750, avatar: pokemonAvatar(143), badge: '🌙 Evening' },
            { id: 'gm_week_perfect', name: 'Gym Boulder Brock', desc: '7 GM in a week: first gym badge for perfect week!', icon: '🪨', unlocked: false, category: 'gm', xpBonus: 8000, avatar: pokemonAvatar(74), badge: '🥇 Gym 1' },
            { id: 'gm_2week_perfect', name: 'Gym Cascade Misty', desc: '14 GM in 2 weeks: water badge without gaps!', icon: '💧', unlocked: false, category: 'gm', xpBonus: 20000, avatar: pokemonAvatar(121), badge: '🥈 Gym 2' },
            { id: 'gm_month_20', name: 'Elite Flareon Heat', desc: '20 GM in current month: evolution of heat!', icon: '🐾', unlocked: false, category: 'gm', xpBonus: 40000, avatar: pokemonAvatar(136), badge: '🔥 Elite' },
            { id: 'gm_streak_30', name: 'Legend Lugia Storm', desc: '30-day GM streak: storm of silver wing!', icon: '🕊️', unlocked: false, category: 'gm', xpBonus: 100000, legendary: true, avatar: pokemonAvatar(249), badge: '🕊️ Legend' },
            { id: 'gm_total_50', name: 'Master Mew Glide', desc: '50 total GM: psi-glide to mastery!', icon: '🧠', unlocked: false, category: 'gm', xpBonus: 250000, legendary: true, avatar: pokemonAvatar(151), badge: '✨ Master' },
            { id: 'gm_total_100', name: 'Regional Kanto Complete', desc: '100 GM: entire Kanto region conquered with dailies!', icon: '📜', unlocked: false, category: 'gm', xpBonus: 600000, legendary: true, avatar: pokemonAvatar(150), badge: '🏆 Kanto' },
            
            // ============================================
            // MERGE ACHIEVEMENTS (18) - Smooth XP curve ~2x per tier
            // ============================================
            { id: 'merge_5', name: 'Magikarp Splash', desc: 'First splash: 5 merges - evolution begins!', icon: '🐟', unlocked: false, category: 'merges', xpBonus: 100, avatar: pokemonAvatar(129), badge: '💫 5' },
            { id: 'merge_20', name: 'Rattata Gnaw', desc: 'Gnaw tiles: 20 merges for the pack!', icon: '🐀', unlocked: false, category: 'merges', xpBonus: 300, avatar: pokemonAvatar(19), badge: '🦷 20' },
            { id: 'merge_40', name: 'Pidgey Jump', desc: 'Take off: 40 merges - wings spread!', icon: '🕊️', unlocked: false, category: 'merges', xpBonus: 600, avatar: pokemonAvatar(16), badge: '🪶 40' },
            { id: 'merge_80', name: 'Pikachu Charge', desc: 'Pikachu charges: 80 merges! Unlock Pikachu avatar!', icon: '⚡', unlocked: false, category: 'merges', xpBonus: 1200, avatar: pokemonAvatar(25), badge: '⚡ 80' },
            { id: 'merge_150', name: 'Eevee Forms', desc: 'Eevee transforms: 150 evolution merges!', icon: '🐾', unlocked: false, category: 'merges', xpBonus: 2500, avatar: pokemonAvatar(133), badge: '🐾 150' },
            { id: 'merge_250', name: 'Scyther Slash', desc: 'Blade cuts: 250 merges - grid warrior!', icon: '⚔️', unlocked: false, category: 'merges', xpBonus: 5000, avatar: pokemonAvatar(123), badge: '⚔️ 250' },
            { id: 'merge_400', name: 'Umbreon Night', desc: 'Darkness merges: 400 shadow merges!', icon: '🌑', unlocked: false, category: 'merges', xpBonus: 10000, avatar: pokemonAvatar(197), badge: '🌙 400' },
            { id: 'merge_700', name: 'Lucario Sense', desc: 'Aura move: 700 master merges!', icon: '🔵', unlocked: false, category: 'merges', xpBonus: 20000, avatar: pokemonAvatar(448), badge: '🔵 700' },
            { id: 'merge_1200', name: 'Salamence Flight', desc: 'Dragon soars: 1200 sky merges!', icon: '🐉', unlocked: false, category: 'merges', xpBonus: 40000, avatar: pokemonAvatar(373), badge: '🐉 1.2K' },
            { id: 'merge_2000', name: 'Staraptor Fury', desc: 'Storm rage: 2000 storm merges!', icon: '🦅', unlocked: false, category: 'merges', xpBonus: 80000, avatar: pokemonAvatar(398), badge: '🦅 2K' },
            { id: 'merge_3500', name: 'Hydreigon Chaos', desc: 'Three-headed terror: 3500 madness merges!', icon: '🐉', unlocked: false, category: 'merges', xpBonus: 150000, legendary: true, avatar: pokemonShiny(635), badge: '💀 3.5K' },
            { id: 'merge_6000', name: 'Zekrom Thunder', desc: 'Emperor of current: 6000 lightning merges!', icon: '⚡', unlocked: false, category: 'merges', xpBonus: 300000, legendary: true, avatar: pokemonShiny(644), badge: '⚡ 6K' },
            { id: 'merge_9000', name: 'Reshiram Flame', desc: 'White fire: 9000 flame merges!', icon: '🔥', unlocked: false, category: 'merges', xpBonus: 600000, legendary: true, avatar: pokemonShiny(643), badge: '🔥 9K' },
            { id: 'merge_15000', name: 'Kyurem Ice', desc: 'Freeze: 15000 ice merges!', icon: '❄️', unlocked: false, category: 'merges', xpBonus: 1200000, legendary: true, avatar: pokemonShiny(646), badge: '❄️ 15K' },
            { id: 'merge_25000', name: 'Arceus Forms', desc: 'God changes types: 25000 divine merges!', icon: '✨', unlocked: false, category: 'merges', xpBonus: 2500000, legendary: true, avatar: pokemonShiny(493), badge: '✨ 25K' },
            { id: 'combo_3', name: 'Triple Vortex', desc: '3 merges in one move: Caterpie vortex!', icon: '🌪️', unlocked: false, category: 'merges', xpBonus: 3000, avatar: pokemonAvatar(10), badge: '🌪️ x3' },
            { id: 'combo_4', name: 'Fourth Strike', desc: '4 merges in one move: Onix drills tunnel!', icon: '🐍', unlocked: false, category: 'merges', xpBonus: 10000, avatar: pokemonAvatar(95), badge: '💥 x4' },
            { id: 'combo_5', name: 'Fivefold Claw', desc: '5 merges in one move: Kabutops cuts chain!', icon: '🦀', unlocked: false, category: 'merges', xpBonus: 30000, avatar: pokemonAvatar(141), badge: '⚡ x5' },
            
            // ============================================
            // SCORE ACHIEVEMENTS (10) - Based on difficulty ~2.5x per tier
            // ============================================
            { id: 'score_500', name: 'Caterpie Silk Shot', desc: 'First silk: 500 pts - web of success!', icon: '🐛', unlocked: false, category: 'score', xpBonus: 200, avatar: pokemonAvatar(10), badge: '🎯 500' },
            { id: 'score_1000', name: 'Weedle Poison Sting', desc: 'Poison sting: 1000 pts - stinger on target!', icon: '🐝', unlocked: false, category: 'score', xpBonus: 500, avatar: pokemonAvatar(13), badge: '🎯 1K' },
            { id: 'score_2000', name: 'Pidgey Gust Wing', desc: 'Beginner breeze: 2000 pts of flight!', icon: '🕊️', unlocked: false, category: 'score', xpBonus: 1000, avatar: pokemonAvatar(17), badge: '🎯 2K' },
            { id: 'score_2048', name: 'Pikachu Quick Attack', desc: 'Lightning strike: 2048 pts - Pikachu victory!', icon: '⚡', unlocked: false, category: 'score', xpBonus: 2500, avatar: pokemonAvatar(25), badge: '🏆 2048' },
            { id: 'score_4096', name: 'Rattata Hyper Fang', desc: 'Hyper bite: 4096 pts of gnawing!', icon: '🐀', unlocked: false, category: 'score', xpBonus: 5000, avatar: pokemonAvatar(20), badge: '🏆 4K' },
            { id: 'score_8192', name: 'Eevee Swift Adapt', desc: 'Quick adaptation: 8192 evolution pts!', icon: '🐾', unlocked: false, category: 'score', xpBonus: 12000, avatar: pokemonAvatar(134), badge: '🏆 8K' },
            { id: 'score_16384', name: 'Grovyle Leaf Blade', desc: 'Leaf blade: 16384 jungle pts!', icon: '🌿', unlocked: false, category: 'score', xpBonus: 30000, legendary: true, avatar: pokemonAvatar(253), badge: '👑 16K' },
            { id: 'score_32768', name: 'Lucario Bone Rush', desc: 'Aura strike: 32768 power pts!', icon: '🔵', unlocked: false, category: 'score', xpBonus: 75000, legendary: true, avatar: pokemonAvatar(448), badge: '👑 32K' },
            { id: 'score_65536', name: 'Garchomp Draco Meteor', desc: 'Draco meteor: 65536 earthquake pts!', icon: '🌋', unlocked: false, category: 'score', xpBonus: 180000, legendary: true, avatar: pokemonAvatar(445), badge: '👑 65K' },
            { id: 'score_131072', name: 'Rayquaza Dragon Ascent', desc: 'Dragon ascent: 131072 sky pts!', icon: '🐲', unlocked: false, category: 'score', xpBonus: 400000, legendary: true, avatar: pokemonAvatar(384), badge: '👑 131K' },
            
            // ============================================
            // LEVEL ACHIEVEMENTS (13) - ~5-10% of XP needed for that level
            // Helps progression without making it too easy
            // ============================================
            { id: 'level_1', name: 'Lvl 1 Seedot Starter', desc: 'First lvl: Seedot plants the seed of legend!', icon: '🌿', unlocked: false, category: 'levels', xpBonus: 500, avatar: pokemonAvatar(273), badge: '⭐ Lvl 1' },
            { id: 'level_10', name: 'Lvl 10 Pikachu Spark', desc: 'Lvl 10: Pikachu sparks in profile!', icon: '⚡', unlocked: false, category: 'levels', xpBonus: 2000, avatar: pokemonAvatar(25), badge: '⭐ Lvl 10' },
            { id: 'level_50', name: 'Lvl 50 Treecko Leaf', desc: 'Lvl 50: Treecko grows in XP jungle!', icon: '🌿', unlocked: false, category: 'levels', xpBonus: 8000, avatar: pokemonAvatar(252), badge: '⭐ Lvl 50' },
            { id: 'level_100', name: 'Lvl 100 Grovyle Blade', desc: 'Lvl 100: Grovyle cuts barriers!', icon: '⚔️', unlocked: false, category: 'levels', xpBonus: 20000, avatar: pokemonAvatar(253), badge: '🌟 Lvl 100' },
            { id: 'level_500', name: 'Lvl 500 Lucario Aura', desc: 'Lvl 500: Lucario aura illuminates profile!', icon: '🔵', unlocked: false, category: 'levels', xpBonus: 80000, legendary: true, avatar: pokemonAvatar(448), badge: '💫 Lvl 500' },
            { id: 'level_1000', name: 'Lvl 1000 Garchomp Quake', desc: 'Lvl 1000: Garchomp shakes XP-ground!', icon: '🌋', unlocked: false, category: 'levels', xpBonus: 200000, legendary: true, avatar: pokemonAvatar(445), badge: '🔥 Lvl 1K' },
            { id: 'level_2000', name: 'Lvl 2000 Rayquaza Ascent', desc: 'Lvl 2000: Rayquaza ascends to heavens!', icon: '🐲', unlocked: false, category: 'levels', xpBonus: 500000, legendary: true, avatar: pokemonAvatar(384), badge: '🐉 Lvl 2K' },
            { id: 'level_3000', name: 'Lvl 3000 Mewtwo Psyche', desc: 'Lvl 3000: Mewtwo reads lvl-code!', icon: '🧠', unlocked: false, category: 'levels', xpBonus: 1000000, legendary: true, avatar: pokemonAvatar(150), badge: '🧠 Lvl 3K' },
            { id: 'level_5000', name: 'Lvl 5000 Kyurem Freeze', desc: 'Lvl 5000: SHINY Kyurem freezes competitors!', icon: '❄️', unlocked: false, category: 'levels', xpBonus: 3000000, legendary: true, avatar: pokemonShiny(646), badge: '❄️ Lvl 5K' },
            { id: 'level_7000', name: 'Lvl 7000 Zekrom Volt', desc: 'Lvl 7000: SHINY Zekrom strikes leaderboard!', icon: '⚡', unlocked: false, category: 'levels', xpBonus: 8000000, legendary: true, avatar: pokemonShiny(644), badge: '⚡ Lvl 7K' },
            { id: 'level_8000', name: 'Lvl 8000 Reshiram Blaze', desc: 'Lvl 8000: SHINY Reshiram burns XP records!', icon: '🔥', unlocked: false, category: 'levels', xpBonus: 15000000, legendary: true, avatar: pokemonShiny(643), badge: '🔥 Lvl 8K' },
            { id: 'level_9000', name: 'Lvl 9000 Giratina Void', desc: 'Lvl 9000: SHINY Giratina warps into legend!', icon: '👻', unlocked: false, category: 'levels', xpBonus: 30000000, legendary: true, avatar: pokemonShiny(487), badge: '👻 Lvl 9K' },
            { id: 'level_10000', name: 'Lvl 10000 Arceus Alpha', desc: 'Lvl 10000: SHINY Arceus - alpha god!', icon: '👑', unlocked: false, category: 'levels', xpBonus: 80000000, legendary: true, avatar: pokemonShiny(493), badge: '👑 MAX' },
            
            // ============================================
            // DAILY CHALLENGE ACHIEVEMENTS (11) - Scaled by difficulty
            // ============================================
            { id: 'daily_zap', name: 'Daily Pikachu Zap', desc: 'Charge the day with lightning: 1 GM + play 1 game!', icon: '⚡', unlocked: false, category: 'daily', xpBonus: 500, avatar: pokemonAvatar(172), badge: '⚡ Daily' },
            { id: 'daily_evolve', name: 'Daily Eevee Evolve', desc: 'Evolve routine: 1 GM + reach 128 tile!', icon: '🐾', unlocked: false, category: 'daily', xpBonus: 800, avatar: pokemonAvatar(133), badge: '🐾 128' },
            { id: 'daily_ignite', name: 'Daily Charmander Ignite', desc: 'Ignite the fire: 1 GM + 500 pts!', icon: '🔥', unlocked: false, category: 'daily', xpBonus: 1000, avatar: pokemonAvatar(4), badge: '🔥 500pts' },
            { id: 'daily_surge', name: 'Daily Squirtle Surge', desc: 'Wave of activity: 1 GM + 10 merges!', icon: '🌊', unlocked: false, category: 'daily', xpBonus: 1500, avatar: pokemonAvatar(7), badge: '🌊 10x' },
            { id: 'daily_grow', name: 'Daily Bulbasaur Grow', desc: 'Stretch streak: 1 GM + 20 moves + 1000 pts!', icon: '🌿', unlocked: false, category: 'daily', xpBonus: 2000, avatar: pokemonAvatar(1), badge: '🌿 1Kpts' },
            { id: 'daily_flight', name: 'Daily Pidgey Flight', desc: 'Fly easy: 1 GM + 3 games!', icon: '🕊️', unlocked: false, category: 'daily', xpBonus: 3000, avatar: pokemonAvatar(18), badge: '🕊️ 3 Games' },
            { id: 'daily_drill', name: 'Daily Onix Drill', desc: 'Drill the day: 1 GM + 50 merges!', icon: '🐍', unlocked: false, category: 'daily', xpBonus: 5000, avatar: pokemonAvatar(95), badge: '🐍 50x' },
            { id: 'daily_sing', name: 'Daily Jigglypuff Sing', desc: 'Lull laziness to sleep: 1 GM + 2000 pts!', icon: '💤', unlocked: false, category: 'daily', xpBonus: 8000, avatar: pokemonAvatar(39), badge: '💤 2Kpts' },
            { id: 'daily_sense', name: 'Daily Lucario Sense', desc: 'Feel the victory: 1 GM + reach 512 tile!', icon: '🔵', unlocked: false, category: 'daily', xpBonus: 15000, avatar: pokemonAvatar(447), badge: '🔵 512' },
            { id: 'daily_rush', name: 'Daily Rayquaza Rush', desc: 'Draco rush: 1 GM + 2048 in <=50 moves!', icon: '🐉', unlocked: false, category: 'daily', xpBonus: 40000, legendary: true, avatar: pokemonAvatar(384), badge: '🐉 Speed' },
            { id: 'daily_ritual', name: 'Daily Arceus Ritual', desc: 'Divine ritual: 1 GM + 3000 pts!', icon: '👑', unlocked: false, category: 'daily', xpBonus: 100000, legendary: true, avatar: pokemonAvatar(493), badge: '👑 3Kpts' },
            
            // ============================================
            // ELEMENT ACHIEVEMENTS (12) - Unlock elements by reaching scores
            // ============================================
            { id: 'element_fire', name: 'Fire Type Master', desc: 'Reach Fire element (100+ pts)!', icon: '🔥', unlocked: false, category: 'elements', xpBonus: 200, avatar: pokemonAvatar(6), badge: '🔥 Fire' },
            { id: 'element_water', name: 'Water Type Master', desc: 'Reach Water element (300+ pts)!', icon: '💧', unlocked: false, category: 'elements', xpBonus: 400, avatar: pokemonAvatar(9), badge: '💧 Water' },
            { id: 'element_electric', name: 'Electric Type Master', desc: 'Reach Electric element (600+ pts)!', icon: '⚡', unlocked: false, category: 'elements', xpBonus: 800, avatar: pokemonAvatar(26), badge: '⚡ Electric' },
            { id: 'element_grass', name: 'Grass Type Master', desc: 'Reach Grass element (1000+ pts)!', icon: '🌿', unlocked: false, category: 'elements', xpBonus: 1500, avatar: pokemonAvatar(3), badge: '🌿 Grass' },
            { id: 'element_ice', name: 'Ice Type Master', desc: 'Reach Ice element (7000+ pts)!', icon: '❄️', unlocked: false, category: 'elements', xpBonus: 8000, avatar: pokemonAvatar(131), badge: '❄️ Ice' },
            { id: 'element_fighting', name: 'Fighting Type Master', desc: 'Reach Fighting element (10000+ pts)!', icon: '🥊', unlocked: false, category: 'elements', xpBonus: 12000, avatar: pokemonAvatar(68), badge: '🥊 Fighting' },
            { id: 'element_psychic', name: 'Psychic Type Master', desc: 'Reach Psychic element (15000+ pts)!', icon: '🔮', unlocked: false, category: 'elements', xpBonus: 18000, avatar: pokemonAvatar(65), badge: '🔮 Psychic' },
            { id: 'element_ghost', name: 'Ghost Type Master', desc: 'Reach Ghost element (20000+ pts)!', icon: '👻', unlocked: false, category: 'elements', xpBonus: 25000, avatar: pokemonAvatar(94), badge: '👻 Ghost' },
            { id: 'element_dragon', name: 'Dragon Type Master', desc: 'Reach Dragon element (50000+ pts)!', icon: '🐉', unlocked: false, category: 'elements', xpBonus: 60000, legendary: true, avatar: pokemonAvatar(149), badge: '🐉 Dragon' },
            { id: 'element_cosmic', name: 'Cosmic Type Master', desc: 'Reach Cosmic element (60000+ pts)!', icon: '🌌', unlocked: false, category: 'elements', xpBonus: 80000, legendary: true, avatar: pokemonAvatar(385), badge: '🌌 Cosmic' },
            { id: 'element_shadow', name: 'Shadow Type Master', desc: 'Reach Shadow element (75000+ pts)!', icon: '🖤', unlocked: false, category: 'elements', xpBonus: 100000, legendary: true, avatar: pokemonShiny(197), badge: '🖤 Shadow' },
            { id: 'element_legendary', name: 'Legendary Type Master', desc: 'Reach Legendary element (100000+ pts)!', icon: '✨', unlocked: false, category: 'elements', xpBonus: 150000, legendary: true, avatar: pokemonShiny(493), badge: '✨ Legendary' },
            
            // ============================================
            // SPECIAL PRO ACHIEVEMENTS (10) - For skilled players
            // ============================================
            { id: 'pro_games_10', name: 'Getting Started', desc: 'Play 10 total games!', icon: '🎮', unlocked: false, category: 'special', xpBonus: 1000, avatar: pokemonAvatar(133), badge: '🎮 10 Games' },
            { id: 'pro_games_25', name: 'Regular Player', desc: 'Play 25 total games!', icon: '🕹️', unlocked: false, category: 'special', xpBonus: 3000, avatar: pokemonAvatar(196), badge: '🕹️ 25 Games' },
            { id: 'pro_games_50', name: 'Dedicated Player', desc: 'Play 50 total games!', icon: '🎯', unlocked: false, category: 'special', xpBonus: 8000, avatar: pokemonAvatar(376), badge: '🎯 50 Games' },
            { id: 'pro_games_100', name: 'Veteran Player', desc: 'Play 100 total games!', icon: '🏆', unlocked: false, category: 'special', xpBonus: 20000, legendary: true, avatar: pokemonShiny(376), badge: '🏆 100 Games' },
            { id: 'pro_speed_1k', name: 'Speed Demon', desc: 'Reach 1000 pts in under 20 moves!', icon: '⚡', unlocked: false, category: 'special', xpBonus: 8000, avatar: pokemonAvatar(135), badge: '⚡ Speed' },
            { id: 'pro_speed_2k', name: 'Lightning Fast', desc: 'Reach 2000 pts in under 35 moves!', icon: '🏃', unlocked: false, category: 'special', xpBonus: 20000, avatar: pokemonShiny(135), badge: '🏃 Fast' },
            { id: 'pro_survivor', name: 'Grid Survivor', desc: 'Continue playing after grid was 90% full!', icon: '💪', unlocked: false, category: 'special', xpBonus: 5000, avatar: pokemonAvatar(68), badge: '💪 Survivor' },
            { id: 'pro_first_merge', name: 'First Blood', desc: 'Make your very first merge!', icon: '🩸', unlocked: false, category: 'special', xpBonus: 100, avatar: pokemonAvatar(133), badge: '🩸 First!' },
            { id: 'pro_lucky_4', name: 'Lucky Four', desc: 'Get a 4 tile to spawn (25% chance)!', icon: '🍀', unlocked: false, category: 'special', xpBonus: 500, avatar: pokemonAvatar(35), badge: '🍀 Lucky' },
            { id: 'pro_marathon', name: 'Marathon Runner', desc: 'Play single game for 200+ moves!', icon: '🏃‍♂️', unlocked: false, category: 'special', xpBonus: 8000, avatar: pokemonAvatar(289), badge: '🏃 Marathon' },
            { id: 'pro_tile_4096', name: 'Beyond Master', desc: 'Reach the legendary 4096 tile!', icon: '💎', unlocked: false, category: 'special', xpBonus: 50000, legendary: true, avatar: pokemonShiny(384), badge: '💎 4096' },
            { id: 'pro_moves_1k', name: 'First Steps', desc: 'Make 1000 total moves!', icon: '👟', unlocked: false, category: 'special', xpBonus: 2000, avatar: pokemonAvatar(56), badge: '👟 1K' },
            { id: 'pro_moves_2500', name: 'Keep Moving', desc: 'Make 2500 total moves!', icon: '🚶', unlocked: false, category: 'special', xpBonus: 5000, avatar: pokemonAvatar(107), badge: '🚶 2.5K' },
            { id: 'pro_moves_5k', name: 'Move Master', desc: 'Make 5000 total moves!', icon: '👣', unlocked: false, category: 'special', xpBonus: 10000, avatar: pokemonAvatar(237), badge: '👣 5K' },
            { id: 'pro_moves_10k', name: 'Movement God', desc: 'Make 10000 total moves!', icon: '🦶', unlocked: false, category: 'special', xpBonus: 25000, legendary: true, avatar: pokemonShiny(237), badge: '🦶 10K' },
            { id: 'pro_night_owl', name: 'Night Owl', desc: 'Play a game after midnight!', icon: '🦉', unlocked: false, category: 'special', xpBonus: 2000, avatar: pokemonAvatar(164), badge: '🦉 Night' },
            { id: 'pro_weekend', name: 'Weekend Warrior', desc: 'Play on Saturday or Sunday!', icon: '🎉', unlocked: false, category: 'special', xpBonus: 1500, avatar: pokemonAvatar(52), badge: '🎉 Weekend' },
            { id: 'pro_new_record', name: 'Record Breaker', desc: 'Beat your own high score!', icon: '🏅', unlocked: false, category: 'special', xpBonus: 3000, avatar: pokemonAvatar(392), badge: '🏅 Record' },
        ];
        
        this.stats = {
            totalMerges: 0,
            totalGames: 0,
            totalMoves: 0,
            highestTile: 0,
            highestScore: 0,
            comboThisTurn: 0,
            movesThisGame: 0,
            // Play streak tracking
            playStreak: 0,
            lastPlayDate: null,
            // GM tracking
            totalGM: 0,
            gmStreak: 0,
            lastGMDate: null,
            gmThisMonth: 0,
            gmThisWeek: 0,
            // Daily challenge tracking
            todayGM: false,
            todayGames: 0,
            todayMerges: 0,
            todayScore: 0,
            todayHighestTile: 0,
            todayMoves: 0,
            lastDailyReset: null,
            // Special achievements tracking
            gridWas90Full: false
        };
        
        this.loadProgress();
        this.createUI();
    }
    
    // Загрузка прогресса из localStorage
    loadProgress() {
        try {
            // ONE-TIME RESET: Сброс достижений полученных через баг с тестом
            // Этот код выполнится один раз и удалит себя
            const resetVersion = localStorage.getItem('pokemon2048_achievements_reset_v2');
            if (!resetVersion) {
                console.log('🔄 One-time achievements reset (test mode bug fix)');
                localStorage.removeItem('pokemon2048_achievements');
                localStorage.setItem('pokemon2048_achievements_reset_v2', 'done');
                // Не загружаем старые данные - начинаем с чистого листа
                return;
            }
            
            const saved = localStorage.getItem('pokemon2048_achievements');
            if (saved) {
                const data = JSON.parse(saved);
                // Восстанавливаем статус разблокировки
                if (data.unlocked) {
                    data.unlocked.forEach(id => {
                        const ach = this.achievements.find(a => a.id === id);
                        if (ach) ach.unlocked = true;
                    });
                }
                // Восстанавливаем статистику
                if (data.stats) {
                    this.stats = { ...this.stats, ...data.stats };
                }
            }
        } catch (e) {
            console.log('Не удалось загрузить достижения:', e);
        }
    }
    
    // Сохранение прогресса
    saveProgress() {
        try {
            const data = {
                unlocked: this.achievements.filter(a => a.unlocked).map(a => a.id),
                stats: this.stats
            };
            localStorage.setItem('pokemon2048_achievements', JSON.stringify(data));
        } catch (e) {
            console.log('Не удалось сохранить достижения:', e);
        }
    }
    
    // Разблокировать достижение
    unlock(id) {
        // Блокируем получение достижений в тестовом режиме!
        if (window.isTestMode) {
            return false;
        }
        
        const achievement = this.achievements.find(a => a.id === id);
        if (achievement && !achievement.unlocked) {
            achievement.unlocked = true;
            this.showNotification(achievement);
            this.saveProgress();
            this.updateUI();
            return true;
        }
        return false;
    }
    
    // Show achievement notification
    showNotification(achievement) {
        const xpBonusHtml = achievement.xpBonus 
            ? `<div class="achievement-notification-xp">+${this.formatXP(achievement.xpBonus)} XP</div>` 
            : '';
        
        const avatarHtml = achievement.avatar 
            ? `<div class="achievement-notification-avatar"><img src="${achievement.avatar}" alt="Avatar Reward" onerror="this.style.display='none'"><span>🖼️ Avatar Unlocked!</span></div>`
            : '';
        
        const iconContent = achievement.avatar 
            ? `<img src="${achievement.avatar}" alt="${achievement.name}" class="notification-avatar-img" onerror="this.outerHTML='${achievement.icon}'">`
            : achievement.icon;
        
        const notification = document.createElement('div');
        notification.className = `achievement-notification ${achievement.legendary ? 'legendary' : ''} ${achievement.avatar ? 'has-avatar' : ''}`;
        notification.innerHTML = `
            <div class="achievement-notification-content">
                <div class="achievement-notification-icon">${iconContent}</div>
                <div class="achievement-notification-info">
                    <div class="achievement-notification-title">🏆 Achievement!</div>
                    <div class="achievement-notification-name">${achievement.name}</div>
                    <div class="achievement-notification-desc">${achievement.desc}</div>
                    ${xpBonusHtml}
                    ${avatarHtml}
                </div>
            </div>
        `;
        document.body.appendChild(notification);
        
        // Remove after 5 seconds (longer for avatar rewards)
        const displayTime = achievement.avatar ? 5000 : 4000;
        setTimeout(() => {
            notification.classList.add('fade-out');
            setTimeout(() => notification.remove(), 500);
        }, displayTime);
    }
    
    // Check tile achievements
    checkTileAchievements(value) {
        if (value > this.stats.highestTile) {
            this.stats.highestTile = value;
        }
        
        // Track daily highest tile
        this.resetDailyIfNeeded();
        if (value > this.stats.todayHighestTile) {
            this.stats.todayHighestTile = value;
        }
        
        // Beyond Master: Reach 4096 tile
        if (value >= 4096) {
            this.unlock('pro_tile_4096');
        }
        
        // Check daily achievements
        this.checkDailyAchievements();
    }
    
    // Check score achievements
    checkScoreAchievements(score) {
        if (score > this.stats.highestScore) {
            this.stats.highestScore = score;
        }
        
        // Track daily score
        this.resetDailyIfNeeded();
        if (score > this.stats.todayScore) {
            this.stats.todayScore = score;
        }
        
        const scoreThresholds = [
            { score: 500, id: 'score_500' },
            { score: 1000, id: 'score_1000' },
            { score: 2000, id: 'score_2000' },
            { score: 2048, id: 'score_2048' },
            { score: 4096, id: 'score_4096' },
            { score: 8192, id: 'score_8192' },
            { score: 16384, id: 'score_16384' },
            { score: 32768, id: 'score_32768' },
            { score: 65536, id: 'score_65536' },
            { score: 131072, id: 'score_131072' }
        ];
        
        scoreThresholds.forEach(t => {
            if (score >= t.score) {
                this.unlock(t.id);
            }
        });
        
        // Speed achievements (check moves in current game)
        if (score >= 1000 && this.stats.movesThisGame < 20) {
            this.unlock('pro_speed_1k');
        }
        if (score >= 2000 && this.stats.movesThisGame < 35) {
            this.unlock('pro_speed_2k');
        }
        
        // Time-based achievements
        const hour = new Date().getHours();
        if (hour >= 0 && hour < 5) {
            this.unlock('pro_night_owl');
        }
        const day = new Date().getDay();
        if (day === 0 || day === 6) {
            this.unlock('pro_weekend');
        }
        
        // Marathon: 200+ moves in one game
        if (this.stats.movesThisGame >= 200) {
            this.unlock('pro_marathon');
        }
        
        // Check daily achievements
        this.checkDailyAchievements();
    }
    
    // Check element achievements
    checkElementAchievement(elementType) {
        const elementAchievements = {
            'fire': 'element_fire',
            'water': 'element_water',
            'electric': 'element_electric',
            'grass': 'element_grass',
            'ice': 'element_ice',
            'fighting': 'element_fighting',
            'psychic': 'element_psychic',
            'ghost': 'element_ghost',
            'dragon': 'element_dragon',
            'cosmic': 'element_cosmic',
            'shadow': 'element_shadow',
            'legendary': 'element_legendary'
        };
        
        if (elementAchievements[elementType]) {
            this.unlock(elementAchievements[elementType]);
        }
    }
    
    // Check special pro achievements (legacy - most checks are now inline)
    checkSpecialAchievements(gameData) {
        // Special achievements are now checked directly in:
        // - checkScoreAchievements: speed, time-based, marathon
        // - checkTileAchievements: 4096 tile
        // - registerMove: cumulative moves
        // - registerNewGame: cumulative games
        // - trackGridFull: survivor
    }
    
    // Check first merge achievement
    checkFirstMerge() {
        this.unlock('pro_first_merge');
    }
    
    // Check lucky 4 spawn
    checkLucky4Spawn() {
        this.unlock('pro_lucky_4');
    }
    
    // Check new record
    checkNewRecord(newScore, oldRecord) {
        if (newScore > oldRecord && oldRecord > 0) {
            this.unlock('pro_new_record');
        }
    }
    
    // Track grid was full (for survivor achievement)
    trackGridFull() {
        this.stats.gridWas90Full = true;
        this.unlock('pro_survivor');
        this.saveProgress();
    }
    
    // Check level achievements
    checkLevelAchievement(level) {
        const levelAchievements = {
            1: 'level_1',
            10: 'level_10',
            50: 'level_50',
            100: 'level_100',
            500: 'level_500',
            1000: 'level_1000',
            2000: 'level_2000',
            3000: 'level_3000',
            5000: 'level_5000',
            7000: 'level_7000',
            8000: 'level_8000',
            9000: 'level_9000',
            10000: 'level_10000'
        };
        
        // Check all levels up to current
        Object.keys(levelAchievements).forEach(lvl => {
            if (level >= parseInt(lvl)) {
                const unlocked = this.unlock(levelAchievements[lvl]);
                
                // If unlocked - award bonus XP
                if (unlocked && window.menuSystem) {
                    const achievement = this.achievements.find(a => a.id === levelAchievements[lvl]);
                    if (achievement && achievement.xpBonus) {
                        window.menuSystem.addXP(achievement.xpBonus, 'achievement');
                    }
                }
            }
        });
    }
    
    // Check play streak achievements
    checkStreakAchievements() {
        const today = new Date().toDateString();
        
        if (this.stats.lastPlayDate !== today) {
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            
            if (this.stats.lastPlayDate === yesterday.toDateString()) {
                this.stats.playStreak++;
            } else if (this.stats.lastPlayDate !== today) {
                this.stats.playStreak = 1;
            }
            this.stats.lastPlayDate = today;
            this.saveProgress();
        }
        
        const streakAchievements = {
            1: 'streak_1',
            3: 'streak_3',
            7: 'streak_7',
            14: 'streak_14',
            21: 'streak_21',
            30: 'streak_30',
            45: 'streak_45',
            60: 'streak_60',
            75: 'streak_75',
            90: 'streak_90',
            100: 'streak_100',
            200: 'streak_200'
        };
        
        Object.keys(streakAchievements).forEach(days => {
            if (this.stats.playStreak >= parseInt(days)) {
                this.unlock(streakAchievements[days]);
            }
        });
    }
    
    // Check GM achievements
    checkGMAchievements(isMorning = false, isEvening = false) {
        const today = new Date().toDateString();
        const currentMonth = new Date().getMonth();
        const currentWeek = this.getWeekNumber(new Date());
        
        // Reset daily tracking if new day
        this.resetDailyIfNeeded();
        
        // Update GM streak
        if (this.stats.lastGMDate !== today) {
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            
            if (this.stats.lastGMDate === yesterday.toDateString()) {
                this.stats.gmStreak++;
            } else {
                this.stats.gmStreak = 1;
            }
            this.stats.lastGMDate = today;
            this.stats.totalGM++;
            this.stats.gmThisMonth++;
            this.stats.gmThisWeek++;
            this.stats.todayGM = true;
        }
        
        // Check GM achievements
        if (this.stats.totalGM >= 1) this.unlock('gm_first');
        if (this.stats.gmStreak >= 5) this.unlock('gm_streak_5');
        if (this.stats.totalGM >= 10) this.unlock('gm_total_10');
        if (isMorning) this.unlock('gm_morning');
        if (isEvening) this.unlock('gm_evening');
        if (this.stats.gmThisWeek >= 7) this.unlock('gm_week_perfect');
        if (this.stats.gmStreak >= 14) this.unlock('gm_2week_perfect');
        if (this.stats.gmThisMonth >= 20) this.unlock('gm_month_20');
        if (this.stats.gmStreak >= 30) this.unlock('gm_streak_30');
        if (this.stats.totalGM >= 50) this.unlock('gm_total_50');
        if (this.stats.totalGM >= 100) this.unlock('gm_total_100');
        
        this.checkDailyAchievements();
        this.saveProgress();
    }
    
    // Get week number
    getWeekNumber(date) {
        const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
        const pastDaysOfYear = (date - firstDayOfYear) / 86400000;
        return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
    }
    
    // Reset daily stats if new day
    resetDailyIfNeeded() {
        const today = new Date().toDateString();
        if (this.stats.lastDailyReset !== today) {
            this.stats.todayGM = false;
            this.stats.todayGames = 0;
            this.stats.todayMerges = 0;
            this.stats.todayScore = 0;
            this.stats.todayHighestTile = 0;
            this.stats.todayMoves = 0;
            this.stats.lastDailyReset = today;
            
            // Reset weekly GM if new week
            const currentWeek = this.getWeekNumber(new Date());
            const lastWeek = this.stats.lastWeekNumber || 0;
            if (currentWeek !== lastWeek) {
                this.stats.gmThisWeek = 0;
                this.stats.lastWeekNumber = currentWeek;
            }
            
            // Reset monthly GM if new month
            const currentMonth = new Date().getMonth();
            const lastMonth = this.stats.lastMonthNumber;
            if (currentMonth !== lastMonth) {
                this.stats.gmThisMonth = 0;
                this.stats.lastMonthNumber = currentMonth;
            }
        }
    }
    
    // Check daily challenge achievements
    checkDailyAchievements() {
        if (!this.stats.todayGM) return;
        
        // Daily Pikachu Zap: 1 GM + 1 game
        if (this.stats.todayGames >= 1) this.unlock('daily_zap');
        
        // Daily Eevee Evolve: 1 GM + 128 tile
        if (this.stats.todayHighestTile >= 128) this.unlock('daily_evolve');
        
        // Daily Charmander Ignite: 1 GM + 500 pts
        if (this.stats.todayScore >= 500) this.unlock('daily_ignite');
        
        // Daily Squirtle Surge: 1 GM + 10 merges
        if (this.stats.todayMerges >= 10) this.unlock('daily_surge');
        
        // Daily Bulbasaur Grow: 1 GM + 20 moves + 1000 pts
        if (this.stats.todayMoves >= 20 && this.stats.todayScore >= 1000) this.unlock('daily_grow');
        
        // Daily Pidgey Flight: 1 GM + 3 games
        if (this.stats.todayGames >= 3) this.unlock('daily_flight');
        
        // Daily Onix Drill: 1 GM + 50 merges
        if (this.stats.todayMerges >= 50) this.unlock('daily_drill');
        
        // Daily Jigglypuff Sing: 1 GM + 2000 pts
        if (this.stats.todayScore >= 2000) this.unlock('daily_sing');
        
        // Daily Lucario Sense: 1 GM + 512 tile
        if (this.stats.todayHighestTile >= 512) this.unlock('daily_sense');
        
        // Daily Rayquaza Rush: 1 GM + 2048 in <=50 moves
        if (this.stats.todayHighestTile >= 2048 && this.stats.todayMoves <= 50) this.unlock('daily_rush');
        
        // Daily Arceus Ritual: 1 GM + 3000 pts
        if (this.stats.todayScore >= 3000) this.unlock('daily_ritual');
    }
    
    // Register tile merge
    registerMerge(count = 1) {
        // First merge achievement
        if (this.stats.totalMerges === 0) {
            this.checkFirstMerge();
        }
        
        this.stats.totalMerges += count;
        this.stats.comboThisTurn += count;
        
        // Track daily merges
        this.resetDailyIfNeeded();
        this.stats.todayMerges += count;
        
        // Check merge achievements
        const mergeThresholds = [
            { count: 5, id: 'merge_5' },
            { count: 20, id: 'merge_20' },
            { count: 40, id: 'merge_40' },
            { count: 80, id: 'merge_80' },
            { count: 150, id: 'merge_150' },
            { count: 250, id: 'merge_250' },
            { count: 400, id: 'merge_400' },
            { count: 700, id: 'merge_700' },
            { count: 1200, id: 'merge_1200' },
            { count: 2000, id: 'merge_2000' },
            { count: 3500, id: 'merge_3500' },
            { count: 6000, id: 'merge_6000' },
            { count: 9000, id: 'merge_9000' },
            { count: 15000, id: 'merge_15000' },
            { count: 25000, id: 'merge_25000' }
        ];
        
        mergeThresholds.forEach(t => {
            if (this.stats.totalMerges >= t.count) {
                this.unlock(t.id);
            }
        });
        
        // Check daily achievements
        this.checkDailyAchievements();
        this.saveProgress();
    }
    
    // Register move
    registerMove() {
        this.stats.totalMoves++;
        this.stats.movesThisGame++;
        
        // Track daily moves
        this.resetDailyIfNeeded();
        this.stats.todayMoves++;
        
        // Check combo achievements
        if (this.stats.comboThisTurn >= 3) this.unlock('combo_3');
        if (this.stats.comboThisTurn >= 4) this.unlock('combo_4');
        if (this.stats.comboThisTurn >= 5) this.unlock('combo_5');
        
        // Reset combo for next move
        this.stats.comboThisTurn = 0;
        
        // Check cumulative move achievements
        if (this.stats.totalMoves >= 1000) this.unlock('pro_moves_1k');
        if (this.stats.totalMoves >= 2500) this.unlock('pro_moves_2500');
        if (this.stats.totalMoves >= 5000) this.unlock('pro_moves_5k');
        if (this.stats.totalMoves >= 10000) this.unlock('pro_moves_10k');
        
        // Check daily achievements
        this.checkDailyAchievements();
        this.saveProgress();
    }
    
    // Register new game
    registerNewGame() {
        this.stats.totalGames++;
        this.stats.movesThisGame = 0;
        this.stats.comboThisTurn = 0;
        this.stats.gridWas90Full = false; // Reset for new game
        
        // Track daily games
        this.resetDailyIfNeeded();
        this.stats.todayGames++;
        
        // Check play streak achievements
        this.checkStreakAchievements();
        
        // Check games achievements (cumulative)
        if (this.stats.totalGames >= 10) this.unlock('pro_games_10');
        if (this.stats.totalGames >= 25) this.unlock('pro_games_25');
        if (this.stats.totalGames >= 50) this.unlock('pro_games_50');
        if (this.stats.totalGames >= 100) this.unlock('pro_games_100');
        
        // Check daily achievements
        this.checkDailyAchievements();
        
        this.saveProgress();
    }
    
    // Check quick start (deprecated - kept for compatibility)
    checkQuickStart(score) {
        // Quick start achievement has been replaced with Pokemon-themed achievements
    }
    
    // Register GM transaction
    registerGM() {
        const currentHour = new Date().getHours();
        const isMorning = currentHour < 12;
        const isEvening = currentHour >= 20;
        
        this.checkGMAchievements(isMorning, isEvening);
    }
    
    // Создать UI для достижений
    createUI() {
        // Кнопка открытия панели достижений
        const btn = document.createElement('button');
        btn.id = 'achievements-btn';
        btn.className = 'achievements-toggle-btn';
        btn.innerHTML = `🏆 <span class="achievements-count">${this.getUnlockedCount()}/${this.achievements.length}</span>`;
        btn.onclick = () => this.togglePanel();
        
        // Добавляем кнопку в контейнер с кнопками web3
        const web3Buttons = document.querySelector('.web3-buttons');
        if (web3Buttons) {
            web3Buttons.appendChild(btn);
        }
        
        // Панель достижений
        const panel = document.createElement('div');
        panel.id = 'achievements-panel';
        panel.className = 'achievements-panel';
        panel.innerHTML = this.generatePanelHTML();
        document.body.appendChild(panel);
        
        // Закрытие по клику вне панели (не при скролле)
        panel.addEventListener('click', (e) => {
            if (e.target === panel && !window.panelScrolled) {
                this.closeAndReturn();
            }
        });
    }
    
    // Format XP for display (1000000 -> 1M, etc.)
    formatXP(xp) {
        if (xp >= 1000000000) return (xp / 1000000000).toFixed(1) + 'B';
        if (xp >= 1000000) return (xp / 1000000).toFixed(1) + 'M';
        if (xp >= 1000) return (xp / 1000).toFixed(0) + 'K';
        return xp.toString();
    }
    
    // Generate panel HTML
    generatePanelHTML() {
        const categories = {
            'streak': { name: 'Play Streak 🔥', achievements: [] },
            'gm': { name: 'GM Missions ☀️', achievements: [] },
            'merges': { name: 'Merges 🔗', achievements: [] },
            'score': { name: 'Score 🏆', achievements: [] },
            'levels': { name: 'Profile Levels ⭐', achievements: [] },
            'daily': { name: 'Daily Challenges 📅', achievements: [] },
            'elements': { name: 'Elements 🌈', achievements: [] },
            'special': { name: 'Pro Skills 🎯', achievements: [] }
        };
        
        this.achievements.forEach(a => {
            if (categories[a.category]) {
                categories[a.category].achievements.push(a);
            }
        });
        
        let html = `
            <div class="achievements-panel-content" onclick="event.stopPropagation()">
                <div class="achievements-header">
                    <h2>🏆 Достижения</h2>
                    <div class="achievements-progress">
                        <div class="achievements-progress-bar" style="width: ${(this.getUnlockedCount() / this.achievements.length) * 100}%"></div>
                        <span>${this.getUnlockedCount()} / ${this.achievements.length}</span>
                    </div>
                    <button class="achievements-close-btn" onclick="window.achievementSystem.closeAndReturn()">←</button>
                </div>
                <div class="achievements-stats">
                    <div class="stat-item">
                        <span class="stat-icon">🎮</span>
                        <span class="stat-value">${this.stats.totalGames}</span>
                        <span class="stat-label">Игр</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-icon">🔗</span>
                        <span class="stat-value">${this.stats.totalMerges}</span>
                        <span class="stat-label">Слияний</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-icon">⬆️</span>
                        <span class="stat-value">${this.stats.highestTile}</span>
                        <span class="stat-label">Макс. плитка</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-icon">🏅</span>
                        <span class="stat-value">${this.stats.highestScore}</span>
                        <span class="stat-label">Рекорд</span>
                    </div>
                </div>
                <div class="achievements-list">
        `;
        
        Object.values(categories).forEach(cat => {
            if (cat.achievements.length > 0) {
                html += `<div class="achievements-category">
                    <h3>${cat.name}</h3>
                    <div class="achievements-grid">`;
                
                cat.achievements.forEach(a => {
                    const hasAvatar = !!a.avatar;
                    
                    // Always show colorful animated Pokemon (no grayscale!)
                    const iconContent = hasAvatar 
                        ? `<img src="${a.avatar}" alt="${a.name}" class="achievement-avatar ${a.unlocked ? 'unlocked-avatar' : 'preview-avatar'}" onerror="this.outerHTML='<span class=\\'emoji-icon\\'>${a.icon}</span>'">`
                        : `<span class="emoji-icon ${a.unlocked ? 'unlocked-emoji' : 'preview-emoji'}">${a.icon}</span>`;
                    
                    // Status indicator (checkmark for unlocked, lock for locked)
                    const statusIcon = a.unlocked 
                        ? '<div class="status-unlocked">✅</div>' 
                        : '<div class="status-locked">🔒</div>';
                    
                    const xpBadge = a.xpBonus ? `<div class="achievement-xp ${a.legendary ? 'legendary-xp' : ''}">+${this.formatXP(a.xpBonus)} XP</div>` : '';
                    
                    // Colorful custom badge from achievement data
                    const badgeText = a.badge || a.icon;
                    const badgeClass = a.legendary ? 'legendary-badge' : (a.unlocked ? 'unlocked-badge' : 'locked-badge');
                    const rewardBadge = `<div class="achievement-badge ${badgeClass}">${badgeText}</div>`;
                    
                    html += `
                        <div class="achievement-item ${a.unlocked ? 'unlocked' : 'locked'} ${a.legendary ? 'legendary' : ''} ${hasAvatar ? 'has-avatar' : ''}">
                            <div class="achievement-icon-wrapper">
                                <div class="achievement-icon">${iconContent}</div>
                                ${statusIcon}
                            </div>
                            <div class="achievement-info">
                                <div class="achievement-name">${a.name}</div>
                                <div class="achievement-desc">${a.desc}</div>
                                ${xpBadge}
                            </div>
                            ${rewardBadge}
                        </div>
                    `;
                });
                
                html += `</div></div>`;
            }
        });
        
        html += `</div></div>`;
        return html;
    }
    
    // Получить количество разблокированных
    getUnlockedCount() {
        return this.achievements.filter(a => a.unlocked).length;
    }
    
    // Get all unique avatars from achievements
    getAllAvatars() {
        const avatars = [];
        const seenUrls = new Set();
        
        // Add Pikachu variants first
        this.pikachuVariants.forEach(variant => {
            avatars.push({
                id: variant.id,
                name: variant.name,
                avatar: variant.avatar,
                color: variant.color,
                unlocked: this.isPikachuVariantUnlocked(variant.id),
                isPikachu: true
            });
        });
        
        // Add avatars from achievements
        this.achievements.forEach(a => {
            if (a.avatar && !seenUrls.has(a.avatar)) {
                seenUrls.add(a.avatar);
                avatars.push({
                    id: a.id,
                    name: a.name,
                    avatar: a.avatar,
                    badge: a.badge,
                    unlocked: a.unlocked,
                    legendary: a.legendary,
                    isPikachu: false
                });
            }
        });
        
        return avatars;
    }
    
    // Check if Pikachu variant is unlocked
    isPikachuVariantUnlocked(variantId) {
        // Unlock conditions for Pikachu variants
        const conditions = {
            'pikachu_normal': true, // Always unlocked
            'pikachu_shiny': this.stats.playStreak >= 7, // 7-day streak
            'pikachu_female': this.stats.totalGM >= 10, // 10 total GM
            'raichu_normal': this.stats.totalMerges >= 500, // 500 merges
            'raichu_shiny': this.stats.totalMerges >= 2000, // 2000 merges
            'pichu_normal': this.stats.totalGames >= 10, // 10 games
            'pichu_shiny': this.stats.totalGames >= 50, // 50 games
        };
        return conditions[variantId] || false;
    }
    
    // Get selected avatar
    getSelectedAvatar() {
        try {
            const saved = localStorage.getItem('pokemon2048_selected_avatar');
            if (saved) {
                return JSON.parse(saved);
            }
        } catch (e) {}
        // Default to classic Pikachu
        return { 
            id: 'pikachu_normal', 
            avatar: this.pikachuVariants[0].avatar,
            name: 'Pikachu Classic'
        };
    }
    
    // Set selected avatar
    setSelectedAvatar(avatarData) {
        try {
            localStorage.setItem('pokemon2048_selected_avatar', JSON.stringify(avatarData));
            // Update profile avatar
            const profileImg = document.getElementById('profile-avatar-img');
            if (profileImg) {
                profileImg.src = avatarData.avatar;
            }
            // Show notification
            this.showAvatarChangeNotification(avatarData);
        } catch (e) {
            console.log('Avatar save error:', e);
        }
    }
    
    // Show avatar change notification
    showAvatarChangeNotification(avatarData) {
        const notification = document.createElement('div');
        notification.className = 'avatar-change-notification';
        notification.innerHTML = `
            <div class="avatar-change-content">
                <img src="${avatarData.avatar}" alt="${avatarData.name}" class="avatar-change-img">
                <div class="avatar-change-text">
                    <div class="avatar-change-title">Avatar Changed!</div>
                    <div class="avatar-change-name">${avatarData.name}</div>
                </div>
            </div>
        `;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('fade-out');
            setTimeout(() => notification.remove(), 500);
        }, 2000);
    }
    
    // Generate avatar collection HTML for profile
    generateAvatarCollectionHTML() {
        const avatars = this.getAllAvatars();
        const selectedAvatar = this.getSelectedAvatar();
        
        let html = '';
        
        // Pikachu variants section
        html += '<div class="avatar-section"><div class="avatar-section-title">⚡ Pikachu Family</div><div class="avatar-section-grid">';
        avatars.filter(a => a.isPikachu).forEach(a => {
            const isSelected = selectedAvatar.id === a.id;
            html += `
                <div class="avatar-collection-item ${a.unlocked ? 'unlocked' : 'locked'} ${isSelected ? 'selected' : ''}" 
                     onclick="window.achievementSystem.selectAvatar('${a.id}')"
                     style="${a.color ? `--avatar-color: ${a.color}` : ''}">
                    <img src="${a.avatar}" alt="${a.name}" class="avatar-collection-img" onerror="this.src='https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png'">
                    <div class="avatar-collection-name">${a.name}</div>
                    ${!a.unlocked ? '<div class="avatar-lock">🔒</div>' : ''}
                    ${isSelected ? '<div class="avatar-selected">✓</div>' : ''}
                </div>
            `;
        });
        html += '</div></div>';
        
        // Achievement avatars section
        html += '<div class="avatar-section"><div class="avatar-section-title">🏆 Achievement Avatars</div><div class="avatar-section-grid">';
        avatars.filter(a => !a.isPikachu).forEach(a => {
            const isSelected = selectedAvatar.id === a.id;
            html += `
                <div class="avatar-collection-item ${a.unlocked ? 'unlocked' : 'locked'} ${isSelected ? 'selected' : ''} ${a.legendary ? 'legendary' : ''}" 
                     onclick="window.achievementSystem.selectAvatar('${a.id}')">
                    <img src="${a.avatar}" alt="${a.name}" class="avatar-collection-img">
                    <div class="avatar-collection-name">${a.badge || a.name.split(' ')[0]}</div>
                    ${!a.unlocked ? '<div class="avatar-lock">🔒</div>' : ''}
                    ${isSelected ? '<div class="avatar-selected">✓</div>' : ''}
                </div>
            `;
        });
        html += '</div></div>';
        
        return html;
    }
    
    // Select an avatar
    selectAvatar(avatarId) {
        const avatars = this.getAllAvatars();
        const avatar = avatars.find(a => a.id === avatarId);
        
        if (!avatar) return;
        
        if (!avatar.unlocked) {
            // Show "locked" message
            this.showLockedAvatarMessage(avatar);
            return;
        }
        
        this.setSelectedAvatar({
            id: avatar.id,
            avatar: avatar.avatar,
            name: avatar.name
        });
        
        // Update avatar collection UI
        this.updateAvatarCollectionUI();
    }
    
    // Show locked avatar message
    showLockedAvatarMessage(avatar) {
        const notification = document.createElement('div');
        notification.className = 'avatar-locked-notification';
        notification.innerHTML = `
            <div class="avatar-locked-content">
                <img src="${avatar.avatar}" alt="${avatar.name}" class="avatar-locked-img">
                <div class="avatar-locked-text">
                    <div class="avatar-locked-title">🔒 Locked!</div>
                    <div class="avatar-locked-hint">Complete achievements to unlock</div>
                </div>
            </div>
        `;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('fade-out');
            setTimeout(() => notification.remove(), 500);
        }, 2000);
    }
    
    // Update avatar collection UI
    updateAvatarCollectionUI() {
        const grid = document.getElementById('avatar-collection-grid');
        if (grid) {
            grid.innerHTML = this.generateAvatarCollectionHTML();
        }
    }
    
    // Обновить UI
    updateUI() {
        const btn = document.getElementById('achievements-btn');
        if (btn) {
            btn.innerHTML = `🏆 <span class="achievements-count">${this.getUnlockedCount()}/${this.achievements.length}</span>`;
        }
        
        const panel = document.getElementById('achievements-panel');
        if (panel) {
            panel.innerHTML = this.generatePanelHTML();
        }
    }
    
    // Переключить панель
    togglePanel() {
        const panel = document.getElementById('achievements-panel');
        if (panel) {
            if (panel.classList.contains('show')) {
                this.hidePanel();
            } else {
                this.showPanel();
            }
        }
    }
    
    // Показать панель (плавно)
    showPanel() {
        const panel = document.getElementById('achievements-panel');
        if (panel) {
            panel.classList.add('show');
            this.updateUI();
        }
    }
    
    // Скрыть панель (плавно)
    hidePanel() {
        const panel = document.getElementById('achievements-panel');
        if (panel) {
            panel.classList.remove('show');
        }
    }
    
    // Закрыть и вернуться (в меню или в игру)
    closeAndReturn() {
        this.hidePanel();
        // Если игра не началась - возвращаемся в главное меню
        if (!window.gameStarted) {
            const mainMenu = document.getElementById('main-menu');
            if (mainMenu) {
                mainMenu.style.display = 'flex';
                mainMenu.style.opacity = '1';
                mainMenu.style.transform = 'scale(1)';
            }
        }
    }
}

// Глобальная переменная для системы достижений
window.achievementSystem = null;

// ============================================
// Initialization
// ============================================

// Make functions global
window.sendGM = sendGM;
window.deployContract = deployContract;
window.connectWallet = connectWallet;

// ============================================
// Грозные покемоны для приветствия
// ============================================
const fiercePokemon = [
    { id: 130, name: 'Gyarados', emoji: '🐉' },
    { id: 6, name: 'Charizard', emoji: '🔥' },
    { id: 150, name: 'Mewtwo', emoji: '🔮' },
    { id: 384, name: 'Rayquaza', emoji: '🐲' },
    { id: 149, name: 'Dragonite', emoji: '🐉' },
    { id: 248, name: 'Tyranitar', emoji: '🦖' },
    { id: 483, name: 'Dialga', emoji: '💎' }
];

// Показать приветственный экран с грозным покемоном
function showWelcomeScreen() {
    // Выбираем случайного грозного покемона
    const pokemon = fiercePokemon[Math.floor(Math.random() * fiercePokemon.length)];
    
    // Создаём приветственный экран
    const welcome = document.createElement('div');
    welcome.id = 'welcome-screen';
    welcome.className = 'welcome-screen';
    welcome.innerHTML = `
        <div class="welcome-content">
            <div class="welcome-pokemon">
                <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png" 
                     alt="${pokemon.name}"
                     class="welcome-pokemon-img"
                     onerror="this.src='https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png'">
            </div>
            <h1 class="welcome-title">${pokemon.emoji} GAME 2048 ${pokemon.emoji}</h1>
            <p class="welcome-subtitle">Pokemon Edition</p>
            <p class="welcome-pokemon-name">${pokemon.name} welcomes you!</p>
            <button class="welcome-btn" onclick="hideWelcomeScreen()">▶ PLAY</button>
        </div>
    `;
    document.body.appendChild(welcome);
    
    // Автоматически скрываем через 5 секунд или по клику
    setTimeout(() => {
        hideWelcomeScreen();
    }, 5000);
}

function hideWelcomeScreen() {
    const welcome = document.getElementById('welcome-screen');
    if (welcome) {
        welcome.classList.add('welcome-fade-out');
        setTimeout(() => {
            welcome.remove();
        }, 500);
    }
}

// Initialize on load
document.addEventListener('DOMContentLoaded', async () => {
    console.log('Initializing Base MiniApp...');
    
    // Инициализируем систему достижений
    window.achievementSystem = new AchievementSystem();
    console.log('Achievement system initialized!');
    
    // Приветственный экран отключён - используем главное меню
    // showWelcomeScreen();
    
    // Очищаем статус СРАЗУ при загрузке - это критически важно!
    clearStatus();
    
    // Initialize Farcaster SDK
    await initFarcasterSDK();
    
    // Check if ethers is loaded
    if (typeof ethers === 'undefined') {
        console.error('ethers.js not loaded!');
        // Don't show error, just log it - ethers might load later
        console.log('Waiting for ethers.js to load...');
    } else {
        console.log('ethers.js version:', ethers.version);
        console.log('Target network:', TARGET_NETWORK.chainName);
    }
    
    // Auto-connect if wallet available (but don't show errors)
    const hasWallet = (farcasterSDK && farcasterSDK.wallet) || (typeof window.ethereum !== 'undefined');
    if (hasWallet) {
        console.log('Wallet detected, ready to connect');
    } else {
        console.log('No wallet detected. Use Warpcast or install MetaMask.');
        // НЕ показываем ошибку - пользователь увидит её только при нажатии на GM
    }
    
    // Initialize GM counter
    updateGMCounter();
    
    // Финальная очистка статуса - убеждаемся что никаких ошибок не показывается
    setTimeout(() => {
        clearStatus();
    }, 200);
    
    // Еще одна очистка на всякий случай
    setTimeout(() => {
        clearStatus();
    }, 500);
    
    // Check if GM limit reached - disable button
    if (getRemainingGMToday() <= 0) {
        const btn = document.getElementById('gm-btn');
        if (btn) {
            btn.disabled = true;
        }
    }
});

console.log('Script loaded. Ready for Base transactions!');

// ============================================
// СИСТЕМА ЛИДЕРБОРДА
// ============================================

const leaderboardSystem = {
    STORAGE_KEY: 'pokemon2048_leaderboard',
    MAX_ENTRIES: 10,
    
    // Получить все записи
    getEntries() {
        try {
            const data = localStorage.getItem(this.STORAGE_KEY);
            return data ? JSON.parse(data) : [];
        } catch (e) {
            console.error('Error loading leaderboard:', e);
            return [];
        }
    },
    
    // Сохранить записи
    saveEntries(entries) {
        try {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(entries));
        } catch (e) {
            console.error('Error saving leaderboard:', e);
        }
    },
    
    // Получить лучший результат
    getBestScore() {
        const entries = this.getEntries();
        if (entries.length === 0) return 0;
        return Math.max(...entries.map(e => e.score));
    },
    
    // Добавить новый результат
    addEntry(score, element) {
        if (score <= 0) return false;
        
        const entries = this.getEntries();
        const previousBest = this.getBestScore();
        const isNewRecord = score > previousBest;
        
        // Record Breaker achievement
        if (isNewRecord && window.achievementSystem) {
            window.achievementSystem.checkNewRecord(score, previousBest);
        }
        
        const newEntry = {
            score: score,
            element: element || 'normal',
            date: new Date().toISOString(),
            id: Date.now()
        };
        
        entries.push(newEntry);
        
        // Сортируем по убыванию очков
        entries.sort((a, b) => b.score - a.score);
        
        // Оставляем только топ MAX_ENTRIES
        const trimmedEntries = entries.slice(0, this.MAX_ENTRIES);
        
        this.saveEntries(trimmedEntries);
        this.updateBadge();
        
        // Показать уведомление о новом рекорде
        if (isNewRecord && score > 0) {
            this.showNewRecordNotification(score);
        }
        
        return isNewRecord;
    },
    
    // Обновить бейдж с лучшим результатом
    updateBadge() {
        const badge = document.getElementById('best-score-badge');
        const leaderboardBest = document.getElementById('leaderboard-best');
        const bestScore = this.getBestScore();
        
        if (badge) {
            badge.textContent = bestScore.toLocaleString();
        }
        if (leaderboardBest) {
            leaderboardBest.textContent = bestScore.toLocaleString();
        }
    },
    
    // Показать панель лидерборда
    showPanel() {
        const panel = document.getElementById('leaderboard-panel');
        if (panel) {
            panel.classList.add('show');
            this.renderList();
        }
    },
    
    // Скрыть панель
    hidePanel() {
        const panel = document.getElementById('leaderboard-panel');
        if (panel) {
            panel.classList.remove('show');
        }
    },
    
    // Закрыть и вернуться (в меню или в игру)
    closeAndReturn() {
        this.hidePanel();
        // Если игра не началась - возвращаемся в главное меню
        if (!window.gameStarted) {
            const mainMenu = document.getElementById('main-menu');
            if (mainMenu) {
                mainMenu.style.display = 'flex';
                mainMenu.style.opacity = '1';
                mainMenu.style.transform = 'scale(1)';
            }
        }
    },
    
    // Отрисовать список записей
    renderList() {
        const list = document.getElementById('leaderboard-list');
        if (!list) return;
        
        const entries = this.getEntries();
        
        if (entries.length === 0) {
            list.innerHTML = `
                <div class="leaderboard-empty">
                    <span class="leaderboard-empty-icon">🎮</span>
                    <div class="leaderboard-empty-text">No games yet!</div>
                    <div class="leaderboard-empty-hint">Play a game to see your scores here</div>
                </div>
            `;
            return;
        }
        
        const elementEmojis = {
            normal: '⭐', fire: '🔥', water: '💧', electric: '⚡', grass: '🌿',
            poison: '☠️', ground: '🌍', flying: '🦅', bug: '🐛', rock: '🪨',
            ice: '❄️', fighting: '🥊', psychic: '🔮', ghost: '👻', dark: '🌑',
            steel: '⚔️', fairy: '🧚', dragon: '🐉', cosmic: '🌌', shadow: '🖤',
            legendary: '✨'
        };
        
        const elementNames = {
            normal: 'Normal', fire: 'Fire', water: 'Water', electric: 'Electric', grass: 'Grass',
            poison: 'Poison', ground: 'Ground', flying: 'Flying', bug: 'Bug', rock: 'Rock',
            ice: 'Ice', fighting: 'Fighting', psychic: 'Psychic', ghost: 'Ghost', dark: 'Dark',
            steel: 'Steel', fairy: 'Fairy', dragon: 'Dragon', cosmic: 'Cosmic', shadow: 'Shadow',
            legendary: 'Legendary'
        };
        
        list.innerHTML = entries.map((entry, index) => {
            const rank = index + 1;
            const rankClass = rank === 1 ? 'top-1' : rank === 2 ? 'top-2' : rank === 3 ? 'top-3' : '';
            const rankDisplay = rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : rank;
            const rankDefaultClass = rank > 3 ? 'default' : '';
            
            const date = new Date(entry.date);
            const dateStr = date.toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
            
            const emoji = elementEmojis[entry.element] || '⭐';
            const elementName = elementNames[entry.element] || 'Normal';
            
            return `
                <div class="leaderboard-entry ${rankClass}">
                    <div class="entry-rank ${rankDefaultClass}">${rankDisplay}</div>
                    <div class="entry-info">
                        <div class="entry-score">${entry.score.toLocaleString()}</div>
                        <div class="entry-date">${dateStr}</div>
                    </div>
                    <div class="entry-element">
                        <span class="entry-element-emoji">${emoji}</span>
                        <span>${elementName}</span>
                    </div>
                </div>
            `;
        }).join('');
    },
    
    // Очистить историю
    clearHistory() {
        if (confirm('Are you sure you want to clear all scores? This cannot be undone.')) {
            this.saveEntries([]);
            this.updateBadge();
            this.renderList();
        }
    },
    
    // Показать уведомление о новом рекорде
    showNewRecordNotification(score) {
        const notification = document.createElement('div');
        notification.className = 'record-notification';
        notification.innerHTML = `
            <div class="record-notification-content">
                <span class="record-trophy">🏆</span>
                <div class="record-title">NEW RECORD!</div>
                <div class="record-score">${score.toLocaleString()}</div>
            </div>
        `;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('fade-out');
            setTimeout(() => notification.remove(), 500);
        }, 2500);
    },
    
    // Инициализация
    init() {
        this.updateBadge();
        
        // Закрытие панели по клику вне контента (не при скролле)
        const panel = document.getElementById('leaderboard-panel');
        if (panel) {
            panel.addEventListener('click', (e) => {
                // Проверяем глобальную переменную panelScrolled
                if (e.target === panel && !window.panelScrolled) {
                    this.closeAndReturn();
                }
            });
        }
        
        // Закрытие по Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.hidePanel();
            }
        });
        
        console.log('🏆 Leaderboard system initialized');
    }
};

// Инициализация лидерборда при загрузке
document.addEventListener('DOMContentLoaded', () => {
    leaderboardSystem.init();
});

// Делаем доступным глобально
window.leaderboardSystem = leaderboardSystem;

// ============================================
// СИСТЕМА МЕНЮ И НАСТРОЕК
// ============================================

const menuSystem = {
    currentTab: null,
    settings: {
        theme: 'dark',
        brightness: 100,
        sound: true,
        particles: true
    },
    
    // Статистика профиля
    profileStats: {
        games: 0,
        totalScore: 0,
        bestScore: 0,
        elementsUnlocked: ['normal'],
        gmCount: 0,
        gmStreak: 0,
        lastGmDate: null
    },
    
    // ============================================
    // СИСТЕМА УРОВНЕЙ И ОПЫТА (10,000 уровней)
    // ============================================
    
    // XP данные
    xpData: {
        currentXP: 0,       // Текущий XP на уровне
        totalXP: 0,         // Общий XP за всё время
        level: 1,           // Текущий уровень
        lastGameXP: 0       // XP за последнюю игру
    },
    
    // Максимальный уровень
    MAX_LEVEL: 10000,
    
    // Формула расчета XP для уровня (x3 для долгой прокачки до конца 2026!)
    // Прогрессия: начинаем легко, к высоким уровням нужно ОЧЕНЬ МНОГО опыта
    getXPForLevel(level) {
        if (level <= 0) return 0;
        if (level > this.MAX_LEVEL) return Infinity;
        
        // Формула: (100 + level*20 + (level/5)^1.7) * 3
        // x3 множитель для вовлечённости!
        // Уровень 1: ~360 XP
        // Уровень 10: ~960 XP  
        // Уровень 100: ~11,100 XP
        // Уровень 1000: ~150,000 XP
        // Уровень 5000: ~1,050,000 XP
        // Уровень 10000: ~2,700,000 XP per level!
        return Math.floor((100 + level * 20 + Math.pow(level / 5, 1.7)) * 3);
    },
    
    // Получить общий XP нужный для достижения уровня
    getTotalXPForLevel(level) {
        if (level <= 1) return 0;
        let total = 0;
        for (let i = 1; i < level; i++) {
            total += this.getXPForLevel(i);
        }
        return total;
    },
    
    // Получить уровень по общему XP
    getLevelFromTotalXP(totalXP) {
        let level = 1;
        let xpNeeded = 0;
        while (level < this.MAX_LEVEL) {
            xpNeeded += this.getXPForLevel(level);
            if (totalXP < xpNeeded) break;
            level++;
        }
        return Math.min(level, this.MAX_LEVEL);
    },
    
    // Добавить XP (возвращает true если был level up)
    addXP(amount, source = 'game') {
        if (amount <= 0) return false;
        
        const oldLevel = this.xpData.level;
        this.xpData.totalXP += amount;
        this.xpData.lastGameXP = amount;
        
        // Пересчитываем уровень
        const newLevel = this.getLevelFromTotalXP(this.xpData.totalXP);
        
        // Вычисляем текущий XP на уровне
        const xpForCurrentLevel = this.getTotalXPForLevel(newLevel);
        this.xpData.currentXP = this.xpData.totalXP - xpForCurrentLevel;
        this.xpData.level = newLevel;
        
        // Сохраняем
        this.saveXPData();
        
        // Показываем уведомление о получении XP
        this.showXPGainNotification(amount, source);
        
        // Обновляем уровень в главном меню
        const menuLevelEl = document.getElementById('menu-level');
        if (menuLevelEl) {
            menuLevelEl.textContent = this.formatNumber(newLevel);
        }
        
        // Проверяем level up
        if (newLevel > oldLevel) {
            // Показываем уведомления для всех новых уровней
            for (let lvl = oldLevel + 1; lvl <= newLevel; lvl++) {
                setTimeout(() => {
                    this.showLevelUpNotification(lvl);
                }, (lvl - oldLevel - 1) * 500);
            }
            return true;
        }
        
        return false;
    },
    
    // Начислить XP за игру (вызывается при game over)
    awardGameXP(score, achievements = []) {
        // Фиксированный XP за завершённую игру = 100 XP
        let xp = 100;
        
        // Бонус за достижения (если есть)
        achievements.forEach(ach => {
            xp += ach.xpBonus || 0;
        });
        
        // Множитель за серию игр (streak)
        const streakBonus = this.getStreakBonus();
        xp = Math.floor(xp * streakBonus);
        
        // Бонус первой игры дня (+25%)
        if (this.isFirstGameToday()) {
            xp = Math.floor(xp * 1.25);
            this.markFirstGamePlayed();
        }
        
        this.addXP(xp, 'game');
        return xp;
    },
    
    // Бонус за серию (streak)
    getStreakBonus() {
        // +2% за каждый день подряд, максимум +50%
        const streak = this.profileStats.gmStreak || 0;
        const bonus = Math.min(streak * 0.02, 0.5);
        return 1 + bonus;
    },
    
    // Проверка первой игры за день
    isFirstGameToday() {
        try {
            const lastPlay = localStorage.getItem('pokemon2048_lastPlayDate');
            const today = new Date().toDateString();
            return lastPlay !== today;
        } catch (e) {
            return true;
        }
    },
    
    markFirstGamePlayed() {
        try {
            localStorage.setItem('pokemon2048_lastPlayDate', new Date().toDateString());
        } catch (e) {}
    },
    
    // Показать уведомление о получении XP
    showXPGainNotification(amount, source) {
        const notification = document.createElement('div');
        notification.className = 'xp-gain-notification';
        notification.innerHTML = `
            <div class="xp-gain-content">
                <span class="xp-icon">⚡</span>+${this.formatNumber(amount)} XP
            </div>
        `;
        document.body.appendChild(notification);
        
        setTimeout(() => notification.remove(), 2000);
    },
    
    // Показать уведомление о повышении уровня
    showLevelUpNotification(level) {
        const title = this.getTitleForLevel(level);
        const pokemonId = this.getPokemonForLevel(level);
        
        const notification = document.createElement('div');
        notification.className = 'level-up-notification';
        notification.innerHTML = `
            <div class="level-up-content">
                <div class="level-up-stars">⭐ ⭐ ⭐</div>
                <div class="level-up-title">LEVEL UP!</div>
                <div class="level-up-level">${level}</div>
                <div class="level-up-title-new">${title}</div>
                <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/${pokemonId}.gif" 
                     alt="Pokemon" class="level-up-pokemon">
            </div>
        `;
        document.body.appendChild(notification);
        
        setTimeout(() => notification.remove(), 2500);
        
        // Проверяем milestone достижения
        this.checkLevelMilestone(level);
    },
    
    // Проверка milestone уровней
    checkLevelMilestone(level) {
        const milestones = [10, 25, 50, 100, 250, 500, 1000, 2500, 5000, 7500, 10000];
        if (milestones.includes(level) && window.achievementSystem) {
            window.achievementSystem.checkLevelAchievement(level);
        }
    },
    
    // Сохранить XP данные
    saveXPData() {
        try {
            localStorage.setItem('pokemon2048_xp', JSON.stringify(this.xpData));
        } catch (e) {
            console.log('XP save error:', e);
        }
    },
    
    // Загрузить XP данные
    loadXPData() {
        try {
            const saved = localStorage.getItem('pokemon2048_xp');
            if (saved) {
                this.xpData = { ...this.xpData, ...JSON.parse(saved) };
            }
        } catch (e) {
            console.log('XP load error:', e);
        }
    },
    
    // Получить покемона для уровня (аватар)
    getPokemonForLevel(level) {
        // Прогрессия аватаров по уровням
        const avatars = [
            { level: 1, id: 25 },      // Pikachu
            { level: 10, id: 133 },    // Eevee
            { level: 25, id: 6 },      // Charizard
            { level: 50, id: 149 },    // Dragonite
            { level: 100, id: 130 },   // Gyarados
            { level: 250, id: 150 },   // Mewtwo
            { level: 500, id: 151 },   // Mew
            { level: 1000, id: 384 },  // Rayquaza
            { level: 2500, id: 483 },  // Dialga
            { level: 5000, id: 493 },  // Arceus
            { level: 7500, id: 249 },  // Lugia
            { level: 10000, id: 250 }  // Ho-Oh (max level)
        ];
        
        let pokemonId = 25;
        for (const avatar of avatars) {
            if (level >= avatar.level) pokemonId = avatar.id;
        }
        return pokemonId;
    },
    
    // Получить звание для уровня
    getTitleForLevel(level) {
        const titles = [
            { level: 1, title: 'Beginner' },
            { level: 5, title: 'Rookie Trainer' },
            { level: 10, title: 'Pokemon Fan' },
            { level: 25, title: 'Skilled Trainer' },
            { level: 50, title: 'Pokemon Catcher' },
            { level: 100, title: 'Expert Trainer' },
            { level: 250, title: 'Elite Trainer' },
            { level: 500, title: 'Champion' },
            { level: 1000, title: 'Pokemon Master' },
            { level: 2000, title: 'Grand Master' },
            { level: 3000, title: 'Legend' },
            { level: 4000, title: 'Mythical Trainer' },
            { level: 5000, title: 'Pokemon God' },
            { level: 6000, title: 'Cosmic Being' },
            { level: 7000, title: 'Dimensional Lord' },
            { level: 8000, title: 'Reality Shaper' },
            { level: 9000, title: 'Universe Master' },
            { level: 10000, title: 'SUPREME POKEMON LORD' }
        ];
        
        let currentTitle = 'Beginner';
        for (const t of titles) {
            if (level >= t.level) currentTitle = t.title;
        }
        return currentTitle;
    },
    
    // Список всех элементов
    allElements: [
        { type: 'normal', emoji: '⭐', name: 'Normal', minScore: 0 },
        { type: 'fire', emoji: '🔥', name: 'Fire', minScore: 100 },
        { type: 'water', emoji: '💧', name: 'Water', minScore: 300 },
        { type: 'electric', emoji: '⚡', name: 'Electric', minScore: 600 },
        { type: 'grass', emoji: '🌿', name: 'Grass', minScore: 1000 },
        { type: 'poison', emoji: '☠️', name: 'Poison', minScore: 1500 },
        { type: 'ground', emoji: '🌍', name: 'Ground', minScore: 2000 },
        { type: 'flying', emoji: '🦅', name: 'Flying', minScore: 2500 },
        { type: 'bug', emoji: '🐛', name: 'Bug', minScore: 3500 },
        { type: 'rock', emoji: '🪨', name: 'Rock', minScore: 5000 },
        { type: 'ice', emoji: '❄️', name: 'Ice', minScore: 7000 },
        { type: 'fighting', emoji: '🥊', name: 'Fighting', minScore: 10000 },
        { type: 'psychic', emoji: '🔮', name: 'Psychic', minScore: 15000 },
        { type: 'ghost', emoji: '👻', name: 'Ghost', minScore: 20000 },
        { type: 'dark', emoji: '🌑', name: 'Dark', minScore: 25000 },
        { type: 'steel', emoji: '⚔️', name: 'Steel', minScore: 30000 },
        { type: 'fairy', emoji: '🧚', name: 'Fairy', minScore: 40000 },
        { type: 'dragon', emoji: '🐉', name: 'Dragon', minScore: 50000 },
        { type: 'cosmic', emoji: '🌌', name: 'Cosmic', minScore: 60000 },
        { type: 'shadow', emoji: '🖤', name: 'Shadow', minScore: 75000 },
        { type: 'legendary', emoji: '✨', name: 'Legendary', minScore: 100000 }
    ],
    
    // Покемоны для аватаров по уровню
    avatarPokemon: {
        1: 25,    // Pikachu
        5: 133,   // Eevee
        10: 6,    // Charizard
        20: 149,  // Dragonite
        30: 150,  // Mewtwo
        50: 151,  // Mew
        100: 384  // Rayquaza
    },
    
    // Звания по уровню
    titles: {
        1: 'Beginner',
        3: 'Rookie Trainer',
        5: 'Pokemon Fan',
        10: 'Skilled Trainer',
        15: 'Expert',
        20: 'Champion',
        30: 'Master',
        50: 'Legend',
        100: 'Pokemon God'
    },
    
    // Загрузить настройки
    loadSettings() {
        try {
            const saved = localStorage.getItem('pokemon2048_settings');
            if (saved) {
                this.settings = { ...this.settings, ...JSON.parse(saved) };
            }
            
            const profile = localStorage.getItem('pokemon2048_profile');
            if (profile) {
                this.profileStats = { ...this.profileStats, ...JSON.parse(profile) };
            }
        } catch (e) {
            console.log('Settings load error:', e);
        }
    },
    
    // Сохранить настройки
    saveSettings() {
        try {
            localStorage.setItem('pokemon2048_settings', JSON.stringify(this.settings));
            localStorage.setItem('pokemon2048_profile', JSON.stringify(this.profileStats));
        } catch (e) {
            console.log('Settings save error:', e);
        }
    },
    
    // Открыть вкладку (плавно)
    openTab(tab) {
        // Если та же вкладка - закрываем
        if (this.currentTab === tab) {
            this.closeTab();
            return;
        }
        
        // Убираем активность со всех кнопок
        document.querySelectorAll('.nav-item').forEach(btn => btn.classList.remove('active'));
        
        // Добавляем активность на текущую
        const activeBtn = document.querySelector(`.nav-item[data-tab="${tab}"]`);
        if (activeBtn) activeBtn.classList.add('active');
        
        // Плавно закрываем все панели
        document.querySelectorAll('.menu-panel').forEach(panel => {
            if (panel.classList.contains('show')) {
                panel.classList.add('closing');
                setTimeout(() => {
                    panel.classList.remove('show', 'closing');
                }, 200);
            }
        });
        
        // Специальные случаи - без задержки
        if (tab === 'leaderboard') {
            if (window.leaderboardSystem) {
                leaderboardSystem.showPanel();
            }
            this.currentTab = tab;
            return;
        }
        
        if (tab === 'achievements') {
            if (window.achievementSystem) {
                achievementSystem.showPanel();
            }
            this.currentTab = tab;
            return;
        }
        
        // Открываем нужную панель мгновенно
        const panel = document.getElementById(`${tab}-panel`);
        if (panel) {
            panel.classList.add('show');
            
            // Обновляем данные панели
            if (tab === 'profile') this.updateProfile();
            if (tab === 'gm') this.updateGmPanel();
            
            this.currentTab = tab;
        }
    },
    
    // Закрыть вкладку (плавно)
    closeTab() {
        // Плавно закрываем панели
        document.querySelectorAll('.menu-panel').forEach(panel => {
            if (panel.classList.contains('show')) {
                panel.classList.add('closing');
                setTimeout(() => {
                    panel.classList.remove('show', 'closing');
                }, 250);
            }
        });
        document.querySelectorAll('.nav-item').forEach(btn => btn.classList.remove('active'));
        
        // Закрываем также лидерборд и достижения
        if (window.leaderboardSystem) leaderboardSystem.hidePanel();
        if (window.achievementSystem) achievementSystem.hidePanel();
        
        this.currentTab = null;
    },
    
    // Обновить профиль
    updateProfile() {
        // Обновляем статистику из лидерборда
        if (window.leaderboardSystem) {
            const entries = leaderboardSystem.getEntries();
            this.profileStats.games = entries.length;
            if (entries.length > 0) {
                this.profileStats.bestScore = entries[0].score;
                this.profileStats.totalScore = entries.reduce((sum, e) => sum + e.score, 0);
                
                // Собираем разблокированные элементы
                const unlockedSet = new Set(['normal']);
                entries.forEach(e => {
                    if (e.element) unlockedSet.add(e.element);
                });
                this.profileStats.elementsUnlocked = Array.from(unlockedSet);
            }
        }
        
        // Получаем данные уровня из XP системы
        const level = this.xpData.level;
        const title = this.getTitleForLevel(level);
        const avatarId = this.getPokemonForLevel(level);
        
        // XP для текущего уровня
        const xpNeededForLevel = this.getXPForLevel(level);
        const currentXP = this.xpData.currentXP;
        const xpPercent = Math.min((currentXP / xpNeededForLevel) * 100, 100);
        
        // Прогресс до максимального уровня
        const levelPercent = ((level - 1) / (this.MAX_LEVEL - 1)) * 100;
        
        // Обновляем UI - Аватар
        const avatarImg = document.getElementById('profile-avatar-img');
        if (avatarImg) {
            avatarImg.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/${avatarId}.gif`;
        }
        
        // Уровень
        const levelEl = document.getElementById('profile-level');
        if (levelEl) levelEl.textContent = `Lv.${this.formatNumber(level)}`;
        
        // Звание
        const titleEl = document.getElementById('profile-title');
        if (titleEl) titleEl.textContent = title;
        
        // XP Section
        const xpCurrentEl = document.getElementById('xp-current');
        if (xpCurrentEl) xpCurrentEl.textContent = this.formatNumber(currentXP);
        
        const xpNeededEl = document.getElementById('xp-needed');
        if (xpNeededEl) xpNeededEl.textContent = this.formatNumber(xpNeededForLevel);
        
        const xpBarFill = document.getElementById('xp-bar-fill');
        if (xpBarFill) xpBarFill.style.width = `${xpPercent}%`;
        
        const xpTotalEl = document.getElementById('xp-total-value');
        if (xpTotalEl) xpTotalEl.textContent = this.formatNumber(this.xpData.totalXP);
        
        // Level Progress Section
        const levelProgressPercent = document.getElementById('level-progress-percent');
        if (levelProgressPercent) levelProgressPercent.textContent = `${levelPercent.toFixed(2)}%`;
        
        const levelProgressFill = document.getElementById('level-progress-fill');
        if (levelProgressFill) levelProgressFill.style.width = `${levelPercent}%`;
        
        const currentLevelDisplay = document.getElementById('current-level-display');
        if (currentLevelDisplay) currentLevelDisplay.textContent = this.formatNumber(level);
        
        // Stats
        const gamesEl = document.getElementById('profile-games');
        if (gamesEl) gamesEl.textContent = this.profileStats.games;
        
        const bestEl = document.getElementById('profile-best');
        if (bestEl) bestEl.textContent = this.formatNumber(this.profileStats.bestScore);
        
        const totalEl = document.getElementById('profile-total');
        if (totalEl) totalEl.textContent = this.formatNumber(this.profileStats.totalScore);
        
        const achieveEl = document.getElementById('profile-achievements');
        if (achieveEl && window.achievementSystem) {
            const unlocked = achievementSystem.achievements.filter(a => a.unlocked).length;
            achieveEl.textContent = unlocked;
        }
        
        // Текущий элемент
        const currentElementEl = document.getElementById('profile-current-element');
        if (currentElementEl && window.game) {
            const elem = game.getCurrentElement();
            currentElementEl.innerHTML = `
                <span class="element-emoji">${elem.emoji}</span>
                <span class="element-name">${elem.name}</span>
            `;
        }
        
        // Разблокированные элементы
        const elementsGrid = document.getElementById('profile-elements-grid');
        if (elementsGrid) {
            elementsGrid.innerHTML = this.allElements.map(elem => {
                const isUnlocked = this.profileStats.elementsUnlocked.includes(elem.type);
                return `
                    <div class="element-badge-small ${isUnlocked ? 'unlocked' : 'locked'}" 
                         title="${elem.name} (${elem.minScore}+ pts)">
                        ${elem.emoji}
                    </div>
                `;
            }).join('');
        }
        
        // Update avatar collection
        if (window.achievementSystem) {
            const avatarGrid = document.getElementById('avatar-collection-grid');
            if (avatarGrid) {
                avatarGrid.innerHTML = window.achievementSystem.generateAvatarCollectionHTML();
            }
            
            // Update profile avatar to selected one
            const selectedAvatar = window.achievementSystem.getSelectedAvatar();
            if (avatarImg && selectedAvatar && selectedAvatar.avatar) {
                avatarImg.src = selectedAvatar.avatar;
            }
        }
        
        this.saveSettings();
    },
    
    // Обновить панель GM
    updateGmPanel() {
        // Загружаем данные GM
        try {
            const gmData = localStorage.getItem('pokemon2048_gm');
            if (gmData) {
                const data = JSON.parse(gmData);
                this.profileStats.gmCount = data.count || 0;
                this.profileStats.lastGmDate = data.lastDate;
                this.profileStats.gmStreak = data.streak || 0;
            }
        } catch (e) {}
        
        const valueEl = document.getElementById('gm-panel-value');
        if (valueEl) valueEl.textContent = this.profileStats.gmCount;
        
        const dateEl = document.getElementById('gm-last-date');
        if (dateEl) {
            dateEl.textContent = this.profileStats.lastGmDate 
                ? new Date(this.profileStats.lastGmDate).toLocaleDateString()
                : 'Never';
        }
        
        const streakEl = document.getElementById('gm-streak');
        if (streakEl) streakEl.textContent = this.profileStats.gmStreak;
    },
    
    // Установить тему
    setTheme(theme) {
        this.settings.theme = theme;
        
        // Обновляем кнопки
        document.querySelectorAll('.theme-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.theme === theme);
        });
        
        // Применяем тему
        document.body.classList.remove('theme-light', 'theme-dark', 'theme-auto');
        
        if (theme === 'light') {
            document.body.classList.add('theme-light');
        } else if (theme === 'auto') {
            // Определяем по системным настройкам
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            if (!prefersDark) {
                document.body.classList.add('theme-light');
            }
        }
        
        this.saveSettings();
    },
    
    // Установить яркость
    setBrightness(value) {
        this.settings.brightness = parseInt(value);
        
        document.body.style.filter = `brightness(${value}%)`;
        
        const valueEl = document.getElementById('brightness-value');
        if (valueEl) valueEl.textContent = value;
        
        this.saveSettings();
    },
    
    // Переключить звук
    toggleSound() {
        const toggle = document.getElementById('sound-toggle');
        this.settings.sound = toggle ? toggle.checked : !this.settings.sound;
        this.saveSettings();
    },
    
    // Переключить частицы
    toggleParticles() {
        const toggle = document.getElementById('particles-toggle');
        this.settings.particles = toggle ? toggle.checked : !this.settings.particles;
        
        // Применяем
        if (!this.settings.particles) {
            document.body.classList.add('no-particles');
        } else {
            document.body.classList.remove('no-particles');
        }
        
        this.saveSettings();
    },
    
    // Сбросить все данные
    resetAllData() {
        if (confirm('Are you sure you want to reset ALL data? This will clear:\n- All scores & XP\n- All achievements\n- All settings\n- Your level progress\n\nThis cannot be undone!')) {
            localStorage.removeItem('pokemon2048_settings');
            localStorage.removeItem('pokemon2048_profile');
            localStorage.removeItem('pokemon2048_achievements');
            localStorage.removeItem('pokemon2048_leaderboard');
            localStorage.removeItem('pokemon2048_gm');
            localStorage.removeItem('pokemon2048_xp');
            localStorage.removeItem('pokemon2048_lastPlayDate');
            
            alert('All data has been reset. The page will now reload.');
            location.reload();
        }
    },
    
    // Форматирование числа
    formatNumber(num) {
        if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
        if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
        return num.toString();
    },
    
    // Применить сохранённые настройки
    applySettings() {
        // Тема
        this.setTheme(this.settings.theme);
        
        // Яркость
        const slider = document.getElementById('brightness-slider');
        if (slider) slider.value = this.settings.brightness;
        this.setBrightness(this.settings.brightness);
        
        // Звук
        const soundToggle = document.getElementById('sound-toggle');
        if (soundToggle) soundToggle.checked = this.settings.sound;
        
        // Частицы
        const particlesToggle = document.getElementById('particles-toggle');
        if (particlesToggle) particlesToggle.checked = this.settings.particles;
        if (!this.settings.particles) {
            document.body.classList.add('no-particles');
        }
    },
    
    // Инициализация
    init() {
        this.loadSettings();
        this.loadXPData();
        this.applySettings();
        
        // Закрытие панелей по клику вне контента
        document.querySelectorAll('.menu-panel').forEach(panel => {
            panel.addEventListener('click', (e) => {
                if (e.target === panel) {
                    this.closeTab();
                }
            });
        });
        
        // Закрытие по Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeTab();
            }
        });
        
        // Слушаем изменения системной темы
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
            if (this.settings.theme === 'auto') {
                this.setTheme('auto');
            }
        });
        
        // Обновляем уровень в меню из загруженных данных
        const menuLevelEl = document.getElementById('menu-level');
        if (menuLevelEl) {
            menuLevelEl.textContent = this.formatNumber(this.xpData.level);
        }
        
        console.log('📱 Menu system initialized');
        console.log(`⭐ Level: ${this.xpData.level} | Total XP: ${this.formatNumber(this.xpData.totalXP)}`);
    }
};

// Инициализация меню при загрузке
document.addEventListener('DOMContentLoaded', () => {
    menuSystem.init();
});

// Делаем доступным глобально
window.menuSystem = menuSystem;


// Обновление статистики в главном меню
function updateMainMenuStats() {
    try {
        // Уровень
        const xpData = localStorage.getItem('pokemon2048_xp');
        if (xpData) {
            const data = JSON.parse(xpData);
            const levelEl = document.getElementById('menu-level');
            if (levelEl) {
                levelEl.textContent = data.level || 1;
            }
        }
        
        // Лучший счёт
        const leaderboardData = localStorage.getItem('pokemon2048_leaderboard');
        if (leaderboardData) {
            const entries = JSON.parse(leaderboardData);
            if (entries.length > 0) {
                const bestEl = document.getElementById('menu-best-score');
                const gamesEl = document.getElementById('menu-games-count');
                
                if (bestEl) bestEl.textContent = entries[0].score.toLocaleString();
                if (gamesEl) gamesEl.textContent = entries.length;
            }
        }
        
        // Достижения
        const achievementsData = localStorage.getItem('pokemon2048_achievements');
        if (achievementsData) {
            const achievements = JSON.parse(achievementsData);
            const unlocked = Object.values(achievements).filter(a => a === true).length;
            const achieveEl = document.getElementById('menu-achievements-count');
            if (achieveEl) achieveEl.textContent = unlocked;
        }
    } catch (e) {
        console.log('Menu stats error:', e);
    }
}

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', () => {
    updateMainMenuStats();
});

// Закрытие по Escape
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeMenuPanel();
    }
});

window.startGame = startGame;

// ============================================
// УЛУЧШЕННАЯ ОБРАБОТКА КНОПОК ДЛЯ НОУТБУКОВ
// ============================================
// Решает проблему с не работающими кнопками на ноутбуках с тачскрином

(function() {
    // Флаг для предотвращения двойных срабатываний
    let isProcessing = false;
    
    // Безопасный вызов функции
    function safeCall(fn, delay = 300) {
        if (isProcessing) return;
        isProcessing = true;
        try {
            fn();
        } catch (e) {
            console.error('Button error:', e);
        }
        setTimeout(() => { isProcessing = false; }, delay);
    }
    
    document.addEventListener('DOMContentLoaded', () => {
        // Кнопка New Game
        const newGameBtns = document.querySelectorAll('.new-game-btn, button[onclick*="newGame"]');
        newGameBtns.forEach(btn => {
            btn.addEventListener('pointerdown', (e) => {
                e.preventDefault();
                safeCall(() => {
                    if (window.game) {
                        console.log('🎮 New Game button pressed');
                        window.game.newGame();
                    }
                });
            }, { passive: false });
        });
        
        // Кнопка GM
        const gmBtn = document.getElementById('gm-btn');
        if (gmBtn) {
            gmBtn.addEventListener('pointerdown', (e) => {
                e.preventDefault();
                safeCall(() => {
                    console.log('☀️ GM button pressed');
                    sendGM();
                }, 500);
            }, { passive: false });
        }
        
        // Кнопка GM в панели
        const gmSendBtn = document.querySelector('.gm-send-btn');
        if (gmSendBtn) {
            gmSendBtn.addEventListener('pointerdown', (e) => {
                e.preventDefault();
                safeCall(() => {
                    console.log('☀️ GM panel button pressed');
                    sendGM();
                }, 500);
            }, { passive: false });
        }
        
        // Кнопка Deploy
        const deployBtn = document.getElementById('deploy-btn');
        if (deployBtn) {
            deployBtn.addEventListener('pointerdown', (e) => {
                e.preventDefault();
                safeCall(() => {
                    console.log('📜 Deploy button pressed');
                    deployContract();
                }, 500);
            }, { passive: false });
        }
        
        // Кнопка Test
        const testBtn = document.getElementById('test-btn');
        if (testBtn) {
            testBtn.addEventListener('pointerdown', (e) => {
                e.preventDefault();
                safeCall(() => {
                    console.log('🔥 Test button pressed');
                    testElements();
                });
            }, { passive: false });
        }
        
        // Кнопка Play Again (Game Over)
        const playAgainBtns = document.querySelectorAll('.game-over button, .game-over-message button');
        playAgainBtns.forEach(btn => {
            btn.addEventListener('pointerdown', (e) => {
                e.preventDefault();
                safeCall(() => {
                    console.log('🎮 Play Again button pressed');
                    if (window.game) window.game.newGame();
                });
            }, { passive: false });
        });
        
        // Кнопка PLAY в главном меню
        const playBtn = document.querySelector('.menu-play-btn');
        if (playBtn) {
            playBtn.addEventListener('pointerdown', (e) => {
                e.preventDefault();
                safeCall(() => {
                    console.log('▶️ PLAY button pressed');
                    if (typeof startGame === 'function') startGame();
                });
            }, { passive: false });
        }
        
        console.log('✅ Enhanced button handlers initialized for laptop compatibility');
    });
})();
