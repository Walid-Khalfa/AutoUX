# 🚀 Guide de Déploiement AutoUX

Ce guide vous accompagne pour déployer AutoUX en production :
- **Backend** sur Render (gratuit)
- **Frontend** sur Vercel (gratuit)

---

## 📋 Prérequis

1. **Compte GitHub** - Votre code doit être sur GitHub
2. **Compte Render** - Créer sur [render.com](https://render.com)
3. **Compte Vercel** - Créer sur [vercel.com](https://vercel.com)
4. **Clé API Gemini** - Obtenir sur [Google AI Studio](https://aistudio.google.com/apikey)

---

## 🔧 Partie 1 : Déploiement Backend sur Render

### Étape 1 : Préparer le dépôt

Assurez-vous que tous les fichiers sont poussés sur GitHub :

```bash
git add .
git commit -m "chore: Prepare for deployment"
git push
```

### Étape 2 : Créer le service sur Render

1. Allez sur [render.com](https://render.com) et connectez-vous
2. Cliquez sur **"New +"** → **"Web Service"**
3. Connectez votre dépôt GitHub **Walid-Khalfa/AutoUX**
4. Configurez le service :

   **Paramètres de base :**
   - **Name:** `autoux-backend`
   - **Region:** `Frankfurt (EU Central)` ou proche de vous
   - **Branch:** `main`
   - **Root Directory:** `backend`
   - **Runtime:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`

   **Plan :**
   - Sélectionnez **"Free"** (0$/mois)

### Étape 3 : Configurer les variables d'environnement

Dans la section **"Environment"**, ajoutez :

| Key | Value |
|-----|-------|
| `NODE_ENV` | `production` |
| `PORT` | `10000` |
| `GEMINI_API_KEY` | `votre_clé_api_gemini` |
| `CORS_ORIGIN` | `https://votre-app.vercel.app` (à mettre à jour après déploiement frontend) |

### Étape 4 : Déployer

1. Cliquez sur **"Create Web Service"**
2. Attendez 2-3 minutes pour le déploiement
3. Notez l'URL de votre backend : `https://autoux-backend.onrender.com`

⚠️ **Important :** Le plan gratuit de Render met le service en veille après 15 minutes d'inactivité. Le premier appel peut prendre 30-60 secondes.

---

## 🎨 Partie 2 : Déploiement Frontend sur Vercel

### Étape 1 : Créer le projet sur Vercel

1. Allez sur [vercel.com](https://vercel.com) et connectez-vous
2. Cliquez sur **"Add New..."** → **"Project"**
3. Importez votre dépôt GitHub **Walid-Khalfa/AutoUX**

### Étape 2 : Configurer le projet

**Framework Preset :** Vite

**Build & Output Settings :**
- **Build Command:** `cd frontend && npm install && npm run build`
- **Output Directory:** `frontend/dist`
- **Install Command:** `npm install`

### Étape 3 : Configurer les variables d'environnement

Dans **"Environment Variables"**, ajoutez :

| Name | Value |
|------|-------|
| `VITE_API_BASE_URL` | `https://autoux-backend.onrender.com/api` |
| `VITE_CHAIN_NAME` | `Sepolia` |
| `VITE_CHAIN_ID` | `11155111` |
| `VITE_ETHERSCAN_URL` | `https://sepolia.etherscan.io` |

*(Les variables Web3 sont optionnelles si vous n'utilisez pas la blockchain)*

### Étape 4 : Déployer

1. Cliquez sur **"Deploy"**
2. Attendez 1-2 minutes pour le build
3. Notez l'URL de votre frontend : `https://autoux.vercel.app`

---

## 🔄 Partie 3 : Finaliser la configuration

### Mettre à jour CORS sur le backend

1. Retournez sur Render
2. Allez dans votre service **autoux-backend**
3. Cliquez sur **"Environment"**
4. Modifiez `CORS_ORIGIN` avec l'URL Vercel : `https://autoux.vercel.app`
5. Sauvegardez (le service redémarrera automatiquement)

### Tester le déploiement

1. Ouvrez votre application : `https://autoux.vercel.app`
2. Uploadez un fichier de test (ex: `test-data/1-logs-complet.json`)
3. Vérifiez que l'analyse fonctionne

---

## 🔍 Vérification et Tests

### Backend (Render)

Testez l'API directement :

```bash
curl https://autoux-backend.onrender.com/api/health
```

Devrait retourner : `{"status":"ok"}`

### Frontend (Vercel)

1. Ouvrez `https://autoux.vercel.app`
2. Vérifiez que l'interface se charge
3. Testez l'upload d'un fichier
4. Vérifiez la console du navigateur (F12) pour les erreurs

---

## 🐛 Dépannage

### Backend ne répond pas

**Problème :** Erreur 503 ou timeout

**Solutions :**
1. Le service est en veille (plan gratuit) - attendez 30-60s
2. Vérifiez les logs sur Render : **Dashboard** → **Logs**
3. Vérifiez que `GEMINI_API_KEY` est correctement configurée

### Frontend ne peut pas contacter le backend

**Problème :** Erreur CORS ou Network Error

**Solutions :**
1. Vérifiez `VITE_API_BASE_URL` dans Vercel
2. Vérifiez `CORS_ORIGIN` dans Render
3. Assurez-vous que les URLs n'ont pas de `/` à la fin

### Build échoue sur Vercel

**Problème :** Build failed

**Solutions :**
1. Vérifiez les logs de build sur Vercel
2. Testez le build localement : `cd frontend && npm run build`
3. Vérifiez que toutes les dépendances sont dans `package.json`

### Gemini API ne fonctionne pas

**Problème :** Erreur 401 ou 403

**Solutions :**
1. Vérifiez que votre clé API Gemini est valide
2. Vérifiez les quotas sur [Google AI Studio](https://aistudio.google.com)
3. Assurez-vous que la clé est bien copiée (pas d'espaces)

---

## 📊 Monitoring

### Render

- **Logs en temps réel :** Dashboard → Logs
- **Métriques :** Dashboard → Metrics
- **Redémarrage :** Dashboard → Manual Deploy → Deploy latest commit

### Vercel

- **Logs de build :** Deployments → [Votre déploiement] → Build Logs
- **Logs runtime :** Deployments → [Votre déploiement] → Function Logs
- **Analytics :** Analytics (nécessite un upgrade)

---

## 🔄 Déploiements futurs

### Déploiement automatique

Les deux plateformes déploient automatiquement à chaque push sur `main` :

```bash
# Faire des modifications
git add .
git commit -m "feat: Nouvelle fonctionnalité"
git push

# Render et Vercel déploient automatiquement
```

### Déploiement manuel

**Render :**
1. Dashboard → Manual Deploy → Deploy latest commit

**Vercel :**
1. Deployments → ... → Redeploy

---

## 💰 Limites du plan gratuit

### Render (Free Tier)

- ✅ 750 heures/mois
- ✅ Déploiements illimités
- ⚠️ Service en veille après 15 min d'inactivité
- ⚠️ Redémarrage lent (30-60s)
- ⚠️ 512 MB RAM

### Vercel (Hobby)

- ✅ Déploiements illimités
- ✅ 100 GB bande passante/mois
- ✅ Pas de mise en veille
- ✅ CDN global
- ⚠️ 1 utilisateur seulement

---

## 🎯 URLs de Production

Après déploiement, notez vos URLs :

- **Frontend :** `https://autoux.vercel.app`
- **Backend :** `https://autoux-backend.onrender.com`
- **API :** `https://autoux-backend.onrender.com/api`

Mettez à jour le README avec ces URLs !

---

## 🔐 Sécurité

### Variables d'environnement

- ✅ Ne jamais commiter les fichiers `.env`
- ✅ Utiliser les variables d'environnement des plateformes
- ✅ Régénérer les clés API si exposées

### CORS

- ✅ Configurer `CORS_ORIGIN` avec l'URL exacte de Vercel
- ✅ Ne pas utiliser `*` en production

### Rate Limiting

Le backend inclut déjà un rate limiter (100 requêtes/15 min par IP).

---

## ✅ Checklist finale

- [ ] Backend déployé sur Render
- [ ] Frontend déployé sur Vercel
- [ ] Variables d'environnement configurées
- [ ] CORS configuré correctement
- [ ] Test d'upload de fichier réussi
- [ ] Clé API Gemini fonctionnelle
- [ ] URLs de production notées
- [ ] README mis à jour avec les URLs

---

## 🆘 Support

Si vous rencontrez des problèmes :

1. **Logs Render :** Vérifiez les logs du backend
2. **Console navigateur :** Vérifiez les erreurs frontend (F12)
3. **Documentation :**
   - [Render Docs](https://render.com/docs)
   - [Vercel Docs](https://vercel.com/docs)

---

**Félicitations ! 🎉 Votre application AutoUX est maintenant en production !**
