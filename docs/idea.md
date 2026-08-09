# Idea（進行中的構想）

> 用途：你分享想法 → AI 整理對話 → **寫入本檔**。  
> 與 [`idea.history.md`](./idea.history.md) 分開：查構想時先讀本檔即可，**少載入舊資料、省成本**。  
> [`03-checklist.md`](./03-checklist.md) 是「現有功能查核表」，不是構想匣。  
> 做成並發布後：把該能力**登記進 checklist**；本則構想再移到 `idea.history`。  
> 合作規則總表：[`../prompts/AGENT-MASTER.md`](../prompts/AGENT-MASTER.md)  
> 更新：2026-08-09

### 寫入規則（給 AI）

負責人每說一則構想（含語音轉文字），AI 必須：

1. 改寫成**繁體中文**  
2. 用下方完整模板補齊（缺的標「待補／待拍板」）  
3. **追加**到本檔最上方  
4. 未真正具備的功能不要塞進 checklist；checklist 只登記「現在應該查核得到」的能力  

### 完整模板（每則必用）

```markdown
## YYYY-MM-DD — 短標題
- 狀態：open｜building｜waiting-owner
- 來源：對話／語音轉文字（可註原文關鍵句）
- 為什麼（Why）：要解決什麼問題？不做會怎樣？
- 做什麼（What）：使用者會看到／能完成的具體結果（1～3 句）
- 怎麼做（How）：實作方向、改哪些檔／流程、依賴什麼
- 優點（Pros）：做成後的好處
- 缺點／風險（Cons）：成本、複雜度、安全、維護、對現有功能影響
- 不做的替代方案：若不做，有沒有較小做法？
- 完成後列入 checklist：查核句（給 checklist 用，描述「產品應具備的功能」）
- 待拍板：需要負責人決定的問題（無則寫「無」）
```

---

## 2026-08-09 — 多 REPO 連程式搬家＋Idea 成品／半成品可擴充歸檔
- 狀態：waiting-owner
- 來源：對話（要連程式一起搬家整理；每個 idea 的成品／半成品要好找、可擴充；Rule／Skill 可執行）
- 為什麼（Why）：構想散在多個 REPO，成品／半成品找不到就無法換地方續做；只做連結索引不夠，需要程式與 idea 同層可查
- 做什麼（What）：採「一個工作區母庫＋每則 idea 一個資料夾」：構想 MD、狀態、成品／半成品、對應程式套件路徑都在固定位置；總表 `00-map` 可搜尋
- 怎麼做（How）：
  - **母結構（建議）**：
    ```text
    workbench/                    ← 一個 Git 母庫（或 Cursor Workspace）
      docs/
        00-map.md                 ← 全部 idea／套件總表（好找）
        idea.md                   ← 進行中構想（短摘要＋連到資料夾）
        idea.history.md           ← 結案摘要
        03-checklist.md           ← 已上線可查核功能
      ideas/
        YYYYMMDD-短名/
          README.md               ← 必填：狀態／Why一句／入口
          idea.md                 ← 完整 Why／What／How…
          status.txt              ← seed｜wip｜shipped｜parked｜trash-candidate
          artifacts/              ← 成品／半成品（圖、zip、假圖、匯出）
          notes/                  ← 過程筆記（可空）
          links.md                ← 線上 URL、舊 REPO、PR
      packages/                   ← 可跑的程式（搬家後的產品碼）
        seed-web/                 ← 例：原 AI_MD 的 web＋docs 產品
        aidoc/
        cursor-ssl-3m/            ← 工具類也可是 package，非產品
      .cursor/
        skills/repo-inventory/    ← 盤點 Skill
        rules/                    ← 短規則（繁中、先 map 不刪）
    ```
  - **每則 idea 狀態機**：`seed`（只有構想）→ `wip`（有半成品／程式）→ `shipped`（已上線並進 checklist）→ `parked`（暫放）／`trash-candidate`（待刪）
  - **好找規則**：總表 `docs/00-map.md` 一列一個 idea／package；檔名 `YYYYMMDD-短名`；搜尋只靠 map＋資料夾名，不靠記憶
  - **搬家**：舊 REPO 先標進 map → 程式搬入 `packages/<名>` → 對應 idea 資料夾寫 `links.md` 舊網址 → 舊庫 archive（你點頭才刪）
  - **Cursor**：流程用 Skill `/repo-inventory`；短提醒用 User Rule；細節見對話建議
