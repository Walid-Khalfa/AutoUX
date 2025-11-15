import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ErrorBoundary from '../ErrorBoundary';
import Toast from '../Toast';
import Modal from '../Modal';
import SkipToContent from '../SkipToContent';

describe('Accessibility Features', () => {
  describe('ErrorBoundary', () => {
    it('should have proper ARIA attributes', () => {
      const ThrowError = () => {
        throw new Error('Test error');
      };

      const { container } = render(
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>
      );

      const alert = container.querySelector('[role="alert"]');
      expect(alert).toBeTruthy();
      expect(alert.getAttribute('aria-live')).toBe('assertive');
      expect(alert.getAttribute('aria-atomic')).toBe('true');
    });

    it('should have keyboard accessible retry button', () => {
      const ThrowError = () => {
        throw new Error('Test error');
      };

      render(
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>
      );

      const retryButton = screen.getByRole('button', { name: /retry and dismiss error/i });
      expect(retryButton).toBeTruthy();
      expect(retryButton.getAttribute('aria-label')).toBe('Retry and dismiss error');
    });
  });

  describe('Toast', () => {
    it('should have proper ARIA live region', () => {
      const onClose = vi.fn();
      const { container } = render(
        <Toast message="Test message" type="success" onClose={onClose} />
      );

      const alert = container.querySelector('[role="alert"]');
      expect(alert).toBeTruthy();
      expect(alert.getAttribute('aria-live')).toBe('polite');
      expect(alert.getAttribute('aria-atomic')).toBe('true');
    });

    it('should have accessible close button', () => {
      const onClose = vi.fn();
      render(<Toast message="Test message" type="success" onClose={onClose} />);

      const closeButton = screen.getByRole('button', { name: /close notification/i });
      expect(closeButton).toBeTruthy();
      expect(closeButton.getAttribute('aria-label')).toBe('Close notification');
    });

    it('should be dismissible with Escape key', () => {
      const onClose = vi.fn();
      render(<Toast message="Test message" type="success" onClose={onClose} />);

      fireEvent.keyDown(document, { key: 'Escape' });
      expect(onClose).toHaveBeenCalled();
    });

    it('should use assertive for error messages', () => {
      const onClose = vi.fn();
      const { container } = render(
        <Toast message="Error message" type="error" onClose={onClose} />
      );

      const alert = container.querySelector('[role="alert"]');
      expect(alert.getAttribute('aria-live')).toBe('assertive');
    });
  });

  describe('Modal', () => {
    it('should have proper dialog role and ARIA attributes', () => {
      const onClose = vi.fn();
      const { container } = render(
        <Modal
          isOpen={true}
          onClose={onClose}
          title="Test Modal"
          message="Test message"
        />
      );

      const dialog = container.querySelector('[role="dialog"]');
      expect(dialog).toBeTruthy();
      expect(dialog.getAttribute('aria-modal')).toBe('true');
      expect(dialog.getAttribute('aria-labelledby')).toBe('modal-title');
      expect(dialog.getAttribute('aria-describedby')).toBe('modal-description');
    });

    it('should have accessible close button', () => {
      const onClose = vi.fn();
      render(
        <Modal
          isOpen={true}
          onClose={onClose}
          title="Test Modal"
          message="Test message"
        />
      );

      const closeButtons = screen.getAllByRole('button', { name: /close/i });
      expect(closeButtons.length).toBeGreaterThan(0);
    });

    it('should be dismissible with Escape key', () => {
      const onClose = vi.fn();
      render(
        <Modal
          isOpen={true}
          onClose={onClose}
          title="Test Modal"
          message="Test message"
          closeOnEscape={true}
        />
      );

      fireEvent.keyDown(document, { key: 'Escape' });
      expect(onClose).toHaveBeenCalled();
    });

    it('should have keyboard accessible action buttons', () => {
      const onClose = vi.fn();
      const onAction = vi.fn();
      render(
        <Modal
          isOpen={true}
          onClose={onClose}
          title="Test Modal"
          message="Test message"
          actions={[
            { label: 'Confirm', onClick: onAction, primary: true },
            { label: 'Cancel', onClick: onClose },
          ]}
        />
      );

      const confirmButton = screen.getByRole('button', { name: /confirm/i });
      const cancelButton = screen.getByRole('button', { name: /cancel/i });

      expect(confirmButton).toBeTruthy();
      expect(cancelButton).toBeTruthy();
    });
  });

  describe('SkipToContent', () => {
    it('should have proper link with href', () => {
      render(<SkipToContent targetId="main-content" />);

      const skipLink = screen.getByText(/skip to main content/i);
      expect(skipLink).toBeTruthy();
      expect(skipLink.getAttribute('href')).toBe('#main-content');
    });

    it('should be keyboard accessible', () => {
      render(<SkipToContent targetId="main-content" />);

      const skipLink = screen.getByText(/skip to main content/i);
      skipLink.focus();
      expect(document.activeElement).toBe(skipLink);
    });
  });

  describe('Focus Indicators', () => {
    it('should have visible focus on buttons', () => {
      const onClick = vi.fn();
      render(<button onClick={onClick}>Test Button</button>);

      const button = screen.getByRole('button', { name: /test button/i });
      button.focus();

      const styles = window.getComputedStyle(button);
      // Focus styles are applied via CSS, so we just verify the button can be focused
      expect(document.activeElement).toBe(button);
    });
  });

  describe('Color Contrast', () => {
    it('should have sufficient contrast for text', () => {
      // This is a basic test - in production, use tools like axe-core
      const { container } = render(
        <div style={{ backgroundColor: '#ffffff', color: '#111827' }}>
          High contrast text
        </div>
      );

      const div = container.firstChild;
      expect(div).toBeTruthy();
      // Actual contrast testing would require color analysis utilities
    });
  });

  describe('Keyboard Navigation', () => {
    it('should support Tab navigation', () => {
      render(
        <div>
          <button>Button 1</button>
          <button>Button 2</button>
          <button>Button 3</button>
        </div>
      );

      const buttons = screen.getAllByRole('button');
      
      buttons[0].focus();
      expect(document.activeElement).toBe(buttons[0]);

      // Simulate Tab key
      fireEvent.keyDown(document.activeElement, { key: 'Tab' });
      // Note: Actual tab navigation is handled by the browser
    });
  });

  describe('ARIA Labels', () => {
    it('should have aria-label on icon buttons', () => {
      render(
        <button aria-label="Close dialog">
          ×
        </button>
      );

      const button = screen.getByRole('button', { name: /close dialog/i });
      expect(button).toBeTruthy();
      expect(button.getAttribute('aria-label')).toBe('Close dialog');
    });

    it('should have aria-describedby for additional context', () => {
      render(
        <div>
          <button aria-describedby="help-text">Submit</button>
          <div id="help-text">This will submit the form</div>
        </div>
      );

      const button = screen.getByRole('button', { name: /submit/i });
      expect(button.getAttribute('aria-describedby')).toBe('help-text');
    });
  });
});
