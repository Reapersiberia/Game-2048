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
        // Маппинг чисел на ID покемонов (популярные покемоны)
        this.pokemonMap = {
            2: 1,    // Bulbasaur
            4: 4,    // Charmander
            8: 7,    // Squirtle
            16: 25,  // Pikachu
            32: 39,  // Jigglypuff
            64: 52,  // Meowth
            128: 54, // Psyduck
            256: 133, // Eevee
            512: 150, // Mewtwo
            1024: 151, // Mew
            2048: 149  // Dragonite
        };
        
        // Дополнительные покемоны для больших чисел
        this.pokemonList = [
            1, 4, 7, 25, 39, 52, 54, 133, 150, 151, 149, // Основные
            6, 9, 26, 38, 94, 130, 134, 135, 136, 143, // Дополнительные популярные
            144, 145, 146, 150, 151, 249, 250, 251, // Легендарные
            3, 5, 8, 10, 11, 12, 13, 14, 15 // Еще покемоны
        ];
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

    getPokemonSpriteUrl(pokemonId) {
        // Используем анимированные спрайты из PokeAPI
        // Для разных поколений есть разные варианты анимаций
        return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/${pokemonId}.gif`;
    }
    
    getPokemonIdForValue(value) {
        // Если есть точное соответствие, используем его
        if (this.pokemonMap[value]) {
            return this.pokemonMap[value];
        }
        // Иначе вычисляем покемона на основе значения
        // Используем индекс из списка покемонов
        const index = Math.min(Math.floor(Math.log2(value)) - 1, this.pokemonList.length - 1);
        return this.pokemonList[Math.max(0, index)] || 1;
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
                    const value = this.grid[row][col];
                    const tile = document.createElement('div');
                    tile.className = `tile tile-${value}`;
                    
                    // Получаем ID покемона для этого числа
                    const pokemonId = this.getPokemonIdForValue(value);
                    const spriteUrl = this.getPokemonSpriteUrl(pokemonId);
                    
                    // Создаем контейнер для покемона и цифры
                    const pokemonImg = document.createElement('img');
                    pokemonImg.src = spriteUrl;
                    pokemonImg.className = 'pokemon-sprite';
                    pokemonImg.alt = `Pokemon ${pokemonId}`;
                    pokemonImg.loading = 'lazy';
                    pokemonImg.onerror = function() {
                        // Если анимированный спрайт не загрузился, пробуем другие варианты
                        const staticUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonId}.png`;
                        if (this.src !== staticUrl) {
                            this.src = staticUrl;
                        } else {
                            // Если и статический не загрузился, используем placeholder
                            this.style.display = 'none';
                        }
                    };
                    
                    // Цифра прямо на покемоне (без бейджа)
                    const numberLabel = document.createElement('div');
                    numberLabel.className = 'tile-number';
                    numberLabel.textContent = value;
                    
                    tile.appendChild(pokemonImg);
                    tile.appendChild(numberLabel);
                    
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

// Initialize game
window.game = new Game2048();

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

