import { useState } from 'react';
import Login from './components/Login';
import AppHeader from './components/AppHeader';
import MonthlyAgenda from './components/MonthlyAgenda';
import DailyAgenda from './components/DailyAgenda';
import RequestsScreen from './components/RequestsScreen';
import ConfigScreen from './components/ConfigScreen';
import DashboardSummary from './components/DashboardSummary';
import { mockAgenda } from './data/mockAgenda';

export default function App() {
  const [user, setUser] = useState(null);
  const [currentView, setCurrentView] = useState('monthly');
  
  const [pendingAppointments, setPendingAppointments] = useState([
    { id: 1, client: "Carlos Lima", time: "09:00", service: "Cabelo & Barba" }
  ]);

  // Estado global de solicitações para sincronização
  const [requests, setRequests] = useState([
    {
      id: 1,
      service: 'Corte Masculino',
      date: '02/06/2026', // Hoje
      time: '08:40',
      client: 'Jefferson Silva',
      note: 'Degradê com navalha',
      status: 'pending'
    },
    {
      id: 2,
      service: 'Corte + Barba',
      date: '03/06/2026', // Amanhã
      time: '10:00',
      client: 'Lucas Ramos',
      note: 'Barba bem redonda',
      status: 'pending'
    },
    {
      id: 3,
      service: 'Corte Masculino',
      date: '02/06/2026', // Hoje
      time: '15:00',
      client: 'Anderson Gomes',
      note: '',
      status: 'finished'
    },
    {
      id: 4,
      service: 'Barba Imperial',
      date: '01/06/2026', // Ontem
      time: '11:30',
      client: 'Ricardo Oliveira',
      note: 'Tratamento com toalha quente',
      status: 'finished'
    }
  ]);

  const handleLogout = () => {
    setUser(null);
    setCurrentView('monthly');
  };

  if (!user) {
    return (
      <Login 
        onLoginSuccess={(data) => {
          setUser(data);
          if (data.role === 'client') {
            setCurrentView('client_dashboard');
          }
        }} 
        setPendingAppointments={setPendingAppointments}
      />
    );
  }

  // Summary calculations
  const today = '2026-05-30';
  const pendingCount = requests.filter(req => req.status === 'pending').length;
  const todayCount = mockAgenda.filter(a => a.date === today && a.status === 'confirmed').length;
  const nextAppointment = mockAgenda.find(a => a.date === today && a.status === 'confirmed');

  const renderContent = () => {
    if (user.role === 'client') {
      return (
        <div style={{ padding: '20px' }}>
          <div style={{ background: '#1a1a1a', padding: '20px', borderRadius: '8px', border: '1px solid #333' }}>
            <h3 style={{ color: '#cca43b', marginTop: 0 }}>Google Calendar Integrado (Visão do Cliente)</h3>
            <p style={{ color: '#aaa', fontSize: '14px' }}>Escolha um dos horários disponíveis sincronizados com a agenda:</p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))', gap: '10px', marginTop: '15px' }}>
              {["09:00", "10:00", "11:00", "14:00", "15:00"].map((time) => (
                <button 
                  key={time}
                  onClick={() => {
                    const newAppt = { id: Date.now(), client: "Cliente do Painel", time: time, service: "Corte Tradicional (Painel Web)" };
                    setPendingAppointments(prev => [...prev, newAppt]);
                    alert(`Sucesso! Solicitação para às ${time}h enviada ao barbeiro.`);
                  }}
                  style={{ padding: '12px', background: '#262626', color: '#fff', border: '1px solid #cca43b', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
                >
                  {time}
                </button>
              ))}
            </div>
          </div>
        </div>
      );
    }

    switch (currentView) {
      case 'monthly':
        return (
          <>
            <DashboardSummary 
              pendingCount={pendingCount}
              todayCount={todayCount}
              nextAppointment={nextAppointment}
            />
            <MonthlyAgenda />
          </>
        );
      case 'daily':
        return <DailyAgenda />;
      case 'requests':
        return <RequestsScreen requests={requests} setRequests={setRequests} />;
      case 'config':
        return <ConfigScreen />;
      default:
        return <MonthlyAgenda />;
    }
  };

  return (
    <div style={{ backgroundColor: '#0d0d0d', color: '#fff', minHeight: '100vh', fontFamily: 'Barlow, sans-serif' }}>
      <AppHeader 
        currentView={currentView} 
        setCurrentView={setCurrentView} 
        user={user} 
        onLogout={handleLogout} 
        pendingCount={pendingCount}
      />
      {renderContent()}
    </div>
  );
  }