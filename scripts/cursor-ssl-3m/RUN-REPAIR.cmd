@echo off
chcp 65001 >nul
:: 一鍵修復（本人／同事）：匯入 3M 憑證 + 開 Cursor 系統憑證 + 重啟 Cursor 行程
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0Repair-Cursor-3M.ps1"
