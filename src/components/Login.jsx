import { useState } from 'react';
import '../styles/Login.scss';
import logoImg from '../assets/ATOM.png';
import api from '../api'; 

export default function Login({ onLoginSuccess }) {
  const [activeTab, setActiveTab] = useState('login');
  const [role, setRole] = useState('barber'); 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (activeTab === 'login') {
        const endpoint = role === 'barber' ? '/auth/login' : '/customers/auth/login';
        const response = await api.post(endpoint, { email, password });
        
        const userData = role === 'barber' ? response.data : response.data.data;

        onLoginSuccess({
          id: userData.barberId || userData.customerId,
          name: userData.name,
          email: userData.email,
          role: role
        });
      } else {
        const endpoint = role === 'barber' ? '/auth/register' : '/customers/auth/register';
        const payload = role === 'barber' 
          ? { name, email, password } 
          : { name, email, password, phone };

        await api.post(endpoint, payload);
        
        alert('Conta criada com sucesso! Agora você pode acessar a plataforma.');
        handleTabChange('login');
      }
    } catch (err) {
      if (err.response) {
        setError('Dados inválidos. Por favor, verifique as informações e tente novamente.');
      } else if (err.request) {
        setError('Estamos com instabilidade em nossa conexão. Por favor, tente novamente em alguns instantes.');
      } else {
        setError('Ocorreu um erro inesperado. Nossa equipe já foi notificada.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="logo-area">
          <img src={logoImg} alt="Atom Logo" className="brand-logo" />
          <h1 style={{fontFamily: 'Bebas Neue', color: '#cca43b'}}>Hora Marcada</h1>
          <p className="slogan">PRECISÃO NO DETALHE. ESSÊNCIA NO RESULTADO.</p>
        </div>

        <div className="auth-tabs">
          <button type="button" className={activeTab === 'login' ? 'active' : ''} onClick={() => handleTabChange('login')}>Login</button>
          <button type="button" className={activeTab === 'cadastrar' ? 'active' : ''} onClick={() => handleTabChange('cadastrar')}>Cadastrar</button>
        </div>

        <div className="role-selection" style={{ display: 'flex', gap: '10px', marginBottom: '20px', justifyContent: 'center' }}>
          <label style={{ color: '#fff', fontSize: '13px', cursor: 'pointer' }}>
            <input 
              type="radio" 
              checked={role === 'barber'} 
              onChange={() => setRole('barber')} 
              style={{ marginRight: '5px' }}
            /> Barbeiro
          </label>
          <label style={{ color: '#fff', fontSize: '13px', cursor: 'pointer' }}>
            <input 
              type="radio" 
              checked={role === 'customer'} 
              onChange={() => setRole('customer')} 
              style={{ marginRight: '5px' }}
            /> Cliente
          </label>
        </div>

        <form onSubmit={handleSubmit}>
          {error && (
            <div className="error-message" style={{ 
              color: '#ff4d4d', marginBottom: '1rem', textAlign: 'center', fontSize: '14px',
              backgroundColor: 'rgba(255, 77, 77, 0.1)', padding: '10px', borderRadius: '6px', border: '1px solid #ff4d4d'
            }}>
              {error}
            </div>
          )}
          
          {activeTab === 'cadastrar' && (
            <>
              <div className="form-group">
                <label>Nome Completo</label>
                <input type="text" placeholder="Ex: Carlos Silva" value={name} onChange={(e) => setName(e.target.value)} required />
              </div>
              {role === 'customer' && (
                <div className="form-group">
                  <label>Telefone / WhatsApp</label>
                  <input type="text" placeholder="Ex: 11999999999" value={phone} onChange={(e) => setPhone(e.target.value)} required />
                </div>
              )}
            </>
          )}

          <div className="form-group">
            <label>Email</label>
            <input type="email" placeholder="name@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>

          <div className="form-group">
            <label>Senha</label>
            <input type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>

          <button type="submit" className="submit-btn" disabled={isLoading}>
            {isLoading ? 'Processando...' : (activeTab === 'login' ? 'Entrar' : 'Criar Conta')}
          </button>
        </form>
      </div>
    </div>
  );
}
