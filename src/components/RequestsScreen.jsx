import { useState, useEffect } from 'react';
import Toast from './Toast';
import AppointmentService from '../services/AppointmentService';
import '../styles/RequestsScreen.scss';

const RequestsScreen = () => {
  const [filter, setFilter] = useState('Todas');
  const [dateFilter, setDateFilter] = useState('all'); // 'all', 'today', 'yesterday'
  const [toast, setToast] = useState(null);
  const [reschedulingId, setReschedulingId] = useState(null);
  const [newTime, setNewTime] = useState('');
  const [newDate, setNewDate] = useState('');
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Helpers para datas
  const getTodayStr = () => '2026-06-02'; 
  const getYesterdayStr = () => '2026-06-01'; 

  const fetchAppointments = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await AppointmentService.getAll();
      setAppointments(data);
    } catch (err) {
      setError("Erro ao carregar solicitações.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);
  
  const handleAction = async (id, action, client, extraData = {}) => {
    let type = 'success';
    let message = '';

    try {
      if (action === 'Confirmar') {
        // No Swagger não tem "confirmar", apenas agendamento já criado. 
        // Vamos assumir que "SCHEDULED" é o estado inicial.
        message = `Agendamento de ${client} confirmado (Simulado).`;
        type = 'success';
      } else if (action === 'Recusar') {
        await AppointmentService.cancel(id);
        message = `Agendamento de ${client} cancelado com sucesso.`;
        type = 'error';
      } else if (action === 'Finalizar') {
        await AppointmentService.complete(id);
        message = `Agendamento de ${client} finalizado com sucesso!`;
        type = 'success';
      } else if (action === 'Remarcar') {
        if (!extraData.time || !extraData.date) {
          setReschedulingId(id);
          const appt = appointments.find(r => r.id === id);
          setNewTime(appt?.appointmentTime || '');
          setNewDate(appt?.appointmentDate || '');
          return;
        }
        // A API não tem endpoint de remarcar direto no swagger (apenas create/complete/cancel)
        // Por enquanto vamos simular ou emitir um alerta.
        message = `Solicitação de remarcação para ${extraData.date} às ${extraData.time} enviada para ${client} (Simulado).`;
        type = 'attention';
      }

      setReschedulingId(null);
      setNewTime('');
      setNewDate('');
      setToast({ message, type });
      fetchAppointments();
    } catch (err) {
      setToast({ message: "Erro ao realizar ação: " + (err.message || "Erro desconhecido"), type: 'error' });
    }
  };

  const filteredRequests = appointments.filter(req => {
    // Filtro de Data
    if (dateFilter === 'today' && req.appointmentDate !== getTodayStr()) return false;
    if (dateFilter === 'yesterday' && req.appointmentDate !== getYesterdayStr()) return false;

    // Filtro de Status
    if (filter === 'Todas') return true;
    if (filter === 'Pendentes') return req.status === 'SCHEDULED';
    if (filter === 'Finalizadas') return req.status === 'COMPLETED';
    if (filter === 'Recusadas') return req.status === 'CANCELLED';
    return true;
  });

  const stats = {
    pending: appointments.filter(req => req.status === 'SCHEDULED').length,
    finished: appointments.filter(req => req.status === 'COMPLETED').length,
    cancelled: appointments.filter(req => req.status === 'CANCELLED').length,
    total: appointments.length
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'SCHEDULED': return <span className="status-badge pending">Agendado</span>;
      case 'CANCELLED': return <span className="status-badge rejected">Cancelado</span>;
      case 'COMPLETED': return <span className="status-badge finished">Finalizado</span>;
      default: return <span className="status-badge">Resolvido</span>;
    }
  };

  return (
    <main className="requests-screen">
      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast(null)} 
        />
      )}

      <div className="screen-header">
        <h2 className="title-display">Solicitações</h2>
        
        <div className="stats-grid">
          <div className="stat-item pending">
            <span className="stat-value">{stats.pending}</span>
            <span className="stat-label">Pendentes</span>
          </div>
          <div className="stat-item confirmed">
            <span className="stat-value">{stats.confirmed}</span>
            <span className="stat-label">Confirmadas</span>
          </div>
          <div className="stat-item finished">
            <span className="stat-value">{stats.finished}</span>
            <span className="stat-label">Finalizadas</span>
          </div>
          <div className="stat-item total">
            <span className="stat-value">{stats.total}</span>
            <span className="stat-label">Total</span>
          </div>
        </div>
      </div>

      <div className="filter-controls">
        <div className="filter-group">
          <span className="group-label">Período:</span>
          <div className="tabs">
            <button className={`tab-btn ${dateFilter === 'all' ? 'active' : ''}`} onClick={() => setDateFilter('all')}>Todas</button>
            <button className={`tab-btn ${dateFilter === 'today' ? 'active' : ''}`} onClick={() => setDateFilter('today')}>Hoje</button>
            <button className={`tab-btn ${dateFilter === 'yesterday' ? 'active' : ''}`} onClick={() => setDateFilter('yesterday')}>Ontem</button>
          </div>
        </div>

        <div className="filter-group">
          <span className="group-label">Status:</span>
          <div className="tabs scrollable">
            {['Todas', 'Pendentes', 'Confirmadas', 'Recusadas', 'Remarcadas', 'Finalizadas'].map(f => (
              <button
                key={f}
                className={`tab-btn ${filter === f ? 'active' : ''}`}
                onClick={() => setFilter(f)}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="requests-list">
        {isLoading ? (
          <p className="loading-message">Carregando solicitações...</p>
        ) : error ? (
          <p className="error-message">{error}</p>
        ) : filteredRequests.map(req => (
          <article 
            key={req.id} 
            className={`request-card ${req.status.toLowerCase()}`}
          >
            <div className="request-info">
              <h3>{req.serviceTypeName}</h3>
              <div className="request-datetime">{req.appointmentDate} • {req.appointmentTime}</div>
              <div className="request-client">{req.customerName}</div>
              <div className="request-note empty">
                Sem observações
              </div>
            </div>

            <div className="request-actions">
              {req.status === 'SCHEDULED' ? (
                reschedulingId === req.id ? (
                  <div className="reschedule-form">
                    <div className="input-group">
                      <label>Nova Data</label>
                      <input 
                        type="date" 
                        value={newDate} 
                        onChange={(e) => setNewDate(e.target.value)}
                        className="date-input"
                      />
                    </div>
                    <div className="input-group">
                      <label>Novo Horário</label>
                      <input 
                        type="time" 
                        value={newTime} 
                        onChange={(e) => setNewTime(e.target.value)}
                        className="time-input"
                      />
                    </div>
                    <div className="form-buttons">
                      <button 
                        className="btn-save-reschedule"
                        onClick={() => handleAction(req.id, 'Remarcar', req.customerName, { time: newTime, date: newDate })}
                      >
                        Enviar
                      </button>
                      <button 
                        className="btn-cancel-reschedule"
                        onClick={() => setReschedulingId(null)}
                      >
                        X
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <button 
                      className="btn-confirm"
                      onClick={() => handleAction(req.id, 'Confirmar', req.customerName)}
                    >
                      Confirmar
                    </button>
                    <button 
                      className="btn-reject"
                      onClick={() => handleAction(req.id, 'Recusar', req.customerName)}
                    >
                      Recusar
                    </button>
                    <button 
                      className="btn-reschedule"
                      onClick={() => handleAction(req.id, 'Remarcar', req.customerName)}
                    >
                      Remarcar
                    </button>
                  </>
                )
              ) : (
                <>
                  {getStatusBadge(req.status)}
                  {req.status === 'SCHEDULED' && ( // Isso não vai acontecer por causa do if acima, mas mantendo a lógica se mudar
                    <button 
                      className="btn-finish-small"
                      onClick={() => handleAction(req.id, 'Finalizar', req.customerName)}
                    >
                      Finalizar
                    </button>
                  )}
                  {req.status === 'SCHEDULED' === false && req.status !== 'CANCELLED' && req.status !== 'COMPLETED' && (
                     getStatusBadge(req.status)
                  )}
                  {req.status === 'SCHEDULED' || req.status === 'COMPLETED' || req.status === 'CANCELLED' ? null : getStatusBadge(req.status)}
                  
                  {/* Se estiver agendado (SCHEDULED), mostramos o botão de finalizar se for hoje/passado */}
                  {req.status === 'SCHEDULED' && (
                     <button 
                        className="btn-finish-small"
                        onClick={() => handleAction(req.id, 'Finalizar', req.customerName)}
                      >
                        Finalizar
                      </button>
                  )}
                </>
              )}
              {/* Adicionando botão finalizar para agendados que não estão em remarcação */}
              {req.status === 'SCHEDULED' && reschedulingId !== req.id && (
                  <button 
                    className="btn-finish-small"
                    style={{marginTop: '10px'}}
                    onClick={() => handleAction(req.id, 'Finalizar', req.customerName)}
                  >
                    Finalizar
                  </button>
              )}
            </div>
          </article>
        ))}
        {!isLoading && filteredRequests.length === 0 && (
          <p className="empty-message">Nenhuma solicitação encontrada para este filtro.</p>
        )}
      </div>
    </main>
  );
};

export default RequestsScreen;
