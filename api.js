let opponentMode = ‘bot’;

let customConfig = {
type: localStorage.getItem(‘customApiType’) || ‘openai’,
apiKey: localStorage.getItem(‘customApiKey’) || ‘’,
endpoint: localStorage.getItem(‘customEndpoint’) || ‘’,
model: localStorage.getItem(‘customModel’) || ‘’
};

const apiConfigs = {
openai: {
endpoint: ‘https://api.openai.com/v1/chat/completions’,
model: ‘gpt-4o-mini’,
headers: (key) => ({
‘Content-Type’: ‘application/json’,
‘Authorization’: `Bearer ${key}`
})
},
anthropic: {
endpoint: ‘https://api.anthropic.com/v1/messages’,
model: ‘claude-sonnet-4-20250514’,
headers: (key) => ({
‘Content-Type’: ‘application/json’,
‘x-api-key’: key,
‘anthropic-version’: ‘2023-06-01’
})
},
gemini: {
endpoint: ‘https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent’,
model: ‘gemini-1.5-flash’,
headers: (key) => ({
‘Content-Type’: ‘application/json’
}),
useKeyInUrl: true
},
grok: {
endpoint: ‘https://api.x.ai/v1/chat/completions’,
model: ‘grok-beta’,
headers: (key) => ({
‘Content-Type’: ‘application/json’,
‘Authorization’: `Bearer ${key}`
})
}
};

async function opponentMove() {
if (opponentMode === ‘bot’) {
botMove();
} else {
await customApiMove();
}
}

async function customApiMove() {
if (!customConfig.apiKey) {
alert(‘Chưa cấu hình API key! Chuyển sang bot.’);
opponentMode = ‘bot’;
botMove();
return;
}

```
document.getElementById('thinking').style.display = 'block';

try {
    const boardState = getBoardState();
    const prompt = createChessPrompt(boardState);
    const move = await callCustomApi(prompt);
    
    if (move) {
        makeMoveWithAnimationBot(move.fromRow, move.fromCol, move.toRow, move.toCol);
    } else {
        console.log('API không trả về nước đi hợp lệ, dùng bot');
        botMove();
    }
} catch (error) {
    console.error('API Error:', error);
    alert('Lỗi API: ' + error.message + '\nChuyển sang bot tích hợp.');
    opponentMode = 'bot';
    botMove();
} finally {
    document.getElementById('thinking').style.display = 'none';
}
```

}

async function callCustomApi(prompt) {
const config = apiConfigs[customConfig.type];

```
if (!config && customConfig.type !== 'custom') {
    throw new Error('Cấu hình API không hợp lệ');
}

let endpoint = customConfig.type === 'custom' ? customConfig.endpoint : config.endpoint;
let headers = customConfig.type === 'custom' ? 
    { 
        'Content-Type': 'application/json', 
        'Authorization': `Bearer ${customConfig.apiKey}` 
    } : config.headers(customConfig.apiKey);

let body;

switch(customConfig.type) {
    case 'openai':
    case 'grok':
        body = {
            model: config.model,
            messages: [{ role: 'user', content: prompt }],
            max_tokens: 200,
            temperature: 0.7
        };
        break;

    case 'anthropic':
        body = {
            model: config.model,
            max_tokens: 200,
            messages: [{ role: 'user', content: prompt }],
            temperature: 0.7
        };
        break;

    case 'gemini':
        endpoint = `${endpoint}?key=${customConfig.apiKey}`;
        body = {
            contents: [{ 
                parts: [{ text: prompt }] 
            }],
            generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 200
            }
        };
        break;

    case 'custom':
        body = {
            model: customConfig.model || 'default',
            messages: [{ role: 'user', content: prompt }],
            max_tokens: 200
        };
        break;
}

const response = await fetch(endpoint, {
    method: 'POST',
    headers: headers,
    body: JSON.stringify(body)
});

if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API error ${response.status}: ${errorText}`);
}

const data = await response.json();
let moveText = '';

switch(customConfig.type) {
    case 'openai':
    case 'grok':
        moveText = data.choices?.[0]?.message?.content || '';
        break;
    case 'anthropic':
        moveText = data.content?.[0]?.text || '';
        break;
    case 'gemini':
        moveText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
        break;
    case 'custom':
        moveText = data.choices?.[0]?.message?.content || 
                  data.content?.[0]?.text || 
                  data.text || '';
        break;
}

if (!moveText) {
    throw new Error('API không trả về nội dung');
}

return parseAIMove(moveText);
```

}

function createChessPrompt(boardState) {
return `Bạn là AI chơi cờ vua chuyên nghiệp.

LUẬT CỜ VUA:

- Tốt (P): Đi 1 ô thẳng (2 ô từ vị trí đầu), ăn chéo
- Xe (R): Đi ngang/dọc không giới hạn
- Mã (N): Đi hình chữ L (2 ô + 1 ô vuông góc)
- Tượng (B): Đi chéo không giới hạn
- Hậu (Q): Đi ngang/dọc/chéo không giới hạn
- Vua (K): Đi 1 ô mọi hướng
- QUAN TRỌNG: Không được để Vua bị chiếu!

BÀN CỜ:
${boardState}

Bạn chơi ĐEN (b). Chọn nước đi TỐT NHẤT.

CHIẾN THUẬT:

- Ưu tiên bảo vệ Vua
- Nếu bị chiếu, di chuyển Vua hoặc chặn
- Ăn quân đối thủ
- Kiểm soát trung tâm

FORMAT (CHỈ 1 DÒNG):
FROM: [hàng,cột] TO: [hàng,cột]

Ví dụ: FROM: 1,0 TO: 3,0`;
}

function parseAIMove(moveText) {
console.log(‘AI Response:’, moveText);

```
const match = moveText.match(/FROM:\s*\[?(\d+),?\s*(\d+)\]?\s*TO:\s*\[?(\d+),?\s*(\d+)\]?/i);

if (match) {
    const fromRow = parseInt(match[1]);
    const fromCol = parseInt(match[2]);
    const toRow = parseInt(match[3]);
    const toCol = parseInt(match[4]);

    if (!isValidSquare(fromRow, fromCol) || !isValidSquare(toRow, toCol)) {
        return null;
    }

    const piece = board[fromRow][fromCol];
    if (!piece || piece[0] !== 'b') {
        return null;
    }

    const validMoves = getValidMoves(fromRow, fromCol);
    const isValid = validMoves.some(m => m.row === toRow && m.col === toCol);
    
    if (!isValid) {
        return null;
    }

    return { fromRow, fromCol, toRow, toCol };
}

return null;
```

}
