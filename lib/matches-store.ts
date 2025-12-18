"use client"

import { type Match} from "./data"

// Simple in-memory store for demo purposes
let matchesData: any = []

export function getMatches(): Match[] {
  return matchesData
}

export function getMatchById(id: number): Match | undefined {
  return matchesData?.find((m: any) => m.id === id)
}

export function getUpcomingMatches(): Match[] {
  return matchesData.filter((m: any) => m.status === "Upcoming")
}

export function getCompletedMatches(): Match[] {
  return matchesData.filter((m: any) => m.status === "Completed")
}

export function addMatch(match: Omit<Match, "id">): Match {
  const newMatch = {
    ...match,
    id: Math.max(...matchesData.map((m: any) => m.id), 0) + 1,
  }
  matchesData = [...matchesData, newMatch]
  return newMatch
}

export function updateMatch(id: number, updates: Partial<Match>): Match | undefined {
  const index = matchesData.findIndex((m: any) => m.id === id)
  if (index === -1) return undefined

  matchesData[index] = { ...matchesData[index], ...updates }
  return matchesData[index]
}

export function deleteMatch(id: number): boolean {
  const initialLength = matchesData.length
  matchesData = matchesData.filter((m: any) => m.id !== id)
  return matchesData.length < initialLength
}
