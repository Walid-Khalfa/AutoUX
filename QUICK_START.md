# ⚡ Quick Start - AutoUX

## 🚀 Installation (1 minute)

```bash
# Cloner le projet
git clone <repo-url>
cd AutoUX

# Installer toutes les dépendances (backend + frontend)
npm install
```

## 🎯 Démarrage (30 secondes)

```bash
# Lancer backend + frontend simultanément
npm run dev
```

**Résultat** :
- ✅ Backend sur http://localhost:3001
- ✅ Frontend sur http://localhost:5173

## 📁 Test Rapide (2 minutes)

1. Ouvrir http://localhost:5173
2. Glisser-déposer `test-logs.json` dans la zone d'upload
3. Attendre 2-3 secondes (analyse LLM)
4. Explorer le dashboard et les issues

## 🧪 Tests

```bash
# Tests backend (43 tests)
npm --prefix backend test

# Tests frontend (24 tests)
npm --prefix frontend test

# Tous les tests
npm test
```

## 📊 Endpoints API

### GET /health
```bash
curl http://localhost:3001/health
```

### GET /api/issues
```bash
curl http://localhost:3001/api/issues
```

### POST /api/upload
```bash
curl -X POST http://localhost:3001/api/upload \
  -F "files=@test-logs.json"
```

## 🔧 Configuration

### Variables d'environnement (.env)
```env
OPENROUTER_API_KEY=sk-or-v1-...
OPENROUTER_BASE_URL=https://openrouter.ai/api/v1
OPENROUTER_MODEL=kwaipilot/kat-coder-pro:free
CORS_ORIGIN=http://localhost:5173
```

### Ports
- Backend : `3001` (configurable dans `backend/src/config/server.js`)
- Frontend : `5173` (configurable dans `frontend/vite.config.js`)

## 📝 Formats de Logs Supportés

| Format | Extension | Exemple |
|--------|-----------|---------|
| JSON | `.json` | `[{"id":"log-1",...}]` |
| NDJSON | `.ndjson`, `.jsonl` | `{"id":"log-1",...}\n{"id":"log-2",...}` |
| CSV | `.csv` | `id,timestamp,type,message\nlog-1,...` |
| XML | `.xml` | `<logs><log id="log-1">...</log></logs>` |
| HTML | `.html`, `.htm` | Rapport Lighthouse, axe-core |
| HAR | `.har` | Chrome DevTools Network export |
| TXT | `.txt` | Logs bruts ligne par ligne |
| LOG | `.log` | Logs serveur (NDJSON ou TXT) |

## 🎨 Structure du Projet

```
AutoUX/
├── backend/           # API Express
│   ├── src/
│   │   ├── llm/      # Client OpenRouter
│   │   ├── services/ # Logique métier
│   │   ├── routes/   # Endpoints API
│   │   └── server.js # Point d'entrée
│   └── package.json
├── frontend/          # Interface React
│   ├── src/
│   │   ├── components/ # Composants UI
│   │   ├── services/   # API client
│   │   └── App.jsx     # Composant racine
│   └── package.json
├── data/              # Données locales
│   ├── logs.json      # Logs d'exemple
│   └── fixspecs/      # Fixspecs générés
├── tmp/               # Uploads temporaires
├── test-logs.json     # Fichier de test
└── README.md
```

## 🐛 Dépannage

### Backend ne démarre pas
```bash
# Vérifier que le port 3001 est libre
netstat -ano | findstr :3001

# Tuer le processus si nécessaire
taskkill /PID <PID> /F
```

### Frontend ne charge pas
```bash
# Vérifier que le port 5173 est libre
netstat -ano | findstr :5173

# Nettoyer le cache Vite
cd frontend
rm -rf node_modules/.vite
npm run dev
```

### Upload échoue
- Vérifier que le dossier `tmp/` existe
- Vérifier la taille du fichier (< 25MB)
- Vérifier le format (extensions supportées)
- Consulter les logs backend dans la console

### LLM timeout
- Normal si quota gratuit atteint
- Le système bascule automatiquement sur l'analyse locale
- Badge orange "Analyse heuristique locale" s'affiche

## 📚 Documentation

- **README.md** : Documentation complète
- **DEMO_GUIDE.md** : Script de démo pour hackathon
- **UI_UX_IMPROVEMENTS.md** : Détails des améliorations UI/UX
- **FINAL_CHECKLIST.md** : Checklist de vérification
- **SUMMARY.md** : Résumé complet du projet

## 🎯 Commandes Utiles

```bash
# Démarrage
npm run dev              # Backend + Frontend
npm --prefix backend dev # Backend seul
npm --prefix frontend dev # Frontend seul

# Tests
npm test                 # Tous les tests
npm --prefix backend test # Tests backend
npm --prefix frontend test # Tests frontend

# Build
npm run build            # Build frontend
npm --prefix frontend build

# Nettoyage
rm -rf node_modules frontend/node_modules backend/node_modules
rm -rf tmp/*
rm -rf data/fixspecs/*.json
```

## 🔍 Logs et Debugging

### Backend
```bash
# Logs KIRO-AI dans la console
[KIRO-AI] Parsed test-logs.json: 4/4 valid entries
[KIRO-AI] LLM analysis complete: 4 issues detected
[KIRO-AI] Fixspec créé: issue-123.json
```

### Frontend
```bash
# Logs dans la console navigateur
Erreur 500, nouvelle tentative... (2 restantes)
Erreur réseau, nouvelle tentative... (2 restantes)
```

## 🎬 Démo Rapide (5 minutes)

1. **Démarrer** : `npm run dev`
2. **Ouvrir** : http://localhost:5173
3. **Upload** : Glisser `test-logs.json`
4. **Dashboard** : Observer les statistiques
5. **Filtrer** : Cliquer sur "Latence (2)"
6. **Détails** : Cliquer sur une issue
7. **Export** : Télécharger le rapport JSON

## 💡 Astuces

- **Zoom** : Mettre le navigateur à 110% pour la démo
- **Fichiers** : Préparer plusieurs fichiers de test (JSON, CSV, HAR)
- **Timing** : Laisser 2-3 secondes entre chaque action
- **Fallback** : Montrer le badge orange si quota LLM atteint
- **Export** : Ouvrir le JSON téléchargé pour montrer la structure

## 🏆 Checklist Démo

- [ ] Backend démarré (port 3001)
- [ ] Frontend démarré (port 5173)
- [ ] Fichier `test-logs.json` prêt
- [ ] Navigateur propre (pas d'onglets inutiles)
- [ ] Console backend visible (logs KIRO-AI)
- [ ] Zoom navigateur à 110%
- [ ] Script de démo lu (DEMO_GUIDE.md)

---

**Prêt à démarrer ! 🚀**
