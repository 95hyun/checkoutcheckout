import React from 'react';
import { FaMedal, FaTrophy, FaAward, FaUser, FaClock } from 'react-icons/fa';
import { StudyMemberRankEntry, Rarity } from '../types';
import { formatSecondsToReadable } from '../utils/timeUtils';

// 캐릭터 희귀도 매핑 (기본값 설정 - 관리 용이성을 위해 대문자 기준)
const characterRarityMap: Record<string, Rarity> = {
  // Common 동물 캐릭터
  'COMMON_RABBIT': 'common',
  'COMMON_SQUIRREL': 'common',
  'COMMON_HEDGEHOG': 'common',
  'COMMON_PIGEON': 'common',
  
  // Uncommon 동물 캐릭터
  'UNCOMMON_CAT': 'uncommon',
  'UNCOMMON_DOG': 'uncommon',
  'UNCOMMON_BEAR': 'uncommon',
  'UNCOMMON_HAMSTER': 'uncommon',
  
  // Rare 동물 캐릭터
  'RARE_WOLF': 'rare',
  'RARE_FOX': 'rare',
  'RARE_LION': 'rare',
  'RARE_PENGUIN': 'rare',
  
  // Epic 동물 캐릭터
  'EPIC_UNICORN': 'epic',
  'EPIC_DRAGON': 'epic',
  'EPIC_PHONEIX': 'epic',
  'EPIC_WHITETIGER': 'epic',
  
  // Legendary 동물 캐릭터
  'LEGENDARY_DOGE': 'legendary',
  'LEGENDARY_PEPE': 'legendary',
  'LEGENDARY_TRALELLOTRALALA': 'legendary',
  'LEGENDARY_CHILLGUY': 'legendary'
};

// 캐릭터 타입 문자열에서 희귀도 가져오기 (대소문자 및 형식 정규화)
const getRarityForCharacter = (characterType: string): Rarity => {
  // 타입이 없으면 common 반환
  if (!characterType) return 'common';
  
  // 카멜케이스(demonFemale) -> DEMON_FEMALE 처리
  if (/^[a-z]+[A-Z]/.test(characterType)) {
    // 카멜 케이스 -> 스네이크 케이스
    const snakeCase = characterType.replace(/([a-z])([A-Z])/g, '$1_$2').toUpperCase();
    return characterRarityMap[snakeCase] || 'common';
  }
  
  // 소문자(common_rabbit)인 경우 'COMMON_RABBIT' 변환
  if (/^[a-z_]+$/.test(characterType)) {
    const upperCase = characterType.toUpperCase();
    return characterRarityMap[upperCase] || 'common';
  }
  
  // 이미 SNAKE_CASE이거나 다른 형식인 경우 그대로 검색
  return characterRarityMap[characterType.toUpperCase()] || 'common';
};

// 가능한 캐릭터 타입 목록 (시드로 사용할 용도)
const possibleCharacterTypes = [
  'common_rabbit', 'common_squirrel', 'common_hedgehog', 'common_pigeon',
  'uncommon_cat', 'uncommon_dog', 'uncommon_bear', 'uncommon_hamster',
  'rare_wolf', 'rare_fox', 'rare_lion', 'rare_penguin',
  'epic_unicorn', 'epic_dragon', 'epic_phoneix', 'epic_whitetiger',
  'legendary_doge', 'legendary_pepe', 'legendary_tralellotralala', 'legendary_chillguy'
];

// 특정 사용자 ID에 대해 항상 같은 캐릭터 타입을 생성하는 함수
// 실제로는 없는 데이터이지만 UI 표시용으로만 사용
const getCharacterTypeForUserId = (userId: number): string => {
  // userId를 가능한 캐릭터 타입 배열의 인덱스로 변환
  const index = userId % possibleCharacterTypes.length;
  return possibleCharacterTypes[index];
};

interface StudyMemberRankingListProps {
  rankings: StudyMemberRankEntry[];
  period: string;
  currentUserId: number;
  totalStudyTime?: number;
  formattedTotalStudyTime?: string;
}

