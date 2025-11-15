# 🚀 COMMENCEZ ICI - Déploiement AutoUX

## 📌 Vous êtes prêt à déployer !

Tous les fichiers de configuration sont prêts. Suivez simplement ces étapes :

---

## ✅ Étape 1 : Obtenir votre clé API Gemini (2 minutes)

1. Allez sur : https://aistudio.google.com/apikey
2. Connectez-vous avec votre compte Google
3. Cliquez sur **"Create API Key"**
4. Copiez la clé (elle ressemble à : `AIzaSy...`)
5. **Gardez cette clé à portée de main** pour l'étape 3

---

## 🔧 Étape 2 : Déployer le Backend sur Render (5 minutes)

### 2.1 Créer un compte Render

1. Allez sur : https://render.com
2. Cliquez sur **"Get Started"**
3. Inscrivez-vous avec GitHub (recommandé)

### 2.2 Créer le service

1. Sur le dashboard Render, cliquez **"New +"** en haut à droite
2. Sélectionnez **"Web Service"**
3. Cliquez **"Connect account"** pour connecter GitHub
4. Cherchez et sélectionnez votre dépôt : **Walid-Khalfa/AutoUX**
5. Cliquez **"Connect"**

### 2.3 Configurer le service

Remplissez le formulaire avec ces valeurs **EXACTES** :

```
Name: autoux-backend
Region: Frankfurt (EU Central)  [ou le plus proche de vous]
Branch: main
Root Directory: backend
Runtime: Node
Build Command: npm install
Start Command: npm start
```

Sélectionnez le plan **"Free"** (0$/mois)

### 2.4 Ajouter les variables d'environnement

Faites défiler jusqu'à **"Environment Variables"** et ajoutez :

**Variable 1 :**
```
Key: NODE_ENV
Value: production
```

**Variable 2 :**
```
Key: PORT
Value: 10000
```

**Variable 3 :**
```
Key: GEMINI_API_KEY
Value: [COLLEZ VOTRE CLÉ GEMINI ICI]
```

**Variable 4 :**
```
Key: CORS_ORIGIN
Value: https://autoux.vercel.app
```

⚠️ **Note :** Vous mettrez à jour `CORS_ORIGIN` à l'étape 4

### 2.5 Déployer

1. Cliquez sur **"Create Web Service"** en bas
2. Attendez 2-3 minutes (vous verrez les logs défiler)
3. Quand vous voyez "Live" en vert, c'est prêt ! 🎉
4. **IMPORTANT :** Copiez l'URL de votre backend (ex: `https://autoux-backend.onrender.com`)

---

## 🎨 Étape 3 : Déployer le Frontend sur Vercel (3 minutes)

### 3.1 Créer un compte Vercel

1. Allez sur : https://vercel.com
2. Cliquez sur **"Sign Up"**
3. Inscrivez-vous avec GitHub (recommandé)

### 3.2 Importer le projet

1. Sur le dashboard Vercel, cliquez **"Add New..."** → **"Project"**
2. Cherchez et sélectionnez : **Walid-Khalfa/AutoUX**
3. Cliquez **"Import"**

### 3.3 Configurer le projet

**Framework Preset :** Sélectionnez **"Vite"**

Cliquez sur **"Build and Output Settings"** et modifiez :

```
Build Command: cd frontend && npm install && npm run build
Output Directory: frontend/dist
Install Command: npm install
```

### 3.4 Ajouter les variables d'environnement

Cliquez sur **"Environment Variables"** et ajoutez :

**Variable 1 :**
```
Name: VITE_API_BASE_URL
Value: [VOTRE_URL_RENDER]/api
```
⚠️ Remplacez `[VOTRE_URL_RENDER]` par l'URL copiée à l'étape 2.5
Exemple : `https://autoux-backend.onrender.com/api`

**Variable 2 :**
```
Name: VITE_CHAIN_NAME
Value: Sepolia
```

**Variable 3 :**
```
Name: VITE_CHAIN_ID
Value: 11155111
```

**Variable 4 :**
```
Name: VITE_ETHERSCAN_URL
Value: https://sepolia.etherscan.io
```

### 3.5 Déployer

1. Cliquez sur **"Deploy"**
2. Attendez 1-2 minutes
3. Quand vous voyez "Congratulations", c'est prêt ! 🎉
4. **IMPORTANT :** Copiez l'URL de votre frontend (ex: `https://autoux.vercel.app`)

---

## 🔄 Étape 4 : Finaliser la configuration (2 minutes)

### 4.1 Mettre à jour CORS sur Render

1. Retournez sur Render : https://dashboard.render.com
2. Cliquez sur votre service **autoux-backend**
3. Dans le menu de gauche, cliquez sur **"Environment"**
4. Trouvez la variable `CORS_ORIGIN`
5. Cliquez sur l'icône crayon pour éditer
6. Remplacez la valeur par votre URL Vercel **EXACTE** (celle copiée à l'étape 3.5)
   Exemple : `https://autoux.vercel.app`
7. Cliquez **"Save Changes"**
8. Le service va redémarrer automatiquement (attendez 30 secondes)

---

## 🎯 Étape 5 : Tester votre application (2 minutes)

### 5.1 Ouvrir l'application

1. Ouvrez votre URL Vercel dans un navigateur
2. Vous devriez voir l'interface AutoUX

### 5.2 Tester l'analyse

1. Cliquez sur la zone d'upload ou glissez un fichier
2. Utilisez un fichier de test : `test-data/1-logs-complet.json`
3. Attendez 5-10 secondes
4. Vous devriez voir :
   - Le score UX
   - La liste des problèmes détectés
   - Les recommandations

⚠️ **Premier appel lent ?** C'est normal ! Le backend Render se réveille (plan gratuit). Attendez 30-60 secondes.

### 5.3 Vérifier la console

1. Appuyez sur **F12** pour ouvrir les outils développeur
2. Allez dans l'onglet **"Console"**
3. Vérifiez qu'il n'y a pas d'erreurs rouges

---

## ✅ C'EST FAIT ! 🎉

Votre application AutoUX est maintenant en ligne !

### Vos URLs :

- **Application :** [Votre URL Vercel]
- **API :** [Votre URL Render]/api

### Prochaines étapes :

1. Mettez à jour le fichier `DEPLOYMENT_INFO.md` avec vos URLs
2. Partagez votre application !
3. Consultez les logs si besoin :
   - Render : https://dashboard.render.com
   - Vercel : https://vercel.com/dashboard

---

## 🐛 Problèmes ?

### Le backend ne répond pas
→ **Solution :** Attendez 30-60 secondes (mise en veille du plan gratuit)

### Erreur "Network Error" ou CORS
→ **Solution :** Vérifiez que `CORS_ORIGIN` sur Render correspond EXACTEMENT à votre URL Vercel

### Erreur "Gemini API"
→ **Solution :** Vérifiez que votre clé API Gemini est correcte dans les variables Render

### Build échoue
→ **Solution :** Vérifiez les logs sur Vercel/Render et consultez [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)

---

## 📚 Documentation

- **Guide complet :** [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)
- **Guide rapide :** [QUICK_DEPLOY.md](./QUICK_DEPLOY.md)
- **Informations :** [DEPLOYMENT_INFO.md](./DEPLOYMENT_INFO.md)

---

**Bon déploiement ! 🚀**
