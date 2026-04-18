let game = null;
let ui = null;

function initGame() {
    game = new CamilaBlockEngine();
    ui = new GameUI(game);
    ui.updateHomeScreen();
}

function startGame() {
    game = new CamilaBlockEngine();
    ui = new GameUI(game);
    
    game.gameActive = true;
    game.isPaused = false;
    
    ui.renderBoard();
    ui.renderPieces();
    ui.updateScore();
    ui.showScreen('gameScreen');
    ui.showLoveMessage();
}

function pauseGame() {
    if (!game.gameActive) return;
    
    game.isPaused = true;
    game.saveGame();
    
    document.getElementById('pauseScore').textContent = game.score;
    document.getElementById('pauseLevel').textContent = game.level;
    
    ui.showScreen('pauseScreen');
}

function resumeGame() {
    if (!game) return;
    
    game.isPaused = false;
    ui.showScreen('gameScreen');
}

function goHome() {
    if (game) {
        game.gameActive = false;
        game.clearGame();
    }
    
    initGame();
    ui.showScreen('homeScreen');
}

function showRecords() {
    ui.updateRecordsScreen();
    ui.showScreen('recordsScreen');
}

// Inicializar ao carregar a página
document.addEventListener('DOMContentLoaded', () => {
    initGame();
    ui.showScreen('homeScreen');
});

// Salvar jogo periodicamente
setInterval(() => {
    if (game && game.gameActive && !game.isPaused) {
        game.saveGame();
    }
}, 5000);
