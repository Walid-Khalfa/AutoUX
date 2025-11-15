# 🔒 Guide de Sécurité - AutoUX

## ⚠️ AVERTISSEMENT CRITIQUE

**NE JAMAIS COMMITER LES FICHIERS `.env` DANS GIT!**

Les fichiers suivants contiennent des secrets et NE DOIVENT JAMAIS être commités :
- `backend/.env`
- `frontend/.env`
- `web3/.env`
- `.env`

## 🚨 Actions Immédiates Requises

### 1. Régénérer TOUTES les clés API

Si vous avez accidentellement commité des clés API, vous DEVEZ les régénérer immédiatement :

#### Gemini API Key
1. Allez sur https://aistudio.google.com/app/apikey
2. Supprimez l'ancienne clé
3. Créez une nouvelle clé
4. Mettez à jour `backend/.env` :
   ```env
   GEMINI_API_KEY=votre_nouvelle_cle
   ```

#### OpenRouter API Key
1. Allez sur https://openrouter.ai/keys
2. Révoquez l'ancienne clé
3. Créez une nouvelle clé
4. Mettez à jour `backend/.env` :
   ```env
   OPENROUTER_API_KEY=votre_nouvelle_cle
   ```

#### Ethereum Private Key
1. **CRÉEZ UN NOUVEAU WALLET** - L'ancien est compromis!
2. Transférez tous les fonds vers le nouveau wallet
3. Mettez à jour `web3/.env` :
   ```env
   PRIVATE_KEY=votre_nouvelle_cle_privee
   ```

### 2. Nettoyer l'historique Git

Si les clés ont été commitées, nettoyez l'historique Git :

```bash
# Supprimer les fichiers de l'historique
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch backend/.env web3/.env .env" \
  --prune-empty --tag-name-filter cat -- --all

# Forcer le push (ATTENTION: réécrit l'historique)
git push origin --force --all
```

## 🔐 Bonnes Pratiques de Sécurité

### Gestion des Secrets

#### ✅ À FAIRE
- Utiliser des variables d'environnement
- Stocker les secrets dans `.env` (gitignored)
- Utiliser des services de gestion de secrets en production (AWS Secrets Manager, HashiCorp Vault)
- Régénérer les clés régulièrement
- Utiliser des clés différentes pour dev/staging/prod

#### ❌ À NE JAMAIS FAIRE
- Commiter des fichiers `.env`
- Hardcoder des clés API dans le code
- Partager des clés par email/Slack
- Utiliser les mêmes clés en dev et prod
- Logger des clés API

### Validation des Entrées

```javascript
// ✅ BON - Validation avec Zod
import { z } from 'zod';

const schema = z.object({
  file: z.instanceof(File),
  size: z.number().max(10 * 1024 * 1024) // 10MB
});

// ❌ MAUVAIS - Pas de validation
const file = req.file; // Accepte n'importe quoi
```

### Sanitization des Sorties

```javascript
// ✅ BON - React échappe automatiquement
<div>{userInput}</div>

// ❌ MAUVAIS - Injection HTML possible
<div dangerouslySetInnerHTML={{__html: userInput}} />
```

### Rate Limiting

```javascript
// ✅ BON - Rate limiting configuré
app.use(rateLimiter); // 10 req/min

// ❌ MAUVAIS - Pas de limite
app.post('/api/analyze', handler); // Peut être spammé
```

## 🛡️ Checklist de Sécurité

### Avant Chaque Commit

- [ ] Vérifier qu'aucun fichier `.env` n'est staged
- [ ] Vérifier qu'aucune clé API n'est dans le code
- [ ] Vérifier qu'aucun mot de passe n'est hardcodé
- [ ] Scanner avec `git secrets` ou `trufflehog`

```bash
# Vérifier les fichiers staged
git diff --cached --name-only | grep -E '\.env$'
```

### Avant Chaque Déploiement

- [ ] Régénérer les clés API pour la production
- [ ] Vérifier que HTTPS est activé
- [ ] Vérifier que les headers de sécurité sont en place
- [ ] Tester le rate limiting
- [ ] Scanner les vulnérabilités : `npm audit`
- [ ] Vérifier les logs (pas de données sensibles)

### En Production

- [ ] Utiliser HTTPS uniquement
- [ ] Activer HSTS headers
- [ ] Configurer un WAF (Web Application Firewall)
- [ ] Mettre en place des alertes de sécurité
- [ ] Logs centralisés et monitoring
- [ ] Backups réguliers et chiffrés

## 🔍 Détection de Secrets

### Installation de git-secrets

```bash
# macOS
brew install git-secrets

# Linux
git clone https://github.com/awslabs/git-secrets.git
cd git-secrets
make install

# Configuration
git secrets --install
git secrets --register-aws
```

### Scan du Repository

```bash
# Scanner tout le repo
git secrets --scan

# Scanner l'historique
git secrets --scan-history
```

## 🚨 En Cas de Fuite de Secrets

### Procédure d'Urgence

1. **RÉVOQUER IMMÉDIATEMENT** toutes les clés compromises
2. **RÉGÉNÉRER** de nouvelles clés
3. **NOTIFIER** l'équipe de sécurité
4. **ANALYSER** les logs pour détecter une utilisation frauduleuse
5. **NETTOYER** l'historique Git
6. **DOCUMENTER** l'incident

### Contacts d'Urgence

- **Sécurité:** [email]
- **DevOps:** [email]
- **Support Gemini:** https://support.google.com/
- **Support OpenRouter:** https://openrouter.ai/support

## 📚 Ressources

### Documentation
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)
- [React Security](https://react.dev/learn/security)

### Outils
- [npm audit](https://docs.npmjs.com/cli/v8/commands/npm-audit)
- [Snyk](https://snyk.io/)
- [git-secrets](https://github.com/awslabs/git-secrets)
- [trufflehog](https://github.com/trufflesecurity/trufflehog)

### Monitoring
- [Sentry](https://sentry.io/) - Error tracking
- [Datadog](https://www.datadoghq.com/) - APM & Security
- [Cloudflare](https://www.cloudflare.com/) - WAF & DDoS protection

## 🎓 Formation

### Pour les Développeurs

1. **OWASP Top 10** - Comprendre les vulnérabilités courantes
2. **Secure Coding** - Pratiques de développement sécurisé
3. **API Security** - Sécuriser les APIs REST
4. **Web3 Security** - Sécurité blockchain et smart contracts

### Ressources de Formation

- [OWASP WebGoat](https://owasp.org/www-project-webgoat/)
- [HackTheBox](https://www.hackthebox.com/)
- [PortSwigger Web Security Academy](https://portswigger.net/web-security)

## 📝 Changelog de Sécurité

### v2.1.0 - 2025-11-14
- ✅ Migration vers Gemini avec API key dans headers
- ✅ Ajout de HSTS headers en production
- ✅ Amélioration du CSP
- ✅ Suppression du header X-Powered-By
- ✅ Documentation de sécurité complète

### v2.0.0 - 2025-11-13
- ✅ Rate limiting (10 req/min)
- ✅ Security headers (CSP, X-Frame-Options)
- ✅ Validation Zod
- ✅ File upload limits (10MB)

---

**Dernière mise à jour:** 2025-11-14  
**Prochaine revue:** 2025-12-14
