import { useState } from 'react';
import Login from './components/Login';
import AppHeader from './components/AppHeader';
import MonthlyAgenda from './components/MonthlyAgenda';
import DailyAgenda from './components/DailyAgenda';
import RequestsScreen from './components/RequestsScreen';
import ConfigScreen from './components/ConfigScreen';
import DashboardSummary from './components/DashboardSummary';
import ClientDashboard from './components/ClientDashboard';
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
          if (data.role === 'customer') {
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
    if (user.role === 'customer') {
      return (
        <ClientDashboard 
          user={user} 
          setPendingAppointments={setPendingAppointments} 
        />
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
