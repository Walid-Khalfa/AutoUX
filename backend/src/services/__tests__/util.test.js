import { describe, it, expect } from '@jest/globals';
import { uid, latencyToSeverity } from '../util.js';

describe('util.js', () => {
  describe('uid', () => {
    it('should generate unique IDs with default prefix', () => {
      const id1 = uid();
      const id2 = uid();
      
      expect(id1).toMatch(/^id-[0-9a-f-]{36}$/);
      expect(id2).toMatch(/^id-[0-9a-f-]{36}$/);
      expect(id1).not.toBe(id2);
    });

    it('should generate unique IDs with custom prefix', () => {
      const id = uid('issue');
      expect(id).toMatch(/^issue-[0-9a-f-]{36}$/);
    });
  });

  describe('latencyToSeverity', () => {
    it('should return "high" for latency > 5000ms', () => {
      expect(latencyToSeverity(5001)).toBe('high');
      expect(latencyToSeverity(10000)).toBe('high');
    });

    it('should return "medium" for latency between 3000ms and 5000ms', () => {
      expect(latencyToSeverity(3001)).toBe('medium');
      expect(latencyToSeverity(4000)).toBe('medium');
      expect(latencyToSeverity(5000)).toBe('medium');
    });

    it('should return "low" for latency <= 3000ms', () => {
      expect(latencyToSeverity(3000)).toBe('low');
      expect(latencyToSeverity(2000)).toBe('low');
      expect(latencyToSeverity(1000)).toBe('low');
    });
  });
});
