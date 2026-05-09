import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { SearchForm } from '../components/SearchForm'
import * as api from '../lib/api'

vi.mock('../lib/api', () => ({
  createLead: vi.fn(),
}))

describe('SearchForm Component', () => {
  it('renderiza todos os campos de input obrigatórios', () => {
    render(<SearchForm onResult={vi.fn()} />)

    expect(screen.getByLabelText(/Nome completo/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Telefone/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Cargo na empresa/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/CNPJ/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Buscar empresa/i })).toBeInTheDocument()
  })

  it('permite a digitacao nos campos e aplica mascaras', async () => {
    render(<SearchForm onResult={vi.fn()} />)
    const user = userEvent.setup()

    const phoneInput = screen.getByLabelText(/Telefone/i)
    await user.type(phoneInput, '11987654321')
    expect(phoneInput).toHaveValue('(11) 98765-4321')

    const cnpjInput = screen.getByLabelText(/CNPJ/i)
    await user.type(cnpjInput, '60701190000104')
    expect(cnpjInput).toHaveValue('60.701.190/0001-04')
  })

  it('exibe erro retornado pela API caso ocorra falha na busca', async () => {
    vi.mocked(api.createLead).mockRejectedValueOnce({
      error: 'CNPJ não encontrado na base de dados',
    })

    render(<SearchForm onResult={vi.fn()} />)
    const user = userEvent.setup()

    await user.type(screen.getByLabelText(/Nome/i), 'Teste')
    await user.type(screen.getByLabelText(/Email/i), 'teste@teste.com')
    await user.type(screen.getByLabelText(/Telefone/i), '11999999999')
    await user.type(screen.getByLabelText(/Cargo/i), 'Dev')
    await user.type(screen.getByLabelText(/CNPJ/i), '11111111111111')

    const button = screen.getByRole('button', { name: /Buscar empresa/i })
    await user.click(button)

    await waitFor(() => {
      expect(screen.getByText(/CNPJ não encontrado na base de dados/i)).toBeInTheDocument()
    })
  })
})
