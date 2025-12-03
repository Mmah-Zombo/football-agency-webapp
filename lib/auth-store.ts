"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

export type UserRole = "agent" | "scout" | "admin" | "club_manager"

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  avatar?: string
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  login: (email: string, password: string, role: UserRole) => Promise<boolean>
  register: (name: string, email: string, password: string, role: UserRole) => Promise<boolean>
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: async (email: string, password: string, role: UserRole) => {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Mock successful login
        const user: User = {
          id: crypto.randomUUID(),
          name: email.split("@")[0],
          email,
          role,
          avatar: "/professional-avatar.png",
        }

        set({ user, isAuthenticated: true })
        return true
      },
      register: async (name: string, email: string, password: string, role: UserRole) => {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000))

        const user: User = {
          id: crypto.randomUUID(),
          name,
          email,
          role,
          avatar: "/professional-avatar.png",
        }

        set({ user, isAuthenticated: true })
        return true
      },
      logout: () => {
        set({ user: null, isAuthenticated: false })
      },
    }),
    {
      name: "auth-storage",
    },
  ),
)

export const roleLabels: Record<UserRole, string> = {
  agent: "Football Agent",
  scout: "Scout",
  admin: "Administrator",
  club_manager: "Club Manager",
}

export const roleDescriptions: Record<UserRole, string> = {
  agent: "Manage players, negotiate contracts, and build relationships with clubs",
  scout: "Discover talent, create reports, and recommend players",
  admin: "Full system access with user and data management capabilities",
  club_manager: "Manage club operations, review player profiles, and handle contracts",
}
