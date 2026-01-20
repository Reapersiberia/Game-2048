class Game2048 {
    constructor() {
        this.grid = [];
        this.score = 0;
        this.size = 4;
        this.gridContainer = document.getElementById('grid');
        this.scoreElement = document.getElementById('score');
        this.gameOverElement = document.getElementById('game-over');
        this.init();
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
            this.grid[randomCell.row][randomCell.col] = Math.random() < 0.9 ? 2 : 4;
        }
    }

    move(direction) {
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
                    this.grid[row][col] = newColumn[row];
                    if (this.grid[row][col] !== prevGrid[row][col]) {
                        moved = true;
                    }
                }
            }
        } else {
            for (let row = 0; row < this.size; row++) {
                const line = [...this.grid[row]];
                const newLine = direction === 'left' ? this.moveLine(line) : this.moveLine(line.reverse()).reverse();
                this.grid[row] = newLine;
                if (JSON.stringify(this.grid[row]) !== JSON.stringify(prevGrid[row])) {
                    moved = true;
                }
            }
        }

        if (moved) {
            this.addRandomTile();
            this.updateDisplay();
            if (this.isGameOver()) {
                this.gameOverElement.classList.add('show');
            }
        }
    }

    moveLine(line) {
        const filtered = line.filter(val => val !== 0);
        const merged = [];
        for (let i = 0; i < filtered.length; i++) {
            if (i < filtered.length - 1 && filtered[i] === filtered[i + 1]) {
                merged.push(filtered[i] * 2);
                this.score += filtered[i] * 2;
                i++;
            } else {
                merged.push(filtered[i]);
            }
        }
        while (merged.length < this.size) {
            merged.push(0);
        }
        this.updateScore();
        return merged;
    }

    updateScore() {
        this.scoreElement.textContent = this.score;
    }

    updateDisplay() {
        this.gridContainer.innerHTML = '';
        const cellSize = (this.gridContainer.offsetWidth - 40) / this.size;
        
        for (let i = 0; i < this.size * this.size; i++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            this.gridContainer.appendChild(cell);
        }

        for (let row = 0; row < this.size; row++) {
            for (let col = 0; col < this.size; col++) {
                if (this.grid[row][col] !== 0) {
                    const tile = document.createElement('div');
                    tile.className = `tile tile-${this.grid[row][col]}`;
                    tile.textContent = this.grid[row][col];
                    tile.style.width = `${cellSize}px`;
                    tile.style.height = `${cellSize}px`;
                    tile.style.top = `${10 + row * (cellSize + 10)}px`;
                    tile.style.left = `${10 + col * (cellSize + 10)}px`;
                    this.gridContainer.appendChild(tile);
                }
            }
        }
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

        let touchStartX, touchStartY;
        document.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
        });

        document.addEventListener('touchend', (e) => {
            if (!touchStartX || !touchStartY) return;
            const touchEndX = e.changedTouches[0].clientX;
            const touchEndY = e.changedTouches[0].clientY;
            const diffX = touchStartX - touchEndX;
            const diffY = touchStartY - touchEndY;

            if (Math.abs(diffX) > Math.abs(diffY)) {
                if (diffX > 0) {
                    this.move('left');
                } else {
                    this.move('right');
                }
            } else {
                if (diffY > 0) {
                    this.move('up');
                } else {
                    this.move('down');
                }
            }
            touchStartX = null;
            touchStartY = null;
        });
    }
}

const game = new Game2048();
