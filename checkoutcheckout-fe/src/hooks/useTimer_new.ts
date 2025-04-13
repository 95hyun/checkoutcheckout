import { useState, useEffect, useCallback } from 'react';
import useTimerStore from '../store/timerStore';

// 로컬 스토리지 키 상수
const TIMER_START_KEY = 'timer_start_timestamp';
const TIMER_ACTIVE_KEY = 'timer_is_active';
const TIMER_INITIAL_DURATION_KEY = 'timer_initial_duration';

export const useTimer = () => {
  const { status, fetchTimerStatus, startTimer, stopTimer } = useTimerStore();
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [intervalId, setIntervalId] = useState<number | null>(null);
  const isLoading = useTimerStore(state => state.isLoading);
  const error = useTimerStore(state => state.error);

  // 타이머 상태 초기화 (로컬 스토리지 사용)
  const initializeTimerFromLocalStorage = useCallback(() => {
    const isActive = localStorage.getItem(TIMER_ACTIVE_KEY) === 'true';
    
    if (isActive) {
      const startTimestamp = localStorage.getItem(TIMER_START_KEY);
      const initialDuration = localStorage.getItem(TIMER_INITIAL_DURATION_KEY);
      
      if (startTimestamp) {
        const startTime = parseInt(startTimestamp, 10);
        const initialDurationSeconds = initialDuration ? parseInt(initialDuration, 10) : 0;
        
        // 현재 시간과 시작 시간의 차이 계산 (초 단위)
        const now = Date.now();
        const diffSeconds = Math.floor((now - startTime) / 1000);
        
        // 초기 지속 시간 + 경과 시간
        setElapsedTime(initialDurationSeconds + diffSeconds);
        
        // 1초마다 타이머 업데이트
        const id = window.setInterval(() => {
          setElapsedTime(prev => prev + 1);
        }, 1000);
        
        setIntervalId(id);
      }
    }
  }, []);

  // 최초 마운트시 타이머 상태 조회 및 초기화
  useEffect(() => {
    const initializeTimer = async () => {
      try {
        // 서버에서 타이머 상태 가져오기
        await fetchTimerStatus();
        
        // 로컬 스토리지에서 타이머 상태 초기화
        initializeTimerFromLocalStorage();
      } catch (error) {
        console.error('Timer initialization error:', error);
      }
    };
    
    initializeTimer();
    
    // 백그라운드에서 정기적으로 타이머 상태 동기화 (사용자에게 보이지 않게)
    const statusCheckInterval = window.setInterval(() => {
      fetchTimerStatus().catch(err => console.log('Background sync failed:', err));
    }, 30000);
    
    return () => {
      if (intervalId) {
        window.clearInterval(intervalId);
      }
      window.clearInterval(statusCheckInterval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 서버에서 가져온 타이머 상태가 변경될 때 로컬 스토리지 업데이트
  useEffect(() => {
    if (!status) return;
    
    if (status.isActive) {
      // 서버에서 active 상태로 확인되면 로컬 스토리지 업데이트
      const startTimestamp = localStorage.getItem(TIMER_START_KEY);
      
      // 로컬 스토리지에 타이머 정보가 없거나 불일치하는 경우 새로 설정
      if (!startTimestamp || localStorage.getItem(TIMER_ACTIVE_KEY) !== 'true') {
        // 서버에서 받은 현재 지속시간
        const currentDuration = status.currentDuration || 0;
        
        // 현재 시간에서 현재 지속시간을 뺀 값을 시작 시간으로 설정
        const calculatedStartTime = Date.now() - (currentDuration * 1000);
        
        localStorage.setItem(TIMER_START_KEY, calculatedStartTime.toString());
        localStorage.setItem(TIMER_ACTIVE_KEY, 'true');
        localStorage.setItem(TIMER_INITIAL_DURATION_KEY, '0');
        
        // 기존 인터벌이 있으면 정리
        if (intervalId) {
          window.clearInterval(intervalId);
        }
        
        // 타이머 재설정
        setElapsedTime(currentDuration);
        
        // 새 인터벌 시작
        const id = window.setInterval(() => {
          setElapsedTime(prev => prev + 1);
        }, 1000);
        
        setIntervalId(id);
      }
    } else {
      // 서버에서 타이머가 비활성으로 확인되면 로컬 스토리지 정리
      if (localStorage.getItem(TIMER_ACTIVE_KEY) === 'true') {
        localStorage.removeItem(TIMER_START_KEY);
        localStorage.removeItem(TIMER_ACTIVE_KEY);
        localStorage.removeItem(TIMER_INITIAL_DURATION_KEY);
        
        // 인터벌 정리
        if (intervalId) {
          window.clearInterval(intervalId);
          setIntervalId(null);
        }
        
        // 마지막 지속시간 설정
        if (status.currentDuration !== undefined) {
          setElapsedTime(status.currentDuration);
        }
      }
    }
  }, [status, intervalId]);

  const handleStartTimer = useCallback(async () => {
    try {
      // 현재 시간을 로컬 스토리지에 저장
      localStorage.setItem(TIMER_START_KEY, Date.now().toString());
      localStorage.setItem(TIMER_ACTIVE_KEY, 'true');
      localStorage.setItem(TIMER_INITIAL_DURATION_KEY, '0');
      
      // 로컬 타이머 시작
      setElapsedTime(0);
      
      if (intervalId) {
        window.clearInterval(intervalId);
      }
      
      const id = window.setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);
      
      setIntervalId(id);
      
      // 서버에 타이머 시작 요청
      await startTimer();
    } catch (error) {
      console.error('Start timer error:', error);
      // 에러 발생 시 로컬 스토리지 정리
      localStorage.removeItem(TIMER_START_KEY);
      localStorage.removeItem(TIMER_ACTIVE_KEY);
      localStorage.removeItem(TIMER_INITIAL_DURATION_KEY);
      
      if (intervalId) {
        window.clearInterval(intervalId);
        setIntervalId(null);
      }
    }
  }, [startTimer, intervalId]);

  const handleStopTimer = useCallback(async () => {
    try {
      // 현재까지의 경과 시간 저장
      const finalElapsedTime = elapsedTime;
      
      // 로컬 스토리지 정리
      localStorage.removeItem(TIMER_START_KEY);
      localStorage.removeItem(TIMER_ACTIVE_KEY);
      localStorage.removeItem(TIMER_INITIAL_DURATION_KEY);
      
      // 인터벌 정리
      if (intervalId) {
        window.clearInterval(intervalId);
        setIntervalId(null);
      }
      
      // 서버에 타이머 중지 요청
      await stopTimer();
      
      // 마지막 기록된 시간 표시
      setElapsedTime(finalElapsedTime);
    } catch (error) {
      console.error('Stop timer error:', error);
      // 에러 발생 시 타이머 상태 복원을 위해 서버에서 최신 상태 다시 조회
      fetchTimerStatus();
    }
  }, [stopTimer, intervalId, elapsedTime, fetchTimerStatus]);

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

  // 로컬 스토리지 기반으로 활성 상태 확인 (UI 상태 결정용)
  const isLocallyActive = localStorage.getItem(TIMER_ACTIVE_KEY) === 'true';

  return {
    // 로컬 스토리지 값과 서버 값을 모두 고려하여 활성 상태 결정
    isActive: isLocallyActive || status?.isActive || false,
    elapsedTime,
    formattedTime: formatTime(elapsedTime),
    startTimer: handleStartTimer,
    stopTimer: handleStopTimer,
    isLoading,
    error
  };
};