import type { ApiError, CreateLeadPayload, Lead, LeadListItem } from '@/types/lead'

const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3333'

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const err = (await res.json()) as ApiError
    throw err
  }
  return res.json() as Promise<T>
}

export async function createLead(payload: CreateLeadPayload): Promise<Lead> {
  const res = await fetch(`${BASE_URL}/api/leads`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  return handleResponse<Lead>(res)
}

export async function listLeads(): Promise<LeadListItem[]> {
  const res = await fetch(`${BASE_URL}/api/leads`)
  return handleResponse<LeadListItem[]>(res)
}

export async function getLeadById(id: number): Promise<LeadListItem> {
  const res = await fetch(`${BASE_URL}/api/leads/${id}`)
  return handleResponse<LeadListItem>(res)
}
