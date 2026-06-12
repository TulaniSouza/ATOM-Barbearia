import React, { useState } from 'react';
import Login from './components/Login';
import BookingWizard from './components/BookingWizard';
import BarberPanel from './components/BarberPanel';
import AppHeader from './components/AppHeader';
import MonthlyAgenda from './components/MonthlyAgenda';
import ConfigScreen from './components/ConfigScreen';
import RequestsScreen from './components/RequestsScreen';

function App() {
  // Usuário Mock para a apresentação
  const [user, setUser] = useState({ 
    id: 1, 
    name: 'Barbeiro Teste', 
    role: 'barber' 
  });

  const [currentView, setCurrentView] = useState('agenda');

  if (!user) {
    return <Login onLoginSuccess={(userData) => setUser(userData)} />;
  }

  const handleLogout = () => {
    setUser(null);
  };

  return (
    <div style={{ backgroundColor: '#0d0d0d', minHeight: '100vh', color: 'white', margin: 0, padding: 0 }}>
      
      {/* Botão de Debug para alternar perfis rapidamente na apresentação */}
      <div style={{ position: 'fixed', top: 10, right: 10, zIndex: 9999 }}>
        <button 
          onClick={() => setUser(user.role === 'barber' ? { id: 2, name: 'Cliente Teste', role: 'customer' } : { id: 1, name: 'Barbeiro Teste', role: 'barber' })}
          style={{ padding: '5px 10px', fontSize: '10px', cursor: 'pointer', opacity: 0.5, borderRadius: '5px', border: '1px solid #555', background: '#222', color: '#fff' }}
        >
          Alternar Perfil (Demo)
        </button>
      </div>

      <AppHeader 
        currentView={currentView} 
        setCurrentView={(view) => {
          if (view === 'monthly') setCurrentView('monthly');
          if (view === 'daily') setCurrentView('agenda');
          if (view === 'requests') setCurrentView('requests');
          if (view === 'config') setCurrentView('config');
        }} 
        user={user} 
        onLogout={handleLogout} 
        pendingCount={5} 
        isPublicClient={user.role === 'customer'}
      />

      <div style={{ paddingTop: '80px' }}>
        {user.role === 'barber' ? (
          <>
            {currentView === 'agenda' && <BarberPanel user={user} />}
            {currentView === 'monthly' && <MonthlyAgenda />}
            {currentView === 'config' && <ConfigScreen />}
            {currentView === 'requests' && <RequestsScreen />}
          </>
        ) : (
          <BookingWizard user={user} />
        )}
      </div>
    </div>
  );
}

export default App;
