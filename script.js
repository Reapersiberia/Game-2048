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

function showStatus(message, type = 'loading') {
    if (!statusEl) return;
    statusEl.textContent = message;
    statusEl.className = 'web3-status ' + type;
    if (type !== 'loading') {
        setTimeout(() => {
            statusEl.textContent = '';
            statusEl.className = 'web3-status';
        }, 8000);
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
        showStatus('No wallet found! Install MetaMask.', 'error');
        window.open('https://metamask.io/download/', '_blank');
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
// GM Function - Send onchain GM transaction
// ============================================

async function sendGM() {
    const btn = document.getElementById('gm-btn');
    if (btn) btn.disabled = true;
    
    try {
        // Get accounts - connect if needed
        let accounts = await window.ethereum.request({ method: 'eth_accounts' });
        
        if (!accounts || accounts.length === 0) {
            showStatus('Connecting...', 'loading');
            accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        }
        
        if (!accounts || accounts.length === 0) {
            showStatus('No wallet connected', 'error');
            if (btn) btn.disabled = false;
            return;
        }
        
        const from = accounts[0];
        showStatus('Sending GM...', 'loading');
        
        // Send zero-value transaction to self
        // This is an onchain "GM" - proof of activity
        const txHash = await window.ethereum.request({
            method: 'eth_sendTransaction',
            params: [{
                from: from,
                to: from,
                value: '0x0' // 0 ETH - free GM
            }]
        });
        
        showStatus('GM sent! ☀️', 'success');
        
        // Display transaction in UI instead of redirecting
        const txDisplay = document.getElementById('transaction-display');
        const txHashEl = document.getElementById('transaction-hash');
        if (txDisplay && txHashEl) {
            const shortHash = txHash.slice(0, 8) + '...' + txHash.slice(-6);
            txHashEl.textContent = shortHash;
            txHashEl.title = txHash; // Full hash on hover
            txHashEl.onclick = () => {
                const txUrl = `${TARGET_NETWORK.blockExplorerUrls[0]}/tx/${txHash}`;
                window.open(txUrl, '_blank');
            };
            txDisplay.style.display = 'block';
        }
        
    } catch (error) {
        console.error('GM Error:', error);
        if (error.code === 4001) {
            showStatus('Cancelled', 'error');
        } else {
            showStatus('Error: ' + (error.message || 'Failed'), 'error');
        }
    } finally {
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
        
        showStatus('Deploying contract to Base...', 'loading');
        
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
            
            // Open in explorer
            if (farcasterSDK && farcasterSDK.actions && farcasterSDK.actions.openUrl) {
                farcasterSDK.actions.openUrl(txUrl);
            } else {
                window.open(txUrl, '_blank');
            }
        } else {
            const txUrl = `${TARGET_NETWORK.blockExplorerUrls[0]}/tx/${receipt.hash}`;
            showStatus(`TX confirmed! ${receipt.hash.slice(0, 10)}...`, 'success');
            window.open(txUrl, '_blank');
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
    
    // Initialize Farcaster SDK
    await initFarcasterSDK();
    
    // Check if ethers is loaded
    if (typeof ethers === 'undefined') {
        console.error('ethers.js not loaded!');
        showStatus('Loading Web3...', 'loading');
        return;
    }
    
    console.log('ethers.js version:', ethers.version);
    console.log('Target network:', TARGET_NETWORK.chainName);
    
    // Auto-connect if wallet available
    const hasWallet = (farcasterSDK && farcasterSDK.wallet) || window.ethereum;
    if (hasWallet) {
        console.log('Wallet detected, ready to connect');
    } else {
        console.log('No wallet detected. Use Warpcast or install MetaMask.');
    }
});

console.log('Script loaded. Ready for Base transactions!');
