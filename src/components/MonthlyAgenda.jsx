import React from 'react';
import { mockAgenda } from '../data/mockAgenda';
import '../styles/MonthlyAgenda.scss';

/**
 * Componente MonthlyAgenda
 * Exibe um calendário mensal interativo para o mês de Maio de 2026.
 * @param {Function} onLogout - Função para retornar à tela de login.
 */
const MonthlyAgenda = ({ onLogout }) => {
  const monthName = "Maio";
  const year = 2026;
  
  // Abreviações para Mobile e Nomes completos para Desktop
  const weekdaysShort = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];
  const weekdaysFull = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];

  // Maio 2026 começa em uma Sexta-feira (Index 5: 0=Dom, 1=Seg...)
  const firstDayOfMonthIndex = 5; 
  const totalDaysInMonth = 31;

  // Gerar array de dias para o grid
  const calendarDays = [];
  
  // Preenchimento do início do mês (dias vazios)
  for (let i = 0; i < firstDayOfMonthIndex; i++) {
    calendarDays.push({ day: null, dateStr: null, hasAppointment: false });
  }

  // Dias do mês
  for (let d = 1; d <= totalDaysInMonth; d++) {
    const formattedDay = d.toString().padStart(2, '0');
    const dateStr = `2026-05-${formattedDay}`;
    const hasAppointment = mockAgenda.some(appt => appt.date === dateStr);
    
    calendarDays.push({
      day: d,
      dateStr: dateStr,
      hasAppointment: hasAppointment
    });
  }

  return (
    <div className="monthly-agenda-container">
      <div className="section-header-actions">
        <h2 className="section-title">AGENDA <span className="highlight">MENSAL</span></h2>
        <div className="actions">
          <button className="btn-secondary">Ver dia</button>
          <button className="btn-primary" onClick={() => alert('Novo agendamento')}>+ Novo agendamento</button>
        </div>
      </div>

      <main className="calendar-card">
        <div className="weekdays-grid">
          {weekdaysShort.map((day, idx) => (
            <div key={idx} className="weekday-name">
              <span className="mobile-only">{day}</span>
              <span className="desktop-only">{weekdaysFull[idx]}</span>
            </div>
          ))}
        </div>

        <div className="days-grid">
          {calendarDays.map((item, index) => (
            <div 
              key={index} 
              className={`day-cell ${!item.day ? 'empty' : ''} ${item.hasAppointment ? 'has-appointment' : ''}`}
            >
              {item.day && (
                <>
                  <span className="day-number">{item.day}</span>
                  {item.hasAppointment && <div className="appointment-indicator" title="Possui agendamento"></div>}
                </>
              )}
            </div>
          ))}
        </div>
      </main>

      <footer className="calendar-legend">
        <div className="legend-item">
          <span className="indicator-dot highlight"></span>
          <span>Dia com Agendamento</span>
        </div>
        <div className="legend-item">
          <span className="indicator-dot normal"></span>
          <span>Disponível</span>
        </div>
      </footer>
    </div>
  );
};

export default MonthlyAgenda;
