import apiClient from './apiClient';
import { TimerSession, TimerStatus, StudyTimeHistory } from '../types';
import { format } from 'date-fns';

export const timerApi = {
  startTimer: async (): Promise<TimerSession> => {
    try {
      // '/api' 접두사 제거 - apiClient에 이미 포함되어 있음
      const response = await apiClient.post<TimerSession>('/timer/start');
      console.log('타이머 시작 성공:', response.data);
      return response.data;
    } catch (error) {
      console.error('API 오류 - 타이머 시작:', error);
      throw error;
    }
  },
  
  stopTimer: async (): Promise<TimerSession> => {
    try {
      // '/api' 접두사 제거
      const response = await apiClient.post<TimerSession>('/timer/stop');
      console.log('타이머 종료 성공:', response.data);
      return response.data;
    } catch (error) {
      console.error('API 오류 - 타이머 종료:', error);
      throw error;
    }
  },
  
  getTimerStatus: async (): Promise<TimerStatus> => {
    try {
      // '/api' 접두사 제거
      const response = await apiClient.get<TimerStatus>('/timer/status');
      return response.data;
    } catch (error) {
      console.error('API 오류 - 타이머 상태 조회:', error);
      throw error;
    }
  },
  
  getStudyTimeHistory: async (startDate?: Date, endDate?: Date): Promise<StudyTimeHistory> => {
    try {
      const params: Record<string, string> = {};
      
      if (startDate) {
        params.startDate = format(startDate, 'yyyy-MM-dd');
      }
      
      if (endDate) {
        params.endDate = format(endDate, 'yyyy-MM-dd');
      }
      
      // '/api' 접두사 제거
      const response = await apiClient.get<StudyTimeHistory>('/timer/history', { params });
      return response.data;
    } catch (error) {
      console.error('API 오류 - 학습 기록 조회:', error);
      throw error;
    }
  },
  
  getRecentSessions: async (): Promise<TimerSession[]> => {
    try {
      // '/api' 접두사 제거
      const response = await apiClient.get<TimerSession[]>('/timer/recent');
      return response.data;
    } catch (error) {
      console.error('API 오류 - 최근 세션 조회:', error);
      throw error;
    }
  },
};