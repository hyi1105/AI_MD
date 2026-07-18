# Generate web/catalog.json from web/scripts/build_catalog.py seeds (no Python/Node required)
$ErrorActionPreference = "Stop"
$webRoot = Split-Path $PSScriptRoot -Parent
$pyFile = Join-Path $PSScriptRoot "build_catalog.py"
$outFile = Join-Path $webRoot "catalog.json"
$target = 300

$knownIds = @{
  "ChatGPT"          = "chatgpt"
  "Claude"           = "claude"
  "Google Gemini"    = "gemini"
  "Cursor"           = "cursor"
  "GitHub Copilot"   = "github-copilot"
  "Midjourney"       = "midjourney"
  "DALL·E"           = "dalle"
  "Canva AI"         = "canva-ai"
  "Runway"           = "runway"
  "ElevenLabs"       = "elevenlabs"
  "Suno"             = "suno"
  "Perplexity"       = "perplexity"
  "Notion AI"        = "notion-ai"
  "DeepL"            = "deepl"
  "Grammarly"        = "grammarly"
  "Figma AI"         = "figma-ai"
  "Stable Diffusion" = "stable-diffusion"
  "Kimi"             = "kimi"
  "Codeium"          = "codeium"
  "Gamma"            = "gamma"
  "remove.bg"        = "remove-bg"
  "Otter.ai"         = "otter"
  "Jasper"           = "jasper"
  "Pika"             = "pika"
}

function Get-Slug([string]$name, [string[]]$keywords) {
  $normalized = $name.Normalize([Text.NormalizationForm]::FormKD)
  $ascii = -join ($normalized.ToCharArray() | Where-Object { [int][char]$_ -lt 128 })
  $slug = ($ascii -replace '[^a-zA-Z0-9]+', '-').Trim('-').ToLower()
  if (-not $slug -and $keywords -and $keywords.Count -gt 0) {
    $slug = ($keywords[0] -replace '[^a-zA-Z0-9]+', '-').Trim('-').ToLower()
  }
  if (-not $slug) { return "tool" }
  return $slug
}

$py = Get-Content $pyFile -Raw -Encoding UTF8
$seedBlock = [regex]::Match($py, '(?s)SEEDS = \[(.*?)\]\s*\n\s*\n\s*def slugify').Groups[1].Value
$tuplePattern = '\("([^"]*)",\s*"([^"]*)",\s*"([^"]*)",\s*"([^"]*)",\s*\[(.*?)\],\s*\[(.*?)\],\s*"([^"]*)",\s*"([^"]*)",\s*([\d.]+)\)'
$matches = [regex]::Matches($seedBlock, $tuplePattern)

$seenIds = @{}
$seenUrls = @{}
$tools = @()

foreach ($m in $matches) {
  $name = $m.Groups[1].Value
  $url = $m.Groups[2].Value
  $category = $m.Groups[3].Value
  $desc = $m.Groups[4].Value
  $tagsRaw = $m.Groups[5].Value
  $kwRaw = $m.Groups[6].Value
  $pricing = $m.Groups[7].Value
  $bestFor = $m.Groups[8].Value
  $rating = [double]$m.Groups[9].Value

  if ($seenUrls.ContainsKey($url)) { continue }
  $seenUrls[$url] = $true

  $baseId = if ($knownIds.ContainsKey($name)) { $knownIds[$name] } else { Get-Slug $name @($keywords) }
  $id = $baseId
  $n = 2
  while ($seenIds.ContainsKey($id)) {
    $id = "$baseId-$n"
    $n++
  }
  $seenIds[$id] = $true

  $tags = [regex]::Matches($tagsRaw, '"([^"]*)"') | ForEach-Object { $_.Groups[1].Value }
  $keywords = [regex]::Matches($kwRaw, '"([^"]*)"') | ForEach-Object { $_.Groups[1].Value }

  $tools += [ordered]@{
    id          = $id
    name        = $name
    description = $desc
    category    = $category
    tags        = @($tags)
    keywords    = @($keywords)
    rating      = $rating
    pricing     = $pricing
    url         = $url
    bestFor     = $bestFor
  }
}

if ($tools.Count -lt $target) {
  throw "Only $($tools.Count) unique tools parsed; need $target. Parsed $($matches.Count) seed rows."
}
if ($tools.Count -gt $target) {
  $tools = $tools[0..($target - 1)]
}

$json = $tools | ConvertTo-Json -Depth 6
[System.IO.File]::WriteAllText($outFile, $json, [Text.UTF8Encoding]::new($false))
Write-Output "Wrote $($tools.Count) tools to $outFile"

$tools | Group-Object category | Sort-Object Name | ForEach-Object {
  Write-Output "  $($_.Name): $($_.Count)"
}
