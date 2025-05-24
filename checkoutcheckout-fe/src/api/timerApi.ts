import apiClient from './apiClient';
import { TimerStatus, TimerSession, StudyTimeHistory } from '../types';

// API 엔드포인트 상수
const ENDPOINTS = {
  START: '/api/timer/start',
  STOP: '/api/timer/stop',
  STATUS: '/api/timer/status',
  HISTORY: '/api/timer/history',
  RECENT: '/api/timer/recent'
} as const;

// 오프라인 모드에서 사용할 로컬 스토리지 키
const STORAGE_KEYS = {
  PENDING_START: 'pendingTimerStart',
  PENDING_STOP: 'pendingTimerStop',
  LAST_SYNC: 'lastTimerSync'
} as const;

// 오프라인 모드에서 사용할 로컬 스토리지 관리 함수들
const storage = {
  get: (key: string) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error('로컬 스토리지 읽기 실패:', error);
      return null;
    }
  },
  
  set: (key: string, value: any) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error('로컬 스토리지 쓰기 실패:', error);
      return false;
    }
  },
  
  remove: (key: string) => {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error('로컬 스토리지 삭제 실패:', error);
      return false;
    }
  }
};

// 오프라인 모드에서 사용할 대기 중인 작업 관리 함수들
const pendingOperations = {
  addStart: (timestamp: number) => {
    const pending = storage.get(STORAGE_KEYS.PENDING_START) || [];
    pending.push(timestamp);
    storage.set(STORAGE_KEYS.PENDING_START, pending);
  },
  
  addStop: (timestamp: number) => {
    const pending = storage.get(STORAGE_KEYS.PENDING_STOP) || [];
    pending.push(timestamp);
    storage.set(STORAGE_KEYS.PENDING_STOP, pending);
  },
  
  getStart: () => storage.get(STORAGE_KEYS.PENDING_START) || [],
  
  getStop: () => storage.get(STORAGE_KEYS.PENDING_STOP) || [],
  
  clearStart: () => storage.remove(STORAGE_KEYS.PENDING_START),
  
  clearStop: () => storage.remove(STORAGE_KEYS.PENDING_STOP)
};

// 네트워크 상태 확인 함수
const isOnline = () => navigator.onLine;

// 오프라인 모드에서 사용할 대체 응답 생성 함수
const createOfflineResponse = (operation: 'start' | 'stop'): TimerSession => ({
  id: `offline-${Date.now()}`,
  startTime: new Date().toISOString(),
  endTime: operation === 'stop' ? new Date().toISOString() : null,
  duration: 0,
  status: operation === 'start' ? 'RUNNING' : 'STOPPED'
});

// API 호출 함수들
export const timerApi = {
  startTimer: async (): Promise<TimerSession> => {
    const timestamp = Date.now();
    
    try {
      if (!isOnline()) {
        console.log('오프라인 모드: 타이머 시작을 로컬에 저장');
        pendingOperations.addStart(timestamp);
        return createOfflineResponse('start');
      }
      
      const response = await apiClient.post<TimerSession>(ENDPOINTS.START);
      storage.set(STORAGE_KEYS.LAST_SYNC, timestamp);
      return response.data;
    } catch (error) {
      console.error('타이머 시작 API 호출 실패:', error);
      
      // 네트워크 오류인 경우 오프라인 모드로 전환
      if (!isOnline()) {
        console.log('네트워크 오류: 타이머 시작을 로컬에 저장');
        pendingOperations.addStart(timestamp);
        return createOfflineResponse('start');
      }
      
      throw error;
    }
  },
  
  stopTimer: async (): Promise<TimerSession> => {
    const timestamp = Date.now();
    
    try {
      if (!isOnline()) {
        console.log('오프라인 모드: 타이머 종료를 로컬에 저장');
        pendingOperations.addStop(timestamp);
        return createOfflineResponse('stop');
      }
      
      const response = await apiClient.post<TimerSession>(ENDPOINTS.STOP);
      storage.set(STORAGE_KEYS.LAST_SYNC, timestamp);
      return response.data;
    } catch (error) {
      console.error('타이머 종료 API 호출 실패:', error);
      
      // 네트워크 오류인 경우 오프라인 모드로 전환
      if (!isOnline()) {
        console.log('네트워크 오류: 타이머 종료를 로컬에 저장');
        pendingOperations.addStop(timestamp);
        return createOfflineResponse('stop');
      }
      
      throw error;
    }
  },
  
  getTimerStatus: async (): Promise<TimerStatus> => {
    try {
      const response = await apiClient.get<TimerStatus>(ENDPOINTS.STATUS);
      return response.data;
    } catch (error) {
      console.error('타이머 상태 조회 실패:', error);
      throw error;
    }
  },
  
  getStudyTimeHistory: async (startDate: string, endDate: string): Promise<StudyTimeHistory> => {
    try {
      if (!navigator.onLine) {
        console.log('오프라인 모드: 캐시된 학습 기록을 사용합니다.');
        const cachedHistory = localStorage.getItem('studyTimeHistory');
        if (cachedHistory) {
          return JSON.parse(cachedHistory);
        }
        return { records: [] };
      }

      // ISO 문자열을 YYYY-MM-DD 형식으로 변환
      const formatDate = (dateStr: string) => {
        return new Date(dateStr).toISOString().split('T')[0];
      };

      const response = await apiClient.get(ENDPOINTS.HISTORY, {
        params: {
          startDate: formatDate(startDate),
          endDate: formatDate(endDate)
        }
      });

      if (response.data?.data) {
        const history = response.data.data;
        localStorage.setItem('studyTimeHistory', JSON.stringify(history));
        return history;
      }
      return { records: [] };
    } catch (error) {
      console.error('학습 기록 조회 실패:', error);
      if (error instanceof Error) {
        if (error.message.includes('Network Error')) {
          const cachedHistory = localStorage.getItem('studyTimeHistory');
          if (cachedHistory) {
            console.log('네트워크 오류: 캐시된 학습 기록을 사용합니다.');
            return JSON.parse(cachedHistory);
          }
        }
      }
      return { records: [] };
    }
  },
  
  getRecentSessions: async (): Promise<TimerSession[]> => {
    try {
      const response = await apiClient.get<TimerSession[]>(ENDPOINTS.RECENT);
      return response.data;
    } catch (error) {
      console.error('최근 세션 조회 실패:', error);
      throw error;
    }
  },
  
  // 오프라인 모드에서 저장된 작업들을 서버와 동기화하는 함수
  syncPendingOperations: async (): Promise<void> => {
    if (!isOnline()) {
      console.log('오프라인 상태: 동기화 건너뜀');
      return;
    }
    
    try {
      const pendingStarts = pendingOperations.getStart();
      const pendingStops = pendingOperations.getStop();
      
      // 시작 작업 동기화
      for (const timestamp of pendingStarts) {
        try {
          await apiClient.post(ENDPOINTS.START, { timestamp });
        } catch (error) {
          console.error('시작 작업 동기화 실패:', error);
        }
      }
      
      // 종료 작업 동기화
      for (const timestamp of pendingStops) {
        try {
          await apiClient.post(ENDPOINTS.STOP, { timestamp });
        } catch (error) {
          console.error('종료 작업 동기화 실패:', error);
        }
      }
      
      // 동기화 완료 후 로컬 스토리지 정리
      pendingOperations.clearStart();
      pendingOperations.clearStop();
      storage.set(STORAGE_KEYS.LAST_SYNC, Date.now());
      
      console.log('오프라인 작업 동기화 완료');
    } catch (error) {
      console.error('오프라인 작업 동기화 실패:', error);
      throw error;
    }
  }
};