const StudyMemberRankingList: React.FC<StudyMemberRankingListProps> = ({ 
  rankings, 
  period,
  currentUserId,
  totalStudyTime,
  formattedTotalStudyTime
}) => {
  // 공부 시간 표시 형식 (서버에서 오는 형식을 사용하거나 직접 계산)
  const formatStudyTime = (entry: StudyMemberRankEntry): string => {
    if (entry.formattedStudyTime && entry.formattedStudyTime !== "00:00:00") {
      return entry.formattedStudyTime;
    }
    
    // 서버에서 온 형식이 없거나 00:00:00인 경우 직접 계산
    // studyTime은 초 단위로 저장됨
    return formatSecondsToReadable(entry.studyTime);
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
      
      {/* 총 공부시간 표시 */}
      {totalStudyTime !== undefined && (
        <div className="bg-gray-100 p-4 rounded-lg mb-6 text-center">
          <div className="flex items-center justify-center">
            <FaClock className="text-primary mr-2" />
            <span className="font-semibold">전체 스터디원 공부시간 합계:</span>
            <span className="ml-2 font-bold text-primary">
              {formattedTotalStudyTime || formatSecondsToReadable(totalStudyTime)}
            </span>
          </div>
        </div>
      )}
      
      {/* 상위 3위 */}
      <div className="flex justify-center items-end mb-10 space-x-4">
        {rankings.length > 1 && (
          <div className={`text-center ${currentUserId === rankings[1].userId ? 'ring-2 ring-primary ring-offset-2' : ''}`}>
            <div className="flex flex-col items-center">
              <div className="relative">
                <div className="h-16 w-16 rounded-full overflow-hidden relative bg-silver flex items-center justify-center shadow-lg">
                  {/* 프로필 이미지 (랭킹에 캐릭터 타입이 없는 경우 메달 아이콘으로 대체) */}
                  {(() => {
                    // 이미 캐릭터 타입이 있거나 없으면 ID 기반으로 타입 생성
                    const characterType = ('characterType' in rankings[1] && rankings[1].characterType) 
                      ? rankings[1].characterType 
                      : getCharacterTypeForUserId(rankings[1].userId);
                    
                    return (
                      <div className={`w-full h-full character-${characterType} character-image profile-rarity-${getRarityForCharacter(characterType)}`}>
                        {/* 희귀도 효과 */}
                        {(() => {
                          const rarity = getRarityForCharacter(characterType);
                          if (rarity === 'legendary') return <div className="profile-legendary-effect"></div>;
                          if (rarity === 'epic') return <div className="profile-epic-effect"></div>;
                          if (rarity === 'rare') return <div className="profile-rare-effect"></div>;
                          return null;
                        })()}
                      </div>
                    );
                  })()}
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
              <div className="h-20 w-20 rounded-full overflow-hidden relative bg-gold flex items-center justify-center shadow-lg">
                {/* 프로필 이미지 (랭킹에 캐릭터 타입이 없는 경우 트로피 아이콘으로 대체) */}
                {(() => {
                  // 이미 캐릭터 타입이 있거나 없으면 ID 기반으로 타입 생성
                  const characterType = ('characterType' in rankings[0] && rankings[0].characterType) 
                    ? rankings[0].characterType 
                    : getCharacterTypeForUserId(rankings[0].userId);
                  
                  return (
                    <div className={`w-full h-full character-${characterType} character-image profile-rarity-${getRarityForCharacter(characterType)}`}>
                      {/* 희귀도 효과 */}
                      {(() => {
                        const rarity = getRarityForCharacter(characterType);
                        if (rarity === 'legendary') return <div className="profile-legendary-effect"></div>;
                        if (rarity === 'epic') return <div className="profile-epic-effect"></div>;
                        if (rarity === 'rare') return <div className="profile-rare-effect"></div>;
                        return null;
                      })()}
                    </div>
                  );
                })()}
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
                <div className="h-16 w-16 rounded-full overflow-hidden relative bg-bronze flex items-center justify-center shadow-lg">
                  {/* 프로필 이미지 (랭킹에 캐릭터 타입이 없는 경우 메달 아이콘으로 대체) */}
                  {(() => {
                    // 이미 캐릭터 타입이 있거나 없으면 ID 기반으로 타입 생성
                    const characterType = ('characterType' in rankings[2] && rankings[2].characterType) 
                      ? rankings[2].characterType 
                      : getCharacterTypeForUserId(rankings[2].userId);
                    
                    return (
                      <div className={`w-full h-full character-${characterType} character-image profile-rarity-${getRarityForCharacter(characterType)}`}>
                        {/* 희귀도 효과 */}
                        {(() => {
                          const rarity = getRarityForCharacter(characterType);
                          if (rarity === 'legendary') return <div className="profile-legendary-effect"></div>;
                          if (rarity === 'epic') return <div className="profile-epic-effect"></div>;
                          if (rarity === 'rare') return <div className="profile-rare-effect"></div>;
                          return null;
                        })()}
                      </div>
                    );
                  })()}
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
              <div className="flex-shrink-0 h-10 w-10 rounded-full overflow-hidden relative mr-3">
                {/* 프로필 이미지 */}
                {(() => {
                  // 이미 캐릭터 타입이 있거나 없으면 ID 기반으로 타입 생성
                  const characterType = ('characterType' in rank && rank.characterType) 
                    ? rank.characterType 
                    : getCharacterTypeForUserId(rank.userId);
                  
                  return (
                    <div className={`w-full h-full character-${characterType} character-image profile-rarity-${getRarityForCharacter(characterType)}`}>
                      {/* 희귀도 효과 */}
                      {(() => {
                        const rarity = getRarityForCharacter(characterType);
                        if (rarity === 'legendary') return <div className="profile-legendary-effect"></div>;
                        if (rarity === 'epic') return <div className="profile-epic-effect"></div>;
                        if (rarity === 'rare') return <div className="profile-rare-effect"></div>;
                        return null;
                      })()}
                    </div>
                  );
                })()}
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