import { useState, useEffect } from 'react';
import ServiceTypeService from '../services/ServiceTypeService';
import ScheduleService from '../services/ScheduleService';
import '../styles/ConfigScreen.scss';

const ConfigScreen = () => {
  const [services, setServices] = useState([]);
  const [workingHours, setWorkingHours] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState(null); // 'hour' or 'service'
  const [editingItem, setEditingItem] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchServices = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await ServiceTypeService.getAllActive();
      setServices(data);
    } catch (err) {
      setError("Erro ao carregar serviços.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleAddHour = () => {
    setModalType('hour');
    setEditingItem(null);
    setIsModalOpen(true);
  };

  const handleAddService = () => {
    setModalType('service');
    setEditingItem(null);
    setIsModalOpen(true);
  };

  const handleEdit = (type, item) => {
    setModalType(type);
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleDelete = async (type, id) => {
    if (window.confirm(`Tem certeza que deseja excluir este ${type === 'hour' ? 'horário' : 'serviço'}?`)) {
      if (type === 'hour') {
        const newHours = workingHours.filter(h => h.id !== id);
        setWorkingHours(newHours);
        await ScheduleService.saveWorkingHours(newHours);
      } else {
        try {
          await ServiceTypeService.deactivate(id);
          fetchServices();
        } catch (err) {
          alert("Erro ao excluir serviço.");
        }
      }
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
    setModalType(null);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    if (modalType === 'hour') {
      const newHour = {
        id: editingItem ? editingItem.id : Date.now(),
        start: formData.get('start'),
        end: formData.get('end'),
      };
      
      let newHours;
      if (editingItem) {
        newHours = workingHours.map(h => h.id === editingItem.id ? newHour : h);
      } else {
        newHours = [...workingHours, newHour];
      }
      setWorkingHours(newHours);
      await ScheduleService.saveWorkingHours(newHours);
      closeModal();
    } else {
      const durationStr = formData.get('duration');
      const [hours, minutes] = durationStr.split(':').map(Number);
      const durationInMinutes = (hours * 60) + minutes;

      const serviceData = {
        name: formData.get('name'),
        description: formData.get('description') || '',
        price: Number(formData.get('price')),
        durationInMinutes: durationInMinutes
      };

      try {
        if (editingItem) {
          await ServiceTypeService.update(editingItem.id, serviceData);
        } else {
          await ServiceTypeService.create(serviceData);
        }
        fetchServices();
        closeModal();
      } catch (err) {
        alert("Erro ao salvar serviço: " + (err.message || "Erro desconhecido"));
      }
    }
  };

  const formatDuration = (minutes) => {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
  };

  return (
    <div className="config-container">
      <section className="config-section" id="working-hours">
        <h2 className="section-title">Horários de Atendimento</h2>
        <div className="items-list">
          {workingHours.map((hour) => (
            <div key={hour.id} className="config-item">
              <div className="hour-info">
                <span className="time">{hour.start}</span>
                <span className="material-symbols-outlined icon-muted">schedule</span>
                <span className="separator">até</span>
                <span className="time">{hour.end}</span>
                <span className="material-symbols-outlined icon-muted">schedule</span>
              </div>
              <div className="item-actions">
                <button 
                  className="btn-action edit" 
                  onClick={() => handleEdit('hour', hour)}
                  aria-label="Editar horário"
                >
                  <span className="material-symbols-outlined">edit</span>
                </button>
                <button 
                  className="btn-action delete" 
                  onClick={() => handleDelete('hour', hour.id)}
                  aria-label="Excluir horário"
                >
                  <span className="material-symbols-outlined">delete</span>
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="section-footer">
          <button className="btn-add" onClick={handleAddHour}>
            <span className="material-symbols-outlined">add</span> Adicionar horário
          </button>
        </div>
      </section>

      <section className="config-section" id="services">
        <div className="section-header">
          <h2 className="section-title">Serviços</h2>
          <button className="btn-add" onClick={handleAddService}>
            <span className="material-symbols-outlined">add</span> Adicionar
          </button>
        </div>
        <div className="items-list">
          {isLoading ? (
            <p className="loading-message">Carregando serviços...</p>
          ) : error ? (
            <p className="error-message">{error}</p>
          ) : services.map((service) => (
            <div key={service.id} className="config-item service-item">
              <span className="service-name">{service.name}</span>
              <div className="service-details">
                <span className="service-duration">{formatDuration(service.durationInMinutes)}</span>
                <span className="service-price">R$ {service.price}</span>
                <div className="item-actions">
                  <button 
                    className="btn-action edit" 
                    onClick={() => handleEdit('service', service)}
                    aria-label="Editar serviço"
                  >
                    <span className="material-symbols-outlined">edit</span>
                  </button>
                  <button 
                    className="btn-action delete" 
                    onClick={() => handleDelete('service', service.id)}
                    aria-label="Excluir serviço"
                  >
                    <span className="material-symbols-outlined">delete</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {isModalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingItem ? 'Editar' : 'Adicionar'} {modalType === 'hour' ? 'Horário' : 'Serviço'}</h3>
              <button className="btn-close" onClick={closeModal}>
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <form onSubmit={handleSave} className="config-form">
              {modalType === 'hour' ? (
                <>
                  <div className="form-group">
                    <label htmlFor="start">Início</label>
                    <input type="time" id="start" name="start" defaultValue={editingItem?.start} required />
                  </div>
                  <div className="form-group">
                    <label htmlFor="end">Fim</label>
                    <input type="time" id="end" name="end" defaultValue={editingItem?.end} required />
                  </div>
                </>
              ) : (
                <>
                  <div className="form-group">
                    <label htmlFor="name">Nome do Serviço</label>
                    <input type="text" id="name" name="name" defaultValue={editingItem?.name} placeholder="Ex: Corte Degradê" required />
                  </div>
                  <div className="form-group">
                    <label htmlFor="description">Descrição</label>
                    <input type="text" id="description" name="description" defaultValue={editingItem?.description} placeholder="Descrição opcional" />
                  </div>
                  <div className="form-group">
                    <label htmlFor="duration">Duração (HH:MM)</label>
                    <input type="text" id="duration" name="duration" defaultValue={editingItem ? formatDuration(editingItem.durationInMinutes) : ''} placeholder="00:30" required />
                  </div>
                  <div className="form-group">
                    <label htmlFor="price">Preço (R$)</label>
                    <input type="number" id="price" name="price" defaultValue={editingItem?.price} placeholder="50" required />
                  </div>
                </>
              )}
              <div className="form-actions">
                <button type="button" className="btn-secondary" onClick={closeModal}>Cancelar</button>
                <button type="submit" className="btn-primary">Salvar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConfigScreen;
