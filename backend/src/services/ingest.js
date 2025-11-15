import fs from 'node:fs';
import { parse as csvParse } from 'csv-parse/sync';
import { parseString as parseXML } from 'xml2js';
import { convert as htmlToText } from 'html-to-text';
import { LogEntrySchema } from '../schemas/index.js';
import { uid } from './util.js';

// KIRO-AI: Service d'ingestion multi-formats pour logs UX
// Supporte JSON, NDJSON, CSV, XML, HTML, HAR, TXT et logs bruts
// Normalise tous les formats vers notre schéma LogEntry unifié

/**
 * Parse a standard JSON file
 * @param {string} content - File content
 * @returns {Array<LogEntry>} Normalized log entries
 */
function parseJSON(content) {
  try {
    const data = JSON.parse(content);
    return Array.isArray(data) ? data : [data];
  } catch (error) {
    console.warn('[KIRO-AI] JSON parse error:', error.message);
    return [];
  }
}

/**
 * Parse an NDJSON file (newline-delimited JSON)
 * @param {string} content - File content
 * @returns {Array<LogEntry>} Normalized log entries
 */
// KIRO-AI: NDJSON = une ligne JSON par entrée de log
// Format courant pour les logs de production (Elasticsearch, CloudWatch, etc.)
function parseNDJSON(content) {
  const entries = [];
  const lines = content.split('\n').filter(line => line.trim());
  
  for (const line of lines) {
    try {
      const entry = JSON.parse(line);
      entries.push(entry);
    } catch (error) {
      // Si la ligne n'est pas du JSON, on la traite comme un log texte
      entries.push({
        id: uid('log'),
        timestamp: new Date().toISOString(),
        type: 'ui',
        message: line,
        metadata: {},
      });
    }
  }
  
  return entries;
}

/**
 * Parse a CSV file
 * @param {string} content - File content
 * @returns {Array<LogEntry>} Normalized log entries
 */
// KIRO-AI: CSV = format tabulaire, on mappe les colonnes vers notre schéma
// Colonnes attendues : timestamp, type, message, severity, etc.
function parseCSV(content) {
  try {
    const records = csvParse(content, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
    });
    
    return records.map(record => ({
      id: record.id || uid('log'),
      timestamp: record.timestamp || new Date().toISOString(),
      type: record.type || 'ui',
      category: record.category,
      message: record.message || '',
      metadata: {
        ...record,
        // Nettoyer les champs déjà mappés
        id: undefined,
        timestamp: undefined,
        type: undefined,
        category: undefined,
        message: undefined,
      },
    }));
  } catch (error) {
    console.warn('[KIRO-AI] CSV parse error:', error.message);
    return [];
  }
}

/**
 * Parse an XML file
 * @param {string} content - File content
 * @returns {Promise<Array<LogEntry>>} Normalized log entries
 */
// KIRO-AI: XML = format structuré, on extrait les nœuds <log> ou <entry>
function parseXMLAsync(content) {
  return new Promise((resolve) => {
    parseXML(content, { explicitArray: false }, (err, result) => {
      if (err) {
        console.warn('[KIRO-AI] XML parse error:', err.message);
        resolve([]);
        return;
      }
      
      // Tenter d'extraire les logs depuis différentes structures XML
      const logs = result?.logs?.log || result?.entries?.entry || result?.log || [];
      const entries = Array.isArray(logs) ? logs : [logs];
      
      resolve(entries.map(entry => ({
        id: entry.id || entry.$.id || uid('log'),
        timestamp: entry.timestamp || entry.$.timestamp || new Date().toISOString(),
        type: entry.type || entry.$.type || 'ui',
        category: entry.category || entry.$.category,
        message: entry.message || entry._ || '',
        metadata: entry.metadata || {},
      })));
    });
  });
}

/**
 * Parse a HAR file (HTTP Archive)
 * @param {string} content - File content
 * @returns {Array<LogEntry>} Normalized log entries
 */
// KIRO-AI: HAR = format d'archive HTTP (Chrome DevTools, Firefox, etc.)
// On extrait les requêtes avec leur temps de réponse pour détecter les latences
function parseHAR(content) {
  try {
    const har = JSON.parse(content);
    const entries = har.log?.entries || [];
    
    return entries.map(entry => ({
      id: uid('log'),
      timestamp: entry.startedDateTime || new Date().toISOString(),
      type: 'performance',
      category: 'network',
      message: `${entry.request.method} ${entry.request.url}`,
      metadata: {
        responseTime: entry.time,
        endpoint: entry.request.url,
        method: entry.request.method,
        statusCode: entry.response.status,
        size: entry.response.content.size,
      },
    }));
  } catch (error) {
    console.warn('[KIRO-AI] HAR parse error:', error.message);
    return [];
  }
}

