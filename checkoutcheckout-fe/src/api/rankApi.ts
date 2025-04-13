import apiClient from './apiClient';
import { DailyRanking } from '../types';
import { format } from 'date-fns';

export const rankApi = {
  getDailyRanking: async (date?: Date): Promise<DailyRanking> => {
    const params: Record<string, string> = {};
    
    if (date) {
      params.date = format(date, 'yyyy-MM-dd');
    }
    
    const response = await apiClient.get<DailyRanking>('/rank/daily', { params });
    return response.data;
  },
};