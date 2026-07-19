# 03 — Checklist（上線驗收）

> **只記錄：內容經分析／實作後，已成功發布到線上的能力。**  
> 不要人工空想把「以後可能做」寫進來；那些留在 [`01-idea.md`](./01-idea.md)。  
> 構想結案 → [`02-idea-done.md`](./02-idea-done.md)。  
> 線上：https://hyi1105.github.io/AI_MD/  
> 更新：2026-07-19

圖例：`[x]` 線上真實可用 · `[~]` 已上線但屬示範／半真 · （無未上線的 `[ ]` 空想項）

---

## 1. 入口與品牌（已上線）

- [x] 首頁品牌與「知識書／長期關注」說明  
- [x] 頂部可切換「AI 查詢」與「文稿」編修入口（畫面上可能仍顯示舊名 SmartDoc，待改程式）  

---

## 2. AI 查詢（已上線）

資料：`web/catalog.json` only。

- [x] 關鍵字搜尋；無結果有提示  
- [x] 熱門標籤、排序、定價標記、「載入更多」  
- [x] 約 300 筆工具可瀏覽  
- [x] 追蹤關鍵字：新增／自動存／點選搜尋／移除／只顯示追蹤  
- [x] 詳情顯示 catalog 欄位；可開官網  
- [x] 三大工具評估區塊  

---

## 3. 文稿（已上線部分）

規格：[`manuscript.md`](./manuscript.md)  
入口：https://hyi1105.github.io/AI_MD/smartdoc/

- [x] 同一份 Markdown 可持續編修（本機 localStorage）  
- [x] 多模式預覽（合約／流程圖／報告等）  
- [x] 紅綠 Diff，Accept／Reject 回寫同一份檔  
- [~] AI 側欄改稿（示範引擎，非真 LLM）  
- [~] 額度／付費按鈕（本機數字，無真金流）  
- [~] 內容指紋／P2P／合併流程（示範，非真連線）  

（真 A4 輸出、真 LLM、真 P2P 等 → 仍在 `01-idea`，上線成功後再勾進本檔。）

---

## 4. 文件協作（已上線／已定案）

- [x] 規格集中 `docs/`：`00-theme`／`01-idea`／`02-idea-done`／`03-checklist`／`manuscript`  
- [x] checklist 僅收「已發布上線」項；構想先寫 01  
- [x] 繁中；預設只改 MD；「改程式」「發布」才動 code／上線  
- [x] 目錄只靠 JSON  
- [x] `.mdc` 可從 [`00-theme.md`](./00-theme.md) 點連結  
- [x] 2026-07-19 文件架構曾發布至 Pages  

---

## 5. 本機（給實作者）

```powershell
cd web
.\start-local.ps1
```

```bash
cd smartdoc-ai
npm install && npm run build
```
