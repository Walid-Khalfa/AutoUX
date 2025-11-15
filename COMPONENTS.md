# 📦 Documentation des composants AutoUX

## Vue d'ensemble

AutoUX utilise une architecture React moderne avec des composants fonctionnels et hooks. Chaque composant est conçu pour être accessible (WCAG AA), réutilisable et testé.

---

## 🎨 Composants Frontend

### 1. Dashboard.jsx

**Rôle** : Affiche un résumé visuel des issues détectées avec 5 métriques clés.

**Props** :
```typescript
interface DashboardProps {
  issues: Issue[];  // Liste complète des issues
}
```

**Métriques affichées** :
- Total des problèmes
- 🔴 Critiques (severity: high)
- 🟡 Moyennes (severity: medium)
- 🟢 Mineures (severity: low)
- 🧠 Catégories analysées (nombre de types uniques)

**Design** :
- Grid responsive : `repeat(auto-fit, minmax(200px, 1fr))`
- Cartes avec ombres : `box-shadow: 0 2px 8px rgba(0,0,0,0.08)`
- Bordures colorées à gauche selon la sévérité
- Typographie hiérarchisée (2.5rem pour les chiffres, 0.875rem pour les labels)

**Exemple d'utilisation** :
```jsx
<Dashboard issues={issues} />
```

---

### 2. CategoryFilter.jsx

**Rôle** : Permet de filtrer les issues par catégorie avec compteurs dynamiques et état actif visuel.

**Props** :
```typescript
interface CategoryFilterProps {
  issues: Issue[];                    // Liste complète des issues
  selectedCategory: string;           // Catégorie actuellement sélectionnée
  onSelectCategory: (id: string) => void;  // Callback lors du changement
}
```

**Catégories disponibles** :
- `all` : Toutes (📊)
- `latence` : Latence (⏱️)
- `accessibilité` : Accessibilité (♿)
- `contraste` : Contraste (🎨)
- `erreur JS` : Erreur JS (🚨)

**Fonctionnalités** :
- Compteurs dynamiques par catégorie
- État actif avec bordure colorée et fond teinté
- Hover states avec transition fluide
- Navigation clavier complète (Tab, Enter, Space)
- ARIA : `aria-pressed`, `aria-label` avec compteurs

**Exemple d'utilisation** :
```jsx
<CategoryFilter
  issues={issues}
  selectedCategory={selectedCategory}
  onSelectCategory={setSelectedCategory}
/>
```

---

### 3. IssueList.jsx

**Rôle** : Affiche la liste des issues groupées par catégorie avec expand/collapse.

**Props** :
```typescript
interface IssueListProps {
  issues: Issue[];                    // Issues à afficher (filtrées ou non)
  loading: boolean;                   // État de chargement
  onSelectIssue?: (issue: Issue) => void;  // Callback lors de la sélection
}
```

**Fonctionnalités** :
- Grouping automatique par type (catégorie)
- Expand/collapse par catégorie avec animation
- Badges de sévérité avec icônes (🔴🟡🟢) et tooltips
- Skeleton loader pendant le chargement
- Empty state : "Aucun problème détecté ✅"
- Cartes avec ombres et espacements généreux

**États** :
- **Loading** : Affiche 3 skeletons animés
- **Empty** : Message positif avec emoji
- **Loaded** : Liste groupée avec expand/collapse

**Exemple d'utilisation** :
```jsx
<IssueList
  issues={filteredIssues}
  loading={loading}
  onSelectIssue={setSelectedIssue}
/>
```

---

### 4. IssueDetail.jsx

**Rôle** : Affiche les détails d'une issue sélectionnée avec son fixspec associé.

**Props** :
```typescript
interface IssueDetailProps {
  issue: Issue | null;  // Issue à afficher (null = placeholder)
}
```

**Sections affichées** :
1. **En-tête** : Type + icône + badge de sévérité
2. **Description** : Message détaillé du problème
3. **Informations** : ID, timestamp, log source
4. **Métadonnées** : JSON formaté avec données techniques
5. **Fixspec** : Résumé, étapes, code, références

**Chargement du fixspec** :
- Fetch automatique via `useEffect` quand l'issue change
- États : loading, error, success, not found
- Affichage conditionnel selon l'état

