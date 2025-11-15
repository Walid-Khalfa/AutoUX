import fs from "node:fs";
import path from "node:path";
import { FIXSPECS_DIR } from "../config/paths.js";
import { uid } from "./util.js";

// KIRO-AI: References to WCAG 2.2 and Web Vitals standards
// These constants allow including normative references in fixspecs
// to guide developers toward accessibility and performance best practices
const WCAG = {
  CONTRAST: "WCAG 2.2 – 1.4.3 (Contrast Minimum)",
  ALT_TEXT: "WCAG 2.2 – 1.1.1 (Non-text Content)",
  KEYBOARD: "WCAG 2.2 – 2.1.1 (Keyboard)",
  ARIA: "WCAG 2.2 – 4.1.2 (Name, Role, Value)",
};

const WEB_VITALS = {
  LCP: "Web Vitals – LCP (Largest Contentful Paint) < 2.5s",
  CLS: "Web Vitals – CLS (Cumulative Layout Shift) < 0.1",
  INP: "Web Vitals – INP (Interaction to Next Paint) < 200ms",
};

/**
 * Generates specific fix recommendations based on issue type
 * @param {string} issueType - Issue type (latency, accessibility, contrast, JS error)
 * @param {Issue} issue - The detected issue with its metadata
 * @returns {Object} suggestedFix object with summary, steps, codeExample and references
 */
