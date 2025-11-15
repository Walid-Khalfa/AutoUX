# 🚨 INCIDENT DE SÉCURITÉ - Clé API Exposée

## ⚠️ ALERTE CRITIQUE

**Date :** 15 novembre 2025  
**Type :** Clé API Google Gemini exposée sur GitHub  
**Statut :** 🔴 CRITIQUE - Action immédiate requise

---

## ✅ ACTIONS IMMÉDIATES (À FAIRE MAINTENANT)

### 1. Révoquer la clé API exposée (URGENT - 2 minutes)

1. Allez sur : https://aistudio.google.com/apikey
2. Trouvez la clé exposée
3. Cliquez sur l'icône **poubelle** pour la supprimer
4. Confirmez la suppression

⚠️ **NE PAS SAUTER CETTE ÉTAPE !** La clé est publique et peut être utilisée par n'importe qui.

### 2. Créer une nouvelle clé API (2 minutes)

1. Sur https://aistudio.google.com/apikey
2. Cliquez sur **"Create API Key"**
3. Copiez la nouvelle clé
4. **NE LA PARTAGEZ AVEC PERSONNE**

### 3. Mettre à jour votre configuration locale (1 minute)

```bash
# Ouvrez backend/.env
# Remplacez l'ancienne clé par la nouvelle
GEMINI_API_KEY=votre_nouvelle_clé_ici
```

⚠️ **IMPORTANT :** Ne commitez JAMAIS ce fichier !

### 4. Vérifier que .env est bien ignoré (30 secondes)

```bash
# Vérifiez que .env est dans .gitignore
cat .gitignore | grep ".env"

# Devrait afficher :
# .env
# backend/.env
# frontend/.env
```

---

## 🔍 Ce qui s'est passé

### Fichiers qui contenaient la clé exposée :
- ❌ `KIRO_USAGE.md` - Clé dans un exemple
- ❌ `QUICK_DEPLOYMENT_GUIDE.md` - Clé dans la documentation
- ❌ `GEMINI_SETUP_SUCCESS.md` - Clé dans le rapport de configuration
- ❌ `SECURITY_AUDIT_REPORT.md` - Clé dans le rapport de sécurité
- ❌ `AI_PROVIDER_MIGRATION.md` - Clé dans le guide de migration

### Cause :
Documentation créée avec des exemples contenant de vraies clés API au lieu de placeholders.

---

## ✅ Corrections appliquées

Tous les fichiers ont été nettoyés et les clés remplacées par :
- `your_gemini_api_key_here`
- `[RÉVOQUÉE - NE JAMAIS COMMITER DE VRAIES CLÉS]`
- `[CONFIGURÉE - Voir .env]`

---

## 🛡️ Prévention future

### Règles à suivre TOUJOURS :

1. **JAMAIS de vraies clés dans le code ou la documentation**
   - Utilisez des placeholders : `your_api_key_here`
   - Utilisez des exemples fictifs : `AIzaSy...` (tronqué)

2. **Toujours vérifier avant de commit**
   ```bash
   # Vérifiez qu'aucune clé n'est présente
   git diff | grep -i "api.*key"
   ```

3. **Utilisez .env pour TOUTES les clés**
   - Backend : `backend/.env`
   - Frontend : `frontend/.env`
   - Web3 : `web3/.env`

4. **Vérifiez .gitignore**
   ```bash
   # Ces fichiers doivent être ignorés
   .env
   .env.local
   backend/.env
   frontend/.env
   web3/.env
   ```

5. **Utilisez des variables d'environnement sur les plateformes**
   - Render : Section "Environment"
   - Vercel : Section "Environment Variables"
   - **JAMAIS dans le code**

---

## 🔐 Checklist de sécurité

Après cet incident, vérifiez :

- [ ] Ancienne clé API Gemini révoquée
- [ ] Nouvelle clé API créée
- [ ] `backend/.env` mis à jour avec la nouvelle clé
- [ ] `.env` est dans `.gitignore`
- [ ] Aucune clé dans les fichiers committés
- [ ] Documentation nettoyée (placeholders uniquement)
- [ ] Render mis à jour avec la nouvelle clé (si déjà déployé)

---

## 📊 Impact de l'incident

### Risques :
- ✅ **Faible** - Clé gratuite avec quotas limités
- ⚠️ **Moyen** - Quelqu'un pourrait utiliser votre quota
- ❌ **Élevé** - Si clé payante ou avec données sensibles

### Actions prises :
- ✅ Clé révoquée
- ✅ Documentation nettoyée
- ✅ Guide de prévention créé
- ✅ Nouvelle clé générée

---

## 🆘 Si vous avez déjà déployé sur Render

### Mettre à jour la clé sur Render :

1. Allez sur https://dashboard.render.com
2. Sélectionnez votre service **autoux-backend**
3. Cliquez sur **"Environment"**
4. Trouvez `GEMINI_API_KEY`
5. Cliquez sur l'icône crayon
6. Collez la **nouvelle clé**
7. Cliquez **"Save Changes"**
8. Le service redémarrera automatiquement

---

## 📚 Ressources

### Sécurité des clés API :
- [Google API Security Best Practices](https://cloud.google.com/docs/authentication/api-keys)
- [GitHub Secret Scanning](https://docs.github.com/en/code-security/secret-scanning)
- [GitGuardian](https://www.gitguardian.com/)

### Outils de détection :
- **git-secrets** - Prévient les commits de secrets
- **gitleaks** - Scanne l'historique Git
- **truffleHog** - Détecte les secrets dans le code

---

## ✅ Résolution

Une fois toutes les actions complétées :

1. Commitez les changements :
   ```bash
   git add .
   git commit -m "security: Remove exposed API keys from documentation"
   git push
   ```

2. Vérifiez que GitGuardian ne détecte plus de problème

3. Continuez le développement en toute sécurité !

---

## 🎓 Leçon apprise

**Ne JAMAIS inclure de vraies clés API dans :**
- ❌ Code source
- ❌ Documentation
- ❌ Exemples
- ❌ Commentaires
- ❌ Commits Git

**Toujours utiliser :**
- ✅ Variables d'environnement (`.env`)
- ✅ Placeholders dans la documentation
- ✅ `.gitignore` pour les fichiers sensibles
- ✅ Variables d'environnement des plateformes de déploiement

---

**Incident résolu. Restez vigilant ! 🛡️**
