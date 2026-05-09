import { useState } from 'react'
import { Search, Loader2, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { formatCNPJ, formatPhone } from '@/lib/utils'
import { createLead } from '@/lib/api'
import type { ApiError, CreateLeadPayload, Lead } from '@/types/lead'

interface SearchFormProps {
  onResult: (lead: Lead) => void
}

interface FormState {
  name: string
  email: string
  phone: string
  role: string
  cnpj: string
}

interface FieldError {
  field: string
  message: string
}

export function SearchForm({ onResult }: SearchFormProps) {
  const [form, setForm] = useState<FormState>({
    name: '',
    email: '',
    phone: '',
    role: '',
    cnpj: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<FieldError[]>([])

  function handleChange(field: keyof FormState, value: string) {
    setError(null)
    setFieldErrors([])

    if (field === 'cnpj') {
      setForm((prev) => ({ ...prev, cnpj: formatCNPJ(value) }))
    } else if (field === 'phone') {
      setForm((prev) => ({ ...prev, phone: formatPhone(value) }))
    } else {
      setForm((prev) => ({ ...prev, [field]: value }))
    }
  }

  function getFieldError(field: string): string | undefined {
    return fieldErrors.find((e) => e.field === field)?.message
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setFieldErrors([])
    setLoading(true)

    const payload: CreateLeadPayload = {
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone,
      role: form.role.trim(),
      cnpj: form.cnpj,
    }

    try {
      const result = await createLead(payload)
      onResult(result)
      setForm({ name: '', email: '', phone: '', role: '', cnpj: '' })
    } catch (err: unknown) {
      const apiError = err as ApiError
      if (Array.isArray(apiError.details)) {
        setFieldErrors(apiError.details)
      } else {
        setError(apiError.error ?? 'Erro ao realizar a busca.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-white/8 bg-white/4 backdrop-blur-sm p-6 space-y-5"
    >
      <div>
        <h2 className="text-lg font-semibold text-white">Dados do Lead</h2>
        <p className="text-sm text-white/50 mt-0.5">
          Preencha os campos abaixo para enriquecer o lead com dados da Receita Federal.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* nome */}
        <div className="space-y-1.5">
          <Label htmlFor="name">
            Nome completo <span className="text-red-500">*</span>
          </Label>
          <Input
            id="name"
            placeholder="João da Silva"
            value={form.name}
            onChange={(e) => handleChange('name', e.target.value)}
            disabled={loading}
          />
          {getFieldError('name') && (
            <p className="text-xs text-red-400">{getFieldError('name')}</p>
          )}
        </div>

        {/* email */}
        <div className="space-y-1.5">
          <Label htmlFor="email">
            Email <span className="text-red-500">*</span>
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="joao@empresa.com"
            value={form.email}
            onChange={(e) => handleChange('email', e.target.value)}
            disabled={loading}
          />
          {getFieldError('email') && (
            <p className="text-xs text-red-400">{getFieldError('email')}</p>
          )}
        </div>

        {/* telefone */}
        <div className="space-y-1.5">
          <Label htmlFor="phone">
            Telefone <span className="text-red-500">*</span>
          </Label>
          <Input
            id="phone"
            placeholder="(11) 98765-4321"
            value={form.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
            disabled={loading}
          />
          {getFieldError('phone') && (
            <p className="text-xs text-red-400">{getFieldError('phone')}</p>
          )}
        </div>

        {/* cargo */}
        <div className="space-y-1.5">
          <Label htmlFor="role">
            Cargo na empresa <span className="text-red-500">*</span>
          </Label>
          <Input
            id="role"
            placeholder="CEO, Diretor de Marketing..."
            value={form.role}
            onChange={(e) => handleChange('role', e.target.value)}
            disabled={loading}
          />
          {getFieldError('role') && (
            <p className="text-xs text-red-400">{getFieldError('role')}</p>
          )}
        </div>

        {/* cnpj */}
        <div className="space-y-1.5 sm:col-span-2">
          <Label htmlFor="cnpj">
            CNPJ <span className="text-red-500">*</span>
          </Label>
          <Input
            id="cnpj"
            placeholder="00.000.000/0000-00"
            value={form.cnpj}
            onChange={(e) => handleChange('cnpj', e.target.value)}
            disabled={loading}
            maxLength={18}
          />
          {getFieldError('cnpj') && (
            <p className="text-xs text-red-400">{getFieldError('cnpj')}</p>
          )}
        </div>
      </div>

      {/* erro geral */}
      {error && (
        <div className="flex items-start gap-2.5 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />
          <p className="text-sm text-red-300">{error}</p>
        </div>
      )}

      <Button id="search-btn" type="submit" size="lg" className="w-full" disabled={loading}>
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Consultando CNPJ...
          </>
        ) : (
          <>
            <Search className="h-4 w-4" />
            Buscar empresa
          </>
        )}
      </Button>
    </form>
  )
}
