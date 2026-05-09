import { z } from 'zod'

function validateCNPJDigits(cnpj: string): boolean {
  const cleaned = cnpj.replace(/\D/g, '')

  if (cleaned.length !== 14) return false

  if (/^(\d)\1+$/.test(cleaned)) return false

  const calcDigit = (cnpjArr: number[], length: number): number => {
    let sum = 0
    let pos = length - 7

    for (let i = length; i >= 1; i--) {
      sum += cnpjArr[length - i] * pos--
      if (pos < 2) pos = 9
    }

    return sum % 11 < 2 ? 0 : 11 - (sum % 11)
  }

  const digits = cleaned.split('').map(Number)
  const firstDigit = calcDigit(digits, 12)
  const secondDigit = calcDigit(digits, 13)

  return digits[12] === firstDigit && digits[13] === secondDigit
}

export const CreateLeadSchema = z.object({
  name: z
    .string({ required_error: 'Nome é obrigatório.' })
    .min(2, 'Nome deve ter ao menos 2 caracteres.'),

  email: z
    .string({ required_error: 'Email é obrigatório.' })
    .email('Email inválido.'),

  phone: z
    .string({ required_error: 'Telefone é obrigatório.' })
    .min(10, 'Telefone deve ter ao menos 10 dígitos.')
    .transform((v) => v.replace(/\D/g, '')),

  role: z
    .string({ required_error: 'Cargo é obrigatório.' })
    .min(2, 'Cargo deve ter ao menos 2 caracteres.'),

  cnpj: z
    .string({ required_error: 'CNPJ é obrigatório.' })
    .transform((v) => v.replace(/\D/g, ''))
    .refine((v) => v.length === 14, 'CNPJ deve ter 14 dígitos.')
    .refine(validateCNPJDigits, 'CNPJ inválido. Verifique os dígitos informados.'),
})

export type CreateLeadInput = z.infer<typeof CreateLeadSchema>
