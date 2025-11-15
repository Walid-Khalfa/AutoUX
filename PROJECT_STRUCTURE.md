# 📁 Structure du projet AutoUX

## 🌳 Arborescence complète

```
autoux/
├── 📄 README.md                          # Documentation principale
├── 📄 package.json                       # Configuration npm racine (workspaces)
├── 📄 package-lock.json                  # Lock file npm
│
├── 📚 Documentation (nouveaux fichiers)
│   ├── 📄 UI_IMPROVEMENTS.md             # Guide des améliorations UI/UX
│   ├── 📄 HACKATHON_PITCH.md             # Pitch complet pour hackathon
│   ├── 📄 COMPONENTS.md                  # Documentation technique des composants
│   ├── 📄 SUMMARY.md                     # Récapitulatif visuel des améliorations
│   ├── 📄 DEMO_CHECKLIST.md              # Checklist pour la démo
│   ├── 📄 CHANGELOG_UI.md                # Changelog des améliorations UI
│   ├── 📄 JURY_PRESENTATION.md           # Présentation pour le jury
│   └── 📄 PROJECT_STRUCTURE.md           # Ce fichier
│
├── 📂 .kiro/                             # Configuration Kiro
│   └── 📂 specs/
│       └── 📂 autoux/
│           ├── 📄 requirements.md        # Exigences fonctionnelles (EARS + INCOSE)
│           ├── 📄 design.md              # Architecture et design technique
│           └── 📄 tasks.md               # Plan d'implémentation (14 tâches)
│
├── 📂 backend/                           # Serveur Node.js/Express
│   ├── 📄 package.json                   # Dépendances backend
│   ├── 📄 package-lock.json              # Lock file backend
│   ├── 📄 jest.config.js                 # Configuration Jest
│   │
│   └── 📂 src/
│       ├── 📄 server.js                  # Point d'entrée Express
│       │
│       ├── 📂 config/
│       │   ├── 📄 paths.js               # Résolution de chemins absolus
│       │   └── 📄 server.js              # Configuration CORS et sécurité
│       │
│       ├── 📂 schemas/
│       │   ├── 📄 index.js               # Schémas Zod (LogEntry, Issue, Fixspec)
│       │   └── 📂 __tests__/
│       │       └── 📄 validation.test.js # Tests de validation Zod
│       │
│       ├── 📂 services/
│       │   ├── 📄 logSource.js           # Lecture des logs avec hot-reload
│       │   ├── 📄 util.js                # Utilitaires (uid, latencyToSeverity)
│       │   ├── 📄 issueAnalyzer.js       # Détection des issues UX
│       │   ├── 📄 fixspecGenerator.js    # Génération de fixspecs
│       │   │
│       │   └── 📂 __tests__/
│       │       ├── 📄 util.test.js       # Tests des utilitaires
│       │       ├── 📄 issueAnalyzer.test.js  # Tests des analyseurs
│       │       └── 📄 fixspecGenerator.test.js  # Tests du générateur
│       │
│       ├── 📂 routes/
│       │   └── 📄 issues.js              # Routes API (/api/issues, /api/fixspecs)
│       │
│       └── 📂 __tests__/
│           └── 📄 e2e-hotreload.test.js  # Tests E2E hot-reload
│
├── 📂 frontend/                          # Application React
│   ├── 📄 package.json                   # Dépendances frontend
│   ├── 📄 package-lock.json              # Lock file frontend
│   ├── 📄 vite.config.js                 # Configuration Vite
│   ├── 📄 vitest.config.js               # Configuration Vitest
│   ├── 📄 index.html                     # Point d'entrée HTML
│   ├── 📄 .env                           # Variables d'environnement (optionnel)
│   │
│   ├── 📂 dist/                          # Build de production
│   │   ├── 📄 index.html
│   │   └── 📂 assets/
│   │       └── 📄 index-*.js
│   │
│   └── 📂 src/
│       ├── 📄 main.jsx                   # Point d'entrée React
│       ├── 📄 App.jsx                    # Composant racine
│       ├── 📄 index.css                  # Styles globaux (nouveau)
│       │
│       ├── 📂 components/
│       │   ├── 📄 Dashboard.jsx          # Dashboard avec métriques (nouveau)
│       │   ├── 📄 CategoryFilter.jsx     # Filtres dynamiques (amélioré)
│       │   ├── 📄 IssueList.jsx          # Liste des issues (amélioré)
│       │   ├── 📄 IssueDetail.jsx        # Détails d'une issue (amélioré)
│       │   ├── 📄 ErrorBoundary.jsx      # Gestion d'erreurs React
│       │   │
│       │   └── 📂 __tests__/
│       │       ├── 📄 IssueList.test.jsx     # Tests IssueList
│       │       └── 📄 IssueDetail.test.jsx   # Tests IssueDetail
│       │
│       ├── 📂 services/
│       │   ├── 📄 api.js                 # Service API (fetch avec retry)
│       │   │
│       │   └── 📂 __tests__/
│       │       └── 📄 api.test.js        # Tests du service API
│       │
│       └── 📂 test/
│           └── 📄 setup.js               # Configuration des tests
│
├── 📂 data/                              # Données locales
│   ├── 📄 logs.json                      # Logs d'entrée (5-7 exemples)
│   │
│   └── 📂 fixspecs/                      # Fixspecs générés
│       ├── 📄 .gitkeep
│       └── 📄 issue-*.json               # Fixspecs (générés automatiquement)
│
└── 📂 specs/                             # Spécifications techniques
    ├── 📄 autoux_spec.json               # Spécification complète du projet
    └── 📄 openapi.json                   # Documentation OpenAPI 3.1 (bonus)
```

