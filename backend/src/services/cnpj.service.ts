export interface BrasilAPICompany {
  cnpj: string
  razao_social: string
  nome_fantasia: string
  descricao_situacao_cadastral: string
  data_inicio_atividade: string
  natureza_juridica: string
  porte: string
  capital_social: number
  municipio: string
  uf: string
  cep: string
  logradouro: string
  numero: string
  complemento: string
  bairro: string
  ddd_telefone_1: string
  ddd_telefone_2: string
  email: string
  cnae_fiscal: number
  cnae_fiscal_descricao: string
  cnaes_secundarios: Array<{
    codigo: number
    descricao: string
  }>
  qsa: Array<{
    nome_socio: string
    codigo_qualificacao_socio: number
    qualificacao_socio: string
  }>
}

const BRASIL_API_BASE = 'https://brasilapi.com.br/api'

export async function fetchCompanyByCNPJ(cnpj: string): Promise<BrasilAPICompany> {
  const cleanCnpj = cnpj.replace(/\D/g, '')
  const url = `${BRASIL_API_BASE}/cnpj/v1/${cleanCnpj}`

  const response = await fetch(url, {
    headers: {
      'Accept': 'application/json',
      'User-Agent': 'letalk-cnpj-app/1.0',
    },
    signal: AbortSignal.timeout(10000),
  })

  if (response.status === 404) {
    throw new Error('CNPJ não encontrado na base de dados da Receita Federal.')
  }

  if (response.status === 429) {
    throw new Error('Muitas requisições. Aguarde alguns segundos e tente novamente.')
  }

  if (!response.ok) {
    throw new Error(`Erro ao consultar a BrasilAPI: ${response.status} ${response.statusText}`)
  }

  const data = (await response.json()) as BrasilAPICompany
  return data
}

// fazendo mapeamento de empresas por porte
export function mapPorteToEmployeeRange(porte: string): string {
  const map: Record<string, string> = {
    'MICRO EMPRESA': 'Microempresa (até 9 funcionários)',
    'EMPRESA DE PEQUENO PORTE': 'Pequeno Porte (10–99 funcionários)',
    'DEMAIS': 'Médio/Grande Porte (100+ funcionários)',
    'NAO INFORMADO': 'Não informado',
  }
  return map[porte?.toUpperCase()] ?? porte ?? 'Não informado'
}

// fazendo mapeamento de empresas por CNAE
export function mapCNAEToSegment(cnaeCode: number): string {
  const code = Math.floor(cnaeCode / 100000)

  if (code >= 1 && code <= 3) return 'Agropecuária'
  if (code >= 5 && code <= 9) return 'Indústria Extrativa'
  if (code >= 10 && code <= 33) return 'Indústria de Transformação'
  if (code === 35) return 'Energia e Utilities'
  if (code >= 36 && code <= 39) return 'Saneamento e Meio Ambiente'
  if (code >= 41 && code <= 43) return 'Construção Civil'
  if (code >= 45 && code <= 47) return 'Comércio'
  if (code >= 49 && code <= 53) return 'Transporte e Logística'
  if (code >= 55 && code <= 56) return 'Hospedagem e Alimentação'
  if (code >= 58 && code <= 63) return 'Tecnologia e Comunicação'
  if (code >= 64 && code <= 66) return 'Serviços Financeiros'
  if (code === 68) return 'Imobiliário'
  if (code >= 69 && code <= 75) return 'Serviços Profissionais'
  if (code >= 77 && code <= 82) return 'Serviços Administrativos'
  if (code === 85) return 'Educação'
  if (code >= 86 && code <= 88) return 'Saúde'
  if (code >= 90 && code <= 93) return 'Cultura e Entretenimento'
  if (code >= 94 && code <= 96) return 'Outros Serviços'
  if (code === 97) return 'Serviços Domésticos'
  return 'Outros'
}

// formatando capital social para real
export function formatCapital(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}
