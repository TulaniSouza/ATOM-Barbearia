import '../styles/AppHeader.scss';

const AppHeader = ({ currentView, setCurrentView, user, onLogout, pendingCount }) => {
  // Helper to get initials from name
  const getInitials = (name) => {
    if (!name) return 'U';
    const names = name.split(' ');
    if (names.length >= 2) {
      return (names[0][0] + names[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const navItems = [
    { id: 'monthly', label: 'Agenda', icon: 'calendar_month' },
    { id: 'daily', label: 'Dia', icon: 'calendar_today' },
    { id: 'requests', label: 'Solicitações', icon: 'notifications', badge: pendingCount },
    { id: 'config', label: 'Config', icon: 'settings' },
  ];

  return (
    <header className="app-header">
      <div className="header-container">
        {/* Brand / Logo */}
        <div className="brand" onClick={() => setCurrentView('monthly')}>
          <div className="logo-placeholder">A</div>
          <h1 className="logo-text">
            HORA <span>MARCADA</span>
          </h1>
        </div>

        {/* Navigation */}
        <nav className="nav-menu">
          {navItems.map((item) => (
            <button
              key={item.id}
              className={`nav-item ${currentView === item.id ? 'active' : ''}`}
              onClick={() => setCurrentView(item.id)}
            >
              <span className="material-symbols-outlined">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
              {item.badge && <span className="badge">{item.badge}</span>}
            </button>
          ))}
        </nav>

        {/* User Actions */}
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
    </header>
  );
};

export default AppHeader;
