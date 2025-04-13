import { create } from 'zustand';
import { TimerStatus, TimerSession, StudyTimeHistory } from '../types';
import { timerApi } from '../api/timerApi_fixed'; // Import the fixed API

interface TimerStore {
  recentSessions: TimerSession[];
  studyHistory: StudyTimeHistory | null;
  isLoading: boolean;
  error: string | null;
  
  startTimer: () => Promise<TimerSession | null>;
  stopTimer: () => Promise<TimerSession | null>;
  fetchStudyHistory: (startDate?: Date, endDate?: Date) => Promise<StudyTimeHistory | null>;
  fetchRecentSessions: () => Promise<TimerSession[] | null>;
  resetError: () => void;
}

const useTimerStore = create<TimerStore>((set) => ({
  recentSessions: [],
  studyHistory: null,
  isLoading: false,
  error: null,
  
  startTimer: async () => {
    set({ isLoading: true, error: null });
    try {
      const session = await timerApi.startTimer();
      set({ isLoading: false });
      
      // Return the session data for the hook to use
      return session;
    } catch (error) {
      console.error('타이머 시작 실패:', error);
      set({ 
        error: '타이머 시작에 실패했습니다. 다시 시도해주세요.', 
        isLoading: false 
      });
      return null;
    }
  },
  
  stopTimer: async () => {
    set({ isLoading: true, error: null });
    try {
      const session = await timerApi.stopTimer();
      
      // Update the recent sessions list
      set(state => ({
        isLoading: false,
        recentSessions: session ? [session, ...state.recentSessions.slice(0, 4)] : state.recentSessions
      }));
      
      // Return the session data for the hook to use
      return session;
    } catch (error) {
      console.error('타이머 종료 실패:', error);
      set({ 
        error: '타이머 종료에 실패했습니다. 다시 시도해주세요.', 
        isLoading: false 
      });
      return null;
    }
  },
  
  fetchStudyHistory: async (startDate, endDate) => {
    set({ isLoading: true, error: null });
    try {
      const studyHistory = await timerApi.getStudyTimeHistory(startDate, endDate);
      set({ studyHistory, isLoading: false });
      return studyHistory;
    } catch (error) {
      console.error('학습 기록 조회 실패:', error);
      set({ 
        error: '학습 기록 조회에 실패했습니다.', 
        isLoading: false 
      });
      return null;
    }
  },
  
  fetchRecentSessions: async () => {
    set({ isLoading: true, error: null });
    try {
      const recentSessions = await timerApi.getRecentSessions();
      set({ recentSessions, isLoading: false });
      return recentSessions;
    } catch (error) {
      console.error('최근 세션 조회 실패:', error);
      
      // If error is 403 or 401, don't show error to user (they may not be logged in yet)
      // This prevents showing error messages on initial load when not authenticated
      if (error.response && (error.response.status === 403 || error.response.status === 401)) {
        set({ 
          isLoading: false,
          recentSessions: [] // Set empty array to avoid undefined errors
        });
      } else {
        set({ 
          error: '최근 세션 조회에 실패했습니다.', 
          isLoading: false,
          recentSessions: [] // Set empty array to avoid undefined errors
        });
      }
      return [];
    }
  },
  
  resetError: () => {
    set({ error: null });
  }
}));

export default useTimerStore;