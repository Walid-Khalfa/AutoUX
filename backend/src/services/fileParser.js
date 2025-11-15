/**
 * Multi-Format File Parser Service
 * Supports: JSON, NDJSON, CSV, XML, HTML, HAR, TXT, LOG
 */

/**
 * Detect file format from buffer content and filename
 * @param {Buffer} buffer - File content buffer
 * @param {string} filename - Original filename
 * @returns {string} Detected format
 */
export const detectFormat = (buffer, filename) => {
  try {
    const content = buffer.toString('utf-8').trim();
    const extension = filename.toLowerCase().split('.').pop();
    
    // Check for HAR format (HTTP Archive)
    if (extension === 'har' || (content.startsWith('{') && content.includes('"log"') && content.includes('"entries"'))) {
      return 'har';
    }
    
    // Check for standard JSON array
    if ((extension === 'json' || content.startsWith('[')) && !content.includes('\n{')) {
      try {
        const parsed = JSON.parse(content);
        if (Array.isArray(parsed)) {
          return 'json';
        }
      } catch (e) {
        // Not valid JSON, continue checking
      }
    }
    
    // Check for NDJSON (newline-delimited JSON)
    if (extension === 'ndjson' || extension === 'jsonl' || (content.includes('\n{') && content.split('\n').filter(line => line.trim().startsWith('{')).length > 1)) {
      return 'ndjson';
    }
    
    // Check for CSV
    if (extension === 'csv' || (content.includes(',') && content.split('\n').length > 1)) {
      return 'csv';
    }
    
    // Check for HTML (before XML since HTML is also XML-like)
    if (extension === 'html' || extension === 'htm' || content.toLowerCase().includes('<html') || content.toLowerCase().includes('<!doctype html')) {
      return 'html';
    }
    
    // Check for XML
    if (extension === 'xml' || (content.startsWith('<?xml') || content.startsWith('<'))) {
      return 'xml';
    }
    
    // Default to plain text
    return 'plaintext';
  } catch (error) {
    throw new Error(`Format detection failed: ${error.message}`);
  }
};

/**
 * Parse standard JSON array format
 * @param {string} content - File content
 * @returns {Array<Object>} Parsed log entries
 */
export const parseJSON = (content) => {
  try {
    const parsed = JSON.parse(content);
    
    if (!Array.isArray(parsed)) {
      // If it's a single object, wrap it in an array
      return [parsed];
    }
    
    return parsed;
  } catch (error) {
    throw new Error(`JSON parsing failed: ${error.message}`);
  }
};

/**
 * Parse newline-delimited JSON (NDJSON)
 * @param {string} content - File content
 * @returns {Array<Object>} Parsed log entries
 */
export const parseNDJSON = (content) => {
  try {
    const lines = content.split('\n').filter(line => line.trim());
    const entries = [];
    
    for (let i = 0; i < lines.length; i++) {
      try {
        const parsed = JSON.parse(lines[i]);
        entries.push(parsed);
      } catch (error) {
        // Skip invalid lines but continue parsing
        console.warn(`Skipping invalid NDJSON line ${i + 1}: ${error.message}`);
      }
    }
    
    if (entries.length === 0) {
      throw new Error('No valid JSON entries found in NDJSON file');
    }
    
    return entries;
  } catch (error) {
    throw new Error(`NDJSON parsing failed: ${error.message}`);
  }
};

/**
 * Parse CSV format with header detection
 * @param {string} content - File content
 * @returns {Array<Object>} Parsed log entries
 */
export const parseCSV = (content) => {
  try {
    const lines = content.split('\n').filter(line => line.trim());
    
    if (lines.length === 0) {
      throw new Error('CSV file is empty');
    }
    
    // Parse CSV line considering quoted values
    const parseLine = (line) => {
      const values = [];
      let current = '';
      let inQuotes = false;
      
      for (let i = 0; i < line.length; i++) {
        const char = line[i];
        
        if (char === '"') {
          inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
          values.push(current.trim());
          current = '';
        } else {
          current += char;
        }
      }
      values.push(current.trim());
      
      return values.map(v => v.replace(/^"|"$/g, ''));
    };
    
    // First line is header
    const headers = parseLine(lines[0]);
    const entries = [];
    
    // Parse data rows
    for (let i = 1; i < lines.length; i++) {
      const values = parseLine(lines[i]);
      
      if (values.length === headers.length) {
        const entry = {};
        headers.forEach((header, index) => {
          entry[header] = values[index];
        });
        entries.push(entry);
      }
    }
    
    if (entries.length === 0) {
      throw new Error('No valid data rows found in CSV file');
    }
    
    return entries;
  } catch (error) {
    throw new Error(`CSV parsing failed: ${error.message}`);
  }
};

