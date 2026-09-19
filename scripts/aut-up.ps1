# Starts the Toolshop locally with Docker Compose. Clones the app into aut/ on first use.
# -Reseed drops and re-seeds the LOCAL demo database. It never touches a hosted environment.
param([switch]$Reseed)

# Not 'Stop': Windows PowerShell 5.1 turns any stderr line from docker or git (even a warning)
# into a terminating error. Native commands are checked through $LASTEXITCODE instead.
$ErrorActionPreference = 'Continue'
$root = Split-Path -Parent $PSScriptRoot
$autDir = Join-Path $root 'aut\practice-software-testing'
$firstRun = -not (Test-Path $autDir)

if ($firstRun) {
    New-Item -ItemType Directory -Force (Join-Path $root 'aut') | Out-Null
    git clone --depth 1 https://github.com/testsmith-io/practice-software-testing.git $autDir
    if ($LASTEXITCODE -ne 0) { throw 'git clone failed.' }
}

Push-Location $autDir
try {
    docker compose up -d
    if ($LASTEXITCODE -ne 0) { throw 'docker compose up failed. Is Docker Desktop running?' }

    # The composer service installs the PHP dependencies and then exits. Nothing works before that.
    Write-Host 'Waiting for composer to finish installing dependencies ...'
    $composerId = docker compose ps -a -q composer
    if ($composerId) {
        $exitCode = docker wait $composerId
        if ($exitCode -ne '0') {
            # Unzipping through the Windows bind mount can exceed composer's 300 s process timeout.
            # Packages already installed are kept, so a retry without the timeout finishes the job.
            Write-Host 'composer failed, retrying with the process timeout disabled ...'
            docker compose run --rm -e COMPOSER_PROCESS_TIMEOUT=0 composer
            if ($LASTEXITCODE -ne 0) { throw 'composer failed again. Check: docker compose logs composer' }
        }
    }

    # No database tables yet means the app was never seeded, even if aut/ already existed.
    $needsSeed = $firstRun -or $Reseed
    if (-not $needsSeed) {
        docker compose exec -T laravel-api php artisan migrate:status 2>$null | Out-Null
        if ($LASTEXITCODE -ne 0) { $needsSeed = $true }
    }

    if ($needsSeed) {
        docker compose exec -T laravel-api php artisan migrate:fresh --seed --force
        if ($LASTEXITCODE -ne 0) { throw 'Seeding failed.' }
    }

    Write-Host 'Waiting for the API and the UI ...'
    foreach ($url in 'http://localhost:8091/status', 'http://localhost:4200') {
        $ready = $false
        foreach ($i in 1..60) {
            try {
                $r = Invoke-WebRequest -Uri $url -UseBasicParsing -TimeoutSec 5
                if ($r.StatusCode -eq 200) { $ready = $true; break }
            } catch { }
            Start-Sleep -Seconds 5
        }
        if (-not $ready) { throw "$url did not answer 200 within 5 minutes. Check: docker compose logs" }
    }
} finally {
    Pop-Location
}

Write-Host 'Toolshop UI:  http://localhost:4200'
Write-Host 'API:          http://localhost:8091'
Write-Host 'Swagger:      http://localhost:8091/api/documentation'
