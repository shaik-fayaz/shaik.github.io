document.addEventListener('DOMContentLoaded', function() {
    const board = document.getElementById('board');
    const resetButton = document.getElementById('resetButton');
    const clearButton = document.getElementById('clearButton');
    const playerTurnText = document.getElementById('player-turn');
    const background = document.getElementById('background');
    let draggedColumn = null;
    let draggedCell = null;

    const gameState = {
        currentPlayer: 1,
        grid: [[],[],[],[],[],[],[]], // 7 columns, 6 rows
        winner: null
    };

    function initializeBoard() {
        for (let row = 0; row < 6; row++) {
            for (let col = 0; col < 7; col++) {
                const cell = document.createElement('div');
                cell.classList.add('cell');
                cell.dataset.column = col;
                cell.dataset.row = row;
                cell.addEventListener('click', handleClick);
                cell.addEventListener('dragstart', handleDragStart);
                cell.addEventListener('dragend', handleDragEnd);
                cell.draggable = true;
                board.appendChild(cell);
            }
        }
    }

    function handleClick(event) {
        if (!gameState.winner) {
            const column = parseInt(event.target.dataset.column);
            dropPieceAndCheckWinner(column);
        }
    }

    function handleDragStart(event) {
        if (!gameState.winner) {
            draggedColumn = parseInt(event.target.dataset.column);
            draggedCell = event.target;
            event.dataTransfer.setData('text/plain', `Dragging column ${draggedColumn + 1}`);
            const cellsInColumn = document.querySelectorAll(`[data-column="${draggedColumn}"]`);
            cellsInColumn.forEach(cell => {
                cell.classList.add('dragging');
            });
        }
    }

    function handleDragEnd(event) {
        const cells = document.querySelectorAll('.cell');
        cells.forEach(cell => {
            cell.style.opacity = '';
            cell.classList.remove('dragging');
        });
        draggedColumn = null;
        draggedCell = null;
    }

    function handleDragOver(event) {
        event.preventDefault();
    }

    function handleDrop(event) {
        if (!gameState.winner) {
            const column = parseInt(event.target.dataset.column);
            if (draggedColumn !== null) {
                dropPieceAndCheckWinner(draggedColumn);
                draggedColumn = null;
            }
        }
    }

    function dropPiece(column) {
        for (let row = 5; row >= 0; row--) {
            if (!gameState.grid[column][row]) {
                return row;
            }
        }
        return -1;
    }

    function dropPieceAndCheckWinner(column) {
        const row = dropPiece(column);
        if (row !== -1) {
            const cell = document.querySelector(`[data-column="${column}"][data-row="${row}"]`);
            cell.classList.add(`player${gameState.currentPlayer}`, 'falling');
            gameState.grid[column][row] = gameState.currentPlayer;
            if (checkWinner(column, row)) {
                gameState.winner = gameState.currentPlayer;
                announceWinner();
                return;
            }
            if (checkTie()) {
                announceTie();
                return;
            }
            gameState.currentPlayer = gameState.currentPlayer === 1 ? 2 : 1;
            playerTurnText.innerText = ` ${gameState.currentPlayer === 1 ? 'Black' : 'White'} turn`;
        }
    }

    function checkTie() {
        let cellsFilled = 0;
        for (let column = 0; column < 7; column++) {
            cellsFilled += gameState.grid[column].filter(cell => cell !== undefined).length;
        }
        return cellsFilled === 42 && !checkWinner();
    }

    function announceWinner() {
        if (gameState.winner === 1) {
            document.querySelector('#winner').innerText = 'Black Team';
        } else {
            document.querySelector('#winner').innerText = 'White Team';
        }
        document.querySelector('.winner-overlay').style.display = 'flex';
    }

    function announceTie() {
        document.querySelector('#winner').innerText = 'Match is Tied';
        document.querySelector('.winner-overlay').style.display = 'flex';
    }

    function resetGame() {
        const cells = document.querySelectorAll('.cell');
        cells.forEach(cell => {
            cell.classList.remove('player1', 'player2');
        });
        initializeGameState();
        playerTurnText.innerText = ` ${gameState.currentPlayer === 1 ? 'Black' : 'White'} turn`;
        document.querySelector('.winner-overlay').style.display = 'none';
    }

    function clearBoard() {
        const cells = document.querySelectorAll('.cell');
        cells.forEach(cell => {
            cell.classList.remove('player1', 'player2');
        });
        initializeGameState();
        playerTurnText.innerText = ` ${gameState.currentPlayer === 1 ? 'Black' : 'White'} turn`;
        document.querySelector('.winner-overlay').style.display = 'none';
    }

    function initializeGameState() {
        gameState.currentPlayer = 1;
        gameState.grid = [[],[],[],[],[],[],[]];
        gameState.winner = null;
    }

    function checkWinner(column, row) {
        const directions = [[1, 0], [0, 1], [1, 1], [1, -1]];
        for (const [dx, dy] of directions) {
            let count = 1;
            for (let step = 1; step < 4; step++) {
                const x = column + step * dx;
                const y = row + step * dy;
                if (x >= 0 && x < 7 && y >= 0 && y < 6 && gameState.grid[x][y] === gameState.currentPlayer) {
                    count++;
                } else {
                    break;
                }
            }
            for (let step = -1; step > -4; step--) {
                const x = column + step * dx;
                const y = row + step * dy;
                if (x >= 0 && x < 7 && y >= 0 && y < 6 && gameState.grid[x][y] === gameState.currentPlayer) {
                    count++;
                } else {
                    break;
                }
            }
            if (count >= 4) {
                return true;
            }
        }
        return false;
    }

    board.addEventListener('dragover', handleDragOver);
    board.addEventListener('drop', handleDrop);
    resetButton.addEventListener('click', resetGame);
    clearButton.addEventListener('click', clearBoard);

    initializeBoard();

    for (let i = 0; i < 10; i++) {
        const thunder = document.createElement('div');
        thunder.classList.add('thunder');
        thunder.style.left = Math.random() * 100 + 'vw';
        thunder.style.animationDuration = Math.random() * 3 + 1 + 's';
        background.appendChild(thunder);
    }
});
