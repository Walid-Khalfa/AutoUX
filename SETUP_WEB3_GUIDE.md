# 🚀 Guide de Configuration Web3 - AutoUX

## ✅ Ce qui est déjà fait

- ✅ Smart contract `AutoUXRegistry.sol` créé
- ✅ Hardhat configuré
- ✅ Script de déploiement prêt
- ✅ Frontend Web3 intégré
- ✅ Endpoint Alchemy configuré

## 📝 Ce qu'il vous reste à faire

### Étape 1 : Ajouter votre clé privée MetaMask

1. **Ouvrir MetaMask**
2. **Cliquer sur les 3 points** (⋮) à côté de votre compte
3. **Sélectionner "Account Details"**
4. **Cliquer sur "Export Private Key"**
5. **Entrer votre mot de passe MetaMask**
6. **Copier la clé privée** (commence par `0x`)

7. **Ouvrir le fichier** `web3/.env`
8. **Remplacer** `0xVOTRE_CLE_PRIVEE_ICI` par votre clé privée

Exemple :
```env
PRIVATE_KEY=0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef
```

⚠️ **IMPORTANT** : Ne partagez JAMAIS cette clé ! Elle donne accès à votre wallet.

---

### Étape 2 : Obtenir du Sepolia ETH (gratuit)

Vous avez besoin de Sepolia ETH pour déployer le contrat.

1. **Aller sur** : https://sepoliafaucet.com/
2. **Entrer votre adresse wallet** (depuis MetaMask)
3. **Cliquer sur "Send Me ETH"**
4. **Attendre ~15 secondes**

Vérifiez dans MetaMask (réseau Sepolia) que vous avez reçu ~0.5 ETH.

---

### Étape 3 : Compiler le smart contract

```bash
cd web3
npm install
npm run compile
```

Vous devriez voir :
```
Compiled 1 Solidity file successfully
```

---

### Étape 4 : Déployer le contrat sur Sepolia

```bash
npm run deploy:sepolia
```

Vous devriez voir :
```
🚀 Deploying AutoUXRegistry to Sepolia...
📝 Deploying contract...
✅ AutoUXRegistry deployed to: 0x1234567890abcdef1234567890abcdef12345678

📋 Next steps:
1. Copy the contract address above
2. Update frontend/.env with:
   VITE_REGISTRY_ADDRESS=0x1234567890abcdef1234567890abcdef12345678
```

**⚠️ IMPORTANT** : Copiez l'adresse du contrat (le `0x...`)

---

### Étape 5 : Configurer le frontend

1. **Ouvrir** `frontend/.env`
2. **Remplacer** la ligne `VITE_REGISTRY_ADDRESS=` par :

```env
VITE_REGISTRY_ADDRESS=0xADRESSE_COPIEE_ETAPE_4
```

Exemple :
```env
VITE_REGISTRY_ADDRESS=0x1234567890abcdef1234567890abcdef12345678
```

---

### Étape 6 : Redémarrer l'application

```bash
# Arrêter l'application (Ctrl+C)
# Puis redémarrer
npm run dev
```

---

### Étape 7 : Tester Web3

1. **Ouvrir** http://localhost:5173
2. **Uploader** un fichier de test (ex: `test-data/1-logs-complet.json`)
3. **Attendre** l'analyse
4. **Voir** la carte violette "🔗 On-Chain Proof"
5. **Cliquer** sur "🦊 Connect MetaMask Wallet"
6. **Approuver** la connexion dans MetaMask
7. **Cliquer** sur "📌 Anchor Hash"
8. **Confirmer** la transaction dans MetaMask
9. **Attendre** ~15 secondes
10. **Cliquer** sur "🔍 Verify Hash"
11. ✅ **Voir** le badge "Verified" !

---

## 🎯 Résumé des commandes

```bash
# 1. Configurer web3/.env avec votre clé privée
# 2. Obtenir Sepolia ETH sur https://sepoliafaucet.com/

# 3. Compiler et déployer
cd web3
npm install
npm run compile
npm run deploy:sepolia

# 4. Copier l'adresse du contrat dans frontend/.env

# 5. Redémarrer l'application
cd ..
npm run dev

# 6. Tester sur http://localhost:5173
```

---

## 📁 Structure des fichiers

```
AutoUX/
├── web3/
│   ├── .env                    ← Votre clé privée + Alchemy
│   ├── contracts/
│   │   └── AutoUXRegistry.sol  ← Smart contract
│   ├── scripts/
│   │   └── deploy.js           ← Script de déploiement
│   └── hardhat.config.js       ← Configuration Hardhat
│
├── frontend/
│   ├── .env                    ← Adresse du contrat déployé
│   └── src/
│       ├── components/
│       │   └── OnChainProof.jsx ← Composant Web3
│       └── web3/
│           ├── abiAutoUXRegistry.json
│           ├── hashUtils.js
│           └── ipfs.js
│
└── test-data/                  ← 6 fichiers JSON de test
```

---

## 🐛 Problèmes courants

### "Insufficient funds for gas"
**Solution** : Obtenir plus de Sepolia ETH sur https://sepoliafaucet.com/

### "Invalid private key"
**Solution** : Vérifier que la clé commence par `0x` et fait 66 caractères

### "Network error"
**Solution** : Vérifier que l'endpoint Alchemy est correct dans `web3/.env`

### "Contract not configured"
**Solution** : Vérifier que `VITE_REGISTRY_ADDRESS` est défini dans `frontend/.env`

---

## 📚 Documentation complète

- **Guide Web3 FR** : [GUIDE_WEB3_FR.md](GUIDE_WEB3_FR.md)
- **Setup détaillé** : [WEB3_SETUP.md](WEB3_SETUP.md)
- **Guide de test** : [GUIDE_TEST.md](GUIDE_TEST.md)
- **Fichiers de test** : [test-data/README.md](test-data/README.md)

---

## ✅ Checklist finale

- [ ] Clé privée ajoutée dans `web3/.env`
- [ ] Sepolia ETH obtenu (> 0.1 ETH)
- [ ] Contrat compilé (`npm run compile`)
- [ ] Contrat déployé (`npm run deploy:sepolia`)
- [ ] Adresse du contrat copiée
- [ ] `frontend/.env` mis à jour avec l'adresse
- [ ] Application redémarrée
- [ ] Test réussi (upload → connect → anchor → verify)

---

**Besoin d'aide ?** Consultez [WEB3_SETUP.md](WEB3_SETUP.md) pour plus de détails ! 🚀
