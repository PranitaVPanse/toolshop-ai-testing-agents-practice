# Stops the local Toolshop containers. Data volumes are kept.
$root = Split-Path -Parent $PSScriptRoot
$autDir = Join-Path $root 'aut\practice-software-testing'
if (-not (Test-Path $autDir)) { Write-Host 'Nothing to stop. aut/ does not exist.'; exit 0 }
Push-Location $autDir
try { docker compose down } finally { Pop-Location }
