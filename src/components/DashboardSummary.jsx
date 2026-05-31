import React from 'react';
import '../styles/DashboardSummary.scss';

const DashboardSummary = ({ pendingCount, todayCount, nextAppointment }) => {
  return (
    <div className="dashboard-summary">
      <div className="summary-card">
        <span className="card-label">Pendentes</span>
        <div className="card-value-container">
          <span className="card-value">{pendingCount}</span>
          <span className="material-symbols-outlined icon-pending">notifications</span>
        </div>
      </div>

      <div className="summary-card">
        <span className="card-label">Hoje</span>
        <div className="card-value-container">
          <span className="card-value">{todayCount}</span>
          <span className="material-symbols-outlined icon-today">calendar_today</span>
        </div>
      </div>

      <div className="summary-card highlight">
        <span className="card-label">Próximo</span>
        {nextAppointment ? (
          <div className="next-appointment-info">
            <span className="client-name">{nextAppointment.clientName}</span>
            <span className="appointment-time">{nextAppointment.time || '10:00'}</span>
          </div>
        ) : (
          <span className="no-appointments">Sem agendamentos</span>
        )}
      </div>
    </div>
  );
};

export default DashboardSummary;
