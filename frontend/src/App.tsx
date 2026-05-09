import { useState } from 'react'
import { Zap, History } from 'lucide-react'
import { SearchForm } from '@/components/SearchForm'
import { ResultCard } from '@/components/ResultCard'
import { LeadHistory } from '@/components/LeadHistory'
import type { Lead } from '@/types/lead'

export default function App() {
  const [result, setResult] = useState<Lead | null>(null)
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  function handleResult(lead: Lead) {
    setResult(lead)
    setRefreshTrigger((prev) => prev + 1)
    setTimeout(() => {
      document.getElementById('result-section')?.scrollIntoView({ behavior: 'smooth' })
    }, 100)
  }

  return (
    <div className="min-h-screen bg-[#0d1117]">
      {/* glow de fundo */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 overflow-hidden"
      >
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 h-[600px] w-[600px] rounded-full bg-indigo-600/10 blur-[120px]" />
        <div className="absolute top-1/2 -left-40 h-[400px] w-[400px] rounded-full bg-violet-600/8 blur-[100px]" />
      </div>

      <div className="relative mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        {/* header */}
        <header className="mb-10 text-center">
          <div className="inline-flex items-center gap-2.5 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-4 py-1.5 mb-5">
            <Zap className="h-3.5 w-3.5 text-indigo-400" />
            <span className="text-xs font-semibold text-indigo-300 tracking-wide uppercase">
              Lead Intelligence
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Enriquecimento de Leads
          </h1>
          <p className="mt-3 text-white/50 text-sm sm:text-base max-w-xl mx-auto">
            Insira os dados do lead e o CNPJ para obter informações estratégicas da empresa
            diretamente da Receita Federal.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/*  coluna esquerda - form + resultado */}
          <main className="lg:col-span-2 space-y-6">
            <SearchForm onResult={handleResult} />

            {result && (
              <div id="result-section">
                <ResultCard lead={result} onClose={() => setResult(null)} />
              </div>
            )}
          </main>

          {/* coluna direita - histórico */}
          <aside className="space-y-4">
            <div className="flex items-center gap-2">
              <History className="h-4 w-4 text-white/40" />
              <h2 className="text-sm font-semibold text-white/60 uppercase tracking-wider">
                Histórico de Consultas
              </h2>
            </div>
            <LeadHistory refreshTrigger={refreshTrigger} />
          </aside>
        </div>

        {/* footer */}
        <footer className="mt-16 border-t border-white/5 pt-6 text-center">
          <p className="text-xs text-white/25">
            Dados fornecidos pela{' '}
            <a
              href="https://brasilapi.com.br"
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-400/70 hover:text-indigo-400 transition-colors"
            >
              BrasilAPI
            </a>{' '}
            · Receita Federal do Brasil
          </p>
        </footer>
      </div>
    </div>
  )
}
