"use client"

import { useEffect, useState } from "react"
import type { Contract } from "@/lib/data"

// Runtime import of the actual data (not type-only)
import { contracts as initialContracts } from "@/lib/data"

// Optional: server getter if you implement Excel import later
// import { getContracts as serverGetContracts } from "@/lib/server/contracts-excel.server"

// In-memory store initialized with real data
let contractsData: Contract[] = [...initialContracts]

// Optional: Hook for reactive updates (used in ContractsPage, etc.)
export function useContracts() {
  const [contracts, setContracts] = useState<Contract[]>(contractsData)

  // Poll every second to reflect changes made elsewhere (add/edit/delete)
  useEffect(() => {
    const interval = setInterval(() => {
      setContracts([...contractsData])
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  return contracts
}

// Sync getters (safe to use in both client and server contexts if needed)
export function getContracts(): Contract[] {
  return contractsData
}

export function getContractById(id: number): Contract | undefined {
  return contractsData.find((c) => c.id === id)
}

// Mutations
export function addContract(contract: Omit<Contract, "id">): Contract {
  const newId = contractsData.length === 0 ? 1 : Math.max(...contractsData.map((c) => c.id)) + 1
  const newContract: Contract = { ...contract, id: newId }
  contractsData = [...contractsData, newContract]
  return newContract
}

export function updateContract(id: number, updates: Partial<Contract>): Contract | undefined {
  const index = contractsData.findIndex((c) => c.id === id)
  if (index === -1) return undefined

  contractsData[index] = { ...contractsData[index], ...updates }
  return contractsData[index]
}

export function deleteContract(id: number): boolean {
  const initialLength = contractsData.length
  contractsData = contractsData.filter((c) => c.id !== id)
  return contractsData.length < initialLength
}