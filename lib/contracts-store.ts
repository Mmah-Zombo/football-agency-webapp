"use client"

import { type Contract, contracts as initialContracts } from "./data"

// Simple in-memory store for demo purposes
let contractsData = [...initialContracts]

export function getContracts(): Contract[] {
  return contractsData
}

export function getContractById(id: number): Contract | undefined {
  return contractsData.find((c) => c.id === id)
}

export function addContract(contract: Omit<Contract, "id">): Contract {
  const newContract = {
    ...contract,
    id: Math.max(...contractsData.map((c) => c.id)) + 1,
  }
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
