# Idea History（已結案構想归档）

> **與 `idea.md` 拆開的主要原因：查文件時少載入資料、省成本。**  
> 這裡放已完成或已取消的構想；進行中的只留在 [`idea.md`](./idea.md)。  
> 「現在有沒有這個功能」以 [`03-checklist.md`](./03-checklist.md) 查核為準，不是看本檔。  
> 舊檔名：`02-idea-done.md`。  
> 更新：2026-08-13

---

## 2026-08-13 — 記憶法：路線＋錨點＋旁註（結構跟著出現）

- 結果：done（已寫入 AGENT-MASTER §7 並發布）  
- 來源：對話（純故事抓不到重點；開頭那種還不錯；記路線很強；先錨點、旁邊簡單講這是什麼；記憶時旁邊要出現結構）  
- 摘要：正式記憶法＝**真實 path**樹＋同行旁註；一次約 1～2 相關錨點；禁虛流程／大表一次五個。  

## 2026-08-13 — 記憶法：故事一個一個串（已由錨點法覆蓋）

- 結果：superseded  
- 來源：對話（無法記憶，得用故事串）  
- 摘要：曾改 §7 為故事一章；後因「抓不到重點」改為路線錨點法。  

## 2026-08-13 — 方案地圖說明（對話規則 A）

- 結果：done（細節已被錨點法覆蓋）  
- 來源：對話（解法要成 map；A／層級／選擇題）  
- 摘要：初版 §7；後經多次微調。  

## 2026-08-13 — 系統地圖再強化：拼圖式圖像化（積木磁貼）

- 結果：done（已發布）  
- 來源：對話（合胃口／拼圖／圖像化 → 確認細節 → 依新規則直接開發並發布）  
- 摘要：`web/system-map/` 改為積木／磁貼圖塊；四視角換皮不換位（流程／SQL／PA／Enclosure）；切換有翻面動畫。線上 https://hyi1105.github.io/AI_MD/system-map/  

## 2026-08-13 — 合作規則：確認細節後直接開發並發布

- 結果：done（規則入檔且本則已依新流程跑通）  
- 來源：對話（「規則開成 跟我確認好細節後 都直接開發並發布」）  
- 摘要：想法→idea→確認細節→直接開發並發布；已寫入 AGENT-MASTER／`.mdc`／checklist。  

## 2026-08-13 — 系統分層認識＋多視角統一場景（簽核示範）

- 結果：done（已發布至 AI_MD Pages）  
- 來源：對話（分層認識、統一場景；「沒想法先自行」→「開發並發布」）  
- 摘要：靜態系統地圖 `web/system-map/`——同一張簽核／申請地圖可切換流程圖／SQL／Power Automate／Shared Enclosure；第一層兩主幹（流程控、資料存）；首頁加入口。線上 https://hyi1105.github.io/AI_MD/system-map/  

## 2026-08-13 — 簽核＝像打 LINE＋獨立格式卡；送出＝submit／approve

- 結果：done（已發布）  
- 來源：對話（填寫欄位＝對話框 → 主要像打 LINE、有必填格式、送出＝submit／approve → 拍板：格式卡／聊天≠卡片／駁回退回要 →「執行並發布」）  
- 摘要：`web/approval/` 主錨為 LINE 風聊天；格式卡為手上文件（必填未完成不可送出）；申請人送出＝submit、簽核人核准＝approve；駁回／退回為對話系統訊息＋按鈕。線上 https://hyi1105.github.io/AI_MD/approval/  

## 2026-08-13 — Approval 簽核假畫面掛站（A2）

- 結果：done（已發布至 AI_MD Pages）  
- 來源：對話（「接續 approval 網站，讓他發布到 GitHub」）  
- 摘要：自 `hyi1105/Approval` 歷史還原 Teams 風格紙本請假 Demo（`web/approval/`）＋表單 schema 範例；首頁加「簽核 Demo」入口。線上 https://hyi1105.github.io/AI_MD/approval/ 。正式庫 `Approval` 本 Agent 無權 push（403），待授權後再遷回。  

## 2026-08-04 — 假圖：聊天氣泡內綠色漸層標籤框

