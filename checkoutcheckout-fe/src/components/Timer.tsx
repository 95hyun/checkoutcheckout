import React, { useEffect } from 'react';
import { useTimer } from '../hooks/useTimer';
import { FaPlay, FaStop } from 'react-icons/fa';
import Loading from './Loading';
import ErrorMessage from './ErrorMessage';

const Timer: React.FC = () => {
  const { 
    isActive = false, 
    formattedTime = '00:00:00', 
    startTimer, 
    stopTimer, 
    isLoading = false, 
    error, 
    resetError 
  } = useTimer();
  
  // 에러 메시지를 5초 후에 자동으로 지우기
  useEffect(() => {
    if (error && resetError) {
      const timer = setTimeout(() => {
        resetError();
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [error, resetError]);
  
  const handleStartTimer = async () => {
    if (!isActive && !isLoading && startTimer) {
      await startTimer();
    }
  };
  
  const handleStopTimer = async () => {
    if (isActive && !isLoading && stopTimer) {
      await stopTimer();
    }
  };
  
  return (
    <div className="card flex flex-col items-center p-8 shadow-lg rounded-lg bg-white">
      <h2 className="text-2xl font-bold mb-6">공부 타이머</h2>
      
      {error && <ErrorMessage message={error} className="mb-4" />}
      
      <div className="text-6xl font-mono mb-8 select-none font-bold">
        {formattedTime}
      </div>
      
      <div className="flex space-x-4">
        {isLoading ? (
          <div className="flex items-center justify-center w-32 h-12">
            <Loading size="md" />
          </div>
        ) : !isActive ? (
          <button
            onClick={handleStartTimer}
            disabled={isLoading}
            className="btn-primary flex items-center px-6 py-3 rounded-lg transition-all duration-300 hover:shadow-lg disabled:opacity-50"
            aria-label="타이머 시작"
          >
            <FaPlay className="mr-2" /> 시작하기
          </button>
        ) : (
          <button
            onClick={handleStopTimer}
            disabled={isLoading}
            className="btn bg-error text-white hover:bg-red-600 flex items-center px-6 py-3 rounded-lg transition-all duration-300 hover:shadow-lg disabled:opacity-50"
            aria-label="타이머 중지"
          >
            <FaStop className="mr-2" /> 종료하기
          </button>
        )}
      </div>
      
      {isActive && (
        <div className="mt-4 text-green-600 font-medium text-center">
          <p>타이머가 실행 중입니다</p>
          <p className="text-sm text-gray-600 mt-1">브라우저를 닫아도 계속 기록됩니다</p>
        </div>
      )}
    </div>
  );
};

export default Timer;