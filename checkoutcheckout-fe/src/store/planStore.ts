import { create } from 'zustand';
import { StudyPlan, StudyPlansByDate, StudyPlanItem, StudyPlanRequest } from '../types';
import { planApi } from '../api/planApi';

interface PlanStore {
  plans: StudyPlansByDate[];
  currentDatePlans: StudyPlansByDate | null;
  isLoading: boolean;
  error: string | null;
  
  getPlansByDateRange: (startDate: Date, endDate: Date) => Promise<StudyPlansByDate[]>;
  getPlansByDate: (date: Date) => Promise<StudyPlansByDate | null>;
  addPlanItem: (date: Date, plan: StudyPlanRequest) => Promise<StudyPlansByDate | null>;
  updatePlanItem: (date: Date, itemId: number, plan: StudyPlanRequest) => Promise<StudyPlansByDate | null>;
  deletePlanItem: (date: Date, itemId: number) => Promise<StudyPlansByDate | null>;
  completePlanItem: (date: Date, itemId: number) => Promise<StudyPlansByDate | null>;
  resetError: () => void;
}

const usePlanStore = create<PlanStore>((set, get) => ({
  plans: [],
  currentDatePlans: null,
  isLoading: false,
  error: null,
  
  getPlansByDateRange: async (startDate: Date, endDate: Date) => {
    set({ isLoading: true, error: null });
    try {
      const plans = await planApi.getPlansByDateRange(startDate, endDate);
      set({ plans, isLoading: false });
      return plans;
    } catch (error) {
      console.error('계획 조회 실패:', error);
      set({ 
        error: '계획 조회에 실패했습니다.',
        isLoading: false 
      });
      return [];
    }
  },
  
  getPlansByDate: async (date: Date) => {
    set({ isLoading: true, error: null });
    try {
      const plansByDate = await planApi.getPlansByDate(date);
      
      // 응답 데이터 안전 처리
      if (plansByDate && !plansByDate.items) {
        plansByDate.items = [];
      }
      
      set({ currentDatePlans: plansByDate, isLoading: false });
      
      // 콘솔에 로그 추가하여 데이터 확인
      console.log('Store에 설정된 계획 데이터:', plansByDate);
      
      return plansByDate;
    } catch (error) {
      console.error('계획 조회 실패:', error);
      set({ 
        error: '계획 조회에 실패했습니다.',
        isLoading: false 
      });
      return null;
    }
  },
  
  addPlanItem: async (date: Date, plan: StudyPlanRequest) => {
    set({ isLoading: true, error: null });
    try {
      const updatedPlans = await planApi.addPlanItem(date, plan);
      
      // 계획 목록 업데이트
      const allPlans = [...get().plans];
      const existingPlanIndex = allPlans.findIndex(p => p.date === updatedPlans.date);
      
      if (existingPlanIndex >= 0) {
        allPlans[existingPlanIndex] = updatedPlans;
      } else {
        allPlans.push(updatedPlans);
      }
      
      set({
        plans: allPlans,
        currentDatePlans: updatedPlans,
        isLoading: false
      });
      
      return updatedPlans;
    } catch (error) {
      console.error('계획 저장 실패:', error);
      set({ 
        error: '계획 저장에 실패했습니다.',
        isLoading: false 
      });
      return null;
    }
  },
  
  updatePlanItem: async (date: Date, itemId: number, plan: StudyPlanRequest) => {
    set({ isLoading: true, error: null });
    try {
      const updatedPlans = await planApi.updatePlanItem(date, itemId, plan);
      
      // 계획 목록 업데이트
      const allPlans = [...get().plans];
      const existingPlanIndex = allPlans.findIndex(p => p.date === updatedPlans.date);
      
      if (existingPlanIndex >= 0) {
        allPlans[existingPlanIndex] = updatedPlans;
      }
      
      set({
        plans: allPlans,
        currentDatePlans: updatedPlans,
        isLoading: false
      });
      
      return updatedPlans;
    } catch (error) {
      console.error('계획 항목 수정 실패:', error);
      set({ 
        error: '계획 수정에 실패했습니다.',
        isLoading: false 
      });
      return null;
    }
  },
  
  deletePlanItem: async (date: Date, itemId: number) => {
    set({ isLoading: true, error: null });
    try {
      const updatedPlans = await planApi.deletePlanItem(date, itemId);
      
      // 계획 목록 업데이트
      const allPlans = [...get().plans];
      const existingPlanIndex = allPlans.findIndex(p => p.date === updatedPlans?.date);
      
      if (existingPlanIndex >= 0) {
        if (updatedPlans?.items.length === 0) {
          // 항목이 없으면 목록에서 제거
          allPlans.splice(existingPlanIndex, 1);
        } else {
          // 항목이 있으면 업데이트
          allPlans[existingPlanIndex] = updatedPlans;
        }
      }
      
      set({
        plans: allPlans,
        currentDatePlans: updatedPlans,
        isLoading: false
      });
      
      return updatedPlans;
    } catch (error) {
      console.error('계획 삭제 실패:', error);
      set({ 
        error: '계획 삭제에 실패했습니다.',
        isLoading: false 
      });
      return null;
    }
  },
  
  completePlanItem: async (date: Date, itemId: number) => {
    set({ isLoading: true, error: null });
    try {
      const updatedPlans = await planApi.completePlanItem(date, itemId);
      
      // 계획 목록 업데이트
      const allPlans = [...get().plans];
      const existingPlanIndex = allPlans.findIndex(p => p.date === updatedPlans.date);
      
      if (existingPlanIndex >= 0) {
        allPlans[existingPlanIndex] = updatedPlans;
      }
      
      set({
        plans: allPlans,
        currentDatePlans: updatedPlans,
        isLoading: false
      });
      
      return updatedPlans;
    } catch (error) {
      console.error('계획 완료 처리 실패:', error);
      set({ 
        error: '계획 완료 처리에 실패했습니다.',
        isLoading: false 
      });
      return null;
    }
  },
  
  resetError: () => {
    set({ error: null });
  }
}));

export default usePlanStore;