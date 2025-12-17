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
  loadUser: () => void; // <-- added
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

      logout: () => {
        document.cookie = 'auth_token=; Max-Age=0; path=/';
        set({ user: null, isAuthenticated: false });
      },

      updateProfile: (data) => {
        set((state) => ({
          user: state.user ? { ...state.user, ...data } : null,
        }));
      },

      loadUser: () => {
        // Try to restore user from persisted state (via persist middleware)
        // If no persisted user, attempt to validate current token
        const state = get();
        if (state.user) {
          set({ isAuthenticated: true });
          return;
        }

        // Optional: validate token server-side if needed
        // For demo/mock purposes we just leave it as not authenticated
      },
    }),
    {
      name: 'auth-storage', // key in localStorage
      partialize: (state) => ({ user: state.user }), // only persist user object
    }
  )
);