// Bot settings
let botDifficulty = ‘easy’;

function botMove() {
document.getElementById(‘thinking’).style.display = ‘block’;

```
setTimeout(() => {
    const allMoves = getAllBotMoves();

    if (allMoves.length === 0) {
        document.getElementById('thinking').style.display = 'none';
        return;
    }

    let selectedMove;
    
    if (botDifficulty === 'easy') {
        selectedMove = allMoves[Math.floor(Math.random() * allMoves.length)];
    } else if (botDifficulty === 'medium') {
        allMoves.sort((a, b) => b.score - a.score);
        const topMoves = allMoves.slice(0, Math.min(8, allMoves.length));
        selectedMove = topMoves[Math.floor(Math.random() * topMoves.length)];
    } else {
        allMoves.sort((a, b) => b.score - a.score);
        const kingCapture = allMoves.find(m => {
            const target = board[m.toRow][m.toCol];
            return target && target === 'wK';
        });
        selectedMove = kingCapture || allMoves[0];
    }

    makeMoveWithAnimationBot(selectedMove.fromRow, selectedMove.fromCol, 
                              selectedMove.toRow, selectedMove.toCol);
    
    document.getElementById('thinking').style.display = 'none';
}, 800);
```

}

function getAllBotMoves() {
const allMoves = [];

```
for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
        if (board[row][col] && board[row][col][0] === 'b') {
            const moves = getValidMoves(row, col);
            moves.forEach(move => {
                const score = evaluateMove(row, col, move.row, move.col);
                allMoves.push({
                    fromRow: row,
                    fromCol: col,
                    toRow: move.row,
                    toCol: move.col,
                    score: score
                });
            });
        }
    }
}

return allMoves;
```

}

function evaluateMove(fromRow, fromCol, toRow, toCol) {
let score = 0;
const piece = board[fromRow][fromCol];
const target = board[toRow][toCol];

```
const values = { P: 10, N: 30, B: 30, R: 50, Q: 90, K: 900 };

if (target) {
    score += values[target[1]] * 10;
    if (target[1] === 'K') {
        score += 10000;
    }
}

score += getPiecePositionScore(piece[1], toRow, toCol);

const centerSquares = [[3,3], [3,4], [4,3], [4,4]];
if (centerSquares.some(([r,c]) => r === toRow && c === toCol)) {
    score += 20;
}

if ((piece[1] === 'N' || piece[1] === 'B') && fromRow === 0) {
    score += 15;
}

if (piece[1] === 'K' && moveHistory.length < 10 && toRow !== 0) {
    score -= 20;
}

const tempPiece = board[toRow][toCol];
board[toRow][toCol] = piece;
board[fromRow][fromCol] = '';
const oldKingPos = {...blackKingPos};
if (piece[1] === 'K') {
    blackKingPos = { row: toRow, col: toCol };
}

if (isKingInCheck('white')) {
    score += 30;
}

board[fromRow][fromCol] = piece;
board[toRow][toCol] = tempPiece;
if (piece[1] === 'K') {
    blackKingPos = oldKingPos;
}

if (wouldBeInCheck(fromRow, fromCol, toRow, toCol, 'b')) {
    score -= 1000;
}

if (isPieceUnderAttack(fromRow, fromCol, 'b')) {
    score += values[piece[1]] * 5;
}

score += Math.random() * 3;

return score;
```

}

function getPiecePositionScore(pieceType, row, col) {
if (pieceType === ‘P’) {
const advancement = 7 - row;
return advancement * 2;
}

```
if (pieceType === 'N') {
    const distFromCenter = Math.abs(3.5 - row) + Math.abs(3.5 - col);
    return (7 - distFromCenter) * 2;
}

return 0;
```

}

function isPieceUnderAttack(row, col, color) {
const enemyColor = color === ‘b’ ? ‘w’ : ‘b’;

```
for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
        const piece = board[r][c];
        if (piece && piece[0] === enemyColor) {
            const moves = getBasicMoves(r, c);
            if (moves.some(m => m.row === row && m.col === col)) {
                return true;
            }
        }
    }
}

return false;
```

}

function makeMoveWithAnimationBot(fromRow, fromCol, toRow, toCol) {
const piece = board[fromRow][fromCol];
const fromSquare = document.querySelector(`[data-row="${fromRow}"][data-col="${fromCol}"]`);
const toSquare = document.querySelector(`[data-row="${toRow}"][data-col="${toCol}"]`);

```
const pieceElement = fromSquare.querySelector('.piece');
if (!pieceElement) {
    makeMove(fromRow, fromCol, toRow, toCol);
    return;
}

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
}, 420);
```

}
