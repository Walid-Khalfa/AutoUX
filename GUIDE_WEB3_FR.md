# Guide Web3 - AutoUX (Français)

## 🎯 Objectif

Permettre aux utilisateurs d'ancrer leurs rapports d'analyse sur la blockchain Ethereum pour prouver leur authenticité, tout en gardant les logs privés.

## 📍 Où se trouve le composant ?

Le composant **On-Chain Proof** apparaît automatiquement après avoir uploadé des logs et généré un rapport.

### Position dans l'interface

```
┌─────────────────────────────────────┐
│  Header (AutoUX)                    │
└─────────────────────────────────────┘
┌─────────────────────────────────────┐
│  Upload Zone                        │
└─────────────────────────────────────┘
        ↓ Upload logs
┌─────────────────────────────────────┐
│  Dashboard (métriques)              │
└─────────────────────────────────────┘
┌─────────────────────────────────────┐
│  🔗 On-Chain Proof  ← ICI !        │
│                                     │
│  [Connect Wallet]                   │
└─────────────────────────────────────┘
┌─────────────────────────────────────┐
│  Liste des issues                   │
└─────────────────────────────────────┘
```

## 🚀 Comment l'utiliser ?

### Étape 1: Générer un rapport

1. Ouvrir http://localhost:5173
2. Cliquer sur "Upload Logs" ou faire un drag & drop
3. Sélectionner `test-logs.json`
4. Attendre l'analyse (quelques secondes)

**Résultat**: Le dashboard s'affiche avec les métriques

### Étape 2: Voir le composant Web3

Juste après le dashboard, vous verrez une **carte violette** avec:

```
┌────────────────────────────────────────────────┐
│ 🔗 On-Chain Proof          [⚠️ Not Anchored]  │
│                                                │
│ Privacy-first: Only the SHA-256 hash of the   │
│ AI report is stored on-chain. Your logs       │
│ remain local and private.                     │
│                                                │
│ 👛 Connect your MetaMask wallet to anchor     │
│    this report on the blockchain              │
│                                                │
│  ┌──────────────────────────────────┐         │
│  │ 🦊 Connect MetaMask Wallet       │         │
│  └──────────────────────────────────┘         │
│                                                │
│ Don't have MetaMask? Install it here          │
└────────────────────────────────────────────────┘
```

### Étape 3: Connecter MetaMask

1. **Cliquer sur "🦊 Connect MetaMask Wallet"**
2. Une popup MetaMask s'ouvre automatiquement
3. Cliquer sur "Connect" dans MetaMask
4. Approuver la connexion

**Résultat**: Votre adresse s'affiche

```
┌────────────────────────────────────────────────┐
│ ✅ Wallet Connected: 0x1234...5678             │
└────────────────────────────────────────────────┘
```

### Étape 4: Ancrer le hash sur la blockchain

1. **Cliquer sur "📌 Anchor Hash"**
2. MetaMask demande confirmation de la transaction
3. Vérifier les détails (gas fee ~$0.10 sur testnet)
4. Cliquer sur "Confirm"
5. Attendre ~15 secondes

**Résultat**: Message de succès

```
✅ Hash stored on-chain successfully!
View transaction on Etherscan →
```

### Étape 5: Vérifier l'authenticité

1. **Cliquer sur "🔍 Verify Hash"**
2. Le système vérifie le hash sur la blockchain

**Résultat**: Badge vert

```
┌────────────────────────────────────────────────┐
│ 🔗 On-Chain Proof          [✅ Verified]       │
└────────────────────────────────────────────────┘

✅ Hash verified on-chain! Report is authentic.
```

## 🔧 Configuration (si pas encore fait)

### Prérequis

- Node.js 18+
- MetaMask installé
- Sepolia testnet ETH (gratuit)

### Installation rapide (5 minutes)

```bash
# 1. Installer MetaMask
# Aller sur https://metamask.io/ et installer l'extension

# 2. Obtenir du Sepolia ETH (gratuit)
# Aller sur https://sepoliafaucet.com/
# Entrer votre adresse wallet
# Attendre ~15 secondes

# 3. Obtenir une clé RPC (gratuit)
# Aller sur https://www.alchemy.com/
# Créer un compte gratuit
# Créer une app "Ethereum Sepolia"
# Copier l'URL HTTPS

# 4. Configurer le projet
cd web3
npm install
cp .env.example .env

# 5. Éditer web3/.env
# Ajouter:
# SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/VOTRE_CLE
# PRIVATE_KEY=0xVOTRE_CLE_PRIVEE (exporter depuis MetaMask)

# 6. Déployer le contrat
npm run compile
npm run deploy:sepolia

# 7. Copier l'adresse du contrat affichée
# Exemple: 0x1234567890abcdef1234567890abcdef12345678

# 8. Configurer le frontend
# Éditer frontend/.env et ajouter:
# VITE_REGISTRY_ADDRESS=0xADRESSE_DU_CONTRAT

# 9. Redémarrer
cd ..
npm run dev
```

## ❓ Problèmes courants

