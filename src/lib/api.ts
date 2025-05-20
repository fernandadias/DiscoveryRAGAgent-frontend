import axios from 'axios';

// Função para obter o token JWT do localStorage
const getAuthToken = () => {
  return localStorage.getItem('authToken');
};

// Configuração base do axios
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar o token de autenticação em todas as requisições
api.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para tratamento de erros
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Se o erro for 401 (Unauthorized), redirecionar para a página de login
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

// Função para realizar login
export const login = async (username: string, password: string) => {
  try {
    const response = await api.post('/api/login', { username, password });
    const { access_token } = response.data;
    
    // Armazenar o token no localStorage
    localStorage.setItem('authToken', access_token);
    
    return { success: true };
  } catch (error) {
    console.error('Login error:', error);
    return { 
      success: false, 
      message: error.response?.data?.detail || 'Erro ao realizar login' 
    };
  }
};

// Função para verificar se o usuário está autenticado
export const isAuthenticated = () => {
  return !!getAuthToken();
};

// Função para realizar logout
export const logout = () => {
  localStorage.removeItem('authToken');
  window.location.href = '/login';
};

export default api;
