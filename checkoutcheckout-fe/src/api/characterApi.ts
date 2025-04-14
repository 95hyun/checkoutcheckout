import apiClient from './apiClient';
import { Character } from '../types';

export const characterApi = {
  // 캐릭터 획득
  acquireCharacter: async (characterType: string): Promise<Character> => {
    const response = await apiClient.post<{data: Character}>('/api/characters/acquire', { characterType });
    return response.data.data;
  },
  
  // 사용자의 모든 캐릭터 가져오기
  getUserCharacters: async (): Promise<Character[]> => {
    const response = await apiClient.get<{data: Character[]}>('/api/characters/user');
    return response.data.data;
  },
  
  // 오늘 캐릭터를 이미 획득했는지 확인
  checkTodayCharacter: async (): Promise<boolean> => {
    const response = await apiClient.get<{data: { hasCharacter: boolean }}>('/api/characters/today');
    return response.data.data.hasCharacter;
  },
  
  // 오늘 획득한 캐릭터 가져오기
  getTodayCharacter: async (): Promise<Character | null> => {
    try {
      const response = await apiClient.get<{data: Character}>('/api/characters/today/detail');
      return response.data.data;
    } catch (error) {
      if (error.response && error.response.status === 204) {
        return null;
      }
      throw error;
    }
  },
};
