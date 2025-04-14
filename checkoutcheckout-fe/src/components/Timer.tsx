import React, { useEffect, useState, useRef } from 'react';
import { useTimer } from '../hooks/useTimer';
import { FaPlay, FaStop, FaGift } from 'react-icons/fa';
import Loading from './Loading';
import ErrorMessage from './ErrorMessage';
import useCharacterStore from '../store/characterStore';
import { useNavigate } from 'react-router-dom';

// 캐릭터 이미지 가져오기
const characterTypes = [
  'cleric',     // 성직자
  'knight',     // 기사
  'dwarf',      // 드워프
  'demonFemale', // 여성 악마
  'demonMale',  // 남성 악마
  'wizard'      // 마법사
];

// 캐릭터 획득을 위한 최소 공부 시간 (10초)
const MIN_STUDY_TIME_FOR_CHARACTER = 10; // 초 단위

const Timer: React.FC = () => {
  const { 
    isActive = false, 
    elapsedTime = 0,
    formattedTime = '00:00:00', 
    startTimer, 
    stopTimer, 
    isLoading = false, 
    error, 
    resetError 
  } = useTimer();
  
  const navigate = useNavigate();
  const [showCharacterAlert, setShowCharacterAlert] = useState<boolean>(false);
  const [acquiredCharacter, setAcquiredCharacter] = useState<string | null>(null);
  const characterTimeoutRef = useRef<number | null>(null);
  
  const { 
    acquireCharacter, 
    hasReceivedTodayCharacter, 
    checkTodayCharacter, 
    loading: characterLoading,
    error: characterError
  } = useCharacterStore();
  
  // 페이지 로드 시 오늘 캐릭터를 이미 획득했는지 확인
  useEffect(() => {
    // 캐릭터 획득 여부를 확인하고 상태를 업데이트
    const checkCharacterStatus = async () => {
      console.log("캐릭터 상태 확인 중...");
      // 백엔드에서 오늘 획득한 캐릭터 정보 확인
      const hasCharacter = await checkTodayCharacter();
      console.log("캐릭터 획득 여부:", hasCharacter);
    };
    
    checkCharacterStatus();
  }, [checkTodayCharacter]);
  
  // 공부 시간이 10초를 넘으면 캐릭터 획득 체크
  useEffect(() => {
    console.log("타이머 체크:", { isActive, hasReceivedTodayCharacter, elapsedTime });
    
    // 이미 캐릭터를 받았거나, 타이머가 실행 중이 아니거나, 10초가 안 되었으면 처리하지 않음
    if (!isActive || elapsedTime < MIN_STUDY_TIME_FOR_CHARACTER) {
      return;
    }
    
    if (hasReceivedTodayCharacter) {
      console.log("이미 오늘 캐릭터를 획득했습니다.");
      return;
    }
    
    // 이미 타임아웃이 설정되어 있으면 처리하지 않음
    if (characterTimeoutRef.current) {
      return;
    }
    
    console.log("10초 경과! 캐릭터 획득 조건 충족");
    
    // 캐릭터 획득 처리
    characterTimeoutRef.current = window.setTimeout(() => {
      try {
        // 랜덤 캐릭터 선택
        const randomIndex = Math.floor(Math.random() * characterTypes.length);
        const characterType = characterTypes[randomIndex];
        console.log("선택된 캐릭터 타입:", characterType);
        
        setAcquiredCharacter(characterType);
        setShowCharacterAlert(true);
        
        // 백엔드 API 호출
        acquireCharacter(characterType)
          .then((character) => {
            console.log('캐릭터 획득 성공:', character);
            // 캐릭터 획득 알림 표시
          })
          .catch(err => {
            console.error('캐릭터 획득 실패:', err);
          })
          .finally(() => {
            characterTimeoutRef.current = null;
          });
      } catch (error) {
        console.error("캐릭터 획득 중 오류 발생:", error);
        characterTimeoutRef.current = null;
      }
    }, 500); // 약간의 지연 추가
    
    return () => {
      if (characterTimeoutRef.current) {
        clearTimeout(characterTimeoutRef.current);
        characterTimeoutRef.current = null;
      }
    };
  }, [isActive, elapsedTime, hasReceivedTodayCharacter, acquireCharacter]);
  
  // 에러 메시지를 5초 후에 자동으로 지우기
  useEffect(() => {
    if ((error || characterError) && resetError) {
      const timer = setTimeout(() => {
        resetError();
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [error, characterError, resetError]);
  
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
  
  const handleCharacterClose = () => {
    setShowCharacterAlert(false);
  };
  
  const navigateToDashboard = () => {
    setShowCharacterAlert(false);
    navigate('/dashboard');
  };
  
  return (
    <div className="card flex flex-col items-center p-8 shadow-lg rounded-lg bg-white">
      <h2 className="text-2xl font-bold mb-6">공부 타이머</h2>
      
      {(error || characterError) && <ErrorMessage message={error || characterError || ''} className="mb-4" />}
      
      <div className="text-6xl font-mono mb-8 select-none font-bold">
        {formattedTime}
      </div>
      
      <div className="flex space-x-4">
        {(isLoading || characterLoading) ? (
          <div className="flex items-center justify-center w-32 h-12">
            <Loading size="md" />
          </div>
        ) : !isActive ? (
          <button
            onClick={handleStartTimer}
            disabled={isLoading || characterLoading}
            className="btn-primary flex items-center px-6 py-3 rounded-lg transition-all duration-300 hover:shadow-lg disabled:opacity-50"
            aria-label="타이머 시작"
          >
            <FaPlay className="mr-2" /> 시작하기
          </button>
        ) : (
          <button
            onClick={handleStopTimer}
            disabled={isLoading || characterLoading}
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
      
      {/* 캐릭터 획득 알림 */}
      {showCharacterAlert && acquiredCharacter && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
            <div className="flex flex-col items-center">
              <FaGift className="text-5xl text-yellow-500 mb-4" />
              <h3 className="text-2xl font-bold mb-2">캐릭터 획득!</h3>
              <p className="text-center mb-4">
                축하합니다! 공부를 열심히 하여 새로운 캐릭터를 획득했습니다!
              </p>
              <p className="text-primary font-semibold mb-4">
                캐릭터는 대시보드에서 확인할 수 있습니다.
              </p>
              <div className="flex space-x-4">
                <button 
                  onClick={handleCharacterClose}
                  className="btn-outline px-4 py-2"
                >
                  계속 공부하기
                </button>
                <button 
                  onClick={navigateToDashboard}
                  className="btn-primary px-4 py-2"
                >
                  대시보드로 이동
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Timer;