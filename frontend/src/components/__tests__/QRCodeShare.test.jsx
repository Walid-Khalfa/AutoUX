import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import QRCodeShare from '../QRCodeShare.jsx';

describe('QRCodeShare Component', () => {
  const mockReport = {
    id: 'test-report-123',
    uxScore: 85,
    timestamp: '2025-11-14T10:00:00Z',
    metadata: {
      totalIssues: 5,
    },
  };

  const mockHash = '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef';
  const mockVerificationUrl = 'https://example.com/verify/test-report-123';

  beforeEach(() => {
    // Mock clipboard API
    Object.assign(navigator, {
      clipboard: {
        writeText: vi.fn().mockResolvedValue(undefined),
      },
    });

    // Mock window.open
    global.open = vi.fn();
  });

  it('should render the component with header', () => {
    render(<QRCodeShare report={mockReport} hash={mockHash} verificationUrl={mockVerificationUrl} />);
    
    expect(screen.getByText('📱 Share UX Proof')).toBeInTheDocument();
    expect(screen.getByText('Share your verified UX analysis results')).toBeInTheDocument();
  });

  it('should show/hide QR code when button is clicked', async () => {
    render(<QRCodeShare report={mockReport} hash={mockHash} verificationUrl={mockVerificationUrl} />);
    
    const toggleButton = screen.getByRole('button', { name: /show qr/i });
    expect(toggleButton).toBeInTheDocument();
    
    // QR code should not be visible initially
    expect(screen.queryByText('Scan to view verification details')).not.toBeInTheDocument();
    
    // Click to show QR code
    fireEvent.click(toggleButton);
    
    await waitFor(() => {
      expect(screen.getByText('Scan to view verification details')).toBeInTheDocument();
    });
    
    // Button text should change
    expect(screen.getByRole('button', { name: /hide qr/i })).toBeInTheDocument();
  });

  it('should display verification details when QR is shown', async () => {
    render(<QRCodeShare report={mockReport} hash={mockHash} verificationUrl={mockVerificationUrl} />);
    
    const toggleButton = screen.getByRole('button', { name: /show qr/i });
    fireEvent.click(toggleButton);
    
    await waitFor(() => {
      expect(screen.getByText('Verification Details')).toBeInTheDocument();
      expect(screen.getByText('test-report-123')).toBeInTheDocument();
      expect(screen.getByText('85/100')).toBeInTheDocument();
      expect(screen.getByText('5')).toBeInTheDocument();
    });
  });

  it('should display abbreviated hash', async () => {
    render(<QRCodeShare report={mockReport} hash={mockHash} verificationUrl={mockVerificationUrl} />);
    
    const toggleButton = screen.getByRole('button', { name: /show qr/i });
    fireEvent.click(toggleButton);
    
    await waitFor(() => {
      // Should show abbreviated hash (first 10 + last 8 chars)
      expect(screen.getByText(/0x12345678...90abcdef/i)).toBeInTheDocument();
    });
  });

  it('should render social share buttons', async () => {
    render(<QRCodeShare report={mockReport} hash={mockHash} verificationUrl={mockVerificationUrl} />);
    
    const toggleButton = screen.getByRole('button', { name: /show qr/i });
    fireEvent.click(toggleButton);
    
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /share on twitter/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /share on linkedin/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /copy to clipboard/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /share via email/i })).toBeInTheDocument();
    });
  });

  it('should copy verification text to clipboard', async () => {
    render(<QRCodeShare report={mockReport} hash={mockHash} verificationUrl={mockVerificationUrl} />);
    
    const toggleButton = screen.getByRole('button', { name: /show qr/i });
    fireEvent.click(toggleButton);
    
    const copyButton = await screen.findByRole('button', { name: /copy to clipboard/i });
    fireEvent.click(copyButton);
    
    await waitFor(() => {
      expect(navigator.clipboard.writeText).toHaveBeenCalled();
      const callArg = navigator.clipboard.writeText.mock.calls[0][0];
      expect(callArg).toContain('UX Score: 85/100');
      expect(callArg).toContain('5 issues detected');
    });
  });

  it('should open Twitter share dialog', async () => {
    render(<QRCodeShare report={mockReport} hash={mockHash} verificationUrl={mockVerificationUrl} />);
    
    const toggleButton = screen.getByRole('button', { name: /show qr/i });
    fireEvent.click(toggleButton);
    
    const twitterButton = await screen.findByRole('button', { name: /share on twitter/i });
    fireEvent.click(twitterButton);
    
    expect(global.open).toHaveBeenCalledWith(
      expect.stringContaining('twitter.com/intent/tweet'),
      '_blank',
      'width=550,height=420'
    );
  });

  it('should open LinkedIn share dialog', async () => {
    render(<QRCodeShare report={mockReport} hash={mockHash} verificationUrl={mockVerificationUrl} />);
    
    const toggleButton = screen.getByRole('button', { name: /show qr/i });
    fireEvent.click(toggleButton);
    
    const linkedInButton = await screen.findByRole('button', { name: /share on linkedin/i });
    fireEvent.click(linkedInButton);
    
    expect(global.open).toHaveBeenCalledWith(
      expect.stringContaining('linkedin.com/sharing'),
      '_blank',
      'width=550,height=420'
    );
  });

  it('should display privacy note', async () => {
    render(<QRCodeShare report={mockReport} hash={mockHash} verificationUrl={mockVerificationUrl} />);
    
    const toggleButton = screen.getByRole('button', { name: /show qr/i });
    fireEvent.click(toggleButton);
    
    await waitFor(() => {
      expect(screen.getByText(/Privacy Note:/i)).toBeInTheDocument();
      expect(screen.getByText(/your actual logs remain private/i)).toBeInTheDocument();
    });
  });

  it('should render download QR code button', async () => {
    render(<QRCodeShare report={mockReport} hash={mockHash} verificationUrl={mockVerificationUrl} />);
    
    const toggleButton = screen.getByRole('button', { name: /show qr/i });
    fireEvent.click(toggleButton);
    
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /download qr code/i })).toBeInTheDocument();
    });
  });

  it('should not render when report is null', () => {
    const { container } = render(<QRCodeShare report={null} hash={mockHash} verificationUrl={mockVerificationUrl} />);
    
    expect(container.firstChild).toBeNull();
  });

  it('should handle missing hash gracefully', async () => {
    render(<QRCodeShare report={mockReport} hash={null} verificationUrl={mockVerificationUrl} />);
    
    const toggleButton = screen.getByRole('button', { name: /show qr/i });
    fireEvent.click(toggleButton);
    
    await waitFor(() => {
      // Should not display hash section when hash is null
      expect(screen.queryByText('Hash:')).not.toBeInTheDocument();
    });
  });

  it('should use default verification URL when not provided', async () => {
    render(<QRCodeShare report={mockReport} hash={mockHash} />);
    
    const toggleButton = screen.getByRole('button', { name: /show qr/i });
    fireEvent.click(toggleButton);
    
    // Component should still render without errors
    await waitFor(() => {
      expect(screen.getByText('Verification Details')).toBeInTheDocument();
    });
  });

  it('should format timestamp correctly', async () => {
    render(<QRCodeShare report={mockReport} hash={mockHash} verificationUrl={mockVerificationUrl} />);
    
    const toggleButton = screen.getByRole('button', { name: /show qr/i });
    fireEvent.click(toggleButton);
    
    await waitFor(() => {
      expect(screen.getByText('Timestamp:')).toBeInTheDocument();
      // Should display formatted date
      const timestampElement = screen.getByText('Timestamp:').nextSibling;
      expect(timestampElement).toBeTruthy();
    });
  });
});
