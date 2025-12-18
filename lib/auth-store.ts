// lib/auth-store.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type UserRole = "agent" | "scout" | "club"

export const roleLabels: Record<UserRole, string> = {
  agent: "Agent",
  scout: "Scout",
  club: "Club Manager",
}

export const roleDescriptions: Record<UserRole, string> = {
  agent: "Manage players, negotiate contracts, and provide reports on potential signings.",
  scout: "Discover new talents and provide reports on potential signings.",
  club: "Manage club operations, player acquisitions, and provide team strategy."
};


interface User {
  id: number
  name: string
  email: string
  role: UserRole
  avatar?: string
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean // new: track loading state
  login: (email: string, password: string, role: UserRole) => Promise<boolean>
  register: (name: string, email: string, password: string, role: UserRole) => Promise<boolean>
  logout: () => Promise<void>
  updateProfile: (data: Partial<User>) => void
  loadUser: () => Promise<void> // now async!
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: true, // start as loading

      login: async (email, password, role) => {
        try {
          const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password, role }),
          })

          if (response.ok) {
            const data = await response.json()
            set({ user: data.user, isAuthenticated: true, isLoading: false })
            return true
          }
          return false
        } catch (error) {
          console.error(error)
          return false
        }
      },

      register: async (name, email, password, role) => {
        try {
          const response = await fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password, role }),
          })

          if (response.ok) {
            const data = await response.json()
            set({
              user: data.user || { id: 1, name, email, role },
              isAuthenticated: true,
              isLoading: false,
            })
            return true
          }
          return false
        } catch (error) {
          console.error(error)
          return false
        }
      },

      logout: async () => {
        try {
          await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' })
        } catch (error) {
          console.error('Logout API failed:', error)
        }

        localStorage.removeItem('auth-storage')
        set({ user: null, isAuthenticated: false, isLoading: false })
      },

      updateProfile: (data) => {
        set((state) => ({
          user: state.user ? { ...state.user, ...data } : null,
        }))
      },

      // Critical fix: fetch from server on mount
      loadUser: async () => {
        set({ isLoading: true })
        try {
          const response = await fetch('/api/auth/me', {
            credentials: 'include', // sends HttpOnly cookie
          })

          if (response.ok) {
            const data = await response.json()
            set({ user: data.user, isAuthenticated: true, isLoading: false })
          } else {
            set({ user: null, isAuthenticated: false, isLoading: false })
          }
        } catch (error) {
          console.error("Failed to load user:", error)
          set({ user: null, isAuthenticated: false, isLoading: false })
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user }), // only persist user
    }
  )
)