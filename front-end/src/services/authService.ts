import api, { setToken, setRefreshToken, clearTokens } from './api';
import type { User, LoginCredentials, RegisterCredentials, AuthTokens } from '@/types';

// Mock user data for demo purposes (since we don't have a real backend)
const MOCK_USER: User = {
  id: '1',
  email: 'demo@financeflow.com',
  name: 'Demo User',
  createdAt: new Date().toISOString(),
};

const MOCK_DELAY = 800;

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const authService = {
  async login(credentials: LoginCredentials): Promise<{ user: User; tokens: AuthTokens }> {
    // In production, this would call the API
    // const response = await api.post('/auth/login', credentials);
    // return response.data;

    // Mock implementation for demo
    await delay(MOCK_DELAY);
    
    if (credentials.email && credentials.password) {
      const tokens: AuthTokens = {
        accessToken: 'mock_access_token_' + Date.now(),
        refreshToken: 'mock_refresh_token_' + Date.now(),
      };
      
      setToken(tokens.accessToken);
      if (tokens.refreshToken) {
        setRefreshToken(tokens.refreshToken);
      }
      
      return {
        user: { ...MOCK_USER, email: credentials.email },
        tokens,
      };
    }
    
    throw new Error('Invalid credentials');
  },

  async register(credentials: RegisterCredentials): Promise<{ user: User; tokens: AuthTokens }> {
    // In production, this would call the API
    // const response = await api.post('/auth/register', credentials);
    // return response.data;

    // Mock implementation for demo
    await delay(MOCK_DELAY);
    
    if (credentials.email && credentials.password && credentials.name) {
      const tokens: AuthTokens = {
        accessToken: 'mock_access_token_' + Date.now(),
        refreshToken: 'mock_refresh_token_' + Date.now(),
      };
      
      setToken(tokens.accessToken);
      if (tokens.refreshToken) {
        setRefreshToken(tokens.refreshToken);
      }
      
      return {
        user: {
          ...MOCK_USER,
          email: credentials.email,
          name: credentials.name,
        },
        tokens,
      };
    }
    
    throw new Error('Registration failed');
  },

  async logout(): Promise<void> {
    // In production, this would call the API to invalidate the token
    // await api.post('/auth/logout');
    
    await delay(300);
    clearTokens();
  },

  async getCurrentUser(): Promise<User | null> {
    // In production, this would call the API
    // const response = await api.get('/auth/me');
    // return response.data;

    // Mock implementation - check if token exists
    const token = localStorage.getItem('financeflow_token');
    if (token) {
      await delay(300);
      return MOCK_USER;
    }
    return null;
  },

  async refreshToken(): Promise<AuthTokens> {
    const response = await api.post('/auth/refresh');
    return response.data;
  },
};
