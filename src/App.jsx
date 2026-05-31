import React, { useState } from 'react';
import Login from './components/Login';
import AppHeader from './components/AppHeader';
import MonthlyAgenda from './components/MonthlyAgenda';
import DailyAgenda from './components/DailyAgenda';
import RequestsScreen from './components/RequestsScreen';
import ConfigScreen from './components/ConfigScreen';

export default function App() {
  const [user, setUser] = useState(null);
  const [currentView, setCurrentView] = useState('monthly');
  
  const [pendingAppointments, setPendingAppointments] = useState([
    { id: 1, client: "Carlos Lima", time: "09:00", service: "Cabelo & Barba" }
  ]);

  const handleLogout = () => {
    setUser(null);
    setCurrentView('monthly');
  };

  if (!user) {
    return (
      <Login 
        onLoginSuccess={(data) => setUser(data)} 
        pendingAppointments={pendingAppointments}
        setPendingAppointments={setPendingAppointments}
      />
    );
  }

  const renderContent = () => {
    switch (currentView) {
      case 'monthly':
        return <MonthlyAgenda />;
      case 'daily':
        return <DailyAgenda />;
      case 'requests':
        return <RequestsScreen />;
      case 'config':
        return <ConfigScreen />;
      default:
        return <MonthlyAgenda />;
    }
  };

  return (
    <div style={{ backgroundColor: '#0d0d0d', color: '#fff', minHeight: '100vh', fontFamily: 'Barlow, sans-serif' }}>
      {user.role === 'barber' ? (
        <>
          <AppHeader 
            currentView={currentView} 
            setCurrentView={setCurrentView} 
            user={user} 
            onLogout={handleLogout} 
          />
          {renderContent()}
        </>
      ) : (
        <div style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #cca43b', paddingBottom: '15px', marginBottom: '20px' }}>
            <div>
              <h2 style={{ margin: 0, color: '#cca43b', fontFamily: 'Bebas Neue' }}>Hora Marcada — AMBIENTE INTEGRADO</h2>
              <p style={{ margin: '5px 0 0 0', color: '#aaa', fontSize: '13px' }}>Logado: <strong>{user.email}</strong> ({user.role})</p>
            </div>
            <button onClick={handleLogout} style={{ padding: '8px 16px', background: 'transparent', color: '#ff4d4d', border: '1px solid #ff4d4d', borderRadius: '4px', cursor: 'pointer' }}>Sair</button>
          </div>

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
        </div>
      )}
    </div>
  );
}