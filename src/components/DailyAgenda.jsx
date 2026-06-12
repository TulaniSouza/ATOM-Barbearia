import { useState, useEffect } from 'react';
import AppointmentForm from './AppointmentForm';
import AppointmentService from '../services/AppointmentService';
import ServiceTypeService from '../services/ServiceTypeService';
import '../styles/DailyAgenda.scss';

const DailyAgenda = () => {
  const [filter, setFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [services, setServices] = useState([]);
  const [currentDate, setCurrentDate] = useState('2026-06-02'); // Data de exemplo conforme PRD
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [apptData, serviceData] = await Promise.all([
        AppointmentService.getByDate(currentDate),
        ServiceTypeService.getAllActive()
      ]);
      setAppointments(apptData);
      setServices(serviceData);
    } catch (err) {
      setError("Erro ao carregar dados da agenda.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [currentDate]);

  const filteredAppointments = appointments.filter(app => {
    if (filter === 'all') return true;
    if (filter === 'confirmed') return app.status === 'COMPLETED';
    if (filter === 'pending') return app.status === 'SCHEDULED';
    return false;
  });

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleAddAppointment = async (formData) => {
    try {
      // Mapear campos do form para o request da API
      const requestData = {
        customerName: formData.client,
        customerPhone: formData.phone || "(00) 00000-0000",
        serviceTypeId: formData.serviceId,
        appointmentDate: currentDate,
        appointmentTime: formData.time
      };
      await AppointmentService.create(requestData);
      setIsModalOpen(false);
      fetchData(); // Atualiza a lista
    } catch (err) {
      alert("Erro ao criar agendamento: " + (err.message || "Erro desconhecido"));
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'COMPLETED': return 'Confirmado';
      case 'SCHEDULED': return 'Pendente';
      case 'CANCELLED': return 'Cancelado';
      default: return status;
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'COMPLETED': return 'confirmed';
      case 'SCHEDULED': return 'pending';
      case 'CANCELLED': return 'canceled';
      default: return '';
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
        {isLoading ? (
          <div className="loading-state">Carregando agendamentos...</div>
        ) : error ? (
          <div className="error-state">{error}</div>
        ) : filteredAppointments.length > 0 ? (
          filteredAppointments.map(app => (
            <div key={app.id} className={`appointment-card border-${getStatusClass(app.status)} ${app.status === 'CANCELLED' ? 'opacity-muted' : ''}`}>
              <div className="info-group">
                <div className="time-block">
                  <p className="time">{app.appointmentTime}</p>
                  <p className="duration">{app.serviceDurationInMinutes}min</p>
                </div>
                
                <div className="details">
                  <h3 className="service-name">{app.serviceTypeName}</h3>
                  <div className="client-info">
                    <span className="icon">👤</span>
                    {app.customerName}
                  </div>
                </div>
              </div>

              <div className="status-group">
                <span className={`status-badge badge-${getStatusClass(app.status)}`}>
                  {getStatusLabel(app.status)}
                </span>
                <p className="price">R$ {app.servicePrice}</p>
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
          services={services}
        />
      )}
    </main>
  );
};

export default DailyAgenda;
