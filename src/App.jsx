import React, { useState } from 'react';
import Login from './components/Login';

export default function App() {
  const [user, setUser] = useState(null);
  
  const [pendingAppointments, setPendingAppointments] = useState([
    { id: 1, client: "Carlos Lima", time: "09:00", service: "Cabelo & Barba" }
  ]);

  if (!user) {
    return (
      <Login 
        onLoginSuccess={(data) => setUser(data)} 
        pendingAppointments={pendingAppointments}
        setPendingAppointments={setPendingAppointments}
      />
    );
  }

  return (
    <div style={{ backgroundColor: '#0d0d0d', color: '#fff', minHeight: '100vh', padding: '20px', fontFamily: 'Barlow, sans-serif' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #cca43b', paddingBottom: '15px', marginBottom: '20px' }}>
        <div>
          <h2 style={{ margin: 0, color: '#cca43b', fontFamily: 'Bebas Neue' }}>Hora Marcada — AMBIENTE INTEGRADO</h2>
          <p style={{ margin: '5px 0 0 0', color: '#aaa', fontSize: '13px' }}>Logado: <strong>{user.email}</strong> ({user.role})</p>
        </div>
        <button onClick={() => setUser(null)} style={{ padding: '8px 16px', background: 'transparent', color: '#ff4d4d', border: '1px solid #ff4d4d', borderRadius: '4px', cursor: 'pointer' }}>Sair</button>
      </div>

      {user.role === 'barber' ? (
        <div style={{ background: '#1a1a1a', padding: '20px', borderRadius: '8px', border: '1px solid #333' }}>
          <h3 style={{ color: '#cca43b', marginTop: 0 }}>Central de Agendamentos (Visão do Profissional)</h3>
          <p style={{ color: '#aaa', fontSize: '14px' }}>Aqui aparecem os agendamentos tradicionais e os criados automaticamente pelo Bot de Acessibilidade:</p>
          
          {pendingAppointments.length === 0 ? (
            <p style={{ color: '#2ecc71' }}>Nenhuma solicitação pendente no calendário!</p>
          ) : (
            pendingAppointments.map((appt) => (
              <div key={appt.id} style={{ background: '#262626', padding: '15px', borderRadius: '6px', marginBottom: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderLeft: '4px solid #cca43b' }}>
                <div>
                  <strong>{appt.client}</strong>
                  <div style={{ fontSize: '13px', color: '#aaa' }}>Horário Solicitado via Google Calendar: <span style={{ color: '#cca43b', fontWeight: 'bold' }}>{appt.time}h</span></div>
                  <div style={{ fontSize: '12px', color: '#999', fontStyle: 'italic' }}>{appt.service}</div>
                </div>
                <div>
                  <button onClick={() => { alert('Horário confirmado! Notificação enviada ao cliente.'); setPendingAppointments(prev => prev.filter(a => a.id !== appt.id)); }} style={{ marginRight: '8px', padding: '6px 12px', background: '#2ecc71', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>Aceitar</button>
                  <button onClick={() => setPendingAppointments(prev => prev.filter(a => a.id !== appt.id))} style={{ padding: '6px 12px', background: '#ff4d4d', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Recusar</button>
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        <div style={{ background: '#1a1a1a', padding: '20px', borderRadius: '8px', border: '1px solid #333' }}>
          <h3 style={{ color: '#cca43b', marginTop: 0 }}>Google Calendar Integrado (Visão do Cliente)</h3>
          <p style={{ color: '#aaa', fontSize: '14px' }}>Escolha um dos horários disponíveis sincronizados com a agenda:</p>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))', gap: '10px', marginTop: '15px' }}>
            {["09:00", "10:00", "11:00", "14:00", "15:00"].map((hora) => (
              <button 
                key={hora}
                onClick={() => {
                  const newAppt = { id: Date.now(), client: "Cliente do Painel", time: hora, service: "Corte Tradicional (Painel Web)" };
                  setPendingAppointments(prev => [...prev, newAppt]);
                  alert(`Sucesso! Solicitação para às ${hora}h enviada ao barbeiro.`);
                }}
                style={{ padding: '12px', background: '#262626', color: '#fff', border: '1px solid #cca43b', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
              >
                {hora}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}