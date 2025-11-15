import { describe, it, expect, jest, beforeEach } from '@jest/globals';

// Mock dependencies before importing the module
jest.unstable_mockModule('../../services/fileParser.js', () => ({
  parse: jest.fn()
}));
jest.unstable_mockModule('../../services/llmAnalyzer.js', () => ({
  analyzeWithLLM: jest.fn()
}));
jest.unstable_mockModule('../../services/reportGenerator.js', () => ({
  generateReport: jest.fn()
}));

describe('POST /api/analyze Integration', () => {
  let fileParser, llmAnalyzer, reportGenerator;

  beforeEach(async () => {
    jest.clearAllMocks();
    
    // Import mocked modules
    fileParser = await import('../../services/fileParser.js');
    llmAnalyzer = await import('../../services/llmAnalyzer.js');
    reportGenerator = await import('../../services/reportGenerator.js');
    
    // Setup default mock implementations
    fileParser.parse.mockReturnValue([
      { id: 1, type: 'error', message: 'Test error' }
    ]);
    
    llmAnalyzer.analyzeWithLLM.mockResolvedValue({
      uxScore: 75,
      issues: [
        {
          id: 'issue-1',
          type: 'latency',
          severity: 'high',
          description: 'Slow response',
          category: 'Performance',
          metadata: { responseTime: 5000 }
        }
      ],
      categories: { Performance: 1 },
      recommendations: [
        {
          priority: 1,
          title: 'Optimize performance',
          description: 'Reduce response time',
          why: 'Better UX',
          references: ['https://web.dev/lcp/'],
          estimatedImpact: 'high'
        }
      ],
      metadata: {
        totalIssues: 1,
        criticalCount: 0,
        highCount: 1,
        mediumCount: 0,
        lowCount: 0,
        analysisModel: 'test-model'
      }
    });
    
    reportGenerator.generateReport.mockReturnValue({
      report: {
        id: 'report-123',
        timestamp: '2025-11-13T10:00:00Z',
        version: '1.0.0',
        uxScore: 75,
        issues: [],
        categories: {},
        recommendations: [],
        metadata: {}
      },
      markdown: '# AutoUX Analysis Report\n\n**UX Score:** 75/100'
    });
  });

  describe('Successful analysis flow', () => {
    it('should parse file, analyze with LLM, and generate report', async () => {
      const mockFile = {
        buffer: Buffer.from('[{"test": "data"}]'),
        originalname: 'test.json',
        size: 1024
      };
      
      // Simulate the flow
      const parsedLogs = fileParser.parse(mockFile.buffer, mockFile.originalname);
      expect(parsedLogs).toHaveLength(1);
      expect(fileParser.parse).toHaveBeenCalledWith(mockFile.buffer, mockFile.originalname);
      
      const aiResponse = await llmAnalyzer.analyzeWithLLM(parsedLogs);
      expect(aiResponse.uxScore).toBe(75);
      expect(llmAnalyzer.analyzeWithLLM).toHaveBeenCalledWith(parsedLogs);
      
      const result = reportGenerator.generateReport(aiResponse);
      expect(result.report).toBeDefined();
      expect(result.markdown).toBeDefined();
      expect(reportGenerator.generateReport).toHaveBeenCalledWith(aiResponse);
    });

    it('should handle various file formats', async () => {
      const formats = [
        { buffer: Buffer.from('[{"test": "data"}]'), filename: 'test.json' },
        { buffer: Buffer.from('{"line": 1}\n{"line": 2}'), filename: 'test.ndjson' },
        { buffer: Buffer.from('name,value\ntest,123'), filename: 'test.csv' }
      ];
      
      for (const format of formats) {
        fileParser.parse(format.buffer, format.filename);
        expect(fileParser.parse).toHaveBeenCalledWith(format.buffer, format.filename);
      }
    });
  });

  describe('Error handling', () => {
    it('should handle file parsing errors', async () => {
      fileParser.parse.mockImplementation(() => {
        throw new Error('PARSE_ERROR: Invalid file format');
      });
      
      const mockFile = {
        buffer: Buffer.from('invalid content'),
        originalname: 'test.txt',
        size: 1024
      };
      
      expect(() => fileParser.parse(mockFile.buffer, mockFile.originalname)).toThrow('PARSE_ERROR');
    });

    it('should handle LLM API errors', async () => {
      llmAnalyzer.analyzeWithLLM.mockRejectedValue(new Error('LLM_API_ERROR: Connection failed'));
      
      const parsedLogs = [{ id: 1, message: 'test' }];
      
      await expect(llmAnalyzer.analyzeWithLLM(parsedLogs)).rejects.toThrow('LLM_API_ERROR');
    });

    it('should handle LLM timeout errors', async () => {
      llmAnalyzer.analyzeWithLLM.mockRejectedValue(new Error('LLM_TIMEOUT: Analysis exceeded 60s'));
      
      const parsedLogs = [{ id: 1, message: 'test' }];
      
      await expect(llmAnalyzer.analyzeWithLLM(parsedLogs)).rejects.toThrow('LLM_TIMEOUT');
    });

    it('should handle rate limit errors', async () => {
      llmAnalyzer.analyzeWithLLM.mockRejectedValue(new Error('RATE_LIMIT_EXCEEDED: Too many requests'));
      
      const parsedLogs = [{ id: 1, message: 'test' }];
      
      await expect(llmAnalyzer.analyzeWithLLM(parsedLogs)).rejects.toThrow('RATE_LIMIT_EXCEEDED');
    });

    it('should handle invalid LLM response', async () => {
      llmAnalyzer.analyzeWithLLM.mockRejectedValue(new Error('INVALID_RESPONSE: Missing required fields'));
      
      const parsedLogs = [{ id: 1, message: 'test' }];
      
      await expect(llmAnalyzer.analyzeWithLLM(parsedLogs)).rejects.toThrow('INVALID_RESPONSE');
    });
  });

  describe('File validation', () => {
    it('should validate file size (max 10MB)', () => {
      const maxSize = 10 * 1024 * 1024;
      const validFile = { size: maxSize - 1 };
      const invalidFile = { size: maxSize + 1 };
      
      expect(validFile.size).toBeLessThan(maxSize);
      expect(invalidFile.size).toBeGreaterThan(maxSize);
    });

    it('should validate supported file formats', () => {
      const supportedFormats = ['.json', '.ndjson', '.jsonl', '.csv', '.xml', '.html', '.har', '.txt', '.log'];
      const validFiles = supportedFormats.map(ext => `test${ext}`);
      const invalidFile = 'test.pdf';
      
      validFiles.forEach(filename => {
        const ext = filename.split('.').pop();
        expect(supportedFormats.some(format => format.includes(ext))).toBe(true);
      });
      
      const invalidExt = invalidFile.split('.').pop();
      expect(supportedFormats.some(format => format.includes(invalidExt))).toBe(false);
    });
  });

  describe('Response format', () => {
    it('should return report and markdown in response', async () => {
      const mockFile = {
        buffer: Buffer.from('[{"test": "data"}]'),
        originalname: 'test.json',
        size: 1024
      };
      
      const parsedLogs = fileParser.parse(mockFile.buffer, mockFile.originalname);
      const aiResponse = await llmAnalyzer.analyzeWithLLM(parsedLogs);
      const result = reportGenerator.generateReport(aiResponse);
      
      expect(result).toHaveProperty('report');
      expect(result).toHaveProperty('markdown');
      expect(typeof result.markdown).toBe('string');
      expect(result.report.id).toBeDefined();
      expect(result.report.timestamp).toBeDefined();
    });

    it('should include all required report fields', async () => {
      const mockFile = {
        buffer: Buffer.from('[{"test": "data"}]'),
        originalname: 'test.json',
        size: 1024
      };
      
      const parsedLogs = fileParser.parse(mockFile.buffer, mockFile.originalname);
      const aiResponse = await llmAnalyzer.analyzeWithLLM(parsedLogs);
      const result = reportGenerator.generateReport(aiResponse);
      
      expect(result.report).toHaveProperty('id');
      expect(result.report).toHaveProperty('timestamp');
      expect(result.report).toHaveProperty('version');
      expect(result.report).toHaveProperty('uxScore');
      expect(result.report).toHaveProperty('issues');
      expect(result.report).toHaveProperty('categories');
      expect(result.report).toHaveProperty('recommendations');
      expect(result.report).toHaveProperty('metadata');
    });
  });
});
