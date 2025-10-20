<#
Skript: setup-android-sdk.ps1
Objetivo: Instalar e configurar Android SDK (cmdline-tools), platform-tools, emulator, plataformas e system-image; criar AVD; ajustar variáveis de ambiente no Windows.

Uso (PowerShell como Administrador recomendado):
  Set-ExecutionPolicy Bypass -Scope Process -Force
  .\mobile\scripts\setup-android-sdk.ps1 -SdkRoot "C:\Android" -ApiLevel 34 -AvdName "Pixel_6_API_34"

Parâmetros:
  -SdkRoot  Caminho base do SDK (default: C:\Android)
  -ApiLevel Nível da API Android (default: 34)
  -AvdName  Nome do AVD a criar (default: Pixel_6_API_34)

Observações:
  - Requer internet para download e instalação de pacotes.
  - Aceitação de licenças será solicitada interativamente (sdkmanager --licenses).
  - Após executar, abra um novo terminal para que alterações permanentes de PATH tenham efeito.
#>

param(
  [string]$SdkRoot = "C:\Android",
  [int]$ApiLevel = 34,
  [string]$AvdName = "Pixel_6_API_34",
  [switch]$InstallJdk,
  [ValidateSet('auto','winget','choco')]
  [string]$PackageManager = 'auto'
)

function Write-Info($msg) { Write-Host "[INFO] $msg" -ForegroundColor Cyan }
function Write-Err($msg) { Write-Host "[ERRO] $msg" -ForegroundColor Red }
function Ensure-Dir($p) { if (-not (Test-Path $p)) { New-Item -ItemType Directory -Path $p -Force | Out-Null } }

function Get-AvailablePackageManager {
  if (Get-Command winget -ErrorAction SilentlyContinue) { return 'winget' }
  if (Get-Command choco -ErrorAction SilentlyContinue) { return 'choco' }
  return 'none'
}

function Set-JavaHomeFromJavaExe {
  try {
    $javaPath = (Get-Command java -ErrorAction Stop).Path
    $binDir = Split-Path -Path $javaPath -Parent
    $jdkDir = Split-Path -Path $binDir -Parent
    if ($jdkDir -and (Test-Path $jdkDir)) {
      [Environment]::SetEnvironmentVariable('JAVA_HOME', $jdkDir, 'User')
      $env:JAVA_HOME = $jdkDir
      if ($env:Path -notlike "*${env:JAVA_HOME}\bin*") { $env:Path += ";$env:JAVA_HOME\bin" }
      $userPath = [Environment]::GetEnvironmentVariable('Path', 'User')
      if ($userPath -notlike "*${jdkDir}\bin*") { [Environment]::SetEnvironmentVariable('Path', "$userPath;$jdkDir\bin", 'User') }
      return $true
    }
  } catch {}
  return $false
}

