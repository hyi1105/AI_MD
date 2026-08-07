@echo off
chcp 65001 >nul
:: 舊機雙擊：匯出 3M 憑證到桌面\3M-CAs-Cursor（需系統管理員）
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0Export-3M-Certs.ps1"
