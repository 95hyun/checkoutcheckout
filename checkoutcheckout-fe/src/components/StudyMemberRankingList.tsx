import React from 'react';
import { FaMedal, FaTrophy, FaAward, FaUser } from 'react-icons/fa';
import { StudyMemberRankEntry } from '../types';
import { formatSecondsToReadable } from '../utils/timeUtils';

interface StudyMemberRankingListProps {
  rankings: StudyMemberRankEntry[];
  period: string;
  currentUserId: number;
}

const StudyMemberRankingList: React.FC<StudyMemberRankingListProps> = ({ 
  rankings, 
  period,
  currentUserId
}) => {
  // 공부 시간 표시 형식 (서버에서 오는 형식을 사용하거나 직접 계산)
  const formatStudyTime = (entry: StudyMemberRankEntry): string => {
    if (entry.formattedStudyTime && entry.formattedStudyTime !== "00:00:00") {
      return entry.formattedStudyTime;
    }
    
    // 서버에서 온 형식이 없거나 00:00:00인 경우 직접 계산
    // studyTime은 밀리초 단위이므로 초 단위로 변환
    return formatSecondsToReadable(Math.floor(entry.studyTime / 1000));
  };

  if (!rankings.length) {
    return (
      <div className="text-center py-10 text-gray-500">
        <p>랭킹 데이터가 없습니다.</p>
      </div>
    );
  }
  
  return (
    <div>
      <h3 className="text-center text-gray-500 mb-6">{period} 공부시간 랭킹</h3>
      
      {/* 상위 3위 */}
      <div className="flex justify-center items-end mb-10 space-x-4">
        {rankings.length > 1 && (
          <div className={`text-center ${currentUserId === rankings[1].userId ? 'ring-2 ring-primary ring-offset-2' : ''}`}>
            <div className="flex flex-col items-center">
              <div className="relative">
                <div className="h-16 w-16 rounded-full bg-silver flex items-center justify-center shadow-lg">
                  <FaMedal className="text-white text-2xl" />
                </div>
                <div className="absolute -bottom-1 -right-1 bg-silver text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                  2
                </div>
              </div>
              <div className="mt-2 w-24">
                <p className="font-medium text-gray-800 truncate">{rankings[1].nickname}</p>
                <p className="text-xs font-semibold text-gray-500">{formatStudyTime(rankings[1])}</p>
              </div>
            </div>
          </div>
        )}
        
        {/* 1위 */}
        <div className={`text-center ${currentUserId === rankings[0].userId ? 'ring-2 ring-primary ring-offset-2' : ''}`}>
          <div className="flex flex-col items-center">
            <div className="relative">
              <div className="h-20 w-20 rounded-full bg-gold flex items-center justify-center shadow-lg">
                <FaTrophy className="text-white text-3xl" />
              </div>
              <div className="absolute -bottom-1 -right-1 bg-gold text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                1
              </div>
            </div>
            <div className="mt-2 w-24">
              <p className="font-medium text-gray-800 truncate">{rankings[0].nickname}</p>
              <p className="text-xs font-semibold text-gray-500">{formatStudyTime(rankings[0])}</p>
            </div>
          </div>
        </div>
        
        {rankings.length > 2 && (
          <div className={`text-center ${currentUserId === rankings[2].userId ? 'ring-2 ring-primary ring-offset-2' : ''}`}>
            <div className="flex flex-col items-center">
              <div className="relative">
                <div className="h-16 w-16 rounded-full bg-bronze flex items-center justify-center shadow-lg">
                  <FaAward className="text-white text-2xl" />
                </div>
                <div className="absolute -bottom-1 -right-1 bg-bronze text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                  3
                </div>
              </div>
              <div className="mt-2 w-24">
                <p className="font-medium text-gray-800 truncate">{rankings[2].nickname}</p>
                <p className="text-xs font-semibold text-gray-500">{formatStudyTime(rankings[2])}</p>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* 4위 이하 순위 */}
      <div className="max-w-3xl mx-auto">
        {rankings.slice(3).map((rank, index) => (
          <div 
            key={rank.userId}
            className={`flex items-center p-3 rounded-lg mb-2 ${
              currentUserId === rank.userId ? 'bg-primary bg-opacity-10' : 'bg-gray-50'
            }`}
          >
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-200 mr-4">
              <span className="text-gray-600 font-bold text-sm">{index + 4}</span>
            </div>
            <div className="flex-grow flex items-center">
              <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                <FaUser className="text-gray-500" />
              </div>
              <div>
                <p className="font-medium">{rank.nickname}</p>
                <p className="text-xs text-gray-500">{formatStudyTime(rank)}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StudyMemberRankingList;