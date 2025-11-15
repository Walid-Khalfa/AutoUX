import { describe, it, expect } from '@jest/globals';
import {
  detectFormat,
  parseJSON,
  parseNDJSON,
  parseCSV,
  parseXML,
  parseHTML,
  parseHAR,
  parsePlainText,
  parse
} from '../fileParser.js';

describe('fileParser Service', () => {
  describe('detectFormat', () => {
    it('should detect JSON format from array content', () => {
      const buffer = Buffer.from('[{"test": "data"}]');
      const format = detectFormat(buffer, 'test.json');
      expect(format).toBe('json');
    });

    it('should detect NDJSON format from newline-delimited content', () => {
      const buffer = Buffer.from('{"line": 1}\n{"line": 2}\n{"line": 3}');
      const format = detectFormat(buffer, 'test.ndjson');
      expect(format).toBe('ndjson');
    });

    it('should detect CSV format from comma-separated content', () => {
      const buffer = Buffer.from('name,value\ntest,123\ndata,456');
      const format = detectFormat(buffer, 'test.csv');
      expect(format).toBe('csv');
    });

    it('should detect XML format from XML declaration', () => {
      const buffer = Buffer.from('<?xml version="1.0"?><root><entry>test</entry></root>');
      const format = detectFormat(buffer, 'test.xml');
      expect(format).toBe('xml');
    });

    it('should detect HTML format from HTML tags', () => {
      const buffer = Buffer.from('<!DOCTYPE html><html><body><table></table></body></html>');
      const format = detectFormat(buffer, 'test.html');
      expect(format).toBe('html');
    });

    it('should detect HAR format from log.entries structure', () => {
      const buffer = Buffer.from('{"log": {"entries": []}}');
      const format = detectFormat(buffer, 'test.har');
      expect(format).toBe('har');
    });

    it('should default to plaintext for unknown formats', () => {
      const buffer = Buffer.from('Some random text content');
      const format = detectFormat(buffer, 'test.txt');
      expect(format).toBe('plaintext');
    });
  });

  describe('parseJSON', () => {
    it('should parse valid JSON array', () => {
      const content = '[{"id": 1, "type": "error"}, {"id": 2, "type": "warning"}]';
      const result = parseJSON(content);
      
      expect(Array.isArray(result)).toBe(true);
      expect(result).toHaveLength(2);
      expect(result[0].id).toBe(1);
      expect(result[1].type).toBe('warning');
    });

    it('should wrap single object in array', () => {
      const content = '{"id": 1, "type": "error"}';
      const result = parseJSON(content);
      
      expect(Array.isArray(result)).toBe(true);
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe(1);
    });

    it('should throw error for invalid JSON', () => {
      const content = '{invalid json}';
      expect(() => parseJSON(content)).toThrow('JSON parsing failed');
    });
  });

  describe('parseNDJSON', () => {
    it('should parse newline-delimited JSON', () => {
      const content = '{"id": 1}\n{"id": 2}\n{"id": 3}';
      const result = parseNDJSON(content);
      
      expect(result).toHaveLength(3);
      expect(result[0].id).toBe(1);
      expect(result[2].id).toBe(3);
    });

    it('should skip invalid lines and continue parsing', () => {
      const content = '{"id": 1}\ninvalid line\n{"id": 3}';
      const result = parseNDJSON(content);
      
      expect(result).toHaveLength(2);
      expect(result[0].id).toBe(1);
      expect(result[1].id).toBe(3);
    });

    it('should throw error if no valid entries found', () => {
      const content = 'invalid\nlines\nonly';
      expect(() => parseNDJSON(content)).toThrow('No valid JSON entries found');
    });
  });

  describe('parseCSV', () => {
    it('should parse CSV with headers', () => {
      const content = 'name,age,city\nJohn,30,NYC\nJane,25,LA';
      const result = parseCSV(content);
      
      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({ name: 'John', age: '30', city: 'NYC' });
      expect(result[1]).toEqual({ name: 'Jane', age: '25', city: 'LA' });
    });

    it('should handle quoted values with commas', () => {
      const content = 'name,description\nTest,"Value with, comma"\nData,"Another, value"';
      const result = parseCSV(content);
      
      expect(result).toHaveLength(2);
      expect(result[0].description).toBe('Value with, comma');
    });

    it('should throw error for empty CSV', () => {
      const content = '';
      expect(() => parseCSV(content)).toThrow('CSV file is empty');
    });
  });

  describe('parseXML', () => {
    it('should parse XML with entry tags', () => {
      const content = '<logs><entry><id>1</id><type>error</type></entry><entry><id>2</id><type>warning</type></entry></logs>';
      const result = parseXML(content);
      
      expect(result).toHaveLength(2);
      expect(result[0].id).toBe('1');
      expect(result[1].type).toBe('warning');
    });

    it('should parse XML with log tags', () => {
      const content = '<root><log><message>Test</message><level>INFO</level></log></root>';
      const result = parseXML(content);
      
      expect(result).toHaveLength(1);
      expect(result[0].message).toBe('Test');
    });

    it('should throw error if no valid entries found', () => {
      const content = '<root><data>no entries</data></root>';
      expect(() => parseXML(content)).toThrow('No valid log entries found');
    });
  });

  describe('parseHTML', () => {
    it('should parse HTML table with headers', () => {
      const content = `
        <table>
          <tr><th>Name</th><th>Value</th></tr>
          <tr><td>Test</td><td>123</td></tr>
          <tr><td>Data</td><td>456</td></tr>
        </table>
      `;
      const result = parseHTML(content);
      
      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({ Name: 'Test', Value: '123' });
      expect(result[1]).toEqual({ Name: 'Data', Value: '456' });
    });

    it('should handle tables without headers', () => {
      const content = '<table><tr><td>Cell1</td><td>Cell2</td></tr></table>';
      const result = parseHTML(content);
      
      expect(result).toHaveLength(1);
      expect(result[0].column_1).toBe('Cell1');
      expect(result[0].column_2).toBe('Cell2');
    });

    it('should throw error if no table data found', () => {
      const content = '<html><body><p>No tables here</p></body></html>';
      expect(() => parseHTML(content)).toThrow('No valid table data found');
    });
  });

  describe('parseHAR', () => {
    it('should parse HAR format with entries', () => {
      const content = JSON.stringify({
        log: {
          entries: [
            {
              startedDateTime: '2025-11-13T10:00:00Z',
              request: { method: 'GET', url: 'https://example.com', headersSize: 100, bodySize: 0 },
              response: { status: 200, statusText: 'OK', headersSize: 200, bodySize: 500, content: { mimeType: 'text/html' } },
              time: 150,
              timings: { blocked: 10, dns: 20, connect: 30, send: 5, wait: 50, receive: 35 }
            }
          ]
        }
      });
      
      const result = parseHAR(content);
      
      expect(result).toHaveLength(1);
      expect(result[0].method).toBe('GET');
      expect(result[0].status).toBe(200);
      expect(result[0].responseTime).toBe(150);
    });

    it('should throw error for invalid HAR structure', () => {
      const content = '{"invalid": "structure"}';
      expect(() => parseHAR(content)).toThrow('Invalid HAR format');
    });
  });

  describe('parsePlainText', () => {
    it('should parse plain text logs with timestamps', () => {
      const content = '2025-11-13T10:00:00Z ERROR Something went wrong\n2025-11-13T10:01:00Z INFO All good';
      const result = parsePlainText(content);
      
      expect(result).toHaveLength(2);
      expect(result[0].level).toBe('ERROR');
      expect(result[1].level).toBe('INFO');
    });

    it('should extract log levels', () => {
      const content = 'ERROR: Critical failure\nWARNING: Check this\nINFO: Normal operation';
      const result = parsePlainText(content);
      
      expect(result).toHaveLength(3);
      expect(result[0].level).toBe('ERROR');
      expect(result[1].level).toMatch(/WARN/); // Can be WARN or WARNING
      expect(result[2].level).toBe('INFO');
    });

    it('should throw error for empty text', () => {
      const content = '';
      expect(() => parsePlainText(content)).toThrow('Text file is empty');
    });
  });

  describe('parse (main function)', () => {
    it('should detect and parse JSON format', () => {
      const buffer = Buffer.from('[{"test": "data"}]');
      const result = parse(buffer, 'test.json');
      
      expect(Array.isArray(result)).toBe(true);
      expect(result[0].test).toBe('data');
    });

    it('should detect and parse CSV format', () => {
      const buffer = Buffer.from('name,value\ntest,123');
      const result = parse(buffer, 'test.csv');
      
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('test');
    });

    it('should handle parsing errors gracefully', () => {
      const buffer = Buffer.from('invalid content');
      // Plain text parser will handle unknown formats, so it won't throw
      const result = parse(buffer, 'test.unknown');
      expect(Array.isArray(result)).toBe(true);
    });
  });
});
