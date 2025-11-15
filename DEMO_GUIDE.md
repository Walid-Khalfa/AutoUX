# 🎥 Guide de Démo - AutoUX Hackathon

## 🎯 Objectif de la Démo (5 minutes)

Montrer comment AutoUX détecte automatiquement les problèmes UX dans des logs et génère des recommandations actionnables avec l'IA.

## 📋 Script de Démo

### 1. Introduction (30 secondes)

**À dire :**
> "Bonjour ! Je vous présente AutoUX, un système intelligent qui analyse automatiquement vos logs pour détecter les problèmes d'expérience utilisateur. Il utilise l'IA (KAT-Coder-Pro) pour générer des recommandations conformes aux standards WCAG et Web Vitals."

**À montrer :**
- Page d'accueil avec header AWS/Kiro
- Zone d'upload bien visible

### 2. Upload de Fichiers (1 minute)

**À dire :**
> "AutoUX supporte 10 formats de logs : JSON, CSV, HAR, XML, HTML, et plus. Je vais uploader un fichier de logs de production."

**À faire :**
1. Glisser-déposer `test-logs.json` dans la zone d'upload
2. Montrer le loader "Analyse en cours..."
3. Attendre 2-3 secondes

**À montrer :**
- Animation de drag & drop
- Loader avec message "Analyse de X fichier(s) avec KAT-Coder-Pro..."

### 3. Dashboard et Statistiques (1 minute)

**À dire :**
> "Voici le dashboard. On voit immédiatement : 7 problèmes détectés, dont 5 critiques. Le graphique donut montre la répartition par type. Le badge violet indique que l'analyse a été faite par l'IA."

**À montrer :**
- Badge "🧠 Analysé par KAT-Coder-Pro"
- Carte "Total des problèmes" avec badges de sévérité
- Graphique donut avec légende
- Résumé textuel généré par l'IA

**Points clés :**
- Hiérarchie visuelle claire
- Couleurs AWS/Kiro cohérentes
- Métriques immédiatement compréhensibles

### 4. Filtrage et Navigation (1 minute)

**À dire :**
> "Les filtres dynamiques montrent le nombre d'issues par catégorie. Je clique sur 'Latence' pour voir uniquement les problèmes de performance."

**À faire :**
1. Cliquer sur le filtre "Latence (2)"
2. Montrer que la liste se met à jour
3. Cliquer sur "Accessibilité (3)"

**À montrer :**
- Compteurs sur chaque filtre
- État actif avec bordure colorée
- Animation smooth lors du changement
- Icônes pour chaque catégorie

### 5. Détails et Fixspec (1 minute 30)

**À dire :**
> "En cliquant sur une issue, on obtient le fixspec complet : description, métadonnées, et surtout les recommandations de correction avec exemple de code et références WCAG."

**À faire :**
1. Cliquer sur "Temps de réponse élevé détecté: 5500ms"
2. Scroller pour montrer toutes les sections
3. Pointer les références WCAG et Web Vitals

**À montrer :**
- Badge de sévérité avec couleur
- Métadonnées structurées
- Section "Spécification de correctif" :
  - Résumé actionnable
  - Étapes de correction numérotées
  - Exemple de code avec syntax highlighting
  - Références WCAG 2.2 et Web Vitals

**Points clés :**
- Recommandations concrètes et actionnables
- Code prêt à copier-coller
- Standards web (WCAG, Web Vitals)

### 6. Export et Fallback (30 secondes)

**À dire :**
> "On peut télécharger le rapport complet en JSON. Et si le quota gratuit de l'IA est atteint, AutoUX bascule automatiquement sur l'analyse locale sans interruption."

**À faire :**
1. Cliquer sur "📥 Télécharger le rapport (.json)"
2. Montrer le fichier téléchargé

**À montrer :**
- Bouton de téléchargement stylisé
- Fichier JSON bien formaté

### 7. Conclusion (30 secondes)

**À dire :**
> "En résumé, AutoUX c'est : analyse IA intelligente, support multi-formats, dashboard visuel, recommandations WCAG, et fallback local. Le tout avec une interface accessible et moderne. Merci !"

**À montrer :**
- Scroll rapide de toute l'interface
- Pointer le header avec "Powered by Amazon Q + Kiro"

## 🎬 Conseils de Présentation

### Avant la Démo
- [ ] Lancer `npm run dev` 5 minutes avant
- [ ] Ouvrir http://localhost:5173 dans un navigateur propre
- [ ] Préparer `test-logs.json` sur le bureau
- [ ] Tester une fois le flow complet
- [ ] Fermer les onglets inutiles
- [ ] Zoom navigateur à 110% pour meilleure visibilité

