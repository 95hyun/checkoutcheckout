import React from 'react';
import { RankEntry, StudyRankEntry, Rarity } from '../types';
import { formatSecondsToReadable } from '../utils/timeUtils';
import { FaMedal, FaTrophy, FaUsers, FaClock, FaUser } from 'react-icons/fa';
import { getRarityFromType, ALL_CHARACTER_TYPES } from '../constants/characterConstants';

// 특정 사용자 ID에 대해 항상 같은 캐릭터 타입을 생성하는 함수
// 실제로는 없는 데이터이지만 UI 표시용으로만 사용
const getCharacterTypeForUserId = (userId: number): string => {
  // userId를 가능한 캐릭터 타입 배열의 인덱스로 변환
  const index = userId % ALL_CHARACTER_TYPES.length;
  return ALL_CHARACTER_TYPES[index];
};

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

  // 공부 시간 포맷팅 함수
  const formatStudyTime = (entry: RankEntry | StudyRankEntry): string => {
    if (isStudyRanking) {
      const studyEntry = entry as StudyRankEntry;
      // formattedStudyTime이 있으면 우선 사용
      if (studyEntry.formattedStudyTime && studyEntry.formattedStudyTime !== "00:00:00") {
        return studyEntry.formattedStudyTime;
      }
      // 없으면 studyTime을 초 단위로 변환 (밀리초 아님)
      return formatSecondsToReadable(studyEntry.studyTime);
    } else {
      // 사용자 랭킹의 경우 studyTime은 초 단위
      return formatSecondsToReadable((entry as RankEntry).studyTime);
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
              {isStudyRanking ? '스터디원 공부시간 합계' : '공부 시간'}
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {rankings.map((entry) => {
            const isCurrentUser = !isStudyRanking && currentUserId === (entry as RankEntry).userId;
            const userId = isStudyRanking ? (entry as StudyRankEntry).studyId : (entry as RankEntry).userId;
            const name = isStudyRanking ? (entry as StudyRankEntry).studyName : (entry as RankEntry).nickname;
            const studyTime = formatStudyTime(entry);
            
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
                    {isStudyRanking ? (
                      <FaUsers className="text-primary mr-2" />
                    ) : (
                      // 사용자 프로필 이미지 또는 기본 아이콘
                      <div className="w-8 h-8 rounded-full overflow-hidden relative mr-2">
                        {(() => {
                          // 백엔드에서 제공된 characterType 사용, 없으면 ID 기반으로 타입 생성
                          const characterType = ('characterType' in entry && entry.characterType) 
                            ? entry.characterType 
                            : getCharacterTypeForUserId((entry as RankEntry).userId);
                          
                          return (
                            <div className={`w-full h-full character-${characterType} character-image profile-rarity-${getRarityFromType(characterType)}`}>
                              {/* 희귀도 효과 */}
                              {(() => {
                                const rarity = getRarityFromType(characterType);
                                if (rarity === 'legendary') return <div className="profile-legendary-effect"></div>;
                                if (rarity === 'epic') return <div className="profile-epic-effect"></div>;
                                if (rarity === 'rare') return <div className="profile-rare-effect"></div>;
                                return null;
                              })()}
                            </div>
                          );
                        })()}
                      </div>
                    )}
                    <span>{name}</span>
                    {isCurrentUser && (
                      <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                        나
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <div className="flex items-center">
                    <FaClock className="text-gray-400 mr-2" />
                    {studyTime}
                  </div>
                </td>
              </tr>
            );
          })}
          
          {rankings.length === 0 && (
            <tr>
              <td colSpan={3} className="px-6 py-12 text-center text-sm text-gray-500">
                <div className="flex flex-col items-center justify-center">
                  <FaTrophy className="text-3xl text-gray-300 mb-2" />
                  <p>랭킹 데이터가 없습니다.</p>
                  <p className="text-xs mt-1">
                    {isStudyRanking 
                      ? '아직 등록된 스터디가 없거나 스터디 활동이 없습니다.' 
                      : '해당 기간에 공부 기록이 없습니다.'}
                  </p>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default RankingTable;