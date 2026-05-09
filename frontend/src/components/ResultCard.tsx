import {
  Building2,
  User,
  Mail,
  Phone,
  Briefcase,
  MapPin,
  Calendar,
  TrendingUp,
  Users,
  Tag,
  Hash,
  DollarSign,
  X,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatDate } from '@/lib/utils'
import type { Lead } from '@/types/lead'

interface ResultCardProps {
  lead: Lead
  onClose: () => void
}

function situationVariant(situation: string | null): 'success' | 'danger' | 'warning' | 'muted' {
  if (!situation) return 'muted'
  const s = situation.toUpperCase()
  if (s.includes('ATIVA')) return 'success'
  if (s.includes('BAIXADA') || s.includes('CANCELADA')) return 'danger'
  if (s.includes('SUSPENSA') || s.includes('INAPTA')) return 'warning'
  return 'muted'
}

function DataRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType
  label: string
  value: string | null | undefined
}) {
  return (
    <div className="flex items-start gap-3 py-3 border-b border-white/5 last:border-0">
      <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-500/10">
        <Icon className="h-4 w-4 text-indigo-400" />
      </div>
      <div className="min-w-0">
        <p className="text-xs font-medium text-white/40 uppercase tracking-wide">{label}</p>
        <p className="text-sm font-medium text-white mt-0.5 break-words">
          {value ?? 'Não informado'}
        </p>
      </div>
    </div>
  )
}

export function ResultCard({ lead, onClose }: ResultCardProps) {
  const { company } = lead

  return (
    <div className="rounded-2xl border border-indigo-500/20 bg-gradient-to-b from-indigo-500/5 to-transparent backdrop-blur-sm overflow-hidden">
      {/* header */}
      <div className="flex items-start justify-between gap-4 p-6 pb-4">
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-600/20 border border-indigo-500/20">
            <Building2 className="h-6 w-6 text-indigo-400" />
          </div>
          <div className="min-w-0">
            <h2 className="font-bold text-white text-base leading-tight truncate">
              {company.tradeName || company.name || 'Empresa'}
            </h2>
            {company.tradeName && company.name !== company.tradeName && (
              <p className="text-xs text-white/40 mt-0.5 truncate">{company.name}</p>
            )}
            <div className="flex items-center gap-2 mt-1.5 flex-wrap">
              <Badge variant={situationVariant(company.situation)}>
                <span className="h-1.5 w-1.5 rounded-full bg-current" />
                {company.situation ?? 'Situação desconhecida'}
              </Badge>
              {company.segment && (
                <Badge variant="default">{company.segment}</Badge>
              )}
            </div>
          </div>
        </div>
        <Button
          id="close-result-btn"
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="shrink-0"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="px-6 pb-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* infos lead */}
        <section>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-white/40 mb-1">
            Dados do Lead
          </h3>
          <div className="rounded-xl border border-white/8 bg-white/3 px-4">
            <DataRow icon={User} label="Nome" value={lead.name} />
            <DataRow icon={Briefcase} label="Cargo" value={lead.role} />
            <DataRow icon={Mail} label="Email" value={lead.email} />
            <DataRow icon={Phone} label="Telefone" value={lead.phone} />
          </div>
        </section>

        {/* dados estratégicos */}
        <section>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-white/40 mb-1">
            Dados Estratégicos
          </h3>
          <div className="rounded-xl border border-white/8 bg-white/3 px-4">
            <DataRow icon={Hash} label="CNPJ" value={lead.cnpj} />
            <DataRow icon={Tag} label="CNAE Principal" value={
              company.cnaeCode
                ? `${company.cnaeCode} — ${company.cnaeDesc}`
                : company.cnaeDesc
            } />
            <DataRow icon={Users} label="Porte / Faixa de Funcionários" value={company.employeeRange} />
            <DataRow icon={DollarSign} label="Capital Social" value={company.capital} />
          </div>
        </section>

        {/* infos empresa */}
        <section>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-white/40 mb-1">
            Informações da Empresa
          </h3>
          <div className="rounded-xl border border-white/8 bg-white/3 px-4">
            <DataRow icon={TrendingUp} label="Natureza Jurídica" value={company.legalNature} />
            <DataRow icon={Calendar} label="Data de Abertura" value={formatDate(company.openedAt)} />
            {company.email && (
              <DataRow icon={Mail} label="Email da Empresa" value={company.email} />
            )}
            {company.phone && (
              <DataRow icon={Phone} label="Telefone da Empresa" value={company.phone} />
            )}
          </div>
        </section>

        {/* localização  */}
        <section>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-white/40 mb-1">
            Localização
          </h3>
          <div className="rounded-xl border border-white/8 bg-white/3 px-4">
            <DataRow
              icon={MapPin}
              label="Cidade / Estado"
              value={company.city && company.state ? `${company.city} — ${company.state}` : null}
            />
            <DataRow icon={MapPin} label="CEP" value={company.zipCode} />
          </div>
        </section>
      </div>
    </div>
  )
}
