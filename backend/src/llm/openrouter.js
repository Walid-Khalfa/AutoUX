// KIRO-AI: Ne pas charger dotenv ici - déjà chargé dans server.js
import OpenAI from 'openai';

// KIRO-AI: Client OpenRouter pour analyse LLM des logs UX
// Utilise le modèle KAT-Coder-Pro (gratuit) via l'API compatible OpenAI
// Gère les rate limits (429) et indisponibilités (503) avec retour null pour fallback

// KIRO-AI: Vérification de la clé API avec fallback sur OPENAI_API_KEY
const apiKey = process.env.OPENROUTER_API_KEY || process.env.OPENAI_API_KEY;

if (!apiKey) {
  console.warn(
    "[OpenRouter] ⚠️ Aucune clé API trouvée. Configurez OPENROUTER_API_KEY dans backend/.env"
  );
  console.warn("[OpenRouter] Le système utilisera uniquement l'analyse locale (fallback)");
}

const client = new OpenAI({
  apiKey: apiKey || 'undefined-key',
  baseURL: process.env.OPENROUTER_BASE_URL || 'https://openrouter.ai/api/v1',
  defaultHeaders: {
    'HTTP-Referer': process.env.CORS_ORIGIN || 'http://localhost:5173',
    'X-Title': 'AutoUX - UX Issue Detection',
  },
});

/**
 * Appelle le LLM via OpenRouter avec gestion des erreurs
 * @param {Array} messages - Messages au format OpenAI [{role, content}]
 * @param {Object} opts - Options (temperature, max_tokens, etc.)
 * @returns {Promise<string|null>} Contenu de la réponse ou null si erreur
 */
// KIRO-AI: Fonction principale d'appel LLM avec fallback gracieux
// Retourne null en cas de rate limit (429) ou service indisponible (503)
// pour permettre au backend de basculer sur l'analyse heuristique locale
export async function callLLM(messages, opts = {}) {
  try {
    const completion = await client.chat.completions.create({
      model: process.env.OPENROUTER_MODEL || 'kwaipilot/kat-coder-pro:free',
      messages,
      temperature: opts.temperature ?? 0.2,
      max_tokens: opts.max_tokens ?? 4000,
      stream: false,
      ...opts,
    });

    const content = completion.choices[0]?.message?.content;
    
    if (!content) {
      console.warn('[KIRO-AI] OpenRouter returned empty response');
      return null;
    }

    return content;
  } catch (error) {
    // KIRO-AI: Gestion des erreurs spécifiques OpenRouter
    // 429 = rate limit dépassé (quota gratuit épuisé)
    // 503 = service temporairement indisponible
    if (error.status === 429) {
      console.warn('[KIRO-AI] OpenRouter rate limit reached (429) - falling back to local analysis');
      return null;
    }
    
    if (error.status === 503) {
      console.warn('[KIRO-AI] OpenRouter service unavailable (503) - falling back to local analysis');
      return null;
    }

    // Autres erreurs : on log mais on retourne null pour fallback
    console.error('[KIRO-AI] OpenRouter error:', error.message);
    return null;
  }
}

export default { callLLM };
