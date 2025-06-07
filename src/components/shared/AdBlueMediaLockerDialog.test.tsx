import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AdBlueMediaLockerDialog } from './AdBlueMediaLockerDialog';
import * as lockerConfig from '@/data/lockerConfig';

// Mock the lockerConfig
vi.mock('@/data/lockerConfig', () => ({
  ADBLUE_CAMPAIGN_ID: 'test-campaign-id',
  getRedirectUrl: vi.fn().mockReturnValue('https://test-redirect.com')
}));

describe('AdBlueMediaLockerDialog', () => {
  const mockProps = {
    isOpen: true,
    onClose: vi.fn(),
    title: 'Test Title',
    description: 'Test Description',
    contentId: 'test-game',
    redirectUrl: 'https://test-redirect.com/game/test-game'
  };

  beforeEach(() => {
    // Mock localStorage
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: vi.fn().mockReturnValue(null), // Default: not unlocked
        setItem: vi.fn(),
        removeItem: vi.fn()
      },
      writable: true
    });

    // Mock window.location
    Object.defineProperty(window, 'location', {
      value: {
        href: 'https://playvault.com'
      },
      writable: true
    });

    // Mock document.body.appendChild
    document.body.appendChild = vi.fn();

    // Mock setTimeout
    vi.useFakeTimers();

    // Mock console methods
    console.log = vi.fn();
    console.error = vi.fn();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should not render if content is already unlocked', () => {
    // Setup: Content is unlocked
    (window.localStorage.getItem as ReturnType<typeof vi.fn>).mockReturnValueOnce('true');

    const { container } = render(<AdBlueMediaLockerDialog {...mockProps} />);

    expect(container.firstChild).toBeNull();
    expect(window.location.href).toBe(mockProps.redirectUrl);
  });

  it('should show loading state initially', () => {
    render(<AdBlueMediaLockerDialog {...mockProps} />);

    expect(screen.getByText('Loading offers...')).toBeInTheDocument();
  });

  it('should create iframe with correct URL structure', async () => {
    const createElementSpy = vi.spyOn(document, 'createElement');
    
    render(<AdBlueMediaLockerDialog {...mockProps} />);

    // Wait for iframe creation
    vi.advanceTimersByTime(400);

    expect(createElementSpy).toHaveBeenCalledWith('iframe');
  });

  it('should handle iframe load success', async () => {
    // Mock createElement to track iframe creation
    const originalCreateElement = document.createElement;
    const mockIframe = {
      style: {},
      src: '',
      onload: null as ((event: Event) => void) | null,
      onerror: null,
      allow: '',
      setAttribute: vi.fn(),
      addEventListener: vi.fn(),
      remove: vi.fn()
    };

    document.createElement = vi.fn().mockImplementation((tagName) => {
      if (tagName === 'iframe') {
        return mockIframe;
      }
      return originalCreateElement.call(document, tagName);
    });

    render(<AdBlueMediaLockerDialog {...mockProps} />);

    // Wait for iframe creation
    vi.advanceTimersByTime(400);

    // Trigger onload
    if (mockIframe.onload) {
      mockIframe.onload(new Event('load'));
    }

    // Loading state should be gone
    await waitFor(() => {
      expect(screen.queryByText('Loading offers...')).not.toBeInTheDocument();
    });

    // Restore original createElement
    document.createElement = originalCreateElement;
  });

  it('should handle iframe load error', async () => {
    // Mock createElement to track iframe creation
    const originalCreateElement = document.createElement;
    const mockIframe = {
      style: {},
      src: '',
      onload: null,
      onerror: null as ((event: Event) => void) | null,
      allow: '',
      setAttribute: vi.fn(),
      addEventListener: vi.fn(),
      remove: vi.fn()
    };

    document.createElement = vi.fn().mockImplementation((tagName) => {
      if (tagName === 'iframe') {
        return mockIframe;
      }
      return originalCreateElement.call(document, tagName);
    });

    render(<AdBlueMediaLockerDialog {...mockProps} />);

    // Wait for iframe creation
    vi.advanceTimersByTime(400);

    // Trigger onerror
    if (mockIframe.onerror) {
      mockIframe.onerror(new Event('error'));
    }

    // Error state should be shown
    await waitFor(() => {
      expect(screen.getByText('Failed to load offers. Please try again later.')).toBeInTheDocument();
    });

    // Restore original createElement
    document.createElement = originalCreateElement;
  });

  it('should handle retry button click', async () => {
    // Mock createElement to track iframe creation
    const originalCreateElement = document.createElement;
    const mockIframe = {
      style: {},
      src: '',
      onload: null,
      onerror: null as ((event: Event) => void) | null,
      allow: '',
      setAttribute: vi.fn(),
      addEventListener: vi.fn(),
      remove: vi.fn()
    };

    const createElementSpy = vi.fn().mockImplementation((tagName) => {
      if (tagName === 'iframe') {
        return mockIframe;
      }
      return originalCreateElement.call(document, tagName);
    });

    document.createElement = createElementSpy;

    render(<AdBlueMediaLockerDialog {...mockProps} />);

    // Wait for iframe creation and trigger error
    vi.advanceTimersByTime(400);

    // Trigger onerror
    if (mockIframe.onerror) {
      mockIframe.onerror(new Event('error'));
    }

    // Wait for error state
    await waitFor(() => {
      expect(screen.getByText('Failed to load offers. Please try again later.')).toBeInTheDocument();
    });

    // Clear spy to track new calls
    createElementSpy.mockClear();

    // Click retry button
    fireEvent.click(screen.getByText(/Retry/));

    // Should create a new iframe
    expect(createElementSpy).toHaveBeenCalledWith('iframe');

    // Restore original createElement
    document.createElement = originalCreateElement;
  });

  it('should handle message events for completion', () => {
    render(<AdBlueMediaLockerDialog {...mockProps} />);

    // Simulate a completion message
    const completionEvent = new MessageEvent('message', {
      data: { status: 'completed' }
    });
    window.dispatchEvent(completionEvent);

    // Should set localStorage and redirect
    expect(window.localStorage.setItem).toHaveBeenCalledWith('unlocked_test-game', 'true');
    expect(window.location.href).toBe(mockProps.redirectUrl);
  });

  it('should handle message events for errors', async () => {
    render(<AdBlueMediaLockerDialog {...mockProps} />);

    // Simulate an error message
    const errorEvent = new MessageEvent('message', {
      data: { error: 'Test error message' }
    });
    window.dispatchEvent(errorEvent);

    // Should show error message
    await waitFor(() => {
      expect(screen.getByText('Test error message')).toBeInTheDocument();
    });
  });

  it('should clean up resources on unmount', () => {
    const { unmount } = render(<AdBlueMediaLockerDialog {...mockProps} />);

    // Add event listeners
    const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');

    // Unmount component
    unmount();

    // Should remove event listeners
    expect(removeEventListenerSpy).toHaveBeenCalled();
  });
});