# Auto-pull for santino-frontend (Windows)
# Runs git pull every 30 seconds. Use with live-server so the browser auto-refreshes.
# Press Ctrl+C to stop.

$repoRoot = $PSScriptRoot + "\.."
$intervalSeconds = 30

Set-Location $repoRoot
Write-Host "santino-frontend: auto-pull every $intervalSeconds sec. Stop with Ctrl+C." -ForegroundColor Green
Write-Host "Repo: $repoRoot" -ForegroundColor Gray

while ($true) {
    $result = git pull 2>&1
    if ($LASTEXITCODE -eq 0) {
        if ($result -match "Already up to date") {
            Write-Host "[$(Get-Date -Format 'HH:mm:ss')] Up to date." -ForegroundColor DarkGray
        } else {
            Write-Host "[$(Get-Date -Format 'HH:mm:ss')] Updated:" -ForegroundColor Cyan
            Write-Host $result
        }
    } else {
        Write-Host "[$(Get-Date -Format 'HH:mm:ss')] Pull failed:" -ForegroundColor Red
        Write-Host $result
    }
    Start-Sleep -Seconds $intervalSeconds
}