### "Je ne vois pas le composant Web3"

**Cause**: Vous n'avez pas encore uploadé de logs

**Solution**:
1. Uploader des logs (test-logs.json)
2. Attendre l'analyse
3. Le composant apparaît après le dashboard

### "MetaMask not found"

**Cause**: MetaMask n'est pas installé

**Solution**:
1. Aller sur https://metamask.io/
2. Installer l'extension pour votre navigateur
3. Créer un wallet
4. Rafraîchir la page

### "Wrong network"

**Cause**: MetaMask n'est pas sur Sepolia

**Solution**:
1. Ouvrir MetaMask
2. Cliquer sur le réseau en haut
3. Sélectionner "Sepolia test network"
4. Si absent, activer "Show test networks" dans les paramètres

### "Insufficient funds for gas"

**Cause**: Pas assez de Sepolia ETH

**Solution**:
1. Aller sur https://sepoliafaucet.com/
2. Entrer votre adresse wallet
3. Cliquer sur "Send Me ETH"
4. Attendre ~15 secondes
5. Réessayer

### "Contract not configured"

**Cause**: Le contrat n'est pas déployé

**Solution**: Suivre la section "Configuration" ci-dessus

## 🎨 Apparence du composant

### État: Non configuré (gris)
```
┌────────────────────────────────────────────────┐
│ 🔗 On-Chain Proof          [Not Configured]   │
│                                                │
│ 🔐 Blockchain Verification Available          │
│                                                │
│ Web3 features are not configured...           │
│                                                │
│ Quick Setup:                                   │
│ 1. Deploy smart contract                      │
│ 2. Copy contract address                      │
│ 3. Restart frontend                            │
└────────────────────────────────────────────────┘
```

### État: Prêt (violet)
```
┌────────────────────────────────────────────────┐
│ 🔗 On-Chain Proof          [⚠️ Not Anchored]  │
│                                                │
│ Privacy-first: Only the SHA-256 hash...       │
│                                                │
│ [🦊 Connect MetaMask Wallet]                  │
└────────────────────────────────────────────────┘
```

### État: Connecté (violet)
```
┌────────────────────────────────────────────────┐
│ 🔗 On-Chain Proof          [⚠️ Not Anchored]  │
│                                                │
│ ✅ Wallet Connected: 0x1234...5678             │
│                                                │
│ [📌 Anchor Hash]  [🔍 Verify Hash]            │
└────────────────────────────────────────────────┘
```

### État: Vérifié (violet + badge vert)
```
┌────────────────────────────────────────────────┐
│ 🔗 On-Chain Proof          [✅ Verified]       │
│                                                │
│ ✅ Hash verified on-chain! Report is authentic│
│                                                │
│ View transaction on Etherscan →                │
│                                                │
│ Contract: 0x1234...5678 on Sepolia            │
└────────────────────────────────────────────────┘
```

## 🔒 Sécurité et confidentialité

### Ce qui est stocké sur la blockchain
- ✅ Hash SHA-256 du rapport (32 bytes)
- ✅ Adresse du wallet qui a ancré
- ✅ Timestamp de l'ancrage

### Ce qui N'est PAS stocké
- ❌ Vos logs originaux
- ❌ Le contenu du rapport
- ❌ Vos données personnelles
- ❌ Informations sensibles

### Pourquoi c'est sûr ?
- Le hash ne peut pas être inversé pour révéler les données
- Seul le hash est public, pas le contenu
- Vos logs restent sur votre machine
- Personne ne peut voir vos données

## 💰 Coûts

### Testnet (Sepolia) - GRATUIT
- Déploiement: 0 € (ETH de test gratuit)
- Anchor Hash: 0 € (ETH de test gratuit)
- Verify Hash: 0 € (lecture seule)

### Mainnet (Ethereum) - Payant
- Déploiement: ~30-100 € (une seule fois)
- Anchor Hash: ~1-5 € par rapport
- Verify Hash: 0 € (lecture seule)

**Recommandation**: Utiliser Polygon ou Arbitrum pour ~0.01 € par transaction

## 📚 Documentation complète

- **Guide de configuration**: [WEB3_SETUP.md](WEB3_SETUP.md)
- **Documentation technique**: [web3/README.md](web3/README.md)
- **Référence rapide**: [web3/QUICK_REFERENCE.md](web3/QUICK_REFERENCE.md)
- **Test de l'UI**: [TEST_WEB3_UI.md](TEST_WEB3_UI.md)

## 🎯 Résumé

1. **Uploader des logs** → Génère un rapport
2. **Voir le composant Web3** → Carte violette après le dashboard
3. **Cliquer "Connect Wallet"** → MetaMask s'ouvre
4. **Approuver la connexion** → Adresse affichée
5. **Cliquer "Anchor Hash"** → Transaction sur blockchain
6. **Attendre confirmation** → Hash stocké
7. **Cliquer "Verify Hash"** → Vérification réussie ✅

**C'est tout !** Votre rapport est maintenant prouvé authentique sur la blockchain. 🎉