### Pendant la Démo
- [ ] Parler lentement et clairement
- [ ] Pointer avec la souris les éléments importants
- [ ] Laisser 1-2 secondes de pause après chaque action
- [ ] Sourire et maintenir le contact visuel
- [ ] Gérer le timing : 5 minutes max

### En Cas de Problème
- **Backend ne démarre pas** : Vérifier que le port 3001 est libre
- **Frontend ne charge pas** : Vérifier que le port 5173 est libre
- **Upload échoue** : Utiliser le fichier `data/logs.json` en backup
- **LLM timeout** : Montrer le fallback local (badge orange)

## 📊 Points à Mettre en Avant

### Innovation Technique
1. **Analyse LLM** : KAT-Coder-Pro via OpenRouter (gratuit)
2. **Fallback résilient** : Bascule automatique sur analyse locale
3. **Multi-formats** : 10 formats supportés (JSON, CSV, HAR, XML, etc.)
4. **Hot-reload** : Détection automatique des changements de logs

### Qualité UX
1. **Dashboard visuel** : Graphiques, métriques, badges
2. **Palette cohérente** : AWS + Kiro (bleu #0073bb, violet #6b4eff)
3. **Accessibilité WCAG AA** : Contraste, ARIA, navigation clavier
4. **Animations smooth** : Transitions 0.3s, hover effects

### Standards Web
1. **WCAG 2.2** : Références précises (1.4.3, 1.1.1, 2.1.1, 4.1.2)
2. **Web Vitals** : LCP, CLS, INP
3. **Recommandations actionnables** : Code + rationale + références

### Robustesse
1. **Tests** : 67 tests passants (backend + frontend)
2. **Validation** : Zod schemas pour tous les formats
3. **Gestion d'erreurs** : Retry automatique, fallback, messages clairs
4. **Observabilité** : Logs KIRO-AI pour debugging

## 🏆 Questions Fréquentes du Jury

### Q: "Pourquoi utiliser un LLM pour analyser des logs ?"
**R:** "Le LLM apporte une analyse contextuelle et génère des recommandations personnalisées. Mais on a aussi un fallback local pour garantir la disponibilité même si le quota est atteint."

### Q: "Comment gérez-vous les faux positifs ?"
**R:** "On utilise des seuils basés sur les standards Web Vitals (3000ms pour latence) et WCAG (4.5:1 pour contraste). Le LLM peut aussi filtrer les faux positifs grâce à son analyse contextuelle."

### Q: "Quel est le coût de l'analyse LLM ?"
**R:** "On utilise KAT-Coder-Pro qui est gratuit via OpenRouter. Pour la production, on peut basculer sur un modèle payant ou utiliser uniquement l'analyse locale."

### Q: "Comment intégrer AutoUX dans un pipeline CI/CD ?"
**R:** "On peut appeler l'API POST /api/upload depuis un script CI/CD, analyser le rapport JSON retourné, et faire échouer le build si trop de problèmes critiques."

### Q: "Quels formats de logs supportez-vous ?"
**R:** "10 formats : JSON, NDJSON, CSV, XML, HTML, HAR (Chrome DevTools), TXT, LOG. On parse intelligemment chaque format et on normalise vers notre schéma unifié."

### Q: "Comment garantissez-vous l'accessibilité ?"
**R:** "On respecte WCAG 2.2 niveau AA : contraste ≥4.5:1, ARIA labels, navigation clavier, focus visible. On a aussi des tests d'accessibilité avec axe-core."

## 📸 Captures d'Écran Recommandées

1. **Header** : Gradient AWS/Kiro avec titre
2. **Upload zone** : Drag & drop avec formats supportés
3. **Dashboard** : Graphique donut + statistiques
4. **Filtres** : Boutons avec compteurs et icônes
5. **Liste** : Issues groupées par catégorie
6. **Détails** : Fixspec avec code et références
7. **Badge LLM** : "Analysé par KAT-Coder-Pro"

## ⏱️ Timing Détaillé

| Section | Durée | Cumul |
|---------|-------|-------|
| Introduction | 30s | 0:30 |
| Upload | 1min | 1:30 |
| Dashboard | 1min | 2:30 |
| Filtrage | 1min | 3:30 |
| Détails | 1min30 | 5:00 |
| Export | 30s | 5:30 |
| Conclusion | 30s | 6:00 |

**Total** : 6 minutes (marge de 1 minute)

---

**Bonne chance pour le hackathon ! 🚀**