function Install-JDK17([string]$pmChoice) {
  $pm = $pmChoice
  if ($pm -eq 'auto') { $pm = Get-AvailablePackageManager }
  if ($pm -eq 'none') {
    Write-Err "Nenhum gerenciador de pacotes encontrado (winget/choco). Instale um deles ou instale o JDK 17 manualmente."
    return $false
  }
  Write-Info "Instalando JDK 17 via $pm (pode solicitar confirmação/UAC)"
  if ($pm -eq 'winget') {
    # Atualiza fontes e tenta múltiplos IDs conhecidos
    try { Start-Process -FilePath 'winget' -ArgumentList @('source','update') -NoNewWindow -Wait | Out-Null } catch {}
    $candidateIds = @(
      'EclipseAdoptium.Temurin.17.JDK',
      'EclipseAdoptium.TemurinJDK.17',
      'EclipseAdoptium.TemurinJDK17',
      'Microsoft.OpenJDK.17',
      'Oracle.JDK.17'
    )
    $installedOk = $false
    foreach ($cid in $candidateIds) {
      Write-Info "Tentando instalar via winget ID: $cid"
      $args = @('install','-e','--id', $cid,'--accept-package-agreements','--accept-source-agreements')
      $p = Start-Process -FilePath 'winget' -ArgumentList $args -NoNewWindow -PassThru -Wait
      if ($p.ExitCode -eq 0) { $installedOk = $true; break }
    }
    if (-not $installedOk) {
      Write-Err "Falha ao instalar via winget. Tente executar manualmente: 'winget search temurin 17' para identificar o ID correto."
      # fallback automático para choco se disponível
      if (Get-Command choco -ErrorAction SilentlyContinue) {
        Write-Info "Winget falhou; tentando via Chocolatey (temurin17)"
        $pm = 'choco'
      } else {
        return $false
      }
    } else {
      # Atualiza cache/ambiente após instalação
      $null = & cmd /c refreshenv 2>$null
      Start-Sleep -Seconds 2
    }
  } elseif ($pm -eq 'choco') {
    $p = Start-Process -FilePath 'choco' -ArgumentList @('install','temurin17','-y') -NoNewWindow -PassThru -Wait
    if ($p.ExitCode -ne 0) { Write-Err "Falha ao instalar via choco (código $($p.ExitCode))"; return $false }
  }
  # Atualiza cache de comandos e tenta setar JAVA_HOME
  $null = & cmd /c refreshenv 2>$null
  Start-Sleep -Seconds 2
  $ok = $false
  try { $null = & java -version 2>$null; if ($LASTEXITCODE -eq 0) { $ok = $true } } catch {}
  if (-not $ok) { Write-Err "Java ainda não está disponível após instalação. Abra novo terminal e tente novamente."; return $false }
  if (-not (Set-JavaHomeFromJavaExe)) { Write-Err "Não foi possível definir JAVA_HOME automaticamente." }
  return $true
}

# Pré-checagem: Java/JDK
$javaFound = $false
try {
  $null = & java -version 2>$null
  if ($LASTEXITCODE -eq 0) { $javaFound = $true }
} catch { $javaFound = $false }

if (-not $javaFound) {
  if ($InstallJdk.IsPresent) {
    $installed = Install-JDK17 -pmChoice $PackageManager
    if (-not $installed) { exit 1 }
  } else {
    Write-Err "JAVA_HOME não está definido e/ou 'java' não está no PATH."
    Write-Host "Instale o JDK 17 (exemplos):" -ForegroundColor Yellow
    Write-Host "  winget install -e --id EclipseAdoptium.TemurinJDK17" -ForegroundColor Yellow
    Write-Host "  (ou) choco install temurin17 -y" -ForegroundColor Yellow
    Write-Host "Depois, ajuste JAVA_HOME e PATH (sessão atual):" -ForegroundColor Yellow
    Write-Host '  $env:JAVA_HOME="C:\Program Files\Eclipse Adoptium\jdk-17"; $env:Path += ";$env:JAVA_HOME\bin"' -ForegroundColor Yellow
    Write-Host "Ou reexecute este script com -InstallJdk para instalar automaticamente." -ForegroundColor Yellow
    Write-Host "E reabra o terminal para carregar variáveis persistentes, se configurar pelo Painel de Controle." -ForegroundColor Yellow
    exit 1
  }
}

Write-Info "SDK Root: $SdkRoot"
Ensure-Dir $SdkRoot
Ensure-Dir (Join-Path $SdkRoot 'cmdline-tools')

# Habilitar TLS 1.2 para downloads em PowerShell
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12

$cliUrl = 'https://dl.google.com/android/repository/commandlinetools-win-11076708_latest.zip'
$zipPath = Join-Path $SdkRoot 'cmdline-tools\commandlinetools.zip'
$tempExtract = Join-Path $SdkRoot 'cmdline-tools\_extract'
$cliDest = Join-Path $SdkRoot 'cmdline-tools\latest'