---

## 📊 Statistiques

### Fichiers par catégorie

| Catégorie | Nombre | Détails |
|-----------|--------|---------|
| **Documentation** | 8 | README + 7 guides |
| **Backend** | 13 | 8 sources + 5 tests |
| **Frontend** | 14 | 9 sources + 5 tests |
| **Configuration** | 8 | package.json, configs |
| **Données** | 2 | logs.json + fixspecs/ |
| **Specs** | 5 | requirements, design, tasks, spec, openapi |
| **Total** | **50** | Fichiers du projet |

### Lignes de code

| Catégorie | Lignes | Pourcentage |
|-----------|--------|-------------|
| **Backend** | ~1500 | 35% |
| **Frontend** | ~2000 | 45% |
| **Tests** | ~1000 | 20% |
| **Total code** | **~4500** | 100% |
| **Documentation** | ~3000 | (hors code) |

### Tests

| Type | Nombre | Fichiers |
|------|--------|----------|
| **Backend (Jest)** | 43 | 4 fichiers |
| **Frontend (Vitest)** | 24 | 3 fichiers |
| **E2E** | 2 | 1 fichier |
| **Total** | **69** | 8 fichiers |

---

## 🎨 Composants Frontend

### Hiérarchie des composants

```
App.jsx (racine)
├── ErrorBoundary.jsx
│   ├── Header (inline)
│   ├── Dashboard.jsx
│   │   └── 5 cartes métriques
│   ├── CategoryFilter.jsx
│   │   └── 5 boutons de filtre
│   ├── IssueList.jsx
│   │   └── N catégories
│   │       └── M issues par catégorie
│   └── IssueDetail.jsx (conditionnel)
│       ├── En-tête (type + sévérité)
│       ├── Description
│       ├── Informations
│       ├── Métadonnées
│       └── Fixspec
│           ├── Résumé
│           ├── Étapes
│           ├── Code
│           └── Références
```

### Props flow

```
App
├── issues: Issue[] (état)
├── loading: boolean (état)
├── error: string | null (état)
├── selectedCategory: string (état)
└── selectedIssue: Issue | null (état)

Dashboard
└── issues: Issue[] (prop)

CategoryFilter
├── issues: Issue[] (prop)
├── selectedCategory: string (prop)
└── onSelectCategory: (id: string) => void (prop)

IssueList
├── issues: Issue[] (prop)
├── loading: boolean (prop)
└── onSelectIssue: (issue: Issue) => void (prop)

IssueDetail
└── issue: Issue | null (prop)
```

