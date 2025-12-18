// lib/server/contracts-excel.server.ts
'use server'

import ExcelJS from 'exceljs'
import { promises as fs } from 'fs'
import path from 'path'
import { revalidatePath } from 'next/cache'

export type Contract = {
  id: number
  playerId: number
  playerName: string
  clubId: number
  clubName: string
  startDate: string // YYYY-MM-DD
  endDate: string   // YYYY-MM-DD
  fee: string       // e.g. "€15M"
  status: 'Active' | 'Expiring Soon' | 'Expired'
}

const EXCEL_PATH = path.join(process.cwd(), 'public/data/contracts.xlsx')

async function ensureFiles() {
  await fs.mkdir(path.dirname(EXCEL_PATH), { recursive: true })

  let fileExists = false
  try {
    await fs.access(EXCEL_PATH)
    fileExists = true
  } catch {
    // File does not exist → will create below
  }

  if (!fileExists) {
    const wb = new ExcelJS.Workbook()
    const ws = wb.addWorksheet('Contracts')
    ws.columns = [
      { header: 'id', key: 'id', width: 10 },
      { header: 'playerId', key: 'playerId', width: 12 },
      { header: 'playerName', key: 'playerName', width: 25 },
      { header: 'clubId', key: 'clubId', width: 12 },
      { header: 'clubName', key: 'clubName', width: 25 },
      { header: 'startDate', key: 'startDate', width: 15 },
      { header: 'endDate', key: 'endDate', width: 15 },
      { header: 'fee', key: 'fee', width: 15 },
      { header: 'status', key: 'status', width: 18 },
    ]
    await wb.xlsx.writeFile(EXCEL_PATH)
  }
}

async function getContractsFromExcel(): Promise<Contract[]> {
  await ensureFiles()

  let wb: ExcelJS.Workbook
  try {
    wb = new ExcelJS.Workbook()
    await wb.xlsx.readFile(EXCEL_PATH)
  } catch (error) {
    console.error('Failed to read contracts Excel file – recreating empty workbook.', error)
    await fs.unlink(EXCEL_PATH).catch(() => {}) // ignore if not exists
    await ensureFiles()
    return []
  }

  const ws = wb.getWorksheet('Contracts')
  if (!ws) return []

  const contracts: Contract[] = []
  ws.eachRow({ includeEmpty: false }, (row, rowNumber) => {
    if (rowNumber === 1) return // skip header
    const values = row.values as any[]
    contracts.push({
      id: Number(values[1]) || 0,
      playerId: Number(values[2]) || 0,
      playerName: values[3] || '',
      clubId: Number(values[4]) || 0,
      clubName: values[5] || '',
      startDate: values[6] || '',
      endDate: values[7] || '',
      fee: values[8] || '',
      status: (values[9] as Contract['status']) || 'Active',
    })
  })
  return contracts
}

// Public fetchers (safe to import anywhere)
export async function getContracts(): Promise<Contract[]> {
  return await getContractsFromExcel()
}

export async function getContractById(id: number): Promise<Contract | null> {
  const contracts = await getContractsFromExcel()
  return contracts.find(c => c.id === id) || null
}

export async function getContractByPlayerId(playerId: number): Promise<Contract | null> {
  const contracts = await getContractsFromExcel()
  // Return only the active/current contract for the player
  return contracts.find(c => c.playerId === playerId && c.status === 'Active') || null
}

// Add new contract
export async function addContractAction(
  data: Omit<Contract, 'id'>
): Promise<Contract> {
  await ensureFiles()
  const contracts = await getContractsFromExcel()
  const newId = contracts.length ? Math.max(...contracts.map(c => c.id)) + 1 : 1

  const newContract: Contract = { id: newId, ...data }

  const wb = new ExcelJS.Workbook()
  await wb.xlsx.readFile(EXCEL_PATH)
  const ws = wb.getWorksheet('Contracts')!
  ws.addRow([
    newContract.id,
    newContract.playerId,
    newContract.playerName,
    newContract.clubId,
    newContract.clubName,
    newContract.startDate,
    newContract.endDate,
    newContract.fee,
    newContract.status,
  ])
  await wb.xlsx.writeFile(EXCEL_PATH)

  revalidatePath('/contracts')
  revalidatePath('/dashboard')
  revalidatePath('/players') // may affect player status display
  return newContract
}

// Update existing contract
export async function updateContractAction(
  id: number,
  data: Partial<Omit<Contract, 'id'>>
): Promise<Contract | null> {
  await ensureFiles()
  const wb = new ExcelJS.Workbook()
  await wb.xlsx.readFile(EXCEL_PATH)
  const ws = wb.getWorksheet('Contracts')!
  let found = false

  ws.eachRow((row, rowNumber) => {
    if (rowNumber === 1) return // header
    if ((row.getCell(1).value as number) === id) {
      found = true
      row.getCell(2).value = data.playerId ?? row.getCell(2).value
      row.getCell(3).value = data.playerName ?? row.getCell(3).value
      row.getCell(4).value = data.clubId ?? row.getCell(4).value
      row.getCell(5).value = data.clubName ?? row.getCell(5).value
      row.getCell(6).value = data.startDate ?? row.getCell(6).value
      row.getCell(7).value = data.endDate ?? row.getCell(7).value
      row.getCell(8).value = data.fee ?? row.getCell(8).value
      row.getCell(9).value = data.status ?? row.getCell(9).value
    }
  })

  if (!found) return null

  await wb.xlsx.writeFile(EXCEL_PATH)

  revalidatePath('/contracts')
  revalidatePath('/dashboard')
  revalidatePath(`/contracts/${id}`)
  if (data.playerId) {
    revalidatePath('/players')
  }

  return await getContractById(id)
}