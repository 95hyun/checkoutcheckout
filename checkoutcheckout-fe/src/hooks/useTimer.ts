import { useState, useEffect, useCallback, useRef } from 'react';
import useTimerStore from '../store/timerStore';

// 로컬 스토리지 키 상수
const TIMER_START_KEY = 'timer_start_timestamp';
const TIMER_ACTIVE_KEY = 'timer_is_active';
const TIMER_SESSION_ID_KEY = 'timer_session_id';
const TIMER_ELAPSED_SECONDS_KEY = 'timer_elapsed_seconds';

export const useTimer = () => {
  const { startTimer: startTimerApi, stopTimer: stopTimerApi, isLoading, error, resetError } = useTimerStore();
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [isActive, setIsActive] = useState<boolean>(false);
  const intervalIdRef = useRef<number | null>(null);
  
  // Using useRef to prevent unnecessary re-renders and update loops
  const updatingTimerRef = useRef<boolean>(false);

  // 로컬 스토리지 초기화/정리 함수
  const clearLocalTimerData = useCallback(() => {
    localStorage.removeItem(TIMER_START_KEY);
    localStorage.removeItem(TIMER_ACTIVE_KEY);
    localStorage.removeItem(TIMER_SESSION_ID_KEY);
    localStorage.removeItem(TIMER_ELAPSED_SECONDS_KEY);
  }, []);

  // 타이머 인터벌 정리 함수
  const clearTimerInterval = useCallback(() => {
    if (intervalIdRef.current) {
      window.clearInterval(intervalIdRef.current);
      intervalIdRef.current = null;
    }
  }, []);

  // 브라우저 세션에서 타이머 상태 초기화 - 컴포넌트 마운트 시 한 번만 실행
  useEffect(() => {
    // Prevent update loops by checking the ref
    if (updatingTimerRef.current) return;
    
    const isTimerActive = localStorage.getItem(TIMER_ACTIVE_KEY) === 'true';
    const startTimestamp = localStorage.getItem(TIMER_START_KEY);
    
    if (isTimerActive && startTimestamp) {
      try {
        updatingTimerRef.current = true;
        
        const startTime = parseInt(startTimestamp, 10);
        const now = Date.now();
        
        // 시작 시간이 미래이거나 너무 오래된 경우(24시간 이상) 무시
        if (startTime > now || now - startTime > 24 * 60 * 60 * 1000) {
          console.warn('잘못된 타이머 시작 시간이 감지되었습니다. 타이머를 초기화합니다.');
          clearLocalTimerData();
          updatingTimerRef.current = false;
          return;
        }
        
        // 경과 시간 계산 (초 단위)
        const diffSeconds = Math.floor((now - startTime) / 1000);
        setElapsedTime(diffSeconds);
        setIsActive(true);
        
        // 1초마다 타이머 업데이트
        if (intervalIdRef.current) {
          clearTimerInterval();
        }
        
        intervalIdRef.current = window.setInterval(() => {
          setElapsedTime(prev => prev + 1);
        }, 1000);
        
        console.log('브라우저 세션에서 타이머가 복원되었습니다:', diffSeconds, '초');
        updatingTimerRef.current = false;
      } catch (error) {
        console.error('타이머 초기화 오류:', error);
        clearLocalTimerData();
        updatingTimerRef.current = false;
      }
    }
    
    // 컴포넌트 언마운트 시 인터벌 정리
    return () => {
      clearTimerInterval();
    };
  }, [clearLocalTimerData, clearTimerInterval]);

  // 시작하기 버튼 핸들러
  const handleStartTimer = useCallback(async () => {
    if (isActive || updatingTimerRef.current) return; // 이미 활성화된 상태이거나 업데이트 중이면 중복 시작 방지
    
    try {
      updatingTimerRef.current = true;
      
      // 로컬 타이머 시작
      setElapsedTime(0);
      setIsActive(true);
      
      // 현재 시간 저장
      const startTime = Date.now();
      localStorage.setItem(TIMER_START_KEY, startTime.toString());
      localStorage.setItem(TIMER_ACTIVE_KEY, 'true');
      localStorage.setItem(TIMER_ELAPSED_SECONDS_KEY, '0');
      
      // 이전 인터벌 정리 후 새 인터벌 시작
      clearTimerInterval();
      intervalIdRef.current = window.setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);
      
      // 백엔드에 타이머 시작 요청 (비동기적으로 처리)
      const response = await startTimerApi();
      
      // 세션 ID 저장 (타이머 종료 시 필요)
      if (response && response.id) {
        localStorage.setItem(TIMER_SESSION_ID_KEY, response.id.toString());
      }
      
      console.log('타이머가 시작되었습니다:', startTime);
      updatingTimerRef.current = false;
    } catch (error) {
      console.error('타이머 시작 오류:', error);
      // 에러 발생 시 로컬 타이머는 계속 유지 (네트워크 오류 등에 대응)
      updatingTimerRef.current = false;
    }
  }, [isActive, clearTimerInterval, startTimerApi]);

  // 종료하기 버튼 핸들러
  const handleStopTimer = useCallback(async () => {
    if (!isActive || updatingTimerRef.current) return; // 활성화되지 않은 상태이거나 업데이트 중이면 무시
    
    try {
      updatingTimerRef.current = true;
      
      // 현재 경과 시간 저장
      const currentElapsedTime = elapsedTime;
      
      // 타이머 상태 업데이트
      setIsActive(false);
      clearTimerInterval();
      
      // 로컬 스토리지 정리
      clearLocalTimerData();
      
      // 백엔드에 타이머 종료 요청
      await stopTimerApi();
      
      console.log('타이머가 종료되었습니다. 총 경과 시간:', currentElapsedTime, '초');
      updatingTimerRef.current = false;
    } catch (error) {
      console.error('타이머 종료 오류:', error);
      
      // 오류 발생 시에도 일단 UI에서는 정지 상태로 표시
      // 하지만 로컬 데이터는 제거하여 새로 시작할 수 있도록 함
      setIsActive(false);
      clearTimerInterval();
      clearLocalTimerData();
      updatingTimerRef.current = false;
    }
  }, [isActive, elapsedTime, stopTimerApi, clearTimerInterval, clearLocalTimerData]);

  // 브라우저 탭/창이 닫힐 때 현재 경과 시간 저장 (복원 시 사용)
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (isActive) {
        localStorage.setItem(TIMER_ELAPSED_SECONDS_KEY, elapsedTime.toString());
      }
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [isActive, elapsedTime]);

  // 시간 형식 변환 (초 -> 00:00:00)
  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    return [
      hours.toString().padStart(2, '0'),
      minutes.toString().padStart(2, '0'),
      remainingSeconds.toString().padStart(2, '0')
    ].join(':');
  };

  return {
    isActive,
    elapsedTime,
    formattedTime: formatTime(elapsedTime),
    startTimer: handleStartTimer,
    stopTimer: handleStopTimer,
    isLoading,
    error,
    resetError
  };
};