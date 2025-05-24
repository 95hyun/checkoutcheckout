import { create } from 'zustand';
import { Character, Rarity } from '../types';
import { characterApi } from '../api/characterApi';
import { getRarityFromType } from '../constants/characterConstants';
import { getTodayKST, formatDateKST } from '../utils/timeUtils';

interface CharacterStore {
  characters: Character[];
  todayCharacter: Character | null;
  hasReceivedTodayCharacter: boolean;
  loading: boolean;
  error: string | null;
  
  fetchUserCharacters: () => Promise<void>;
  acquireCharacter: (characterType: string, rarity?: Rarity) => Promise<Character>;
  checkTodayCharacter: () => Promise<boolean>;
  resetError: () => void;
}

const useCharacterStore = create<CharacterStore>((set, get) => ({
  characters: [],
  todayCharacter: null,
  hasReceivedTodayCharacter: false,
  loading: false,
  error: null,
  
  fetchUserCharacters: async () => {
    try {
      set({ loading: true, error: null });
      
      // 기존 로컬 스토리지 데이터 검증 및 정리
      const storedCharacterData = localStorage.getItem('today_character');
      if (storedCharacterData) {
        try {
          const { date } = JSON.parse(storedCharacterData);
          const today = getTodayKST();
          // 날짜가 다르면 로컬 스토리지 정리
          if (date !== today) {
            localStorage.removeItem('today_character');
            console.log('이전 날짜의 캐릭터 데이터를 정리했습니다:', date, '!==', today);
          }
        } catch (error) {
          localStorage.removeItem('today_character');
          console.log('잘못된 형식의 캐릭터 데이터를 정리했습니다.');
        }
      }
      
      // 백엔드 서버 연결 시도
      try {
        const characters = await characterApi.getUserCharacters();
        
        // 타입 정규화 - 백엔드에서 오는 값이 CSS 클래스와 일치하는지 확인
        const normalizedCharacters = characters.map(char => {
          // 타입 값이 없는 경우 처리
          if (!char.type) {
            return { ...char, type: '' };
          }
          
          // 희귀도가 없는 경우 기본값 설정
          if (!char.rarity) {
            return { 
              ...char, 
              rarity: getRarityFromType(char.type) 
            };
          }
          
          // 타입 그대로 유지 - CSS에서 모든 케이스를 처리하도록 수정
          return { ...char };
        });
        
        // 오늘 획득한 캐릭터 확인 - 한국 시간 기준
        const today = getTodayKST();
        const todayCharacter = normalizedCharacters.find(c => 
          formatDateKST(c.acquiredDate) === today
        ) || null;
        
        // 로컬 스토리지에 저장
        if (todayCharacter) {
          localStorage.setItem('today_character', JSON.stringify({
            date: today,
            character: todayCharacter
          }));
        }
        
        set({ 
          characters: normalizedCharacters, 
          todayCharacter,
          hasReceivedTodayCharacter: !!todayCharacter,
          loading: false 
        });
      } catch (apiError) {
        // 백엔드 연결 실패 - 로컬 데이터 사용
        console.warn('백엔드 서버에 연결할 수 없어 로컬 데이터를 사용합니다:', apiError);
        
        // 로컬 스토리지에서 오늘 캐릭터 가져오기 - 한국 시간 기준
        const today = getTodayKST();
        const storedCharacterData = localStorage.getItem('today_character');
        let characters: Character[] = [];
        let todayCharacter = null;
        
        if (storedCharacterData) {
          const { date, character } = JSON.parse(storedCharacterData);
          if (date === today) {
            characters = [character];
            todayCharacter = character;
          }
        }
        
        set({ 
          characters, 
          todayCharacter,
          hasReceivedTodayCharacter: !!todayCharacter,
          loading: false 
        });
      }
    } catch (error) {
      set({ 
        error: '캐릭터 정보를 불러오는데 실패했습니다.', 
        loading: false 
      });
      console.error('Failed to fetch user characters:', error);
    }
  },
  
  acquireCharacter: async (characterType: string, rarity?: Rarity) => {
    try {
      set({ loading: true, error: null });
      console.log("캐릭터 획득 시도:", characterType, "희귀도:", rarity);
      
      // 희귀도가 없고 캐릭터 타입에 희귀도 정보가 포함되어 있는 경우 추출
      if (!rarity && characterType.includes('_')) {
        rarity = getRarityFromType(characterType);
        console.log("캐릭터 타입에서 희귀도 추출:", rarity);
      }
      
      // 백엔드 서버가 실행 중이 아닐 경우를 대비한 임시 처리
      try {
        const character = await characterApi.acquireCharacter(characterType, rarity);
        console.log("백엔드에서 캐릭터 획득 성공:", character);
        
        // 타입 정규화
        const normalizedCharacter = {
          ...character,
          // 타입 값 그대로 유지
          type: character.type || '',
          // 희귀도가 없으면 캐릭터 타입에 기반한 기본 희귀도 설정
          rarity: character.rarity || rarity || getRarityFromType(character.type)
        };
        
        // 상태 업데이트
        set((state) => ({ 
          characters: [...state.characters, normalizedCharacter],
          todayCharacter: normalizedCharacter,
          hasReceivedTodayCharacter: true,
          loading: false 
        }));
        
        // 성공 시 로컬 스토리지 업데이트 (백업) - 한국 시간 기준
        const today = getTodayKST();
        localStorage.setItem('today_character', JSON.stringify({
          date: today,
          character: normalizedCharacter
        }));
        
        return normalizedCharacter;
      } catch (apiError) {
        // 백엔드 연결 실패 - 로컬에서만 처리
        console.warn('백엔드 서버에 연결할 수 없어 로컬에서만 처리합니다:', apiError);
        
        // 임시 캐릭터 객체 생성
        const mockCharacter: Character = {
          id: Date.now(),
          type: characterType, // 타입 그대로 유지
          acquiredDate: new Date().toISOString(),
          rarity: rarity || getRarityFromType(characterType), // 희귀도 추가
        };
        console.log("로컬에서 임시 캐릭터 생성:", mockCharacter);
        
        set((state) => ({ 
          characters: [...state.characters, mockCharacter],
          todayCharacter: mockCharacter,
          hasReceivedTodayCharacter: true,
          loading: false 
        }));
        
        // 로컬 스토리지에 저장 - 한국 시간 기준
        const today = getTodayKST();
        localStorage.setItem('today_character', JSON.stringify({
          date: today,
          character: mockCharacter
        }));
        
        return mockCharacter;
      }
    } catch (error) {
      set({ 
        error: '캐릭터 획득에 실패했습니다.', 
        loading: false 
      });
      console.error('Failed to acquire character:', error);
      throw error;
    }
  },
  
  checkTodayCharacter: async () => {
    try {
      set({ loading: true, error: null });
      console.log("캐릭터 획득 상태 확인 시작");
      
      // 로컬 스토리지에서 먼저 확인 - 한국 시간 기준
      const today = getTodayKST();
      const storedCharacter = localStorage.getItem('today_character');
      
      if (storedCharacter) {
        const { date, character } = JSON.parse(storedCharacter);
        if (date === today) {
          console.log("로컬 스토리지에서 오늘 캐릭터 발견:", character);
          set({ 
            hasReceivedTodayCharacter: true, 
            todayCharacter: character, 
            loading: false 
          });
          return true;
        }
      }
      
      console.log("로컬 스토리지에 오늘 캐릭터 없음, 백엔드 확인 시도");
      
      // 백엔드 API 호출 시도
      try {
        const hasCharacter = await characterApi.checkTodayCharacter();
        console.log("백엔드 확인 결과 캐릭터 존재 여부:", hasCharacter);
        
        // 오늘 획득한 캐릭터가 있으면 상세 정보 가져오기
        let todayCharacter = null;
        if (hasCharacter) {
          const character = await characterApi.getTodayCharacter();
          console.log("백엔드에서 오늘 캐릭터 정보 가져옴:", character);
          
          // 타입 정규화
          if (character) {
            todayCharacter = {
              ...character,
              // 타입 값 그대로 유지
              type: character.type || '',
              // 희귀도가 없는 경우 추출
              rarity: character.rarity || getRarityFromType(character.type)
            };
            
            // 로컬 스토리지에도 저장 - 한국 시간 기준
            localStorage.setItem('today_character', JSON.stringify({
              date: today,
              character: todayCharacter
            }));
          }
        }
        
        set({ 
          hasReceivedTodayCharacter: hasCharacter, 
          todayCharacter, 
          loading: false 
        });
        return hasCharacter;
      } catch (apiError) {
        console.warn('백엔드 서버에 연결할 수 없습니다:', apiError);
        set({ loading: false });
        return false;
      }
    } catch (error) {
      set({ 
        error: '캐릭터 확인에 실패했습니다.', 
        loading: false 
      });
      console.error('Failed to check today character:', error);
      return false;
    }
  },
  
  resetError: () => set({ error: null }),
}));

export default useCharacterStore;