**Exemple d'utilisation** :
```jsx
<IssueDetail issue={selectedIssue} />
```

---

### 5. ErrorBoundary.jsx

**Rôle** : Capture les erreurs React et affiche un fallback UI.

**Props** :
```typescript
interface ErrorBoundaryProps {
  children: React.ReactNode;
}
```

**Fonctionnalités** :
- Capture des erreurs avec `componentDidCatch`
- Affichage d'un message d'erreur user-friendly
- Bouton "Recharger la page" pour récupération
- Logging des erreurs en console

**Exemple d'utilisation** :
```jsx
<ErrorBoundary>
  <App />
</ErrorBoundary>
```

---

### 6. App.jsx

**Rôle** : Composant racine qui orchestre tous les autres composants.

**État géré** :
```typescript
const [issues, setIssues] = useState<Issue[]>([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState<string | null>(null);
const [selectedCategory, setSelectedCategory] = useState('all');
const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
```

**Layout** :
- Header avec gradient AWS/Kiro
- Dashboard avec métriques
- CategoryFilter avec compteurs
- Grid 2 colonnes : IssueList + IssueDetail (sticky)

**Exemple de structure** :
```jsx
<ErrorBoundary>
  <Header />
  <Dashboard issues={issues} />
  <CategoryFilter ... />
  <Grid>
    <IssueList ... />
    {selectedIssue && <IssueDetail ... />}
  </Grid>
</ErrorBoundary>
```

---

## 🔧 Services

### api.js

**Rôle** : Service pour communiquer avec le backend.

**Fonctions exportées** :

#### `fetchIssues()`
```typescript
async function fetchIssues(): Promise<Issue[]>
```
- Récupère toutes les issues depuis `/api/issues`
- Retry automatique sur erreurs 5xx (max 2 tentatives)
- Timeout de 10 secondes
- Retourne un tableau d'issues

#### `fetchIssueById(id)`
```typescript
async function fetchIssueById(id: string): Promise<Issue>
```
- Récupère une issue spécifique depuis `/api/issues/:id`
- Gestion d'erreurs 404
- Retourne l'issue ou throw une erreur

#### `fetchFixspecs()`
```typescript
async function fetchFixspecs(): Promise<Fixspec[]>
```
- Récupère tous les fixspecs depuis `/api/fixspecs`
- Retourne un tableau de fixspecs

**Fonctionnalités** :
- `fetchWithTimeout()` : Ajoute un timeout aux requêtes
- `fetchWithRetry()` : Retry automatique sur erreurs 5xx et réseau
- Gestion d'erreurs structurée avec messages clairs

---

## 🎨 Styles et Design System

### Palette de couleurs

```css
/* AWS/Kiro Branding */
--aws-blue: #0073bb;
--kiro-purple: #6b4eff;

/* Sévérité */
--critical-bg: #fef2f2;
--critical-text: #dc2626;
--critical-border: #fecaca;

--medium-bg: #fffbeb;
--medium-text: #d97706;
--medium-border: #fde68a;

--low-bg: #f0fdf4;
--low-text: #16a34a;
--low-border: #bbf7d0;

/* Neutrals */
--gray-50: #f9fafb;
--gray-100: #f3f4f6;
--gray-200: #e5e7eb;
--gray-400: #9ca3af;
--gray-600: #6b7280;
--gray-900: #111827;
```

### Typographie

```css
/* Titres */
h1: 2.25rem (36px), font-weight: 700
h2: 1.5rem (24px), font-weight: 600
h3: 1.125rem (18px), font-weight: 600

/* Corps */
body: 1rem (16px), font-weight: 400
small: 0.875rem (14px), font-weight: 400

/* Métriques */
dashboard-number: 2.5rem (40px), font-weight: bold
```

### Espacements

```css
/* Padding */
card-padding: 20-28px
section-padding: 16-24px
button-padding: 10-20px

/* Margin */
section-margin: 20-32px
element-margin: 8-16px

/* Gap */
grid-gap: 16-24px
flex-gap: 8-12px
```

### Ombres

```css
/* Cards */
box-shadow: 0 2px 8px rgba(0,0,0,0.08);

/* Hover */
box-shadow: 0 4px 12px rgba(0,0,0,0.12);

/* Active */
box-shadow: 0 0 0 3px {color}20;
```

