import { useState, useEffect } from 'react';
import '../styles/ClientDashboard.scss';
import AppointmentForm from './AppointmentForm';
import ServiceTypeService from '../services/ServiceTypeService';
import ScheduleService from '../services/ScheduleService';
import AppointmentService from '../services/AppointmentService';
import BarberService from '../services/BarberService';

const ClientDashboard = () => {
  const [showForm, setShowForm] = useState(false);
  const [barbers, setBarbers] = useState([]);
  const [services, setServices] = useState([]);
  const [selectedBarber, setSelectedBarber] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [availableTimes, setAvailableTimes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [barberData, serviceData] = await Promise.all([
          BarberService.getAll(),
          ServiceTypeService.getAllActive()
        ]);
        setBarbers(barberData);
        setServices(serviceData);
      } catch (err) {
        console.error("Erro ao carregar dados iniciais:", err);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (selectedBarber && selectedService && selectedDate) {
      const fetchAvailableTimes = async () => {
        setIsLoading(true);
        try {
          const data = await ScheduleService.getAvailableTimes(selectedDate, selectedService.id);
          setAvailableTimes(data);
        } catch (err) {
          console.error("Erro ao carregar horários:", err);
        } finally {
          setIsLoading(false);
        }
      };
      fetchAvailableTimes();
    }
  }, [selectedBarber, selectedService, selectedDate]);

  const handleBooking = async (time) => {
    if (!selectedService) return;
    setShowForm({ time });
  };

  const handleDetailedBooking = async (formData) => {
    try {
      const requestData = {
        customerName: formData.client,
        customerPhone: formData.phone || "(00) 00000-0000",
        serviceTypeId: formData.serviceId,
        appointmentDate: formData.date || selectedDate,
        appointmentTime: formData.time
      };
      await AppointmentService.create(requestData);
      setShowForm(false);
      alert(`Sucesso! Seu agendamento foi solicitado.`);
      // Refresh available times
      const data = await ScheduleService.getAvailableTimes(selectedDate, selectedService.id);
      setAvailableTimes(data);
    } catch (err) {
      alert("Erro ao solicitar agendamento: " + (err.message || "Erro desconhecido"));
    }
  };

  return (
    <main className="client-dashboard">
      <header className="dashboard-header">
        <h2 className="title-display">Agende seu <span className="highlight">Horário</span></h2>
        <p className="subtitle">Selecione o profissional, o serviço e a data desejada.</p>
      </header>

      <div className="selection-area">
        {/* Passo 1: Barbeiro */}
        <div className="form-group">
          <label>1. Profissional</label>
          <select 
            value={selectedBarber?.id || ''} 
            onChange={(e) => setSelectedBarber(barbers.find(b => b.id === Number(e.target.value)))}
          >
            <option value="">Selecione um barbeiro</option>
            {barbers.map(b => (
              <option key={b.id} value={b.id}>{b.name}</option>
            ))}
          </select>
        </div>

        {/* Passo 2: Serviço (Habilitado apenas após selecionar barbeiro) */}
        <div className="form-group">
          <label>2. Serviço</label>
          <select 
            disabled={!selectedBarber}
            value={selectedService?.id || ''} 
            onChange={(e) => setSelectedService(services.find(s => s.id === Number(e.target.value)))}
          >
            <option value="">Selecione o serviço</option>
            {services.map(s => (
              <option key={s.id} value={s.id}>{s.name} - R$ {s.price}</option>
            ))}
          </select>
        </div>

        {/* Passo 3: Data (Habilitado apenas após selecionar serviço) */}
        <div className="form-group">
          <label>3. Data</label>
          <input 
            disabled={!selectedService}
            type="date" 
            value={selectedDate} 
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </div>
      </div>

      <section className="booking-card">
        <div className="card-header">
          <span className="material-symbols-outlined icon">event_available</span>
          <div className="text">
            <h3>Horários Disponíveis</h3>
            <p>
              {selectedBarber ? `${selectedBarber.name}` : 'Selecione um profissional'} 
              {selectedService ? ` • ${selectedService.name}` : ''}
            </p>
          </div>
        </div>
        
        {!selectedBarber || !selectedService ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: '#aaa' }}>
            Complete os passos acima para ver os horários disponíveis.
          </div>
        ) : isLoading ? (
          <div style={{ padding: '2rem', textAlign: 'center' }}>Carregando horários...</div>
        ) : (
          <div className="time-grid">
            {availableTimes.filter(t => t.available).map((slot) => (
              <button 
                key={slot.time}
                onClick={() => handleBooking(slot.time)}
                className="time-btn"
              >
                <span className="time">{slot.time}</span>
                <span className="label">Reservar</span>
              </button>
            ))}
            {availableTimes.filter(t => t.available).length === 0 && (
              <div style={{ gridColumn: '1/-1', padding: '2rem', textAlign: 'center', color: '#aaa' }}>
                Nenhum horário disponível para esta data.
              </div>
            )}
          </div>
        )}
      </section>

      {showForm && (
        <AppointmentForm 
          onSave={handleDetailedBooking} 
          onCancel={() => setShowForm(false)}
          initialData={{
            time: showForm.time || '',
            serviceId: selectedService?.id,
            date: selectedDate
          }}
          services={services}
          isClient={true}
        />
      )}

      <section className="info-section">
        <div className="info-card">
          <span className="material-symbols-outlined">info</span>
          <p>Seu agendamento ficará pendente até que o barbeiro confirme a solicitação.</p>
        </div>
      </section>
    </main>
  );
};

export default ClientDashboard;
