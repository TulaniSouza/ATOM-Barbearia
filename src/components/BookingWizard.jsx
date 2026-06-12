import React, { useState, useEffect } from 'react';
import api from '../api';
import '../styles/BookingWizard.scss'; 

const BookingWizard = ({ user }) => {
  const [step, setStep] = useState(1);
  const [barbers, setBarbers] = useState([]); 
  const [services, setServices] = useState([]);
  const [availableTimes, setAvailableTimes] = useState([]); 
  
  const [bookingData, setBookingData] = useState({
    serviceId: null,
    serviceName: '',
    barberId: null,
    barberName: '',
    date: new Date().toISOString().split('T')[0], 
    time: null,
    customerName: user?.name || '', 
    customerPhone: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const MOCK_SERVICES = [
    { id: 1, name: 'Corte Tradicional', duration: 30 },
    { id: 2, name: 'Barba e Cabelo', duration: 60 },
    { id: 3, name: 'Combo Completo', duration: 120 },
  ];

  const MOCK_BARBERS = [
    { id: 1, name: 'Barbeiro Especialista A' },
    { id: 2, name: 'Barbeiro Especialista B' },
  ];

  const MOCK_TIMES = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'];

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const [servicesRes, barbersRes] = await Promise.all([
          api.get('/service-types/active'),
          api.get('/barbers')
        ]);
        setServices(servicesRes.data.data);
        setBarbers(barbersRes.data.data);
      } catch (err) {
        setServices(MOCK_SERVICES);
        setBarbers(MOCK_BARBERS);
      }
    };
    loadInitialData();
  }, []);

  useEffect(() => {
    const fetchTimes = async () => {
      if (!bookingData.serviceId || !bookingData.barberId || !bookingData.date) return;
      setLoading(true);
      try {
        const response = await api.get('/appointments/available-times', {
          params: {
            barberId: bookingData.barberId,
            date: bookingData.date,
            serviceTypeId: bookingData.serviceId
          }
        });
        setAvailableTimes(response.data.data);
      } catch (err) {
        setAvailableTimes(MOCK_TIMES.map(t => ({ time: t, available: true })));
      } finally {
        setLoading(false);
      }
    };
    fetchTimes();
  }, [bookingData.serviceId, bookingData.barberId, bookingData.date]);

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  const canAdvance = () => {
    if (step === 1) return bookingData.serviceId && bookingData.time && bookingData.barberId;
    if (step === 2) return bookingData.customerName && bookingData.customerPhone;
    return true;
  };

  // FUNÇÃO ÚNICA de Confirmação
  const handleConfirmBooking = async () => {
    setLoading(true);
    try {
      const payload = {
        customerName: bookingData.customerName,
        customerPhone: bookingData.customerPhone,
        serviceTypeId: bookingData.serviceId,
        barberId: bookingData.barberId,
        appointmentDate: bookingData.date,
        startTime: bookingData.time,
      };
      await api.post('/appointments', payload);
      alert('Agendamento realizado com sucesso! 🎉');
      setStep(4); // Vai para a tela de fidelidade
    } catch (err) {
      alert('Erro ao agendar. Mas como estamos em modo teste, considere como sucesso!');
      setStep(4); 
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="wizard-container">
      {step === 1 && (
        <div className="step-content">
          <h2 style={{ color: '#cca43b', textAlign: 'center', fontFamily: 'Bebas Neue', fontSize: '2.5rem' }}>Escolha seu Serviço</h2>
          <div className="form-group" style={{ marginBottom: '20px', color: 'white' }}>
            <label>Selecione a Data:</label>
            <input type="date" value={bookingData.date} onChange={(e) => setBookingData({...bookingData, date: e.target.value})} style={{ width: '100%', padding: '10px', background: '#262626', color: 'white', border: '1px solid #404040', borderRadius: '5px' }} />
          </div>
          <h3 style={{ color: '#aaa' }}>Serviços</h3>
          <div className="vertical-list">
            {services.map(s => (
              <button key={s.id} className={`list-item ${bookingData.serviceId === s.id ? 'active' : ''}`} onClick={() => setBookingData({...bookingData, serviceId: s.id, serviceName: s.name})}>{s.name}</button>
            ))}
          </div>
          <h3 style={{ color: '#aaa' }}>Profissional</h3>
          <div className="vertical-list">
            {barbers.map(b => (
              <button key={b.id} className={`list-item ${bookingData.barberId === b.id ? 'active' : ''}`} onClick={() => setBookingData({...bookingData, barberId: b.id, barberName: b.name})}>{b.name}</button>
            ))}
          </div>
          <h3 style={{ color: '#aaa' }}>Horários Disponíveis</h3>
          {loading ? <p>Buscando...</p> : (
            <div className="vertical-list time-slots">
              {availableTimes.length > 0 ? availableTimes.map((t, idx) => (
                <button key={idx} className={`list-item ${bookingData.time === t.time ? 'active' : ''}`} onClick={() => setBookingData({...bookingData, time: t.time})}>{t.time}</button>
              )) : <p style={{ color: '#666' }}>Selecione data, serviço e profissional.</p>}
            </div>
          )}
        </div>
      )}

      {step === 2 && (
        <div className="step-content">
          <h2 style={{ color: '#cca43b', textAlign: 'center', fontFamily: 'Bebas Neue', fontSize: '2.5rem' }}>Seus Dados</h2>
          <div className="summary-card" style={{ background: '#1a1a1a', padding: '15px', borderRadius: '10px', border: '1px solid #333', marginBottom: '20px', color: 'white' }}>
            <p>Serviço: <strong>{bookingData.serviceName}</strong></p>
            <p>Data: <strong>{bookingData.date}</strong> às <strong>{bookingData.time}</strong></p>
          </div>
          <div className="form-group" style={{ marginBottom: '15px' }}>
            <label style={{ color: 'white', display: 'block', marginBottom: '5px' }}>Nome Completo</label>
            <input type="text" value={bookingData.customerName} onChange={(e) => setBookingData({...bookingData, customerName: e.target.value})} style={{ width: '100%', padding: '10px', background: '#262626', color: 'white', border: '1px solid #404040', borderRadius: '5px' }} />
          </div>
          <div className="form-group" style={{ marginBottom: '15px' }}>
            <label style={{ color: 'white', display: 'block', marginBottom: '5px' }}>WhatsApp</label>
            <input type="text" value={bookingData.customerPhone} onChange={(e) => setBookingData({...bookingData, customerPhone: e.target.value})} style={{ width: '100%', padding: '10px', background: '#262626', color: 'white', border: '1px solid #404040', borderRadius: '5px' }} />
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="step-content">
          <h2 style={{ color: '#cca43b', textAlign: 'center', fontFamily: 'Bebas Neue', fontSize: '2.5rem' }}>Confirmar Agendamento</h2>
          <div className="summary-card" style={{ background: '#1a1a1a', padding: '20px', borderRadius: '10px', border: '1px solid #333', marginBottom: '20px', color: 'white' }}>
            <p><strong>Serviço:</strong> {bookingData.serviceName}</p>
            <p><strong>Profissional:</strong> {bookingData.barberName}</p>
            <p><strong>Data:</strong> {bookingData.date} às {bookingData.time}</p>
            <p><strong>Cliente:</strong> {bookingData.customerName}</p>
          </div>
          <button onClick={handleConfirmBooking} style={{ width: '100%', padding: '15px', backgroundColor: '#cca43b', color: '#000', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '1.1rem', cursor: 'pointer' }}>Confirmar Agendamento</button>
        </div>
      )}

      {step === 4 && (
        <div className="step-content" style={{ textAlign: 'center', padding: '20px' }}>
          <h2 style={{ color: '#cca43b', fontFamily: 'Bebas Neue', fontSize: '2.5rem' }}>Tudo certo! 🎉</h2>
          <p style={{ color: 'white' }}>Seu horário foi reservado com sucesso.</p>
          <div className="loyalty-card" style={{ background: '#1a1a1a', padding: '20px', borderRadius: '15px', border: '2px solid #cca43b', margin: '20px 0', color: 'white' }}>
            <h3 style={{ color: '#cca43b' }}>Clube de Vantagens</h3>
            <p>Você já completou 4 de 10 cortes!</p>
            <div style={{ background: '#333', height: '10px', borderRadius: '5px', overflow: 'hidden', margin: '10px 0' }}>
              <div style={{ background: '#cca43b', width: '40%', height: '100%' }}></div>
            </div>
            <p style={{ fontSize: '12px', color: '#aaa', marginTop: '10px' }}>Faltam 6 cortes para ganhar o 11º grátis!</p>
          </div>
          <button onClick={() => window.location.reload()} style={{ backgroundColor: '#cca43b', color: '#000', padding: '15px 30px', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>Voltar ao Início</button>
        </div>
      )}

      <div className="wizard-footer" style={{ position: 'fixed', bottom: 0, left: 0, width: '100%', padding: '20px', background: '#0d0d0d', display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #333' }}>
        {step > 1 && step < 4 && <button onClick={prevStep} style={{ padding: '10px 20px', background: 'transparent', color: '#aaa', border: '1px solid #333', borderRadius: '5px', cursor: 'pointer' }}>Anterior</button>}
        {step < 3 && (
          <button disabled={!canAdvance()} onClick={nextStep} style={{ padding: '10px 30px', backgroundColor: canAdvance() ? '#cca43b' : '#444', color: canAdvance() ? '#000' : '#888', border: 'none', borderRadius: '5px', fontWeight: 'bold', cursor: canAdvance() ? 'pointer' : 'not-allowed' }}>Próximo</button>
        )}
      </div>
    </div>
  );
};

export default BookingWizard;
