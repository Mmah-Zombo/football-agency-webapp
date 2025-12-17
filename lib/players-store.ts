// lib/players-store.ts
"use client"

import { useEffect, useState } from "react"
import type { Player } from "@/lib/data"
// import { players as initialPlayers } from "@/lib/data"

// In-memory cache initialized with static data
// let cachedPlayers: Player[] = [...initialPlayers]

// Client-safe sync getter
// export function getPlayers(): Player[] {
//   return cachedPlayers
// }

// Reactive hook for components that need live updates (polling)
export function usePlayers() {
  const [players, setPlayers] = useState<Player[]>()

  useEffect(() => {
    // Only run in browser
    if (typeof window === "undefined") return

    let isMounted = true

    const updatePlayers = async () => {
      try {
        // Import server action dynamically ONLY here (inside effect)
        const { getPlayers: serverGetPlayers } = await import("@/lib/server/players-excel.server")
        const freshPlayers = await serverGetPlayers()

        if (isMounted) {
          setPlayers(freshPlayers)
        }
      } catch (err) {
        console.error("Failed to fetch latest players:", err)
        // Keep using cached/static data on error
      }
    }

    // Initial fetch
    updatePlayers()

    // Poll every second
    const interval = setInterval(updatePlayers, 1000)

    return () => {
      isMounted = false
      clearInterval(interval)
    }
  }, [])

  return players
}