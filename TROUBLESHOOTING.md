# 🔧 Dépannage - AutoUX

## 🚨 Problèmes Courants

### 1. Erreur "Missing credentials" (OpenRouter)

**Symptôme** :
```
OpenAIError: Missing credentials. Please pass an `apiKey`...
```

**Cause** : La clé API n'est pas chargée

**Solution** :
```bash
# 1. Vérifier que backend/.env existe
cat backend/.env

# 2. Vérifier la configuration
npm --prefix backend run test:config

# 3. Si la clé est absente, créer backend/.env :
echo "OPENROUTER_API_KEY=sk-or-v1-..." > backend/.env
```

### 2. Erreur "Port already in use" (EADDRINUSE)

**Symptôme** :
```
Error: listen EADDRINUSE: address already in use :::3001
Error: Port 5173 is already in use
```

**Cause** : Les ports 3001 ou 5173 sont déjà utilisés

**Solution Rapide** :
```powershell
# Utiliser le script de nettoyage
powershell -ExecutionPolicy Bypass -File kill-ports.ps1
```

**Solution Manuelle** :
```powershell
# Tuer tous les processus Node.js
Get-Process -Name node | Stop-Process -Force

# Vérifier les ports
Get-NetTCPConnection -LocalPort 3001
Get-NetTCPConnection -LocalPort 5173
```

### 3. Frontend ne charge pas

**Symptôme** :
```
Cannot GET /
Page blanche
```

**Cause** : Le frontend n'est pas démarré ou le port est bloqué

**Solution** :
```bash
# 1. Libérer le port
powershell -ExecutionPolicy Bypass -File kill-ports.ps1

# 2. Redémarrer
npm run dev
```

### 4. Backend crash au démarrage

**Symptôme** :
```
[nodemon] app crashed - waiting for file changes...
```

**Causes possibles** :
1. Clé API manquante
2. Port déjà utilisé
3. Erreur de syntaxe

**Solution** :
```bash
# 1. Vérifier la configuration
npm --prefix backend run test:config

# 2. Vérifier les logs
# Lire le message d'erreur complet

# 3. Tester le backend seul
npm --prefix backend run dev
```

### 5. Upload échoue

**Symptôme** :
```
Impossible d'analyser les fichiers
Error 500
```

**Causes possibles** :
1. Fichier trop volumineux (> 25MB)
2. Format non supporté
3. LLM indisponible

**Solution** :
```bash
# 1. Vérifier la taille du fichier
# Max 25MB par fichier

# 2. Vérifier le format
# Supportés: JSON, NDJSON, CSV, XML, HTML, HAR, TXT, LOG

# 3. Vérifier les logs backend
# Chercher [KIRO-AI] dans la console
```

### 6. LLM ne répond pas

**Symptôme** :
```
Badge orange "Rapport local (LLM indisponible)"
```

**Causes possibles** :
1. Quota gratuit atteint
2. Clé API invalide
3. Service OpenRouter down

**Solution** :
```bash
# 1. Vérifier la clé
npm --prefix backend run test:config

# 2. Attendre quelques minutes (quota)

# 3. Utiliser le fallback local
# L'application fonctionne quand même
```

## 🔍 Commandes de Diagnostic

### Vérifier la configuration
```bash
npm --prefix backend run test:config
```

**Résultat attendu** :
```
✅ OPENROUTER_API_KEY: sk-or-v1-f4dcd1622cc...
✅ OPENROUTER_BASE_URL: https://openrouter.ai/api/v1
✅ OPENROUTER_MODEL: kwaipilot/kat-coder-pro:free
✅ CORS_ORIGIN: http://localhost:5173
✅ Configuration valide !
```

### Vérifier les ports
```powershell
# Port 3001 (backend)
Get-NetTCPConnection -LocalPort 3001

# Port 5173 (frontend)
Get-NetTCPConnection -LocalPort 5173
```

### Vérifier les processus Node.js
```powershell
Get-Process -Name node
```

### Tester le backend seul
```bash
npm --prefix backend run dev
```

**Résultat attendu** :
```
[AutoUX Backend] Server running on http://localhost:3001
[AutoUX Backend] Health check: http://localhost:3001/health
```

### Tester le frontend seul
```bash
npm --prefix frontend run dev
```

**Résultat attendu** :
```
VITE v5.4.2  ready in 500 ms
➜  Local:   http://localhost:5173/
```

### Tester l'API
```bash
# Health check
curl http://localhost:3001/health

# Issues (doit retourner vide)
curl http://localhost:3001/api/issues
```

## 🧪 Tests

### Test complet
```bash
# 1. Nettoyer les ports
powershell -ExecutionPolicy Bypass -File kill-ports.ps1

# 2. Vérifier la config
npm --prefix backend run test:config

# 3. Lancer l'application
npm run dev

# 4. Ouvrir http://localhost:5173

# 5. Uploader test-logs.json
```

### Test backend uniquement
```bash
# 1. Démarrer backend
npm --prefix backend run dev

# 2. Tester health
curl http://localhost:3001/health

# 3. Tester upload
curl -X POST http://localhost:3001/api/upload -F "files=@test-logs.json"
```

## 📝 Logs Utiles

### Backend
```
[KIRO-AI] Processing X file(s)...
[KIRO-AI] Parsed X log entries
[KIRO-AI] Attempting LLM analysis with KAT-Coder-Pro...
[KIRO-AI] ✅ LLM analysis complete: X issues detected
```

### Frontend
```
Erreur 500, nouvelle tentative... (2 restantes)
Erreur réseau, nouvelle tentative... (2 restantes)
```

### OpenRouter
```
[OpenRouter] ⚠️ Aucune clé API trouvée...
[OpenRouter] Quota ou indisponibilité — fallback local utilisé.
```

## 🔄 Redémarrage Propre

```bash
# 1. Arrêter tout
Ctrl+C (dans le terminal npm run dev)

# 2. Nettoyer les ports
powershell -ExecutionPolicy Bypass -File kill-ports.ps1

# 3. Vérifier la config
npm --prefix backend run test:config

# 4. Redémarrer
npm run dev
```

## 🆘 Aide Supplémentaire

### Fichiers de documentation
- `README.md` - Documentation générale
- `CONFIGURATION.md` - Configuration détaillée
- `FIXES_APPLIED.md` - Corrections appliquées
- `LLM_ONLY_MODE.md` - Mode LLM uniquement
- `QUICK_START.md` - Démarrage rapide

### Scripts utiles
- `npm run dev` - Démarrer backend + frontend
- `npm test` - Lancer tous les tests
- `npm --prefix backend run test:config` - Vérifier la config
- `powershell -ExecutionPolicy Bypass -File kill-ports.ps1` - Nettoyer les ports

### Logs à consulter
1. Console backend (terminal)
2. Console frontend (terminal)
3. Console navigateur (F12)

---

**Dernière mise à jour** : 12 novembre 2025
