import BaseService from './BaseService';

class AuthService extends BaseService {
  async login(credentials) {
    // credentials: { email, password }
    const response = await this.post('/auth/login', credentials);
    // response.data: { token, tokenType, barberId, name, email }
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify({
        id: response.data.barberId,
        name: response.data.name,
        email: response.data.email,
        role: 'barber' // API is "Login Barbeiro", so we assume barber role
      }));
    }
    return response.data;
  }

  async register(userData) {
    // RegisterRequest: { name, email, password }
    const response = await this.post('/auth/register', userData);
    return response.data;
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/';
  }

  getCurrentUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  isAuthenticated() {
    return !!localStorage.getItem('token');
  }
}

export default new AuthService();
