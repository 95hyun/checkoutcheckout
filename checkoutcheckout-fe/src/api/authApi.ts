import apiClient from './apiClient';
import { LoginRequest, SignupRequest, TokenResponse, User } from '../types';

export const authApi = {
  login: async (loginRequest: LoginRequest): Promise<TokenResponse> => {
    const response = await apiClient.post<{data: TokenResponse}>('/api/auth/login', loginRequest);
    return response.data.data;
  },
  
  signup: async (signupRequest: SignupRequest): Promise<void> => {
    await apiClient.post('/api/auth/signup', signupRequest);
  },
  
  getCurrentUser: async (): Promise<User> => {
    try {
      const response = await apiClient.get<{data: User}>('/api/auth/me');
      return response.data.data;
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

  // 캐릭터를 프로필 이미지로 설정
  setCharacterAsProfile: async (characterType: string): Promise<User> => {
    // API 요청 전에 현재 헤더와 데이터 로깅
    console.log('Setting character as profile with data:', { characterType });
    console.log('With headers:', {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    });
    
    try {
      const response = await apiClient.post<{data: User}>('/api/auth/profile/character', {
        characterType
      });
      console.log('Set character as profile response:', response);
      return response.data.data;
    } catch (error) {
      console.error('Set character as profile API error:', error);
      throw error;
    }
  },

  // 프로필 이미지 제거
  removeProfileImage: async (): Promise<User> => {
    const response = await apiClient.delete<{data: User}>('/api/auth/profile/image');
    return response.data.data;
  }
};