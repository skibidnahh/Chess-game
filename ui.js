// ELO system
let playerElo = parseInt(localStorage.getItem(‘playerElo’)) || 1200;
let opponentElo = parseInt(localStorage.getItem(‘opponentElo’)) || 1200;
let wins = parseInt(localStorage.getItem(‘wins’)) || 0;
let losses = parseInt(localStorage.getItem(‘losses’)) || 0;
let draws = parseInt(localStorage.getItem(‘draws’)) || 0;

// Initialize when page loads
function initializeApp() {
const savedType = localStorage.getItem(‘customApiType’);
const savedEndpoint = localStorage.getItem(‘customEndpoint’);
const savedModel = localStorage.getItem(‘customModel’);

```
if (savedType) {
    document.getElementById('chatbotType').value = savedType;
    customConfig.type = savedType;
    updateApiPlaceholder();
}

if (customConfig.apiKey) {
    document.getElementById('customApiKey').value = customConfig.apiKey;
}

if (savedEndpoint) {
    document.getElementById('customEndpoint').value = savedEndpoint;
    customConfig.endpoint = savedEndpoint;
}

if (savedModel) {
    document.getElementById('customModel').value = savedModel;
    customConfig.model = savedModel;
}

updateEloDisplay();
initBoard();
```

}

// Show game result modal
function showGameResultModal(winner) {
const modal = document.getElementById(‘gameResultModal’);
const modalTitle = document.getElementById(‘modalTitle’);
const modalIcon = document.getElementById(‘modalIcon’);
const modalMessage = document.getElementById(‘modalMessage’);
const modalPlayerElo = document.getElementById(‘modalPlayerElo’);
const modalOpponentElo = document.getElementById(‘modalOpponentElo’);

```
const oldPlayerElo = playerElo;
const oldOpponentElo = opponentElo;

if (winner === 'white') {
    updateElo(true);
    wins++;
    localStorage.setItem('wins', wins);
    
    modalTitle.textContent = 'CHIẾN THẮNG!';
    modalIcon.className = 'result-icon win';
    modalMessage.textContent = 'Xin chúc mừng! Bạn đã chiến thắng!';
    document.getElementById('gameStatus').textContent = '🎉 Bạn thắng!';
} else if (winner === 'black') {
    updateElo(false);
    losses++;
    localStorage.setItem('losses', losses);
    
    modalTitle.textContent = 'THẤT BẠI';
    modalIcon.className = 'result-icon lose';
    modalMessage.textContent = 'Tiếc quá! Bạn đã thua cuộc.';
    document.getElementById('gameStatus').textContent = '😢 Bạn thua!';
} else if (winner === 'draw') {
    draws++;
    localStorage.setItem('draws', draws);
    
    modalTitle.textContent = 'HÒA';
    modalIcon.className = 'result-icon draw';
    modalMessage.textContent = 'Ván cờ kết thúc với kết quả hòa!';
    document.getElementById('gameStatus').textContent = '🤝 Hòa!';
}

const playerChange = playerElo - oldPlayerElo;
const opponentChange = opponentElo - oldOpponentElo;

modalPlayerElo.textContent = playerElo;
modalPlayerElo.className = 'elo-value';
if (playerChange > 0) {
    modalPlayerElo.classList.add('increase');
} else if (playerChange < 0) {
    modalPlayerElo.classList.add('decrease');
}

modalOpponentElo.textContent = opponentElo;
modalOpponentElo.className = 'elo-value';
if (opponentChange > 0) {
    modalOpponentElo.classList.add('increase');
} else if (opponentChange < 0) {
    modalOpponentElo.classList.add('decrease');
}

updateEloDisplay();
modal.classList.add('show');
```

}

function closeModal() {
const modal = document.getElementById(‘gameResultModal’);
modal.classList.remove(‘show’);
}

function updateEloDisplay() {
document.getElementById(‘playerElo’).textContent = playerElo;
document.getElementById(‘opponentElo’).textContent = opponentElo;
document.getElementById(‘wins’).textContent = wins;
document.getElementById(‘losses’).textContent = losses;
document.getElementById(‘draws’).textContent = draws;
}

