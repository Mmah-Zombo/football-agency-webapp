// lib/players.ts  (client-safe wrapper – keep exactly as before)
import { getPlayers as serverGetPlayers, getPlayerById as serverGetPlayerById } from './server/players-excel.server'
import type { Player } from './server/players-excel.server'

export async function getPlayers(): Promise<Player[]> {
  return await serverGetPlayers()
}

export async function getPlayerById(id: number): Promise<Player | null> {
  return await serverGetPlayerById(id)
}

export type { Player }