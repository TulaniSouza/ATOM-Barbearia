import { useState, useEffect, useRef } from 'react';
import '../styles/Login.scss';
import logoImg from '../assets/ATOM.png';

export default function Login({ onLoginSuccess, setPendingAppointments }) {
  const [activeTab, setActiveTab] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('customer');

  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Olá! Sou o Assistente da Hora Marcada. Diga o dia ou horário que deseja agendar (Ex: "Quero marcar às 14:00") que vou verificar no nosso calendário do Google!' }
  ]);
  const [chatInput, setChatInput] = useState('');
  const chatEndRef = useRef(null);

  const availableSlots = ["09:00", "10:00", "11:00", "14:00", "15:00"];

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sanitizeInput = (text) => text.replace(/<[^>]*>/g, '').trim();

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      email: sanitizeInput(email),
      name: activeTab === 'cadastrar' ? sanitizeInput(name) : 'Cliente Hora Marcada',
      phone: activeTab === 'cadastrar' ? sanitizeInput(phone) : 'N/A',
      role: role,
      isAuthenticated: true
    };
    onLoginSuccess(payload);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userText = sanitizeInput(chatInput);
    setMessages(prev => [...prev, { sender: 'user', text: userText }]);
    setChatInput('');

    setTimeout(() => {
      let botResponse = "Não encontrei esse horário disponível no calendário do Google. Nossos horários livres hoje são: 09:00, 10:00, 11:00, 14:00 e 15:00.";
      
      const matchedTime = availableSlots.find(time => userText.includes(time));

      if (matchedTime) {
        botResponse = `Ótima notícia! O horário das ${matchedTime} está livre no Google Calendar. Acabei de enviar uma notificação de confirmação para o barbeiro. Aguarde o retorno!`;
        
        const newAppt = {
          id: Date.now(),
          client: "Cliente via Assistente Bot",
          time: matchedTime,
          service: "Corte Tradicional (Solicitado via Bot)"
        };
        setPendingAppointments(prev => [...prev, newAppt]);
      } else if (userText.toLowerCase().includes('ajuda') || userText.toLowerCase().includes('marcar')) {
        botResponse = "Para agendar por aqui, basta digitar o horário desejado. Por exemplo: 'Quero agendar às 10:00'.";
      }

      setMessages(prev => [...prev, { sender: 'bot', text: botResponse }]);
    }, 800);
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="logo-area">
          <img src={logoImg} alt="Atom Logo" className="brand-logo" />
          <h1>Hora Marcada</h1>
          <p className="slogan">PRECISÃO NO DETALHE. ESSÊNCIA NO RESULTADO.</p>
        </div>

        <div className="auth-tabs">
          <button type="button" className={activeTab === 'login' ? 'active' : ''} onClick={() => setActiveTab('login')}>Login</button>
          <button type="button" className={activeTab === 'cadastrar' ? 'active' : ''} onClick={() => setActiveTab('cadastrar')}>Cadastrar</button>
        </div>

        <form onSubmit={handleSubmit}>
          {activeTab === 'cadastrar' && (
            <>
              <div className="form-group">
                <label>Nome Completo</label>
                <input type="text" placeholder="Ex: Carlos Silva" value={name} onChange={(e) => setName(e.target.value)} required />
              </div>
              <div className="form-group">
                <label>WhatsApp</label>
                <input type="tel" placeholder="Ex: (11) 99999-9999" value={phone} onChange={(e) => setPhone(e.target.value)} required />
              </div>
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

          <div className="form-group">
            <label>Tipo de Conta</label>
            <select value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="customer">Cliente</option>
              <option value="barber">Barbeiro</option>
            </select>
          </div>

          <button type="submit" className="submit-btn">
            {activeTab === 'login' ? 'Login' : 'Cadastrar'}
          </button>
        </form>
      </div>

      {isChatOpen ? (
        <div className="chatbot-container">
          <div className="chatbot-header">
            <span>Assistente Digital Hora Marcada 🤖</span>
            <button style={{background:'none', border:'none', color:'#000', cursor:'pointer', fontSize:'20px', fontWeight:'bold'}} onClick={() => setIsChatOpen(false)}>×</button>
          </div>
          <div className="chatbot-messages">
            {messages.map((msg, index) => (
              <div key={index} className={`msg ${msg.sender}`}>{msg.text}</div>
            ))}
            <div ref={chatEndRef} />
          </div>
          <form onSubmit={handleSendMessage} className="chatbot-input-area">
            <input type="text" placeholder="Digite o horário (ex: 14:00)..." value={chatInput} onChange={(e) => setChatInput(e.target.value)} />
            <button type="submit">Enviar</button>
          </form>
        </div>
      ) : (
        <button className="chatbot-toggle" onClick={() => setIsChatOpen(true)}>Agendamento Rápido 💬</button>
      )}
    </div>
  );
}