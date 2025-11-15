# 🔧 AutoUX Backend

Backend API pour AutoUX - Analyse de logs UX avec Google Gemini AI.

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

Éditez `.env` et ajoutez votre clé API Gemini :

```env
GEMINI_API_KEY=votre_clé_api_ici
PORT=3001
CORS_ORIGIN=http://localhost:5173
```

### Lancement

```bash
# Développement (avec hot reload)
npm run dev

# Production
npm start
```

Le serveur démarre sur http://localhost:3001

## 📡 API Endpoints

### POST /api/analyze

Analyse un fichier de logs et retourne un rapport UX.

**Request:**
- Method: `POST`
- Content-Type: `multipart/form-data`
- Body: `file` (fichier de logs)

**Response:**
```json
{
  "report": {
    "id": "report-xxx",
    "uxScore": 72,
    "issues": [...],
    "recommendations": [...]
  },
  "markdown": "# Rapport..."
}
```

### GET /api/health

Vérifie l'état du serveur.

**Response:**
```json
{
  "status": "ok"
}
```

## 🧪 Tests

```bash
npm test
```

## 📁 Structure

```
backend/
├── src/
│   ├── config/          # Configuration
│   │   ├── gemini.js    # Config Gemini AI
│   │   ├── paths.js     # Chemins de fichiers
│   │   └── server.js    # Config serveur
│   ├── routes/          # Routes API
│   │   ├── analyze.js   # POST /api/analyze
│   │   ├── issues.js    # Gestion des issues
│   │   └── upload.js    # Upload de fichiers
│   ├── services/        # Logique métier
│   │   ├── fileParser.js       # Parse les logs
│   │   ├── geminiAnalyzer.js   # Analyse AI
│   │   └── reportGenerator.js  # Génère les rapports
│   ├── schemas/         # Validation Zod
│   └── server.js        # Point d'entrée
└── package.json
```

## 🔑 Variables d'environnement

| Variable | Description | Défaut | Requis |
|----------|-------------|--------|--------|
| `GEMINI_API_KEY` | Clé API Google Gemini | - | ✅ |
| `PORT` | Port du serveur | `3001` | ❌ |
| `NODE_ENV` | Environnement | `development` | ❌ |
| `CORS_ORIGIN` | Origine CORS autorisée | `http://localhost:5173` | ❌ |

## 🚀 Déploiement

### Render

Le backend est configuré pour Render avec `render.yaml` à la racine du projet.

**Variables d'environnement requises :**
- `GEMINI_API_KEY`
- `NODE_ENV=production`
- `PORT=10000`
- `CORS_ORIGIN=[URL_FRONTEND]`

Voir [DEPLOYMENT_GUIDE.md](../DEPLOYMENT_GUIDE.md) pour plus de détails.

## 📚 Documentation

- [Guide de déploiement](../DEPLOYMENT_GUIDE.md)
- [README principal](../README.md)
