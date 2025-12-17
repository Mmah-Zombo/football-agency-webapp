// lib/auth-store.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type UserRole = "agent" | "scout" | "club";

export const roleLabels: Record<UserRole, string> = {
  agent: "Agent",
  scout: "Scout",
  club: "Club Manager"
};

export const roleDescriptions: Record<UserRole, string> = {
  agent: "Manage players, negotiate contracts, and provide reports on potential signings.",
  scout: "Discover new talents and provide reports on potential signings.",
  club: "Manage club operations, player acquisitions, and provide team strategy."
};

interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string, role: UserRole) => Promise<boolean>;
  register: (name: string, email: string, password: string, role: UserRole) => Promise<boolean>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => void;
  loadUser: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,

      login: async (email, password, role) => {
        try {
          const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password, role }),
          });

          if (response.ok) {
            const data = await response.json();
            set({ isAuthenticated: true, user: data.user });
            return true;
          }
          return false;
        } catch (error) {
          console.error(error);
          return false;
        }
      },

      register: async (name, email, password, role) => {
        try {
          const response = await fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password, role }),
          });

          if (response.ok) {
            const data = await response.json();
            const newUser = { id: data.user?.id || 1, name, email, role };
            set({ isAuthenticated: true, user: newUser });
            return true;
          }
          return false;
        } catch (error) {
          console.error(error);
          return false;
        }
      },

      logout: async () => {
        // 1. Call server-side logout endpoint to invalidate the HttpOnly cookie
        try {
          await fetch('/api/auth/logout', {
            method: 'POST',
            credentials: 'include', // Important: sends cookies
          });
        } catch (error) {
          console.error('Logout API call failed:', error);
          // Continue with client-side cleanup even if API fails
        }

        // 2. Clear persisted Zustand state
        localStorage.removeItem('auth-storage');

        // 3. Reset store state
        set({ user: null, isAuthenticated: false });
      },

      updateProfile: (data) => {
        set((state) => ({
          user: state.user ? { ...state.user, ...data } : null,
        }));
      },

      loadUser: () => {
        const state = get();
        if (state.user) {
          set({ isAuthenticated: true });
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user }),
    }
  )
);