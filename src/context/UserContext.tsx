import type React from 'react';
import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import { type User, type DownloadHistory, UserSession } from '@/types/games';

interface UserContextType {
  user: User | null;
  isAuthenticated: boolean;
  downloadHistory: DownloadHistory[];
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: RegisterData) => Promise<boolean>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => void;
  addDownload: (gameId: string, downloadUrl: string, version: string) => void;
  getDownloadHistory: () => DownloadHistory[];
  hasDownloaded: (gameId: string) => boolean;
}

interface RegisterData {
  username: string;
  email: string;
  displayName: string;
  password: string;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [downloadHistory, setDownloadHistory] = useState<DownloadHistory[]>([]);

  useEffect(() => {
    // Load user from localStorage on mount
    const savedUser = localStorage.getItem('user');
    const savedHistory = localStorage.getItem('downloadHistory');

    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }

    if (savedHistory) {
      setDownloadHistory(JSON.parse(savedHistory));
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // Simulate API call - in real app, this would be an actual authentication request
      const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');
      const foundUser = existingUsers.find((u: { email: string; password: string }) => u.email === email && u.password === password);

      if (foundUser) {
        const userSession: User = {
          id: foundUser.id,
          username: foundUser.username,
          email: foundUser.email,
          displayName: foundUser.displayName,
          avatar: foundUser.avatar,
          joinDate: foundUser.joinDate,
          preferences: foundUser.preferences
        };

        setUser(userSession);
        localStorage.setItem('user', JSON.stringify(userSession));

        // Load user's download history
        const userHistory = JSON.parse(localStorage.getItem(`downloadHistory_${foundUser.id}`) || '[]');
        setDownloadHistory(userHistory);
        localStorage.setItem('downloadHistory', JSON.stringify(userHistory));

        return true;
      }

      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const register = async (userData: RegisterData): Promise<boolean> => {
    try {
      // Simulate API call
      const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');

      // Check if user already exists
      const userExists = existingUsers.some((u: User) => u.email === userData.email || u.username === userData.username);
      if (userExists) {
        return false;
      }

      const newUser = {
        id: Math.random().toString(36).substr(2, 9),
        username: userData.username,
        email: userData.email,
        displayName: userData.displayName,
        password: userData.password, // In real app, this would be hashed
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.displayName)}&background=00f7ff&color=000`,
        joinDate: new Date().toISOString(),
        preferences: {
          favoriteCategories: [],
          notifications: true,
          theme: 'auto' as const
        }
      };

      existingUsers.push(newUser);
      localStorage.setItem('users', JSON.stringify(existingUsers));

      // Auto login after registration
      const userSession: User = {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        displayName: newUser.displayName,
        avatar: newUser.avatar,
        joinDate: newUser.joinDate,
        preferences: newUser.preferences
      };

      setUser(userSession);
      localStorage.setItem('user', JSON.stringify(userSession));
      setDownloadHistory([]);

      return true;
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setDownloadHistory([]);
    localStorage.removeItem('user');
    localStorage.removeItem('downloadHistory');
  };

  const updateProfile = (updates: Partial<User>) => {
    if (!user) return;

    const updatedUser = { ...user, ...updates };
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));

    // Update in users array too
    const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');
    const updatedUsers = existingUsers.map((u: User) =>
      u.id === user.id ? { ...u, ...updates } : u
    );
    localStorage.setItem('users', JSON.stringify(updatedUsers));
  };

  const addDownload = (gameId: string, downloadUrl: string, version: string) => {
    if (!user) return;

    const download: DownloadHistory = {
      id: Math.random().toString(36).substr(2, 9),
      userId: user.id,
      gameId,
      downloadDate: new Date().toISOString(),
      downloadUrl,
      version,
      completed: true
    };

    const updatedHistory = [download, ...downloadHistory];
    setDownloadHistory(updatedHistory);
    localStorage.setItem('downloadHistory', JSON.stringify(updatedHistory));
    localStorage.setItem(`downloadHistory_${user.id}`, JSON.stringify(updatedHistory));
  };

  const getDownloadHistory = (): DownloadHistory[] => {
    return downloadHistory.sort((a, b) => new Date(b.downloadDate).getTime() - new Date(a.downloadDate).getTime());
  };

  const hasDownloaded = (gameId: string): boolean => {
    return downloadHistory.some(download => download.gameId === gameId);
  };

  const value: UserContextType = {
    user,
    isAuthenticated: !!user,
    downloadHistory,
    login,
    register,
    logout,
    updateProfile,
    addDownload,
    getDownloadHistory,
    hasDownloaded
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};
