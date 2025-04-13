import { create } from 'zustand';
import { TimerStatus, TimerSession, StudyTimeHistory } from '../types';
import { timerApi } from '../api/timerApi';

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
      return session;
    } catch (error: any) {
      console.error('타이머 시작 실패:', error);
      
      // 네트워크 오류인 경우 더 명확한 메시지
      const errorMessage = !navigator.onLine 
        ? '인터넷 연결이 끊겼습니다. 타이머는 계속 작동하며, 연결이 복구되면 자동으로 동기화됩니다.'
        : error.response?.status === 404
          ? 'API 경로를 찾을 수 없습니다. 서버 설정을 확인해주세요.' 
          : error.response?.status === 401 || error.response?.status === 403
            ? '인증이 필요합니다. 다시 로그인해주세요.'
            : '타이머 시작에 실패했습니다. 다시 시도해주세요.';
      
      set({ 
        error: errorMessage, 
        isLoading: false 
      });
      return null;
    }
  },
  
  stopTimer: async () => {
    set({ isLoading: true, error: null });
    try {
      const session = await timerApi.stopTimer();
      
      // 타이머 중지 후 최근 세션 업데이트
      if (session) {
        set(state => ({
          recentSessions: [session, ...state.recentSessions.slice(0, 4)],
          isLoading: false
        }));
      } else {
        set({ isLoading: false });
      }
      
      return session;
    } catch (error: any) {
      console.error('타이머 종료 실패:', error);
      
      // 네트워크 오류인 경우 더 명확한 메시지
      const errorMessage = !navigator.onLine 
        ? '인터넷 연결이 끊겼습니다. 타이머는 정지되었지만 서버와 동기화되지 않았습니다. 연결이 복구되면 다시 시도해주세요.'
        : error.response?.status === 404
          ? 'API 경로를 찾을 수 없습니다. 서버 설정을 확인해주세요.' 
          : error.response?.status === 401 || error.response?.status === 403
            ? '인증이 필요합니다. 다시 로그인해주세요.'
            : '타이머 종료에 실패했습니다. 다시 시도해주세요.';
      
      set({ 
        error: errorMessage, 
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
    } catch (error: any) {
      console.error('학습 기록 조회 실패:', error);
      
      // 인증 관련 오류면 로그인 페이지로 리디렉션하지 않고 오류 메시지만 표시
      // (apiClient 인터셉터에서 401 처리를 하지만 추가적인 UX 향상)
      if (error.response?.status === 401 || error.response?.status === 403) {
        set({ 
          error: '인증이 필요합니다. 다시 로그인해주세요.',
          isLoading: false,
          studyHistory: { records: [] } // 빈 배열로 초기화하여 렌더링 오류 방지
        });
      } else {
        set({ 
          error: '학습 기록 조회에 실패했습니다.',
          isLoading: false,
          studyHistory: { records: [] } 
        });
      }
      
      return null;
    }
  },
  
  fetchRecentSessions: async () => {
    set({ isLoading: true, error: null });
    try {
      const recentSessions = await timerApi.getRecentSessions();
      set({ recentSessions, isLoading: false });
      return recentSessions;
    } catch (error: any) {
      console.error('최근 세션 조회 실패:', error);
      
      // 인증 오류면 사용자 경험 향상을 위해 조용히 실패
      if (error.response?.status === 401 || error.response?.status === 403) {
        // 401/403 오류는 로그인이 필요한 상황이므로 조용히 빈 배열 반환
        set({ 
          isLoading: false,
          recentSessions: [] // 빈 배열로 설정하여 렌더링 오류 방지
        });
      } else {
        set({ 
          error: '최근 세션 조회에 실패했습니다.',
          isLoading: false,
          recentSessions: [] 
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