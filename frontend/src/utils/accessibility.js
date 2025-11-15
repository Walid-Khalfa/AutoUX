/**
 * Accessibility Utilities
 * 
 * Helper functions for accessibility testing and improvements
 * Requirements: 6.5, 8.4
 */

/**
 * Check if an element has sufficient color contrast
 * @param {string} foreground - Foreground color (hex or rgb)
 * @param {string} background - Background color (hex or rgb)
 * @param {number} minRatio - Minimum contrast ratio (4.5 for AA, 7 for AAA)
 * @returns {boolean} True if contrast is sufficient
 */
export function hasGoodContrast(foreground, background, minRatio = 4.5) {
  const fgLuminance = getRelativeLuminance(foreground);
  const bgLuminance = getRelativeLuminance(background);
  
  const lighter = Math.max(fgLuminance, bgLuminance);
  const darker = Math.min(fgLuminance, bgLuminance);
  
  const contrastRatio = (lighter + 0.05) / (darker + 0.05);
  
  return contrastRatio >= minRatio;
}

/**
 * Calculate relative luminance of a color
 * @param {string} color - Color in hex or rgb format
 * @returns {number} Relative luminance (0-1)
 */
function getRelativeLuminance(color) {
  const rgb = parseColor(color);
  
  const [r, g, b] = rgb.map(val => {
    val = val / 255;
    return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4);
  });
  
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/**
 * Parse color string to RGB array
 * @param {string} color - Color in hex or rgb format
 * @returns {Array<number>} RGB values [r, g, b]
 */
function parseColor(color) {
  // Handle hex colors
  if (color.startsWith('#')) {
    const hex = color.slice(1);
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);
    return [r, g, b];
  }
  
  // Handle rgb/rgba colors
  const match = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  if (match) {
    return [parseInt(match[1]), parseInt(match[2]), parseInt(match[3])];
  }
  
  return [0, 0, 0];
}

/**
 * Announce message to screen readers
 * @param {string} message - Message to announce
 * @param {string} priority - 'polite' or 'assertive'
 */
export function announceToScreenReader(message, priority = 'polite') {
  const announcement = document.createElement('div');
  announcement.setAttribute('role', 'status');
  announcement.setAttribute('aria-live', priority);
  announcement.setAttribute('aria-atomic', 'true');
  announcement.className = 'sr-only';
  announcement.textContent = message;
  
  document.body.appendChild(announcement);
  
  // Remove after announcement
  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
}

/**
 * Check if user prefers reduced motion
 * @returns {boolean} True if reduced motion is preferred
 */
export function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Check if user prefers high contrast
 * @returns {boolean} True if high contrast is preferred
 */
export function prefersHighContrast() {
  return window.matchMedia('(prefers-contrast: high)').matches;
}

/**
 * Check if user prefers dark mode
 * @returns {boolean} True if dark mode is preferred
 */
