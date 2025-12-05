"use client"

import { type Match, matches as initialMatches } from "./data"

// Simple in-memory store for demo purposes
let matchesData = [...initialMatches]

export function getMatches(): Match[] {
  return matchesData
}

export function getMatchById(id: number): Match | undefined {
  return matchesData.find((m) => m.id === id)
}

export function getUpcomingMatches(): Match[] {
  return matchesData.filter((m) => m.status === "Upcoming")
}

export function getCompletedMatches(): Match[] {
  return matchesData.filter((m) => m.status === "Completed")
}

export function addMatch(match: Omit<Match, "id">): Match {
  const newMatch = {
    ...match,
    id: Math.max(...matchesData.map((m) => m.id), 0) + 1,
  }
  matchesData = [...matchesData, newMatch]
  return newMatch
}

export function updateMatch(id: number, updates: Partial<Match>): Match | undefined {
  const index = matchesData.findIndex((m) => m.id === id)
  if (index === -1) return undefined

  matchesData[index] = { ...matchesData[index], ...updates }
  return matchesData[index]
}

export function deleteMatch(id: number): boolean {
  const initialLength = matchesData.length
  matchesData = matchesData.filter((m) => m.id !== id)
  return matchesData.length < initialLength
}
