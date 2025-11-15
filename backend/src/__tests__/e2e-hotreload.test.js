import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import fs from 'node:fs';
import path from 'node:path';
import { LOGS_PATH, FIXSPECS_DIR } from '../config/paths.js';

describe('E2E Hot-Reload Test', () => {
  const backupPath = LOGS_PATH + '.backup';
  let originalLogs = [];
  let server;
  const API_BASE = 'http://localhost:3001/api';

  beforeAll(async () => {
    // Backup original logs
    if (fs.existsSync(LOGS_PATH)) {
      originalLogs = JSON.parse(fs.readFileSync(LOGS_PATH, 'utf-8'));
      fs.copyFileSync(LOGS_PATH, backupPath);
    }

    // Start server
    const { default: app } = await import('../server.js');
    server = app.listen(3001);
    
    // Wait for server to be ready
    await new Promise(resolve => setTimeout(resolve, 1000));
  });

  afterAll(async () => {
    // Restore original logs
    if (fs.existsSync(backupPath)) {
      fs.copyFileSync(backupPath, LOGS_PATH);
      fs.unlinkSync(backupPath);
    }

    // Close server
    if (server) {
      await new Promise(resolve => server.close(resolve));
    }
  });

  it('should detect new issue when log is added and create fixspec', async () => {
    // Get initial issue count
    const initialResponse = await fetch(`${API_BASE}/issues`);
    const initialData = await initialResponse.json();
    const initialCount = initialData.count;

    // Add a new log entry
    const newLog = {
      id: `log-e2e-${Date.now()}`,
      timestamp: new Date().toISOString(),
      type: 'performance',
      category: 'api',
      message: 'E2E test slow response',
      metadata: {
        responseTime: 7000,
        endpoint: '/api/e2e-test',
        method: 'GET',
        statusCode: 200,
      },
    };

    const currentLogs = JSON.parse(fs.readFileSync(LOGS_PATH, 'utf-8'));
    currentLogs.push(newLog);
    fs.writeFileSync(LOGS_PATH, JSON.stringify(currentLogs, null, 2));

    // Wait for file system to update
    await new Promise(resolve => setTimeout(resolve, 500));

    // Fetch issues with refresh to force reload
    const updatedResponse = await fetch(`${API_BASE}/issues?refresh=1`);
    const updatedData = await updatedResponse.json();
    const updatedCount = updatedData.count;

    // Verify issue count increased
    expect(updatedCount).toBeGreaterThan(initialCount);

    // Find the new issue
    const newIssue = updatedData.issues.find(
      issue => issue.sourceLogId === newLog.id
    );
    expect(newIssue).toBeDefined();
    expect(newIssue.type).toBe('latency');
    expect(newIssue.severity).toBe('high');

    // Wait for fixspec to be created
    await new Promise(resolve => setTimeout(resolve, 500));

    // Verify fixspec was created
    const fixspecPath = path.join(FIXSPECS_DIR, `${newIssue.id}.json`);
    expect(fs.existsSync(fixspecPath)).toBe(true);

    const fixspec = JSON.parse(fs.readFileSync(fixspecPath, 'utf-8'));
    expect(fixspec.issueId).toBe(newIssue.id);
    expect(fixspec.type).toBe('latency');
    expect(fixspec.suggestedFix).toBeDefined();
    expect(fixspec.suggestedFix.steps).toBeInstanceOf(Array);
    expect(fixspec.suggestedFix.steps.length).toBeGreaterThan(0);

    // Clean up created fixspec
    if (fs.existsSync(fixspecPath)) {
      fs.unlinkSync(fixspecPath);
    }
  });

  it('should handle multiple log additions', async () => {
    const initialResponse = await fetch(`${API_BASE}/issues`);
    const initialData = await initialResponse.json();
    const initialCount = initialData.count;

    // Add multiple new logs
    const newLogs = [
      {
        id: `log-multi-1-${Date.now()}`,
        timestamp: new Date().toISOString(),
        type: 'accessibility',
        category: 'images',
        message: 'Missing alt text',
        metadata: {
          violation: 'missing-alt-text',
          element: 'img.test',
        },
      },
      {
        id: `log-multi-2-${Date.now()}`,
        timestamp: new Date().toISOString(),
        type: 'ui',
        category: 'contrast',
        message: 'Low contrast',
        metadata: {
          contrastRatio: 2.8,
          element: 'button.test',
        },
      },
    ];

    const currentLogs = JSON.parse(fs.readFileSync(LOGS_PATH, 'utf-8'));
    currentLogs.push(...newLogs);
    fs.writeFileSync(LOGS_PATH, JSON.stringify(currentLogs, null, 2));

    await new Promise(resolve => setTimeout(resolve, 500));

    const updatedResponse = await fetch(`${API_BASE}/issues?refresh=1`);
    const updatedData = await updatedResponse.json();

    expect(updatedData.count).toBeGreaterThanOrEqual(initialCount + 2);

    // Verify both issues were created
    const accessibilityIssue = updatedData.issues.find(
      issue => issue.sourceLogId === newLogs[0].id
    );
    const contrastIssue = updatedData.issues.find(
      issue => issue.sourceLogId === newLogs[1].id
    );

    expect(accessibilityIssue).toBeDefined();
    expect(accessibilityIssue.type).toBe('accessibility');
    
    expect(contrastIssue).toBeDefined();
    expect(contrastIssue.type).toBe('contrast');

    // Clean up fixspecs
    [accessibilityIssue, contrastIssue].forEach(issue => {
      if (issue) {
        const fixspecPath = path.join(FIXSPECS_DIR, `${issue.id}.json`);
        if (fs.existsSync(fixspecPath)) {
          fs.unlinkSync(fixspecPath);
        }
      }
    });
  });
});
