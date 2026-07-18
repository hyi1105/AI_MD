# Generate web/tools/*.md from web/data.js (no Node required)
$ErrorActionPreference = "Stop"
$webRoot = Split-Path $PSScriptRoot -Parent
$outDir = Join-Path $webRoot "tools"
New-Item -ItemType Directory -Force -Path $outDir | Out-Null

$dataJs = Get-Content (Join-Path $webRoot "data.js") -Raw -Encoding UTF8
$pattern = '(?s)id:\s*"(?<id>[^"]+)".*?name:\s*"(?<name>[^"]+)".*?description:\s*"(?<desc>[^"]+)".*?category:\s*"(?<cat>[^"]+)".*?tags:\s*\[(?<tags>[^\]]+)\].*?pricing:\s*"(?<pricing>[^"]+)".*?url:\s*"(?<url>[^"]+)".*?bestFor:\s*"(?<best>[^"]+)"'
$matches = [regex]::Matches($dataJs, $pattern)

$count = 0
foreach ($m in $matches) {
  $id = $m.Groups["id"].Value
  $name = $m.Groups["name"].Value
  $desc = $m.Groups["desc"].Value
  $cat = $m.Groups["cat"].Value
  $tags = ($m.Groups["tags"].Value -replace '"', "" -replace ",\s*", " | ")
  $pricing = $m.Groups["pricing"].Value
  $url = $m.Groups["url"].Value
  $best = $m.Groups["best"].Value

  $lines = @(
    "# $name",
    "",
    "## 一句話",
    "",
    $desc,
    "",
    "## 最適合",
    "",
    $best,
    "",
    "## 分類",
    "",
    $cat,
    "",
    "## 標籤",
    "",
    $tags,
    "",
    "## 定價",
    "",
    $pricing,
    "",
    "## 連結",
    "",
    "- [前往官網]($url)"
  )
  Set-Content -Path (Join-Path $outDir "$id.md") -Value ($lines -join "`n") -Encoding UTF8
  $count++
}
Write-Output "Generated $count markdown files"
