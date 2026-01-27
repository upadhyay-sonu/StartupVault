import { create } from 'zustand';

export interface User {
  id: string;
  email: string;
  name: string;
  isVerified: boolean;
  company?: string;
  role?: string;
  createdAt?: string;
}

interface AuthStore {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  setIsLoading: (loading: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>((set) => {
  // Load from localStorage on initialization
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    if (token && user) {
      try {
        set({
          token,
          user: JSON.parse(user),
        });
      } catch (e) {
        localStorage.clear();
      }
    }
  }

  return {
    user: null,
    token: null,
    isLoading: false,

    setUser: (user) => {
      set({ user });
      if (user) {
        localStorage.setItem('user', JSON.stringify(user));
      } else {
        localStorage.removeItem('user');
      }
    },

    setToken: (token) => {
      set({ token });
      if (token) {
        localStorage.setItem('token', token);
      } else {
        localStorage.removeItem('token');
      }
    },

    setIsLoading: (isLoading) => set({ isLoading }),

    logout: () => {
      set({ user: null, token: null });
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },
  };
});

interface UiStore {
  mobileMenuOpen: boolean;
  toggleMobileMenu: () => void;
  closeMobileMenu: () => void;
}

export const useUiStore = create<UiStore>((set) => ({
  mobileMenuOpen: false,
  toggleMobileMenu: () => set((state) => ({ mobileMenuOpen: !state.mobileMenuOpen })),
  closeMobileMenu: () => set({ mobileMenuOpen: false }),
}));
