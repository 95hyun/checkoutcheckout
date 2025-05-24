import React, { useEffect, useState } from 'react';
import { useRequireAuth } from '../hooks/useAuth';
import Navbar from '../components/Navbar';
import Timer from '../components/Timer';
import GithubStyleContributions from '../components/GithubStyleContributions';
import useTimerStore from '../store/timerStore';
import useCharacterStore from '../store/characterStore';
import usePlanStore from '../store/planStore';
import { FaCalendarAlt, FaClock, FaGem, FaChartBar, FaTasks, FaHistory, FaCheck } from 'react-icons/fa';
import { formatSecondsToReadable } from '../utils/timeUtils';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';
import '../assets/character-styles.css';
import { StudyPlanItem } from '../types';
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
  
  // 탭 상태 관리
  const [activeTab, setActiveTab] = useState<'timer' | 'stats' | 'plans'>('timer');
  
  const { 
    recentSessions = [],
    fetchRecentSessions,
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
  
  // 계획 데이터 가져오기
  const {
    plans,
    getPlansByDateRange,
    currentDatePlans,
    getPlansByDate,
    completePlanItem,
    isLoading: isPlanLoading,
    error: planError
  } = usePlanStore();

  useEffect(() => {
    // 컴포넌트 마운트 시 데이터 로드
    const loadData = async () => {
      try {
        // 현재 월의 전체 데이터를 불러오기 위한 날짜 범위 설정
        const today = new Date();
        const startOfCurrentMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        const endOfCurrentMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        
        // 병렬로 모든 API 호출 실행
        await Promise.all([
          fetchRecentSessions(),
          fetchUserCharacters(),
          fetchStudyHistory(startOfCurrentMonth, endOfCurrentMonth),
          getPlansByDateRange(startOfCurrentMonth, endOfCurrentMonth),
          getPlansByDate(today) // 오늘의 계획 로드
        ]);
        
        console.log("데이터 로드 완료");
      } catch (error) {
        console.error("데이터 로드 중 오류 발생:", error);
      }
    };
    
    loadData();
  }, [fetchRecentSessions, fetchUserCharacters, fetchStudyHistory, getPlansByDateRange, getPlansByDate]);

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

  // 오늘 날짜 계획 유무 확인
  const hasTodayPlans = currentDatePlans && currentDatePlans.items && currentDatePlans.items.length > 0;
  
  // 오늘 계획 중 완료되지 않은 항목 필터링
  const uncompletedPlans = hasTodayPlans 
    ? currentDatePlans.items.filter(item => !item.isCompleted)
    : [];
  
  // 오늘 계획 중 완료된 항목 필터링
  const completedPlans = hasTodayPlans 
    ? currentDatePlans.items.filter(item => item.isCompleted)
    : [];
    
  // 계획 항목 완료 처리
  const handleCompletePlan = async (itemId: number) => {
    try {
      await completePlanItem(new Date(), itemId);
    } catch (error) {
      console.error('계획 완료 처리 실패:', error);
    }
  };
  
  // 계획 페이지로 이동
  const navigateToPlanPage = () => {
    // 현재는 탭만 변경
    setActiveTab('plans');
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* 탭 헤더 */}
        <div className="flex border-b mb-6 bg-white rounded-t-lg shadow-sm px-2">
          <button
            className={`py-4 px-6 font-medium text-lg border-b-2 transition-colors ${
              activeTab === 'timer'
                ? 'text-primary border-primary'
                : 'text-gray-500 border-transparent hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('timer')}
          >
            <FaClock className="inline mr-2" /> 타이머
          </button>
          <button
            className={`py-4 px-6 font-medium text-lg border-b-2 transition-colors ${
              activeTab === 'stats'
                ? 'text-primary border-primary'
                : 'text-gray-500 border-transparent hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('stats')}
          >
            <FaChartBar className="inline mr-2" /> 통계
          </button>
          <button
            className={`py-4 px-6 font-medium text-lg border-b-2 transition-colors ${
              activeTab === 'plans'
                ? 'text-primary border-primary'
                : 'text-gray-500 border-transparent hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('plans')}
          >
            <FaTasks className="inline mr-2" /> 계획
          </button>
        </div>
        
        {/* 탭 내용 */}
        {activeTab === 'timer' && (
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
                <h3 className="text-lg font-semibold mb-3 pb-2 border-b flex items-center">
                  <FaChartBar className="mr-2 text-blue-500" /> 학습 요약
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-2 bg-blue-50 rounded-lg">
                    <div className="flex items-center text-sm">
                      <FaClock className="mr-1 text-blue-500" />
                      <span>오늘</span>
                    </div>
                    <span className="font-mono font-bold text-blue-700">
                      {formatSecondsToReadable(todayStudyTime)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-indigo-50 rounded-lg">
                    <div className="flex items-center text-sm">
                      <FaCalendarAlt className="mr-1 text-indigo-500" />
                      <span>이번주</span>
                    </div>
                    <span className="font-mono font-bold text-indigo-700">
                      {formatSecondsToReadable(weeklyStudyTime)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'stats' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* 왼쪽: 최근 공부 기록 (2/3 너비) */}
            <div className="lg:col-span-2">
              <div className="card h-full">
                <h2 className="text-lg font-semibold mb-2 p-3 flex items-center border-b">
                  <FaHistory className="mr-2 text-primary" />
                  최근 공부 기록
                </h2>
                
                {error && (
                  <ErrorMessage message={error} className="mb-2 px-3" />
                )}
                
                {isLoading ? (
                  <div className="flex justify-center py-4">
                    <Loading size="md" />
                  </div>
                ) : (
                  <div className="divide-y divide-gray-200">
                    {recentSessions && recentSessions.length > 0 ? (
                      recentSessions.map((session) => (
                        <div key={session.id} className="py-2 px-3 hover:bg-gray-50 transition-colors">
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="text-sm text-gray-600">
                                {new Date(session.startTime).toLocaleString()}
                              </p>
                              {session.endTime && (
                                <p className="text-xs text-gray-400">
                                  ~ {new Date(session.endTime).toLocaleString()}
                                </p>
                              )}
                            </div>
                            <div className="flex items-center">
                              <FaClock className="text-primary mr-1" />
                              <span className="font-medium">
                                {formatSecondsToReadable(session.duration || 0)}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="py-4 text-center text-gray-500">
                        아직 공부 기록이 없습니다.
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
            
            {/* 오른쪽: 통계 대시보드 (1/3 너비) */}
            <div className="lg:col-span-1 space-y-6">
              {/* 공부 시간 요약 */}
              <div className="card p-4">
                <h3 className="text-lg font-semibold mb-3 flex items-center">
                  <FaChartBar className="mr-2 text-blue-500" /> 공부 시간 요약
                </h3>
                <div className="space-y-4">
                  {/* 오늘 공부 시간 */}
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center text-blue-700">
                        <FaClock className="mr-2" /> 
                        <span className="font-bold">오늘</span>
                      </div>
                      <div className="text-xl font-mono font-bold text-blue-700">
                        {formatSecondsToReadable(todayStudyTime)}
                      </div>
                    </div>
                    <div className="w-full bg-blue-200 rounded-full h-2.5">
                      <div 
                        className="bg-blue-600 h-2.5 rounded-full" 
                        style={{ width: `${Math.min(100, (todayStudyTime / (8 * 3600)) * 100)}%` }}
                      ></div>
                    </div>
                    <div className="text-xs text-gray-500 mt-1 text-right">
                      목표 8시간 중 {Math.round((todayStudyTime / (8 * 3600)) * 100)}% 달성
                    </div>
                  </div>
                  
                  {/* 이번주 공부 시간 */}
                  <div className="p-4 bg-indigo-50 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center text-indigo-700">
                        <FaCalendarAlt className="mr-2" /> 
                        <span className="font-bold">이번주</span>
                      </div>
                      <div className="text-xl font-mono font-bold text-indigo-700">
                        {formatSecondsToReadable(weeklyStudyTime)}
                      </div>
                    </div>
                    <div className="w-full bg-indigo-200 rounded-full h-2.5">
                      <div 
                        className="bg-indigo-600 h-2.5 rounded-full" 
                        style={{ width: `${Math.min(100, (weeklyStudyTime / (40 * 3600)) * 100)}%` }}
                      ></div>
                    </div>
                    <div className="text-xs text-gray-500 mt-1 text-right">
                      목표 40시간 중 {Math.round((weeklyStudyTime / (40 * 3600)) * 100)}% 달성
                    </div>
                  </div>
                </div>
              </div>
              
              {/* GitHub 스타일 잔디 차트 */}
              <div className="card p-4">
                <h3 className="text-lg font-semibold mb-3">2025년 4월 공부 기록</h3>
                {isLoading ? (
                  <div className="flex justify-center py-3">
                    <Loading size="sm" />
                  </div>
                ) : error ? (
                  <ErrorMessage message={error} />
                ) : (
                  <div className="w-full overflow-x-auto">
                    <GithubStyleContributions studyData={studyHistory?.records || []} />
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'plans' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* 왼쪽: 오늘의 계획 (2/3 너비) */}
            <div className="lg:col-span-2">
              <div className="card">
                <h2 className="text-lg font-semibold mb-2 p-3 flex items-center border-b">
                  <FaTasks className="mr-2 text-primary" /> 오늘의 공부 계획
                </h2>
                
                <div className="p-4">
                  {isPlanLoading ? (
                    <div className="flex justify-center py-4">
                      <Loading size="md" />
                    </div>
                  ) : planError ? (
                    <ErrorMessage message={planError} />
                  ) : !hasTodayPlans ? (
                    <div className="bg-gray-50 p-6 rounded-lg text-center">
                      <p className="text-gray-500 mb-4">오늘의 계획이 없습니다.</p>
                      <button className="btn-primary px-4 py-2 rounded-lg">
                        계획 추가하기
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {/* 미완료 계획 */}
                      {uncompletedPlans.length > 0 && (
                        <div>
                          <h4 className="font-medium text-gray-700 mb-2">진행 중인 계획</h4>
                          <div className="space-y-2">
                            {uncompletedPlans.map(plan => (
                              <div key={plan.id} className="bg-white border border-gray-200 rounded-lg p-4 flex justify-between items-center hover:shadow-sm transition-shadow">
                                <div className="flex-1">
                                  <p className="font-medium">{plan.content}</p>
                                  <div className="flex items-center text-xs text-gray-500 mt-1">
                                    <FaClock className="mr-1" /> 목표: {formatSecondsToReadable(plan.plannedDuration)}
                                  </div>
                                </div>
                                <button
                                  onClick={() => handleCompletePlan(plan.id)}
                                  className="ml-2 p-2 text-green-600 hover:bg-green-50 rounded-full transition-colors"
                                  title="완료로 표시"
                                >
                                  <FaCheck />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {/* 완료된 계획 */}
                      {completedPlans.length > 0 && (
                        <div className="mt-4">
                          <h4 className="font-medium text-gray-600 mb-2 flex items-center">
                            <FaCheck className="mr-1 text-green-500" /> 완료된 항목
                          </h4>
                          <div className="space-y-2">
                            {completedPlans.map(plan => (
                              <div key={plan.id} className="bg-green-50 border border-green-100 rounded-lg p-3 flex items-center">
                                <div className="flex-1">
                                  <p className="font-medium text-gray-500 line-through">{plan.content}</p>
                                  <p className="text-xs text-gray-400 mt-1">목표: {formatSecondsToReadable(plan.plannedDuration)}</p>
                                </div>
                                <FaCheck className="text-green-500 mr-1" />
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* 오른쪽: 계획 달성 통계 (1/3 너비) */}
            <div className="lg:col-span-1 space-y-6">
              {/* 계획 달성률 */}
              <div className="card p-4">
                <h3 className="text-lg font-semibold mb-3 flex items-center">
                  <FaChartBar className="mr-2 text-green-500" /> 계획 달성률
                </h3>
                
                <div className="relative pt-1">
                  <div className="flex mb-2 items-center justify-between">
                    <div>
                      <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-green-600 bg-green-100">
                        오늘
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-semibold inline-block text-green-600">
                        {hasTodayPlans 
                          ? `${completedPlans.length}/${currentDatePlans.items.length} (${Math.round((completedPlans.length / currentDatePlans.items.length) * 100)}%)`
                          : '0/0 (0%)'}
                      </span>
                    </div>
                  </div>
                  <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-green-100">
                    <div 
                      style={{ width: hasTodayPlans 
                        ? `${Math.round((completedPlans.length / currentDatePlans.items.length) * 100)}%`
                        : '0%' }}
                      className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-500"
                    ></div>
                  </div>
                </div>
                
                <div className="relative pt-1 mt-6">
                  <div className="flex mb-2 items-center justify-between">
                    <div>
                      <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-600 bg-blue-100">
                        이번주
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-semibold inline-block text-blue-600">
                        75% 달성
                      </span>
                    </div>
                  </div>
                  <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-100">
                    <div 
                      style={{ width: '75%' }}
                      className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"
                    ></div>
                  </div>
                </div>
                
                <div className="mt-4 text-center">
                  <button className="w-full btn-primary px-4 py-2 rounded-lg">
                    새 계획 추가하기
                  </button>
                </div>
              </div>
              
              {/* 계획 달성 추이 (간단한 설명) */}
              <div className="card p-4">
                <h3 className="text-lg font-semibold mb-2">계획 달성 추이</h3>
                <p className="text-sm text-gray-600 mb-3">
                  최근 7일간 계획 달성률이 꾸준히 증가하고 있습니다. 목표를 명확하게 설정하면 공부 효율이 더 높아집니다!
                </p>
                <div className="bg-gray-50 p-3 rounded-lg mt-2">
                  <p className="text-sm font-medium text-primary">이번주 팁</p>
                  <p className="text-xs text-gray-600 mt-1">
                    매일 계획을 세우고 타이머와 함께 공부하면 집중력이 향상됩니다. 소규모 계획을 여러 개 세워 성취감을 자주 느껴보세요!
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default DashboardPage;