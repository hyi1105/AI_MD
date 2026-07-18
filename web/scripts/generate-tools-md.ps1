# Generate web/tools/*.md from web/catalog.json (no Node required)
$ErrorActionPreference = "Stop"
$webRoot = Split-Path $PSScriptRoot -Parent
$outDir = Join-Path $webRoot "tools"
$catalogFile = Join-Path $webRoot "catalog.json"
New-Item -ItemType Directory -Force -Path $outDir | Out-Null

$tools = Get-Content $catalogFile -Raw -Encoding UTF8 | ConvertFrom-Json
$count = 0

foreach ($tool in $tools) {
  $tags = $tool.tags -join " | "
  $lines = @(
    "# $($tool.name)",
    "",
    "## 一句話",
    "",
    $tool.description,
    "",
    "## 最適合",
    "",
    $tool.bestFor,
    "",
    "## 分類",
    "",
    $tool.category,
    "",
    "## 標籤",
    "",
    $tags,
    "",
    "## 定價",
    "",
    $tool.pricing,
    "",
    "## 連結",
    "",
    "- [前往官網]($($tool.url))"
  )
  Set-Content -Path (Join-Path $outDir "$($tool.id).md") -Value ($lines -join "`n") -Encoding UTF8
  $count++
}

Write-Output "Generated $count markdown files from catalog.json"
