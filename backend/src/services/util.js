import { randomUUID } from "node:crypto";

/**
 * Génère un identifiant unique avec un préfixe optionnel
 * @param {string} pfx - Préfixe pour l'identifiant (par défaut "id")
 * @returns {string} Identifiant unique au format "préfixe-uuid"
 */
// KIRO-AI: Génère des IDs uniques pour les issues et fixspecs
// Utilise randomUUID natif de Node.js pour garantir l'unicité
export const uid = (pfx = "id") => `${pfx}-${randomUUID()}`;

/**
 * Convertit une latence en millisecondes en niveau de sévérité
 * @param {number} ms - Temps de latence en millisecondes
 * @returns {"high" | "medium" | "low"} Niveau de sévérité
 */
// KIRO-AI: Détermine la sévérité d'un problème de latence selon des seuils Web Vitals
// Seuils basés sur les recommandations de performance web:
// - high (>5000ms): Impact critique sur l'expérience utilisateur
// - medium (3000-5000ms): Impact modéré, optimisation recommandée
// - low (<3000ms): Impact mineur, mais détecté comme problème potentiel
export const latencyToSeverity = (ms) => {
  if (ms > 5000) return "high";
  if (ms > 3000) return "medium";
  return "low";
};
