$ErrorActionPreference = 'Stop'
$desk = [Environment]::GetFolderPath('Desktop')
$dest = Join-Path $desk 'cursor-ssl-3m'
New-Item -ItemType Directory -Force -Path $dest | Out-Null
Write-Host "建立 $dest" -ForegroundColor Cyan

@'
#Requires -Version 5.1
<#
.SYNOPSIS
  一鍵修復：Cursor 因公司 SSL／3M 憑證無法連線時使用（本人與同事皆可）
.DESCRIPTION
  1) 尋找憑證包 3M-CAs-Cursor（腳本旁 → 桌面 → 下載）
  2) 匯入缺的 Root／中繼
  3) 開啟 Cursor「使用系統憑證」設定
  4) 結束殘留 Cursor 行程（請之後手動再開）
  僅供 3M 內部同事使用；勿把憑證包傳到公司外。
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

$scriptDir = Split-Path -Parent $PSCommandPath
$desktop   = [Environment]::GetFolderPath('Desktop')
$downloads = [Environment]::GetFolderPath('UserProfile') + '\Downloads'

Write-Host ''
Write-Host '=== Cursor × 3M 一鍵修復 ===' -ForegroundColor Cyan
Write-Host ''

# --- 找憑證包 ---
$candidates = @(
  (Join-Path $scriptDir '3M-CAs-Cursor'),
  (Join-Path $desktop '3M-CAs-Cursor'),
  (Join-Path $downloads '3M-CAs-Cursor')
)
$syncRoot = $candidates | Where-Object { Test-Path $_ } | Select-Object -First 1

if (-not $syncRoot) {
  Write-Host '找不到憑證包 3M-CAs-Cursor。' -ForegroundColor Red
  Write-Host '請向同事索取整個修復資料夾（內含 3M-CAs-Cursor），或先在一台可用的電腦執行 RUN-EXPORT.cmd。'
  Write-Host '預期位置：'
  $candidates | ForEach-Object { Write-Host "  - $_" }
  Read-Host '按 Enter 關閉'
  exit 1
}

$rootDir = Join-Path $syncRoot 'Root'
$caDir   = Join-Path $syncRoot 'CA'
Write-Host ("憑證包：$syncRoot") -ForegroundColor Green

$rootFiles = @(Get-ChildItem $rootDir -Filter *.cer -ErrorAction SilentlyContinue)
$caFiles   = @(Get-ChildItem $caDir   -Filter *.cer -ErrorAction SilentlyContinue)
if ($rootFiles.Count + $caFiles.Count -eq 0) {
  Write-Host '憑證包是空的（沒有 .cer）。' -ForegroundColor Red
  Read-Host '按 Enter 關閉'
  exit 1
}

function Import-CerFiles {
  param($Files, $StoreLocation, $Label)
  $ok = 0; $skip = 0; $fail = 0
  foreach ($f in @($Files)) {
    $tp = ($f.BaseName -split '__')[0].ToUpperInvariant()
    if (Get-ChildItem $StoreLocation -ErrorAction SilentlyContinue | Where-Object Thumbprint -eq $tp) {
      $skip++; continue
    }
    try {
      Import-Certificate -FilePath $f.FullName -CertStoreLocation $StoreLocation | Out-Null
      Write-Host ("  [+] {0}: {1}" -f $Label, $f.Name) -ForegroundColor Green
      $ok++
    } catch {
      Write-Host ("  [!] {0}: {1} → {2}" -f $Label, $f.Name, $_.Exception.Message) -ForegroundColor Red
      $fail++
    }
  }
  [pscustomobject]@{ Ok = $ok; Skip = $skip; Fail = $fail }
}

Write-Host ''
Write-Host '【1/4】匯入憑證…' -ForegroundColor Cyan
$r = Import-CerFiles $rootFiles 'Cert:\LocalMachine\Root' 'Root'
$c = Import-CerFiles $caFiles   'Cert:\LocalMachine\CA'   'CA'
Write-Host ("  Root 新增 {0}、略過 {1}、失敗 {2}" -f $r.Ok, $r.Skip, $r.Fail)
Write-Host ("  CA   新增 {0}、略過 {1}、失敗 {2}" -f $c.Ok, $c.Skip, $c.Fail)

Write-Host ''
Write-Host '【2/4】關鍵中繼檢查…' -ForegroundColor Cyan
$need = @(
  'F81D3A0C2FD4BF3BCF776998E958D7AFC1D86D27',
  'B08830DEB963C93FA9075797C5908327A49437E1',
  '96FC0837526D9B68CBBBE2965938A9041C5A0176'
)
$missing = @()
foreach ($tp in $need) {
  $hit = Get-ChildItem Cert:\LocalMachine\CA -ErrorAction SilentlyContinue | Where-Object Thumbprint -eq $tp
  if ($hit) { Write-Host ("  [OK] {0}" -f $tp) -ForegroundColor Green }
  else { Write-Host ("  [缺] {0}" -f $tp) -ForegroundColor Red; $missing += $tp }
}

