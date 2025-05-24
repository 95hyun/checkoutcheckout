import { create } from 'zustand';
import { AuthState, LoginRequest, SignupRequest, User } from '../types';
import { authApi } from '../api/authApi';

interface AuthStore extends AuthState {
  login: (credentials: LoginRequest) => Promise<void>;
  signup: (userData: SignupRequest) => Promise<void>;
  logout: () => void;
  setUser: (user: User) => void;
  setCharacterAsProfile: (characterType: string) => Promise<void>;
  removeProfileImage: () => Promise<void>;
}

const useAuthStore = create<AuthStore>((set) => ({
  isAuthenticated: !!localStorage.getItem('token'),
  user: null,
  token: localStorage.getItem('token'),
  
  login: async (credentials) => {
    try {
      const response = await authApi.login(credentials);
      localStorage.setItem('token', response.accessToken);
      set({ 
        isAuthenticated: true, 
        token: response.accessToken 
      });
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  },
  
  signup: async (userData) => {
    try {
      await authApi.signup(userData);
    } catch (error) {
      console.error('Signup failed:', error);
      throw error;
    }
  },
  
  logout: () => {
    localStorage.removeItem('token');
    set({ 
      isAuthenticated: false, 
      token: null, 
      user: null 
    });
  },
  
  setUser: (user) => {
    set({ user });
  },

  setCharacterAsProfile: async (characterType) => {
    try {
      const updatedUser = await authApi.setCharacterAsProfile(characterType);
      set({ user: updatedUser });
    } catch (error) {
      console.error('Setting character as profile failed:', error);
      throw error;
    }
  },

  removeProfileImage: async () => {
    try {
      const updatedUser = await authApi.removeProfileImage();
      set({ user: updatedUser });
    } catch (error) {
      console.error('Removing profile image failed:', error);
      throw error;
    }
  }
}));

export default useAuthStore;