# 🎯 Prochaines Étapes - Configuration Web3

## ✅ Ce qui est déjà fait

- ✅ Smart contract créé et compilé
- ✅ Hardhat configuré avec votre endpoint Alchemy
- ✅ Frontend Web3 intégré
- ✅ 6 fichiers de test créés
- ✅ Documentation complète

## 📝 Ce qu'il vous reste à faire (5 minutes)

### Option A : Script automatique (recommandé)

```powershell
# Exécuter le script de configuration
.\setup-web3.ps1
```

Le script va :
1. Vérifier votre configuration
2. Compiler le contrat
3. Déployer sur Sepolia
4. Configurer automatiquement le frontend

### Option B : Manuel (étape par étape)

#### 1. Ajouter votre clé privée

Ouvrir `web3/.env` et remplacer :
```env
PRIVATE_KEY=0xVOTRE_CLE_PRIVEE_ICI
```

Par votre clé privée MetaMask (commence par `0x`)

#### 2. Obtenir Sepolia ETH

Aller sur https://sepoliafaucet.com/ et obtenir ~0.5 ETH gratuit

#### 3. Compiler et déployer

```bash
cd web3
npm install
npm run compile
npm run deploy:sepolia
```

#### 4. Copier l'adresse du contrat

Vous verrez :
```
✅ AutoUXRegistry deployed to: 0x1234...5678
```

Copier cette adresse !

#### 5. Configurer le frontend

Ouvrir `frontend/.env` et ajouter :
```env
VITE_REGISTRY_ADDRESS=0xADRESSE_COPIEE
```

#### 6. Redémarrer

```bash
npm run dev
```

## 🧪 Tester

1. Ouvrir http://localhost:5173
2. Uploader `test-data/1-logs-complet.json`
3. Voir la carte violette "🔗 On-Chain Proof"
4. Cliquer "Connect Wallet"
5. Cliquer "Anchor Hash"
6. Confirmer dans MetaMask
7. ✅ Voir "Verified" !

## 📚 Documentation

- **Guide complet** : [SETUP_WEB3_GUIDE.md](SETUP_WEB3_GUIDE.md)
- **Guide Web3 FR** : [GUIDE_WEB3_FR.md](GUIDE_WEB3_FR.md)
- **Setup détaillé** : [WEB3_SETUP.md](WEB3_SETUP.md)

## 🆘 Besoin d'aide ?

Consultez [SETUP_WEB3_GUIDE.md](SETUP_WEB3_GUIDE.md) pour un guide détaillé avec captures d'écran et troubleshooting.

---

**Prêt à déployer ! 🚀**
