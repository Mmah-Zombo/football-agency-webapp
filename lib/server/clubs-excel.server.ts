// lib/server/clubs-excel.server.ts
'use server'

import ExcelJS from 'exceljs'
import { promises as fs } from 'fs'
import path from 'path'
import { revalidatePath } from 'next/cache'

export type Club = {
  id: number
  name: string
  location: string
  league: string
  logo: string
  email: string
  phone: string
  website: string
  playersManaged: number
  activeContracts: number
}

const EXCEL_PATH = path.join(process.cwd(), 'public/data/clubs.xlsx')
const UPLOAD_DIR = path.join(process.cwd(), 'public/uploads/clubs')

async function ensureFiles() {
  await fs.mkdir(path.dirname(EXCEL_PATH), { recursive: true })
  await fs.mkdir(UPLOAD_DIR, { recursive: true })

  let fileExists = false
  try {
    await fs.access(EXCEL_PATH)
    fileExists = true
  } catch {
    // File does not exist → create below
  }

  if (!fileExists) {
    const wb = new ExcelJS.Workbook()
    const ws = wb.addWorksheet('Clubs')
    ws.columns = [
      { header: 'id', key: 'id', width: 10 },
      { header: 'name', key: 'name', width: 30 },
      { header: 'location', key: 'location', width: 20 },
      { header: 'league', key: 'league', width: 20 },
      { header: 'logo', key: 'logo', width: 40 },
      { header: 'email', key: 'email', width: 30 },
      { header: 'phone', key: 'phone', width: 18 },
      { header: 'website', key: 'website', width: 30 },
      { header: 'playersManaged', key: 'playersManaged', width: 15 },
      { header: 'activeContracts', key: 'activeContracts', width: 15 },
    ]
    await wb.xlsx.writeFile(EXCEL_PATH)
  }
}

async function getClubsFromExcel(): Promise<Club[]> {
  await ensureFiles()

  let wb: ExcelJS.Workbook
  try {
    wb = new ExcelJS.Workbook()
    await wb.xlsx.readFile(EXCEL_PATH)
  } catch (error) {
    console.error('Failed to read clubs Excel file – recreating empty workbook.', error)
    await fs.unlink(EXCEL_PATH).catch(() => {})
    await ensureFiles()
    return []
  }

  const ws = wb.getWorksheet('Clubs')
  if (!ws) return []

  const clubs: Club[] = []
  ws.eachRow({ includeEmpty: false }, (row, rowNumber) => {
    if (rowNumber === 1) return // skip header
    const values = row.values as any[]
    clubs.push({
      id: Number(values[1]) || 0,
      name: values[2] || '',
      location: values[3] || '',
      league: values[4] || '',
      logo: values[5] || '',
      email: values[6] || '',
      phone: values[7] || '',
      website: values[8] || '',
      playersManaged: Number(values[9]) || 0,
      activeContracts: Number(values[10]) || 0,
    })
  })
  return clubs
}

export async function getClubs(): Promise<Club[]> {
  return await getClubsFromExcel()
}

export async function getClubById(id: number): Promise<Club | null> {
  const clubs = await getClubsFromExcel()
  return clubs.find(c => c.id === id) || null
}

export async function addClubAction(
  data: Omit<Club, 'id' | 'logo'>,
  logoFilename: string
): Promise<Club> {
  await ensureFiles()
  const clubs = await getClubsFromExcel()
  const newId = clubs.length ? Math.max(...clubs.map(c => c.id)) + 1 : 1

  const newClub: Club = { ...data, id: newId, logo: logoFilename }

  const wb = new ExcelJS.Workbook()
  await wb.xlsx.readFile(EXCEL_PATH)
  const ws = wb.getWorksheet('Clubs')!
  ws.addRow([
    newClub.id,
    newClub.name,
    newClub.location,
    newClub.league,
    newClub.logo,
    newClub.email,
    newClub.phone,
    newClub.website,
    newClub.playersManaged,
    newClub.activeContracts,
  ])
  await wb.xlsx.writeFile(EXCEL_PATH)

  revalidatePath('/clubs')
  revalidatePath('/dashboard')
  return newClub
}

export async function updateClubAction(
  id: number,
  data: Partial<Omit<Club, 'id'>>,
  logoFilename?: string
): Promise<Club | null> {
  await ensureFiles()
  const wb = new ExcelJS.Workbook()
  await wb.xlsx.readFile(EXCEL_PATH)
  const ws = wb.getWorksheet('Clubs')!
  let found = false

  ws.eachRow((row, rowNumber) => {
    if (rowNumber === 1) return
    if ((row.getCell(1).value as number) === id) {
      found = true
      row.getCell(2).value = data.name ?? row.getCell(2).value
      row.getCell(3).value = data.location ?? row.getCell(3).value
      row.getCell(4).value = data.league ?? row.getCell(4).value
      row.getCell(5).value = logoFilename ?? row.getCell(5).value
      row.getCell(6).value = data.email ?? row.getCell(6).value
      row.getCell(7).value = data.phone ?? row.getCell(7).value
      row.getCell(8).value = data.website ?? row.getCell(8).value
      row.getCell(9).value = data.playersManaged ?? row.getCell(9).value
      row.getCell(10).value = data.activeContracts ?? row.getCell(10).value
    }
  })

  if (!found) return null
  await wb.xlsx.writeFile(EXCEL_PATH)

  revalidatePath('/clubs')
  revalidatePath('/dashboard')
  revalidatePath(`/clubs/${id}`)
  return await getClubById(id)
}

export async function saveClubLogoAction(file: File): Promise<string> {
  await fs.mkdir(UPLOAD_DIR, { recursive: true })
  const buffer = Buffer.from(await file.arrayBuffer())
  const filename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`
  const filepath = path.join(UPLOAD_DIR, filename)
  await fs.writeFile(filepath, buffer)
  return `/uploads/clubs/${filename}`
}