// KIRO-AI: Generates contextual and actionable recommendations for each issue type
// Each issue type has specific recommendations based on web standards
// Can be extended to add new issue types or refine recommendations
export const getSuggestedFix = (issueType, issue) => {
  switch (issueType) {
    case "latence": {
      const responseTime = issue.metadata?.responseTime || 0;
      const endpoint = issue.metadata?.endpoint || "endpoint";
      
      return {
        summary: `Optimize response time for ${endpoint} (currently ${responseTime}ms)`,
        steps: [
          "Analyze database queries with a profiler",
          "Implement a caching system (Redis, Memcached)",
          "Optimize N+1 queries with eager loading",
          "Compress responses with gzip/brotli",
          "Use a CDN for static resources",
          "Implement pagination for large lists",
        ],
        codeExample: `// Example: Cache with Redis
import redis from 'redis';
const client = redis.createClient();

app.get('${endpoint}', async (req, res) => {
  const cacheKey = 'data:' + req.params.id;
  const cached = await client.get(cacheKey);
  
  if (cached) {
    return res.json(JSON.parse(cached));
  }
  
  const data = await fetchData(req.params.id);
  await client.setEx(cacheKey, 3600, JSON.stringify(data));
  res.json(data);
});`,
        references: [
          WEB_VITALS.LCP,
          WEB_VITALS.INP,
          "https://web.dev/optimize-lcp/",
          "https://web.dev/optimize-inp/",
        ],
      };
    }

    case "accessibilité": {
      const violation = issue.metadata?.violation;
      const element = issue.metadata?.element || "element";
      
      // KIRO-AI: Specific recommendations based on accessibility violation type
      if (violation === "missing-alt-text" || issue.description.includes("alt")) {
        return {
          summary: `Add descriptive alt attribute to image ${element}`,
          steps: [
            "Identify all images without alt attribute",
            "Add descriptive alternative text (not just the filename)",
            "Use alt=\"\" for decorative images",
            "Test with a screen reader (NVDA, JAWS, VoiceOver)",
          ],
          codeExample: `<!-- Before -->
<img src="${element}" />

<!-- After -->
<img src="${element}" alt="Clear description of the image" />

<!-- For decorative image -->
<img src="decoration.png" alt="" role="presentation" />`,
          references: [
            WCAG.ALT_TEXT,
            "https://www.w3.org/WAI/tutorials/images/",
          ],
        };
      }
      
      if (violation === "invalid-aria-attribute" || issue.description.includes("ARIA")) {
        return {
          summary: `Fix invalid ARIA attributes on ${element}`,
          steps: [
            "Verify ARIA attribute validity with a validator",
            "Ensure ARIA roles are appropriate for the element",
            "Use aria-label or aria-labelledby for interactive elements",
            "Test with axe DevTools or WAVE",
          ],
          codeExample: `<!-- Before -->
<div role="button" aria-pressed="maybe">Click me</div>

<!-- After -->
<button aria-pressed="false" aria-label="Toggle feature">
  Click me
</button>`,
          references: [
            WCAG.ARIA,
            "https://www.w3.org/WAI/ARIA/apg/",
          ],
        };
      }
      
      if (violation === "no-keyboard-access" || issue.description.includes("keyboard") || issue.description.includes("clavier")) {
        return {
          summary: `Make ${element} keyboard accessible`,
          steps: [
            "Add tabindex=\"0\" to make the element focusable",
            "Implement keyboard event handlers (Enter, Space)",
            "Add a visible focus indicator (outline or border)",
            "Test complete keyboard navigation (Tab, Shift+Tab)",
          ],
          codeExample: `<!-- Before -->
<div onclick="handleClick()">Click me</div>

<!-- After -->
<div 
  role="button" 
  tabindex="0"
  onclick="handleClick()"
  onkeydown="(e) => (e.key === 'Enter' || e.key === ' ') && handleClick()"
  style="outline: 2px solid blue; outline-offset: 2px;"
>
  Click me
</div>

<!-- Better: use a real button -->
<button onclick="handleClick()">Click me</button>`,
          references: [
            WCAG.KEYBOARD,
            "https://www.w3.org/WAI/WCAG22/Understanding/keyboard",
          ],
        };
      }
      
      // Generic recommendation for accessibility
      return {
        summary: `Fix accessibility issue on ${element}`,
        steps: [
          "Audit the element with axe DevTools or Lighthouse",
          "Consult WCAG 2.2 recommendations for this type of issue",
          "Implement recommended fixes",
          "Test with screen readers and keyboard navigation",
        ],
        references: [
          "WCAG 2.2 Guidelines",
          "https://www.w3.org/WAI/WCAG22/quickref/",
        ],
      };
    }

    case "contraste": {
      const contrastRatio = issue.metadata?.contrastRatio || 0;
      const element = issue.metadata?.element || "element";
      const foreground = issue.metadata?.foreground;
      const background = issue.metadata?.background;
      
      return {
        summary: `Improve contrast for ${element} (current ratio: ${contrastRatio.toFixed(2)}:1, required: 4.5:1)`,
        steps: [
          "Use a contrast checking tool (WebAIM, Contrast Checker)",
          "Adjust colors to achieve a minimum ratio of 4.5:1",
          "For large text (18pt+), a ratio of 3:1 is acceptable",
          "Test with different modes (light, dark, color blindness)",
          "Document accessible colors in a design system",
        ],
        codeExample: `/* Before (insufficient contrast) */
.${element} {
  color: ${foreground || "#999"};
  background: ${background || "#fff"};
}

/* After (improved contrast) */
.${element} {
  color: #333; /* Ratio 12.6:1 with white background */
  background: #fff;
}

/* Alternative with dark background */
.${element} {
  color: #fff;
  background: #1a1a1a; /* Ratio 15.3:1 */
}`,
        references: [
          WCAG.CONTRAST,
          "https://webaim.org/resources/contrastchecker/",
          "https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum",
        ],
      };
    }

    case "erreur JS": {
      const errorMessage = issue.metadata?.errorMessage || issue.description;
      const component = issue.metadata?.component || "component";
      const file = issue.metadata?.file;
      
      return {
        summary: `Fix JavaScript error in ${component}`,
        steps: [
          "Analyze the stack trace to identify the error source",
          "Add appropriate error handling (try-catch, error boundary)",
          "Validate input data before processing",
          "Implement a fallback UI in case of error",
          "Log the error for monitoring (Sentry, LogRocket)",
          "Add unit tests to prevent regression",
        ],
        codeExample: `// Before
function ${component}(data) {
  return data.items.map(item => item.value);
}

// After (with validation and error handling)
function ${component}(data) {
  try {
    if (!data || !Array.isArray(data.items)) {
      console.error('Invalid data structure:', data);
      return [];
    }
    
    return data.items
      .filter(item => item && typeof item.value !== 'undefined')
      .map(item => item.value);
  } catch (error) {
    console.error('Error in ${component}:', error);
    // Send to monitoring service
    // Sentry.captureException(error);
    return [];
  }
}

// Pour React: Error Boundary
class ErrorBoundary extends React.Component {
  state = { hasError: false };
  
  static getDerivedStateFromError(error) {
    return { hasError: true };
  }
  
  componentDidCatch(error, info) {
    console.error('Error caught:', error, info);
  }
  
  render() {
    if (this.state.hasError) {
      return <div>Une erreur est survenue. Veuillez réessayer.</div>;
    }
    return this.props.children;
  }
}`,
        references: [
          "MDN: Error handling",
          "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Control_flow_and_error_handling",
          "React Error Boundaries: https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary",
        ],
      };
    }

    default:
      return {
        summary: "Corriger le problème détecté",
        steps: ["Analyser le problème", "Implémenter un correctif", "Tester la solution"],
        references: [],
      };
  }
};

