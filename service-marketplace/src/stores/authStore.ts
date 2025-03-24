import { create } from 'zustand';
import { UserSession, AuthState, LoginFormData, RegisterFormData } from '@/types';
import { findUserByEmail, validatePassword, getUserSession } from '@/lib/users';
import { nanoid } from 'nanoid';

interface AuthStore extends AuthState {
  login: (data: LoginFormData) => Promise<UserSession | null>;
  register: (data: RegisterFormData) => Promise<UserSession | null>;
  logout: () => void;
  checkAuth: () => Promise<UserSession | null>;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  isLoading: false,
  error: null,

  login: async (data: LoginFormData) => {
    try {
      set({ isLoading: true, error: null });

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));

      // Find user by email
      const user = findUserByEmail(data.email);
      if (!user) {
        throw new Error('Invalid email or password');
      }

      // Validate password
      if (!validatePassword(data.password, user.password || '')) {
        throw new Error('Invalid email or password');
      }

      // Create user session
      const userSession = getUserSession(user);

      // Store in localStorage (in a real app, this would be managed by next-auth or a JWT)
      localStorage.setItem('userSession', JSON.stringify(userSession));

      set({ user: userSession, isLoading: false });
      return userSession;
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
      return null;
    }
  },

  register: async (data: RegisterFormData) => {
    try {
      set({ isLoading: true, error: null });

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));

      // Validate passwords match
      if (data.password !== data.confirmPassword) {
        throw new Error('Passwords do not match');
      }

      // Check if email already exists
      if (findUserByEmail(data.email)) {
        throw new Error('Email already in use');
      }

      // In a real app, this would save to a database
      // For this mock, we'll just create a session
      const newUser = {
        id: nanoid(),
        email: data.email,
        name: data.name,
        role: 'user' as const,
        isServiceProvider: false,
        profileImage: `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70)}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      // Store in localStorage (in a real app, this would be managed by next-auth or a JWT)
      localStorage.setItem('userSession', JSON.stringify(newUser));

      set({ user: newUser, isLoading: false });
      return newUser;
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
      return null;
    }
  },

  logout: () => {
    localStorage.removeItem('userSession');
    set({ user: null });
  },

  checkAuth: async () => {
    try {
      set({ isLoading: true });

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 200));

      // Check localStorage for existing session
      const storedSession = localStorage.getItem('userSession');
      if (!storedSession) {
        set({ isLoading: false });
        return null;
      }

      const userSession = JSON.parse(storedSession) as UserSession;
      set({ user: userSession, isLoading: false });
      return userSession;
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
      return null;
    }
  }
}));
