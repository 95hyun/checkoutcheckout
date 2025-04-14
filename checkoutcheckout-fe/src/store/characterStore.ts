import { create } from 'zustand';
import { Character } from '../types';
import { characterApi } from '../api/characterApi';

interface CharacterStore {
  characters: Character[];
  todayCharacter: Character | null;
  hasReceivedTodayCharacter: boolean;
  loading: boolean;
  error: string | null;
  
  fetchUserCharacters: () => Promise<void>;
  acquireCharacter: (characterType: string) => Promise<Character>;
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
      
      // 백엔드 서버 연결 시도
      try {
        const characters = await characterApi.getUserCharacters();
        
        // 타입 정규화 - 백엔드에서 오는 값이 CSS 클래스와 일치하는지 확인
        const normalizedCharacters = characters.map(char => {
          // 타입 값이 없는 경우 처리
          if (!char.type) {
            return { ...char, type: '' };
          }
          
          // 타입 그대로 유지 - CSS에서 모든 케이스를 처리하도록 수정
          return { ...char };
        });
        
        // 오늘 획득한 캐릭터 확인
        const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD 형식
        const todayCharacter = normalizedCharacters.find(c => 
          new Date(c.acquiredDate).toISOString().split('T')[0] === today
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
        
        // 로컬 스토리지에서 오늘 캐릭터 가져오기
        const today = new Date().toISOString().split('T')[0];
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
  
  acquireCharacter: async (characterType: string) => {
    try {
      set({ loading: true, error: null });
      console.log("캐릭터 획득 시도:", characterType);
      
      // 백엔드 서버가 실행 중이 아닐 경우를 대비한 임시 처리
      try {
        const character = await characterApi.acquireCharacter(characterType);
        console.log("백엔드에서 캐릭터 획득 성공:", character);
        
        // 타입 정규화
        const normalizedCharacter = {
          ...character,
          // 타입 값 그대로 유지
          type: character.type || ''
        };
        
        // 상태 업데이트
        set((state) => ({ 
          characters: [...state.characters, normalizedCharacter],
          todayCharacter: normalizedCharacter,
          hasReceivedTodayCharacter: true,
          loading: false 
        }));
        
        // 성공 시 로컬 스토리지 업데이트 (백업)
        const today = new Date().toISOString().split('T')[0];
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
        };
        console.log("로컬에서 임시 캐릭터 생성:", mockCharacter);
        
        set((state) => ({ 
          characters: [...state.characters, mockCharacter],
          todayCharacter: mockCharacter,
          hasReceivedTodayCharacter: true,
          loading: false 
        }));
        
        // 로컬 스토리지에 저장
        const today = new Date().toISOString().split('T')[0];
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
      
      // 로컬 스토리지에서 먼저 확인
      const today = new Date().toISOString().split('T')[0];
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
              type: character.type || ''
            };
            
            // 로컬 스토리지에도 저장
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