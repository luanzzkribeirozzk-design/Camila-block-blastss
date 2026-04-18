class CamilaBlockEngine {
    constructor() {
        this.boardSize = 6;
        this.board = [];
        this.score = 0;
        this.level = 1;
        this.selectedPiece = null;
        this.gameActive = false;
        this.isPaused = false;
        this.pieces = [];
        this.moveCount = 0;
        this.initBoard();
    }

    initBoard() {
        this.board = Array(this.boardSize * this.boardSize).fill(0);
        this.pieces = this.generatePieces();
        this.moveCount = 0;
    }

    generatePieces() {
        const shapes = [
            { name: '█', size: 1 },
            { name: '██', size: 2 },
            { name: '███', size: 3 },
            { name: '█\n█', size: 2 },
            { name: '█\n█\n█', size: 3 },
            { name: '██\n█', size: 3 },
            { name: '██\n█\n█', size: 4 },
        ];
        
        const pieces = [];
        for (let i = 0; i < 3; i++) {
            const shape = shapes[Math.floor(Math.random() * shapes.length)];
            pieces.push({ id: i, name: shape.name, size: shape.size });
        }
        return pieces;
    }

    canPlacePiece(index, pieceSize) {
        if (!this.selectedPiece) return false;
        
        const row = Math.floor(index / this.boardSize);
        const col = index % this.boardSize;
        
        // Verificar se há espaço suficiente
        if (col + 1 > this.boardSize || row + 1 > this.boardSize) {
            return false;
        }
        
        // Verificar se as células estão vazias
        for (let i = 0; i < pieceSize; i++) {
            const cellIndex = index + i;
            if (cellIndex >= this.board.length || this.board[cellIndex] !== 0) {
                return false;
            }
        }
        
        return true;
    }

    placePiece(index) {
        if (!this.selectedPiece || !this.canPlacePiece(index, this.selectedPiece.size)) {
            return false;
        }

        const piece = this.selectedPiece;
        for (let i = 0; i < piece.size; i++) {
            this.board[index + i] = piece.id + 1;
        }

        this.pieces.splice(this.pieces.indexOf(piece), 1);
        this.selectedPiece = null;
        this.moveCount++;

        // Limpar linhas e colunas completas
        const cleared = this.clearLines();
        this.score += cleared * 50;

        // Gerar novas peças se todas foram usadas
        if (this.pieces.length === 0) {
            this.pieces = this.generatePieces();
        }

        // Aumentar dificuldade
        this.updateDifficulty();

        // Verificar fim de jogo
        if (!this.hasValidMoves()) {
            return 'gameOver';
        }

        return true;
    }

    clearLines() {
        let cleared = 0;
        const fullRows = [];
        const fullCols = [];

        // Verificar linhas completas
        for (let row = 0; row < this.boardSize; row++) {
            let isFull = true;
            for (let col = 0; col < this.boardSize; col++) {
                if (this.board[row * this.boardSize + col] === 0) {
                    isFull = false;
                    break;
                }
            }
            if (isFull) fullRows.push(row);
        }

        // Verificar colunas completas
        for (let col = 0; col < this.boardSize; col++) {
            let isFull = true;
            for (let row = 0; row < this.boardSize; row++) {
                if (this.board[row * this.boardSize + col] === 0) {
                    isFull = false;
                    break;
                }
            }
            if (isFull) fullCols.push(col);
        }

        // Limpar linhas
        for (const row of fullRows) {
            for (let col = 0; col < this.boardSize; col++) {
                this.board[row * this.boardSize + col] = 0;
            }
            cleared++;
        }

        // Limpar colunas
        for (const col of fullCols) {
            for (let row = 0; row < this.boardSize; row++) {
                this.board[row * this.boardSize + col] = 0;
            }
            cleared++;
        }

        return cleared;
    }

    hasValidMoves() {
        for (const piece of this.pieces) {
            for (let i = 0; i < this.board.length; i++) {
                if (this.canPlacePiece(i, piece.size)) {
                    return true;
                }
            }
        }
        return false;
    }

    updateDifficulty() {
        const newLevel = Math.floor(this.score / 500) + 1;
        if (newLevel > this.level) {
            this.level = newLevel;
        }
    }

    selectPiece(pieceId) {
        this.selectedPiece = this.pieces.find(p => p.id === pieceId);
    }

    getGameState() {
        return {
            board: this.board,
            score: this.score,
            level: this.level,
            pieces: this.pieces,
            selectedPiece: this.selectedPiece,
            moveCount: this.moveCount,
        };
    }

    saveGame() {
        const state = this.getGameState();
        localStorage.setItem('camilaBlockGame', JSON.stringify(state));
    }

    loadGame() {
        const saved = localStorage.getItem('camilaBlockGame');
        if (saved) {
            const state = JSON.parse(saved);
            this.board = state.board;
            this.score = state.score;
            this.level = state.level;
            this.pieces = state.pieces;
            this.selectedPiece = state.selectedPiece;
            this.moveCount = state.moveCount;
            return true;
        }
        return false;
    }

    clearGame() {
        localStorage.removeItem('camilaBlockGame');
    }

    saveRecord() {
        const records = this.getRecords();
        records.push({
            score: this.score,
            level: this.level,
            date: new Date().toLocaleDateString('pt-BR'),
        });
        records.sort((a, b) => b.score - a.score);
        records.splice(10); // Manter apenas os 10 melhores
        localStorage.setItem('camilaBlockRecords', JSON.stringify(records));
    }

    getRecords() {
        const records = localStorage.getItem('camilaBlockRecords');
        return records ? JSON.parse(records) : [];
    }

    getBestScore() {
        const records = this.getRecords();
        return records.length > 0 ? records[0].score : 0;
    }

    getMaxLevel() {
        const records = this.getRecords();
        return records.length > 0 ? Math.max(...records.map(r => r.level)) : 1;
    }
}

// Mensagens românticas para Camila
const loveMessages = [
    "Camila, você ilumina cada jogada. 💗",
    "Cada bloco é um pensamento em você. 💕",
    "Você é meu melhor recorde. 💖",
    "Camila, você torna tudo mais belo. ✨",
    "Jogar pensando em você é especial. 💝",
    "Você é a razão de cada vitória. 🌟",
    "Camila, você é minha inspiração. 💫",
    "Cada ponto é dedicado a você. 💗",
    "Você torna meu coração mais leve. 🎮",
    "Camila, você é meu maior prêmio. 👑",
];

function getRandomLoveMessage() {
    return loveMessages[Math.floor(Math.random() * loveMessages.length)];
}
