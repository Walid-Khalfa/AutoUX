# 🎨 AutoUX Frontend

Interface utilisateur React pour AutoUX - Analyse de logs UX avec visualisations interactives.

## 🚀 Démarrage rapide

### Installation

```bash
npm install
```

### Configuration

Créez un fichier `.env` :

```bash
cp .env.example .env
```

Éditez `.env` :

```env
VITE_API_BASE_URL=http://localhost:3001/api
VITE_CHAIN_NAME=Sepolia
VITE_CHAIN_ID=11155111
VITE_ETHERSCAN_URL=https://sepolia.etherscan.io
```

### Lancement

```bash
# Développement
npm run dev

# Build de production
npm run build

# Preview du build
npm run preview
```

L'application démarre sur http://localhost:5173

## 🎯 Fonctionnalités

### Upload de fichiers
- Drag & drop
- Support multi-formats (JSON, CSV, XML, HAR, etc.)
- Validation côté client

### Dashboard interactif
- Score UX animé (0-100)
- Graphiques de distribution
- Filtres par catégorie et sévérité
- Recherche d'issues

### Recommandations AI
- Prioritisées par impact
- Références WCAG 2.2
- Exemples de code

### Web3 (Optionnel)
- Connexion MetaMask
- Ancrage de hash sur Ethereum Sepolia
- Vérification de l'intégrité
- Historique on-chain

## 📁 Structure

```
frontend/
├── src/
│   ├── components/          # Composants React
│   │   ├── Dashboard.jsx    # Tableau de bord
│   │   ├── FileUploader.jsx # Upload de fichiers
│   │   ├── OnChainProof.jsx # Web3 integration
│   │   └── ...
│   ├── services/
│   │   └── api.js           # Client API
│   ├── web3/
│   │   ├── hashUtils.js     # Utilitaires crypto
│   │   └── abi*.json        # ABIs des contrats
│   ├── styles/              # CSS
│   ├── App.jsx              # Composant racine
│   └── main.jsx             # Point d'entrée
├── public/                  # Assets statiques
└── index.html               # HTML principal
```

## 🔑 Variables d'environnement

| Variable | Description | Défaut | Requis |
|----------|-------------|--------|--------|
| `VITE_API_BASE_URL` | URL de l'API backend | `http://localhost:3001/api` | ✅ |
| `VITE_REGISTRY_ADDRESS` | Adresse du contrat Registry | - | ❌ (Web3) |
| `VITE_NFT_ADDRESS` | Adresse du contrat NFT | - | ❌ (Web3) |
| `VITE_CHAIN_NAME` | Nom du réseau blockchain | `Sepolia` | ❌ (Web3) |
| `VITE_CHAIN_ID` | ID du réseau | `11155111` | ❌ (Web3) |
| `VITE_ETHERSCAN_URL` | URL Etherscan | - | ❌ (Web3) |

## 🧪 Tests

```bash
npm test
```

## 🎨 Technologies

- **React 18** - Framework UI
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **Ethers.js** - Web3 integration
- **Vitest** - Testing

## 🚀 Déploiement

### Vercel

Le frontend est configuré pour Vercel avec `vercel.json` à la racine du projet.

**Configuration :**
- Framework: Vite
- Build Command: `cd frontend && npm install && npm run build`
- Output Directory: `frontend/dist`

**Variables d'environnement requises :**
- `VITE_API_BASE_URL=[URL_BACKEND]/api`

Voir [DEPLOYMENT_GUIDE.md](../DEPLOYMENT_GUIDE.md) pour plus de détails.

## ♿ Accessibilité

L'application est conforme WCAG 2.2 AA :
- Navigation au clavier
- Labels ARIA
- Contraste des couleurs
- Support lecteurs d'écran

## 📚 Documentation

- [Guide de déploiement](../DEPLOYMENT_GUIDE.md)
- [README principal](../README.md)
