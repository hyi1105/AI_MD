# Idea（進行中的構想）

> 用途：你分享想法 → AI 整理對話 → **寫入本檔**。  
> 與 [`idea.history.md`](./idea.history.md) 分開：查構想時先讀本檔即可，**少載入舊資料、省成本**。  
> [`03-checklist.md`](./03-checklist.md) 是「現有功能查核表」，不是構想匣。  
> 做成並發布後：把該能力**登記進 checklist**；本則構想再移到 `idea.history`。  
> 流轉：**想法 → idea → 確認細節 → 直接開發並發布**（見 AGENT-MASTER）。  
> 合作規則總表：[`../prompts/AGENT-MASTER.md`](../prompts/AGENT-MASTER.md)  
> 更新：2026-09-29（GitHub 資源盤點；整合構想 waiting-owner）

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

## （進行中僅保留未結案產品構想）

## 未上線構想（展開）

### 倉庫／資源治理

#### 2026-09-29 — 把 GitHub 資源整進同一個 repo（AI_MD）
- 狀態：waiting-owner
- 來源：對話「幫我看我在 github 上有哪些資源, 我想整合到同一個 repo」
- 為什麼（Why）：帳號下兩庫並行、約定與可執行站拆開，Agent／自己常不知讀哪邊；Approval 已 archived、Pages 已 404，卻仍有學習約定與 system-map Skill 只活在那裡。
- 做什麼（What）：以 `hyi1105/AI_MD` 為唯一主庫；把 `Approval` 裡仍有用的「約定／Skill／口味」遷入本庫對應位置；之後只維護一處。
- 怎麼做（How）：
  1. 盤點（已完成，見下方「現況盤點」）。
  2. 依你拍板路徑：把 `Approval/約定/**` 併入本庫（建議 `docs/約定/` 或沿用 `.cursor/`＋`docs/`）；Skill 放 `.cursor/skills/`。
  3. 對照刪重複（SEED 主題／AI-Doc／idea 流在本庫已有更新版，勿覆蓋新的）。
  4. `Approval` 留 README 轉址到 AI_MD 後可保持 archived，或之後刪庫。
- 優點（Pros）：單一真相來源；Agent 規則與產品站同 repo；少開錯庫。
- 缺點／風險（Cons）：約定檔與現行 `AGENT-MASTER`／`idea.md` 可能衝突，需人工對齊；誤覆蓋會丟較新進度。
- 不做的替代方案：Approval 維持 archived 唯讀備忘；需要時手動 copy 單檔。
- 完成後列入 checklist：約定入口在本庫可讀；system-map Skill 在本庫 `.cursor/skills/`；Approval 有轉址說明
- 待拍板：
  1. 主庫確認＝`AI_MD`？（建議是）
  2. 約定放哪：`docs/約定/` 還是合併進現有 `docs/`＋`.cursor/rules/`？
  3. Approval 庫處理：只加轉址 README／維持 archived／之後刪除？
  4. 哪些 Approval 檔要搬、哪些以本庫為準丟棄？（建議：搬「口味累積、學習節奏、system-map Skill／references、英語」；SEED／構想流以本庫為準不覆蓋）

##### 現況盤點（hyi1105 · 2026-09-29）

