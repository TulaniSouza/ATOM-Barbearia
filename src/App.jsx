import { useState, useEffect } from 'react';
import Login from './components/Login';
import AppHeader from './components/AppHeader';
import MonthlyAgenda from './components/MonthlyAgenda';
import DailyAgenda from './components/DailyAgenda';
import RequestsScreen from './components/RequestsScreen';
import ConfigScreen from './components/ConfigScreen';
import DashboardSummary from './components/DashboardSummary';
import ClientDashboard from './components/ClientDashboard';
import { mockAgenda } from './data/mockAgenda';
import AuthService from './services/AuthService';

export default function App() {
  const [user, setUser] = useState(AuthService.getCurrentUser());
  const [currentView, setCurrentView] = useState('monthly');
  const [accessMode, setAccessMode] = useState(null); // 'barber' or 'client'
  
  useEffect(() => {
    if (user && user.role === 'barber') {
      setAccessMode('barber');
    }
  }, [user]);

  const handleLogout = () => {
    AuthService.logout();
    setUser(null);
    setAccessMode(null);
    setCurrentView('monthly');
  };

  if (!accessMode && !user) {
    return (
      <div className="access-selection" style={{ 
        height: '100vh', 
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'center', 
        alignItems: 'center',
        backgroundColor: '#0d0d0d',
        color: '#fff',
        padding: '2rem'
      }}>
        <img src="/src/assets/ATOM.png" alt="Logo" style={{ width: '120px', marginBottom: '2rem' }} />
        <h1 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '3rem', color: '#cca43b' }}>HORA MARCADA</h1>
        <p style={{ marginBottom: '3rem', textAlign: 'center', color: '#aaa' }}>Selecione como deseja acessar o sistema</p>
        
        <div style={{ display: 'flex', gap: '1rem', width: '100%', maxWidth: '400px' }}>
          <button 
            onClick={() => setAccessMode('client')}
            style={{ 
              flex: 1, 
              padding: '1.5rem', 
              backgroundColor: '#1a1a1a', 
              border: '1px solid #333', 
              color: '#fff', 
              borderRadius: '8px',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '2rem' }}>person</span>
            <span>Sou Cliente</span>
          </button>
          
          <button 
            onClick={() => setAccessMode('barber')}
            style={{ 
              flex: 1, 
              padding: '1.5rem', 
              backgroundColor: '#cca43b', 
              border: 'none', 
              color: '#000', 
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 'bold',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '2rem' }}>content_cut</span>
            <span>Sou Barbeiro</span>
          </button>
        </div>
      </div>
    );
  }

  if (accessMode === 'barber' && !user) {
    return (
      <Login 
        onLoginSuccess={(userData) => {
          setUser(userData);
          setCurrentView('monthly');
        }} 
      />
    );
  }

  // Summary calculations
  const pendingCount = 0; 

  const renderContent = () => {
    if (accessMode === 'client') {
      return (
        <ClientDashboard 
          user={null} // Public access, no user yet
        />
      );
    }

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
      <AppHeader 
        currentView={currentView} 
        setCurrentView={setCurrentView} 
        user={user} 
        onLogout={handleLogout} 
        pendingCount={pendingCount}
        isPublicClient={accessMode === 'client'}
      />
      {renderContent()}
    </div>
  );
}
