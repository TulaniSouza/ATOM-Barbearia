import BaseService from './BaseService';

class ServiceTypeService extends BaseService {
  async getAll() {
    const response = await this.get('/service-types');
    return response.data;
  }

  async getAllActive() {
    const response = await this.get('/service-types/active');
    return response.data;
  }

  async getById(id) {
    const response = await this.get(`/service-types/${id}`);
    return response.data;
  }

  async create(serviceType) {
    // ServiceTypeRequest: { name, description, price, durationInMinutes }
    const response = await this.post('/service-types', serviceType);
    return response.data;
  }

  async update(id, serviceType) {
    const response = await this.put(`/service-types/${id}`, serviceType);
    return response.data;
  }

  async deactivate(id) {
    const response = await this.delete(`/service-types/${id}`);
    return response.data;
  }
}

export default new ServiceTypeService();
