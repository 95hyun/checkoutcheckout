import { create } from 'zustand';
import { StudyRanking, StudyMemberRanking } from '../types';
import { rankApi } from '../api/rankApi';

interface StudyRankingState {
  dailyStudyRanking: StudyRanking | null;
  weeklyStudyRanking: StudyRanking | null;
  monthlyStudyRanking: StudyRanking | null;
  studyMemberDailyRanking: StudyMemberRanking | null;
  studyMemberWeeklyRanking: StudyMemberRanking | null;
  studyMemberMonthlyRanking: StudyMemberRanking | null;
  isLoading: boolean;
  error: string | null;
  
  // 스터디별 랭킹 조회
  fetchDailyStudyRanking: (date?: Date) => Promise<void>;
  fetchWeeklyStudyRanking: (startDate: Date, endDate: Date) => Promise<void>;
  fetchMonthlyStudyRanking: (year: number, month: number) => Promise<void>;
  
  // 스터디 내 멤버 랭킹 조회
  fetchStudyMemberDailyRanking: (studyId: number, date?: Date) => Promise<void>;
  fetchStudyMemberWeeklyRanking: (studyId: number, startDate: Date, endDate: Date) => Promise<void>;
  fetchStudyMemberMonthlyRanking: (studyId: number, year: number, month: number) => Promise<void>;
  
  // 상태 초기화
  resetError: () => void;
  resetRankings: () => void;
}

export const useStudyRankingStore = create<StudyRankingState>((set) => ({
  dailyStudyRanking: null,
  weeklyStudyRanking: null,
  monthlyStudyRanking: null,
  studyMemberDailyRanking: null,
  studyMemberWeeklyRanking: null,
  studyMemberMonthlyRanking: null,
  isLoading: false,
  error: null,
  
  // 스터디별 랭킹 조회
  fetchDailyStudyRanking: async (date) => {
    set({ isLoading: true, error: null });
    try {
      const response = await rankApi.getDailyStudyRanking(date);
      set({ dailyStudyRanking: response.data, isLoading: false });
    } catch (error) {
      console.error('일일 스터디 랭킹 조회 에러:', error);
      set({ 
        error: error.response?.data?.message || '일일 스터디 랭킹을 불러오는데 실패했습니다.', 
        isLoading: false 
      });
    }
  },
  
  fetchWeeklyStudyRanking: async (startDate, endDate) => {
    set({ isLoading: true, error: null });
    try {
      const response = await rankApi.getWeeklyStudyRanking(startDate, endDate);
      set({ weeklyStudyRanking: response.data, isLoading: false });
    } catch (error) {
      console.error('주간 스터디 랭킹 조회 에러:', error);
      set({ 
        error: error.response?.data?.message || '주간 스터디 랭킹을 불러오는데 실패했습니다.', 
        isLoading: false 
      });
    }
  },
  
  fetchMonthlyStudyRanking: async (year, month) => {
    set({ isLoading: true, error: null });
    try {
      const response = await rankApi.getMonthlyStudyRanking(year, month);
      set({ monthlyStudyRanking: response.data, isLoading: false });
    } catch (error) {
      console.error('월간 스터디 랭킹 조회 에러:', error);
      set({ 
        error: error.response?.data?.message || '월간 스터디 랭킹을 불러오는데 실패했습니다.', 
        isLoading: false 
      });
    }
  },
  
  // 스터디 내 멤버 랭킹 조회
  fetchStudyMemberDailyRanking: async (studyId, date) => {
    set({ isLoading: true, error: null });
    try {
      const response = await rankApi.getStudyMemberDailyRanking(studyId, date);
      set({ studyMemberDailyRanking: response.data, isLoading: false });
    } catch (error) {
      console.error('일일 스터디 멤버 랭킹 조회 에러:', error);
      set({ 
        error: error.response?.data?.message || '일일 스터디 멤버 랭킹을 불러오는데 실패했습니다.', 
        isLoading: false 
      });
    }
  },
  
  fetchStudyMemberWeeklyRanking: async (studyId, startDate, endDate) => {
    set({ isLoading: true, error: null });
    try {
      const response = await rankApi.getStudyMemberWeeklyRanking(studyId, startDate, endDate);
      set({ studyMemberWeeklyRanking: response.data, isLoading: false });
    } catch (error) {
      console.error('주간 스터디 멤버 랭킹 조회 에러:', error);
      set({ 
        error: error.response?.data?.message || '주간 스터디 멤버 랭킹을 불러오는데 실패했습니다.', 
        isLoading: false 
      });
    }
  },
  
  fetchStudyMemberMonthlyRanking: async (studyId, year, month) => {
    set({ isLoading: true, error: null });
    try {
      const response = await rankApi.getStudyMemberMonthlyRanking(studyId, year, month);
      set({ studyMemberMonthlyRanking: response.data, isLoading: false });
    } catch (error) {
      console.error('월간 스터디 멤버 랭킹 조회 에러:', error);
      set({ 
        error: error.response?.data?.message || '월간 스터디 멤버 랭킹을 불러오는데 실패했습니다.', 
        isLoading: false 
      });
    }
  },
  
  // 상태 초기화
  resetError: () => set({ error: null }),
  resetRankings: () => set({
    dailyStudyRanking: null,
    weeklyStudyRanking: null,
    monthlyStudyRanking: null,
    studyMemberDailyRanking: null,
    studyMemberWeeklyRanking: null,
    studyMemberMonthlyRanking: null
  })
}));

export default useStudyRankingStore;