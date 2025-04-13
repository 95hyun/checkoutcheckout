import React, { useState, useEffect } from 'react';
import { format, addDays, subDays, startOfWeek, isSameDay } from 'date-fns';
import { DailyStudyTime } from '../types';
import { getIntensityColor, formatSecondsToReadable } from '../utils/timeUtils';

interface StudyCalendarProps {
  studyData: DailyStudyTime[];
  weeks?: number;
}

const StudyCalendar: React.FC<StudyCalendarProps> = ({ studyData, weeks = 12 }) => {
  const [calendarData, setCalendarData] = useState<Array<Array<{ date: Date; duration: number }>>>([]);
  const [hoveredDay, setHoveredDay] = useState<{ date: Date; duration: number } | null>(null);

  useEffect(() => {
    const today = new Date();
    const endDate = today;
    const startDate = subDays(endDate, weeks * 7);
    
    // 주 단위로 데이터 구성
    const weeksData = [];
    let currentDate = startOfWeek(startDate);
    
    while (currentDate <= endDate) {
      const week = [];
      
      // 한 주의 데이터 생성
      for (let i = 0; i < 7; i++) {
        const date = addDays(currentDate, i);
        
        // 해당 날짜의 공부 시간 찾기
        const studyInfo = studyData.find(data => {
          const dataDate = new Date(data.date);
          return isSameDay(dataDate, date);
        });
        
        week.push({
          date,
          duration: studyInfo ? studyInfo.duration : 0
        });
      }
      
      weeksData.push(week);
      currentDate = addDays(currentDate, 7);
    }
    
    setCalendarData(weeksData);
  }, [studyData, weeks]);

  return (
    <div className="w-full">
      <div className="relative">
        {/* 요일 레이블 */}
        <div className="flex mb-1 text-xs text-gray-500">
          <div className="w-8"></div>
          <div className="flex flex-1 justify-between">
            <span>일</span>
            <span>월</span>
            <span>화</span>
            <span>수</span>
            <span>목</span>
            <span>금</span>
            <span>토</span>
          </div>
        </div>
        
        {/* 캘린더 그리드 */}
        <div className="flex">
          {/* 월 레이블 */}
          <div className="w-8 flex flex-col text-xs text-gray-500">
            {calendarData.map((week, i) => (
              (i % 4 === 0 || i === 0) && (
                <div key={i} className="h-4" style={{ marginTop: i > 0 ? '10px' : '0' }}>
                  {format(week[0].date, 'M')}
                </div>
              )
            ))}
          </div>
          
          {/* 잔디 그리드 */}
          <div className="flex-1 grid grid-cols-7 gap-1">
            {calendarData.flat().map((day, i) => (
              <div
                key={i}
                className="h-4 w-4 rounded-sm cursor-pointer"
                style={{ backgroundColor: getIntensityColor(day.duration) }}
                onMouseEnter={() => setHoveredDay(day)}
                onMouseLeave={() => setHoveredDay(null)}
              />
            ))}
          </div>
        </div>
        
        {/* 호버 시 툴팁 */}
        {hoveredDay && (
          <div 
            className="absolute bg-gray-800 text-white p-2 rounded-md text-xs z-10"
            style={{
              top: '-30px',
              left: '50%',
              transform: 'translateX(-50%)'
            }}
          >
            <div>{format(hoveredDay.date, 'yyyy년 M월 d일')}</div>
            <div className="font-bold">
              {hoveredDay.duration > 0 
                ? formatSecondsToReadable(hoveredDay.duration) 
                : '공부 기록 없음'}
            </div>
          </div>
        )}
      </div>
      
      {/* 범례 */}
      <div className="flex items-center mt-4 text-xs text-gray-600">
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

export default StudyCalendar;