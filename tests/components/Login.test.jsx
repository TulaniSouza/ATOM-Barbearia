import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Login from '../../src/components/Login';

describe('Login Component', () => {
  it('deve renderizar o formulário de login por padrão', () => {
    render(<Login onLoginSuccess={() => {}} setPendingAppointments={() => {}} />);
    expect(screen.getByText(/Hora Marcada/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/name@example.com/i)).toBeInTheDocument();
  });

  it('deve permitir alternar para a aba de cadastro', () => {
    render(<Login onLoginSuccess={() => {}} setPendingAppointments={() => {}} />);
    const cadastrarTabBtn = screen.getAllByRole('button', { name: /^Cadastrar$/ }).find(btn => btn.type === 'button');
    fireEvent.click(cadastrarTabBtn);
    expect(screen.getByText(/Nome Completo/i)).toBeInTheDocument();
  });

  it('deve chamar onLoginSuccess ao submeter o formulário', () => {
    const mockLogin = vi.fn();
    render(<Login onLoginSuccess={mockLogin} setPendingAppointments={() => {}} />);
    
    fireEvent.change(screen.getByPlaceholderText(/name@example.com/i), { target: { value: 'test@atom.com' } });
    fireEvent.change(screen.getByPlaceholderText(/••••••••/i), { target: { value: 'password123' } });
    
    // O botão de submit tem a classe 'submit-btn' e type 'submit'
    const submitBtn = screen.getAllByRole('button', { name: /^Login$/ }).find(btn => btn.type === 'submit');
    fireEvent.click(submitBtn);
    
    expect(mockLogin).toHaveBeenCalledWith(expect.objectContaining({
      email: 'test@atom.com',
      isAuthenticated: true
    }));
  });
});
