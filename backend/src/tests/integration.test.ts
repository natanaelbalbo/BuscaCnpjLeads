import { describe, it, expect, vi, beforeEach } from 'vitest'
import request from 'supertest'
import app from '../server'
import { prisma } from '../lib/prisma'

vi.mock('../lib/prisma', () => ({
  prisma: {
    lead: {
      create: vi.fn(),
      findMany: vi.fn(),
    },
  },
}))

describe('Integration Tests - API', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    global.fetch = vi.fn()
  })

  it('GET /api/leads - Deve retornar a lista de leads', async () => {
    const mockLeads = [
      { id: 1, name: 'Lead 1', companyName: 'Empresa 1', createdAt: new Date() },
      { id: 2, name: 'Lead 2', companyName: 'Empresa 2', createdAt: new Date() },
    ]
    vi.mocked(prisma.lead.findMany).mockResolvedValue(mockLeads as any)

    const response = await request(app).get('/api/leads')

    expect(response.status).toBe(200)
    expect(response.body).toHaveLength(2)
    expect(response.body[0].name).toBe('Lead 1')
  })

  it('POST /api/leads - Deve retornar erro 400 se faltar dados obrigatórios', async () => {
    const response = await request(app).post('/api/leads').send({
      name: 'João',
    })

    expect(response.status).toBe(400)
    expect(response.body.error).toBe('Dados inválidos.')
    expect(response.body.details).toBeInstanceOf(Array)
  })

  it('POST /api/leads - Deve retornar 404 se a BrasilAPI nao encontrar o CNPJ', async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: false,
      status: 404,
      json: async () => ({ message: 'CNPJ não encontrado' }),
    } as any)

    const response = await request(app).post('/api/leads').send({
      name: 'João',
      email: 'joao@teste.com',
      phone: '11987654321',
      role: 'CEO',
      cnpj: '60.701.190/0001-04',
    })

    expect(response.status).toBe(404)
    expect(response.body.error).toContain('não encontrado na base de dados')
  })

  it('POST /api/leads - Deve criar lead com sucesso quando BrasilAPI retornar OK', async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({
        razao_social: 'EMPRESA TESTE S.A',
        nome_fantasia: 'TESTE',
        cnae_fiscal: 6421200,
        cnae_fiscal_descricao: 'Bancos',
        porte: 'DEMAIS',
        capital_social: 1000,
      }),
    } as any)

    vi.mocked(prisma.lead.create).mockResolvedValue({
      id: 10,
      name: 'João',
      email: 'joao@teste.com',
      phone: '11987654321',
      role: 'CEO',
      cnpj: '60701190000104',
      companyName: 'EMPRESA TESTE S.A',
      createdAt: new Date(),
    } as any)

    const response = await request(app).post('/api/leads').send({
      name: 'João',
      email: 'joao@teste.com',
      phone: '11987654321',
      role: 'CEO',
      cnpj: '60.701.190/0001-04',
    })

    expect(response.status).toBe(201)
    expect(response.body.id).toBe(10)
    expect(response.body.company.name).toBe('EMPRESA TESTE S.A')
  })
})
