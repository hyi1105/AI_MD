# SmartDoc

**AI 修訂 + 無網 P2P 協作** — Word 界的 Cursor，斷網也能紅綠色對比修文件。

底層統一使用 Markdown（Local-First）。畫面可切換合約／流程圖／商用報告；右側支援 AI 對話修訂，以及 P2P Seed 節點、CRDT 離線合併與 10% 營收分紅任務模擬。

## 快速開始

```bash
cd smartdoc-ai
npm install
npm run dev
```

瀏覽器開啟終端機提示的本機網址（預設 `http://localhost:5173`）。

## MVP 已實作

| 模組 | 說明 |
|------|------|
| 多模式渲染 | 合約 / 流程圖 (Mermaid) / 商用報告 |
| 視覺化 Diff | 刪除紅底刪除線、新增綠底底線、Accept / Reject |
| AI Sidebar | 中文指令、`@章節` Mention、快捷提示 |
| 額度與收費 UI | 免費 15 次／月、NT$30/50 次、Pro 升級 |
| 安全閘門 | 最少 2 字、5 秒限流 |
| **Seed 內容定址** | SHA-256 Seed、平台簽章、一鍵複製 |
| **Local-First** | 文件與 Seed 索引存 localStorage |
| **P2P 通道模擬** | LAN / Hotspot / 藍牙·Wi-Fi Direct |
| **CRDT 離線合併** | Peer 離線改稿 → 合併 → Diff 確認 |
| **任務分紅** | 營收 10% 池、點數、Anti-Cheat（同 IP／未簽章拒絕） |

> AI 目前為 **規則引擎示範**（免 API Key）。真實 libp2p／藍牙傳輸與 Yjs 接線列於 `docs/PRD.md` 實作邊界。

## 建議體驗路徑

1. 用 AI：「幫我把違約金提高到千分之一」→ Accept
2. 切到 **P2P 節點** → 複製 Seed → 開啟 Seeding
3. 「模擬 Peer 離線修改」→「合併並顯示 Diff」→ Accept
4. 勾選「同 LAN／IP 刷量」再請求下載 → 應被拒絕發點

## 專案結構

```
smartdoc-ai/
├── docs/PRD.md              # AI + P2P 整合 PRD
├── src/
│   ├── App.tsx
│   ├── components/          # DocumentView / AiSidebar / PeerPanel / Paywall
│   └── lib/                 # seed、crdt、p2p、tokenomics、diff、AI…
└── package.json
```

## 獨立 GitHub 倉庫

```bash
cd smartdoc-ai
git init
git add .
git commit -m "Initial commit: SmartDoc AI + P2P MVP"
git remote add origin https://github.com/<you>/SmartDoc.git
git push -u origin main
```

## 授權

MIT
