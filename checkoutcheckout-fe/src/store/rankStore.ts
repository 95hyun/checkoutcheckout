import { create } from 'zustand';
import { DailyRanking } from '../types';
import { rankApi } from '../api/rankApi';

interface RankStore {
  dailyRanking: DailyRanking | null;
  isLoading: boolean;
  error: string | null;
  
  fetchDailyRanking: (date?: Date) => Promise<void>;
}

const useRankStore = create<RankStore>((set) => ({
  dailyRanking: null,
  isLoading: false,
  error: null,
  
  fetchDailyRanking: async (date) => {
    set({ isLoading: true, error: null });
    try {
      const dailyRanking = await rankApi.getDailyRanking(date);
      set({ dailyRanking, isLoading: false });
    } catch (error) {
      console.error('Failed to fetch daily ranking:', error);
      set({ 
        error: '랭킹 데이터를 불러오는데 실패했습니다.', 
        isLoading: false 
      });
    }
  },
}));

export default useRankStore;