| 資源 | 狀態 | 內容摘要 |
|------|------|----------|
| [`AI_MD`](https://github.com/hyi1105/AI_MD) | **現行主庫** · public · Pages 200 | 主題／idea／checklist、AI Doc、`web/`（查詢、簽核 demo、system-map、explain、mermaid、node） |
| [`Approval`](https://github.com/hyi1105/Approval) | **archived** · public · Pages **404** | 僅「約定」MD＋`.cursor` Skill；可執行產物已刪；曾寫「AI_MD 擬刪」但實際相反 |
| Gists／Packages | 公開側未見可用資源 | — |
| Org | 無可見 org | — |

Approval 內值得併入的檔（約 22 個 blob）：`約定/核心.md`、`個人/口味累積.md`、`個人/英語.md`、`學習/*`、`系統/system-map/SKILL.md`＋`references/`、`.cursor/skills/system-map/`。  
本庫已較新、不宜被 Approval 覆蓋：`docs/00-theme.md`、`docs/ai-doc.md`、`docs/idea*.md`、`prompts/AGENT-MASTER.md`、`web/approval/`、`web/system-map/`。

### 個人化公司／地端主權

#### 個人節點架構：去中心簽核／對話（系統核心）
- 狀態：open（**A 第一刀已上線**；B／C 未做）  
- 來源：對話確認（夙願；平台只連線；過期手機常開；架構＝系統核心）  
- 為什麼（Why）：A 已可感受；仍缺真常駐與真多節點同步。  
- 做什麼（What）：B＝常開裝置／App 真常駐同步；C＝真 P2P／CRDT。  
- 怎麼做（How）：見 `docs/personal-node.md` §6；現況 `/node/` 為同步包。  
- 優點（Pros）：核心方向不丟，下一刀邊界清楚。  
- 缺點／風險（Cons）：若停在同步包，常開機體驗仍手動。  
- 不做的替代方案：維持檔案匯出／匯入。  
- 完成後列入 checklist：常開機可自動或近自動接手節點庫（B）；或多節點衝突可解（C）  
- 待拍板：下一刀先做 B 常駐 App，還是先做瀏覽器間更順的同步？  

### 合作／說明方式

#### 說明法擴充：非線性流程／血緣／其他類型
- 狀態：open（**血緣已定稿**；**非線性流程＝好像還行／可先用**；其餘待試）  
- 來源：對話（可試類型→血緣定稿；STP_I_0022 圖試非線性→「好像還行」）  
- 為什麼（Why）：非線性圖若一次倒完難讀；需同一節奏拆「系統欄→時間圈→檔案血緣」。  
- 做什麼（What）：非線性可先用：先三欄系統、再紅圈 1／2／3、再跟 RCV→INV→INVACK；血緣已定稿。  
- 怎麼做（How）：對話呈現；素材可用簽核圖／外部流程圖；確認「這是我要的」後再寫死 §7。  
- 優點（Pros）：願意讀完的節奏可覆蓋跨系統傳檔圖。  
- 缺點／風險（Cons）：「好像還行」≠完全定稿；分叉多時可能還要再拆。  
- 不做的替代方案：只看原圖、不用說明法。  
- 完成後列入 checklist：§7 已含血緣；非線性待一句定稿口令  
- 待拍板：非線性要「定稿」還是先微調哪一段？  

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
| 2026-08-25 | 簽核用蝦皮海外配送風格畫流程圖→發布 | checklist／history |
| 2026-08-13 | 說明法 Web MVP：文字／文件／圖片＋真 AI BYOK＋本站 /explain/ | checklist／history |
| 2026-08-13 | 記憶法定案：路線＋錨點＋旁註；結構跟著出現 | checklist／history |
| 2026-08-13 | 記憶法＝故事串連；禁一次講完再對照；§7 改寫直發 | checklist／history |
| 2026-08-13 | 方案地圖：A＋骨架→為什麼→細節；結尾 3 選擇題→確認直發 | checklist／history |
| 2026-08-13 | 拼圖圖像化→確認→開發發布；規則＝確認後直發 | checklist／history |
| 2026-08-13 | 系統分層＋四視角統一場景→開發發布 | checklist／history |
| 2026-08-13 | 簽核＝LINE＋格式卡；執行並發布 | checklist／history |
| 2026-08-13 | 接續 Approval 簽核假畫面→發布 | checklist／history |
| 2026-08-04 | 綠色漸層標籤假圖→發布 | checklist／history |
| 2026-07-19 | 合作方式：對話→idea→checklist；done→idea.history | AGENT-MASTER／history |
| 2026-07-19 | 實作 open ideas 並發布 | checklist／history |
| 2026-07-19 | 發布文件架構 | checklist／history |
| 2026-07-18 | 300 工具、體驗、文稿掛站 | 已上線 → checklist |
