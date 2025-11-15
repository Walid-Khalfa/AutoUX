# ✅ Checklist de démo AutoUX - Hackathon

## 🎯 Avant la démo

### Préparation technique
- [ ] **Backend démarré** : `npm --prefix backend run dev` (port 3001)
- [ ] **Frontend démarré** : `npm --prefix frontend run dev` (port 5173)
- [ ] **Navigateur ouvert** : http://localhost:5173
- [ ] **Logs de démo** : `data/logs.json` contient 5-7 exemples variés
- [ ] **Fixspecs générés** : `data/fixspecs/` contient des exemples
- [ ] **Console propre** : Pas d'erreurs dans la console navigateur
- [ ] **Réseau stable** : Vérifier la connexion

### Préparation visuelle
- [ ] **Zoom navigateur** : 100% (Ctrl+0)
- [ ] **Fenêtre plein écran** : F11 ou maximisée
- [ ] **Onglets fermés** : Garder uniquement AutoUX
- [ ] **Extensions désactivées** : Pas de bloqueurs de pub
- [ ] **Mode sombre désactivé** : Pour meilleur contraste
- [ ] **Notifications désactivées** : Pas d'interruptions

### Préparation du pitch
- [ ] **Script mémorisé** : 30 secondes chronométrées
- [ ] **Points clés notés** : Dashboard, filtres, fixspecs, hot-reload
- [ ] **Questions anticipées** : Scalabilité, tech stack, roadmap
- [ ] **Backup plan** : Captures d'écran si problème technique

---

## 🎬 Script de démo (30 secondes)

### [0-5s] Introduction + Dashboard
**Action** : Montrer la page d'accueil avec dashboard

**Script** :
> "AutoUX détecte automatiquement les problèmes UX dans vos logs. Ici, on voit instantanément : 7 problèmes détectés, dont 3 critiques, répartis en 4 catégories."

**Points à montrer** :
- Header avec gradient AWS/Kiro
- 5 cartes métriques (Total, Critiques, Moyennes, Mineures, Catégories)
- Design professionnel avec ombres et espacements

---

### [5-10s] Filtrage dynamique
**Action** : Cliquer sur "Accessibilité (3)"

**Script** :
> "Le filtrage est intelligent : chaque catégorie affiche son compteur en temps réel. Ici, 3 problèmes d'accessibilité."

**Points à montrer** :
- Filtres avec icônes (⏱️♿🎨🚨)
- Compteurs dynamiques
- État actif visuel (bordure + fond coloré)
- Liste filtrée instantanément

---

### [10-15s] Détails + Fixspec
**Action** : Cliquer sur une issue critique (ex: "Image sans alt")

**Script** :
> "Pour chaque problème, AutoUX génère un fixspec IA avec : résumé actionnable, étapes de correction, exemple de code, et références WCAG."

**Points à montrer** :
- Détails de l'issue (type, sévérité, timestamp)
- Fixspec structuré :
  - Résumé : "Ajouter un attribut alt descriptif..."
  - Étapes : 1, 2, 3...
  - Code : Avant/Après
  - Références : WCAG 2.2 – 1.1.1

---

### [15-20s] Hot-reload (optionnel si temps)
**Action** : Ajouter une ligne dans `data/logs.json`

**Script** :
> "Le système détecte automatiquement les nouveaux logs. Regardez : j'ajoute une latence de 6000ms..."

**Points à montrer** :
- Ouvrir `data/logs.json` dans un éditeur
- Ajouter :
  ```json
  {
    "id": "log-demo-new",
    "timestamp": "2025-11-12T12:40:00Z",
    "type": "performance",
    "metadata": { "responseTime": 6000, "endpoint": "/api/demo" }
  }
  ```
- Sauvegarder
- Rafraîchir l'UI (F5 ou bouton refresh)
- Montrer : "8 problèmes, 4 critiques"

---

### [20-25s] Fixspec créé
**Action** : Montrer le fichier fixspec généré

**Script** :
> "Et voilà : le fixspec est automatiquement créé avec des recommandations concrètes pour optimiser la performance."

**Points à montrer** :
- Ouvrir `data/fixspecs/` dans l'explorateur
- Montrer le nouveau fichier `issue-xxx.json`
- Ouvrir et montrer la structure JSON

---

### [25-30s] Conclusion
**Action** : Revenir sur le dashboard

**Script** :
> "De la détection à la solution en 1 seconde. AutoUX, c'est Lighthouse + Sentry + GitHub Copilot pour l'UX."

**Points à montrer** :
- Dashboard mis à jour
- Palette cohérente AWS/Kiro
- Accessibilité WCAG AA
- Tests complets (67 passants)

---

## 🎯 Points clés à mentionner

### Technique
- ✅ **Stack moderne** : React + Express + Zod
- ✅ **Tests complets** : 67 tests (43 backend + 24 frontend)
- ✅ **Accessibilité** : WCAG AA respecté
- ✅ **Hot-reload** : Détection automatique des changements

### Fonctionnel
- ✅ **4 types de détection** : Latence, accessibilité, contraste, JS
- ✅ **Fixspecs IA** : Recommandations WCAG + Web Vitals
- ✅ **Idempotence** : Pas de doublons
- ✅ **Dashboard** : Vue d'ensemble instantanée

### UX
- ✅ **5 secondes** pour comprendre l'état global
- ✅ **1 clic** pour filtrer par catégorie
- ✅ **2 clics** pour voir le fixspec complet
- ✅ **Branding** : Palette AWS/Kiro cohérente

---