/**
 * Parse XML log structures
 * @param {string} content - File content
 * @returns {Array<Object>} Parsed log entries
 */
export const parseXML = (content) => {
  try {
    const entries = [];
    
    // Simple XML parser for log entries
    // Looks for common log entry patterns like <entry>, <log>, <record>, <item>
    const entryPatterns = ['entry', 'log', 'record', 'item', 'event'];
    
    for (const pattern of entryPatterns) {
      const regex = new RegExp(`<${pattern}[^>]*>(.*?)</${pattern}>`, 'gs');
      const matches = content.matchAll(regex);
      
      for (const match of matches) {
        const entryContent = match[1];
        const entry = {};
        
        // Extract all XML tags within the entry
        const tagRegex = /<([^>\/\s]+)>([^<]*)<\/\1>/g;
        const tagMatches = entryContent.matchAll(tagRegex);
        
        for (const tagMatch of tagMatches) {
          const key = tagMatch[1];
          const value = tagMatch[2].trim();
          entry[key] = value;
        }
        
        // Also check for self-closing tags with attributes
        const attrRegex = /<([^>\/\s]+)\s+([^>]+)\/>/g;
        const attrMatches = entryContent.matchAll(attrRegex);
        
        for (const attrMatch of attrMatches) {
          const tagName = attrMatch[1];
          const attributes = attrMatch[2];
          const attrPairs = attributes.match(/(\w+)="([^"]*)"/g);
          
          if (attrPairs) {
            attrPairs.forEach(pair => {
              const [key, value] = pair.split('=');
              entry[`${tagName}_${key}`] = value.replace(/"/g, '');
            });
          }
        }
        
        if (Object.keys(entry).length > 0) {
          entries.push(entry);
        }
      }
      
      if (entries.length > 0) {
        break; // Found entries with this pattern
      }
    }
    
    if (entries.length === 0) {
      throw new Error('No valid log entries found in XML structure');
    }
    
    return entries;
  } catch (error) {
    throw new Error(`XML parsing failed: ${error.message}`);
  }
};

/**
 * Parse HTML to extract log data from tables
 * @param {string} content - File content
 * @returns {Array<Object>} Parsed log entries
 */
export const parseHTML = (content) => {
  try {
    const entries = [];
    
    // Find all table rows
    const tableRegex = /<table[^>]*>(.*?)<\/table>/gis;
    const tableMatches = content.matchAll(tableRegex);
    
    for (const tableMatch of tableMatches) {
      const tableContent = tableMatch[1];
      
      // Extract headers from <th> tags
      const headerRegex = /<th[^>]*>(.*?)<\/th>/gi;
      const headers = [];
      const headerMatches = tableContent.matchAll(headerRegex);
      
      for (const headerMatch of headerMatches) {
        headers.push(headerMatch[1].replace(/<[^>]+>/g, '').trim());
      }
      
      // Extract rows
      const rowRegex = /<tr[^>]*>(.*?)<\/tr>/gis;
      const rowMatches = tableContent.matchAll(rowRegex);
      
      for (const rowMatch of rowMatches) {
        const rowContent = rowMatch[1];
        
        // Skip header rows
        if (rowContent.includes('<th')) {
          continue;
        }
        
        // Extract cells
        const cellRegex = /<td[^>]*>(.*?)<\/td>/gi;
        const cells = [];
        const cellMatches = rowContent.matchAll(cellRegex);
        
        for (const cellMatch of cellMatches) {
          cells.push(cellMatch[1].replace(/<[^>]+>/g, '').trim());
        }
        
        // Create entry object
        if (cells.length > 0) {
          const entry = {};
          
          if (headers.length === cells.length) {
            // Use headers as keys
            headers.forEach((header, index) => {
              entry[header] = cells[index];
            });
          } else {
            // Use generic column names
            cells.forEach((cell, index) => {
              entry[`column_${index + 1}`] = cell;
            });
          }
          
          entries.push(entry);
        }
      }
    }
    
    if (entries.length === 0) {
      throw new Error('No valid table data found in HTML');
    }
    
    return entries;
  } catch (error) {
    throw new Error(`HTML parsing failed: ${error.message}`);
  }
};

