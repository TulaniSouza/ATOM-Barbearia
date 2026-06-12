import BaseService from './BaseService';

class ScheduleService extends BaseService {
  async getBarberSchedule(date, status) {
    // GET /api/barber/schedule?date=YYYY-MM-DD&status=SCHEDULED
    const params = { date };
    if (status) params.status = status;
    const response = await this.get('/barber/schedule', { params });
    return response.data;
  }

  async getAvailableTimes(date, serviceTypeId) {
    // GET /api/appointments/available-times?date=YYYY-MM-DD&serviceTypeId=1
    const response = await this.get('/appointments/available-times', { params: { date, serviceTypeId } });
    return response.data;
  }

  async saveWorkingHours(workingHours) {
    // Rota não existe na API ainda (não encontrada no swagger)
    // Mockando para permitir que a UI funcione. 
    // Quando disponível, implementar o POST/PUT correspondente.
    console.log("Saving working hours:", workingHours);
    return { success: true };
  }
}

export default new ScheduleService();
