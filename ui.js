class GameUI {
    constructor(engine) {
        this.engine = engine;
        this.messageIndex = 0;
    }

    renderBoard() {
        const boardElement = document.getElementById('gameBoard');
        boardElement.innerHTML = '';

        for (let i = 0; i < this.engine.board.length; i++) {
            const cell = document.createElement('div');
            cell.className = 'board-cell';
            cell.dataset.index = i;

            if (this.engine.board[i] !== 0) {
                cell.classList.add('filled');
                const colors = ['#ff4757', '#ffd700', '#2ed573', '#0984e3', '#a855f7', '#ff1493'];
                const colorIndex = (this.engine.board[i] - 1) % colors.length;
                cell.style.background = `linear-gradient(135deg, ${colors[colorIndex]}, ${this.adjustBrightness(colors[colorIndex], 1.2)})`;
            }

            cell.addEventListener('click', () => this.handleCellClick(i));
            boardElement.appendChild(cell);
        }
    }

    renderPieces() {
        const trayElement = document.getElementById('pieceTray');
        trayElement.innerHTML = '';

        this.engine.pieces.forEach((piece) => {
            const pieceElement = document.createElement('div');
            pieceElement.className = 'piece';
            pieceElement.textContent = piece.name;
            pieceElement.dataset.id = piece.id;

            if (this.engine.selectedPiece && this.engine.selectedPiece.id === piece.id) {
                pieceElement.classList.add('selected');
            }

            pieceElement.addEventListener('click', () => this.handlePieceClick(piece.id));
            trayElement.appendChild(pieceElement);
        });
    }

    handleCellClick(index) {
        if (!this.engine.gameActive || this.engine.isPaused) return;

        const result = this.engine.placePiece(index);
        
        if (result === 'gameOver') {
            this.showGameOver();
        } else if (result === true) {
            this.renderBoard();
            this.renderPieces();
            this.updateScore();
            this.showLoveMessage();
        }
    }

    handlePieceClick(pieceId) {
        if (!this.engine.gameActive || this.engine.isPaused) return;
        
        this.engine.selectPiece(pieceId);
        this.renderPieces();
    }

    updateScore() {
        document.getElementById('currentScore').textContent = this.engine.score;
        document.getElementById('currentLevel').textContent = this.engine.level;
    }

    showLoveMessage() {
        const messageEl = document.getElementById('loveMessage');
        const message = getRandomLoveMessage();
        messageEl.textContent = message;
        messageEl.style.animation = 'none';
        setTimeout(() => {
            messageEl.style.animation = 'fadeInOut 4s ease-in-out';
        }, 10);
    }

    showGameOver() {
        this.engine.gameActive = false;
        this.engine.saveRecord();
        
        document.getElementById('finalScore').textContent = this.engine.score;
        document.getElementById('finalLevel').textContent = this.engine.level;

        let message = '';
        if (this.engine.score > 1000) {
            message = `Incrível, Camila! Você conquistou ${this.engine.score} pontos! 🌟`;
        } else if (this.engine.score > 500) {
            message = `Muito bom! Você alcançou o nível ${this.engine.level}! 💖`;
        } else {
            message = `Boa tentativa! Próxima vez você faz melhor! 💗`;
        }

        document.getElementById('gameOverMessage').textContent = message;
        this.showScreen('gameOverScreen');
    }

    showScreen(screenId) {
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });
        document.getElementById(screenId).classList.add('active');
    }

    adjustBrightness(color, factor) {
        const hex = color.replace(/^#/, '');
        const r = parseInt(hex.substring(0, 2), 16);
        const g = parseInt(hex.substring(2, 4), 16);
        const b = parseInt(hex.substring(4, 6), 16);

        const nr = Math.min(255, Math.floor(r * factor));
        const ng = Math.min(255, Math.floor(g * factor));
        const nb = Math.min(255, Math.floor(b * factor));

        return `#${nr.toString(16).padStart(2, '0')}${ng.toString(16).padStart(2, '0')}${nb.toString(16).padStart(2, '0')}`;
    }

    updateHomeScreen() {
        const bestScore = this.engine.getBestScore();
        const maxLevel = this.engine.getMaxLevel();
        
        document.getElementById('bestScoreHome').textContent = bestScore;
        document.getElementById('maxLevelHome').textContent = maxLevel;
    }

    updateRecordsScreen() {
        const records = this.engine.getRecords();
        const recordsList = document.getElementById('recordsList');
        recordsList.innerHTML = '';

        if (records.length === 0) {
            recordsList.innerHTML = '<p style="color: var(--text-muted);">Nenhum recorde ainda. Comece a jogar!</p>';
            return;
        }

        records.forEach((record, index) => {
            const item = document.createElement('div');
            item.className = 'record-item';
            item.innerHTML = `
                <span><strong>#${index + 1}</strong> - Nível ${record.level}</span>
                <span><strong>${record.score}</strong> pts</span>
            `;
            recordsList.appendChild(item);
        });
    }
}
