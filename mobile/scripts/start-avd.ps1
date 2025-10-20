<#
Skript: start-avd.ps1
Objetivo: Iniciar um AVD por nome e aguardar até o boot completo.

Uso:
  Set-ExecutionPolicy Bypass -Scope Process -Force
  .\mobile\scripts\start-avd.ps1 -AvdName "Pixel_6_API_34"
#>

param(
  [Parameter(Mandatory=$true)] [string]$AvdName,
  [int]$BootTimeoutSec = 300,
  [ValidateSet('angle_indirect','swiftshader_indirect','host')]
  [string]$GpuMode = 'angle_indirect',
  [switch]$NoWindow,
  [switch]$ResetAdb
)

function Write-Info($m){ Write-Host "[INFO] $m" -ForegroundColor Cyan }
function Write-Err($m){ Write-Host "[ERRO] $m" -ForegroundColor Red }

try { $emu = (Get-Command emulator -ErrorAction Stop).Source } catch { Write-Err "Comando 'emulator' não encontrado no PATH. Adicione <SDK>\\emulator ao PATH."; exit 1 }
try { $adb = (Get-Command adb -ErrorAction Stop).Source } catch { Write-Err "Comando 'adb' não encontrado no PATH. Adicione <SDK>\\platform-tools ao PATH."; exit 1 }

# Opcional: resetar servidor ADB para evitar falhas de protocolo
if ($ResetAdb) {
  Write-Info "Reiniciando servidor ADB"
  & adb kill-server | Out-Null
  Start-Sleep -Seconds 1
  & adb start-server | Out-Null
}

# Verifica se o AVD existe
$list = & emulator -list-avds 2>$null | Where-Object { $_ -and $_.Trim() -ne '' }
if (-not ($list -and ($list -contains $AvdName))) {
  Write-Err "AVD '$AvdName' não encontrado. Disponíveis: $($list -join ', ' )"; exit 1
}

# Se sessão RDP, sugerir headless
if ($env:SESSIONNAME -and ($env:SESSIONNAME -match 'RDP')) {
  Write-Info "Sessão RDP detectada. Considere usar -NoWindow ou -GpuMode swiftshader_indirect para estabilidade."
}

# Se já existe um emulator com o AVD rodando, não inicia outro
$running = & adb devices | Select-String -Pattern "emulator-\d+\s+device" | ForEach-Object { $_.Matches.Value }
if ($running) { Write-Info "Um emulador já parece estar em execução: $running" }
else {
  Write-Info "Iniciando AVD: $AvdName"
  $args = @('-avd', $AvdName, '-netdelay', 'none', '-netspeed', 'full', '-no-snapshot', '-no-boot-anim', '-gpu', $GpuMode)
  if ($NoWindow) { $args += '-no-window' }
  $proc = Start-Process -FilePath $emu -ArgumentList $args -WindowStyle Minimized -PassThru
  Start-Sleep -Seconds 5
  if ($proc.HasExited) {
    Write-Err "O processo do emulador encerrou logo após iniciar. Tente com -NoWindow e/ou -GpuMode swiftshader_indirect."
    exit 1
  }
}

Write-Info "Aguardando dispositivo aparecer no ADB..."
& adb wait-for-device

# Verificação e recuperação rápida caso ADB esteja em estado inválido
$probeOk = $false
try {
  $null = & adb shell echo ok 2>$null
  if ($LASTEXITCODE -eq 0) { $probeOk = $true }
} catch { $probeOk = $false }

if (-not $probeOk) {
  Write-Info "ADB apresentou falha; tentando reiniciar servidor e reconectar"
  & adb kill-server | Out-Null
  Start-Sleep -Seconds 1
  & adb start-server | Out-Null
  & adb wait-for-device
}

$sw = [Diagnostics.Stopwatch]::StartNew()
do {
  Start-Sleep -Seconds 3
  $boot = (& adb shell getprop sys.boot_completed 2>$null).Trim()
  $lock = (& adb shell getprop dev.bootcomplete 2>$null).Trim()
  if ($boot -eq '1' -or $lock -eq '1') { break }
} while ($sw.Elapsed.TotalSeconds -lt $BootTimeoutSec)

if ($sw.Elapsed.TotalSeconds -ge $BootTimeoutSec) {
  Write-Err "Timeout aguardando boot do AVD ($BootTimeoutSec s)."
  exit 1
}

Write-Info "AVD '$AvdName' pronto."
