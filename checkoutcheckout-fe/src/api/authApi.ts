import apiClient from './apiClient';
import { LoginRequest, SignupRequest, TokenResponse, User } from '../types';

export const authApi = {
  login: async (loginRequest: LoginRequest): Promise<TokenResponse> => {
    const response = await apiClient.post<TokenResponse>('/auth/login', loginRequest);
    return response.data;
  },
  
  signup: async (signupRequest: SignupRequest): Promise<void> => {
    await apiClient.post('/auth/signup', signupRequest);
  },
  
  getCurrentUser: async (): Promise<User> => {
    try {
      const response = await apiClient.get<User>('/auth/me');
      return response.data;
    } catch (error) {
      console.warn('Failed to fetch user from backend. Using local storage fallback.');
      
      // 토큰이 있는 경우 로컬 스토리지에서 최소한의 사용자 정보 생성
      const token = localStorage.getItem('token');
      if (!token) {
        throw error; // 토큰이 없으면 원래 에러를 반환
      }
      
      // 토큰이 있으면 기본 사용자 정보를 반환
      // 실제 사용자 정보는 아니지만, UI 표시용으로 사용 가능
      return {
        id: 0,
        email: 'user@example.com',
        nickname: '사용자',
      };
    }
  },
};