- 優點（Pros）：構想與成品同層；可擴充（新 idea＝新資料夾）；換機器只 clone 母庫；token 友好（先讀 map／單則 README）
- 缺點／風險（Cons）：首次搬家成本高；母庫變大；私有／公司憑證勿進公開庫
- 不做的替代方案：只做連結總表、程式仍散在多 REPO（較輕但續做摩擦大）
- 完成後列入 checklist：存在 `docs/00-map.md` 與 `ideas/*` 慣例，且能從 map 點到任一 idea 的成品／程式
- 待拍板：
  1. 母庫新建（如 `workbench`）還是以現有 `AI_MD` 升級成母結構？
  2. 公司憑證修復包是否進母庫（建議僅內網／私有）？
  3. 舊 REPO 搬家後要 archive 還是保留？

---

## （進行中僅保留未結案產品構想）

## 未上線構想（展開）

### 主題／知識書

#### 知識書架（瀏覽／發布）
- 狀態：open  
- 為什麼（Why）：主題是知識書，沒有書架就只剩工具  
- 做什麼（What）：使用者可瀏覽、發布自己的知識書  
- 怎麼做（How）：新頁面／資料模型；與 AI Doc 輸出銜接（待設計）  
- 優點（Pros）：產品本體出現  
- 缺點／風險（Cons）：工程量大；需權限與儲存方案  
- 不做的替代方案：先只做單頁靜態展示  
- 完成後列入 checklist：能進入書架並發布／瀏覽  
- 待拍板：是否本季優先  

#### 關注產品或 KOL／知識書
- 狀態：open  
- 為什麼（Why）：要「長期關注」，不是用完即走  
- 做什麼（What）：可關注並回訪看更新  
- 怎麼做（How）：關注列表＋通知或更新時間（待設計）  
- 優點（Pros）：回訪動機  
- 缺點／風險（Cons）：多半要帳號；隱私與通知成本  
- 不做的替代方案：本機追蹤關鍵字（已有，但不是關注人／書）  
- 完成後列入 checklist：能關注並回訪  
- 待拍板：是否要登入  

#### 編排／策展他人內容
- 狀態：open  
- 為什麼（Why）：知識可在授權下二次整理  
- 做什麼（What）：在授權範圍內重新編排他人開放內容  
- 怎麼做（How）：授權模型＋編排 UI（待設計）  
- 優點（Pros）：生態與傳播  
- 缺點／風險（Cons）：侵權與糾紛風險高  
- 不做的替代方案：先只允許作者自己編  
- 完成後列入 checklist：能策展並標示來源／授權  
- 待拍板：授權條款  

#### 分享連結與權限
- 狀態：open  
- 為什麼（Why）：知識書要能傳出去且可控公開範圍  
- 做什麼（What）：產生連結；公開／部分公開  
- 怎麼做（How）：權限欄位＋分享 URL（待設計）  
- 優點（Pros）：傳播基本盤  
- 缺點／風險（Cons）：外洩與權限錯設  
- 不做的替代方案：整本僅本機  
- 完成後列入 checklist：能分享並設定範圍  
- 待拍板：無帳號時怎麼做權限  