---

## 🔧 Services Backend

### Architecture

```
server.js (Express)
├── config/
│   ├── paths.js (chemins absolus)
│   └── server.js (CORS, sécurité)
├── schemas/
│   └── index.js (Zod validation)
├── services/
│   ├── logSource.js (lecture logs)
│   ├── util.js (utilitaires)
│   ├── issueAnalyzer.js (détection)
│   └── fixspecGenerator.js (génération)
└── routes/
    └── issues.js (API REST)
```

### Flow de données

```
1. Client → GET /api/issues
2. routes/issues.js → readLogs()
3. logSource.js → Lit data/logs.json (avec cache)
4. routes/issues.js → analyzeLogs(logs)
5. issueAnalyzer.js → Détecte les issues
6. issueAnalyzer.js → generateFixspec(issue)
7. fixspecGenerator.js → Génère le fixspec
8. fixspecGenerator.js → saveFixspecOnce(fixspec)
9. routes/issues.js → Retourne { issues, count }
10. Client ← JSON response
```

---

## 📦 Dépendances

### Backend (package.json)

```json
{
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "zod": "^3.22.4"
  },
  "devDependencies": {
    "nodemon": "^3.0.1",
    "jest": "^29.7.0",
    "@jest/globals": "^29.7.0"
  }
}
```

### Frontend (package.json)

```json
{
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.3.1",
    "vite": "^5.4.2",
    "vitest": "^4.0.8",
    "@testing-library/react": "^latest",
    "@testing-library/jest-dom": "^latest",
    "@testing-library/user-event": "^latest",
    "jsdom": "^latest"
  }
}
```

### Racine (package.json)

```json
{
  "devDependencies": {
    "concurrently": "^8.2.2"
  },
  "workspaces": [
    "frontend",
    "backend"
  ]
}
```

---

## 🎯 Points d'entrée

### Développement

```bash
# Racine (démarre frontend + backend)
npm run dev

# Backend seul
npm --prefix backend run dev
# → http://localhost:3001

# Frontend seul
npm --prefix frontend run dev
# → http://localhost:5173
```

### Production

```bash
# Build frontend
npm --prefix frontend run build
# → frontend/dist/

# Démarrer backend
npm --prefix backend start
# → http://localhost:3001

# Servir frontend (avec serveur statique)
npm --prefix frontend run preview
# → http://localhost:4173
```

### Tests

```bash
# Tous les tests
npm test

# Backend seul
npm run test:backend
# → Jest (43 tests)

# Frontend seul
npm run test:frontend
# → Vitest (24 tests)
```

---

## 🔍 Fichiers clés

### Configuration

| Fichier | Rôle |
|---------|------|
| `package.json` (racine) | Workspaces npm, scripts concurrently |
| `backend/package.json` | Dépendances backend, scripts Jest |
| `frontend/package.json` | Dépendances frontend, scripts Vitest |
| `backend/jest.config.js` | Configuration Jest (ES modules) |
| `frontend/vite.config.js` | Configuration Vite (React plugin) |
| `frontend/vitest.config.js` | Configuration Vitest (jsdom) |

### Backend

| Fichier | Rôle | Lignes |
|---------|------|--------|
| `server.js` | Point d'entrée Express | ~80 |
| `config/paths.js` | Chemins absolus | ~20 |
| `config/server.js` | CORS + sécurité | ~30 |
| `schemas/index.js` | Validation Zod | ~60 |
| `services/logSource.js` | Lecture logs + cache | ~80 |
| `services/util.js` | Utilitaires | ~40 |
| `services/issueAnalyzer.js` | Détection issues | ~300 |
| `services/fixspecGenerator.js` | Génération fixspecs | ~400 |
| `routes/issues.js` | API REST | ~200 |

### Frontend

