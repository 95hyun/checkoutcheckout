import apiClient from './apiClient';
import { LoginRequest, SignupRequest, TokenResponse } from '../types';

export const authApi = {
  login: async (loginRequest: LoginRequest): Promise<TokenResponse> => {
    try {
      const response = await apiClient.post<TokenResponse>('/auth/login', loginRequest);
      return response.data;
    } catch (error) {
      console.error('Login API error:', error);
      throw error;
    }
  },
  
  signup: async (signupRequest: SignupRequest): Promise<void> => {
    try {
      console.log('Sending signup request to API:', signupRequest);
      await apiClient.post('/auth/signup', signupRequest);
    } catch (error) {
      console.error('Signup API error:', error);
      throw error;
    }
  },
};