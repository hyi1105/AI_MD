# 工具 Markdown 詳情

**網站實際使用** `web/tools/{id}.md`（GitHub Pages 可直接讀取）。  
**列表資料**在 `web/catalog.json`（不是本目錄、也不是完整寫在 `data.js`）。

本目錄 `content/tools/` 僅作歷史／規格參考；新增工具請編輯 **`web/catalog.json`**，詳情長文才寫 **`web/tools/`**。

> 依文件優先規則：須負責人說「改目錄／改程式」後，Agent 才改上述檔案。

## 流程

1. 在 `web/catalog.json` 新增列表項  
2. （可選）複製 [templates/tool-entry.md](../templates/tool-entry.md) → `web/tools/{id}.md`  
3. 整批從 SEEDS 重建時才跑：`web/scripts/build_catalog.ps1`、`generate-tools-md.ps1`

## 模板

[templates/tool-entry.md](../templates/tool-entry.md)
