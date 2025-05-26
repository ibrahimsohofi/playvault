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

    // Mock createElement and appendChild for iframe creation
    document.createElement = vi.fn().mockImplementation((tag: string) => {
      if (tag === 'iframe') {
        return {
          style: {},
          src: '',
          onload: null,
          onerror: null,
          allow: '',
          setAttribute: vi.fn(),
          addEventListener: vi.fn()
        };
      }
      return document.createElement(tag);
    });

    // Mock setTimeout
    vi.useFakeTimers();

    // Mock console methods
    console.log = vi.fn();
    console.error = vi.fn();
  });

  afterEach(() => {
    vi.clearAllMocks();
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

  it('should create iframe with correct AdBlueMedia URL', async () => {
    render(<AdBlueMediaLockerDialog {...mockProps} />);
    
    // Wait for iframe creation
    vi.advanceTimersByTime(400);
    
    expect(document.createElement).toHaveBeenCalledWith('iframe');
    const createIframeCalls = (document.createElement as ReturnType<typeof vi.fn>).mock.calls;
    const iframeCall = createIframeCalls.find((call: any[]) => call[0] === 'iframe');
    
    expect(iframeCall).toBeTruthy();
  });

  it('should handle iframe load success', async () => {
    render(<AdBlueMediaLockerDialog {...mockProps} />);
    
    // Wait for iframe creation
    vi.advanceTimersByTime(400);
    
    // Get the iframe mock
    const createIframeCalls = (document.createElement as jest.Mock).mock.calls;
    const iframeCall = createIframeCalls.find(call => call[0] === 'iframe');
    const iframeMock = iframeCall ? (document.createElement as jest.Mock).mock.results[createIframeCalls.indexOf(iframeCall)].value : null;
    
    // Trigger onload
    if (iframeMock && iframeMock.onload) {
      iframeMock.onload();
    }
    
    // Loading state should be gone
    await waitFor(() => {
      expect(screen.queryByText('Loading offers...')).not.toBeInTheDocument();
    });
  });

  it('should handle iframe load error', async () => {
    render(<AdBlueMediaLockerDialog {...mockProps} />);
    
    // Wait for iframe creation
    vi.advanceTimersByTime(400);
    
    // Get the iframe mock
    const createIframeCalls = (document.createElement as jest.Mock).mock.calls;
    const iframeCall = createIframeCalls.find(call => call[0] === 'iframe');
    const iframeMock = iframeCall ? (document.createElement as jest.Mock).mock.results[createIframeCalls.indexOf(iframeCall)].value : null;
    
    // Trigger onerror
    if (iframeMock && iframeMock.onerror) {
      iframeMock.onerror();
    }
    
    // Error state should be shown
    await waitFor(() => {
      expect(screen.getByText('Failed to load offers. Please try again later.')).toBeInTheDocument();
    });
  });

  it('should handle retry button click', async () => {
    render(<AdBlueMediaLockerDialog {...mockProps} />);
    
    // Wait for iframe creation and trigger error
    vi.advanceTimersByTime(400);
    
    // Get the iframe mock
    const createIframeCalls = (document.createElement as jest.Mock).mock.calls;
    const iframeCall = createIframeCalls.find(call => call[0] === 'iframe');
    const iframeMock = iframeCall ? (document.createElement as jest.Mock).mock.results[createIframeCalls.indexOf(iframeCall)].value : null;
    
    // Trigger onerror
    if (iframeMock && iframeMock.onerror) {
      iframeMock.onerror();
    }
    
    // Wait for error state
    await waitFor(() => {
      expect(screen.getByText('Failed to load offers. Please try again later.')).toBeInTheDocument();
    });
    
    // Reset mocks for retry
    vi.clearAllMocks();
    
    // Click retry button
    fireEvent.click(screen.getByText(/Retry/));
    
    // Should create a new iframe
    expect(document.createElement).toHaveBeenCalledWith('iframe');
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
    const addEventListenerSpy = vi.spyOn(window, 'addEventListener');
    const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');
    
    // Unmount component
    unmount();
    
    // Should remove event listeners
    expect(removeEventListenerSpy).toHaveBeenCalled();
  });
});
