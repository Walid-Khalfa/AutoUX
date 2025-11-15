import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import FileUploader from '../FileUploader.jsx';

describe('FileUploader Component', () => {
  let mockOnUpload;
  let mockOnError;

  beforeEach(() => {
    mockOnUpload = vi.fn().mockResolvedValue(undefined);
    mockOnError = vi.fn();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.clearAllTimers();
    vi.useRealTimers();
  });

  it('should render upload zone with default state', () => {
    render(<FileUploader onUpload={mockOnUpload} onError={mockOnError} />);
    
    expect(screen.getByText('Upload Logs')).toBeInTheDocument();
    expect(screen.getByText(/Drag & drop your log file here or click to browse/i)).toBeInTheDocument();
    expect(screen.getByText('Select Files')).toBeInTheDocument();
  });

  it('should display supported formats badges', () => {
    render(<FileUploader onUpload={mockOnUpload} onError={mockOnError} />);
    
    expect(screen.getByText('JSON')).toBeInTheDocument();
    expect(screen.getByText('CSV')).toBeInTheDocument();
    expect(screen.getByText('XML')).toBeInTheDocument();
    expect(screen.getByText('HTML')).toBeInTheDocument();
  });

  it('should display maximum file size helper text', () => {
    render(<FileUploader onUpload={mockOnUpload} onError={mockOnError} />);
    
    expect(screen.getByText('Maximum file size: 10MB')).toBeInTheDocument();
  });

  it('should handle file selection via click', async () => {
    render(<FileUploader onUpload={mockOnUpload} onError={mockOnError} />);
    
    const file = new File(['test content'], 'test.json', { type: 'application/json' });
    const input = document.querySelector('input[type="file"]');
    
    fireEvent.change(input, { target: { files: [file] } });
    
    // Wait for debounce (300ms) and run all timers
    await vi.runAllTimersAsync();
    
    expect(mockOnUpload).toHaveBeenCalledWith(file);
  });

  it('should validate file size and show error for files > 10MB', async () => {
    render(<FileUploader onUpload={mockOnUpload} onError={mockOnError} />);
    
    // Create a file larger than 10MB
    const largeFile = new File(['x'.repeat(11 * 1024 * 1024)], 'large.json', { type: 'application/json' });
    const input = document.querySelector('input[type="file"]');
    
    fireEvent.change(input, { target: { files: [largeFile] } });
    
    // Wait for debounce
    await vi.runAllTimersAsync();
    
    expect(screen.getByText(/is too large/i)).toBeInTheDocument();
    expect(mockOnUpload).not.toHaveBeenCalled();
  });

  it('should validate file format and show error for unsupported formats', async () => {
    render(<FileUploader onUpload={mockOnUpload} onError={mockOnError} />);
    
    const invalidFile = new File(['test'], 'test.pdf', { type: 'application/pdf' });
    const input = document.querySelector('input[type="file"]');
    
    fireEvent.change(input, { target: { files: [invalidFile] } });
    
    // Wait for debounce
    await vi.runAllTimersAsync();
    
    expect(screen.getByText(/unsupported format/i)).toBeInTheDocument();
    expect(mockOnUpload).not.toHaveBeenCalled();
  });

  it('should show loading state during upload', async () => {
    render(<FileUploader onUpload={mockOnUpload} onError={mockOnError} loading={true} />);
    
    expect(screen.getByText('Analyzing with AI...')).toBeInTheDocument();
    expect(screen.getByText(/Analyzing your logs with KAT-Coder-Pro/i)).toBeInTheDocument();
  });

  it('should debounce file uploads by 300ms', async () => {
    render(<FileUploader onUpload={mockOnUpload} onError={mockOnError} />);
    
    const file = new File(['test'], 'test.json', { type: 'application/json' });
    const input = document.querySelector('input[type="file"]');
    
    // Trigger multiple uploads quickly
    fireEvent.change(input, { target: { files: [file] } });
    fireEvent.change(input, { target: { files: [file] } });
    fireEvent.change(input, { target: { files: [file] } });
    
    // Should not call upload yet
    expect(mockOnUpload).not.toHaveBeenCalled();
    
    // Wait for debounce
    await vi.runAllTimersAsync();
    
    // Should only call once after debounce
    expect(mockOnUpload).toHaveBeenCalledTimes(1);
  });

  it('should handle drag and drop', async () => {
    render(<FileUploader onUpload={mockOnUpload} onError={mockOnError} />);
    
    const dropZone = screen.getByText('Upload Logs').closest('div');
    const file = new File(['test'], 'test.json', { type: 'application/json' });
    
    // Simulate drag over
    fireEvent.dragOver(dropZone, {
      dataTransfer: { files: [file] }
    });
    
    expect(screen.getByText('Drop to analyze ⚡')).toBeInTheDocument();
    
    // Simulate drop
    fireEvent.drop(dropZone, {
      dataTransfer: { files: [file] }
    });
    
    // Wait for debounce
    await vi.runAllTimersAsync();
    
    expect(mockOnUpload).toHaveBeenCalledWith(file);
  });

  it('should handle upload errors', async () => {
    const errorMessage = 'Upload failed';
    mockOnUpload.mockRejectedValueOnce(new Error(errorMessage));
    
    render(<FileUploader onUpload={mockOnUpload} onError={mockOnError} />);
    
    const file = new File(['test'], 'test.json', { type: 'application/json' });
    const input = document.querySelector('input[type="file"]');
    
    fireEvent.change(input, { target: { files: [file] } });
    
    // Wait for debounce
    await vi.runAllTimersAsync();
    
    expect(mockOnError).toHaveBeenCalledWith(errorMessage);
  });

  it('should be keyboard accessible', () => {
    render(<FileUploader onUpload={mockOnUpload} onError={mockOnError} />);
    
    const button = screen.getByText('Select Files');
    
    // Button should be focusable
    expect(button).toBeInTheDocument();
    expect(button.tagName).toBe('BUTTON');
  });

  it('should accept all supported file formats', () => {
    render(<FileUploader onUpload={mockOnUpload} onError={mockOnError} />);
    
    const input = document.querySelector('input[type="file"]');
    const acceptAttr = input.getAttribute('accept');
    
    expect(acceptAttr).toContain('.json');
    expect(acceptAttr).toContain('.csv');
    expect(acceptAttr).toContain('.xml');
    expect(acceptAttr).toContain('.html');
    expect(acceptAttr).toContain('.har');
    expect(acceptAttr).toContain('.txt');
    expect(acceptAttr).toContain('.log');
  });
});
