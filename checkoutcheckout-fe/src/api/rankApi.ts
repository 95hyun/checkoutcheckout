import apiClient from './apiClient';
import { DailyRanking, StudyRanking, StudyMemberRanking } from '../types';
import { format } from 'date-fns';

export const rankApi = {
  getDailyRanking: async (date?: Date): Promise<DailyRanking> => {
    const params: Record<string, string> = {};
    
    if (date) {
      params.date = format(date, 'yyyy-MM-dd');
    }
    
    const response = await apiClient.get<{data: DailyRanking}>('/api/ranks/daily', { params });
    return response.data.data;
  },
  
  // 스터디별 일일 랭킹
  getDailyStudyRanking: async (date?: Date): Promise<StudyRanking> => {
    const params: Record<string, string> = {};
    
    if (date) {
      params.date = format(date, 'yyyy-MM-dd');
    }
    
    const response = await apiClient.get<{data: StudyRanking}>('/api/ranks/studies/daily', { params });
    return response.data.data;
  },
  
  // 스터디별 주간 랭킹
  getWeeklyStudyRanking: async (startDate: Date, endDate: Date): Promise<StudyRanking> => {
    const params = {
      startDate: format(startDate, 'yyyy-MM-dd'),
      endDate: format(endDate, 'yyyy-MM-dd')
    };
    
    const response = await apiClient.get<{data: StudyRanking}>('/api/ranks/studies/weekly', { params });
    return response.data.data;
  },
  
  // 스터디별 월간 랭킹
  getMonthlyStudyRanking: async (year: number, month: number): Promise<StudyRanking> => {
    const params = { year, month };
    
    const response = await apiClient.get<{data: StudyRanking}>('/api/ranks/studies/monthly', { params });
    return response.data.data;
  },
  
  // 스터디 내 일일 랭킹
  getStudyMemberDailyRanking: async (studyId: number, date?: Date): Promise<StudyMemberRanking> => {
    const params: Record<string, string | number> = { };
    
    if (date) {
      params.date = format(date, 'yyyy-MM-dd');
    }
    
    const response = await apiClient.get<{data: StudyMemberRanking}>(`/api/ranks/studies/${studyId}/daily`, { params });
    return response.data.data;
  },
  
  // 스터디 내 주간 랭킹
  getStudyMemberWeeklyRanking: async (studyId: number, startDate: Date, endDate: Date): Promise<StudyMemberRanking> => {
    const params = {
      startDate: format(startDate, 'yyyy-MM-dd'),
      endDate: format(endDate, 'yyyy-MM-dd')
    };
    
    const response = await apiClient.get<{data: StudyMemberRanking}>(`/api/ranks/studies/${studyId}/weekly`, { params });
    return response.data.data;
  },
  
  // 스터디 내 월간 랭킹
  getStudyMemberMonthlyRanking: async (studyId: number, year: number, month: number): Promise<StudyMemberRanking> => {
    const params = { year, month };
    
    const response = await apiClient.get<{data: StudyMemberRanking}>(`/api/ranks/studies/${studyId}/monthly`, { params });
    return response.data.data;
  },
};