/**
 * Parse an HTML file
 * @param {string} content - File content
 * @returns {Array<LogEntry>} Normalized log entries
 */
// KIRO-AI: HTML = extract text and search for error patterns
// Useful for analyzing Lighthouse reports, axe-core, etc.
function parseHTML(content) {
  try {
    const text = htmlToText(content, {
      wordwrap: false,
      selectors: [
        { selector: 'script', format: 'skip' },
        { selector: 'style', format: 'skip' },
      ],
    });
    
    // Limiter à ~200 lignes pour éviter de surcharger le contexte LLM
    const lines = text.split('\n').filter(line => line.trim()).slice(0, 200);
    
    return [{
      id: uid('log'),
      timestamp: new Date().toISOString(),
      type: 'ui',
      category: 'html-report',
      message: lines.join('\n'),
      metadata: {
        lineCount: lines.length,
        source: 'html',
      },
    }];
  } catch (error) {
    console.warn('[KIRO-AI] HTML parse error:', error.message);
    return [];
  }
}

/**
 * Parse a plain text file
 * @param {string} content - File content
 * @returns {Array<LogEntry>} Normalized log entries
 */
// KIRO-AI: TXT = logs bruts, on essaie de détecter des patterns
// Chaque ligne devient une entrée si elle contient des mots-clés (error, warning, etc.)
function parseTXT(content) {
  const lines = content.split('\n').filter(line => line.trim());
  const entries = [];
  
  for (const line of lines) {
    // Détecter le type de log par mots-clés
    let type = 'ui';
    let category = 'log';
    
    if (/error|exception|fail/i.test(line)) {
      type = 'error';
      category = 'javascript';
    } else if (/warn|warning/i.test(line)) {
      type = 'ui';
      category = 'warning';
    } else if (/\d+ms|\d+s|latency|response time/i.test(line)) {
      type = 'performance';
      category = 'timing';
    }
    
    entries.push({
      id: uid('log'),
      timestamp: new Date().toISOString(),
      type,
      category,
      message: line,
      metadata: {},
    });
  }
  
  return entries;
}

/**
 * Parse multiple files and normalize to LogEntry[]
 * @param {Array<{originalname: string, path: string}>} files - Uploaded files
 * @returns {Promise<Array<LogEntry>>} Validated log entries
 */
// KIRO-AI: Point d'entrée principal pour l'ingestion multi-formats
// Détecte automatiquement le format par extension et applique le parser approprié
// Valide chaque entrée avec Zod pour garantir la conformité au schéma
export async function parseFilesToLogEntries(files) {
  const allEntries = [];
  
  for (const file of files) {
    const ext = file.originalname.split('.').pop().toLowerCase();
    const content = fs.readFileSync(file.path, 'utf-8');
    
    let entries = [];
    
    // KIRO-AI: Dispatch vers le parser approprié selon l'extension
    switch (ext) {
      case 'json':
        entries = parseJSON(content);
        break;
      case 'ndjson':
      case 'jsonl':
        entries = parseNDJSON(content);
        break;
      case 'log':
        // Tenter NDJSON d'abord, sinon TXT
        entries = parseNDJSON(content);
        if (entries.length === 0) {
          entries = parseTXT(content);
        }
        break;
      case 'csv':
        entries = parseCSV(content);
        break;
      case 'xml':
        entries = await parseXMLAsync(content);
        break;
      case 'har':
        entries = parseHAR(content);
        break;
      case 'html':
      case 'htm':
        entries = parseHTML(content);
        break;
      case 'txt':
        entries = parseTXT(content);
        break;
      default:
        console.warn(`[KIRO-AI] Unsupported file format: ${ext}`);
        entries = parseTXT(content); // Fallback sur TXT
    }
    
    // KIRO-AI: Soft validation with Zod - keep only valid entries
    // This allows processing partially corrupted files without rejecting everything
    const validEntries = entries
      .map(entry => LogEntrySchema.safeParse(entry))
      .filter(result => result.success)
      .map(result => result.data);
    
    console.log(`[KIRO-AI] Parsed ${file.originalname}: ${validEntries.length}/${entries.length} valid entries`);
    allEntries.push(...validEntries);
  }
  
  return allEntries;
}

export default { parseFilesToLogEntries };
