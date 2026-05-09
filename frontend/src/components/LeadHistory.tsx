import { useEffect, useState, useCallback } from 'react'
import { Clock, Building2, MapPin, RefreshCw, ChevronRight } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { listLeads } from '@/lib/api'
import type { LeadListItem } from '@/types/lead'

interface LeadHistoryProps {
  refreshTrigger: number
}

function situationVariant(situation: string | null): 'success' | 'danger' | 'warning' | 'muted' {
  if (!situation) return 'muted'
  const s = situation.toUpperCase()
  if (s.includes('ATIVA')) return 'success'
  if (s.includes('BAIXADA') || s.includes('CANCELADA')) return 'danger'
  if (s.includes('SUSPENSA') || s.includes('INAPTA')) return 'warning'
  return 'muted'
}

function formatRelativeTime(dateStr: string): string {
  const date = new Date(dateStr)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)

  if (diffMins < 1) return 'agora'
  if (diffMins < 60) return `há ${diffMins} min`
  const diffHours = Math.floor(diffMins / 60)
  if (diffHours < 24) return `há ${diffHours}h`
  const diffDays = Math.floor(diffHours / 24)
  return `há ${diffDays}d`
}

export function LeadHistory({ refreshTrigger }: LeadHistoryProps) {
  const [leads, setLeads] = useState<LeadListItem[]>([])
  const [loading, setLoading] = useState(true)

  const fetchLeads = useCallback(async () => {
    setLoading(true)
    try {
      const data = await listLeads()
      setLeads(data)
    } catch {
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void fetchLeads()
  }, [fetchLeads, refreshTrigger])

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-20 rounded-xl border border-white/8 bg-white/3 animate-pulse"
          />
        ))}
      </div>
    )
  }

  if (leads.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <Clock className="h-10 w-10 text-white/20 mb-3" />
        <p className="text-sm text-white/40">Nenhuma consulta realizada ainda.</p>
        <p className="text-xs text-white/25 mt-1">As buscas aparecerão aqui.</p>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs text-white/40">{leads.length} consulta(s) realizada(s)</p>
        <Button
          id="refresh-history-btn"
          variant="ghost"
          size="sm"
          onClick={fetchLeads}
          className="h-7 text-xs gap-1.5"
        >
          <RefreshCw className="h-3 w-3" />
          Atualizar
        </Button>
      </div>

      {leads.map((lead) => (
        <div
          key={lead.id}
          className="group flex items-center gap-3 rounded-xl border border-white/8 bg-white/3 p-4 hover:bg-white/5 hover:border-indigo-500/20 transition-all duration-200"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-500/10 border border-indigo-500/10 group-hover:bg-indigo-500/15 transition-colors">
            <Building2 className="h-5 w-5 text-indigo-400" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="text-sm font-semibold text-white truncate">
                {lead.tradeName || lead.companyName || 'Empresa não identificada'}
              </p>
              <Badge variant={situationVariant(lead.situation)} className="text-[10px] py-0">
                {lead.situation ?? 'N/A'}
              </Badge>
            </div>
            <p className="text-xs text-white/50 mt-0.5">{lead.name} · {lead.role}</p>
            <div className="flex items-center gap-2 mt-1">
              {lead.city && lead.state && (
                <span className="flex items-center gap-0.5 text-[11px] text-white/35">
                  <MapPin className="h-3 w-3" />
                  {lead.city}, {lead.state}
                </span>
              )}
              {lead.segment && (
                <span className="text-[11px] text-white/35">· {lead.segment}</span>
              )}
            </div>
          </div>

          <div className="shrink-0 flex flex-col items-end gap-1">
            <span className="text-[11px] text-white/30">{formatRelativeTime(lead.createdAt)}</span>
            <ChevronRight className="h-4 w-4 text-white/20 group-hover:text-white/40 transition-colors" />
          </div>
        </div>
      ))}
    </div>
  )
}
