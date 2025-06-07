import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { DownloadHandlerPage } from './DownloadHandlerPage';
import * as lockerConfig from '@/data/lockerConfig';
import { MemoryRouter } from 'react-router-dom';

// Mock the lockerConfig
vi.mock('@/data/lockerConfig', () => ({
  getDownloadUrl: vi.fn()
}));

// Mock the SecurityCheck component to automatically dismiss
vi.mock('@/components/shared/SecurityCheck', () => ({
  SecurityCheck: ({ onDismiss }: { onDismiss: () => void }) => {
    // Auto-dismiss the security check immediately
    onDismiss();
    return <div data-testid="security-check">Security Check Mock</div>;
  }
}));

const renderWithRouter = (searchParams = '') => {
  const initialEntries = searchParams ? [`/download-handler?${searchParams}`] : ['/download-handler'];
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <DownloadHandlerPage />
    </MemoryRouter>
  );
};

describe('DownloadHandlerPage', () => {
  beforeEach(() => {
    // Mock localStorage
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: vi.fn(),
        setItem: vi.fn(),
        removeItem: vi.fn()
      },
      writable: true
    });

    // Mock window.location
    Object.defineProperty(window, 'location', {
      value: {
        href: 'https://playvault.com/download-handler'
      },
      writable: true
    });

    // Mock console methods
    console.log = vi.fn();
    console.error = vi.fn();

    // Use fake timers
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should show invalid download request when no gameId is provided', () => {
    // Mock empty search params
    (lockerConfig.getDownloadUrl as ReturnType<typeof vi.fn>).mockReturnValue('');

    renderWithRouter();

    expect(screen.getByText('Invalid Download Request')).toBeInTheDocument();
    expect(screen.getByText(/We couldn't find the game you're looking for/)).toBeInTheDocument();
  });

  it('should show download countdown when valid gameId is provided', async () => {
    // Mock valid gameId and download URL
    (lockerConfig.getDownloadUrl as ReturnType<typeof vi.fn>).mockReturnValue('https://cdn.playvault.com/downloads/test-game.apk');

    renderWithRouter('gameId=test-game');

    // Wait for security check to be passed and countdown to start
    await waitFor(() => {
      expect(screen.getByText('Download Starting Soon')).toBeInTheDocument();
      expect(screen.getByText(/Your download will begin automatically/)).toBeInTheDocument();
    }, { timeout: 1000 });
  });

  it('should start countdown from 5 seconds', async () => {
    // Mock valid gameId and download URL
    (lockerConfig.getDownloadUrl as ReturnType<typeof vi.fn>).mockReturnValue('https://cdn.playvault.com/downloads/test-game.apk');

    renderWithRouter('gameId=test-game');

    // Wait for countdown to appear
    await waitFor(() => {
      expect(screen.getByText('5')).toBeInTheDocument();
    }, { timeout: 1000 });
  });

  it('should decrement countdown timer', async () => {
    // Mock valid gameId and download URL
    (lockerConfig.getDownloadUrl as ReturnType<typeof vi.fn>).mockReturnValue('https://cdn.playvault.com/downloads/test-game.apk');

    renderWithRouter('gameId=test-game');

    // Wait for initial countdown
    await waitFor(() => {
      expect(screen.getByText('5')).toBeInTheDocument();
    }, { timeout: 1000 });

    // Advance timer by 1 second
    vi.advanceTimersByTime(1000);

    await waitFor(() => {
      expect(screen.getByText('4')).toBeInTheDocument();
    }, { timeout: 1000 });

    // Advance timer by 1 more second
    vi.advanceTimersByTime(1000);

    await waitFor(() => {
      expect(screen.getByText('3')).toBeInTheDocument();
    }, { timeout: 1000 });
  });

  it('should redirect to download URL when countdown reaches 0', async () => {
    // Mock valid gameId and download URL
    const mockDownloadUrl = 'https://cdn.playvault.com/downloads/test-game.apk';
    (lockerConfig.getDownloadUrl as ReturnType<typeof vi.fn>).mockReturnValue(mockDownloadUrl);

    renderWithRouter('gameId=test-game');

    // Wait for countdown to start
    await waitFor(() => {
      expect(screen.getByText('5')).toBeInTheDocument();
    }, { timeout: 1000 });

    // Advance timer to complete countdown (5 seconds)
    vi.advanceTimersByTime(5000);

    // Wait for redirect
    await waitFor(() => {
      expect(window.location.href).toBe(mockDownloadUrl);
    }, { timeout: 1000 });
  });

  it('should show error message when download URL is not found', async () => {
    // Mock valid gameId but invalid download URL
    (lockerConfig.getDownloadUrl as ReturnType<typeof vi.fn>).mockReturnValue('');

    renderWithRouter('gameId=test-game');

    // Should show invalid download request
    expect(screen.getByText('Invalid Download Request')).toBeInTheDocument();
  });

  it('should log download handler access', () => {
    // Mock valid gameId and download URL
    (lockerConfig.getDownloadUrl as ReturnType<typeof vi.fn>).mockReturnValue('https://cdn.playvault.com/downloads/test-game.apk');

    renderWithRouter('gameId=test-game');

    // Should log download handler access
    expect(console.log).toHaveBeenCalledWith(expect.stringContaining('Download handler accessed'));
  });

  it('should check unlock status in localStorage', () => {
    // Mock valid gameId and download URL
    (lockerConfig.getDownloadUrl as ReturnType<typeof vi.fn>).mockReturnValue('https://cdn.playvault.com/downloads/test-game.apk');

    // Mock localStorage.getItem to return unlocked status
    (window.localStorage.getItem as ReturnType<typeof vi.fn>).mockReturnValueOnce('true');

    renderWithRouter('gameId=test-game');

    // Should check localStorage
    expect(window.localStorage.getItem).toHaveBeenCalled();
    expect(console.log).toHaveBeenCalledWith(expect.stringContaining('Unlocked'));
  });
});