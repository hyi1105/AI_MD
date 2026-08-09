#Requires -Version 5.1
<#
.SYNOPSIS
  舊機執行：匯出本機所有 3M/mmm 相關根憑證與中繼憑證到「桌面\3M-CAs-Cursor」
  （若桌面有 OneDrive／公司同步，新機即可拿到同一資料夾）
#>

$ErrorActionPreference = 'Stop'

function Ensure-Admin {
  $id = [Security.Principal.WindowsIdentity]::GetCurrent()
  $p = New-Object Security.Principal.WindowsPrincipal($id)
  if ($p.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)) { return }
  $arg = "-NoProfile -ExecutionPolicy Bypass -File `"$PSCommandPath`""
  Start-Process -FilePath 'powershell.exe' -Verb RunAs -ArgumentList $arg | Out-Null
  exit
}

Ensure-Admin

# 公司機常見：桌面在 OneDrive（例如 ...\OneDrive - 3M\Desktop）
$desktop   = [Environment]::GetFolderPath('Desktop')
$scriptDir = Split-Path -Parent $PSCommandPath
# 同時寫到桌面（方便同步）與腳本旁（方便整包傳給同事）
$targets = @(
  (Join-Path $desktop '3M-CAs-Cursor'),
  (Join-Path $scriptDir '3M-CAs-Cursor')
) | Select-Object -Unique

function Clear-And-Ensure($syncRoot) {
  $rootDir = Join-Path $syncRoot 'Root'
  $caDir   = Join-Path $syncRoot 'CA'
  New-Item -ItemType Directory -Force -Path $rootDir, $caDir | Out-Null
  Get-ChildItem $rootDir, $caDir -Filter *.cer -ErrorAction SilentlyContinue | Remove-Item -Force
  return @{ Root = $rootDir; CA = $caDir; Sync = $syncRoot }
}

$primary = Clear-And-Ensure $targets[0]
$rootDir = $primary.Root
$caDir   = $primary.CA
$syncRoot = $primary.Sync

function Export-StoreCerts {
  param(
    [Parameter(Mandatory)] [string] $StorePath,
    [Parameter(Mandatory)] [string] $OutDir,
    [Parameter(Mandatory)] [string] $Label
  )
  $certs = Get-ChildItem $StorePath -ErrorAction SilentlyContinue |
    Where-Object { $_.Subject -match '3M|mmm|3MHealth|3Mhealth' }
  $n = 0
  foreach ($c in $certs) {
    $safe = ($c.Subject -replace '[\\/:*?"<>|]', '_')
    if ($safe.Length -gt 80) { $safe = $safe.Substring(0, 80) }
    $file = Join-Path $OutDir ("{0}__{1}.cer" -f $c.Thumbprint, $safe)
    [IO.File]::WriteAllBytes($file, $c.Export('Cert'))
    $n++
    Write-Host ("  [{0}] {1}" -f $Label, $c.Subject)
  }
  return $n
}

Write-Host ''
Write-Host '=== 舊機：匯出 3M 憑證 → 桌面同步資料夾 ===' -ForegroundColor Cyan
Write-Host ("目標：{0}" -f $syncRoot)
Write-Host ''

# 清掉舊的 .cer，避免殘檔
Get-ChildItem $rootDir, $caDir -Filter *.cer -ErrorAction SilentlyContinue | Remove-Item -Force

$nRoot = Export-StoreCerts -StorePath 'Cert:\LocalMachine\Root' -OutDir $rootDir -Label 'Root'
$nCA   = Export-StoreCerts -StorePath 'Cert:\LocalMachine\CA'   -OutDir $caDir   -Label 'CA'

$manifest = [ordered]@{
  ExportedAt     = (Get-Date).ToString('o')
  ComputerName   = $env:COMPUTERNAME
  UserName       = $env:USERNAME
  RootCount      = $nRoot
  CACount        = $nCA
  SyncFolder     = $syncRoot
  Notes          = '同事／新機：雙擊 RUN-REPAIR.cmd；僅匯入可用 RUN-IMPORT.cmd'
}
$manifest | ConvertTo-Json | Set-Content -Path (Join-Path $syncRoot 'manifest.json') -Encoding UTF8

# 複製一份到腳本旁，方便整包傳給同事
$bundleBesideScript = Join-Path $scriptDir '3M-CAs-Cursor'
if ($bundleBesideScript -ne $syncRoot) {
  if (Test-Path $bundleBesideScript) { Remove-Item $bundleBesideScript -Recurse -Force }
  Copy-Item $syncRoot $bundleBesideScript -Recurse -Force
  Write-Host ("已同步一份到腳本旁：{0}" -f $bundleBesideScript) -ForegroundColor Green
}

Write-Host ''
Write-Host ("完成：Root {0} 張、CA（中繼）{1} 張" -f $nRoot, $nCA) -ForegroundColor Green
Write-Host '給同事：把整個 cursor-ssl-3m 資料夾（含 3M-CAs-Cursor）打包傳內網／Teams。' -ForegroundColor Yellow
Write-Host '不能用時：雙擊 RUN-REPAIR.cmd' -ForegroundColor Yellow
Write-Host ''
try { explorer $scriptDir } catch {}
Read-Host '按 Enter 關閉'
