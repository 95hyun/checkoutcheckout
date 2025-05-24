import React from 'react';
import { format, startOfWeek, endOfWeek, eachDayOfInterval } from 'date-fns';
import { StudyTimeHistory } from '../types';

interface GithubStyleContributionsProps {
  studyHistory?: StudyTimeHistory;
}

const GithubStyleContributions: React.FC<GithubStyleContributionsProps> = ({ studyHistory }) => {
  // 이번주 날짜 범위 계산
  const today = new Date();
  const weekStart = startOfWeek(today, { weekStartsOn: 1 }); // 월요일부터 시작
  const weekEnd = endOfWeek(today, { weekStartsOn: 1 });
  
  // 이번주 모든 날짜 배열 생성
  const daysOfWeek = eachDayOfInterval({ start: weekStart, end: weekEnd });
  
  // 각 날짜별 공부 시간 계산
  const getStudyTimeForDate = (date: Date) => {
    if (!studyHistory?.records) return 0;
    
    const dateStr = format(date, 'yyyy-MM-dd');
    const record = studyHistory.records.find(r => r.date === dateStr);
    return record ? record.duration : 0;
  };
  
  // 공부 시간에 따른 색상 결정
  const getColorClass = (duration: number) => {
    if (duration === 0) return 'bg-gray-100';
    if (duration < 1800) return 'bg-green-100'; // 30분 미만
    if (duration < 3600) return 'bg-green-200'; // 1시간 미만
    if (duration < 7200) return 'bg-green-300'; // 2시간 미만
    if (duration < 10800) return 'bg-green-400'; // 3시간 미만
    return 'bg-green-500'; // 3시간 이상
  };
  
  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">이번주 공부 기록</h3>
      <div className="grid grid-cols-7 gap-2">
        {daysOfWeek.map((day, index) => {
          const studyTime = getStudyTimeForDate(day);
          return (
            <div key={index} className="flex flex-col items-center">
              <div className={`w-8 h-8 rounded ${getColorClass(studyTime)}`} />
              <span className="text-xs mt-1 text-gray-500">
                {format(day, 'E')}
              </span>
            </div>
          );
        })}
      </div>
      <div className="mt-4 flex items-center justify-end space-x-2">
        <span className="text-xs text-gray-500">공부 시간</span>
        <div className="flex space-x-1">
          <div className="w-3 h-3 bg-gray-100 rounded" />
          <div className="w-3 h-3 bg-green-100 rounded" />
          <div className="w-3 h-3 bg-green-200 rounded" />
          <div className="w-3 h-3 bg-green-300 rounded" />
          <div className="w-3 h-3 bg-green-400 rounded" />
          <div className="w-3 h-3 bg-green-500 rounded" />
        </div>
      </div>
    </div>
  );
};

export default GithubStyleContributions; 