- 結果：done（已發布）  
- 來源：對話（綠色 box gradient 假圖；「發布並給我線上連結」）  
- 摘要：靜態假圖掛站（`web/assets/fake-chat-green-gradient-boxes.png`）；未新增其他產品功能。線上 https://hyi1105.github.io/AI_MD/assets/fake-chat-green-gradient-boxes.png  

## 2026-07-21 — Hello World 首頁

- 結果：done（已發布）  
- 來源：對話（「幫我做一個 Hello World 的首頁」→「發佈並提供連結」）  
- 摘要：首頁改為 SEED + Hello World 落地頁；AI 查詢移至 `query.html`；線上 https://hyi1105.github.io/AI_MD/  

## 2026-07-19 — 合作方式定案：對話整理→idea；發布後→checklist；結案→idea.history

- 結果：done（文件層）  
- 來源：負責人說明合作模式（英／語音轉文字）  
- 摘要：`01-idea`→`idea.md`；`02-idea-done`→`idea.history.md`；規則寫進 `AGENT-MASTER`。  

## 2026-07-19 — 發布：open ideas（XSS／分類／匯出文案／aidoc 改名）

- 結果：done  
- 摘要：目錄卡片 XSS 跳脫；分類按鈕篩選；AI Doc 匯出改為 Markdown 文案；AI／P2P 標示範；程式資料夾 `smartdoc-ai` → `aidoc`；CI／文件已對齊。  

## 2026-07-19 — 分類按鈕篩選

- 結果：done  
- 摘要：首頁可按 category 一鍵篩選列表。  

## 2026-07-19 — 目錄卡片 XSS 防護

- 結果：done  
- 摘要：`web/script.js`／`tool.js` 渲染前 `escapeHtml`／`escapeAttr`。  

## 2026-07-19 — 匯出文案與能力一致

- 結果：done  
- 摘要：按鈕／toast／Paywall 改為 Markdown；副檔名 `.md`。  

## 2026-07-19 — 程式資料夾改名 smartdoc-ai → aidoc

- 結果：done  
- 摘要：`aidoc/`＋Pages workflow cache path；repo 主路徑不再用 smartdoc-ai。  

## 2026-07-19 — AI／P2P 示範標示（誠實 UI）

- 結果：done（替代「真 LLM／真 P2P」拍板前）  
- 摘要：AI 標「示範引擎」；P2P 標「示範」。  

## 2026-07-19 — 發布：SmartDoc → AI Doc

- 結果：done  
- 摘要：品牌／導覽／`/aidoc/`／Diff「AI 修改處」已上線；規格 `docs/ai-doc.md`；Pages 部署成功。  

## 2026-07-19 — 第二次發布（theme／文稿／查核定位上線）

- 結果：done  
- 摘要：`main` 已含 `00-theme`、`manuscript`、checklist＝功能查核、01／02 拆開省成本、Idea 完整欄位、一律繁中；Pages 部署成功  

## 2026-07-19 — Checklist＝功能查核；01／02 拆開省成本

- 結果：done（文件層）  
- 摘要：checklist 用於改版後發現功能缺漏；01／02 分離為搜尋／token 成本  

## 2026-07-19 — Idea 條目必須含 Why／What／How／Pros／Cons

- 結果：done（文件層）  
- 摘要：模板與 AGENT-MASTER 已強制完整欄位  

## 2026-07-19 — 一律繁體中文（含語音轉文字）

- 結果：done（文件層）  
- 摘要：回覆／入檔一律繁中  

## 2026-07-19 — 改為 Theme／文稿

- 結果：done（文件層；UI／資料夾名待「改程式」）  
- 摘要：`00-theme.md`；`manuscript.md`（文稿＝同檔編修→A4）  

## 2026-07-19 — 發布上線（文件架構）

- 結果：done  
- 摘要：`main` + Pages；https://hyi1105.github.io/AI_MD/  

## 2026-07-19 — 五點文件決策

- 結果：done  
- 摘要：規格集中 docs、只靠 JSON、刪工具 MD、mdc 連結  

## 2026-07-18 — 目錄 300 與七項體驗／文稿掛站

- 結果：done（已上線；能力見 checklist）  

## 2026-07-18 — 專案啟動協作

- 結果：done  

## 取消說明

- 名稱「approver」：已取消，改用 **文稿（manuscript）**。  
