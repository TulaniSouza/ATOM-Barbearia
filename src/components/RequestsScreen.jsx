import { useState } from 'react';
import Toast from './Toast';
import '../styles/RequestsScreen.scss';

const RequestsScreen = ({ requests, setRequests }) => {
  const [filter, setFilter] = useState('Todas');
  const [dateFilter, setDateFilter] = useState('all'); // 'all', 'today', 'yesterday'
  const [toast, setToast] = useState(null);
  const [reschedulingId, setReschedulingId] = useState(null);
  const [newTime, setNewTime] = useState('');
  const [newDate, setNewDate] = useState('');

  // Helpers para datas
  const getTodayStr = () => '02/06/2026'; // Mocked Today
  const getYesterdayStr = () => '01/06/2026'; // Mocked Yesterday
  
  const handleAction = (id, action, client, extraData = {}) => {
    let type = 'success';
    let message = '';
    let newStatus = 'resolved';

    if (action === 'Confirmar') {
      message = `Agendamento de ${client} confirmado com sucesso!`;
      type = 'success';
      newStatus = 'confirmed';
    } else if (action === 'Recusar') {
      message = `Agendamento de ${client} recusado.`;
      type = 'error';
      newStatus = 'rejected';
    } else if (action === 'Remarcar') {
      if (!extraData.time || !extraData.date) {
        setReschedulingId(id);
        setNewTime(requests.find(r => r.id === id)?.time || '');
        setNewDate(requests.find(r => r.id === id)?.date.split('/').reverse().join('-') || '');
        return;
      }
      const formattedDate = extraData.date.split('-').reverse().join('/');
      message = `Solicitação de remarcação para ${formattedDate} às ${extraData.time} enviada para ${client}.`;
      type = 'attention';
      newStatus = 'rescheduled';
    } else if (action === 'Finalizar') {
      message = `Agendamento de ${client} finalizado!`;
      type = 'success';
      newStatus = 'finished';
    }

    setRequests(prev => prev.map(req => 
      req.id === id ? { 
        ...req, 
        status: newStatus, 
        time: extraData.time || req.time,
        date: extraData.date ? extraData.date.split('-').reverse().join('/') : req.date 
      } : req
    ));

    setReschedulingId(null);
    setNewTime('');
    setNewDate('');
    setToast({ message, type });
  };

  const filteredRequests = requests.filter(req => {
    // Filtro de Data
    if (dateFilter === 'today' && req.date !== getTodayStr()) return false;
    if (dateFilter === 'yesterday' && req.date !== getYesterdayStr()) return false;

    // Filtro de Status
    if (filter === 'Todas') return true;
    if (filter === 'Pendentes') return req.status === 'pending';
    if (filter === 'Confirmadas') return req.status === 'confirmed';
    if (filter === 'Recusadas') return req.status === 'rejected';
    if (filter === 'Remarcadas') return req.status === 'rescheduled';
    if (filter === 'Finalizadas') return req.status === 'finished';
    return true;
  });

  const stats = {
    pending: requests.filter(req => req.status === 'pending').length,
    confirmed: requests.filter(req => req.status === 'confirmed').length,
    finished: requests.filter(req => req.status === 'finished').length,
    total: requests.length
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'confirmed': return <span className="status-badge confirmed">Confirmado</span>;
      case 'rejected': return <span className="status-badge rejected">Recusado</span>;
      case 'rescheduled': return <span className="status-badge rescheduled">Remarcado</span>;
      case 'finished': return <span className="status-badge finished">Finalizado</span>;
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
        {filteredRequests.map(req => (
          <article 
            key={req.id} 
            className={`request-card ${req.status}`}
          >
            <div className="request-info">
              <h3>{req.service}</h3>
              <div className="request-datetime">{req.date} • {req.time}</div>
              <div className="request-client">{req.client}</div>
              <div className={`request-note ${!req.note ? 'empty' : ''}`}>
                {req.note || 'Sem observações'}
              </div>
            </div>

            <div className="request-actions">
              {req.status === 'pending' ? (
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
                        onClick={() => handleAction(req.id, 'Remarcar', req.client, { time: newTime, date: newDate })}
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
                      onClick={() => handleAction(req.id, 'Confirmar', req.client)}
                    >
                      Confirmar
                    </button>
                    <button 
                      className="btn-reject"
                      onClick={() => handleAction(req.id, 'Recusar', req.client)}
                    >
                      Recusar
                    </button>
                    <button 
                      className="btn-reschedule"
                      onClick={() => handleAction(req.id, 'Remarcar', req.client)}
                    >
                      Remarcar
                    </button>
                  </>
                )
              ) : (
                <>
                  {getStatusBadge(req.status)}
                  {req.status === 'confirmed' && (
                    <button 
                      className="btn-finish-small"
                      onClick={() => handleAction(req.id, 'Finalizar', req.client)}
                    >
                      Finalizar
                    </button>
                  )}
                </>
              )}
            </div>
          </article>
        ))}
        {filteredRequests.length === 0 && (
          <p className="empty-message">Nenhuma solicitação encontrada para este filtro.</p>
        )}
      </div>
    </main>
  );
};

export default RequestsScreen;
