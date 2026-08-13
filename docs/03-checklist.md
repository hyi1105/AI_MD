# 03 — Checklist（現有功能查核表）

> **這是「現在產品有哪些功能」的查核清單，不是許願池。**  
> 用途：改版後對照線上／程式，讓 AI（Lister）發現「以前有的功能不見了」。  
> 例：曾經有「建立圖樣」，改版後找不到 → 查核時應被標成缺漏。  
> 構想細節在 [`idea.md`](./idea.md)；舊構想在 [`idea.history.md`](./idea.history.md)（分開是為了少載入、省成本）。  
> 線上：https://hyi1105.github.io/AI_MD/  
> 更新：2026-08-13

圖例：`[x]` 現況具備 · `[~]` 有入口但是示範／半真 · `[!]` 查核發現缺漏／回歸（應有卻沒有）

### 查核怎麼做（給 AI）

1. 讀本檔每一條  
2. 對照線上或本機實際行為／相關程式  
3. 回報：仍在／半真／**消失**；消失的標 `[!]` 並建議是否開回 `idea.md` 修復  
4. **不要**把從未上線過的空想功能加進本檔  

---

## 1. 入口與品牌

- [x] 首頁顯示品牌 **SEED** 與 **Hello World** 問候  
- [x] 首頁可進入 AI 查詢（`query.html`）、AI Doc、**簽核 Demo**（`approval/`）與**系統地圖**（`system-map/`）  
- [x] 首頁說明提到長期關注／知識書  
- [x] AI 查詢頁頂部可切換「AI 查詢」與「AI Doc」  
- [x] 假圖（聊天氣泡綠色漸層標籤框）可線上開啟：[`/assets/fake-chat-green-gradient-boxes.png`](https://hyi1105.github.io/AI_MD/assets/fake-chat-green-gradient-boxes.png)  
- [x] 簽核假畫面可線上開啟：[`/approval/`](https://hyi1105.github.io/AI_MD/approval/)（Teams 風紙本單／簽名流水線／對話室 Demo）  
- [x] 簽核表單 schema 範例可開啟：[`/schema/form-schema.example.json`](https://hyi1105.github.io/AI_MD/schema/form-schema.example.json)  
- [x] 系統地圖可線上開啟：[`/system-map/`](https://hyi1105.github.io/AI_MD/system-map/)（簽核／申請；流程圖／SQL／Power Automate／Shared Enclosure 四視角切換，層級節點對齊）  

---

## 2. AI 查詢

入口：https://hyi1105.github.io/AI_MD/query.html  
資料：`web/catalog.json` only。

- [x] 關鍵字搜尋；無結果有提示  
- [x] 熱門標籤、排序、定價標記、「載入更多」  
- [x] 約 300 筆工具可瀏覽  
- [x] **分類按鈕篩選**（依 category）  
- [x] 追蹤關鍵字：新增／自動存／點選搜尋／移除／只顯示追蹤  
- [x] 詳情顯示 catalog 欄位；可開官網  
- [x] 三大工具評估區塊  
- [x] 目錄卡片／建議／追蹤渲染有 XSS 跳脫  

---

## 3. AI Doc

規格：[`ai-doc.md`](./ai-doc.md)  
入口：https://hyi1105.github.io/AI_MD/aidoc/

- [x] 品牌顯示為 **AI Doc**（非 SmartDoc）  
- [x] AI 可針對同一份檔下指令產生修訂（示範引擎）  
- [x] AI 產出後以 Diff **顯示修改處**（紅刪／綠增）  
- [x] Accept／Reject 回寫同一份檔  
- [x] 多模式預覽（合約／流程圖／報告等）  
- [x] 匯出名稱與實際輸出一致（**Markdown／.md**）  
- [x] AI 側欄標示「示範引擎」；P2P 標「示範」  
- [~] AI 為規則引擎示範（非真 LLM）  
- [~] 額度／付費按鈕（本機數字，無真金流）  
- [~] 內容指紋／P2P／合併（示範，非主路徑）  
- [x] 程式資料夾為 `aidoc/`（非 smartdoc-ai）  

---

## 4. 文件協作（已定案能力）

- [x] 規格在 `docs/`：`00-theme`／`idea`／`idea.history`／`03-checklist`／`ai-doc`  
- [x] 合作方式：想法→AI 整理→`idea.md`；發布後登記 checklist；結案→`idea.history`  
- [x] checklist＝**現有功能查核表**（改版後可對照找缺漏）  
- [x] `idea`＝進行中構想；`idea.history`＝已結案（拆開省查檔成本）  
- [x] Idea 條目含 Why／What／How／Pros／Cons  
- [x] 一律繁體中文（含語音轉文字整理）  
- [x] 預設只改 MD；「改程式」「發布」才動 code／上線  
- [x] 目錄只靠 JSON  
- [x] `.mdc` 可從 [`00-theme.md`](./00-theme.md) 點連結  
- [x] 2026-07-19 theme／文稿／查核定位已發布至 Pages  
- [x] 2026-07-19 **AI Doc** 已發布（`/aidoc/`；SmartDoc 品牌已替換）  
- [x] 2026-07-19 open ideas 已發布（XSS／分類／Markdown 匯出／`aidoc` 改名）  
- [x] 2026-07-19 檔名定案：`idea.md`／`idea.history.md`（取代 01／02）  
- [x] 2026-08-04 綠色漸層標籤假圖已發布至 Pages（`/assets/fake-chat-green-gradient-boxes.png`）  
- [x] 2026-08-13 Approval 簽核假畫面已發布至 Pages（`/approval/`；schema 範例 `/schema/`）  
- [x] 2026-08-13 系統地圖（簽核四視角）已發布至 Pages（`/system-map/`）  

---

## 5. 本機（給實作者）

```powershell
cd web
.\start-local.ps1
```

```bash
cd aidoc
npm install && npm run build
```
