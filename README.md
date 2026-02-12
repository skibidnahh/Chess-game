# Chess-game

# ♔ Cờ Vua AI - Hệ Thống ELO ♚

Game cờ vua trực tuyến với AI bot thông minh, hệ thống xếp hạng ELO và hỗ trợ API chatbot tùy chỉnh.

## 🎮 Tính năng

- ✅ **Bot ELO tích hợp** - 3 mức độ: Dễ, Trung bình, Khó
- ✅ **AI Chatbot** - Hỗ trợ ChatGPT, Claude, Gemini, Grok
- ✅ **Hệ thống ELO** - Theo dõi điểm số và thống kê
- ✅ **Animation mượt** - Hiệu ứng di chuyển quân cờ
- ✅ **Kiểm tra chiếu** - Bot thông minh, không để Vua bị ăn
- ✅ **Modal thông báo** - Hiển thị kết quả đẹp mắt
- ✅ **2 kiểu quân cờ** - Unicode và SVG
- ✅ **Responsive** - Hoạt động tốt trên mobile

## 📁 Cấu trúc file

```
chess-ai-elo/
├── index.html      # Giao diện chính
├── style.css       # Thiết kế và animation
├── pieces.js       # Dữ liệu quân cờ
├── game.js         # Logic game cờ vua
├── bot.js          # AI bot thông minh
├── api.js          # Xử lý API chatbot
├── ui.js           # Giao diện và ELO
└── README.md       # File này
```

## 🚀 Cách deploy

### 1. GitHub Pages (KHUYÊN DÙNG - MIỄN PHÍ)

```bash
# 1. Tạo repository mới trên GitHub
# 2. Clone repository
git clone https://github.com/username/chess-ai-elo.git
cd chess-ai-elo

# 3. Copy tất cả files vào folder
# 4. Push lên GitHub
git add .
git commit -m "Initial commit"
git push origin main

# 5. Vào Settings > Pages
# 6. Chọn Source: Deploy from a branch
# 7. Chọn Branch: main
# 8. Click Save
```

**Link truy cập:** `https://username.github.io/chess-ai-elo`

### 2. Replit (MIỄN PHÍ + NHANH)

1. Vào [Replit.com](https://replit.com)
1. Click “Create Repl”
1. Chọn “HTML, CSS, JS”
1. Tạo Repl mới
1. Upload tất cả files
1. Click “Run”

**Link truy cập:** `https://chess-ai-elo.username.repl.co`

### 3. Netlify (MIỄN PHÍ)

1. Vào [Netlify.com](https://www.netlify.com)
1. Drag & drop folder chứa files
1. Đợi deploy xong

**Link truy cập:** `https://your-site-name.netlify.app`

### 4. Vercel (MIỄN PHÍ)

```bash
# 1. Cài Vercel CLI
npm i -g vercel

# 2. Deploy
cd chess-ai-elo
vercel
```

**Link truy cập:** `https://chess-ai-elo.vercel.app`

### 5. ProFreeHost hoặc hosting khác

1. Upload tất cả files vào thư mục `public_html`
1. Truy cập domain của bạn

## 🎯 Cách sử dụng

### Chơi với Bot ELO

1. Chọn tab “Bot ELO”
1. Chọn độ khó (Dễ/Trung bình/Khó)
1. Click “Ván mới”
1. Click quân cờ → Click ô xanh để đi

### Chơi với Chatbot API

1. Chọn tab “Chatbot API”
1. Chọn loại API (ChatGPT, Claude, Gemini, Grok)
1. Nhập API Key:
- **OpenAI**: `sk-proj-...` (https://platform.openai.com/api-keys)
- **Anthropic**: `sk-ant-...` (https://console.anthropic.com)
- **Google**: `AIza...` (https://aistudio.google.com/app/apikey)
- **xAI**: `xai-...` (https://console.x.ai)
1. Click “Lưu”
1. Bắt đầu chơi!

## 🛠️ Tùy chỉnh

### Thay đổi ELO ban đầu

Sửa trong `ui.js`:

```javascript
let playerElo = parseInt(localStorage.getItem('playerElo')) || 1500; // Đổi 1200 thành 1500
```

### Thêm độ khó mới

Sửa trong `bot.js` - hàm `botMove()`

### Thay đổi thời gian animation

Sửa trong `style.css`:

```css
.piece.animating {
    transition: all 0.6s ease-in-out; /* Đổi 0.4s thành 0.6s */
}
```

## 📱 Tương thích

- ✅ Chrome, Firefox, Safari, Edge
- ✅ Mobile (iOS, Android)
- ✅ Tablet
- ✅ Desktop

## 📝 License

MIT License - Tự do sử dụng và chỉnh sửa

## 🤝 Đóng góp

Mọi đóng góp đều được chào đón! Tạo Pull Request hoặc Issue.

## ⭐ Support

Nếu thích project này, hãy cho 1 ⭐ trên GitHub!

-----

Made with ❤️ by claude 
