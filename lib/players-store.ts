"use client"

import { type Player, players as initialPlayers } from "./data"

// Simple in-memory store for demo purposes
let playersData = [...initialPlayers]

export function getPlayers(): Player[] {
  return playersData
}

export function getPlayerById(id: number): Player | undefined {
  return playersData.find((p) => p.id === id)
}

export function addPlayer(player: Omit<Player, "id">): Player {
  const newPlayer = {
    ...player,
    id: Math.max(...playersData.map((p) => p.id)) + 1,
  }
  playersData = [...playersData, newPlayer]
  return newPlayer
}

export function updatePlayer(id: number, updates: Partial<Player>): Player | undefined {
  const index = playersData.findIndex((p) => p.id === id)
  if (index === -1) return undefined

  playersData[index] = { ...playersData[index], ...updates }
  return playersData[index]
}

export function deletePlayer(id: number): boolean {
  const initialLength = playersData.length
  playersData = playersData.filter((p) => p.id !== id)
  return playersData.length < initialLength
}
