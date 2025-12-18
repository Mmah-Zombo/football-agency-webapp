"use client"

import { type Club } from "./data"

// Simple in-memory store for demo purposes
let clubsData: any = []

export function getClubs(): Club[] {
  return clubsData
}

export function getClubById(id: number): Club | undefined {
  return clubsData.find((c: any) => c.id === id)
}

export function addClub(club: Omit<Club, "id">): Club {
  const newClub = {
    ...club,
    id: Math.max(...clubsData.map((c:any) => c.id)) + 1,
  }
  clubsData = [...clubsData, newClub]
  return newClub
}

export function updateClub(id: number, updates: Partial<Club>): Club | undefined {
  const index = clubsData.findIndex((c:any) => c.id === id)
  if (index === -1) return undefined

  clubsData[index] = { ...clubsData[index], ...updates }
  return clubsData[index]
}

export function deleteClub(id: number): boolean {
  const initialLength = clubsData.length
  clubsData = clubsData.filter((c:any) => c.id !== id)
  return clubsData.length < initialLength
}
