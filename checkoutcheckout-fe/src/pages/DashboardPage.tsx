import React, { useEffect, useState } from 'react';
import { useRequireAuth } from '../hooks/useAuth';
import Navbar from '../components/Navbar';
import Timer from '../components/Timer';
import useTimerStore from '../store/timerStore';
import useCharacterStore from '../store/characterStore';
import { FaGem, FaClock, FaCalendarAlt } from 'react-icons/fa';
import { formatSeconds, formatSecondsToReadable } from '../utils/timeUtils';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';
import '../assets/character-styles.css';
import { format } from 'date-fns';

// 캐릭터 이미지 매핑
const characterImages: Record<string, string> = {
  // Common 동물 캐릭터
  'common_rabbit': '토끼',
  'common_squirrel': '다람쥐',
  'common_hedgehog': '고슴도치',
  'common_pigeon': '비둘기',
  
  // Uncommon 동물 캐릭터
  'uncommon_cat': '고양이',
  'uncommon_dog': '강아지',
  'uncommon_bear': '곰',
  'uncommon_hamster': '햄스터',
  
  // Rare 동물 캐릭터
  'rare_wolf': '늑대',
  'rare_fox': '여우',
  'rare_lion': '사자',
  'rare_penguin': '펭귄',
  
  // Epic 동물 캐릭터
  'epic_unicorn': '유니콘',
  'epic_dragon': '드래곤',
  'epic_phoneix': '불사조',
  'epic_whitetiger': '백호',
  
  // Legendary 동물 캐릭터
  'legendary_doge': '도지',
  'legendary_pepe': '페페',
  'legendary_tralellotralala': '트라랄라',
  'legendary_chillguy': '칠가이'
};

const DashboardPage: React.FC = () => {
  // 인증 체크
  useRequireAuth();
  
  const { 
    studyHistory,
    fetchStudyHistory, 
    isLoading, 
    error 
  } = useTimerStore();
  
  const {
    todayCharacter,
    fetchUserCharacters,
    loading: characterLoading,
    error: characterError
  } = useCharacterStore();

  useEffect(() => {
    // 컴포넌트 마운트 시 데이터 로드
    const loadData = async () => {
      try {
        // 현재 월의 전체 데이터를 불러오기 위한 날짜 범위 설정
        const today = new Date();
        const startOfCurrentMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        const endOfCurrentMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        
        // 병렬로 API 호출 실행
        await Promise.all([
          fetchUserCharacters(),
          fetchStudyHistory(startOfCurrentMonth, endOfCurrentMonth)
        ]);
        
        console.log("데이터 로드 완료");
      } catch (error) {
        console.error("데이터 로드 중 오류 발생:", error);
      }
    };
    
    loadData();
  }, [fetchUserCharacters, fetchStudyHistory]);

  // 오늘 공부 시간 계산
  const todayStudyTime = React.useMemo(() => {
    if (studyHistory && studyHistory.records) {
      const today = format(new Date(), 'yyyy-MM-dd');
      const todayRecord = studyHistory.records.find(record => record.date === today);
      return todayRecord ? todayRecord.duration : 0;
    }
    return 0;
  }, [studyHistory]);

  // 이번주 공부 시간 계산 (대략적인 집계, 실제로는 API에서 정확한 주간 데이터를 받아와야 함)
  const weeklyStudyTime = React.useMemo(() => {
    if (studyHistory && studyHistory.records) {
      // 간단한 예시로 최근 7일간의 데이터 합산
      const last7DaysRecords = studyHistory.records.slice(0, 7);
      return last7DaysRecords.reduce((total, record) => total + record.duration, 0);
    }
    return 0;
  }, [studyHistory]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* 왼쪽: 타이머 (3/4 너비) */}
          <div className="lg:col-span-3">
            <div className="card">
              <Timer />
            </div>
          </div>
          
          {/* 오른쪽: 오늘의 캐릭터 + 요약 통계 (1/4 너비) */}
          <div className="lg:col-span-1 space-y-6">
            {/* 오늘의 캐릭터 */}
            <div className="card">
              <h2 className="text-lg font-semibold mb-2 p-3 flex items-center border-b">
                <FaGem className="mr-2 text-primary" />
                오늘의 캐릭터
              </h2>
              
              {characterError && (
                <ErrorMessage message={characterError} className="mb-2 px-3" />
              )}
              
              {characterLoading ? (
                <div className="flex justify-center py-4">
                  <Loading size="sm" />
                </div>
              ) : (
                <div className="flex flex-col items-center py-3 px-3">
                  {todayCharacter ? (
                    <>
                      <div className="mb-2 p-1 bg-gray-100 rounded-lg">
                        <div className="w-24 h-24 overflow-hidden rounded-lg">
                          {/* 캐릭터 타입에 따른 이미지 표시 */}
                          <div className={`w-full h-full flex items-center justify-center character-${todayCharacter.type} character-image`}>
                            <span className="text-lg font-bold opacity-0">
                              {characterImages[todayCharacter.type] || todayCharacter.type}
                            </span>
                          </div>
                        </div>
                      </div>
                      <p className="font-medium text-center">
                        {characterImages[todayCharacter.type] || todayCharacter.type}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        획득일: {new Date(todayCharacter.acquiredDate).toLocaleDateString()}
                      </p>
                    </>
                  ) : (
                    <>
                      <div className="mb-2 p-1 bg-gray-100 rounded-lg">
                        <div className="w-24 h-24 overflow-hidden rounded-lg flex items-center justify-center bg-gray-200">
                          <span className="text-gray-400 text-4xl">?</span>
                        </div>
                      </div>
                      <p className="text-gray-500 text-center text-sm">
                        아직 오늘 획득한 캐릭터가 없습니다.<br />
                        6시간 이상 공부하면 캐릭터를 획득할 수 있습니다!
                      </p>
                    </>
                  )}
                </div>
              )}
            </div>
            
            {/* 간단한 통계 요약 */}
            <div className="card p-4">
              <h3 className="text-lg font-semibold mb-3 pb-2 border-b">학습 요약</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-2 bg-blue-50 rounded-lg">
                  <div className="flex items-center text-sm">
                    <FaClock className="mr-2 text-blue-500" />
                    <span>오늘 공부 시간</span>
                  </div>
                  <span className="font-mono font-bold text-blue-700">
                    {formatSeconds(todayStudyTime)}
                  </span>
                </div>
                <div className="flex justify-between items-center p-2 bg-indigo-50 rounded-lg">
                  <div className="flex items-center text-sm">
                    <FaCalendarAlt className="mr-2 text-indigo-500" />
                    <span>이번주 공부 시간</span>
                  </div>
                  <span className="font-mono font-bold text-indigo-700">
                    {formatSeconds(weeklyStudyTime)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;