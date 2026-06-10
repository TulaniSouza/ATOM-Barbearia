import { useState, useEffect, useMemo } from 'react';
import AppointmentService from '../services/AppointmentService';
import '../styles/MonthlyAgenda.scss';

/**
 * Componente MonthlyAgenda
 * Exibe um calendário mensal interativo com navegação e resumo financeiro.
 */
const MonthlyAgenda = () => {
  // Estado para o mês e ano exibidos (Inicializa em Maio de 2026 conforme requisito)
  const [currentDate, setCurrentDate] = useState(new Date(2026, 4, 1));
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const monthNames = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
  ];

  const weekdaysShort = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];
  const weekdaysFull = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];

  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  // Buscar agendamentos da API
  useEffect(() => {
    const fetchAppointments = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Como a API não tem um "buscar por mês" direto que retorne tudo,
        // vamos usar o listagem geral ou buscar por data se necessário.
        // O swagger mostra /api/appointments que lista todos.
        const data = await AppointmentService.getAll();
        setAppointments(data);
      } catch (err) {
        setError("Erro ao carregar agendamentos.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAppointments();
  }, [currentMonth, currentYear]);

  // Navegação de meses
  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
  };

  // Cálculos do calendário e estatísticas
  const { calendarDays, monthSummary } = useMemo(() => {
    const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    
    const days = [];
    
    // Preenchimento inicial (dias vazios)
    for (let i = 0; i < firstDayIndex; i++) {
      days.push({ day: null, dateStr: null, appointments: [] });
    }

    const summary = {
      total: 0,
      confirmed: 0,
      pending: 0,
      canceled: 0,
      revenue: 0
    };

    // Filtrar agendamentos do mês atual
    const currentMonthAppointments = appointments.filter(appt => {
      const apptDate = new Date(appt.appointmentDate);
      return apptDate.getMonth() === currentMonth && apptDate.getFullYear() === currentYear;
    });

    // Dias do mês
    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${currentYear}-${(currentMonth + 1).toString().padStart(2, '0')}-${d.toString().padStart(2, '0')}`;
      const dayAppointments = currentMonthAppointments.filter(appt => appt.appointmentDate === dateStr);
      
      days.push({
        day: d,
        dateStr: dateStr,
        appointments: dayAppointments
      });

      // Atualiza resumo baseado no status da API (SCHEDULED, CANCELLED, COMPLETED)
      dayAppointments.forEach(appt => {
        summary.total++;
        if (appt.status === 'COMPLETED') {
          summary.confirmed++;
          summary.revenue += appt.servicePrice || 0;
        } else if (appt.status === 'SCHEDULED') {
          summary.pending++;
          summary.revenue += appt.servicePrice || 0;
        } else if (appt.status === 'CANCELLED') {
          summary.canceled++;
        }
      });
    }

    return { calendarDays: days, monthSummary: summary };
  }, [currentMonth, currentYear, appointments]);

  return (
    <div className="monthly-agenda-container">
      <header className="section-header-actions">
        <div className="title-nav">
          <h2 className="section-title">AGENDA <span className="highlight">MENSAL</span></h2>
          <div className="month-navigation">
            <button onClick={handlePrevMonth} className="nav-btn" aria-label="Mês anterior">&lt;</button>
            <span className="current-month-display">{monthNames[currentMonth]} {currentYear}</span>
            <button onClick={handleNextMonth} className="nav-btn" aria-label="Próximo mês">&gt;</button>
          </div>
        </div>
        <div className="actions">
          <button className="btn-secondary">Ver dia</button>
          <button className="btn-primary" onClick={() => alert('Novo agendamento')}>+ Novo agendamento</button>
        </div>
      </header>

      <div className="calendar-layout">
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
            {calendarDays.map((item, index) => {
              const apptCount = item.appointments?.length || 0;
              const isBusy = apptCount > 3;
              
              return (
                <div 
                  key={index} 
                  className={`day-cell ${!item.day ? 'empty' : ''} ${apptCount > 0 ? 'has-appointment' : ''} ${isBusy ? 'busy-day' : ''}`}
                >
                  {item.day && (
                    <>
                      <span className="day-number">{item.day}</span>
                      {apptCount > 0 && (
                        <div className="appointment-badge" title={`${apptCount} agendamento(s)`}>
                          {apptCount}
                        </div>
                      )}
                    </>
                  )}
                </div>
              );
            })}
          </div>

          <footer className="calendar-legend">
            <div className="legend-item">
              <span className="indicator-dot highlight"></span>
              <span>Com Agendamento</span>
            </div>
            <div className="legend-item">
              <span className="indicator-dot busy"></span>
              <span>Dia Cheio (+3)</span>
            </div>
          </footer>
        </main>

        <aside className="summary-section">
          <h3 className="summary-title">Resumo de {monthNames[currentMonth]}</h3>
          <div className="summary-grid">
            <div className="summary-card">
              <span className="label">Total de Agendamentos</span>
              <span className="value">{monthSummary.total}</span>
            </div>
            <div className="summary-card status-confirmed">
              <span className="label">Confirmados</span>
              <span className="value">{monthSummary.confirmed}</span>
            </div>
            <div className="summary-card status-pending">
              <span className="label">Pendentes</span>
              <span className="value">{monthSummary.pending}</span>
            </div>
            <div className="summary-card status-canceled">
              <span className="label">Cancelados</span>
              <span className="value">{monthSummary.canceled}</span>
            </div>
            <div className="summary-card revenue-card">
              <span className="label">Receita Estimada</span>
              <span className="value">
                {monthSummary.revenue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default MonthlyAgenda;
