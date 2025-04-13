import apiClient from './apiClient';
import { LoginRequest, SignupRequest, TokenResponse } from '../types';

export const authApi = {
  login: async (loginRequest: LoginRequest): Promise<TokenResponse> => {
    const response = await apiClient.post<TokenResponse>('/auth/login', loginRequest);
    return response.data;
  },
  
  signup: async (signupRequest: SignupRequest): Promise<void> => {
    await apiClient.post('/auth/signup', signupRequest);
  },
};