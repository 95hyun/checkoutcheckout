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
  
  // 스터디별 일일 랭킹
  getDailyStudyRanking: async (date?: Date) => {
    const params: Record<string, string> = {};
    
    if (date) {
      params.date = format(date, 'yyyy-MM-dd');
    }
    
    const response = await apiClient.get('/rank/studies/daily', { params });
    return response.data;
  },
  
  // 스터디별 주간 랭킹
  getWeeklyStudyRanking: async (startDate: Date, endDate: Date) => {
    const params = {
      startDate: format(startDate, 'yyyy-MM-dd'),
      endDate: format(endDate, 'yyyy-MM-dd')
    };
    
    const response = await apiClient.get('/rank/studies/weekly', { params });
    return response.data;
  },
  
  // 스터디별 월간 랭킹
  getMonthlyStudyRanking: async (year: number, month: number) => {
    const params = { year, month };
    
    const response = await apiClient.get('/rank/studies/monthly', { params });
    return response.data;
  },
  
  // 스터디 내 일일 랭킹
  getStudyMemberDailyRanking: async (studyId: number, date?: Date) => {
    const params: Record<string, string | number> = { 
      studyId
    };
    
    if (date) {
      params.date = format(date, 'yyyy-MM-dd');
    }
    
    const response = await apiClient.get(`/rank/studies/${studyId}/daily`, { params });
    return response.data;
  },
  
  // 스터디 내 주간 랭킹
  getStudyMemberWeeklyRanking: async (studyId: number, startDate: Date, endDate: Date) => {
    const params = {
      startDate: format(startDate, 'yyyy-MM-dd'),
      endDate: format(endDate, 'yyyy-MM-dd')
    };
    
    const response = await apiClient.get(`/rank/studies/${studyId}/weekly`, { params });
    return response.data;
  },
  
  // 스터디 내 월간 랭킹
  getStudyMemberMonthlyRanking: async (studyId: number, year: number, month: number) => {
    const params = { year, month };
    
    const response = await apiClient.get(`/rank/studies/${studyId}/monthly`, { params });
    return response.data;
  },
};