import { useState } from 'react';
import AppointmentForm from './AppointmentForm';
import '../styles/DailyAgenda.scss';

const DailyAgenda = ({ appointments: initialAppointments }) => {
  const [filter, setFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Convertendo mockData para estado para permitir adição dinâmica
  const [appointments, setAppointments] = useState(initialAppointments || [
    { id: 1, time: '09:00', duration: '45min', service: 'Corte Masculino', client: 'Jefferson Silva', status: 'confirmed', price: 80 },
    { id: 2, time: '10:30', duration: '45min', service: 'Corte Masculino', client: 'Lucas Ramos', status: 'confirmed', price: 80 },
    { id: 3, time: '14:00', duration: '1h', service: 'Corte + Barba', client: 'Marcos Lima', status: 'pending', price: 120 },
    { id: 4, time: '16:30', duration: '45min', service: 'Corte Masculino', client: 'André Costa', status: 'canceled', price: 80 },
  ]);

  const filteredAppointments = appointments.filter(app => {
    if (filter === 'all') return true;
    return app.status === filter;
  });

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleAddAppointment = (newApp) => {
    const appointmentWithId = {
      ...newApp,
      id: Date.now(),
      status: 'pending', // Novos agendamentos entram como pendentes por padrão
      duration: '45min'  // Duração padrão para o MVP
    };
    setAppointments([appointmentWithId, ...appointments]);
    setIsModalOpen(false);
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'confirmed': return 'Confirmado';
      case 'pending': return 'Pendente';
      case 'canceled': return 'Cancelado';
      default: return status;
    }
  };

  return (
    <main className="daily-agenda-container">
      {/* Top Action Bar */}
      <div className="action-bar">
        <h2 className="title-display">
          Agenda <span className="highlight">do dia</span>
        </h2>
        
        <div className="controls">
          <div className="date-selector">
            <button className="nav-btn">{'<'}</button>
            <span className="date-display">31/07/2025 · QUI</span>
            <button className="nav-btn">{'>'}</button>
          </div>
          
          <button className="btn-new" onClick={handleOpenModal}>
            + Novo
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="filters">
        <button 
          className={`filter-tab ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          Todos
        </button>
        <button 
          className={`filter-tab ${filter === 'confirmed' ? 'active' : ''}`}
          onClick={() => setFilter('confirmed')}
        >
          Confirmados
        </button>
        <button 
          className={`filter-tab ${filter === 'pending' ? 'active' : ''}`}
          onClick={() => setFilter('pending')}
        >
          Pendentes
        </button>
      </div>

      {/* Appointments List */}
      <div className="appointment-list">
        {filteredAppointments.length > 0 ? (
          filteredAppointments.map(app => (
            <div key={app.id} className={`appointment-card border-${app.status} ${app.status === 'canceled' ? 'opacity-muted' : ''}`}>
              <div className="info-group">
                <div className="time-block">
                  <p className="time">{app.time}</p>
                  <p className="duration">{app.duration}</p>
                </div>
                
                <div className="details">
                  <h3 className="service-name">{app.service}</h3>
                  <div className="client-info">
                    <span className="icon">👤</span>
                    {app.client}
                  </div>
                </div>
              </div>

              <div className="status-group">
                <span className={`status-badge badge-${app.status}`}>
                  {getStatusLabel(app.status)}
                </span>
                <p className="price">R$ {app.price}</p>
              </div>
            </div>
          ))
        ) : (
          <div className="empty-state">Nenhum agendamento encontrado para este filtro.</div>
        )}
      </div>

      {/* Modal de Novo Agendamento */}
      {isModalOpen && (
        <AppointmentForm 
          onSave={handleAddAppointment} 
          onCancel={handleCloseModal} 
        />
      )}
    </main>
  );
};

export default DailyAgenda;
