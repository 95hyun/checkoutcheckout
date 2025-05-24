import { Rarity } from '../types';

// 캐릭터 타입 정의 (통합된 단일 소스)
export const CHARACTER_TYPES = {
  COMMON: {
    RABBIT: 'common_rabbit',
    SQUIRREL: 'common_squirrel',
    HEDGEHOG: 'common_hedgehog',
    PIGEON: 'common_pigeon',
  },
  UNCOMMON: {
    CAT: 'uncommon_cat',
    DOG: 'uncommon_dog',
    BEAR: 'uncommon_bear',
    HAMSTER: 'uncommon_hamster',
  },
  RARE: {
    WOLF: 'rare_wolf',
    FOX: 'rare_fox',
    LION: 'rare_lion',
    PENGUIN: 'rare_penguin',
  },
  EPIC: {
    UNICORN: 'epic_unicorn',
    DRAGON: 'epic_dragon',
    PHOENIX: 'epic_phoneix', // 오타 수정: phoenix
    WHITE_TIGER: 'epic_whitetiger',
  },
  LEGENDARY: {
    DOGE: 'legendary_doge',
    PEPE: 'legendary_pepe',
    TRALELLOTRALALA: 'legendary_tralellotralala',
    CHILL_GUY: 'legendary_chillguy',
  },
} as const;

// 플랫 배열로 변환
export const ALL_CHARACTER_TYPES = [
  ...Object.values(CHARACTER_TYPES.COMMON),
  ...Object.values(CHARACTER_TYPES.UNCOMMON),
  ...Object.values(CHARACTER_TYPES.RARE),
  ...Object.values(CHARACTER_TYPES.EPIC),
  ...Object.values(CHARACTER_TYPES.LEGENDARY),
];

// 희귀도별 캐릭터 매핑
export const CHARACTERS_BY_RARITY: Record<Rarity, string[]> = {
  common: Object.values(CHARACTER_TYPES.COMMON),
  uncommon: Object.values(CHARACTER_TYPES.UNCOMMON),
  rare: Object.values(CHARACTER_TYPES.RARE),
  epic: Object.values(CHARACTER_TYPES.EPIC),
  legendary: Object.values(CHARACTER_TYPES.LEGENDARY),
};

// 희귀도별 확률 설정
export const RARITY_PROBABILITIES: Record<Rarity, number> = {
  common: 50,
  uncommon: 30,
  rare: 15,
  epic: 4,
  legendary: 1,
};

// 캐릭터 타입에서 희귀도 추출
export const getRarityFromType = (characterType: string): Rarity => {
  if (!characterType) return 'common';
  
  // 언더스코어로 분리하여 첫 번째 부분(희귀도) 확인
  const parts = characterType.split('_');
  const rarityPart = parts[0]?.toLowerCase();
  
  const validRarities: Rarity[] = ['common', 'uncommon', 'rare', 'epic', 'legendary'];
  
  if (validRarities.includes(rarityPart as Rarity)) {
    return rarityPart as Rarity;
  }
  
  return 'common';
};

// 캐릭터 이름 매핑
export const CHARACTER_NAMES: Record<string, string> = {
  // Common
  [CHARACTER_TYPES.COMMON.RABBIT]: '토끼',
  [CHARACTER_TYPES.COMMON.SQUIRREL]: '다람쥐',
  [CHARACTER_TYPES.COMMON.HEDGEHOG]: '고슴도치',
  [CHARACTER_TYPES.COMMON.PIGEON]: '비둘기',
  
  // Uncommon
  [CHARACTER_TYPES.UNCOMMON.CAT]: '고양이',
  [CHARACTER_TYPES.UNCOMMON.DOG]: '강아지',
  [CHARACTER_TYPES.UNCOMMON.BEAR]: '곰',
  [CHARACTER_TYPES.UNCOMMON.HAMSTER]: '햄스터',
  
  // Rare
  [CHARACTER_TYPES.RARE.WOLF]: '늑대',
  [CHARACTER_TYPES.RARE.FOX]: '여우',
  [CHARACTER_TYPES.RARE.LION]: '사자',
  [CHARACTER_TYPES.RARE.PENGUIN]: '펭귄',
  
  // Epic
  [CHARACTER_TYPES.EPIC.UNICORN]: '유니콘',
  [CHARACTER_TYPES.EPIC.DRAGON]: '드래곤',
  [CHARACTER_TYPES.EPIC.PHOENIX]: '불사조',
  [CHARACTER_TYPES.EPIC.WHITE_TIGER]: '백호',
  
  // Legendary
  [CHARACTER_TYPES.LEGENDARY.DOGE]: '도지',
  [CHARACTER_TYPES.LEGENDARY.PEPE]: '페페',
  [CHARACTER_TYPES.LEGENDARY.TRALELLOTRALALA]: '트라랄라',
  [CHARACTER_TYPES.LEGENDARY.CHILL_GUY]: '칠가이',
};

// 캐릭터 랜덤 선택 유틸리티
export const getRandomRarity = (): Rarity => {
  const rand = Math.random() * 100;
  let cumulative = 0;
  
  for (const [rarity, probability] of Object.entries(RARITY_PROBABILITIES)) {
    cumulative += probability;
    if (rand <= cumulative) {
      return rarity as Rarity;
    }
  }
  
  return 'common';
};

export const getRandomCharacterByRarity = (rarity: Rarity): string => {
  const characters = CHARACTERS_BY_RARITY[rarity];
  if (!characters.length) return CHARACTER_TYPES.COMMON.RABBIT;
  
  return characters[Math.floor(Math.random() * characters.length)];
};