function showWalletInfo(address) {
    if (!walletInfoEl) return;
    if (address) {
        const short = address.slice(0, 6) + '...' + address.slice(-4);
        walletInfoEl.textContent = `Connected: ${short}`;
        walletInfoEl.className = 'wallet-info connected';
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
        
        return farcasterSDK;
    } catch (e) {
        console.log('Farcaster SDK init:', e.message);
        return null;
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
    return newCount;
}

function getLastGMDate() {
    const dateStr = localStorage.getItem('gm_last_date');
    if (!dateStr) return null;
    return new Date(dateStr);
}

function formatDate(date) {
    if (!date) return 'Never';
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
        return 'Today';
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
    
    if (counterValue) {
        const count = getGMCount();
        counterValue.textContent = count;
        
        // Анимация при обновлении
        counterValue.style.transform = 'scale(1.2)';
        setTimeout(() => {
            counterValue.style.transform = 'scale(1)';
        }, 200);
    }
    
    if (counterDate) {
        const lastDate = getLastGMDate();
        counterDate.textContent = formatDate(lastDate);
    }
}

// Check if GM was already sent today
function canSendGMToday() {
    const today = new Date().toDateString();
    const lastGMDate = localStorage.getItem('gm_last_date');
    return lastGMDate !== today;
}

// Save GM for today with optional tx hash
function saveGMToday(txHash) {
    const today = new Date().toDateString();
    localStorage.setItem('gm_last_date', today);
    if (txHash) {
        localStorage.setItem('gm_last_tx', txHash);
    }
    incrementGMCount(); // Увеличиваем счетчик
}

// Get last GM transaction hash
function getLastGMTx() {
    return localStorage.getItem('gm_last_tx');
}

// GM function with MetaMask on Base - once per day with counter
async function sendGM() {
    const btn = document.getElementById('gm-btn');
    
    // Check if already sent today
    if (!canSendGMToday()) {
        showStatus('GM уже отправлен сегодня! ☀️ Приходи завтра!', 'success');
        if (btn) btn.disabled = true;
        return;
    }
    
    if (btn) btn.disabled = true;
    
    try {
        // Check if wallet is available
        if (typeof window.ethereum === 'undefined') {
            showStatus('Установи MetaMask для отправки GM на Base!', 'error');
            window.open('https://metamask.io/download/', '_blank');
            if (btn) btn.disabled = false;
            return;
        }
        
        showStatus('Подключение к Base...', 'loading');
        
        // Step 1: Switch to Base network
        const chainId = await window.ethereum.request({ method: 'eth_chainId' });
        if (chainId.toLowerCase() !== TARGET_NETWORK.chainId.toLowerCase()) {
            showStatus('Переключение на Base...', 'loading');
            try {
                await window.ethereum.request({
                    method: 'wallet_switchEthereumChain',
                    params: [{ chainId: TARGET_NETWORK.chainId }]
                });
                await new Promise(r => setTimeout(r, 1000));
            } catch (switchError) {
                if (switchError.code === 4902) {
                    // Add Base network
                    await window.ethereum.request({
                        method: 'wallet_addEthereumChain',
                        params: [TARGET_NETWORK]
                    });
                    await new Promise(r => setTimeout(r, 1000));
                } else if (switchError.code === 4001) {
                    showStatus('Переключение на Base отменено', 'error');
                    if (btn) btn.disabled = false;
                    return;
                } else {
                    throw switchError;
                }
            }
        }
        
        // Step 2: Get accounts
        showStatus('Подключение кошелька...', 'loading');
        let accounts = await window.ethereum.request({ method: 'eth_accounts' });
        
        if (!accounts || accounts.length === 0) {
            accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        }
        
        if (!accounts || accounts.length === 0) {
            showStatus('Кошелек не подключен', 'error');
            if (btn) btn.disabled = false;
            return;
        }
        
        const from = accounts[0];
        showWalletInfo(from);
        
        // Step 3: Sign GM message (free, no gas needed)
        showStatus('Подпиши GM сообщение... ☀️', 'loading');
        
        const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
        const gmMessage = `GM! ☀️\n\nDate: ${today}\nFrom: ${from}\n\nThis is your daily GM on Base!`;
        
        // Sign the message with MetaMask
        const signature = await window.ethereum.request({
            method: 'personal_sign',
            params: [gmMessage, from]
        });
        
        // Step 4: Save GM with signature and update counter
        saveGMToday(signature);
        showStatus('GM! ☀️ День ' + getGMCount() + ' подтверждён!', 'success');
        
        // Add celebration animation
        const counterBox = document.querySelector('.gm-counter-box');
        if (counterBox) {
            counterBox.style.animation = 'none';
            counterBox.offsetHeight; // trigger reflow
            counterBox.style.animation = 'celebrate 0.5s ease';
        }
        
        // Log signature for user
        console.log('GM Signature:', signature.slice(0, 20) + '...');
        
        if (btn) btn.disabled = true;
        
    } catch (error) {
        console.error('GM Error:', error);
        
        let errorMessage = 'Ошибка подписи GM';
        
        if (error.code === 4001) {
            errorMessage = 'Подпись отменена';
        } else if (error.message) {
            errorMessage = error.message.substring(0, 40);
        }
        
        showStatus(errorMessage, 'error');
        if (btn) btn.disabled = false;
    }
}

// ============================================
// Deploy Contract Function
// ============================================

async function deployContract() {
    const btn = document.getElementById('deploy-btn');
    if (btn) btn.disabled = true;
    
    try {
        // Connect wallet if not connected
        if (!signer) {
            const connected = await connectWallet();
            if (!connected) {
                if (btn) btn.disabled = false;
                return;
            }
        }
        
        // Ensure we're on Base network
        if (typeof window.ethereum !== 'undefined') {
            const onBase = await ensureBaseNetwork();
            if (!onBase) {
                if (btn) btn.disabled = false;
                return;
            }
        }
        
        showStatus('Деплой контракта на Base...', 'loading');
        
        const currentScore = window.game ? window.game.score : 0;
        console.log('Deploying with score:', currentScore);
        
        // Build contract bytecode that stores score
        // This is handcrafted EVM bytecode:
        
        // INIT CODE (constructor):
        // Store score at slot 0, then return runtime code
        
        // Score as 32 bytes (padded)
        const scoreBigInt = BigInt(currentScore);
        const scoreBytes = scoreBigInt.toString(16).padStart(64, '0');
        
        // INIT CODE:
        // 7f + 32bytes score = PUSH32 <score>
        // 60 00 = PUSH1 0
        // 55 = SSTORE (stores score at slot 0)
        // 60 20 = PUSH1 32 (runtime code length) 
        // 60 27 = PUSH1 39 (offset to runtime code in init)
        // 60 00 = PUSH1 0 (memory destination)
        // 39 = CODECOPY
        // 60 20 = PUSH1 32 (return size)
        // 60 00 = PUSH1 0 (return offset) 
        // f3 = RETURN
        // [RUNTIME CODE STARTS HERE - 32 bytes]
        
        // RUNTIME CODE (what stays on chain):
        // Returns the stored score when called
        // 60 00 = PUSH1 0
        // 54 = SLOAD (load from slot 0)
        // 60 00 = PUSH1 0 (memory position)
        // 52 = MSTORE (store result in memory)
        // 60 20 = PUSH1 32 (return size)
        // 60 00 = PUSH1 0 (return offset)
        // f3 = RETURN
        // Pad to 32 bytes with zeros
        
        // Runtime code: SLOAD slot 0, store to memory, return
        // 60 00 54 60 00 52 60 20 60 00 f3 = 11 bytes
        const runtimeCode = '6000546000526020600060f3';
        const runtimeLen = runtimeCode.length / 2; // 11 bytes
        const runtimeLenHex = runtimeLen.toString(16).padStart(2, '0');
        
        // Init code structure:
        // 7f + 32bytes = PUSH32 score (33 bytes)
        // 6000 55 = PUSH1 0, SSTORE (3 bytes)
        // 60 XX = PUSH1 runtimeLen (2 bytes)
        // 60 XX = PUSH1 offset (2 bytes) 
        // 6000 39 = PUSH1 0, CODECOPY (3 bytes)
        // 60 XX 6000 f3 = PUSH1 len, PUSH1 0, RETURN (5 bytes)
        // Total init = 33+3+2+2+3+5 = 48 = 0x30
        
        const offset = 48; // Offset to runtime code
        const offsetHex = offset.toString(16).padStart(2, '0');
        
        const initCode = '7f' + scoreBytes + '600055' + '60' + runtimeLenHex + '60' + offsetHex + '6000' + '39' + '60' + runtimeLenHex + '6000' + 'f3' + runtimeCode;
        
        const bytecode = '0x' + initCode;
        console.log('Bytecode length:', bytecode.length);
        
        // Send deployment transaction
        const tx = await signer.sendTransaction({
            data: bytecode
        });
        
        showStatus('TX sent! Waiting for confirmation...', 'loading');
        
        const receipt = await tx.wait();
        
        if (receipt.contractAddress) {
            const txUrl = `${TARGET_NETWORK.blockExplorerUrls[0]}/address/${receipt.contractAddress}`;
            showStatus(`Contract deployed! ${receipt.contractAddress.slice(0, 10)}...`, 'success');
            
            console.log('Contract Address:', receipt.contractAddress);
            console.log('Explorer:', txUrl);
            
            // Display transaction in UI instead of redirecting
            const txDisplay = document.getElementById('transaction-display');
            const txHashEl = document.getElementById('transaction-hash');
            if (txDisplay && txHashEl) {
                const shortHash = receipt.contractAddress.slice(0, 8) + '...' + receipt.contractAddress.slice(-6);
                txHashEl.textContent = shortHash;
                txHashEl.title = receipt.contractAddress; // Full address on hover
                txHashEl.style.cursor = 'pointer';
                txHashEl.onclick = () => {
                    window.open(txUrl, '_blank');
                };
                txDisplay.style.display = 'block';
            }
        } else {
            const txUrl = `${TARGET_NETWORK.blockExplorerUrls[0]}/tx/${receipt.hash}`;
            showStatus(`TX confirmed! ${receipt.hash.slice(0, 10)}...`, 'success');
            
            // Display transaction in UI instead of redirecting
            const txDisplay = document.getElementById('transaction-display');
            const txHashEl = document.getElementById('transaction-hash');
            if (txDisplay && txHashEl) {
                const shortHash = receipt.hash.slice(0, 8) + '...' + receipt.hash.slice(-6);
                txHashEl.textContent = shortHash;
                txHashEl.title = receipt.hash; // Full hash on hover
                txHashEl.style.cursor = 'pointer';
                txHashEl.onclick = () => {
                    window.open(txUrl, '_blank');
                };
                txDisplay.style.display = 'block';
            }
        }
        
    } catch (error) {
        console.error('Deploy Error:', error);
        
        if (error.code === 'ACTION_REJECTED' || error.message?.includes('rejected')) {
            showStatus('Deployment cancelled', 'error');
        } else if (error.message?.includes('insufficient funds')) {
            showStatus('Insufficient ETH for gas. Get Base ETH first.', 'error');
        } else {
            showStatus('Error: ' + (error.shortMessage || error.message || 'Unknown'), 'error');
        }
    } finally {
        if (btn) btn.disabled = false;
    }
}


// ============================================
// Initialization
// ============================================

// Make functions global
window.sendGM = sendGM;
window.deployContract = deployContract;
window.connectWallet = connectWallet;

// Initialize on load
document.addEventListener('DOMContentLoaded', async () => {
    console.log('Initializing Base MiniApp...');
    
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
    
    // Check if GM was already sent today - disable button
    if (!canSendGMToday()) {
        const btn = document.getElementById('gm-btn');
        if (btn) {
            btn.disabled = true;
        }
    }
});

console.log('Script loaded. Ready for Base transactions!');
