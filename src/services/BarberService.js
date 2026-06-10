import BaseService from './BaseService';

class BarberService extends BaseService {
  async getAll() {
    // Rota não existe na API ainda, mockando retorno para integração futura
    // Quando disponível, trocar por: return (await this.get('/barbers')).data;
    return [
      { id: 1, name: 'João (Especialista em Barba)', photo: 'https://i.pravatar.cc/150?u=1' },
      { id: 2, name: 'Lucas (Degradê & Estilo)', photo: 'https://i.pravatar.cc/150?u=2' },
      { id: 3, name: 'Marcos (Cortes Tradicionais)', photo: 'https://i.pravatar.cc/150?u=3' }
    ];
  }
}

export default new BarberService();