export function prefersDarkMode() {
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

/**
 * Trap focus within an element (for modals)
 * @param {HTMLElement} element - Element to trap focus within
 * @returns {Function} Cleanup function
 */
export function trapFocus(element) {
  const focusableElements = element.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  
  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];
  
  const handleKeyDown = (e) => {
    if (e.key !== 'Tab') return;
    
    if (e.shiftKey) {
      if (document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      }
    } else {
      if (document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    }
  };
  
  element.addEventListener('keydown', handleKeyDown);
  
  // Focus first element
  firstElement?.focus();
  
  // Return cleanup function
  return () => {
    element.removeEventListener('keydown', handleKeyDown);
  };
}

/**
 * Get accessible name for an element
 * @param {HTMLElement} element - Element to get name for
 * @returns {string} Accessible name
 */
export function getAccessibleName(element) {
  // Check aria-label
  if (element.hasAttribute('aria-label')) {
    return element.getAttribute('aria-label');
  }
  
  // Check aria-labelledby
  if (element.hasAttribute('aria-labelledby')) {
    const id = element.getAttribute('aria-labelledby');
    const labelElement = document.getElementById(id);
    return labelElement?.textContent || '';
  }
  
  // Check label element (for form inputs)
  if (element.id) {
    const label = document.querySelector(`label[for="${element.id}"]`);
    if (label) return label.textContent;
  }
  
  // Check title attribute
  if (element.hasAttribute('title')) {
    return element.getAttribute('title');
  }
  
  // Check alt attribute (for images)
  if (element.hasAttribute('alt')) {
    return element.getAttribute('alt');
  }
  
  // Fallback to text content
  return element.textContent || '';
}

/**
 * Check if element is keyboard accessible
 * @param {HTMLElement} element - Element to check
 * @returns {boolean} True if keyboard accessible
 */
export function isKeyboardAccessible(element) {
  // Check if element is focusable
  const tabindex = element.getAttribute('tabindex');
  if (tabindex === '-1') return false;
  
  // Check if element is interactive
  const interactiveTags = ['A', 'BUTTON', 'INPUT', 'SELECT', 'TEXTAREA'];
  if (interactiveTags.includes(element.tagName)) return true;
  
  // Check if element has role that makes it interactive
  const interactiveRoles = ['button', 'link', 'checkbox', 'radio', 'tab', 'menuitem'];
  const role = element.getAttribute('role');
  if (role && interactiveRoles.includes(role)) return true;
  
  // Check if element has tabindex >= 0
  if (tabindex && parseInt(tabindex) >= 0) return true;
  
  return false;
}

/**
 * Run basic accessibility checks on the page
 * @returns {Array<Object>} Array of accessibility issues found
 */
export function runAccessibilityChecks() {
  const issues = [];
  
  // Check for images without alt text
  document.querySelectorAll('img').forEach(img => {
    if (!img.hasAttribute('alt')) {
      issues.push({
        type: 'missing-alt',
        element: img,
        message: 'Image missing alt attribute',
        severity: 'critical'
      });
    }
  });
  
  // Check for buttons without accessible names
  document.querySelectorAll('button').forEach(button => {
    const name = getAccessibleName(button);
    if (!name || name.trim() === '') {
      issues.push({
        type: 'missing-label',
        element: button,
        message: 'Button missing accessible name',
        severity: 'critical'
      });
    }
  });
  
  // Check for form inputs without labels
  document.querySelectorAll('input, select, textarea').forEach(input => {
    if (input.type === 'hidden') return;
    
    const name = getAccessibleName(input);
    if (!name || name.trim() === '') {
      issues.push({
        type: 'missing-label',
        element: input,
        message: 'Form input missing label',
        severity: 'critical'
      });
    }
  });
  
  // Check for links without accessible names
  document.querySelectorAll('a').forEach(link => {
    const name = getAccessibleName(link);
    if (!name || name.trim() === '') {
      issues.push({
        type: 'missing-label',
        element: link,
        message: 'Link missing accessible name',
        severity: 'high'
      });
    }
  });
  
  // Check for missing page title
  if (!document.title || document.title.trim() === '') {
    issues.push({
      type: 'missing-title',
      element: document,
      message: 'Page missing title',
      severity: 'critical'
    });
  }
  
  // Check for missing lang attribute
  if (!document.documentElement.hasAttribute('lang')) {
    issues.push({
      type: 'missing-lang',
      element: document.documentElement,
      message: 'HTML element missing lang attribute',
      severity: 'high'
    });
  }
  
  return issues;
}

/**
 * Log accessibility issues to console
 * @param {Array<Object>} issues - Array of accessibility issues
 */
export function logAccessibilityIssues(issues) {
  // Only log in development mode
  if (import.meta.env.PROD) return;
  
  if (issues.length === 0) {
    console.log('%c✓ No accessibility issues found', 'color: green; font-weight: bold');
    return;
  }
  
  console.group(`%c⚠️ Found ${issues.length} accessibility issue(s)`, 'color: orange; font-weight: bold');
  
  issues.forEach((issue, index) => {
    const color = issue.severity === 'critical' ? 'red' : issue.severity === 'high' ? 'orange' : 'yellow';
    console.log(`%c${index + 1}. [${issue.severity.toUpperCase()}] ${issue.message}`, `color: ${color}`);
    console.log('Element:', issue.element);
  });
  
  console.groupEnd();
}

/**
 * Initialize accessibility monitoring (development only)
 */
export function initAccessibilityMonitoring() {
  if (import.meta.env.PROD) return;
  
  console.log('%c🔍 Accessibility Monitoring Enabled', 'color: blue; font-weight: bold');
  
  // Run checks on page load
  window.addEventListener('load', () => {
    setTimeout(() => {
      const issues = runAccessibilityChecks();
      logAccessibilityIssues(issues);
    }, 1000);
  });
  
  // Monitor for reduced motion preference changes
  window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', (e) => {
    if (import.meta.env.DEV) {
      console.log(`%cReduced motion preference changed: ${e.matches}`, 'color: blue');
    }
  });
  
  // Monitor for high contrast preference changes
  window.matchMedia('(prefers-contrast: high)').addEventListener('change', (e) => {
    if (import.meta.env.DEV) {
      console.log(`%cHigh contrast preference changed: ${e.matches}`, 'color: blue');
    }
  });
  
  // Monitor for dark mode preference changes
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (import.meta.env.DEV) {
      console.log(`%cDark mode preference changed: ${e.matches}`, 'color: blue');
    }
  });
}