#### 商業：訂閱／解鎖／分成
- 狀態：waiting-owner  
- 為什麼（Why）：主題含可商業化，但模式未定  
- 做什麼（What）：訂閱或單章解鎖或分成之一（待選）  
- 怎麼做（How）：金流商＋後端；純 Pages 不夠  
- 優點（Pros）：可持續營運  
- 缺點／風險（Cons）：法務、稅務、金流、客服  
- 不做的替代方案：長期免費  
- 完成後列入 checklist：能完成一筆真實付費流程  
- 待拍板：做不做、做哪一種  

### AI 查詢

#### 登入後跨裝置同步追蹤
- 狀態：waiting-owner  
- 為什麼（Why）：追蹤只在本機，換裝置就沒了  
- 做什麼（What）：登入後追蹤清單雲端同步  
- 怎麼做（How）：帳號系統＋儲存（待選）  
- 優點（Pros）：跨裝置連續  
- 缺點／風險（Cons）：帳號與隱私成本  
- 不做的替代方案：匯出／匯入 JSON  
- 完成後列入 checklist：換裝置追蹤仍在  
- 待拍板：是否要做登入  

### AI Doc（核心）

#### 真 LLM API＋費用控管
- 狀態：waiting-owner  
- 為什麼（Why）：現在 AI 側欄是示範，易誤導「像 Cursor」的承諾  
- 做什麼（What）：真模型改稿＋額度／失敗處理  
- 怎麼做（How）：供應商＋金鑰策略（Pages 不能藏 server key）  
- 優點（Pros）：真助益  
- 缺點／風險（Cons）：費用、濫用、後端需求  
- 不做的替代方案：文案維持標「示範引擎」  
- 完成後列入 checklist：真 API 成功與失敗都可測  
- 待拍板：是否本季優先  

#### 真 P2P／CRDT／跨裝置
- 狀態：waiting-owner  
- 為什麼（Why）：現在只有示範按鈕；非 AI Doc 主路徑  
- 做什麼（What）：真連線或永久標示範／弱化入口  
- 怎麼做（How）：實作或收斂 UI  
- 優點（Pros）：誠實產品  
- 缺點／風險（Cons）：技術重或顯得縮水  
- 不做的替代方案：UI 標「示範 only」  
- 完成後列入 checklist：真連線可用或示範標示清楚  
- 待拍板：是否正式路線  

### 待拍板（決策題）

#### 下一季優先順序
- 狀態：waiting-owner  
- 為什麼（Why）：資源有限  
- 做什麼（What）：選定本季主軸  
- 怎麼做（How）：負責人圈選後改對應構想為 building  
- 優點（Pros）：焦點清晰  
- 缺點／風險（Cons）：其他路線延後  
- 不做的替代方案：平行推進  
- 完成後列入 checklist：無  
- 待拍板：書架 vs AI Doc 真 LLM  

#### Repo／網域改名
- 狀態：waiting-owner  
- 為什麼（Why）：Repo 仍叫 AI_MD  
- 做什麼（What）：改名或自訂網域，或維持歷史 URL  
- 怎麼做（How）：GitHub／DNS  
- 優點（Pros）：品牌一致  
- 缺點／風險（Cons）：舊連結失效  
- 不做的替代方案：只改畫面品牌  
- 完成後列入 checklist：新網址可開（若執行）  
- 待拍板：改不改  

---

## 較早對話摘要（已結案方向，細節見 idea.history）

| 日期 | 說了什麼 | 去向 |
|------|----------|------|
| 2026-08-09 | 多 REPO 連程式搬家＋idea 成品歸檔 | idea.md（待拍板） |
| 2026-08-04 | 綠色漸層標籤假圖→發布 | checklist／history |
| 2026-07-19 | 合作方式：對話→idea→checklist；done→idea.history | AGENT-MASTER／history |
| 2026-07-19 | 實作 open ideas 並發布 | checklist／history |
| 2026-07-19 | 發布文件架構 | checklist／history |
| 2026-07-18 | 300 工具、體驗、文稿掛站 | 已上線 → checklist |
