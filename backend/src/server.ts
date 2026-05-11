import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import leadRoutes from './routes/lead.routes'

const app = express()
const PORT = process.env.PORT ?? 3333

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:4173',
  'https://busca-cnpj-leads.vercel.app',
  ...(process.env.FRONTEND_URL ? [process.env.FRONTEND_URL.replace(/\/+$/, '')] : []),
]

app.use(
  cors({
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  }),
)

app.use(express.json())

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})
app.use('/api/leads', leadRoutes)

app.use((_req, res) => {
  res.status(404).json({ error: 'Rota não encontrada.' })
})

app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('[ERROR]', err)
  res.status(500).json({ error: 'Erro interno do servidor.' })
})

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
  })
}


export default app
