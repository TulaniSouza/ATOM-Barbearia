import { useState } from 'react';
import { mockWorkingHours, mockServices } from '../data/mockAgenda';
import '../styles/ConfigScreen.scss';

const ConfigScreen = () => {
  const [workingHours, setWorkingHours] = useState(mockWorkingHours);
  const [services, setServices] = useState(mockServices);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState(null); // 'hour' or 'service'
  const [editingItem, setEditingItem] = useState(null);

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

  const handleDelete = (type, id) => {
    if (window.confirm(`Tem certeza que deseja excluir este ${type === 'hour' ? 'horário' : 'serviço'}?`)) {
      if (type === 'hour') {
        setWorkingHours(workingHours.filter(h => h.id !== id));
      } else {
        setServices(services.filter(s => s.id !== id));
      }
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
    setModalType(null);
  };

  const handleSave = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    if (modalType === 'hour') {
      const newHour = {
        id: editingItem ? editingItem.id : Date.now(),
        start: formData.get('start'),
        end: formData.get('end'),
      };
      
      if (editingItem) {
        setWorkingHours(workingHours.map(h => h.id === editingItem.id ? newHour : h));
      } else {
        setWorkingHours([...workingHours, newHour]);
      }
    } else {
      const newService = {
        id: editingItem ? editingItem.id : Date.now(),
        name: formData.get('name'),
        duration: formData.get('duration'),
        price: formData.get('price'),
      };
      
      if (editingItem) {
        setServices(services.map(s => s.id === editingItem.id ? newService : s));
      } else {
        setServices([...services, newService]);
      }
    }
    closeModal();
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
          {services.map((service) => (
            <div key={service.id} className="config-item service-item">
              <span className="service-name">{service.name}</span>
              <div className="service-details">
                <span className="service-duration">{service.duration}</span>
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
                    <label htmlFor="duration">Duração (HH:MM)</label>
                    <input type="text" id="duration" name="duration" defaultValue={editingItem?.duration} placeholder="00:30" required />
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
