# 在本機啟動 AI 工具搜尋網站
$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot
$port = 8080

Write-Host "AI 工具搜尋 — 本機預覽" -ForegroundColor Cyan
Write-Host "請在瀏覽器開啟: http://localhost:$port" -ForegroundColor Green
Write-Host "按 Ctrl+C 停止伺服器" -ForegroundColor Yellow

if (Get-Command python -ErrorAction SilentlyContinue) {
  python -m http.server $port
} elseif (Get-Command py -ErrorAction SilentlyContinue) {
  py -m http.server $port
} else {
  Write-Host "找不到 Python。請安裝 Python 或雙擊 index.html（詳情 MD 可能無法載入）。" -ForegroundColor Red
  Start-Process "index.html"
}
