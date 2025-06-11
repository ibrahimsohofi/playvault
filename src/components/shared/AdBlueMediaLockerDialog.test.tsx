import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AdBlueMediaLockerDialog } from './AdBlueMediaLockerDialog';
import * as lockerConfig from '@/data/lockerConfig';

// Mock the lockerConfig
vi.mock('@/data/lockerConfig', () => ({
  getAdBlueMediaConfig: vi.fn().mockReturnValue({
    key: 'test-campaign-key',
    it: 12345
  })
}));

describe('AdBlueMediaLockerDialog', () => {
  const mockProps = {
    isOpen: true,
    onClose: vi.fn(),
    title: 'Test Title',
    description: 'Test Description',
    gameId: 'test-game'
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
        href: 'https://playvault.com',
        origin: 'https://playvault.com'
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

  it('should show loading state initially', () => {
    render(<AdBlueMediaLockerDialog {...mockProps} />);
    expect(screen.getByText('Loading offer system...')).toBeInTheDocument();
  });

  it('should handle ad blocker detection', async () => {
    // Mock createElement to simulate ad blocker
    const originalCreateElement = document.createElement;
    document.createElement = vi.fn().mockImplementation(() => ({
      style: {},
      innerHTML: '',
      appendChild: vi.fn()
    }));

    render(<AdBlueMediaLockerDialog {...mockProps} />);

    // Wait for ad blocker check
    await waitFor(() => {
      expect(screen.getByText(/Ad blocker detected/)).toBeInTheDocument();
    });

    // Restore original createElement
    document.createElement = originalCreateElement;
  });

  it('should handle offer loading error', async () => {
    // Mock createElement to simulate error
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
      expect(screen.getByText(/Failed to load offers/)).toBeInTheDocument();
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
      expect(screen.getByText(/Failed to load offers/)).toBeInTheDocument();
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

  it('should handle offer completion', async () => {
    render(<AdBlueMediaLockerDialog {...mockProps} />);

    // Simulate offer completion
    const completionEvent = new MessageEvent('message', {
      data: { status: 'completed' }
    });
    window.dispatchEvent(completionEvent);

    // Should set localStorage and close dialog
    expect(window.localStorage.setItem).toHaveBeenCalledWith('unlocked_test-game', 'true');
    expect(mockProps.onClose).toHaveBeenCalled();
  });
});