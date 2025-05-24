import React from 'react';
import { Rarity } from '../types';

interface CharacterCardProps {
  characterType: string;
  className?: string;
}

// 희귀도별 색상
const rarityColors: Record<Rarity, string> = {
  'common': 'bg-gray-500',
  'uncommon': 'bg-green-500',
  'rare': 'bg-blue-500',
  'epic': 'bg-purple-500',
  'legendary': 'bg-yellow-500'
};

// 희귀도별 이름
const rarityNames: Record<Rarity, string> = {
  'common': '일반',
  'uncommon': '고급',
  'rare': '희귀',
  'epic': '영웅',
  'legendary': '전설'
};

// 캐릭터 타입 문자열에서 희귀도 가져오기
const getRarityForCharacter = (characterType: string): Rarity => {
  if (!characterType) return 'common';
  const rarity = characterType.split('_')[0] as Rarity;
  return rarity || 'common';
};

const CharacterCard: React.FC<CharacterCardProps> = ({ characterType, className = '' }) => {
  const rarity = getRarityForCharacter(characterType);

  return (
    <div className={`relative ${className}`}>
      <div className={`w-full h-full character-${characterType} character-image`}></div>
      <div className={`absolute top-2 right-2 ${rarityColors[rarity]} text-white px-2 py-1 rounded-full text-xs font-bold`}>
        {rarityNames[rarity]}
      </div>
    </div>
  );
};

export default CharacterCard; 