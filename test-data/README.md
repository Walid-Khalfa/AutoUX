# 📁 Fichiers de Test AutoUX

Ce dossier contient **6 fichiers JSON** pour tester toutes les fonctionnalités d'AutoUX.

## 📋 Liste des fichiers

### 1️⃣ `1-logs-complet.json` - Jeu complet (tous types)
**Contenu**: 7 logs avec tous les types d'issues
- 2 problèmes de latence (5500ms, 3800ms)
- 3 problèmes d'accessibilité (alt manquant, clavier, ARIA)
- 1 problème de contraste (3.2:1)
- 1 erreur JavaScript

**Attendu**: 7 issues détectées
- Dashboard: 2 latence, 3 a11y, 1 contraste, 1 JS error
- Filtres par catégorie fonctionnels
- Badges de sévérité (Critical, Medium, Minor)

---

### 2️⃣ `2-logs-latence.json` - Test des seuils de latence
**Contenu**: 5 logs de performance avec différents temps de réponse
- 6200ms → High severity
- 4200ms → Medium severity
- 1800ms → Pas d'issue (< 3000ms)
- 7500ms → High severity
- 3200ms → Medium severity

**Attendu**: 4 issues détectées (seulement celles > 3000ms)
- 2 Critical (> 5000ms)
- 2 Medium (3000-5000ms)
- Le log à 1800ms ne doit PAS créer d'issue

---

### 3️⃣ `3-logs-a11y.json` - Accessibilité uniquement
**Contenu**: 6 problèmes d'accessibilité variés
- Image sans alt
- Lien sans texte
- Focus non visible
- Rôle ARIA incorrect
- Champ sans label
- Hiérarchie de titres incorrecte

**Attendu**: 6 issues d'accessibilité
- Toutes avec références WCAG (1.1.1, 2.4.4, etc.)
- Filtre "Accessibilité" doit montrer les 6

---

### 4️⃣ `4-logs-contrast-js.json` - Contraste & Erreurs JS
**Contenu**: 5 logs mixtes
- 2 problèmes de contraste (2.9:1, 3.8:1)
- 2 erreurs JavaScript (TypeError, ReferenceError)
- 1 erreur réseau (HTTP 500) - ne doit PAS compter comme JS error

**Attendu**: 4 issues détectées
- 2 Contraste
- 2 JS Error
- L'erreur réseau (network) est filtrée

---

### 5️⃣ `5-logs-invalids.json` - Test de validation
**Contenu**: 7 logs dont 3 invalides
- 4 logs valides (latence, a11y, contraste, JS error)
- 3 logs invalides (timestamp incorrect, type inconnu, id manquant)

**Attendu**: 4 issues détectées
- Les entrées invalides sont filtrées par Zod
- Seuls les logs valides créent des issues
- Aucune erreur affichée à l'utilisateur

---

### 6️⃣ `6-logs-clean.json` - Aucun problème
**Contenu**: 6 logs sans problèmes
- Temps de réponse < 3000ms (120ms, 250ms)
- Contraste > 4.5:1 (7.5:1, 12:1)
- Accessibilité correcte (alt présent, texte explicite)

**Attendu**: 0 issue détectée
- Message: "No issues detected ✅"
- Dashboard vide ou message d'état vide
- Tous les compteurs à 0

---

## 🚀 Comment tester

### Étape 1: Démarrer AutoUX
```bash
# À la racine du projet
npm run dev
```

### Étape 2: Ouvrir le navigateur
http://localhost:5173

### Étape 3: Uploader un fichier
1. Cliquer sur "Upload Logs" ou drag & drop
2. Sélectionner un fichier du dossier `test-data/`
3. Attendre l'analyse (quelques secondes)

### Étape 4: Vérifier les résultats
- Dashboard avec métriques
- Filtres par catégorie
- Liste des issues
- Détails de chaque issue

---

## ✅ Checklist de test

### Test 1: Jeu complet
- [ ] Upload `1-logs-complet.json`
- [ ] Vérifier 7 issues détectées
- [ ] Vérifier les compteurs: 2 latence, 3 a11y, 1 contraste, 1 JS
- [ ] Tester les filtres par catégorie
- [ ] Cliquer sur une issue → voir les détails

### Test 2: Seuils de latence
- [ ] Upload `2-logs-latence.json`
- [ ] Vérifier 4 issues (pas 5 !)
- [ ] Vérifier que 1800ms ne crée PAS d'issue
- [ ] Vérifier les badges: 2 Critical, 2 Medium

### Test 3: Accessibilité
- [ ] Upload `3-logs-a11y.json`
- [ ] Vérifier 6 issues d'accessibilité
- [ ] Filtre "Accessibilité" → 6 issues
- [ ] Vérifier les références WCAG dans les détails

### Test 4: Contraste & JS
- [ ] Upload `4-logs-contrast-js.json`
- [ ] Vérifier 4 issues (pas 5 !)
- [ ] Vérifier que l'erreur réseau est filtrée
- [ ] 2 contraste + 2 JS error

### Test 5: Validation
- [ ] Upload `5-logs-invalids.json`
- [ ] Vérifier 4 issues (pas 7 !)
- [ ] Aucune erreur affichée
- [ ] Les logs invalides sont silencieusement filtrés

### Test 6: Aucun problème
- [ ] Upload `6-logs-clean.json`
- [ ] Vérifier 0 issue
- [ ] Message "No issues detected ✅"
- [ ] Tous les compteurs à 0

---

## 🎯 Résultats attendus par fichier

| Fichier | Issues | Latence | A11y | Contraste | JS Error |
|---------|--------|---------|------|-----------|----------|
| 1-logs-complet.json | 7 | 2 | 3 | 1 | 1 |
| 2-logs-latence.json | 4 | 4 | 0 | 0 | 0 |
| 3-logs-a11y.json | 6 | 0 | 6 | 0 | 0 |
| 4-logs-contrast-js.json | 4 | 0 | 0 | 2 | 2 |
| 5-logs-invalids.json | 4 | 1 | 1 | 1 | 1 |
| 6-logs-clean.json | 0 | 0 | 0 | 0 | 0 |

---

## 🐛 Problèmes courants

### "Aucune entrée de log valide trouvée"
- Vérifier que le backend est démarré (`npm run dev`)
- Vérifier le format JSON (doit être un array)
- Essayer avec `1-logs-complet.json` d'abord

### "Unable to contact server"
- Le backend n'est pas démarré
- Lancer `npm run dev` à la racine du projet

### Aucune issue détectée sur un fichier qui devrait en avoir
- Vérifier les seuils de détection (latence > 3000ms, contraste < 4.5:1)
- Vérifier les logs dans la console du navigateur
- Vérifier les logs du backend

---

## 📚 Documentation

- **Guide Web3**: [GUIDE_WEB3_FR.md](../GUIDE_WEB3_FR.md)
- **Setup Web3**: [WEB3_SETUP.md](../WEB3_SETUP.md)
- **README principal**: [README.md](../README.md)

---

**Bon test ! 🚀**
