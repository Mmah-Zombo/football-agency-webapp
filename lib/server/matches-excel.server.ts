// lib/server/matches-excel.server.ts
'use server'

import ExcelJS from 'exceljs'
import { promises as fs } from 'fs'
import path from 'path'
import { revalidatePath } from 'next/cache'

export type Match = {
  id: number
  homeTeam: string
  awayTeam: string
  date: string // YYYY-MM-DD
  venue: string
  status: 'Upcoming' | 'In Progress' | 'Completed'
  result?: string // e.g. "2-1"
  managedPlayers: string[] // array of player names
}

const EXCEL_PATH = path.join(process.cwd(), 'public/data/matches.xlsx')

async function ensureFiles() {
  await fs.mkdir(path.dirname(EXCEL_PATH), { recursive: true })

  let fileExists = false
  try {
    await fs.access(EXCEL_PATH)
    fileExists = true
  } catch {
    // File does not exist
  }

  if (!fileExists) {
    const wb = new ExcelJS.Workbook()
    const ws = wb.addWorksheet('Matches')
    ws.columns = [
      { header: 'id', key: 'id', width: 10 },
      { header: 'homeTeam', key: 'homeTeam', width: 25 },
      { header: 'awayTeam', key: 'awayTeam', width: 25 },
      { header: 'date', key: 'date', width: 15 },
      { header: 'venue', key: 'venue', width: 30 },
      { header: 'status', key: 'status', width: 15 },
      { header: 'result', key: 'result', width: 12 },
      { header: 'managedPlayers', key: 'managedPlayers', width: 50 },
    ]
    await wb.xlsx.writeFile(EXCEL_PATH)
  }
}

async function getMatchesFromExcel(): Promise<Match[]> {
  await ensureFiles()

  let wb: ExcelJS.Workbook
  try {
    wb = new ExcelJS.Workbook()
    await wb.xlsx.readFile(EXCEL_PATH)
  } catch (error) {
    console.error('Failed to read matches Excel file – recreating empty workbook.', error)
    await fs.unlink(EXCEL_PATH).catch(() => {})
    await ensureFiles()
    return []
  }

  const ws = wb.getWorksheet('Matches')
  if (!ws) return []

  const matches: Match[] = []
  ws.eachRow({ includeEmpty: false }, (row, rowNumber) => {
    if (rowNumber === 1) return // skip header
    const values = row.values as any[]

    const managedPlayersStr = values[8] || ''
    const managedPlayers = managedPlayersStr
      ? managedPlayersStr.split(',').map((s: string) => s.trim())
      : []

    matches.push({
      id: Number(values[1]) || 0,
      homeTeam: values[2] || '',
      awayTeam: values[3] || '',
      date: values[4] || '',
      venue: values[5] || '',
      status: (values[6] as Match['status']) || 'Upcoming',
      result: values[7] || undefined,
      managedPlayers,
    })
  })
  return matches
}

export async function getMatches(): Promise<Match[]> {
  return await getMatchesFromExcel()
}

export async function getMatchById(id: number): Promise<Match | null> {
  const matches = await getMatchesFromExcel()
  return matches.find(m => m.id === id) || null
}

export async function getUpcomingMatches(): Promise<Match[]> {
  const matches = await getMatches()
  return matches.filter(m => m.status === 'Upcoming' || m.status === 'In Progress')
}

export async function getCompletedMatches(): Promise<Match[]> {
  const matches = await getMatches()
  return matches.filter(m => m.status === 'Completed')
}

export async function addMatchAction(data: Omit<Match, 'id'>): Promise<Match> {
  await ensureFiles()
  const matches = await getMatchesFromExcel()
  const newId = matches.length ? Math.max(...matches.map(m => m.id)) + 1 : 1

  const newMatch: Match = { id: newId, ...data }

  const wb = new ExcelJS.Workbook()
  await wb.xlsx.readFile(EXCEL_PATH)
  const ws = wb.getWorksheet('Matches')!
  ws.addRow([
    newMatch.id,
    newMatch.homeTeam,
    newMatch.awayTeam,
    newMatch.date,
    newMatch.venue,
    newMatch.status,
    newMatch.result || '',
    newMatch.managedPlayers.join(', '),
  ])
  await wb.xlsx.writeFile(EXCEL_PATH)

  revalidatePath('/matches')
  revalidatePath('/dashboard')
  return newMatch
}

export async function updateMatchAction(
  id: number,
  data: Partial<Omit<Match, 'id'>>
): Promise<Match | null> {
  await ensureFiles()
  const wb = new ExcelJS.Workbook()
  await wb.xlsx.readFile(EXCEL_PATH)
  const ws = wb.getWorksheet('Matches')!
  let found = false

  ws.eachRow((row, rowNumber) => {
    if (rowNumber === 1) return
    if ((row.getCell(1).value as number) === id) {
      found = true
      row.getCell(2).value = data.homeTeam ?? row.getCell(2).value
      row.getCell(3).value = data.awayTeam ?? row.getCell(3).value
      row.getCell(4).value = data.date ?? row.getCell(4).value
      row.getCell(5).value = data.venue ?? row.getCell(5).value
      row.getCell(6).value = data.status ?? row.getCell(6).value
      row.getCell(7).value = data.result ?? row.getCell(7).value
      row.getCell(8).value = data.managedPlayers
        ? data.managedPlayers.join(', ')
        : row.getCell(8).value
    }
  })

  if (!found) return null
  await wb.xlsx.writeFile(EXCEL_PATH)

  revalidatePath('/matches')
  revalidatePath('/dashboard')
  revalidatePath(`/matches/${id}`)
  return await getMatchById(id)
}