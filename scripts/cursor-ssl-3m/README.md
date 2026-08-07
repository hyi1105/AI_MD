# Cursor × 3M SSL — 一鍵修復（可給同事）

公司網路會用 3M 憑證攔截 HTTPS；本機缺中繼／Cursor 未用系統憑證時，會出現  
`unable to get local issuer certificate`。

## 給同事／自己：平常不能用時

1. 取得整個資料夾（含腳本 **＋** `3M-CAs-Cursor` 憑證包）
2. 雙擊 **`RUN-REPAIR.cmd`**（同意 UAC）
3. 等它結束後，**手動再開 Cursor** → Network Diagnostic

修復會做：匯入缺的憑證、打開 System Certificates、結束舊的 Cursor 行程。

## 憑證包從哪來

在一台**已經能用**的電腦雙擊 **`RUN-EXPORT.cmd`**，會在桌面（含 OneDrive 桌面）產生：

`…\Desktop\3M-CAs-Cursor\`

把這個資料夾**複製進本修復資料夾**（與 `RUN-REPAIR.cmd` 同層），整包傳給同事：

```text
cursor-ssl-3m\
  RUN-REPAIR.cmd      ← 同事主要用這個
  RUN-EXPORT.cmd      ← 更新憑證包時用
  RUN-IMPORT.cmd      ← 只匯入、不改 Cursor 設定
  Repair-Cursor-3M.ps1
  Export-3M-Certs.ps1
  Import-3M-Certs.ps1
  3M-CAs-Cursor\      ← 務必一起給同事
    Root\
    CA\
    manifest.json
```

也可只靠桌面同步：憑證包在  
`C:\Users\<帳號>\OneDrive - 3M\Desktop\3M-CAs-Cursor`  
時，修復腳本也找得到。

## 分享注意

- **僅限 3M 內部**同事；憑證是公司內部 PKI，**不要**放到公開 Git／外部網碟。
- 優先仍應由 IT／GPO 自動佈署；此包是新機／缺憑證／Cursor 設定的應急修復。

## 間歇性「今天不能用、重開又好」

可先跑 `RUN-REPAIR.cmd`；若憑證已齊，它仍會重設 Cursor 系統憑證並關掉殘留行程。仍反覆發生 → 請 IT 查 Proxy／SSL 檢查 agent。
