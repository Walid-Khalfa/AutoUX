# ✅ Checklist de Sécurité - AutoUX

## 🚨 ACTIONS URGENTES (Si clé exposée)

- [ ] **Révoquer immédiatement** la clé exposée sur https://aistudio.google.com/apikey
- [ ] **Créer une nouvelle clé** API Gemini
- [ ] **Mettre à jour** `backend/.env` avec la nouvelle clé
- [ ] **Mettre à jour** Render (si déjà déployé)
- [ ] **Vérifier** qu'aucune autre clé n'est exposée

📖 **Guide complet :** [SECURITY_INCIDENT_RESPONSE.md](./SECURITY_INCIDENT_RESPONSE.md)

---

## 🔐 Vérifications de sécurité

### 1. Fichiers .env protégés

```bash
# Vérifiez que .env est dans .gitignore
cat .gitignore | grep ".env"
```

**Devrait afficher :**
```
.env
.env.local
backend/.env
frontend/.env
web3/.env
```

✅ **Statut :** Tous les fichiers .env sont ignorés

---

### 2. Aucune clé dans le code

```bash
# Recherchez des clés API dans le code
git grep -i "AIzaSy"
git grep -i "sk-or-v1"
git grep -i "0x[a-f0-9]\{64\}"
```

**Résultat attendu :** Aucune vraie clé trouvée (seulement des placeholders)

---

### 3. Variables d'environnement configurées

#### Backend (`backend/.env`)
```env
GEMINI_API_KEY=votre_clé_ici  # ✅ Configurée
PORT=3001                      # ✅ Configurée
CORS_ORIGIN=http://localhost:5173  # ✅ Configurée
```

#### Frontend (`frontend/.env`)
```env
VITE_API_BASE_URL=http://localhost:3001/api  # ✅ Configurée
```

---

### 4. Fichiers sensibles non committés

```bash
# Vérifiez qu'aucun fichier .env n'est tracké
git ls-files | grep ".env"
```

**Résultat attendu :** Aucun fichier .env listé

---

## 🛡️ Bonnes pratiques

### ✅ À FAIRE

1. **Utiliser .env pour toutes les clés**
   ```env
   # backend/.env
   GEMINI_API_KEY=votre_clé
   ```

2. **Vérifier avant chaque commit**
   ```bash
   git diff | grep -i "api.*key"
   ```

3. **Utiliser des placeholders dans la doc**
   ```markdown
   GEMINI_API_KEY=your_api_key_here
   ```

4. **Configurer les variables sur les plateformes**
   - Render : Section "Environment"
   - Vercel : Section "Environment Variables"

5. **Révoquer les clés exposées immédiatement**

### ❌ À NE JAMAIS FAIRE

1. ❌ Commiter des fichiers `.env`
2. ❌ Mettre des vraies clés dans la documentation
3. ❌ Partager des clés par email/chat
4. ❌ Utiliser la même clé partout
5. ❌ Ignorer les alertes GitGuardian

---

## 🔍 Outils de détection

### GitGuardian (Actif sur votre repo)
- Scanne automatiquement les commits
- Envoie des alertes par email
- **Action :** Révoquer immédiatement si alerte

### git-secrets (Optionnel)
```bash
# Installation
brew install git-secrets  # macOS
# ou
apt-get install git-secrets  # Linux

# Configuration
git secrets --install
git secrets --register-aws
```

### gitleaks (Optionnel)
```bash
# Installation
brew install gitleaks  # macOS

# Scan du repo
gitleaks detect
```

---

## 📊 Audit de sécurité

### Dernière vérification : 15 novembre 2025

| Élément | Statut | Action |
|---------|--------|--------|
| Fichiers .env ignorés | ✅ OK | Aucune |
| Clés dans le code | ✅ OK | Nettoyées |
| Documentation | ✅ OK | Placeholders uniquement |
| GitGuardian | ⚠️ Alerte | Clé révoquée |
| Variables Render | ⏳ À faire | Après déploiement |
| Variables Vercel | ⏳ À faire | Après déploiement |

---

## 🆘 En cas d'incident

### Clé API exposée

1. **Immédiat (2 min)**
   - Révoquer la clé sur https://aistudio.google.com/apikey
   - Créer une nouvelle clé

2. **Court terme (5 min)**
   - Mettre à jour `backend/.env`
   - Mettre à jour Render/Vercel
   - Nettoyer la documentation

3. **Moyen terme (10 min)**
   - Vérifier l'historique Git
   - Scanner avec gitleaks
   - Documenter l'incident

📖 **Guide complet :** [SECURITY_INCIDENT_RESPONSE.md](./SECURITY_INCIDENT_RESPONSE.md)

---

## 🎓 Formation

### Ressources recommandées

- [OWASP API Security](https://owasp.org/www-project-api-security/)
- [GitHub Secret Scanning](https://docs.github.com/en/code-security/secret-scanning)
- [Google API Security](https://cloud.google.com/docs/authentication/api-keys)

### Règles d'or

1. **Secrets = .env uniquement**
2. **Toujours vérifier avant commit**
3. **Révoquer immédiatement si exposé**
4. **Utiliser des placeholders dans la doc**
5. **Activer les alertes de sécurité**

---

## ✅ Validation finale

Avant de déployer, vérifiez :

- [ ] Aucune clé dans le code source
- [ ] `.env` dans `.gitignore`
- [ ] Documentation avec placeholders uniquement
- [ ] Variables d'environnement configurées localement
- [ ] Prêt à configurer sur Render/Vercel

---

**Sécurité validée ! Vous pouvez déployer en toute confiance. 🛡️**
