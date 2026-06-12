import { useState, useEffect } from 'react';
import '../styles/AppointmentForm.scss';

const AppointmentForm = ({ onSave, onCancel, initialData = {}, services = [], isClient = false }) => {
  const [formData, setFormData] = useState({
    client: initialData.client || '',
    phone: initialData.phone || '',
    serviceId: initialData.serviceId || (services.length > 0 ? services[0].id : ''),
    time: initialData.time || '',
    price: initialData.price || (services.length > 0 ? services[0].price : 0),
    date: initialData.date || ''
  });

  useEffect(() => {
    if (formData.serviceId) {
      const selected = services.find(s => s.id === Number(formData.serviceId));
      if (selected) {
        setFormData(prev => ({ ...prev, price: selected.price }));
      }
    }
  }, [formData.serviceId, services]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.client || !formData.time || !formData.serviceId) {
      alert('Por favor, preencha todos os campos obrigatórios.');
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
            <label htmlFor="client">{isClient ? 'Seu Nome' : 'Cliente'}</label>
            <input 
              type="text" 
              id="client" 
              name="client" 
              value={formData.client} 
              onChange={handleChange} 
              placeholder={isClient ? 'Como podemos te chamar?' : 'Nome do cliente'}
              required 
            />
          </div>

          {isClient && (
            <div className="form-group">
              <label htmlFor="phone">WhatsApp</label>
              <input 
                type="tel" 
                id="phone" 
                name="phone" 
                value={formData.phone} 
                onChange={handleChange} 
                placeholder="(00) 00000-0000"
                required 
              />
            </div>
          )}

          <div className="form-group">
            <label htmlFor="serviceId">Serviço</label>
            <select 
              id="serviceId" 
              name="serviceId" 
              value={formData.serviceId} 
              onChange={handleChange}
              required
            >
              {services.map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
              {services.length === 0 && <option value="">Nenhum serviço disponível</option>}
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

            {!isClient && (
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
            )}
          </div>

          <div className="form-actions">
            <button type="button" className="btn-cancel" onClick={onCancel}>
              Cancelar
            </button>
            <button type="submit" className="btn-save">
              {isClient ? 'Solicitar Horário' : 'Salvar Agendamento'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AppointmentForm;
