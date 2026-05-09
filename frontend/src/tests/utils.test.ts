import { describe, it, expect } from 'vitest'
import { formatCNPJ, formatPhone, formatDate } from '../lib/utils'

describe('Utils', () => {
  describe('formatCNPJ', () => {
    it('deve aplicar a mascara de CNPJ corretamente', () => {
      expect(formatCNPJ('60701190000104')).toBe('60.701.190/0001-04')
      expect(formatCNPJ('11222')).toBe('11.222')
    })
  })

  describe('formatPhone', () => {
    it('deve aplicar a mascara de telefone/celular corretamente', () => {
      expect(formatPhone('11987654321')).toBe('(11) 98765-4321')
      expect(formatPhone('1133334444')).toBe('(11) 3333-4444')
    })
  })

  describe('formatDate', () => {
    it('deve converter padrao YYYY-MM-DD para DD/MM/YYYY', () => {
      expect(formatDate('2023-12-25')).toBe('25/12/2023')
    })
    
    it('deve retornar Nao informado para datas invalidas ou nulas', () => {
      expect(formatDate(null)).toBe('Não informado')
      expect(formatDate(undefined)).toBe('Não informado')
    })
  })
})
