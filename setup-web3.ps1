# Script PowerShell pour configurer Web3 sur AutoUX
# Usage: .\setup-web3.ps1

Write-Host "╔══════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║         🚀 Configuration Web3 - AutoUX                      ║" -ForegroundColor Cyan
Write-Host "╚══════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# Vérifier que nous sommes dans le bon dossier
if (-not (Test-Path "web3")) {
    Write-Host "❌ Erreur: Dossier 'web3' introuvable" -ForegroundColor Red
    Write-Host "   Assurez-vous d'exécuter ce script depuis la racine du projet AutoUX" -ForegroundColor Yellow
    exit 1
}

# Étape 1: Vérifier le fichier .env
Write-Host "📝 Étape 1: Vérification de web3/.env" -ForegroundColor Yellow
if (-not (Test-Path "web3/.env")) {
    Write-Host "❌ Fichier web3/.env introuvable" -ForegroundColor Red
    Write-Host "   Créez-le à partir de web3/.env.example" -ForegroundColor Yellow
    exit 1
}

# Lire le fichier .env
$envContent = Get-Content "web3/.env" -Raw

# Vérifier la clé privée
if ($envContent -match "PRIVATE_KEY=0xVOTRE_CLE_PRIVEE_ICI" -or $envContent -match "PRIVATE_KEY=0xYOUR_PRIVATE_KEY_HERE") {
    Write-Host "⚠️  Clé privée non configurée dans web3/.env" -ForegroundColor Yellow
    Write-Host "   1. Ouvrez MetaMask" -ForegroundColor Cyan
    Write-Host "   2. Cliquez sur les 3 points (⋮)" -ForegroundColor Cyan
    Write-Host "   3. Sélectionnez 'Account Details'" -ForegroundColor Cyan
    Write-Host "   4. Cliquez sur 'Export Private Key'" -ForegroundColor Cyan
    Write-Host "   5. Copiez la clé et ajoutez-la dans web3/.env" -ForegroundColor Cyan
    Write-Host ""
    $continue = Read-Host "Avez-vous ajouté votre clé privée? (o/n)"
    if ($continue -ne "o") {
        Write-Host "❌ Configuration annulée" -ForegroundColor Red
        exit 1
    }
}

Write-Host "✅ Fichier .env configuré" -ForegroundColor Green
Write-Host ""

# Étape 2: Vérifier Sepolia ETH
Write-Host "💰 Étape 2: Vérification du Sepolia ETH" -ForegroundColor Yellow
Write-Host "   Avez-vous du Sepolia ETH dans votre wallet?" -ForegroundColor Cyan
Write-Host "   Si non, obtenez-en gratuitement sur:" -ForegroundColor Cyan
Write-Host "   👉 https://sepoliafaucet.com/" -ForegroundColor Green
Write-Host ""
$hasEth = Read-Host "Avez-vous du Sepolia ETH? (o/n)"
if ($hasEth -ne "o") {
    Write-Host "⚠️  Obtenez du Sepolia ETH avant de continuer" -ForegroundColor Yellow
    Start-Process "https://sepoliafaucet.com/"
    exit 1
}

Write-Host "✅ Sepolia ETH disponible" -ForegroundColor Green
Write-Host ""

# Étape 3: Installer les dépendances
Write-Host "📦 Étape 3: Installation des dépendances" -ForegroundColor Yellow
Set-Location web3
if (-not (Test-Path "node_modules")) {
    Write-Host "   Installation en cours..." -ForegroundColor Cyan
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Erreur lors de l'installation" -ForegroundColor Red
        Set-Location ..
        exit 1
    }
}
Write-Host "✅ Dépendances installées" -ForegroundColor Green
Write-Host ""

# Étape 4: Compiler le contrat
Write-Host "🔨 Étape 4: Compilation du smart contract" -ForegroundColor Yellow
npm run compile
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Erreur lors de la compilation" -ForegroundColor Red
    Set-Location ..
    exit 1
}
Write-Host "✅ Contrat compilé avec succès" -ForegroundColor Green
Write-Host ""

# Étape 5: Déployer le contrat
Write-Host "🚀 Étape 5: Déploiement sur Sepolia" -ForegroundColor Yellow
Write-Host "   Cela peut prendre 30-60 secondes..." -ForegroundColor Cyan
Write-Host ""

$deployOutput = npm run deploy:sepolia 2>&1 | Out-String
Write-Host $deployOutput

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Erreur lors du déploiement" -ForegroundColor Red
    Set-Location ..
    exit 1
}

# Extraire l'adresse du contrat
if ($deployOutput -match "deployed to: (0x[a-fA-F0-9]{40})") {
    $contractAddress = $matches[1]
    Write-Host ""
    Write-Host "✅ Contrat déployé avec succès!" -ForegroundColor Green
    Write-Host "📍 Adresse: $contractAddress" -ForegroundColor Cyan
    Write-Host ""
    
    # Étape 6: Mettre à jour frontend/.env
    Write-Host "📝 Étape 6: Configuration du frontend" -ForegroundColor Yellow
    Set-Location ..
    
    $frontendEnv = Get-Content "frontend/.env" -Raw
    $frontendEnv = $frontendEnv -replace "VITE_REGISTRY_ADDRESS=.*", "VITE_REGISTRY_ADDRESS=$contractAddress"
    Set-Content "frontend/.env" $frontendEnv
    
    Write-Host "✅ Frontend configuré" -ForegroundColor Green
    Write-Host ""
    
    # Résumé final
    Write-Host "╔══════════════════════════════════════════════════════════════╗" -ForegroundColor Green
    Write-Host "║              ✅ Configuration terminée!                      ║" -ForegroundColor Green
    Write-Host "╚══════════════════════════════════════════════════════════════╝" -ForegroundColor Green
    Write-Host ""
    Write-Host "📍 Adresse du contrat: $contractAddress" -ForegroundColor Cyan
    Write-Host "🔗 Etherscan: https://sepolia.etherscan.io/address/$contractAddress" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "🎯 Prochaines étapes:" -ForegroundColor Yellow
    Write-Host "   1. Démarrer l'application: npm run dev" -ForegroundColor Cyan
    Write-Host "   2. Ouvrir http://localhost:5173" -ForegroundColor Cyan
    Write-Host "   3. Uploader un fichier de test" -ForegroundColor Cyan
    Write-Host "   4. Tester la fonctionnalité Web3!" -ForegroundColor Cyan
    Write-Host ""
    
} else {
    Write-Host "⚠️  Impossible d'extraire l'adresse du contrat" -ForegroundColor Yellow
    Write-Host "   Vérifiez la sortie ci-dessus et copiez l'adresse manuellement" -ForegroundColor Cyan
    Set-Location ..
}
