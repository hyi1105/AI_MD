# SmartDoc AI

**Word 界的 Cursor** — 給法務、祕書、研究生、行政人員的次世代 AI 文本編輯器。

底層統一使用 Markdown，畫面可一鍵切換合約／流程圖／商用報告渲染；透過右側 AI 對話修改文件，並以紅／綠視覺化 Diff 接受或拒絕修訂。

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
| 額度與收費 UI | 免費 15 次／月、NT$30/50 次、Pro 升級（localStorage 模擬） |
| 安全閘門 | 最少 2 字、5 秒限流 |
| 模型調配 | 日常 → 平價模型標籤；含「漏洞／審查」等 → 深度模型 |

> 目前 AI 為 **規則引擎示範**（無需 API Key），方便體驗完整流程。接上真實 LLM 時可替換 `src/lib/aiEngine.ts`。

## 專案結構

```
smartdoc-ai/
├── docs/PRD.md          # 產品需求文件
├── src/
│   ├── App.tsx          # 編輯器主殼層
│   ├── components/      # DocumentView / AiSidebar / Paywall
│   └── lib/             # diff、quota、gates、AI、markdown
└── package.json
```

## 獨立 GitHub 倉庫

本目錄可完整搬到新倉庫：

```bash
# 在 GitHub 建立空倉庫後：
cd smartdoc-ai
git init
git add .
git commit -m "Initial commit: SmartDoc AI MVP"
git remote add origin https://github.com/<you>/SmartDoc-AI.git
git push -u origin main
```

## 授權

MIT（與上層倉庫一致，可依新倉庫調整）
