# ⚙️ Configuration - AutoUX

## 🔐 Variables d'Environnement

### Backend (.env)

Créez un fichier `backend/.env` avec les variables suivantes :

```env
# OpenRouter API (obligatoire pour l'analyse LLM)
OPENROUTER_API_KEY=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

# OpenRouter Configuration (optionnel, valeurs par défaut)
OPENROUTER_BASE_URL=https://openrouter.ai/api/v1
OPENROUTER_MODEL=kwaipilot/kat-coder-pro:free

# CORS (optionnel, valeur par défaut)
CORS_ORIGIN=http://localhost:5173
```

### Frontend (.env)

Créez un fichier `frontend/.env` avec :

```env
# Backend API URL (optionnel, valeur par défaut)
VITE_API_BASE_URL=http://localhost:3001/api
```

## 🧪 Vérification de la Configuration

### Test automatique

```bash
npm --prefix backend run test:config
```

**Résultat attendu** :
```
✅ OPENROUTER_API_KEY: sk-or-v1-f4dcd1622cc...
✅ OPENROUTER_BASE_URL: https://openrouter.ai/api/v1
✅ OPENROUTER_MODEL: kwaipilot/kat-coder-pro:free
✅ CORS_ORIGIN: http://localhost:5173

✅ Configuration valide ! Le backend peut démarrer.
```

### Test manuel

1. Démarrer le backend :
   ```bash
   npm --prefix backend run dev
   ```

2. Vérifier les logs :
   - ✅ Pas de message `[OpenRouter] ⚠️ Aucune clé API trouvée`
   - ✅ Message `[AutoUX Backend] Server running on http://localhost:3001`

3. Tester l'endpoint health :
   ```bash
   curl http://localhost:3001/health
   ```

## 🔑 Obtenir une Clé OpenRouter

### Option 1 : Utiliser la clé fournie (gratuite)

La clé fournie dans ce projet est déjà configurée et gratuite :
```
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
```

### Option 2 : Créer votre propre clé

1. Aller sur https://openrouter.ai/
2. Créer un compte (gratuit)
3. Aller dans "Keys" → "Create Key"
4. Copier la clé et la mettre dans `backend/.env`

### Limites du plan gratuit

- **Modèle** : kwaipilot/kat-coder-pro:free
- **Quota** : Limité (rate limit possible)
- **Fallback** : Le système bascule automatiquement sur l'analyse locale

## 🚨 Dépannage

### Erreur : "Missing credentials"

**Cause** : La clé API n'est pas chargée

**Solution** :
1. Vérifier que `backend/.env` existe
2. Vérifier que `OPENROUTER_API_KEY` est défini
3. Redémarrer le backend : `npm run dev`

### Erreur : "Cannot find module 'dotenv'"

**Cause** : Le package dotenv n'est pas installé

**Solution** :
```bash
npm --prefix backend install dotenv
```

### Warning : "Aucune clé API trouvée"

**Cause** : Le fichier `.env` n'est pas au bon endroit ou mal formaté

**Solution** :
1. Vérifier que le fichier est `backend/.env` (pas `.env` à la racine)
2. Vérifier qu'il n'y a pas d'espaces autour du `=`
3. Vérifier que la clé commence par `sk-or-v1-`

### Erreur 429 : "Rate limit exceeded"

**Cause** : Quota gratuit OpenRouter atteint

**Solution** :
- Le système bascule automatiquement sur l'analyse locale
- Badge orange "Analyse heuristique locale" s'affiche
- Attendre quelques minutes ou utiliser une autre clé

## 🔒 Sécurité

### ⚠️ IMPORTANT : Ne jamais committer les clés API

Le fichier `.env` est automatiquement ignoré par Git grâce à `.gitignore` :

```gitignore
# Environment variables - IMPORTANT: Ne jamais committer les clés API
.env
.env.local
.env.*.local
backend/.env
frontend/.env
```

### Vérification avant commit

```bash
# Vérifier que .env n'est pas tracké
git status

# Si .env apparaît, l'ajouter à .gitignore
echo "backend/.env" >> .gitignore
```

### Rotation des clés

Si une clé a été exposée :
1. Révoquer la clé sur https://openrouter.ai/
2. Générer une nouvelle clé
3. Mettre à jour `backend/.env`
4. Redémarrer le backend

## 📊 Variables par Défaut

| Variable | Valeur par défaut | Obligatoire |
|----------|-------------------|-------------|
| `OPENROUTER_API_KEY` | - | ✅ Oui |
| `OPENROUTER_BASE_URL` | `https://openrouter.ai/api/v1` | ❌ Non |
| `OPENROUTER_MODEL` | `kwaipilot/kat-coder-pro:free` | ❌ Non |
| `CORS_ORIGIN` | `http://localhost:5173` | ❌ Non |
| `VITE_API_BASE_URL` | `http://localhost:3001/api` | ❌ Non |

## 🎯 Configuration pour Production

### Backend

```env
OPENROUTER_API_KEY=sk-or-v1-VOTRE_CLE_PROD
OPENROUTER_BASE_URL=https://openrouter.ai/api/v1
OPENROUTER_MODEL=kwaipilot/kat-coder-pro:free
CORS_ORIGIN=https://votre-domaine.com
```

### Frontend

```env
VITE_API_BASE_URL=https://api.votre-domaine.com/api
```

### Variables d'environnement serveur

Pour déployer sur un serveur (Heroku, Vercel, etc.) :

1. Ajouter les variables dans le dashboard du service
2. Ne pas committer le fichier `.env`
3. Utiliser les secrets du service (GitHub Secrets, etc.)

## 📚 Ressources

- **OpenRouter** : https://openrouter.ai/
- **Documentation dotenv** : https://github.com/motdotla/dotenv
- **KAT-Coder-Pro** : https://openrouter.ai/models/kwaipilot/kat-coder-pro

---

**Dernière mise à jour** : 12 novembre 2025
