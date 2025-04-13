import React, { useEffect, useState } from 'react';
import { useRequireAuth } from '../hooks/useAuth';
import Navbar from '../components/Navbar';
import useTimerStore from '../store/timerStore';
import StudyCalendar from '../components/StudyCalendar';
import MonthlyStudyCalendar from '../components/MonthlyStudyCalendar';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';
import { subMonths, format, startOfMonth, endOfMonth } from 'date-fns';
import { FaChartBar, FaCalendarAlt, FaChartLine } from 'react-icons/fa';
import { ko } from 'date-fns/locale';

const HistoryPage: React.FC = () => {
  // 인증 체크
  useRequireAuth();
  
  const [viewMode, setViewMode] = useState<'monthly' | 'yearly'>('monthly');
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [startDate, setStartDate] = useState<Date>(() => startOfMonth(currentMonth));
  const [endDate, setEndDate] = useState<Date>(() => endOfMonth(currentMonth));
  
  const { 
    studyHistory, 
    fetchStudyHistory, 
    isLoading, 
    error 
  } = useTimerStore();

  // 월별 보기일 때는 해당 월의 시작일과 종료일로 데이터 조회
  useEffect(() => {
    if (viewMode === 'monthly') {
      const monthStart = startOfMonth(currentMonth);
      const monthEnd = endOfMonth(currentMonth);
      setStartDate(monthStart);
      setEndDate(monthEnd);
    }
  }, [currentMonth, viewMode]);

  // 연도별 보기일 때는 과거 12개월 데이터 조회
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
    fetchStudyHistory(startDate, endDate);
  }, [fetchStudyHistory, startDate, endDate]);

  // 월 변경 핸들러
  const handleMonthChange = (newMonth: Date) => {
    setCurrentMonth(newMonth);
  };

  // 뷰 모드 변경
  const toggleViewMode = () => {
    setViewMode(prev => prev === 'monthly' ? 'yearly' : 'monthly');
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

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <FaChartBar className="mr-2 text-primary" />
            공부 기록 통계
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
          {error && (
            <ErrorMessage message={error} className="mb-4" />
          )}
          
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loading size="lg" />
            </div>
          ) : (
            <>
              {/* 월별/연간 뷰 전환 */}
              <div className="mb-8">
                {viewMode === 'monthly' ? (
                  <MonthlyStudyCalendar 
                    studyData={studyHistory?.records || []} 
                    currentMonth={currentMonth}
                    onMonthChange={handleMonthChange}
                  />
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
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
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
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default HistoryPage;