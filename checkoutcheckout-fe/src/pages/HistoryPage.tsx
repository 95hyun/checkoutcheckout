import React, { useEffect, useState } from 'react';
import { useRequireAuth } from '../hooks/useAuth';
import Navbar from '../components/Navbar';
import useTimerStore from '../store/timerStore';
import usePlanStore from '../store/planStore';
import StudyCalendar from '../components/StudyCalendar';
import MonthlyStudyCalendar from '../components/MonthlyStudyCalendar';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';
import { subMonths, format, startOfMonth, endOfMonth, isFuture, parseISO, isToday } from 'date-fns';
import { FaChartBar, FaCalendarAlt, FaChartLine, FaClipboardList, FaPlus, FaEdit, FaTrash, FaCheck, FaClock } from 'react-icons/fa';
import { ko } from 'date-fns/locale';
import { StudyPlanRequest, StudyPlanItem } from '../types';
import { formatSecondsToReadable } from '../utils/timeUtils';

const HistoryPage: React.FC = () => {
  // 인증 체크
  useRequireAuth();
  
  const [viewMode, setViewMode] = useState<'monthly' | 'yearly'>('monthly');
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [startDate, setStartDate] = useState<Date>(() => startOfMonth(currentMonth));
  const [endDate, setEndDate] = useState<Date>(() => endOfMonth(currentMonth));
  
  // 모달 상태 관리
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  
  // 계획 편집 상태
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editItemId, setEditItemId] = useState<number | null>(null);
  const [planContent, setPlanContent] = useState<string>('');
  const [plannedHours, setPlannedHours] = useState<number>(1);
  const [plannedMinutes, setPlannedMinutes] = useState<number>(0);
  
  const { 
    studyHistory, 
    fetchStudyHistory, 
    isLoading: isHistoryLoading, 
    error: historyError 
  } = useTimerStore();
  
  const {
    plans,
    currentDatePlans,
    getPlansByDateRange,
    getPlansByDate,
    addPlanItem,
    updatePlanItem,
    deletePlanItem,
    isLoading: isPlanLoading,
    error: planError
  } = usePlanStore();

  // 월별 보기일 때는 해당 월의 시작일과 종료일로 데이터 조회
  useEffect(() => {
    if (viewMode === 'monthly') {
      const monthStart = startOfMonth(currentMonth);
      const monthEnd = endOfMonth(currentMonth);
      setStartDate(monthStart);
      setEndDate(monthEnd);
    }
  }, [currentMonth, viewMode]);

  // 연도별 보기일 때는 과거 3개월 데이터 조회
  useEffect(() => {
    if (viewMode === 'yearly') {
      const today = new Date();
      const threeMonthsAgo = subMonths(today, 3);
      setStartDate(threeMonthsAgo);
      setEndDate(today);
    }
  }, [viewMode]);

  // 날짜 변경 시 데이터 조회
  useEffect(() => {
    const fetchData = async () => {
      await fetchStudyHistory(startDate, endDate);
      const plansData = await getPlansByDateRange(startDate, endDate);
      console.log('가져온 계획 데이터 목록:', plansData);
    };
    
    fetchData();
  }, [fetchStudyHistory, getPlansByDateRange, startDate, endDate]);

  // 선택된 날짜의 계획 목록 불러오기
  useEffect(() => {
    if (selectedDate) {
      const loadPlan = async () => {
        try {
          await getPlansByDate(selectedDate);
          
          // 편집 모드 초기화
          setIsEditing(false);
          setEditItemId(null);
          setPlanContent('');
          setPlannedHours(1);
        } catch (error) {
          console.error('계획 불러오기 오류:', error);
        }
      };
      
      loadPlan();
    }
  }, [selectedDate, getPlansByDate]);
  
  // 계획 항목 편집 시작
  const handleEditStart = (item: StudyPlanItem) => {
    setIsEditing(true);
    setEditItemId(item.id);
    setPlanContent(item.content);
    
    // 시간과 분으로 분리하여 설정
    const hours = Math.floor(item.plannedDuration / 3600);
    const minutes = Math.floor((item.plannedDuration % 3600) / 60);
    
    setPlannedHours(hours);
    setPlannedMinutes(minutes);
  };
  
  // 계획 입력 초기화
  const resetPlanForm = () => {
    setIsEditing(false);
    setEditItemId(null);
    setPlanContent('');
    setPlannedHours(1);
    setPlannedMinutes(0);
  };

  // 월 변경 핸들러
  const handleMonthChange = (newMonth: Date) => {
    setCurrentMonth(newMonth);
  };

  // 뷰 모드 변경
  const toggleViewMode = () => {
    setViewMode(prev => prev === 'monthly' ? 'yearly' : 'monthly');
  };
  
  // 날짜 클릭 핸들러
  const handleDayClick = async (date: Date) => {
    // 과거 날짜는 계획 설정 불가
    if (!isFuture(date) && !isToday(date)) return;
    
    setSelectedDate(date);
    setIsModalOpen(true);
    resetPlanForm();
    
    // 선택한 날짜의 계획을 다시 불러옴
    try {
      await getPlansByDate(date);
    } catch (error) {
      console.error('계획 불러오기 오류:', error);
    }
  };
  
  // 모달 닫기
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedDate(null);
    resetPlanForm();
    
    // 모달을 닫을 때 데이터 갱신
    const refreshData = async () => {
      try {
        await getPlansByDateRange(startDate, endDate);
      } catch (error) {
        console.error('계획 목록 갱신 오류:', error);
      }
    };
    
    refreshData();
  };
  
  // 새 계획 항목 저장
  const handleAddPlanItem = async () => {
    if (!selectedDate || !planContent.trim()) return;
    
    // 시간과 분을 초로 변환 (1시간 = 3600초, 1분 = 60초)
    const durationInSeconds = (plannedHours * 3600) + (plannedMinutes * 60);
    
    const planRequest: StudyPlanRequest = {
      content: planContent.trim(),
      plannedDuration: durationInSeconds
    };
    
    try {
      await addPlanItem(selectedDate, planRequest);
      
      // 입력 필드 초기화
      resetPlanForm();
      
      // 추가 후 현재 날짜의 계획 다시 불러오기
      await getPlansByDate(selectedDate);
      
      // 전체 계획 목록도 갱신
      await getPlansByDateRange(startDate, endDate);
    } catch (error) {
      console.error('계획 저장 오류:', error);
    }
  };
  
  // 계획 항목 수정
  const handleUpdatePlanItem = async () => {
    if (!selectedDate || !editItemId || !planContent.trim()) return;
    
    // 시간과 분을 초로 변환 (1시간 = 3600초, 1분 = 60초)
    const durationInSeconds = (plannedHours * 3600) + (plannedMinutes * 60);
    
    const planRequest: StudyPlanRequest = {
      content: planContent.trim(),
      plannedDuration: durationInSeconds
    };
    
    try {
      await updatePlanItem(selectedDate, editItemId, planRequest);
      
      // 입력 필드 초기화
      resetPlanForm();
    } catch (error) {
      console.error('계획 수정 오류:', error);
    }
  };
  
  // 계획 항목 삭제
  const handleDeletePlanItem = async (itemId: number) => {
    if (!selectedDate) return;
    
    try {
      await deletePlanItem(selectedDate, itemId);
    } catch (error) {
      console.error('계획 삭제 오류:', error);
    }
  };
  
  // 폼 제출 핸들러
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isEditing && editItemId) {
      handleUpdatePlanItem();
    } else {
      handleAddPlanItem();
    }
  };

  // 총 공부 시간 계산
  const totalStudyTime = studyHistory?.records.reduce(
    (total, record) => total + record.duration, 
    0
  ) || 0;
  
  // 일 평균 공부 시간 계산
  const daysWithStudy = studyHistory?.records.filter(
    record => record.duration > 0
  ).length || 0;
  
  const averageStudyTime = daysWithStudy > 0 
    ? totalStudyTime / daysWithStudy 
    : 0;

  // 이번 달 계획 수립 일수
  const plannedDaysCount = plans.length;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <FaClipboardList className="mr-2 text-primary" />
            공부 계획 & 기록
          </h1>
          
          <button 
            onClick={toggleViewMode}
            className="flex items-center bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors"
          >
            {viewMode === 'monthly' ? (
              <>
                <FaChartLine className="mr-2" /> 연간 보기
              </>
            ) : (
              <>
                <FaCalendarAlt className="mr-2" /> 월별 보기
              </>
            )}
          </button>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          {(historyError || planError) && (
            <ErrorMessage message={historyError || planError || ''} className="mb-4" />
          )}
          
          {(isHistoryLoading || isPlanLoading) ? (
            <div className="flex justify-center py-12">
              <Loading size="lg" />
            </div>
          ) : (
            <>
              {/* 월별/연간 뷰 전환 */}
              <div className="mb-8">
                {viewMode === 'monthly' ? (
                  <>
                    <div className="mb-4">
                      <p className="text-gray-600">📌 날짜를 클릭하여 공부 계획을 설정해보세요!</p>
                    </div>
                    <MonthlyStudyCalendar 
                      studyData={studyHistory?.records || []} 
                      plans={plans}
                      currentMonth={currentMonth}
                      onMonthChange={handleMonthChange}
                      onDayClick={handleDayClick}
                    />
                  </>
                ) : (
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-xl font-bold">최근 3개월 공부 기록</h2>
                      <div className="text-sm text-gray-600">
                        {format(startDate, 'yyyy년 M월 d일', { locale: ko })} ~ {format(endDate, 'yyyy년 M월 d일', { locale: ko })}
                      </div>
                    </div>
                    <StudyCalendar 
                      studyData={studyHistory?.records || []} 
                      weeks={12}
                    />
                  </div>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
                <div className="card bg-blue-50 border border-blue-100 p-4 rounded-lg">
                  <h3 className="text-lg font-medium text-blue-800 mb-2">공부한 날</h3>
                  <p className="text-3xl font-bold text-blue-900">
                    {daysWithStudy}일
                  </p>
                </div>
                
                <div className="card bg-green-50 border border-green-100 p-4 rounded-lg">
                  <h3 className="text-lg font-medium text-green-800 mb-2">총 공부 시간</h3>
                  <p className="text-3xl font-bold text-green-900">
                    {Math.floor(totalStudyTime / 3600)}시간 {Math.floor((totalStudyTime % 3600) / 60)}분
                  </p>
                </div>
                
                <div className="card bg-purple-50 border border-purple-100 p-4 rounded-lg">
                  <h3 className="text-lg font-medium text-purple-800 mb-2">평균 공부 시간</h3>
                  <p className="text-3xl font-bold text-purple-900">
                    {Math.floor(averageStudyTime / 3600)}시간 {Math.floor((averageStudyTime % 3600) / 60)}분
                  </p>
                </div>
                
                <div className="card bg-yellow-50 border border-yellow-100 p-4 rounded-lg">
                  <h3 className="text-lg font-medium text-yellow-800 mb-2">계획 수립 일수</h3>
                  <p className="text-3xl font-bold text-yellow-900">
                    {plannedDaysCount}일
                  </p>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
      
      {/* 계획 목록 모달 */}
      {isModalOpen && selectedDate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full max-h-[80vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4 flex items-center">
              <FaCalendarAlt className="mr-2 text-primary" />
              {format(selectedDate, 'yyyy년 M월 d일 (E)', { locale: ko })} 공부 계획
            </h2>
            
            {isPlanLoading ? (
              <div className="flex justify-center py-4">
                <Loading size="md" />
              </div>
            ) : (
              <>
                {/* 계획 목록 */}
                {currentDatePlans && currentDatePlans.items && currentDatePlans.items.length > 0 ? (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-2">계획 목록</h3>
                    <ul className="space-y-3">
                      {currentDatePlans.items.map(item => (
                        <li 
                          key={item.id} 
                          className={`p-3 rounded-lg border ${
                            item.isCompleted ? 'bg-green-50 border-green-300' : 'bg-white border-gray-200'
                          }`}
                        >
                          <div className="flex justify-between">
                            <div className={`flex-1 ${item.isCompleted ? 'line-through text-gray-500' : ''}`}>
                              <div className="font-medium">{item.content}</div>
                              <div className="text-xs text-gray-500 flex items-center mt-1">
                                <FaClock className="mr-1" />
                                {formatSecondsToReadable(item.plannedDuration)}
                              </div>
                            </div>
                            <div className="flex items-start ml-2 space-x-2">
                              {!item.isCompleted && (
                                <>
                                  <button 
                                    onClick={() => handleEditStart(item)}
                                    className="text-blue-600 hover:text-blue-800"
                                    aria-label="수정"
                                  >
                                    <FaEdit />
                                  </button>
                                </>
                              )}
                              <button 
                                onClick={() => handleDeletePlanItem(item.id)}
                                className="text-red-600 hover:text-red-800"
                                aria-label="삭제"
                              >
                                <FaTrash />
                              </button>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <div className="mb-6 text-center py-4 bg-gray-50 rounded-lg">
                    <p className="text-gray-500">아직 계획이 없습니다. 계획을 추가해보세요!</p>
                  </div>
                )}
                
                {/* 계획 추가/수정 폼 */}
                <form onSubmit={handleFormSubmit} className="mb-4">
                  <h3 className="text-lg font-semibold mb-2">
                    {isEditing ? '계획 수정' : '새 계획 추가'}
                  </h3>
                  <div className="mb-4">
                    <label htmlFor="planContent" className="block text-sm font-medium text-gray-700 mb-1">
                      계획 내용
                    </label>
                    <textarea
                      id="planContent"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                      rows={3}
                      placeholder="공부 계획을 입력하세요"
                      value={planContent}
                      onChange={(e) => setPlanContent(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      계획 시간
                    </label>
                    <div className="flex space-x-2">
                      <div className="flex-1">
                        <label htmlFor="plannedHours" className="block text-xs text-gray-500 mb-1">
                          시간
                        </label>
                        <input
                          id="plannedHours"
                          type="number"
                          min="0"
                          max="24"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                          value={plannedHours}
                          onChange={(e) => setPlannedHours(parseInt(e.target.value, 10) || 0)}
                          required
                        />
                      </div>
                      <div className="flex-1">
                        <label htmlFor="plannedMinutes" className="block text-xs text-gray-500 mb-1">
                          분
                        </label>
                        <input
                          id="plannedMinutes"
                          type="number"
                          min="0"
                          max="59"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                          value={plannedMinutes}
                          onChange={(e) => setPlannedMinutes(parseInt(e.target.value, 10) || 0)}
                          required
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <button
                      type="submit"
                      className="flex-1 flex justify-center items-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                    >
                      {isEditing ? (
                        <>
                          <FaEdit className="mr-2" /> 수정하기
                        </>
                      ) : (
                        <>
                          <FaPlus className="mr-2" /> 추가하기
                        </>
                      )}
                    </button>
                    
                    {isEditing && (
                      <button
                        type="button"
                        onClick={resetPlanForm}
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                      >
                        취소
                      </button>
                    )}
                  </div>
                </form>
                
                <div className="mt-6 pt-4 border-t border-gray-200 flex justify-end">
                  <button
                    onClick={handleCloseModal}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                  >
                    닫기
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default HistoryPage;