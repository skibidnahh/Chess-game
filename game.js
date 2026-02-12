// Game state
let board = [];
let selectedSquare = null;
let currentPlayer = ‘white’;
let gameOver = false;
let moveHistory = [];
let lastMove = null;
let pieceStyle = ‘unicode’;
let whiteKingPos = { row: 7, col: 4 };
let blackKingPos = { row: 0, col: 4 };

// Initialize board
function initBoard() {
board = [
[‘bR’, ‘bN’, ‘bB’, ‘bQ’, ‘bK’, ‘bB’, ‘bN’, ‘bR’],
[‘bP’, ‘bP’, ‘bP’, ‘bP’, ‘bP’, ‘bP’, ‘bP’, ‘bP’],
[’’, ‘’, ‘’, ‘’, ‘’, ‘’, ‘’, ‘’],
[’’, ‘’, ‘’, ‘’, ‘’, ‘’, ‘’, ‘’],
[’’, ‘’, ‘’, ‘’, ‘’, ‘’, ‘’, ‘’],
[’’, ‘’, ‘’, ‘’, ‘’, ‘’, ‘’, ‘’],
[‘wP’, ‘wP’, ‘wP’, ‘wP’, ‘wP’, ‘wP’, ‘wP’, ‘wP’],
[‘wR’, ‘wN’, ‘wB’, ‘wQ’, ‘wK’, ‘wB’, ‘wN’, ‘wR’]
];
currentPlayer = ‘white’;
gameOver = false;
moveHistory = [];
lastMove = null;
whiteKingPos = { row: 7, col: 4 };
blackKingPos = { row: 0, col: 4 };
renderBoard();
updateStatus();
}

// Render board
function renderBoard() {
const boardElement = document.getElementById(‘chessboard’);
boardElement.innerHTML = ‘’;

```
for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
        const square = document.createElement('div');
        square.className = 'square ' + ((row + col) % 2 === 0 ? 'light' : 'dark');
        square.dataset.row = row;
        square.dataset.col = col;
        
        const piece = board[row][col];
        if (piece) {
            if (pieceStyle === 'unicode') {
                const pieceDiv = document.createElement('div');
                pieceDiv.className = 'piece unicode';
                pieceDiv.textContent = unicodePieces[piece];
                pieceDiv.dataset.piece = piece;
                square.appendChild(pieceDiv);
            } else {
                const img = document.createElement('img');
                img.className = 'piece';
                img.src = svgPieces[piece];
                img.dataset.piece = piece;
                square.appendChild(img);
            }
        }

        if (lastMove && 
            ((lastMove.from.row === row && lastMove.from.col === col) ||
             (lastMove.to.row === row && lastMove.to.col === col))) {
            square.classList.add('last-move');
        }

        // Highlight king in check
        if (piece === 'wK' && isKingInCheck('white')) {
            square.classList.add('in-check');
        } else if (piece === 'bK' && isKingInCheck('black')) {
            square.classList.add('in-check');
        }

        square.addEventListener('click', () => handleSquareClick(row, col));
        boardElement.appendChild(square);
    }
}
updateEloDisplay();
```

}

// Handle square click
function handleSquareClick(row, col) {
if (gameOver || currentPlayer === ‘black’) return;

```
const piece = board[row][col];

if (selectedSquare) {
    const validMoves = getValidMoves(selectedSquare.row, selectedSquare.col);
    const isValidMove = validMoves.some(move => move.row === row && move.col === col);

    if (isValidMove) {
        makeMoveWithAnimation(selectedSquare.row, selectedSquare.col, row, col);
        selectedSquare = null;
        clearHighlights();
    } else if (piece && piece[0] === 'w') {
        selectedSquare = { row, col };
        highlightValidMoves(row, col);
    } else {
        selectedSquare = null;
        clearHighlights();
    }
} else if (piece && piece[0] === 'w') {
    selectedSquare = { row, col };
    highlightValidMoves(row, col);
}
```

}

// Highlight valid moves
function highlightValidMoves(row, col) {
clearHighlights();

```
const square = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
square.classList.add('selected');

const validMoves = getValidMoves(row, col);
validMoves.forEach(move => {
    const targetSquare = document.querySelector(`[data-row="${move.row}"][data-col="${move.col}"]`);
    targetSquare.classList.add('valid-move');
    if (board[move.row][move.col]) {
        targetSquare.classList.add('has-piece');
    }
});
```

}

// Clear highlights
function clearHighlights() {
document.querySelectorAll(’.square’).forEach(sq => {
sq.classList.remove(‘selected’, ‘valid-move’, ‘has-piece’);
});
}

