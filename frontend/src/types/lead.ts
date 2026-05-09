export interface LeadCompany {
  name: string | null
  tradeName: string | null
  cnaeCode: string | null
  cnaeDesc: string | null
  segment: string | null
  employeeRange: string | null
  situation: string | null
  legalNature: string | null
  openedAt: string | null
  capital: string | null
  city: string | null
  state: string | null
  zipCode: string | null
  phone: string | null
  email: string | null
}

export interface Lead {
  id: number
  name: string
  email: string
  phone: string
  role: string
  cnpj: string
  company: LeadCompany
  createdAt: string
}

export interface LeadListItem {
  id: number
  name: string
  email: string
  phone: string
  role: string
  cnpj: string
  companyName: string | null
  tradeName: string | null
  cnaeCode: string | null
  cnaeDesc: string | null
  segment: string | null
  employeeRange: string | null
  situation: string | null
  legalNature: string | null
  openedAt: string | null
  capital: string | null
  city: string | null
  state: string | null
  zipCode: string | null
  phone1: string | null
  email1: string | null
  createdAt: string
}

export interface CreateLeadPayload {
  name: string
  email: string
  phone: string
  role: string
  cnpj: string
}

export interface ApiError {
  error: string
  details?: Array<{ field: string; message: string }> | string
}
