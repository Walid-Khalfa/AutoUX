# Script pour liberer les ports 3001 et 5173

Write-Host "Recherche des processus utilisant les ports 3001 et 5173..." -ForegroundColor Cyan

# Tuer tous les processus Node.js
$nodeProcesses = Get-Process -Name node -ErrorAction SilentlyContinue
if ($nodeProcesses) {
    Write-Host "Arret de $($nodeProcesses.Count) processus Node.js..." -ForegroundColor Yellow
    $nodeProcesses | Stop-Process -Force
    Write-Host "Processus Node.js arretes" -ForegroundColor Green
} else {
    Write-Host "Aucun processus Node.js en cours" -ForegroundColor Green
}

# Attendre un peu
Start-Sleep -Seconds 1

# Verifier les ports
$port3001 = Get-NetTCPConnection -LocalPort 3001 -ErrorAction SilentlyContinue
$port5173 = Get-NetTCPConnection -LocalPort 5173 -ErrorAction SilentlyContinue

if ($port3001) {
    Write-Host "Port 3001 encore utilise" -ForegroundColor Yellow
} else {
    Write-Host "Port 3001 libre" -ForegroundColor Green
}

if ($port5173) {
    Write-Host "Port 5173 encore utilise" -ForegroundColor Yellow
} else {
    Write-Host "Port 5173 libre" -ForegroundColor Green
}

Write-Host ""
Write-Host "Vous pouvez maintenant lancer: npm run dev" -ForegroundColor Cyan
