@echo off
chcp 65001 >nul
:: 新機雙擊：從桌面\3M-CAs-Cursor 匯入（需系統管理員）
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0Import-3M-Certs.ps1"
