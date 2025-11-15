# 📋 Informations de Déploiement - AutoUX

## 🌐 URLs de Production

### Frontend (Vercel)
- **URL :** À compléter après déploiement
- **Dashboard :** https://vercel.com/dashboard

### Backend (Render)
- **URL :** À compléter après déploiement
- **Dashboard :** https://dashboard.render.com

---

## 🔑 Variables d'environnement requises

### Backend (Render)

| Variable | Valeur | Description |
|----------|--------|-------------|
| `NODE_ENV` | `production` | Mode de production |
| `PORT` | `10000` | Port du serveur |
| `GEMINI_API_KEY` | `[VOTRE_CLÉ]` | Clé API Google Gemini |
| `CORS_ORIGIN` | `[URL_VERCEL]` | URL du frontend |

### Frontend (Vercel)

| Variable | Valeur | Description |
|----------|--------|-------------|
| `VITE_API_BASE_URL` | `[URL_RENDER]/api` | URL de l'API backend |
| `VITE_CHAIN_NAME` | `Sepolia` | Nom du réseau blockchain |
| `VITE_CHAIN_ID` | `11155111` | ID du réseau Sepolia |
| `VITE_ETHERSCAN_URL` | `https://sepolia.etherscan.io` | URL Etherscan |

---

## 📝 Étapes de déploiement

### 1. Backend sur Render
- [ ] Créer un compte sur Render
- [ ] Créer un nouveau Web Service
- [ ] Connecter le dépôt GitHub
- [ ] Configurer les variables d'environnement
- [ ] Déployer
- [ ] Noter l'URL du backend

### 2. Frontend sur Vercel
- [ ] Créer un compte sur Vercel
- [ ] Importer le projet depuis GitHub
- [ ] Configurer les variables d'environnement
- [ ] Déployer
- [ ] Noter l'URL du frontend

### 3. Finalisation
- [ ] Mettre à jour `CORS_ORIGIN` sur Render avec l'URL Vercel
- [ ] Tester l'application en production
- [ ] Mettre à jour ce fichier avec les URLs

---

## 🔗 Liens utiles

### Documentation
- [Guide de déploiement complet](./DEPLOYMENT_GUIDE.md)
- [Guide de déploiement rapide](./QUICK_DEPLOY.md)
- [README principal](./README.md)

### Plateformes
- [Render Dashboard](https://dashboard.render.com)
- [Vercel Dashboard](https://vercel.com/dashboard)
- [Google AI Studio](https://aistudio.google.com/apikey)

### Dépôt GitHub
- [AutoUX Repository](https://github.com/Walid-Khalfa/AutoUX)

---

## 🎯 Commandes utiles

### Redéployer après modifications

```bash
# Faire vos modifications
git add .
git commit -m "feat: Nouvelle fonctionnalité"
git push

# Render et Vercel redéploient automatiquement
```

### Tester localement avant déploiement

```bash
# Backend
cd backend
npm install
npm start

# Frontend (nouveau terminal)
cd frontend
npm install
npm run build
npm run preview
```

---

## 📊 Monitoring

### Vérifier les logs

**Render :**
```
Dashboard → autoux-backend → Logs
```

**Vercel :**
```
Dashboard → autoux → Deployments → [Latest] → Logs
```

### Tester l'API

```bash
# Health check
curl https://[VOTRE_URL_RENDER]/api/health

# Devrait retourner: {"status":"ok"}
```

---

## 🆘 Support

En cas de problème :

1. Vérifier les logs sur Render/Vercel
2. Consulter [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)
3. Vérifier la console du navigateur (F12)

---

**Dernière mise à jour :** [À compléter après déploiement]
