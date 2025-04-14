import React from 'react';
import { RankEntry, StudyRankEntry } from '../types';
import { formatSecondsToReadable } from '../utils/timeUtils';
import { FaMedal, FaTrophy, FaUsers } from 'react-icons/fa';

interface RankingTableProps {
  rankings: RankEntry[] | StudyRankEntry[];
  currentUserId?: number | null;
  isStudyRanking?: boolean;
}

const RankingTable: React.FC<RankingTableProps> = ({ rankings, currentUserId, isStudyRanking = false }) => {
  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <FaTrophy className="text-yellow-500" />;
      case 2:
        return <FaMedal className="text-gray-400" />;
      case 3:
        return <FaMedal className="text-amber-600" />;
      default:
        return null;
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              순위
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              {isStudyRanking ? '스터디명' : '닉네임'}
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              공부 시간
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {rankings.map((entry) => {
            const isCurrentUser = !isStudyRanking && currentUserId === (entry as RankEntry).userId;
            const userId = isStudyRanking ? (entry as StudyRankEntry).studyId : (entry as RankEntry).userId;
            const name = isStudyRanking ? (entry as StudyRankEntry).studyName : (entry as RankEntry).nickname;
            const studyTime = isStudyRanking 
              ? (entry as StudyRankEntry).formattedStudyTime 
              : formatSecondsToReadable((entry as RankEntry).studyTime);
            
            return (
              <tr 
                key={userId}
                className={isCurrentUser ? 'bg-blue-50' : ''}
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex items-center">
                    {getRankIcon(entry.rank)}
                    <span className={entry.rank <= 3 ? 'ml-2 font-bold' : 'ml-2'}>
                      {entry.rank}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <div className="flex items-center">
                    {isStudyRanking && <FaUsers className="text-primary mr-2" />}
                    <span>{name}</span>
                    {isCurrentUser && (
                      <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                        나
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {studyTime}
                </td>
              </tr>
            );
          })}
          
          {rankings.length === 0 && (
            <tr>
              <td colSpan={3} className="px-6 py-4 text-center text-sm text-gray-500">
                랭킹 데이터가 없습니다.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default RankingTable;

export default RankingTable;