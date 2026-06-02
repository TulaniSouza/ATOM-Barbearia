import '../styles/ConfigScreen.scss';

const ConfigScreen = () => {
  const workingHours = [
    { id: 1, start: '08:00', end: '11:00' },
    { id: 2, start: '11:00', end: '18:00' },
  ];

  const services = [
    { id: 1, name: 'Corte Masculino', duration: '00:40', price: '80' },
    { id: 2, name: 'Corte + Barba', duration: '01:00', price: '120' },
    { id: 3, name: 'Sobrancelha', duration: '00:20', price: '30' },
  ];

  const handleAddHour = () => alert('Adicionar novo horário');
  const handleAddService = () => alert('Adicionar novo serviço');
  const handleEdit = (type, id) => alert(`Editar ${type} ${id}`);
  const handleDelete = (type, id) => alert(`Excluir ${type} ${id}`);

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
                  onClick={() => handleEdit('horário', hour.id)}
                  aria-label="Editar horário"
                >
                  <span className="material-symbols-outlined">edit</span>
                </button>
                <button 
                  className="btn-action delete" 
                  onClick={() => handleDelete('horário', hour.id)}
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
                    onClick={() => handleEdit('serviço', service.id)}
                    aria-label="Editar serviço"
                  >
                    <span className="material-symbols-outlined">edit</span>
                  </button>
                  <button 
                    className="btn-action delete" 
                    onClick={() => handleDelete('serviço', service.id)}
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
    </div>
  );
};

export default ConfigScreen;
