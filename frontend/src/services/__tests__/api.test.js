import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { analyzeLog } from '../api.js';

describe('API Service - analyzeLog', () => {
  beforeEach(() => {
    // Reset fetch mock and sessionStorage before each test
    global.fetch = vi.fn();
    sessionStorage.clear();
    vi.clearAllTimers();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('analyzeLog', () => {
    it('should analyze log file successfully', async () => {
      const mockFile = new File(['log content'], 'test.json', { type: 'application/json' });
      const mockReport = {
        report: {
          id: 'report-1',
          uxScore: 85,
          issues: [],
          categories: {},
          recommendations: [],
        },
        markdown: '# Report',
      };

      global.fetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        statusText: 'OK',
        json: async () => mockReport,
      });

      const result = await analyzeLog(mockFile);
      
      expect(result).toEqual(mockReport);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/analyze'),
        expect.objectContaining({
          method: 'POST',
          body: expect.any(FormData),
        })
      );
    });

    it('should use cached report for same file', async () => {
      const mockFile = new File(['log content'], 'test.json', { 
        type: 'application/json',
        lastModified: 1234567890,
      });
      const mockReport = {
        report: { id: 'report-1', uxScore: 85 },
        markdown: '# Report',
      };

      global.fetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        statusText: 'OK',
        json: async () => mockReport,
      });

      // First call - should fetch
      const result1 = await analyzeLog(mockFile);
      expect(result1).toEqual(mockReport);
      expect(global.fetch).toHaveBeenCalledTimes(1);

      // Second call - should use cache
      const result2 = await analyzeLog(mockFile);
      expect(result2).toEqual(mockReport);
      expect(global.fetch).toHaveBeenCalledTimes(1); // No additional fetch
    });

    it('should retry on 5xx errors with exponential backoff', async () => {
      const mockFile = new File(['log content'], 'test.json', { type: 'application/json' });
      const mockReport = {
        report: { id: 'report-1', uxScore: 85 },
        markdown: '# Report',
      };

      // First call fails with 500, second succeeds
      global.fetch
        .mockResolvedValueOnce({
          ok: false,
          status: 500,
          statusText: 'Internal Server Error',
          json: async () => ({ error: { message: 'Server error' } }),
        })
        .mockResolvedValueOnce({
          ok: true,
          status: 200,
          statusText: 'OK',
          json: async () => mockReport,
        });

      const promise = analyzeLog(mockFile);
      
      // Fast-forward through the exponential backoff delay (1s)
      await vi.advanceTimersByTimeAsync(1000);
      
      const result = await promise;
      
      expect(result).toEqual(mockReport);
      expect(global.fetch).toHaveBeenCalledTimes(2);
    });

    it('should handle user-friendly error messages', async () => {
      const mockFile = new File(['log content'], 'test.json', { type: 'application/json' });

      global.fetch.mockResolvedValueOnce({
        ok: false,
        status: 413,
        statusText: 'Payload Too Large',
        json: async () => ({ error: { code: 'FILE_TOO_LARGE' } }),
      });

      await expect(analyzeLog(mockFile)).rejects.toThrow('File exceeds 10MB limit');
    });

    it('should handle timeout errors', async () => {
      const mockFile = new File(['log content'], 'test.json', { type: 'application/json' });

      global.fetch.mockImplementationOnce(() => 
        new Promise((resolve, reject) => {
          const error = new Error('Request timeout - analysis took longer than 60 seconds');
          error.name = 'AbortError';
          setTimeout(() => reject(error), 61000);
        })
      );

      const promise = analyzeLog(mockFile);
      
      // Fast-forward past the timeout
      await vi.advanceTimersByTimeAsync(61000);
      
      await expect(promise).rejects.toThrow('Request timeout');
    });

    it('should handle network errors', async () => {
      const mockFile = new File(['log content'], 'test.json', { type: 'application/json' });

      // Mock all retries to fail with network error
      global.fetch
        .mockRejectedValueOnce(new Error('Failed to fetch'))
        .mockRejectedValueOnce(new Error('Failed to fetch'))
        .mockRejectedValueOnce(new Error('Failed to fetch'));

      const promise = analyzeLog(mockFile);
      
      // Fast-forward through all retry delays (1s + 2s = 3s total)
      await vi.advanceTimersByTimeAsync(3000);
      
      await expect(promise).rejects.toThrow('Unable to connect to server');
    });

    it('should validate response structure', async () => {
      const mockFile = new File(['log content'], 'test.json', { type: 'application/json' });

      global.fetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        statusText: 'OK',
        json: async () => ({ /* missing report field */ }),
      });

      await expect(analyzeLog(mockFile)).rejects.toThrow('Invalid response from server');
    });
  });
});