if (-not (Test-Path $cliDest)) {
  Write-Info "Baixando Android cmdline-tools..."
  try {
    Invoke-WebRequest -Uri $cliUrl -OutFile $zipPath -UseBasicParsing
  } catch {
    Write-Err "Falha no download do cmdline-tools: $($_.Exception.Message)"
    exit 1
  }

  Write-Info "Extraindo cmdline-tools..."
  Ensure-Dir $tempExtract
  Expand-Archive -Path $zipPath -DestinationPath $tempExtract -Force

  # O ZIP extrai em uma pasta 'cmdline-tools'; mover para 'latest'
  $extractedCmd = Join-Path $tempExtract 'cmdline-tools'
  if (-not (Test-Path $extractedCmd)) {
    Write-Err "Estrutura inesperada do ZIP em $tempExtract"
    exit 1
  }
  Move-Item -Path $extractedCmd -Destination $cliDest -Force
  Remove-Item $zipPath -Force -ErrorAction SilentlyContinue
  Remove-Item $tempExtract -Recurse -Force -ErrorAction SilentlyContinue
} else {
  Write-Info "cmdline-tools já presentes em $cliDest"
}

# Atualiza variáveis de ambiente (Usuário) e sessão atual
Write-Info "Configurando variáveis de ambiente ANDROID_HOME/ANDROID_SDK_ROOT e PATH"
[Environment]::SetEnvironmentVariable('ANDROID_HOME', $SdkRoot, 'User')
[Environment]::SetEnvironmentVariable('ANDROID_SDK_ROOT', $SdkRoot, 'User')

$env:ANDROID_HOME = $SdkRoot
$env:ANDROID_SDK_ROOT = $SdkRoot

$pathsToAdd = @(
  (Join-Path $SdkRoot 'platform-tools'),
  (Join-Path $SdkRoot 'emulator'),
  (Join-Path $SdkRoot 'tools'),
  (Join-Path $SdkRoot 'tools\bin'),
  (Join-Path $SdkRoot 'cmdline-tools\latest\bin')
)

# Atualiza PATH do usuário (não sobrescreve, só adiciona se faltar)
$currentUserPath = [Environment]::GetEnvironmentVariable('Path', 'User')
foreach ($p in $pathsToAdd) {
  if (-not ($currentUserPath -like "*${p}*")) { $currentUserPath = "$currentUserPath;$p" }
}
[Environment]::SetEnvironmentVariable('Path', $currentUserPath, 'User')

# Atualiza PATH da sessão atual
foreach ($p in $pathsToAdd) { if (-not ($env:Path -like "*${p}*")) { $env:Path += ";$p" } }

$sdkmanager = Join-Path $cliDest 'bin\sdkmanager.bat'
$avdmanager = Join-Path $cliDest 'bin\avdmanager.bat'

if (-not (Test-Path $sdkmanager)) { Write-Err "sdkmanager não encontrado em $sdkmanager"; exit 1 }
if (-not (Test-Path $avdmanager)) { Write-Err "avdmanager não encontrado em $avdmanager"; exit 1 }

Write-Info "Aceite as licenças quando solicitado. Uma janela interativa será aberta."
Start-Process -FilePath $sdkmanager -ArgumentList '--licenses' -NoNewWindow -Wait

Write-Info "Instalando pacotes essenciais (platform-tools, emulator, platforms;android-$ApiLevel, build-tools;${ApiLevel}.0.0, system-image)..."
& $sdkmanager `
  'platform-tools' `
  'emulator' `
  "platforms;android-$ApiLevel" `
  "build-tools;${ApiLevel}.0.0" `
  "system-images;android-$ApiLevel;google_apis;x86_64" | Write-Output

if ($LASTEXITCODE -ne 0) { Write-Err "Falha ao instalar pacotes via sdkmanager"; exit 1 }

Write-Info "Criando AVD: $AvdName"
& $avdmanager create avd -n $AvdName -k "system-images;android-$ApiLevel;google_apis;x86_64" -d pixel_6
if ($LASTEXITCODE -ne 0) {
  Write-Err "Falha ao criar AVD. Verifique se já existe ou se o pacote da system-image foi instalado."
}

Write-Info "Validações finais"
& adb version | Write-Output
& emulator -list-avds | Write-Output

Write-Host "\nConcluído. Abra um novo terminal para carregar PATH/variáveis persistentes, se necessário." -ForegroundColor Green
