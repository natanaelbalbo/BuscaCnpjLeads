import { Request, Response } from 'express'
import { ZodError } from 'zod'
import { prisma } from '../lib/prisma'
import { CreateLeadSchema } from '../schemas/lead.schema'
import {
  fetchCompanyByCNPJ,
  formatCapital,
  mapCNAEToSegment,
  mapPorteToEmployeeRange,
} from '../services/cnpj.service'

export async function createLead(req: Request, res: Response): Promise<void> {
  // 1. Validacao Input
  const parseResult = CreateLeadSchema.safeParse(req.body)

  if (!parseResult.success) {
    const error = parseResult.error as ZodError
    res.status(400).json({
      error: 'Dados inválidos.',
      details: error.errors.map((e) => ({
        field: e.path.join('.'),
        message: e.message,
      })),
    })
    return
  }

  const { name, email, phone, role, cnpj } = parseResult.data

  // 2. Fetch dados da empresa usando api
  let company
  try {
    company = await fetchCompanyByCNPJ(cnpj)
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Erro ao consultar CNPJ.'

    if (message.includes('não encontrado')) {
      res.status(404).json({ error: message })
      return
    }

    res.status(502).json({
      error: 'Não foi possível consultar a API externa. Tente novamente em instantes.',
      details: message,
    })
    return
  }

  // 3. Parte de mapeamento 
  const segment = mapCNAEToSegment(company.cnae_fiscal)
  const employeeRange = mapPorteToEmployeeRange(company.porte)
  const capital = formatCapital(company.capital_social)

  // 4. Salvando no banco
  const lead = await prisma.lead.create({
    data: {
      name,
      email,
      phone,
      role,
      cnpj,
      companyName: company.razao_social,
      tradeName: company.nome_fantasia || null,
      cnaeCode: String(company.cnae_fiscal),
      cnaeDesc: company.cnae_fiscal_descricao,
      segment,
      employeeRange,
      situation: company.descricao_situacao_cadastral,
      legalNature: company.natureza_juridica,
      openedAt: company.data_inicio_atividade,
      capital,
      city: company.municipio,
      state: company.uf,
      zipCode: company.cep,
      phone1: company.ddd_telefone_1 || null,
      email1: company.email || null,
      rawData: JSON.stringify(company),
    },
  })

  // 5. tratamento de resposta da api 
  res.status(201).json({
    id: lead.id,
    name: lead.name,
    email: lead.email,
    phone: lead.phone,
    role: lead.role,
    cnpj: lead.cnpj,
    company: {
      name: lead.companyName,
      tradeName: lead.tradeName,
      cnaeCode: lead.cnaeCode,
      cnaeDesc: lead.cnaeDesc,
      segment: lead.segment,
      employeeRange: lead.employeeRange,
      situation: lead.situation,
      legalNature: lead.legalNature,
      openedAt: lead.openedAt,
      capital: lead.capital,
      city: lead.city,
      state: lead.state,
      zipCode: lead.zipCode,
      phone: lead.phone1,
      email: lead.email1,
    },
    createdAt: lead.createdAt,
  })
}

// 6 lista de leads cadastrados
export async function listLeads(_req: Request, res: Response): Promise<void> {
  const leads = await prisma.lead.findMany({
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      role: true,
      cnpj: true,
      companyName: true,
      tradeName: true,
      cnaeCode: true,
      cnaeDesc: true,
      segment: true,
      employeeRange: true,
      situation: true,
      legalNature: true,
      openedAt: true,
      capital: true,
      city: true,
      state: true,
      zipCode: true,
      phone1: true,
      email1: true,
      createdAt: true,
    },
  })

  res.json(leads)
}

// 7 Busca de lead por ID
export async function getLeadById(req: Request, res: Response): Promise<void> {
  const id = Number(req.params.id)

  if (isNaN(id)) {
    res.status(400).json({ error: 'ID inválido.' })
    return
  }

  const lead = await prisma.lead.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      role: true,
      cnpj: true,
      companyName: true,
      tradeName: true,
      cnaeCode: true,
      cnaeDesc: true,
      segment: true,
      employeeRange: true,
      situation: true,
      legalNature: true,
      openedAt: true,
      capital: true,
      city: true,
      state: true,
      zipCode: true,
      phone1: true,
      email1: true,
      createdAt: true,
    },
  })

  if (!lead) {
    res.status(404).json({ error: 'Lead não encontrado.' })
    return
  }

  res.json(lead)
}