## 🤔 Questions anticipées

### "Comment ça scale ?"
**Réponse** :
> "Actuellement local pour la démo, mais l'architecture est prête pour le cloud : API REST stateless, cache intelligent, et possibilité d'intégrer Sentry/LogRocket pour logs en temps réel. On peut analyser des milliers de logs en secondes."

### "Quelle est la tech stack ?"
**Réponse** :
> "Frontend : React 18 + Vite. Backend : Node.js + Express. Validation : Zod avec typage fort. Tests : Jest (backend) + Vitest (frontend). 67 tests, 100% passants."

### "Comment vous différenciez-vous de Lighthouse ?"
**Réponse** :
> "Lighthouse analyse une page à un instant T. AutoUX analyse vos logs en continu pour détecter les problèmes réels vécus par vos utilisateurs. Et on génère des fixspecs avec code et références, pas juste un score."

### "Roadmap ?"
**Réponse** :
> "Court terme : intégration Sentry, export PDF, graphiques de tendance. Moyen terme : Machine Learning pour prédire les problèmes, intégration GitHub. Long terme : SaaS multi-projets avec marketplace de détecteurs."

### "Accessibilité ?"
**Réponse** :
> "WCAG AA complet : navigation clavier, ARIA labels, contraste ≥4.5:1, tooltips descriptifs. On pratiquons ce qu'on prêchons !"

### "Temps de développement ?"
**Réponse** :
> "48h de hackathon : 24h pour le backend et la détection, 24h pour le frontend et l'UI. Avec Kiro AI pour accélérer le développement."

---

## 🚨 Plan B (si problème technique)

### Backend ne démarre pas
- [ ] Montrer les captures d'écran préparées
- [ ] Expliquer l'architecture avec le diagramme
- [ ] Montrer le code source (commentaires KIRO-AI)
- [ ] Montrer les tests qui passent

### Frontend ne charge pas
- [ ] Montrer les captures d'écran
- [ ] Faire une démo du backend avec Postman/curl
- [ ] Montrer les fixspecs JSON générés
- [ ] Expliquer le design system

### Hot-reload ne fonctionne pas
- [ ] Passer cette partie
- [ ] Montrer les fixspecs déjà générés
- [ ] Expliquer le mécanisme de cache (mtime)
- [ ] Montrer le code de hot-reload

---

## 📸 Captures d'écran de backup

### À préparer avant la démo
- [ ] **Dashboard complet** : Vue d'ensemble avec 5 métriques
- [ ] **Filtres actifs** : Montrer l'état actif sur "Accessibilité"
- [ ] **Liste d'issues** : Cartes avec ombres et badges
- [ ] **Détails + Fixspec** : Issue critique avec recommandations
- [ ] **Code source** : Commentaires KIRO-AI
- [ ] **Tests** : Terminal avec 67 tests passants
- [ ] **Architecture** : Diagramme du flow

---

## 🎨 Éléments visuels à mettre en avant

### Dashboard
- 5 cartes métriques avec icônes
- Bordures colorées à gauche
- Typographie hiérarchisée (2.5rem pour chiffres)
- Grid responsive

### Filtres
- Icônes expressives (⏱️♿🎨🚨)
- Compteurs dynamiques
- État actif avec bordure colorée
- Hover states fluides

### Liste
- Cartes avec ombres subtiles
- Badges avec icônes (🔴🟡🟢)
- Expand/collapse animé
- Espacements généreux

### Détails
- Fixspec structuré (résumé, étapes, code, références)
- Code formaté avec coloration
- Références WCAG cliquables
- Métadonnées JSON

---

## 🏆 Message de conclusion

**One-liner** :
> "AutoUX transforme vos logs en actions concrètes pour une UX parfaite. De la détection à la solution en 1 seconde."

**Call to action** :
> "Essayez-le maintenant : github.com/votre-repo/autoux"

**Remerciements** :
> "Merci à AWS pour l'infrastructure et à Kiro pour l'assistance IA qui a accéléré le développement."

---

## ✅ Checklist post-démo

### Immédiatement après
- [ ] Noter les questions posées
- [ ] Noter les feedbacks reçus
- [ ] Prendre contact avec les jurés intéressés
- [ ] Partager le lien GitHub

### Dans les 24h
- [ ] Envoyer un email de suivi aux jurés
- [ ] Publier sur LinkedIn/Twitter
- [ ] Mettre à jour le README avec feedbacks
- [ ] Préparer une vidéo de démo (1-2 min)

### Dans la semaine
- [ ] Implémenter les suggestions des jurés
- [ ] Ajouter les fonctionnalités demandées
- [ ] Préparer la présentation finale
- [ ] Célébrer ! 🎉

---

## 🎯 Objectifs de la démo

### Primaires
- ✅ Montrer la **valeur ajoutée** : Détection + Fixspecs IA
- ✅ Démontrer la **qualité technique** : Tests, accessibilité, design
- ✅ Impressionner avec l'**UI professionnelle** : Dashboard, filtres, cartes

### Secondaires
- ✅ Montrer le **hot-reload** (si temps)
- ✅ Expliquer la **roadmap** (SaaS, ML, intégrations)
- ✅ Mettre en avant le **branding AWS/Kiro**

### Bonus
- ✅ Montrer les **tests** (67 passants)
- ✅ Montrer le **code source** (commentaires KIRO-AI)
- ✅ Montrer l'**accessibilité** (navigation clavier)

---

**Bonne chance ! 🍀**

**Vous êtes prêt à gagner ce hackathon ! 🏆**
