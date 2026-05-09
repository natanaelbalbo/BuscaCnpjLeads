import { describe, it, expect } from 'vitest'
import { CreateLeadSchema } from '../schemas/lead.schema'
import { mapCNAEToSegment, mapPorteToEmployeeRange, formatCapital } from '../services/cnpj.service'

describe('Unit Tests - Backend', () => {
  describe('Zod Schema & CNPJ Validation', () => {
    const validPayload = {
      name: 'João da Silva',
      email: 'joao@teste.com',
      phone: '11987654321',
      role: 'CEO',
      cnpj: '60.701.190/0001-04',
    }

    it('Deve aprovar um payload com CNPJ válido', () => {
      const result = CreateLeadSchema.safeParse(validPayload)
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.cnpj).toBe('60701190000104')
      }
    })

    it('Deve reprovar um CNPJ matematicamente inválido (mas com 14 digitos)', () => {
      const result = CreateLeadSchema.safeParse({
        ...validPayload,
        cnpj: '11.111.111/1111-11',
      })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.errors[0].message).toBe('CNPJ inválido. Verifique os dígitos informados.')
      }
    })

    it('Deve reprovar email inválido', () => {
      const result = CreateLeadSchema.safeParse({ ...validPayload, email: 'joao-arroba-teste' })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.errors[0].message).toBe('Email inválido.')
      }
    })
  })

  describe('Mappers e Formatadores (cnpj.service)', () => {
    it('Deve mapear o porte para a faixa de funcionários correta', () => {
      expect(mapPorteToEmployeeRange('MICRO EMPRESA')).toBe('Microempresa (até 9 funcionários)')
      expect(mapPorteToEmployeeRange('DEMAIS')).toBe('Médio/Grande Porte (100+ funcionários)')
      expect(mapPorteToEmployeeRange('DESCONHECIDO')).toBe('DESCONHECIDO')
    })

    it('Deve mapear o código CNAE para o segmento correto', () => {
      expect(mapCNAEToSegment(6421200)).toBe('Serviços Financeiros')
      expect(mapCNAEToSegment(4711302)).toBe('Comércio')
      expect(mapCNAEToSegment(9999999)).toBe('Outros')
    })

    it('Deve formatar o capital social em Reais (BRL)', () => {
      const formatted = formatCapital(1500.5)
      expect(formatted).toContain('1.500,50')
      expect(formatted).toContain('R$')
    })
  })
})