/**
 * Parse HTTP Archive (HAR) format
 * @param {string} content - File content
 * @returns {Array<Object>} Parsed log entries
 */
export const parseHAR = (content) => {
  try {
    const har = JSON.parse(content);
    
    if (!har.log || !har.log.entries) {
      throw new Error('Invalid HAR format: missing log.entries');
    }
    
    // Extract relevant information from HAR entries
    const entries = har.log.entries.map((entry, index) => {
      const request = entry.request || {};
      const response = entry.response || {};
      const timings = entry.timings || {};
      
      return {
        id: `har_entry_${index + 1}`,
        timestamp: entry.startedDateTime,
        method: request.method,
        url: request.url,
        status: response.status,
        statusText: response.statusText,
        responseTime: entry.time,
        timings: {
          blocked: timings.blocked,
          dns: timings.dns,
          connect: timings.connect,
          send: timings.send,
          wait: timings.wait,
          receive: timings.receive,
          ssl: timings.ssl
        },
        requestSize: request.headersSize + request.bodySize,
        responseSize: response.headersSize + response.bodySize,
        mimeType: response.content?.mimeType,
        serverIPAddress: entry.serverIPAddress,
        connection: entry.connection
      };
    });
    
    return entries;
  } catch (error) {
    throw new Error(`HAR parsing failed: ${error.message}`);
  }
};

/**
 * Parse plain text logs (unstructured)
 * @param {string} content - File content
 * @returns {Array<Object>} Parsed log entries
 */
export const parsePlainText = (content) => {
  try {
    const lines = content.split('\n').filter(line => line.trim());
    
    if (lines.length === 0) {
      throw new Error('Text file is empty');
    }
    
    const entries = lines.map((line, index) => {
      // Try to extract common log patterns
      const entry = {
        id: `log_${index + 1}`,
        raw: line,
        lineNumber: index + 1
      };
      
      // Try to extract timestamp (various formats)
      const timestampPatterns = [
        /(\d{4}-\d{2}-\d{2}[T\s]\d{2}:\d{2}:\d{2}(?:\.\d{3})?(?:Z|[+-]\d{2}:\d{2})?)/,
        /(\d{2}\/\d{2}\/\d{4}\s+\d{2}:\d{2}:\d{2})/,
        /(\w{3}\s+\d{1,2}\s+\d{2}:\d{2}:\d{2})/
      ];
      
      for (const pattern of timestampPatterns) {
        const match = line.match(pattern);
        if (match) {
          entry.timestamp = match[1];
          break;
        }
      }
      
      // Try to extract log level
      const levelPattern = /(ERROR|WARN|WARNING|INFO|DEBUG|TRACE|FATAL|CRITICAL)/i;
      const levelMatch = line.match(levelPattern);
      if (levelMatch) {
        entry.level = levelMatch[1].toUpperCase();
      }
      
      // Try to extract message (everything after level or timestamp)
      if (entry.timestamp || entry.level) {
        const parts = line.split(/ERROR|WARN|WARNING|INFO|DEBUG|TRACE|FATAL|CRITICAL/i);
        if (parts.length > 1) {
          entry.message = parts[parts.length - 1].trim();
        }
      } else {
        entry.message = line;
      }
      
      return entry;
    });
    
    return entries;
  } catch (error) {
    throw new Error(`Plain text parsing failed: ${error.message}`);
  }
};

/**
 * Main parse function - detects format and parses accordingly
 * @param {Buffer} buffer - File content buffer
 * @param {string} filename - Original filename
 * @returns {Array<Object>} Parsed log entries
 */
export const parse = (buffer, filename) => {
  try {
    const format = detectFormat(buffer, filename);
    const content = buffer.toString('utf-8');
    
    switch (format) {
      case 'json':
        return parseJSON(content);
      case 'ndjson':
        return parseNDJSON(content);
      case 'csv':
        return parseCSV(content);
      case 'xml':
        return parseXML(content);
      case 'html':
        return parseHTML(content);
      case 'har':
        return parseHAR(content);
      case 'plaintext':
        return parsePlainText(content);
      default:
        throw new Error(`Unsupported format: ${format}`);
    }
  } catch (error) {
    throw new Error(`File parsing failed: ${error.message}`);
  }
};