function updateStatus() {
if (!gameOver) {
const statusText = currentPlayer === ‘white’ ?
‘Lượt của Trắng (Bạn)’ :
‘Lượt của Đen (AI)’;

```
    if (currentPlayer === 'white' && isKingInCheck('white')) {
        document.getElementById('gameStatus').textContent = statusText + ' - CHIẾU!';
    } else if (currentPlayer === 'black' && isKingInCheck('black')) {
        document.getElementById('gameStatus').textContent = statusText + ' - CHIẾU!';
    } else {
        document.getElementById('gameStatus').textContent = statusText;
    }
}
```

}

function updateMoveHistory() {
const historyDiv = document.getElementById(‘moveHistory’);
historyDiv.innerHTML = moveHistory.map((move, i) =>
`<div>${i + 1}. ${move}</div>`
).join(’’);
historyDiv.scrollTop = historyDiv.scrollHeight;
}

function updateElo(playerWon) {
const K = 32;
const expectedPlayer = 1 / (1 + Math.pow(10, (opponentElo - playerElo) / 400));
const expectedOpponent = 1 / (1 + Math.pow(10, (playerElo - opponentElo) / 400));

```
playerElo = Math.round(playerElo + K * ((playerWon ? 1 : 0) - expectedPlayer));
opponentElo = Math.round(opponentElo + K * ((playerWon ? 0 : 1) - expectedOpponent));

localStorage.setItem('playerElo', playerElo);
localStorage.setItem('opponentElo', opponentElo);
```

}

function switchTab(tab) {
opponentMode = tab;

```
document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));

event.target.classList.add('active');
document.getElementById(tab + '-tab').classList.add('active');
```

}

function setBotDifficulty(level) {
botDifficulty = level;
document.querySelectorAll(’#bot-tab .difficulty-btn’).forEach(btn => {
btn.classList.remove(‘active’);
});
event.target.classList.add(‘active’);
}

function setPieceStyle(style) {
pieceStyle = style;
document.querySelectorAll(’.style-option’).forEach(opt => {
opt.classList.remove(‘active’);
});
event.target.closest(’.style-option’).classList.add(‘active’);
renderBoard();
}

function updateApiPlaceholder() {
const type = document.getElementById(‘chatbotType’).value;
const apiKeyInput = document.getElementById(‘customApiKey’);
const endpointGroup = document.getElementById(‘customEndpointGroup’);
const modelGroup = document.getElementById(‘customModelGroup’);

```
const placeholders = {
    openai: 'sk-proj-...',
    anthropic: 'sk-ant-...',
    gemini: 'AIza...',
    grok: 'xai-...',
    custom: 'your-api-key'
};

apiKeyInput.placeholder = placeholders[type];

if (type === 'custom') {
    endpointGroup.style.display = 'block';
    modelGroup.style.display = 'block';
} else {
    endpointGroup.style.display = 'none';
    modelGroup.style.display = 'none';
}
```

}

function saveCustomApi() {
customConfig.type = document.getElementById(‘chatbotType’).value;
customConfig.apiKey = document.getElementById(‘customApiKey’).value.trim();

```
if (customConfig.type === 'custom') {
    customConfig.endpoint = document.getElementById('customEndpoint').value.trim();
    customConfig.model = document.getElementById('customModel').value.trim();
}

if (customConfig.apiKey) {
    localStorage.setItem('customApiKey', customConfig.apiKey);
    localStorage.setItem('customApiType', customConfig.type);
    if (customConfig.endpoint) localStorage.setItem('customEndpoint', customConfig.endpoint);
    if (customConfig.model) localStorage.setItem('customModel', customConfig.model);
    
    showApiStatus('✅ Đã lưu cấu hình!', true);
} else {
    showApiStatus('❌ Vui lòng nhập API Key', false);
}
```

}

function showApiStatus(message, success) {
const status = document.getElementById(‘customApiStatus’);
status.textContent = message;
status.className = ’api-status ’ + (success ? ‘connected’ : ‘error’);
status.style.display = ‘block’;
setTimeout(() => status.style.display = ‘none’, 3000);
}

function newGame() {
if (gameOver || confirm(‘Bắt đầu ván mới?’)) {
closeModal();
initBoard();
}
}

function resetElo() {
if (confirm(‘Reset điểm ELO về 1200 và xóa thống kê?’)) {
playerElo = 1200;
opponentElo = 1200;
wins = 0;
losses = 0;
draws = 0;
localStorage.setItem(‘playerElo’, playerElo);
localStorage.setItem(‘opponentElo’, opponentElo);
localStorage.setItem(‘wins’, wins);
localStorage.setItem(‘losses’, losses);
localStorage.setItem(‘draws’, draws);
updateEloDisplay();
}
}

// Auto-initialize when page loads
if (document.readyState === ‘loading’) {
document.addEventListener(‘DOMContentLoaded’, initializeApp);
} else {
initializeApp();
}