// Make move with animation
function makeMoveWithAnimation(fromRow, fromCol, toRow, toCol) {
const piece = board[fromRow][fromCol];
const fromSquare = document.querySelector(`[data-row="${fromRow}"][data-col="${fromCol}"]`);
const toSquare = document.querySelector(`[data-row="${toRow}"][data-col="${toCol}"]`);

```
const pieceElement = fromSquare.querySelector('.piece');
if (!pieceElement) {
    makeMove(fromRow, fromCol, toRow, toCol);
    return;
}

// Clone piece for animation
const animatedPiece = pieceElement.cloneNode(true);
animatedPiece.classList.add('animating');

const fromRect = fromSquare.getBoundingClientRect();
const toRect = toSquare.getBoundingClientRect();

animatedPiece.style.position = 'fixed';
animatedPiece.style.left = fromRect.left + 'px';
animatedPiece.style.top = fromRect.top + 'px';
animatedPiece.style.zIndex = '1000';

document.body.appendChild(animatedPiece);
pieceElement.style.opacity = '0';

setTimeout(() => {
    animatedPiece.style.left = toRect.left + 'px';
    animatedPiece.style.top = toRect.top + 'px';
}, 10);

setTimeout(() => {
    document.body.removeChild(animatedPiece);
    makeMove(fromRow, fromCol, toRow, toCol);
    
    if (!gameOver) {
        setTimeout(() => opponentMove(), 300);
    }
}, 420);
```

}

// Make a move
function makeMove(fromRow, fromCol, toRow, toCol) {
const piece = board[fromRow][fromCol];
const captured = board[toRow][toCol];

```
board[toRow][toCol] = piece;
board[fromRow][fromCol] = '';

if (piece === 'wK') {
    whiteKingPos = { row: toRow, col: toCol };
} else if (piece === 'bK') {
    blackKingPos = { row: toRow, col: toCol };
}

lastMove = {
    from: { row: fromRow, col: fromCol },
    to: { row: toRow, col: toCol },
    piece: piece,
    captured: captured
};

const files = 'abcdefgh';
const moveNotation = `${piece} ${files[fromCol]}${8 - fromRow} → ${files[toCol]}${8 - toRow}`;
moveHistory.push(moveNotation);
updateMoveHistory();

currentPlayer = currentPlayer === 'white' ? 'black' : 'white';
renderBoard();

if (checkGameOver()) {
    handleGameOver();
} else {
    updateStatus();
}
```

}

// Get valid moves
function getValidMoves(row, col) {
const piece = board[row][col];
if (!piece) return [];

```
const color = piece[0];
const type = piece[1];
let moves = [];

switch (type) {
    case 'P': moves = getPawnMoves(row, col, color); break;
    case 'R': moves = getRookMoves(row, col, color); break;
    case 'N': moves = getKnightMoves(row, col, color); break;
    case 'B': moves = getBishopMoves(row, col, color); break;
    case 'Q': moves = getQueenMoves(row, col, color); break;
    case 'K': moves = getKingMoves(row, col, color); break;
}

return moves.filter(move => {
    return !wouldBeInCheck(row, col, move.row, move.col, color);
});
```

}

function wouldBeInCheck(fromRow, fromCol, toRow, toCol, color) {
const piece = board[fromRow][fromCol];
const captured = board[toRow][toCol];
const oldKingPos = color === ‘w’ ? {…whiteKingPos} : {…blackKingPos};

```
board[toRow][toCol] = piece;
board[fromRow][fromCol] = '';

if (piece[1] === 'K') {
    if (color === 'w') {
        whiteKingPos = { row: toRow, col: toCol };
    } else {
        blackKingPos = { row: toRow, col: toCol };
    }
}

const inCheck = isKingInCheck(color === 'w' ? 'white' : 'black');

board[fromRow][fromCol] = piece;
board[toRow][toCol] = captured;

if (piece[1] === 'K') {
    if (color === 'w') {
        whiteKingPos = oldKingPos;
    } else {
        blackKingPos = oldKingPos;
    }
}

return inCheck;
```

}

function isKingInCheck(color) {
const kingPos = color === ‘white’ ? whiteKingPos : blackKingPos;
const enemyColor = color === ‘white’ ? ‘b’ : ‘w’;

```
for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
        const piece = board[row][col];
        if (piece && piece[0] === enemyColor) {
            const moves = getBasicMoves(row, col);
            if (moves.some(move => move.row === kingPos.row && move.col === kingPos.col)) {
                return true;
            }
        }
    }
}
return false;
```

}

