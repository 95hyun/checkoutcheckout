import React, { useState, useEffect } from 'react';
import { format, addDays, getDaysInMonth, startOfMonth, endOfMonth, isSameDay } from 'date-fns';
import { ko } from 'date-fns/locale';
import { DailyStudyTime } from '../types';
import { getIntensityColor, formatSecondsToReadable } from '../utils/timeUtils';

interface MonthlyStudyCalendarProps {
  studyData: DailyStudyTime[];
  currentMonth: Date;
  onMonthChange: (date: Date) => void;
}

const MonthlyStudyCalendar: React.FC<MonthlyStudyCalendarProps> = ({ 
  studyData, 
  currentMonth,
  onMonthChange
}) => {
  const [calendarData, setCalendarData] = useState<Array<{ date: Date; duration: number }>>([]);
  const [hoveredDay, setHoveredDay] = useState<{ date: Date; duration: number } | null>(null);

  useEffect(() => {
    // 현재 월의 시작일과 마지막 일
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const totalDays = getDaysInMonth(currentMonth);
    
    // 월별 데이터 구성
    const monthData = [];
    
    for (let i = 0; i < totalDays; i++) {
      const date = addDays(monthStart, i);
      
      // 해당 날짜의 공부 시간 찾기
      const studyInfo = studyData.find(data => {
        const dataDate = new Date(data.date);
        return isSameDay(dataDate, date);
      });
      
      monthData.push({
        date,
        duration: studyInfo ? studyInfo.duration : 0
      });
    }
    
    setCalendarData(monthData);
  }, [studyData, currentMonth]);

  // 이전 달로 이동
  const goToPreviousMonth = () => {
    const previousMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1);
    onMonthChange(previousMonth);
  };

  // 다음 달로 이동
  const goToNextMonth = () => {
    const nextMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1);
    onMonthChange(nextMonth);
  };
  
  // 현재 날짜 확인
  const today = new Date();
  const isCurrentMonthPast = (
    currentMonth.getFullYear() < today.getFullYear() || 
    (currentMonth.getFullYear() === today.getFullYear() && currentMonth.getMonth() < today.getMonth())
  );
  
  const isCurrentMonthFuture = (
    currentMonth.getFullYear() > today.getFullYear() || 
    (currentMonth.getFullYear() === today.getFullYear() && currentMonth.getMonth() > today.getMonth())
  );

  return (
    <div className="w-full">
      {/* 월 선택 헤더 */}
      <div className="flex justify-between items-center mb-4">
        <button 
          onClick={goToPreviousMonth}
          className="p-2 rounded-full hover:bg-gray-200 focus:outline-none transition-colors"
          aria-label="이전 달"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        
        <h3 className="text-xl font-bold">
          {format(currentMonth, 'yyyy년 M월', { locale: ko })}
        </h3>
        
        <button 
          onClick={goToNextMonth}
          disabled={isCurrentMonthFuture}
          className={`p-2 rounded-full ${isCurrentMonthFuture ? 'text-gray-300 cursor-not-allowed' : 'hover:bg-gray-200'} focus:outline-none transition-colors`}
          aria-label="다음 달"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
      </div>
      
      <div className="relative">
        {/* 날짜별 잔디 그리드 */}
        <div className="grid grid-cols-7 gap-2 mb-4">
          {/* 요일 헤더 */}
          {['일', '월', '화', '수', '목', '금', '토'].map((day, index) => (
            <div key={index} className="text-center mb-2 text-sm font-medium">
              {day}
            </div>
          ))}
          
          {/* 이전 달의 빈 셀 채우기 */}
          {Array.from({ length: startOfMonth(currentMonth).getDay() }).map((_, i) => (
            <div key={`empty-start-${i}`} className="h-14 bg-gray-50 rounded-md"></div>
          ))}
          
          {/* 날짜 셀 */}
          {calendarData.map((day, i) => {
            const isToday = isSameDay(day.date, today);
            
            return (
              <div 
                key={i}
                className={`h-14 rounded-md border flex flex-col items-center justify-center relative transition-all ${
                  isToday ? 'border-blue-500' : 'border-gray-200'
                } hover:border-blue-300`}
                onMouseEnter={() => setHoveredDay(day)}
                onMouseLeave={() => setHoveredDay(null)}
              >
                <div className={`absolute top-1 left-1 text-xs ${isToday ? 'font-bold' : ''}`}>
                  {format(day.date, 'd')}
                </div>
                <div 
                  className="h-8 w-8 mt-2 rounded-sm"
                  style={{ backgroundColor: getIntensityColor(day.duration) }}
                ></div>
              </div>
            );
          })}
          
          {/* 다음 달의 빈 셀 채우기 */}
          {Array.from({ length: 6 - endOfMonth(currentMonth).getDay() }).map((_, i) => (
            <div key={`empty-end-${i}`} className="h-14 bg-gray-50 rounded-md"></div>
          ))}
        </div>
        
        {/* 호버 시 툴팁 */}
        {hoveredDay && (
          <div 
            className="absolute bg-gray-800 text-white p-2 rounded-md text-xs z-10"
            style={{
              top: '-40px',
              left: '50%',
              transform: 'translateX(-50%)'
            }}
          >
            <div>{format(hoveredDay.date, 'yyyy년 M월 d일 (E)', { locale: ko })}</div>
            <div className="font-bold mt-1">
              {hoveredDay.duration > 0 
                ? formatSecondsToReadable(hoveredDay.duration) 
                : '공부 기록 없음'}
            </div>
          </div>
        )}
      </div>
      
      {/* 범례 */}
      <div className="flex items-center mt-4 text-xs text-gray-600 justify-center">
        <span className="mr-2">적음</span>
        <div className="flex space-x-1">
          <div className="h-3 w-3 rounded-sm" style={{ backgroundColor: '#9be9a8' }}></div>
          <div className="h-3 w-3 rounded-sm" style={{ backgroundColor: '#40c463' }}></div>
          <div className="h-3 w-3 rounded-sm" style={{ backgroundColor: '#30a14e' }}></div>
          <div className="h-3 w-3 rounded-sm" style={{ backgroundColor: '#216e39' }}></div>
          <div className="h-3 w-3 rounded-sm" style={{ backgroundColor: '#0e4429' }}></div>
        </div>
        <span className="ml-2">많음</span>
      </div>
    </div>
  );
};

export default MonthlyStudyCalendar;