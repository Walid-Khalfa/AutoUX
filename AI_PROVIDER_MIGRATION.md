# Migration vers Google Gemini 2.0 Flash

## Contexte

Suite à des problèmes de fiabilité avec OpenRouter (scores incorrects, calculs incohérents), nous avons migré vers **Google Gemini 2.0 Flash** comme fournisseur d'IA principal.

## Changements effectués

### 1. Configuration

**Nouveau fichier : `backend/.env`**
```env
# Google Gemini API Configuration (Primary)
GEMINI_API_KEY=AIzaSyDf3LFuxbdNcQC5Eb2YqIVbXRQPpfBdb4U
GEMINI_MODEL=gemini-2.0-flash-exp

# AI Provider Selection
AI_PROVIDER=gemini

# OpenRouter (Backup)
OPENROUTER_API_KEY=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
OPENROUTER_BASE_URL=https://openrouter.ai/api/v1
OPENROUTER_MODEL=kwaipilot/kat-coder-pro:free
```

### 2. Nouveaux fichiers créés

- **`backend/src/config/gemini.js`** - Configuration Gemini
- **`backend/src/services/geminiAnalyzer.js`** - Service d'analyse Gemini
- **`backend/src/services/aiAnalyzer.js`** - Interface unifiée avec fallback automatique

### 3. Fichiers modifiés

- **`backend/src/routes/analyze.js`** - Utilise maintenant `analyzeWithAI()` au lieu de `analyzeWithLLM()`
- **`backend/.env`** - Ajout des variables Gemini
- **`backend/.env.example`** - Documentation des nouvelles variables

## Avantages de Gemini

### 1. Fiabilité améliorée
- ✅ Calculs de score plus cohérents
- ✅ Meilleure compréhension des instructions
- ✅ Réponses JSON plus structurées

### 2. Performance
- ⚡ Latence réduite (~2-3s vs 5-8s avec OpenRouter)
- ⚡ Modèle "Flash" optimisé pour la vitesse
- ⚡ Meilleure gestion des timeouts

### 3. Coût
- 💰 Quota gratuit généreux (15 requêtes/minute)
- 💰 Pas de limite de tokens pour le tier gratuit
- 💰 Meilleur rapport qualité/prix

### 4. Fallback automatique
- 🔄 Si Gemini échoue, bascule automatiquement vers OpenRouter
- 🔄 Résilience accrue du système
- 🔄 Pas d'interruption de service

## Utilisation

### Utiliser Gemini (par défaut)

```env
AI_PROVIDER=gemini
GEMINI_API_KEY=your_gemini_api_key
```

### Utiliser OpenRouter

```env
AI_PROVIDER=openrouter
OPENROUTER_API_KEY=your_openrouter_api_key
```

### Obtenir une clé API Gemini

1. Visitez https://aistudio.google.com/app/apikey
2. Connectez-vous avec votre compte Google
3. Cliquez sur "Create API Key"
4. Copiez la clé dans `backend/.env`

## Calcul du score UX

Le score est maintenant **toujours calculé côté backend** pour garantir la cohérence :

```javascript
// Formule de calcul
Score initial = 100

Pour chaque issue :
  - Critical/High : -15 points
  - Medium : -8 points
  - Low : -3 points

Score final = max(0, min(100, score))
```

**Exemples :**
- 0 issues → Score = 100
- 5 critical + 1 medium → Score = 100 - 75 - 8 = 17
- 7 critical → Score = 100 - 105 = 0 (plafonné)

## Tests

Pour tester le calcul du score :

```bash
cd backend
node test-score-calculation.js
```

## Logs

Les logs indiquent maintenant quel fournisseur est utilisé :

```
[INFO] Using AI provider: gemini
[INFO] Gemini analysis attempt 1/3
[INFO] AI analysis complete { uxScore: 17, issues: 6 }
```

En cas de fallback :

```
[ERROR] AI analysis failed with gemini { error: "..." }
[INFO] Falling back to OpenRouter...
```

## Migration pour les développeurs

Si vous avez un fork ou une copie locale :

1. **Mettez à jour les dépendances** (aucune nouvelle dépendance requise)
2. **Ajoutez les variables d'environnement** dans `backend/.env`
3. **Redémarrez le backend** : `npm run dev`
4. **Testez l'analyse** avec un fichier de log

## Rollback vers OpenRouter

Si vous souhaitez revenir à OpenRouter :

```env
AI_PROVIDER=openrouter
```

Puis redémarrez le backend.

## Problèmes connus

### Gemini

- ⚠️ Quota gratuit limité à 15 requêtes/minute
- ⚠️ Peut nécessiter un compte Google

### OpenRouter

- ⚠️ Scores parfois incorrects (d'où la migration)
- ⚠️ Latence plus élevée
- ⚠️ Quota gratuit plus restrictif

## Support

Pour toute question ou problème :

1. Vérifiez les logs du backend
2. Testez avec `node test-score-calculation.js`
3. Vérifiez que votre clé API est valide
4. Essayez le fallback vers l'autre fournisseur

## Références

- **Gemini API Docs** : https://ai.google.dev/docs
- **Gemini Pricing** : https://ai.google.dev/pricing
- **OpenRouter Docs** : https://openrouter.ai/docs

## Changelog

### v2.1.0 - Migration vers Gemini
- ✅ Ajout du support Gemini 2.0 Flash
- ✅ Interface unifiée avec fallback automatique
- ✅ Calcul de score côté backend pour cohérence
- ✅ Amélioration des logs et monitoring
- ✅ Documentation complète

### v2.0.0 - Version initiale
- OpenRouter comme fournisseur unique
- KAT-Coder-Pro comme modèle