| Fichier | Rôle | Lignes |
|---------|------|--------|
| `main.jsx` | Point d'entrée React | ~10 |
| `App.jsx` | Composant racine | ~150 |
| `index.css` | Styles globaux | ~80 |
| `components/Dashboard.jsx` | Métriques visuelles | ~120 |
| `components/CategoryFilter.jsx` | Filtres dynamiques | ~150 |
| `components/IssueList.jsx` | Liste des issues | ~200 |
| `components/IssueDetail.jsx` | Détails + fixspec | ~250 |
| `components/ErrorBoundary.jsx` | Gestion d'erreurs | ~60 |
| `services/api.js` | Service API | ~100 |

### Documentation

| Fichier | Rôle | Pages |
|---------|------|-------|
| `README.md` | Documentation principale | 3 |
| `UI_IMPROVEMENTS.md` | Guide améliorations UI | 2 |
| `HACKATHON_PITCH.md` | Pitch hackathon | 3 |
| `COMPONENTS.md` | Doc technique composants | 4 |
| `SUMMARY.md` | Récapitulatif visuel | 2 |
| `DEMO_CHECKLIST.md` | Checklist démo | 3 |
| `CHANGELOG_UI.md` | Changelog UI | 2 |
| `JURY_PRESENTATION.md` | Présentation jury | 4 |

---

## 🎨 Assets et ressources

### Icônes utilisées (emoji)

| Catégorie | Icône | Usage |
|-----------|-------|-------|
| **Général** | 💡 | Logo AutoUX |
| **Métriques** | 🔴 | Critiques |
| **Métriques** | 🟡 | Moyennes |
| **Métriques** | 🟢 | Mineures |
| **Métriques** | 🧠 | Catégories |
| **Catégories** | 📊 | Toutes |
| **Catégories** | ⏱️ | Latence |
| **Catégories** | ♿ | Accessibilité |
| **Catégories** | 🎨 | Contraste |
| **Catégories** | 🚨 | Erreur JS |

### Palette de couleurs

| Nom | Hex | Usage |
|-----|-----|-------|
| AWS Blue | `#0073bb` | Branding, header |
| Kiro Purple | `#6b4eff` | Branding, focus |
| Critical | `#dc2626` | Sévérité high |
| Medium | `#d97706` | Sévérité medium |
| Low | `#16a34a` | Sévérité low |
| Gray 50 | `#f9fafb` | Fond principal |
| Gray 900 | `#111827` | Texte principal |

---

## 🚀 Commandes utiles

### Installation

```bash
# Installer toutes les dépendances
npm install

# Installer backend seul
npm --prefix backend install

# Installer frontend seul
npm --prefix frontend install
```

### Développement

```bash
# Démarrer tout
npm run dev

# Démarrer backend seul
npm --prefix backend run dev

# Démarrer frontend seul
npm --prefix frontend run dev
```

### Tests

```bash
# Tous les tests
npm test

# Backend seul
npm run test:backend

# Frontend seul
npm run test:frontend

# Tests avec coverage
npm --prefix backend test -- --coverage
npm --prefix frontend test -- --coverage
```

### Build

```bash
# Build frontend
npm --prefix frontend run build

# Preview frontend
npm --prefix frontend run preview
```

### Nettoyage

```bash
# Supprimer node_modules
rm -rf node_modules frontend/node_modules backend/node_modules

# Supprimer dist
rm -rf frontend/dist

# Supprimer fixspecs générés
rm -rf data/fixspecs/*.json
```

---

## 📝 Notes

### Fichiers générés automatiquement

- `data/fixspecs/issue-*.json` : Fixspecs générés par le backend
- `frontend/dist/` : Build de production du frontend
- `node_modules/` : Dépendances npm (3 dossiers : racine, backend, frontend)
- `package-lock.json` : Lock files npm (3 fichiers)

### Fichiers à ne pas commiter

```gitignore
node_modules/
frontend/dist/
data/fixspecs/*.json
!data/fixspecs/.gitkeep
.env
.DS_Store
```

### Fichiers de configuration

- `.kiro/` : Configuration Kiro (specs, steering)
- `jest.config.js` : Configuration Jest (backend)
- `vite.config.js` : Configuration Vite (frontend)
- `vitest.config.js` : Configuration Vitest (frontend)

---

**Structure maintenue par l'équipe AutoUX**
**Dernière mise à jour : 12 novembre 2025**