/**
 * Génère un fixspec complet pour une issue donnée
 * @param {Issue} issue - L'issue UX détectée
 * @returns {Fixspec} Le fixspec généré avec toutes les recommandations
 */
// KIRO-AI: Génère un document de spécification de correctif structuré
// Combine les informations de l'issue avec des recommandations contextuelles
// Le fixspec peut être utilisé par les développeurs ou des outils d'automatisation
export const generateFixspec = (issue) => {
  const suggestedFix = getSuggestedFix(issue.type, issue);
  
  return {
    issueId: issue.id,
    type: issue.type,
    description: issue.description,
    severity: issue.severity,
    suggestedFix,
    timestamp: new Date().toISOString(),
    status: "pending",
  };
};

/**
 * Sauvegarde un fixspec sur le disque de manière idempotente
 * Ne crée le fichier que s'il n'existe pas déjà
 * @param {Fixspec} fixspec - Le fixspec à sauvegarder
 * @returns {Promise<boolean>} true si le fixspec a été créé, false s'il existait déjà
 */
// KIRO-AI: Implémente l'idempotence pour éviter de recréer des fixspecs existants
// Vérifie l'existence du fichier avant écriture pour garantir qu'un fixspec n'est créé qu'une seule fois
// Retourne un booléen pour permettre au code appelant de logger uniquement les nouvelles créations
export const saveFixspecOnce = async (fixspec) => {
  // Créer le répertoire fixspecs s'il n'existe pas
  if (!fs.existsSync(FIXSPECS_DIR)) {
    fs.mkdirSync(FIXSPECS_DIR, { recursive: true });
  }
  
  const filename = `${fixspec.issueId}.json`;
  const filepath = path.join(FIXSPECS_DIR, filename);
  
  // KIRO-AI: Vérification d'idempotence - ne créer que si le fichier n'existe pas
  // Cela évite d'écraser des fixspecs qui auraient pu être modifiés manuellement
  if (fs.existsSync(filepath)) {
    return false; // Fixspec déjà existant, pas de création
  }
  
  // Sauvegarder le fixspec avec indentation pour lisibilité
  fs.writeFileSync(filepath, JSON.stringify(fixspec, null, 2), "utf-8");
  
  // KIRO-AI: Logger pour observabilité (démo)
  // Permet de tracer la création de fixspecs dans les logs du serveur
  console.log(`[KIRO-AI] Fixspec créé: ${filename} (type: ${fixspec.type}, sévérité: ${fixspec.severity})`);
  
  return true; // Nouveau fixspec créé
};

