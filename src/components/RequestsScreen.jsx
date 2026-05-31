import React, { useState } from 'react';
import '../styles/RequestsScreen.scss';

const RequestsScreen = () => {
  const [filter, setFilter] = useState('Todas');
  
  const initialRequests = [
    {
      id: 1,
      service: 'Corte Masculino',
      date: '31/07/2025',
      time: '08:40',
      client: 'Jefferson Silva',
      note: 'Degradê com navalha',
      status: 'pending'
    },
    {
      id: 2,
      service: 'Corte + Barba',
      date: '01/08/2025',
      time: '10:00',
      client: 'Lucas Ramos',
      note: 'Barba bem redonda',
      status: 'pending'
    },
    {
      id: 3,
      service: 'Corte Masculino',
      date: '30/07/2025',
      time: '15:00',
      client: 'Anderson Gomes',
      note: '',
      status: 'resolved'
    },
    {
      id: 4,
      service: 'Barba Imperial',
      date: '29/07/2025',
      time: '11:30',
      client: 'Ricardo Oliveira',
      note: 'Tratamento com toalha quente',
      status: 'resolved'
    }
  ];

  const handleAction = (action, client) => {
    alert(`${action} para o cliente: ${client}`);
  };

  const filteredRequests = initialRequests.filter(req => {
    if (filter === 'Todas') return true;
    if (filter === 'Pendentes') return req.status === 'pending';
    if (filter === 'Resolvidas') return req.status === 'resolved';
    return true;
  });

  const pendingCount = initialRequests.filter(req => req.status === 'pending').length;

  return (
    <main className="requests-screen">
      <div className="screen-header">
        <h2>Solicitações</h2>
        <div className="stats">
          {pendingCount} pendente(s) • {initialRequests.length} total
        </div>
      </div>

      <div className="filters">
        {['Todas', 'Pendentes', 'Resolvidas'].map(f => (
          <button
            key={f}
            className={`filter-btn ${filter === f ? 'active' : ''}`}
            onClick={() => setFilter(f)}
          >
            {f}
          </button>
        ))}
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
                <>
                  <button 
                    className="btn-confirm"
                    onClick={() => handleAction('Agendamento Confirmado', req.client)}
                  >
                    Confirmar
                  </button>
                  <button 
                    className="btn-reject"
                    onClick={() => handleAction('Agendamento Recusado', req.client)}
                  >
                    Recusar
                  </button>
                  <button 
                    className="btn-reschedule"
                    onClick={() => handleAction('Solicitação de Remarcação enviada', req.client)}
                  >
                    Remarcar
                  </button>
                </>
              ) : (
                <span className="status-badge">Resolvido</span>
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