Write-Host ''
Write-Host '【3/4】開啟 Cursor 系統憑證設定…' -ForegroundColor Cyan
$settingsPath = Join-Path $env:APPDATA 'Cursor\User\settings.json'
$settingsDir  = Split-Path $settingsPath -Parent
if (-not (Test-Path $settingsDir)) { New-Item -ItemType Directory -Force -Path $settingsDir | Out-Null }

$map = @{}
if (Test-Path $settingsPath) {
  try {
    $raw = Get-Content $settingsPath -Raw -Encoding UTF8
    if (-not [string]::IsNullOrWhiteSpace($raw)) {
      ($raw | ConvertFrom-Json).PSObject.Properties | ForEach-Object { $map[$_.Name] = $_.Value }
    }
  } catch {
    Write-Host '  既有 settings.json 無法解析，將備份後重建。' -ForegroundColor Yellow
    Copy-Item $settingsPath ($settingsPath + '.bak-' + (Get-Date -Format 'yyyyMMddHHmmss'))
    $map = @{}
  }
}
$map['http.systemCertificates'] = $true
$map['http.experimental.systemCertificatesV2'] = $true

$ps = [pscustomobject]@{}
foreach ($k in ($map.Keys | Sort-Object)) {
  $ps | Add-Member -NotePropertyName $k -NotePropertyValue $map[$k] -Force
}
($ps | ConvertTo-Json -Depth 20) | Set-Content -Path $settingsPath -Encoding UTF8
Write-Host ("  已寫入：{0}" -f $settingsPath) -ForegroundColor Green
Write-Host '  http.systemCertificates = true'
Write-Host '  http.experimental.systemCertificatesV2 = true'

Write-Host ''
Write-Host '【4/4】結束 Cursor 行程（請稍後手動重開）…' -ForegroundColor Cyan
$procs = Get-Process -Name 'Cursor','cursor' -ErrorAction SilentlyContinue
if ($procs) {
  $procs | Stop-Process -Force -ErrorAction SilentlyContinue
  Write-Host '  已結束 Cursor。請重新開啟 Cursor → Network Diagnostic。' -ForegroundColor Yellow
} else {
  Write-Host '  目前沒有 Cursor 行程。請開啟 Cursor → Network Diagnostic。' -ForegroundColor Yellow
}

Write-Host ''
if ($missing.Count -gt 0) {
  Write-Host '修復未完全：關鍵中繼仍缺，請更新憑證包（請同事再跑一次 RUN-EXPORT）。' -ForegroundColor Red
} else {
  Write-Host '修復步驟完成。若仍不行：開關 VPN 或重開機；持續發生請找 IT。' -ForegroundColor Green
}
Write-Host ''
Write-Host '提醒：憑證包僅限公司內部傳給同事，勿外傳。' -ForegroundColor DarkYellow
Write-Host ''
Read-Host '按 Enter 關閉'

'@ | Set-Content -Path (Join-Path $dest 'Repair-Cursor-3M.ps1') -Encoding UTF8

@'
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

'@ | Set-Content -Path (Join-Path $dest 'Export-3M-Certs.ps1') -Encoding UTF8

@'
@echo off
chcp 65001 >nul
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0Repair-Cursor-3M.ps1"
'@ | Set-Content -Path (Join-Path $dest 'RUN-REPAIR.cmd') -Encoding ASCII

@'
@echo off
chcp 65001 >nul
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0Export-3M-Certs.ps1"
'@ | Set-Content -Path (Join-Path $dest 'RUN-EXPORT.cmd') -Encoding ASCII

$certs = Join-Path $desk '3M-CAs-Cursor'
if (Test-Path $certs) {
  Copy-Item $certs (Join-Path $dest '3M-CAs-Cursor') -Recurse -Force
  Write-Host '已附上 3M-CAs-Cursor' -ForegroundColor Green
} else {
  Write-Host '桌面無 3M-CAs-Cursor，請雙擊 RUN-EXPORT.cmd' -ForegroundColor Yellow
}

Write-Host "完成：$dest" -ForegroundColor Green
Write-Host '給同事／自己備份：把整個 cursor-ssl-3m 資料夾留在 OneDrive'
Write-Host '不能用時：雙擊 RUN-REPAIR.cmd'
explorer $dest
