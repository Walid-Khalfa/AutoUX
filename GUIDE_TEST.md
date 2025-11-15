# 🧪 Guide de Test - AutoUX

## 📁 Fichiers de test disponibles

Le dossier `test-data/` contient **6 fichiers JSON** prêts à l'emploi pour tester toutes les fonctionnalités.

## 🚀 Démarrage rapide (2 minutes)

### 1. Démarrer l'application
```bash
# À la racine du projet
npm run dev
```

Vous devriez voir :
```
[Backend] Server running on http://localhost:3001
[Frontend] Local: http://localhost:5173
```

### 2. Ouvrir le navigateur
http://localhost:5173

### 3. Tester avec le premier fichier
1. Cliquer sur "Upload Logs"
2. Sélectionner `test-data/1-logs-complet.json`
3. Attendre 2-3 secondes
4. ✅ Vous devriez voir 7 issues détectées !

## 📊 Les 6 fichiers de test

| Fichier | Description | Issues attendues |
|---------|-------------|------------------|
| `1-logs-complet.json` | Tous types d'issues | 7 (2 latence, 3 a11y, 1 contraste, 1 JS) |
| `2-logs-latence.json` | Test des seuils de latence | 4 (seulement > 3000ms) |
| `3-logs-a11y.json` | Accessibilité uniquement | 6 (WCAG violations) |
| `4-logs-contrast-js.json` | Contraste + Erreurs JS | 4 (2 contraste, 2 JS) |
| `5-logs-invalids.json` | Test de validation | 4 (logs invalides filtrés) |
| `6-logs-clean.json` | Aucun problème | 0 (tout est OK ✅) |

## 🎯 Scénarios de test

### Scénario 1 : Test complet (recommandé pour démo)
```
Fichier: 1-logs-complet.json
Attendu: 7 issues avec tous les types
```

**À vérifier** :
- ✅ Dashboard affiche 7 issues
- ✅ Compteurs : 2 latence, 3 a11y, 1 contraste, 1 JS
- ✅ Filtres par catégorie fonctionnent
- ✅ Clic sur une issue → détails affichés
- ✅ Badges de sévérité (🔴 Critical, 🟡 Medium, 🟢 Minor)

### Scénario 2 : Test des seuils
```
Fichier: 2-logs-latence.json
Attendu: 4 issues (pas 5 !)
```

**À vérifier** :
- ✅ Seulement les requêtes > 3000ms créent des issues
- ✅ Le log à 1800ms ne crée PAS d'issue
- ✅ 2 Critical (> 5000ms) + 2 Medium (3000-5000ms)

### Scénario 3 : Test accessibilité
```
Fichier: 3-logs-a11y.json
Attendu: 6 issues d'accessibilité
```

**À vérifier** :
- ✅ Filtre "Accessibilité" montre 6 issues
- ✅ Références WCAG dans les détails (1.1.1, 2.4.4, etc.)
- ✅ Icône ♿ sur toutes les issues

### Scénario 4 : Test validation
```
Fichier: 5-logs-invalids.json
Attendu: 4 issues (logs invalides filtrés)
```

**À vérifier** :
- ✅ Aucune erreur affichée à l'utilisateur
- ✅ Les logs invalides sont silencieusement filtrés
- ✅ Seulement les logs valides créent des issues

### Scénario 5 : Test "aucun problème"
```
Fichier: 6-logs-clean.json
Attendu: 0 issue
```

**À vérifier** :
- ✅ Message "No issues detected ✅"
- ✅ Tous les compteurs à 0
- ✅ Dashboard vide ou message d'état

## 🔗 Test Web3 (optionnel)

Si vous avez configuré Web3 (voir [WEB3_SETUP.md](WEB3_SETUP.md)) :

1. Upload `1-logs-complet.json`
2. Voir la carte violette "🔗 On-Chain Proof"
3. Cliquer "🦊 Connect MetaMask Wallet"
4. Approuver la connexion
5. Cliquer "📌 Anchor Hash"
6. Confirmer la transaction
7. Attendre ~15 secondes
8. Cliquer "🔍 Verify Hash"
9. ✅ Badge "Verified" s'affiche

## 🐛 Dépannage

### Problème : "Unable to contact server"
**Solution** : Le backend n'est pas démarré
```bash
npm run dev
```

### Problème : "Port 5173 already in use"
**Solution** : Tuer le processus
```powershell
Get-Process -Id (Get-NetTCPConnection -LocalPort 5173).OwningProcess | Stop-Process -Force
```

### Problème : "Aucune entrée de log valide trouvée"
**Solution** : Vérifier le format du fichier
- Doit être un array JSON : `[{...}, {...}]`
- Utiliser les fichiers fournis dans `test-data/`

### Problème : Aucune issue détectée
**Solution** : Vérifier les seuils
- Latence : > 3000ms
- Contraste : < 4.5:1
- Essayer avec `1-logs-complet.json`

## 📚 Documentation complète

- **Fichiers de test** : [test-data/README.md](test-data/README.md)
- **Guide Web3** : [GUIDE_WEB3_FR.md](GUIDE_WEB3_FR.md)
- **Setup Web3** : [WEB3_SETUP.md](WEB3_SETUP.md)
- **README principal** : [README.md](README.md)

## ✅ Checklist rapide

- [ ] Backend démarré (`npm run dev`)
- [ ] Frontend accessible (http://localhost:5173)
- [ ] Upload `1-logs-complet.json`
- [ ] 7 issues détectées
- [ ] Filtres fonctionnent
- [ ] Détails d'une issue affichés
- [ ] Upload `6-logs-clean.json`
- [ ] 0 issue détectée
- [ ] Message "No issues detected ✅"

**Tout fonctionne ? Parfait ! 🎉**

---

**Besoin d'aide ?** Consultez [test-data/README.md](test-data/README.md) pour plus de détails.
