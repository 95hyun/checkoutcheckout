import React from 'react';
import { RankEntry } from '../types';
import { formatSecondsToReadable } from '../utils/timeUtils';
import { FaMedal, FaTrophy } from 'react-icons/fa';

interface RankingTableProps {
  rankings: RankEntry[];
  currentUserId?: number;
}

const RankingTable: React.FC<RankingTableProps> = ({ rankings, currentUserId }) => {
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
              닉네임
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              공부 시간
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {rankings.map((entry) => (
            <tr 
              key={entry.userId}
              className={currentUserId === entry.userId ? 'bg-blue-50' : ''}
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
                {entry.nickname}
                {currentUserId === entry.userId && (
                  <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                    나
                  </span>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                {formatSecondsToReadable(entry.studyTime)}
              </td>
            </tr>
          ))}
          
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