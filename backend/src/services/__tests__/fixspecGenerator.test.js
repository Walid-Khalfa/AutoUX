import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import fs from 'node:fs';
import path from 'node:path';
import { generateFixspec, saveFixspecOnce, getSuggestedFix } from '../fixspecGenerator.js';
import { FIXSPECS_DIR } from '../../config/paths.js';

describe('fixspecGenerator.js', () => {

  describe('getSuggestedFix', () => {
    it('should generate latency fix recommendations', () => {
      const issue = {
        type: 'latency',
        metadata: {
          responseTime: 6000,
          endpoint: '/api/data',
        },
      };

      const fix = getSuggestedFix('latence', issue);
      
      expect(fix.summary).toContain('/api/data');
      expect(fix.summary).toContain('6000ms');
      expect(fix.steps).toBeInstanceOf(Array);
      expect(fix.steps.length).toBeGreaterThan(0);
      expect(fix.codeExample).toBeDefined();
      expect(fix.references).toContain('Web Vitals – LCP (Largest Contentful Paint) < 2.5s');
    });

    it('should generate accessibility fix recommendations for missing alt text', () => {
      const issue = {
        type: 'accessibilité',
        description: 'Image sans attribut alt',
        metadata: {
          violation: 'missing-alt-text',
          element: 'img.hero',
        },
      };

      const fix = getSuggestedFix('accessibilité', issue);
      
      expect(fix.summary).toContain('alt');
      expect(fix.steps).toBeInstanceOf(Array);
      expect(fix.codeExample).toContain('alt=');
      expect(fix.references).toContain('WCAG 2.2 – 1.1.1 (Non-text Content)');
    });

    it('should generate accessibility fix recommendations for ARIA issues', () => {
      const issue = {
        type: 'accessibilité',
        description: 'Attribut ARIA invalide',
        metadata: {
          violation: 'invalid-aria-attribute',
          element: 'div.button',
        },
      };

      const fix = getSuggestedFix('accessibilité', issue);
      
      expect(fix.summary).toContain('ARIA');
      expect(fix.references).toContain('WCAG 2.2 – 4.1.2 (Name, Role, Value)');
    });

    it('should generate accessibility fix recommendations for keyboard issues', () => {
      const issue = {
        type: 'accessibilité',
        description: 'Element not keyboard accessible',
        metadata: {
          violation: 'no-keyboard-access',
          element: 'div.clickable',
        },
      };

      const fix = getSuggestedFix('accessibilité', issue);
      
      expect(fix.summary).toContain('keyboard');
      expect(fix.codeExample).toContain('tabindex');
      expect(fix.references).toContain('WCAG 2.2 – 2.1.1 (Keyboard)');
    });

    it('should generate contrast fix recommendations', () => {
      const issue = {
        type: 'contrast',
        metadata: {
          contrastRatio: 3.2,
          element: 'button.primary',
          foreground: '#999',
          background: '#fff',
        },
      };

      const fix = getSuggestedFix('contraste', issue);
      
      expect(fix.summary).toContain('3.20:1');
      expect(fix.summary).toContain('4.5:1');
      expect(fix.codeExample).toBeDefined();
      expect(fix.references).toContain('WCAG 2.2 – 1.4.3 (Contrast Minimum)');
    });

    it('should generate JS error fix recommendations', () => {
      const issue = {
        type: 'erreur JS',
        description: 'JavaScript Error',
        metadata: {
          errorMessage: 'Cannot read property "value" of undefined',
          component: 'UserProfile',
          file: 'UserProfile.jsx',
        },
      };

      const fix = getSuggestedFix('erreur JS', issue);
      
      expect(fix.summary).toContain('UserProfile');
      expect(fix.steps).toBeInstanceOf(Array);
      expect(fix.codeExample).toContain('try');
      expect(fix.codeExample).toContain('catch');
    });
  });

  describe('generateFixspec', () => {
    it('should generate complete fixspec with all required fields', () => {
      const issue = {
        id: 'issue-123',
        type: 'latency',
        description: 'High response time',
        severity: 'high',
        metadata: {
          responseTime: 6000,
          endpoint: '/api/data',
        },
      };

      const fixspec = generateFixspec(issue);
      
      expect(fixspec.issueId).toBe('issue-123');
      expect(fixspec.type).toBe('latency');
      expect(fixspec.description).toBe('High response time');
      expect(fixspec.severity).toBe('high');
      expect(fixspec.suggestedFix).toBeDefined();
      expect(fixspec.suggestedFix.summary).toBeDefined();
      expect(fixspec.suggestedFix.steps).toBeInstanceOf(Array);
      expect(fixspec.timestamp).toBeDefined();
      expect(fixspec.status).toBe('pending');
    });
  });

  describe('saveFixspecOnce - idempotence', () => {
    it('should create fixspec file when it does not exist', async () => {
      const fixspec = {
        issueId: 'test-issue-new-unique',
        type: 'latency',
        description: 'Test issue',
        severity: 'high',
        suggestedFix: {
          summary: 'Fix it',
          steps: ['Step 1'],
        },
        timestamp: '2025-11-12T10:00:00Z',
        status: 'pending',
      };

      const created = await saveFixspecOnce(fixspec);
      
      expect(created).toBe(true);
      
      const filepath = path.join(FIXSPECS_DIR, 'test-issue-new-unique.json');
      expect(fs.existsSync(filepath)).toBe(true);
      
      const content = JSON.parse(fs.readFileSync(filepath, 'utf-8'));
      expect(content.issueId).toBe('test-issue-new-unique');
      
      // Clean up
      fs.unlinkSync(filepath);
    });

    it('should not overwrite existing fixspec file (idempotence)', async () => {
      const fixspec = {
        issueId: 'test-issue-idempotent',
        type: 'latency',
        description: 'Original description',
        severity: 'high',
        suggestedFix: {
          summary: 'Original fix',
          steps: ['Step 1'],
        },
        timestamp: '2025-11-12T10:00:00Z',
        status: 'pending',
      };

      const filepath = path.join(FIXSPECS_DIR, 'test-issue-idempotent.json');
      
      // Create initial file
      fs.writeFileSync(filepath, JSON.stringify(fixspec, null, 2));
      
      // Try to save again with different content
      const modifiedFixspec = {
        ...fixspec,
        description: 'Modified description',
        suggestedFix: {
          summary: 'Modified fix',
          steps: ['Different step'],
        },
      };

      const created = await saveFixspecOnce(modifiedFixspec);
      
      expect(created).toBe(false);
      
      // Verify original content is preserved
      const content = JSON.parse(fs.readFileSync(filepath, 'utf-8'));
      expect(content.description).toBe('Original description');
      expect(content.suggestedFix.summary).toBe('Original fix');
      
      // Clean up
      fs.unlinkSync(filepath);
    });
  });
});
