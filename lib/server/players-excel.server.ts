// lib/server/players-excel.server.ts
'use server'
import ExcelJS from 'exceljs'
import { promises as fs } from 'fs'
import path from 'path'
import { revalidatePath } from 'next/cache'

export type Player = {
  id: number
  name: string
  position: string
  nationality: string
  age: number
  currentClub: string
  marketValue: string
  image: string
  status: "Available" | "Under Contract" | "Injured" // Fixed to match app-wide type
  representedSince: string
}

const EXCEL_PATH = path.join(process.cwd(), 'public/data/players.xlsx')
const UPLOAD_DIR = path.join(process.cwd(), 'public/uploads/players')

async function ensureFiles() {
  await fs.mkdir(path.dirname(EXCEL_PATH), { recursive: true })
  await fs.mkdir(UPLOAD_DIR, { recursive: true })

  let fileExists = false
  try {
    await fs.access(EXCEL_PATH)
    fileExists = true
  } catch {
    // File does not exist → will create below
  }

  if (!fileExists) {
    const wb = new ExcelJS.Workbook()
    const ws = wb.addWorksheet('Players')
    ws.columns = [
      { header: 'id', key: 'id', width: 10 },
      { header: 'name', key: 'name', width: 25 },
      { header: 'position', key: 'position', width: 15 },
      { header: 'nationality', key: 'nationality', width: 15 },
      { header: 'age', key: 'age', width: 10 },
      { header: 'currentClub', key: 'currentClub', width: 20 },
      { header: 'marketValue', key: 'marketValue', width: 15 },
      { header: 'image', key: 'image', width: 30 },
      { header: 'status', key: 'status', width: 18 },
      { header: 'representedSince', key: 'representedSince', width: 20 },
    ]
    await wb.xlsx.writeFile(EXCEL_PATH)
  }
}

async function getPlayersFromExcel(): Promise<Player[]> {
  await ensureFiles()

  let wb: ExcelJS.Workbook
  try {
    wb = new ExcelJS.Workbook()
    await wb.xlsx.readFile(EXCEL_PATH)
  } catch (error) {
    console.error("Failed to read Excel file – likely corrupted or empty. Recreating empty workbook.", error)
    // Recreate fresh empty file
    await fs.unlink(EXCEL_PATH).catch(() => {}) // ignore if not exists
    await ensureFiles()
    return []
  }

  const ws = wb.getWorksheet('Players')
  if (!ws) return []

  const players: Player[] = []
  ws.eachRow({ includeEmpty: false }, (row, rowNumber) => {
    if (rowNumber === 1) return // skip header
    const values = row.values as any[]
    players.push({
      id: Number(values[1]) || 0,
      name: values[2] || '',
      position: values[3] || '',
      nationality: values[4] || '',
      age: Number(values[5]) || 0,
      currentClub: values[6] || '',
      marketValue: values[7] || '',
      image: values[8] || '',
      status: (values[9] as Player['status']) || 'Available',
      representedSince: values[10] || '',
    })
  })
  return players
}

// Fetchers (safe to import anywhere)
export async function getPlayers(): Promise<Player[]> {
  return await getPlayersFromExcel()
}

export async function getPlayerById(id: number): Promise<Player | null> {
  const players = await getPlayersFromExcel()
  return players.find(p => p.id === id) || null
}

export async function addPlayerAction(
  data: Omit<Player, 'id' | 'image'>,
  imageFilename: string
): Promise<Player> {
  await ensureFiles()
  const players = await getPlayersFromExcel()
  const newId = players.length ? Math.max(...players.map(p => p.id)) + 1 : 1

  const newPlayer: Player = { ...data, id: newId, image: imageFilename }

  const wb = new ExcelJS.Workbook()
  await wb.xlsx.readFile(EXCEL_PATH)
  const ws = wb.getWorksheet('Players')!
  ws.addRow([
    newPlayer.id,
    newPlayer.name,
    newPlayer.position,
    newPlayer.nationality,
    newPlayer.age,
    newPlayer.currentClub,
    newPlayer.marketValue,
    newPlayer.image,
    newPlayer.status,
    newPlayer.representedSince,
  ])
  await wb.xlsx.writeFile(EXCEL_PATH)

  revalidatePath('/players')
  revalidatePath('/dashboard')
  return newPlayer
}

export async function updatePlayerAction(
  id: number,
  data: Partial<Omit<Player, 'id'>>,
  imageFilename?: string
): Promise<Player | null> {
  await ensureFiles()
  const wb = new ExcelJS.Workbook()
  await wb.xlsx.readFile(EXCEL_PATH)
  const ws = wb.getWorksheet('Players')!
  let found = false

  ws.eachRow((row, rowNumber) => {
    if (rowNumber === 1) return
    if ((row.getCell(1).value as number) === id) {
      found = true
      row.getCell(2).value = data.name ?? row.getCell(2).value
      row.getCell(3).value = data.position ?? row.getCell(3).value
      row.getCell(4).value = data.nationality ?? row.getCell(4).value
      row.getCell(5).value = data.age ?? row.getCell(5).value
      row.getCell(6).value = data.currentClub ?? row.getCell(6).value
      row.getCell(7).value = data.marketValue ?? row.getCell(7).value
      row.getCell(8).value = imageFilename ?? row.getCell(8).value
      row.getCell(9).value = data.status ?? row.getCell(9).value
      row.getCell(10).value = data.representedSince ?? row.getCell(10).value
    }
  })

  if (!found) return null
  await wb.xlsx.writeFile(EXCEL_PATH)

  revalidatePath('/players')
  revalidatePath('/dashboard')
  revalidatePath(`/players/${id}`)
  return await getPlayerById(id)
}

export async function savePlayerImageAction(file: File): Promise<string> {
  await fs.mkdir(UPLOAD_DIR, { recursive: true })
  const buffer = Buffer.from(await file.arrayBuffer())
  const filename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`
  const filepath = path.join(UPLOAD_DIR, filename)
  await fs.writeFile(filepath, buffer)
  return `/uploads/players/${filename}`
}