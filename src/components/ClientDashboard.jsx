import { useState } from 'react';
import '../styles/ClientDashboard.scss';
import AppointmentForm from './AppointmentForm';

const ClientDashboard = ({ user, setPendingAppointments }) => {
  const [showForm, setShowForm] = useState(false);
  const availableTimes = ["09:00", "10:00", "11:00", "14:00", "15:00"];

  const handleBooking = (time) => {
    const newAppt = { 
      id: Date.now(), 
      client: user?.name || "Cliente do Painel", 
      time: time, 
      service: "Corte Tradicional (Painel Web)" 
    };
    setPendingAppointments(prev => [...prev, newAppt]);
    alert(`Sucesso! Solicitação para às ${time}h enviada ao barbeiro.`);
  };

  const handleDetailedBooking = (formData) => {
    const newAppt = {
      id: Date.now(),
      client: formData.client,
      time: formData.time,
      service: formData.service,
      price: formData.price
    };
    setPendingAppointments(prev => [...prev, newAppt]);
    setShowForm(false);
    alert(`Sucesso! Seu agendamento para ${formData.service} às ${formData.time} foi solicitado.`);
  };

  return (
    <main className="client-dashboard">
      <header className="dashboard-header">
        <h2 className="title-display">Bem-vindo, <span className="highlight">{(user?.name || user?.email || 'usuário').split(' ')[0]}</span></h2>
        <p className="subtitle">Escolha um horário rápido ou faça um agendamento detalhado.</p>
        
        <button 
          className="time-btn" 
          style={{ marginTop: '1rem', width: 'auto', padding: '1rem 2rem', background: '#cca43b', color: '#000' }}
          onClick={() => setShowForm(true)}
        >
          <span className="label" style={{ color: '#000', fontSize: '1rem' }}>Novo Agendamento</span>
        </button>
      </header>

      {showForm && (
        <AppointmentForm 
          onSave={handleDetailedBooking} 
          onCancel={() => setShowForm(false)} 
        />
      )}

      <section className="booking-card">
        <div className="card-header">
          <span className="material-symbols-outlined icon">event_available</span>
          <div className="text">
            <h3>Horários Disponíveis</h3>
            <p>Sincronizados com o Google Calendar</p>
          </div>
        </div>
        
        <div className="time-grid">
          {availableTimes.map((time) => (
            <button 
              key={time}
              onClick={() => handleBooking(time)}
              className="time-btn"
            >
              <span className="time">{time}</span>
              <span className="label">Reservar</span>
            </button>
          ))}
        </div>
      </section>

      <section className="info-section">
        <div className="info-card">
          <span className="material-symbols-outlined">info</span>
          <p>Você receberá uma notificação assim que o barbeiro confirmar sua solicitação.</p>
        </div>
      </section>
    </main>
  );
};

export default ClientDashboard;
