import BaseService from './BaseService';

class AppointmentService extends BaseService {
  async getAll() {
    const response = await this.get('/appointments');
    return response.data;
  }

  async getByDate(date) {
    // GET /api/appointments/date?date=YYYY-MM-DD
    const response = await this.get('/appointments/date', { params: { date } });
    return response.data;
  }

  async getScheduledByDate(date) {
    // GET /api/appointments/date/scheduled?date=YYYY-MM-DD
    const response = await this.get('/appointments/date/scheduled', { params: { date } });
    return response.data;
  }

  async create(appointment) {
    // AppointmentRequest: { customerName, customerPhone, serviceTypeId, appointmentDate, appointmentTime }
    const response = await this.post('/appointments', appointment);
    return response.data;
  }

  async complete(id) {
    // PATCH /api/appointments/{id}/complete
    const response = await this.api.patch(`/appointments/${id}/complete`);
    return response.data;
  }

  async cancel(id) {
    // PATCH /api/appointments/{id}/cancel
    const response = await this.api.patch(`/appointments/${id}/cancel`);
    return response.data;
  }
}

export default new AppointmentService();
