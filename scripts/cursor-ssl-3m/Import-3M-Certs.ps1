#Requires -Version 5.1
<#
.SYNOPSIS
  新機執行：從「桌面\3M-CAs-Cursor」匯入 Root／CA 憑證，供 Cursor 通過公司 SSL 檢查
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
$desktop  = [Environment]::GetFolderPath('Desktop')
$syncRoot = Join-Path $desktop '3M-CAs-Cursor'
$rootDir  = Join-Path $syncRoot 'Root'
$caDir    = Join-Path $syncRoot 'CA'

Write-Host ''
Write-Host '=== 新機：從桌面同步資料夾匯入 3M 憑證 ===' -ForegroundColor Cyan
Write-Host ("來源：{0}" -f $syncRoot)
Write-Host ''

if (-not (Test-Path $syncRoot)) {
  Write-Host '找不到桌面\3M-CAs-Cursor。請先在舊機執行匯出，並等同步完成。' -ForegroundColor Red
  Read-Host '按 Enter 關閉'
  exit 1
}

$rootFiles = @(Get-ChildItem $rootDir -Filter *.cer -ErrorAction SilentlyContinue)
$caFiles   = @(Get-ChildItem $caDir   -Filter *.cer -ErrorAction SilentlyContinue)

if ($rootFiles.Count -eq 0 -and $caFiles.Count -eq 0) {
  Write-Host '資料夾是空的。請確認舊機已匯出，且 OneDrive／桌面同步已完成。' -ForegroundColor Red
  Read-Host '按 Enter 關閉'
  exit 1
}

function Import-CerFiles {
  param(
    [Parameter(Mandatory)] [System.IO.FileInfo[]] $Files,
    [Parameter(Mandatory)] [string] $StoreLocation,
    [Parameter(Mandatory)] [string] $Label
  )
  $ok = 0; $skip = 0; $fail = 0
  foreach ($f in $Files) {
    $tp = ($f.BaseName -split '__')[0].ToUpperInvariant()
    $existing = Get-ChildItem $StoreLocation -ErrorAction SilentlyContinue |
      Where-Object { $_.Thumbprint -eq $tp }
    if ($existing) {
      Write-Host ("  [=] 已存在 {0}: {1}" -f $Label, $tp) -ForegroundColor DarkGray
      $skip++
      continue
    }
    try {
      Import-Certificate -FilePath $f.FullName -CertStoreLocation $StoreLocation | Out-Null
      Write-Host ("  [+] 已匯入 {0}: {1}" -f $Label, $f.Name) -ForegroundColor Green
      $ok++
    } catch {
      Write-Host ("  [!] 失敗 {0}: {1} → {2}" -f $Label, $f.Name, $_.Exception.Message) -ForegroundColor Red
      $fail++
    }
  }
  return [pscustomobject]@{ Ok = $ok; Skip = $skip; Fail = $fail }
}

$r = Import-CerFiles -Files $rootFiles -StoreLocation 'Cert:\LocalMachine\Root' -Label 'Root'
$c = Import-CerFiles -Files $caFiles   -StoreLocation 'Cert:\LocalMachine\CA'   -Label 'CA'

Write-Host ''
Write-Host ("Root：新增 {0}、略過 {1}、失敗 {2}" -f $r.Ok, $r.Skip, $r.Fail)
Write-Host ("CA  ：新增 {0}、略過 {1}、失敗 {2}" -f $c.Ok, $c.Skip, $c.Fail)
Write-Host ''

# 關鍵中繼是否到位（舊機診斷對照）
$need = @(
  'F81D3A0C2FD4BF3BCF776998E958D7AFC1D86D27', # Issue 2
  'B08830DEB963C93FA9075797C5908327A49437E1', # Issue 1
  '96FC0837526D9B68CBBBE2965938A9041C5A0176'  # Policy
)
Write-Host '關鍵中繼檢查：' -ForegroundColor Cyan
foreach ($tp in $need) {
  $hit = Get-ChildItem Cert:\LocalMachine\CA -ErrorAction SilentlyContinue |
    Where-Object Thumbprint -eq $tp
  if ($hit) {
    Write-Host ("  [OK] {0}  {1}" -f $tp, $hit.Subject) -ForegroundColor Green
  } else {
    Write-Host ("  [缺] {0}" -f $tp) -ForegroundColor Red
  }
}

Write-Host ''
Write-Host '接下來請在 Cursor：' -ForegroundColor Yellow
Write-Host '  1. Settings 搜 Certificates → 開啟 System Certificates 與 System Certificates V2'
Write-Host '  2. 完全結束 Cursor（含系統匣）後再開'
Write-Host '  3. Network → Run Diagnostics，確認 SSL／API／Chat／Agent'
Write-Host ''
Read-Host '按 Enter 關閉'