### Bordures

```css
/* Radius */
card: 12px
button: 8px
badge: 16px

/* Width */
default: 1px
active: 2px
accent: 4px (left border)
```

---

## ♿ Accessibilité

### ARIA Labels

Tous les composants utilisent des ARIA labels appropriés :

```jsx
// Badges de sévérité
<span aria-label="🔴 Sévérité Critique">

// Boutons de filtre
<button aria-pressed={isActive} aria-label="Latence (2 problèmes)">

// Sections
<div role="region" aria-label="Liste des issues UX">

// Status
<div role="status" aria-live="polite" aria-busy="true">
```

### Navigation clavier

- **Tab** : Navigation entre éléments
- **Enter/Space** : Activation des boutons
- **Escape** : Fermeture des modales/détails
- **Arrow keys** : Navigation dans les listes (futur)

### Contraste

Tous les textes respectent WCAG AA (ratio ≥ 4.5:1) :
- Texte principal : #111827 sur #ffffff (ratio 16.1:1)
- Texte secondaire : #6b7280 sur #ffffff (ratio 5.7:1)
- Badges critiques : #dc2626 sur #fef2f2 (ratio 7.2:1)

### Focus visible

```css
*:focus-visible {
  outline: 2px solid #6b4eff;
  outline-offset: 2px;
}
```

---

## 🧪 Tests

### Tests de composants (Vitest + RTL)

Chaque composant a des tests couvrant :
- Rendu initial
- Props et états
- Interactions utilisateur
- Accessibilité (ARIA, keyboard)
- Edge cases (loading, error, empty)

**Exemple** :
```javascript
describe('Dashboard', () => {
  it('should display correct metrics', () => {
    const issues = [
      { severity: 'high', type: 'latence' },
      { severity: 'medium', type: 'accessibilité' },
    ];
    render(<Dashboard issues={issues} />);
    expect(screen.getByText('2')).toBeInTheDocument(); // Total
    expect(screen.getByText('1')).toBeInTheDocument(); // Critiques
  });
});
```

### Tests d'accessibilité

```javascript
it('should be keyboard accessible', () => {
  render(<CategoryFilter ... />);
  const button = screen.getByRole('button', { name: /Latence/ });
  
  fireEvent.focus(button);
  expect(button).toHaveStyle({ outline: '2px solid #6b4eff' });
  
  fireEvent.keyDown(button, { key: 'Enter' });
  expect(onSelectCategory).toHaveBeenCalled();
});
```

---

## 📊 Performance

### Optimisations

- **Lazy loading** : Composants chargés à la demande (futur)
- **Memoization** : `useMemo` pour calculs coûteux
- **Debounce** : 250ms sur les filtres de recherche
- **Virtual scrolling** : Pour listes longues (futur)

### Métriques

- **First Contentful Paint** : < 1s
- **Time to Interactive** : < 2s
- **Bundle size** : < 200KB (gzipped)
- **Lighthouse score** : 95+ (Performance, Accessibility, Best Practices)

---

## 🔄 Flux de données

```
User Action
    ↓
Component Event Handler
    ↓
State Update (useState)
    ↓
Re-render
    ↓
API Call (if needed)
    ↓
State Update with Response
    ↓
UI Update
```

**Exemple** : Filtrage par catégorie

```
1. User clicks "Latence (2)"
2. CategoryFilter calls onSelectCategory('latence')
3. App updates selectedCategory state
4. App filters issues array
5. IssueList re-renders with filtered issues
```

---

## 🚀 Évolutions futures

### Composants à ajouter

- **IssueChart** : Graphique donut pour répartition
- **Timeline** : Historique des issues dans le temps
- **SearchBar** : Recherche full-text dans les issues
- **ExportButton** : Export PDF/CSV des fixspecs
- **NotificationBanner** : Alertes pour nouvelles issues critiques

### Améliorations

- **Dark mode** : Thème sombre avec switch
- **Animations** : Transitions plus élaborées (Framer Motion)
- **Virtualization** : React Window pour listes longues
- **Offline support** : Service Worker + Cache API
- **i18n** : Support multi-langues (react-i18next)

---

**Documentation maintenue par l'équipe AutoUX**
