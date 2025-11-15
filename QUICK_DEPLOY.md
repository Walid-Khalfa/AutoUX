# 🚀 Déploiement Rapide - AutoUX

## 📝 Checklist avant de commencer

- [x] Code poussé sur GitHub ✅
- [ ] Compte Render créé ([render.com](https://render.com))
- [ ] Compte Vercel créé ([vercel.com](https://vercel.com))
- [ ] Clé API Gemini obtenue ([aistudio.google.com/apikey](https://aistudio.google.com/apikey))

---

## 🔧 ÉTAPE 1 : Backend sur Render (5 minutes)

### 1.1 Créer le service

1. Aller sur [render.com](https://render.com)
2. Cliquer **"New +"** → **"Web Service"**
3. Connecter GitHub et sélectionner **Walid-Khalfa/AutoUX**

### 1.2 Configuration

```
Name: autoux-backend
Region: Frankfurt (EU Central)
Branch: main
Root Directory: backend
Runtime: Node
Build Command: npm install
Start Command: npm start
Plan: Free
```

### 1.3 Variables d'environnement

Ajouter dans la section "Environment" :

```
NODE_ENV = production
PORT = 10000
GEMINI_API_KEY = [VOTRE_CLÉ_GEMINI]
CORS_ORIGIN = https://autoux.vercel.app
```

⚠️ **Note :** Vous mettrez à jour `CORS_ORIGIN` après avoir déployé le frontend

### 1.4 Déployer

- Cliquer **"Create Web Service"**
- Attendre 2-3 minutes
- Noter l'URL : `https://autoux-backend.onrender.com`

---

## 🎨 ÉTAPE 2 : Frontend sur Vercel (3 minutes)

### 2.1 Créer le projet

1. Aller sur [vercel.com](https://vercel.com)
2. Cliquer **"Add New..."** → **"Project"**
3. Importer **Walid-Khalfa/AutoUX**

### 2.2 Configuration

```
Framework Preset: Vite
Build Command: cd frontend && npm install && npm run build
Output Directory: frontend/dist
Install Command: npm install
```

### 2.3 Variables d'environnement

Ajouter dans "Environment Variables" :

```
VITE_API_BASE_URL = https://autoux-backend.onrender.com/api
VITE_CHAIN_NAME = Sepolia
VITE_CHAIN_ID = 11155111
VITE_ETHERSCAN_URL = https://sepolia.etherscan.io
```

### 2.4 Déployer

- Cliquer **"Deploy"**
- Attendre 1-2 minutes
- Noter l'URL : `https://autoux.vercel.app` (ou votre URL personnalisée)

---

## 🔄 ÉTAPE 3 : Finaliser (2 minutes)

### 3.1 Mettre à jour CORS

1. Retourner sur Render
2. Aller dans **autoux-backend** → **Environment**
3. Modifier `CORS_ORIGIN` avec votre URL Vercel exacte
4. Sauvegarder (redémarrage automatique)

### 3.2 Tester

1. Ouvrir votre app Vercel
2. Uploader `test-data/1-logs-complet.json`
3. Vérifier que l'analyse fonctionne

---

## ✅ C'est fait !

Votre application est maintenant en ligne :

- **Frontend :** https://autoux.vercel.app
- **Backend :** https://autoux-backend.onrender.com
- **API :** https://autoux-backend.onrender.com/api

---

## 🐛 Problèmes courants

### Backend ne répond pas
→ Attendez 30-60s (mise en veille du plan gratuit)

### Erreur CORS
→ Vérifiez que `CORS_ORIGIN` correspond exactement à l'URL Vercel

### Build échoue
→ Vérifiez les logs sur Vercel/Render

---

## 📚 Documentation complète

Voir [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) pour plus de détails.
