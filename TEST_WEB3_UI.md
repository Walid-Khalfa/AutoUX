# Test de l'Interface Web3

## Comment tester le composant OnChainProof

### Étape 1: Démarrer l'application

```bash
npm run dev
```

Ouvrir http://localhost:5173

### Étape 2: Uploader des logs

1. Cliquer sur la zone "Upload Logs" ou faire un drag & drop
2. Sélectionner le fichier `test-logs.json` (à la racine du projet)
3. Attendre l'analyse (quelques secondes)

### Étape 3: Voir le composant Web3

Après l'analyse, vous devriez voir une carte violette avec:

```
🔗 On-Chain Proof                    [Badge de statut]

Privacy-first: Only the SHA-256 hash of the AI report is stored on-chain.
Your logs remain local and private.

👛 Connect your MetaMask wallet to anchor this report on the blockchain

[🦊 Connect MetaMask Wallet]

Don't have MetaMask? Install it here
```

### Étape 4: Connecter MetaMask

1. Cliquer sur "🦊 Connect MetaMask Wallet"
2. MetaMask s'ouvre automatiquement
3. Cliquer sur "Connect" dans MetaMask
4. Votre adresse wallet s'affiche: `✅ Wallet Connected: 0x1234...5678`

### Étape 5: Ancrer le hash

1. Cliquer sur "📌 Anchor Hash"
2. MetaMask demande confirmation
3. Cliquer sur "Confirm"
4. Attendre ~15 secondes
5. Message: "✅ Hash stored on-chain successfully!"

### Étape 6: Vérifier le hash

1. Cliquer sur "🔍 Verify Hash"
2. Message: "✅ Hash verified on-chain! Report is authentic."

## Si Web3 n'est pas configuré

Si vous voyez une carte grise avec "Not Configured", suivez ces étapes:

### Configuration rapide (5 minutes)

```bash
# 1. Aller dans le dossier web3
cd web3

# 2. Installer les dépendances
npm install

# 3. Créer le fichier .env
cp .env.example .env

# 4. Éditer web3/.env avec vos credentials:
# - SEPOLIA_RPC_URL (obtenir sur Alchemy.com)
# - PRIVATE_KEY (exporter depuis MetaMask)

# 5. Compiler le contrat
npm run compile

# 6. Déployer sur Sepolia
npm run deploy:sepolia

# 7. Copier l'adresse du contrat affichée

# 8. Ajouter dans frontend/.env:
VITE_REGISTRY_ADDRESS=0xADRESSE_DU_CONTRAT

# 9. Redémarrer le frontend
cd ..
npm run dev
```

## Captures d'écran attendues

### Avant connexion
- Carte violette avec gradient
- Bouton "🦊 Connect MetaMask Wallet" bien visible
- Texte explicatif sur la privacy

### Après connexion
- Badge "✅ Wallet Connected: 0x1234...5678"
- Deux boutons: "📌 Anchor Hash" et "🔍 Verify Hash"
- Status messages en temps réel

### Après anchoring
- Badge vert "✅ Verified"
- Lien vers Etherscan
- Informations sur le contrat

## Problèmes courants

### "MetaMask not found"
- Installer MetaMask: https://metamask.io/
- Rafraîchir la page

### "Wrong network"
- Ouvrir MetaMask
- Changer le réseau vers "Sepolia test network"

### "Insufficient funds"
- Obtenir du Sepolia ETH gratuit: https://sepoliafaucet.com/
- Entrer votre adresse wallet
- Attendre ~15 secondes

### Le composant n'apparaît pas
- Vérifier que vous avez uploadé des logs
- Vérifier que l'analyse est terminée
- Vérifier que `report` existe dans l'état

## Vérification visuelle

Le composant doit être:
- ✅ Visible après l'upload et l'analyse
- ✅ Placé entre le Dashboard et la liste des issues
- ✅ Avec un gradient violet/mauve attractif
- ✅ Avec des boutons clairs et explicites
- ✅ Avec des messages d'aide pour guider l'utilisateur

## Documentation complète

Pour plus de détails, voir:
- [WEB3_SETUP.md](WEB3_SETUP.md) - Guide de configuration complet
- [web3/README.md](web3/README.md) - Documentation technique
- [web3/QUICK_REFERENCE.md](web3/QUICK_REFERENCE.md) - Référence rapide
