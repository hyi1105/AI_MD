# Approval｜LINE 對話＋格式卡

- **一般聊天**：像打 LINE（訊息氣泡）
- **格式卡**：另一個東西——像手上拿的文件（必填欄）
- **送出申請**＝`submit`；**核准**＝`approve`
- **駁回／退回**：對話裡的系統訊息＋按鈕
- **流程圖**：[`flow.html`](./flow.html) — 垂直圖（紅標題／深藍起點／橘成功／灰失敗），對齊請假簽核狀態

線上：https://hyi1105.github.io/AI_MD/approval/  
流程圖：https://hyi1105.github.io/AI_MD/approval/flow.html  
Schema：[`../schema/form-schema.example.json`](../schema/form-schema.example.json)

本機：

```bash
cd web && python3 -m http.server 8765
# http://127.0.0.1:8765/approval/
# http://127.0.0.1:8765/approval/flow.html
```
