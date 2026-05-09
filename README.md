# Letalk CNPJ Lead Intelligence

Aplicação full-stack para busca e enriquecimento de leads via CNPJ. O usuário preenche dados do contato e o CNPJ da empresa, e a aplicação consulta a Receita Federal via BrasilAPI para retornar informações estratégicas como CNAE, porte, natureza jurídica, capital social, localização e mais.

---

## Tecnologias utilizadas

### Backend
- Node.js + TypeScript
- Express — servidor HTTP
- Zod — validação e tipagem do payload (incluindo validação dos dígitos verificadores do CNPJ)
- Prisma — ORM tipesafe
- SQLite — banco de dados local, sem configuração externa
- BrasilAPI — fonte dos dados da Receita Federal

### Frontend
- React + TypeScript
- Vite — bundler
- Tailwind CSS v4
- shadcn/ui (Radix UI + class-variance-authority)
- Lucide React — ícones

---

## Pré-requisitos

- Node.js 18 ou superior
- npm 9 ou superior

---

## Variáveis de ambiente

### Backend (`backend/.env`)

```env
DATABASE_URL="file:./dev.db"
PORT=3333
```

### Frontend (`frontend/.env`)

```env
VITE_API_URL=http://localhost:3333
```

Os arquivos `.env.example` estão incluídos em cada pasta com os valores padrão para desenvolvimento local.

---

## Como rodar localmente

### 1. Clone o repositório

```bash
git clone https://github.com/seu-usuario/letalk-cnpj.git
cd letalk-cnpj
```

### 2. Configure e inicie o backend

```bash
cd backend
cp .env.example .env
npm install
npm run db:push
npm run dev
```

O servidor estará disponível em `http://localhost:3333`.

### 3. Configure e inicie o frontend

Em outro terminal:

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

O frontend estará disponível em `http://localhost:5173`.

---

## Endpoints da API

| Método | Rota | Descrição |
|--------|------|-----------|
| `GET` | `/health` | Health check do servidor |
| `POST` | `/api/leads` | Cria um lead, consulta o CNPJ e retorna dados enriquecidos |
| `GET` | `/api/leads` | Lista todos os leads consultados |
| `GET` | `/api/leads/:id` | Retorna detalhes de um lead específico |

### Exemplo de request — POST /api/leads

```json
{
  "name": "João da Silva",
  "email": "joao@empresa.com",
  "phone": "(11) 98765-4321",
  "role": "CEO",
  "cnpj": "60.701.190/0001-04"
}
```

### Exemplo de response — 201 Created

```json
{
  "id": 1,
  "name": "João da Silva",
  "email": "joao@empresa.com",
  "phone": "11987654321",
  "role": "CEO",
  "cnpj": "60701190000104",
  "company": {
    "name": "ITAU UNIBANCO S.A.",
    "tradeName": "ITAÚ UNIBANCO",
    "cnaeCode": "6421200",
    "cnaeDesc": "Bancos comerciais",
    "segment": "Serviços Financeiros",
    "employeeRange": "Médio/Grande Porte (100+ funcionários)",
    "situation": "ATIVA",
    "legalNature": "Sociedade Anônima Aberta",
    "openedAt": "1944-09-09",
    "capital": "R$ 74.567.450.000,00",
    "city": "SAO PAULO",
    "state": "SP",
    "zipCode": "04344902",
    "phone": "1130034059",
    "email": null
  },
  "createdAt": "2026-05-09T16:52:00.000Z"
}
```
---

## Como a IA me ajudou a construir essa solução

Utilizei IA (Antigravity / Claude) como ferramenta de pair programming ao longo de todo o desenvolvimento. A IA foi responsável por:

- Gerar parte da estrutura dos arquivos do projeto (backend e frontend) com base nos requisitos descritos
- Geração de testes para acelerar o desenvolvimento cobrindo maior quantidade de cenários possíveis
- Montar alguns componentes React com Tailwind e shadcn/ui (SearchForm, ResultCard, LeadHistory)

Tomei decisões de projeto, revisei o código gerado, validei o funcionamento no navegador e ajustei detalhes de UX. A IA acelerou significativamente a implementação de boilerplate e código repetitivo, permitindo que o foco fosse na lógica de negócio e na qualidade da entrega.

---

## Decisões de projeto e justificativas

**SQLite em vez de PostgreSQL**
Elimina a necessidade de configurar banco externo. Qualquer pessoa clona o repositório, roda `npm run db:push` e já funciona. Para produção no Railway, o disco persistente garante que os dados sobrevivam entre deploys.

**Express em vez de Fastify ou NestJS**
Mais simples e direto ao ponto para o escopo do teste. O NestJS seria overengineering para uma API de três rotas.

**Zod para validação**
Permite validar e tipar o payload de entrada em uma única chamada. A validação dos dígitos verificadores do CNPJ foi implementada diretamente no schema Zod, mantendo a lógica centralizada.

**Monorepo simples (backend/ + frontend/)**
Sem ferramentas extras como Turborepo ou Nx. Cada pasta tem seu próprio `package.json` e pode ser implantada de forma independente.

**Mapeamento de CNAE para segmento**
A API retorna o código CNAE numérico. Implementei um mapper que agrupa os CNAEs em segmentos de mercado legíveis (Tecnologia, Saúde, Educação, etc.) usando as divisões da classificação IBGE. Isso transforma um número técnico em uma informação estratégica para o time de vendas.

**Campo "Cargo" no formulário**
O enunciado menciona o cargo como dado estratégico para análise de leads mas não o listava como campo obrigatório do formulário. Optei por incluí-lo, pois é uma informação que o time de vendas precisaria para priorização e abordagem.

**Frontend — Vercel, Backend — Railway**
O Vercel não suporta processos persistentes (necessário para SQLite), então separei o deploy: frontend estático no Vercel e a API no Railway, que oferece disco persistente no plano gratuito.
---

## Tempo gasto

Aproximadamente 1h30m de planejamento da arquitetura e decisões de projeto, e 4h de implementação e ajustes finos de UI.

---

## Se tivesse mais tempo, o que teria feito?

- Paginação e busca/filtro no histórico de leads
- Exportar lista de leads para CSV
- Endpoint para atualizar ou deletar um lead do histórico
- Cache de consultas por CNPJ para evitar chamadas repetidas à BrasilAPI
- Autenticação simples com JWT para proteger os endpoints
- Visualização dos CNAEs secundários da empresa
- Melhorar o tratamento de rate limiting da BrasilAPI com retry automático
