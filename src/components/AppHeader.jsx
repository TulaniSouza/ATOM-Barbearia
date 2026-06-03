import { useState, useEffect } from 'react';
import '../styles/AppHeader.scss';

const AppHeader = ({ currentView, setCurrentView, user, onLogout, pendingCount }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isBarber = user?.role === 'barber';

  // Close menu when view changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [currentView]);

  // Prevent scrolling when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isMenuOpen]);

  // Helper to get initials from name
  const getInitials = (name) => {
    if (!name) return 'U';
    const names = name.split(' ');
    if (names.length >= 2) {
      return (names[0][0] + names[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const navItems = isBarber ? [
    { id: 'monthly', label: 'Agenda', icon: 'calendar_month' },
    { id: 'daily', label: 'Dia', icon: 'calendar_today' },
    { id: 'requests', label: 'Solicitações', icon: 'notifications', badge: pendingCount },
    { id: 'config', label: 'Ajustes', icon: 'settings' },
  ] : [
    { id: 'client_dashboard', label: 'Início', icon: 'home' },
  ];

  const handleNavClick = (viewId) => {
    setCurrentView(viewId);
    setIsMenuOpen(false);
  };

  return (
    <header className="app-header">
      <div className="header-container">
        {/* Brand / Logo */}
        <div className="brand" onClick={() => handleNavClick(isBarber ? 'monthly' : 'client_dashboard')}>
          <div className="logo-placeholder">A</div>
          <h1 className="logo-text">
            HORA <span>MARCADA</span>
          </h1>
        </div>

        {/* Hamburger Toggle */}
        <button 
          className={`hamburger-toggle ${isMenuOpen ? 'open' : ''}`} 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          <span className="material-symbols-outlined">
            {isMenuOpen ? 'close' : 'menu'}
          </span>
        </button>

        {/* Navigation Overlay */}
        <div className={`nav-overlay ${isMenuOpen ? 'active' : ''}`} onClick={() => setIsMenuOpen(false)}></div>

        {/* Navigation and User Section */}
        <div className={`nav-container ${isMenuOpen ? 'open' : ''}`}>
          <nav className="nav-menu">
            {navItems.map((item) => (
              <button
                key={item.id}
                className={`nav-item ${currentView === item.id ? 'active' : ''}`}
                onClick={() => handleNavClick(item.id)}
              >
                <span className="material-symbols-outlined">{item.icon}</span>
                <span className="nav-label">{item.label}</span>
                {item.badge && <span className="badge">{item.badge}</span>}
              </button>
            ))}
          </nav>

          <div className="user-section">
            <div className="user-info">
              <div className="user-avatar">{getInitials(user?.name || user?.email || 'User')}</div>
              <span className="user-name">{(user?.name || user?.email || 'usuário').toLowerCase().split('@')[0]}</span>
            </div>
            <button className="logout-btn" onClick={onLogout}>
              Sair
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
