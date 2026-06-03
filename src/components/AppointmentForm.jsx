import { useState } from 'react';
import '../styles/AppointmentForm.scss';

const AppointmentForm = ({ onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    client: '',
    service: 'Corte Masculino',
    barber: 'Qualquer Barbeiro',
    time: '',
    price: 80
  });

  const barbers = [
    "Qualquer Barbeiro",
    "João (Especialista em Barba)",
    "Lucas (Degradê & Estilo)",
    "Marcos (Cortes Tradicionais)"
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.client || !formData.time) {
      alert('Por favor, preencha o cliente e o horário.');
      return;
    }
    onSave(formData);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2 className="modal-title">Novo <span className="highlight">Agendamento</span></h2>
        
        <form onSubmit={handleSubmit} className="appointment-form">
          <div className="form-group">
            <label htmlFor="client">Cliente</label>
            <input 
              type="text" 
              id="client" 
              name="client" 
              value={formData.client} 
              onChange={handleChange} 
              placeholder="Nome do cliente"
              required 
            />
          </div>

          <div className="form-group">
            <label htmlFor="service">Serviço</label>
            <select 
              id="service" 
              name="service" 
              value={formData.service} 
              onChange={handleChange}
            >
              <option value="Corte Masculino">Corte Masculino</option>
              <option value="Barba">Barba</option>
              <option value="Corte + Barba">Corte + Barba</option>
              <option value="Pezinho">Pezinho</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="barber">Barbeiro / Profissional</label>
            <select 
              id="barber" 
              name="barber" 
              value={formData.barber} 
              onChange={handleChange}
            >
              {barbers.map(b => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="time">Horário</label>
              <input 
                type="time" 
                id="time" 
                name="time" 
                value={formData.time} 
                onChange={handleChange} 
                required 
              />
            </div>

            <div className="form-group">
              <label htmlFor="price">Valor (R$)</label>
              <input 
                type="number" 
                id="price" 
                name="price" 
                value={formData.price} 
                onChange={handleChange} 
              />
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="btn-cancel" onClick={onCancel}>
              Cancelar
            </button>
            <button type="submit" className="btn-save">
              Salvar Agendamento
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AppointmentForm;
