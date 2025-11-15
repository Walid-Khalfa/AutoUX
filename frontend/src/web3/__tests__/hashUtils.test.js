// KIRO-AI: Tests for Web3 hash utilities
// Validates SHA-256 hashing and bytes32 format validation

import { describe, it, expect } from 'vitest';
import { sha256HexFromObject, assertBytes32 } from '../hashUtils';

describe('hashUtils', () => {
  describe('sha256HexFromObject', () => {
    it('should compute SHA-256 hash of an object', async () => {
      const obj = { test: 'data', value: 123 };
      const hash = await sha256HexFromObject(obj);
      
      expect(hash).toMatch(/^0x[0-9a-f]{64}$/);
      expect(hash.length).toBe(66); // 0x + 64 hex chars
    });

    it('should produce consistent hashes for same object', async () => {
      const obj = { a: 1, b: 2 };
      const hash1 = await sha256HexFromObject(obj);
      const hash2 = await sha256HexFromObject(obj);
      
      expect(hash1).toBe(hash2);
    });

    it('should produce different hashes for different objects', async () => {
      const obj1 = { test: 'data1' };
      const obj2 = { test: 'data2' };
      
      const hash1 = await sha256HexFromObject(obj1);
      const hash2 = await sha256HexFromObject(obj2);
      
      expect(hash1).not.toBe(hash2);
    });

    it('should handle complex nested objects', async () => {
      const obj = {
        issues: [
          { id: 1, type: 'latency', severity: 'high' },
          { id: 2, type: 'accessibility', severity: 'medium' }
        ],
        metadata: {
          timestamp: '2025-11-13',
          source: 'test'
        }
      };
      
      const hash = await sha256HexFromObject(obj);
      expect(hash).toMatch(/^0x[0-9a-f]{64}$/);
    });
  });

  describe('assertBytes32', () => {
    it('should accept valid bytes32 format', () => {
      const validHash = '0x' + 'a'.repeat(64);
      expect(() => assertBytes32(validHash)).not.toThrow();
    });

    it('should reject non-string input', () => {
      expect(() => assertBytes32(123)).toThrow('Hash must be a string');
      expect(() => assertBytes32(null)).toThrow('Hash must be a string');
      expect(() => assertBytes32(undefined)).toThrow('Hash must be a string');
    });

    it('should reject hash without 0x prefix', () => {
      const hash = 'a'.repeat(64);
      expect(() => assertBytes32(hash)).toThrow('Hash must start with 0x');
    });

    it('should reject hash with wrong length', () => {
      const shortHash = '0x' + 'a'.repeat(32);
      const longHash = '0x' + 'a'.repeat(128);
      
      expect(() => assertBytes32(shortHash)).toThrow(/64 hex characters|66 characters/);
      expect(() => assertBytes32(longHash)).toThrow(/64 hex characters|66 characters/);
    });

    it('should reject hash with non-hex characters', () => {
      const invalidHash = '0x' + 'g'.repeat(64);
      expect(() => assertBytes32(invalidHash)).toThrow(/invalid hex|hexadecimal/i);
    });

    it('should accept mixed case hex', () => {
      const mixedHash = '0x' + 'aAbBcCdDeEfF'.repeat(5) + 'aAbB';
      expect(() => assertBytes32(mixedHash)).not.toThrow();
    });
  });
});
