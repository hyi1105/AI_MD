---
name: system-map
description: >-
  把陌生任意系統解析成「一張圖就看懂」的系統地圖：表在哪、欄位怎麼來、
  誰可看／可編／要填、資料被誰用、故事流程與變更衝擊面。
  在使用者貼表格／截圖／口頭描述陌生系統、問資料來源、欄位權限、
  流程角色、或「若某來源改成 SAP／缺某欄會炸哪」時使用。
  也可手動 /system-map。
---

# System Map（系統地圖 Skill）

目標：收成可畫圖、可追衝擊的 system-map；輸出直觀視圖。  
站上 Demo：`/system-map/`（簽核四視角）。約定入口：[`docs/約定/README.md`](../../../docs/約定/README.md)。

## 何時啟動

- 理解陌生系統／平台／簽核／表單
- 貼了「表＋欄位＋來源＋故事」或截圖
- 問：資料在哪、怎麼來、誰填誰看、被誰用
- 問變更衝擊（例如來源改 SAP、缺欄會炸哪）

## 強制骨架（12345；3＝主錨）

```
1 觸發故事／需求
    ↓
2 角色怎麼走流程
    ↓
3 資料家 ←── 主錨（表在哪／欄來源／表怎麼連）
    ↓
4 欄位權限瀑布（可見｜可編｜必填｜使用）
    ↓
5 變更衝擊（改來源／缺欄 → 炸哪）
```

口訣：冰箱（3）＝資料家；燈（2）＝角色流程；鈕（1）＝觸發；箭頭（4）＝權限；水花（5）＝衝擊。

## 工作流程

1. **蒐集**：缺關鍵資訊最多問 **3** 題；其餘 `unknown`／`待補`。  
2. **結構化**：產出 system-map JSON（對話貼出或使用者指定路徑）。  
3. **畫圖**：Mermaid（見 `references/output-views.md`）至少：整系統一眼圖、資料血緣／ER、角色×步驟、權限瀑布（可簡化）。  
4. **衝擊**：依 `lineage`／`consumed_by`（見 `references/impact-analysis.md`）。  
5. **模擬**：對話用固定欄位地圖＋改色規則（`references/output-views.md` §G）。

語言：台灣繁體。教學時標關卡與 %（見 [`docs/約定/核心.md`](../../../docs/約定/核心.md)）。

## source.kind

| kind | 意思 |
|------|------|
| `auto` | 系統自動 |
| `manual` | 人工 |
| `lookup` | 參照他表／他欄 |
| `api_sync` | 外部同步 |
| `computed` | 計算 |
| `derived_permission` | 依身分決定可寫內容 |

欄位盡量填：`filled_by`、`visible_to`／`editable_by`、`consumed_by`、`source.from`＋`condition`。

## 輸出順序

1. 一句結論  
2. 一張整圖（Mermaid，12345）  
3. 資料家摘要  
4. 權限瀑布（關鍵欄）  
5. 若有變更 → 衝擊清單  
6. JSON（若有）

樣板：`references/output-views.md`  
訪談：`references/interview-checklist.md`  
衝擊：`references/impact-analysis.md`  
簽核產品記憶：[`docs/約定/系統/簽核.md`](../../../docs/約定/系統/簽核.md)