function getBasicMoves(row, col) {
const piece = board[row][col];
if (!piece) return [];

```
const color = piece[0];
const type = piece[1];

switch (type) {
    case 'P': return getPawnMoves(row, col, color);
    case 'R': return getRookMoves(row, col, color);
    case 'N': return getKnightMoves(row, col, color);
    case 'B': return getBishopMoves(row, col, color);
    case 'Q': return getQueenMoves(row, col, color);
    case 'K': return getKingMoves(row, col, color);
}
return [];
```

}

function getPawnMoves(row, col, color) {
const moves = [];
const direction = color === ‘w’ ? -1 : 1;
const startRow = color === ‘w’ ? 6 : 1;

```
if (isValidSquare(row + direction, col) && !board[row + direction][col]) {
    moves.push({ row: row + direction, col });
    if (row === startRow && !board[row + 2 * direction][col]) {
        moves.push({ row: row + 2 * direction, col });
    }
}

[-1, 1].forEach(dc => {
    const newRow = row + direction;
    const newCol = col + dc;
    if (isValidSquare(newRow, newCol) && board[newRow][newCol] && 
        board[newRow][newCol][0] !== color) {
        moves.push({ row: newRow, col: newCol });
    }
});

return moves;
```

}

function getRookMoves(row, col, color) {
return getSlidingMoves(row, col, color, [[0,1], [0,-1], [1,0], [-1,0]]);
}

function getBishopMoves(row, col, color) {
return getSlidingMoves(row, col, color, [[1,1], [1,-1], [-1,1], [-1,-1]]);
}

function getQueenMoves(row, col, color) {
return getSlidingMoves(row, col, color,
[[0,1], [0,-1], [1,0], [-1,0], [1,1], [1,-1], [-1,1], [-1,-1]]);
}

function getKnightMoves(row, col, color) {
const moves = [];
const knightMoves = [[2,1], [2,-1], [-2,1], [-2,-1], [1,2], [1,-2], [-1,2], [-1,-2]];

```
knightMoves.forEach(([dr, dc]) => {
    const newRow = row + dr;
    const newCol = col + dc;
    if (isValidSquare(newRow, newCol) && 
        (!board[newRow][newCol] || board[newRow][newCol][0] !== color)) {
        moves.push({ row: newRow, col: newCol });
    }
});

return moves;
```

}

function getKingMoves(row, col, color) {
const moves = [];
const kingMoves = [[0,1], [0,-1], [1,0], [-1,0], [1,1], [1,-1], [-1,1], [-1,-1]];

```
kingMoves.forEach(([dr, dc]) => {
    const newRow = row + dr;
    const newCol = col + dc;
    if (isValidSquare(newRow, newCol) && 
        (!board[newRow][newCol] || board[newRow][newCol][0] !== color)) {
        moves.push({ row: newRow, col: newCol });
    }
});

return moves;
```

}

function getSlidingMoves(row, col, color, directions) {
const moves = [];

```
directions.forEach(([dr, dc]) => {
    let newRow = row + dr;
    let newCol = col + dc;
    
    while (isValidSquare(newRow, newCol)) {
        if (!board[newRow][newCol]) {
            moves.push({ row: newRow, col: newCol });
        } else {
            if (board[newRow][newCol][0] !== color) {
                moves.push({ row: newRow, col: newCol });
            }
            break;
        }
        newRow += dr;
        newCol += dc;
    }
});

return moves;
```

}

function isValidSquare(row, col) {
return row >= 0 && row < 8 && col >= 0 && col < 8;
}

function checkGameOver() {
let whiteKing = false, blackKing = false;

```
for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
        if (board[row][col] === 'wK') whiteKing = true;
        if (board[row][col] === 'bK') blackKing = true;
    }
}

if (!whiteKing) {
    gameOver = true;
    return 'black';
}
if (!blackKing) {
    gameOver = true;
    return 'white';
}

if (!hasValidMoves(currentPlayer === 'white' ? 'w' : 'b')) {
    gameOver = true;
    const inCheck = isKingInCheck(currentPlayer);
    if (inCheck) {
        return currentPlayer === 'white' ? 'black' : 'white';
    } else {
        return 'draw';
    }
}

return false;
```

}

function hasValidMoves(color) {
for (let row = 0; row < 8; row++) {
for (let col = 0; col < 8; col++) {
if (board[row][col] && board[row][col][0] === color) {
const moves = getValidMoves(row, col);
if (moves.length > 0) {
return true;
}
}
}
}
return false;
}

function handleGameOver() {
const winner = checkGameOver();
showGameResultModal(winner);
}

function getBoardState() {
let state = ’  a b c d e f g h\n’;
for (let row = 0; row < 8; row++) {
state += `${8 - row} `;
for (let col = 0; col < 8; col++) {
state += (board[row][col] || ‘–’) + ’ ‘;
}
state += `${8 - row}\n`;
}
state += ’  a b c d e f g h’;
return state;
}
