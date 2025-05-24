import apiClient from './apiClient';
import { StudyPlan, StudyPlansByDate, StudyPlanItem, StudyPlanRequest } from '../types';
import { format, parseISO } from 'date-fns';

// 로컬 스토리지 키 (백엔드 API 연동 실패 시 폴백용)
const PLANS_STORAGE_KEY = 'study_plans';

// 로컬 스토리지에서 계획 읽기
const getPlansFromStorage = (): StudyPlansByDate[] => {
  const storedPlans = localStorage.getItem(PLANS_STORAGE_KEY);
  if (storedPlans) {
    return JSON.parse(storedPlans);
  }
  return [];
};

// 로컬 스토리지에 계획 저장
const savePlansToStorage = (plans: StudyPlansByDate[]): void => {
  localStorage.setItem(PLANS_STORAGE_KEY, JSON.stringify(plans));
};

// 특정 날짜의 계획들 조회 (로컬 스토리지에서)
const getPlansForDateFromStorage = (date: string): StudyPlansByDate | null => {
  const plans = getPlansFromStorage();
  const planForDate = plans.find(p => p.date === date);
  return planForDate || null;
};

// 새로운 계획 아이템 생성
const createPlanItem = (content: string, plannedDuration: number): StudyPlanItem => {
  return {
    id: Date.now(),
    content,
    plannedDuration,
    isCompleted: false
  };
};

// 로컬 메모리 캐시
const plansCache: Record<string, StudyPlansByDate> = {};

export const planApi = {
  // 특정 날짜의 계획 조회
  getPlansByDate: async (date: Date): Promise<StudyPlansByDate | null> => {
    try {
      const formattedDate = format(date, 'yyyy-MM-dd');
      
      // 캐시된 계획이 있으면 사용
      if (plansCache[formattedDate]) {
        console.log('캐시된 데이터 사용 (getPlansByDate):', plansCache[formattedDate]);
        return plansCache[formattedDate];
      }
      
      try {
        // 백엔드 API 호출
        const response = await apiClient.get<{data: StudyPlan}>(`/api/plans/${formattedDate}`);
        
        console.log('백엔드 API 응답 (getPlansByDate):', response.data);
        
        // 백엔드에서 받은 단일 계획을 여러 항목이 있는 계획으로 변환
        // 백엔드에서는 하나의 날짜에 하나의 계획만 저장하므로, 여러 항목을 구분하는 방법 필요
        // 여기서는 content에 JSON 문자열로 여러 항목을 저장했다고 가정
        
        const plan = response.data.data;
        let planItems: StudyPlanItem[] = [];
        
        try {
          // 백엔드 응답을 항목 배열로 변환
          // 여러 항목 형식인지 확인
          if (plan.content && plan.content.startsWith('[') && plan.content.endsWith(']')) {
            // JSON 배열 형식인 경우
            const items = JSON.parse(plan.content);
            if (Array.isArray(items)) {
              planItems = items.map((item, index) => ({
                id: plan.id * 100 + index, // 고유 ID 생성
                content: item.content || item,
                plannedDuration: item.plannedDuration || plan.plannedDuration || 3600, 
                isCompleted: item.isCompleted || plan.isCompleted || false
              }));
            }
          } else {
            // 단일 항목인 경우
            planItems = [{
              id: plan.id || Date.now(),
              content: plan.content,
              plannedDuration: plan.plannedDuration,
              isCompleted: plan.isCompleted
            }];
          }
        } catch (e) {
          // JSON 파싱 실패 시 단일 항목으로 처리
          console.warn('계획 내용 파싱 실패, 단일 항목으로 처리:', e);
          planItems = [{
            id: plan.id || Date.now(),
            content: plan.content,
            plannedDuration: plan.plannedDuration,
            isCompleted: plan.isCompleted
          }];
        }
        
        const plansByDate = {
          date: formattedDate,
          items: planItems
        };
        
        // 캐시에 저장
        plansCache[formattedDate] = plansByDate;
        
        console.log('변환된 데이터 (getPlansByDate):', plansByDate);
        return plansByDate;
        
      } catch (apiError: any) {
        // 404 에러는 계획이 없는 경우일 수 있음
        if (apiError.response && apiError.response.status === 404) {
          console.log('계획이 없습니다:', formattedDate);
          const emptyPlan = {
            date: formattedDate,
            items: []
          };
          plansCache[formattedDate] = emptyPlan;
          return emptyPlan;
        }
        
        console.log('백엔드 API 호출 실패, 로컬 스토리지 사용:', apiError);
        
        // API 호출 실패 시 로컬 스토리지에서 조회
        const planForDate = getPlansForDateFromStorage(formattedDate);
        
        // 데이터 없는 경우 빈 계획 항목 반환
        if (!planForDate) {
          const emptyPlan = {
            date: formattedDate,
            items: []
          };
          plansCache[formattedDate] = emptyPlan;
          return emptyPlan;
        }
        
        // 로컬 스토리지에서 가져온 데이터에 items가 없는 경우 추가
        if (!planForDate.items) {
          planForDate.items = [];
        }
        
        // 캐시에 저장
        plansCache[formattedDate] = planForDate;
        
        return planForDate;
      }
    } catch (error) {
      console.error('API 오류 - 계획 조회:', error);
      return null;
    }
  },
  
  // 특정 기간의 계획 조회
  getPlansByDateRange: async (startDate: Date, endDate: Date): Promise<StudyPlansByDate[]> => {
    try {
      const formattedStartDate = format(startDate, 'yyyy-MM-dd');
      const formattedEndDate = format(endDate, 'yyyy-MM-dd');
      
      try {
        // 백엔드 API 호출
        const response = await apiClient.get<{data: StudyPlan[]}>('/api/plans', {
          params: {
            startDate: formattedStartDate,
            endDate: formattedEndDate
          }
        });
        
        console.log('백엔드 API 응답 (getPlansByDateRange):', response.data);
        
        // 백엔드에서 받은 계획 데이터 정리
        const plansByDate: Record<string, StudyPlansByDate> = {};
        
        // 각 계획을 날짜별로 그룹화
        response.data.data.forEach(plan => {
          const planDate = plan.date;
          if (!planDate) return;
          
          if (!plansByDate[planDate]) {
            plansByDate[planDate] = {
              date: planDate,
              items: []
            };
          }
          
          // 계획 내용이 JSON 배열 형식인지 확인
          try {
            if (plan.content && plan.content.startsWith('[') && plan.content.endsWith(']')) {
              // JSON 배열 형식인 경우
              const items = JSON.parse(plan.content);
              if (Array.isArray(items)) {
                const planItems = items.map((item, index) => ({
                  id: plan.id * 100 + index, // 고유 ID 생성
                  content: item.content || item,
                  plannedDuration: item.plannedDuration || plan.plannedDuration || 3600,
                  isCompleted: item.isCompleted || plan.isCompleted || false
                }));
                plansByDate[planDate].items.push(...planItems);
                return;
              }
            }
          } catch (e) {
            console.warn('계획 내용 파싱 실패, 단일 항목으로 처리:', e);
          }
          
          // 단일 항목으로 처리
          plansByDate[planDate].items.push({
            id: plan.id || Date.now(),
            content: plan.content,
            plannedDuration: plan.plannedDuration,
            isCompleted: plan.isCompleted
          });
        });
        
        // Object를 배열로 변환
        const plansByDateList = Object.values(plansByDate);
        
        // 캐시 업데이트
        plansByDateList.forEach(plan => {
          plansCache[plan.date] = plan;
        });
        
        return plansByDateList;
      } catch (apiError) {
        console.log('백엔드 API 호출 실패, 로컬 스토리지 사용:', apiError);
        
        // API 호출 실패 시 로컬 스토리지에서 조회
        const plans = getPlansFromStorage();
        return plans.filter(plan => {
          return plan.date >= formattedStartDate && plan.date <= formattedEndDate;
        });
      }
    } catch (error) {
      console.error('API 오류 - 기간별 계획 조회:', error);
      return [];
    }
  },
  
  // 계획 생성 또는 업데이트 
  // 백엔드는 /api/plans/{date} 형식을 사용
  addPlanItem: async (date: Date, plan: StudyPlanRequest): Promise<StudyPlansByDate> => {
    try {
      const formattedDate = format(date, 'yyyy-MM-dd');
      
      // 기존 계획 불러오기
      let existingPlans = plansCache[formattedDate] || await planApi.getPlansByDate(date);
      if (!existingPlans) {
        existingPlans = { date: formattedDate, items: [] };
      }
      
      // 새 계획 항목 생성
      const newItem = {
        id: Date.now(),
        content: plan.content,
        plannedDuration: plan.plannedDuration,
        isCompleted: false
      };
      
      // 기존 계획에 새 항목 추가
      const updatedItems = [...existingPlans.items, newItem];
      
      // 백엔드는 하나의 계획만 지원하므로, 여러 항목을 JSON 배열로 변환
      // 기존 항목과 새 항목을 포함한 전체 항목 목록을 JSON 배열로 저장
      const allItemsJson = JSON.stringify(updatedItems);
      
      try {
        // 백엔드 API 호출 - POST /api/plans/{date}
        // 전체 항목 목록을 content에 JSON 배열로 저장
        const response = await apiClient.post<{data: StudyPlan}>(`/api/plans/${formattedDate}`, {
          content: allItemsJson,
          plannedDuration: plan.plannedDuration // 가장 최근 계획의 시간을 사용
        });
        
        console.log('백엔드 API 응답 (addPlanItem):', response.data);
        
        // 업데이트된 계획
        const updatedPlansByDate = {
          date: formattedDate,
          items: updatedItems
        };
        
        // 캐시 업데이트
        plansCache[formattedDate] = updatedPlansByDate;
        
        console.log('변환된 데이터 (addPlanItem):', updatedPlansByDate);
        return updatedPlansByDate;
      } catch (apiError) {
        console.log('백엔드 API 호출 실패, 로컬 스토리지 사용:', apiError);
        
        // API 호출 실패 시 로컬 스토리지에 저장
        const plans = getPlansFromStorage();
        const existingPlanIndex = plans.findIndex(p => p.date === formattedDate);
        
        if (existingPlanIndex >= 0) {
          // 기존 계획에 아이템 추가
          plans[existingPlanIndex].items.push(newItem);
        } else {
          // 새 날짜 계획 생성
          plans.push({
            date: formattedDate,
            items: [newItem]
          });
        }
        
        savePlansToStorage(plans);
        
        const updatedPlan = plans.find(p => p.date === formattedDate) as StudyPlansByDate;
        
        // 캐시 업데이트
        plansCache[formattedDate] = updatedPlan;
        
        return updatedPlan;
      }
    } catch (error) {
      console.error('API 오류 - 계획 저장:', error);
      throw error;
    }
  },
  
  // 계획 항목 수정
  updatePlanItem: async (date: Date, itemId: number, plan: StudyPlanRequest): Promise<StudyPlansByDate> => {
    try {
      const formattedDate = format(date, 'yyyy-MM-dd');
      
      // 기존 계획 가져오기
      const existingPlans = plansCache[formattedDate] || await planApi.getPlansByDate(date);
      if (!existingPlans) {
        throw new Error('계획을 찾을 수 없습니다.');
      }
      
      // 기존 계획에서 업데이트할 항목 찾기
      const updatedItems = existingPlans.items.map(item => {
        if (item.id === itemId) {
          return {
            ...item,
            content: plan.content,
            plannedDuration: plan.plannedDuration
          };
        }
        return item;
      });
      
      // 백엔드에 전체 항목 목록을 JSON 배열로 저장
      const allItemsJson = JSON.stringify(updatedItems);
      
      try {
        // 백엔드 API 호출 - POST /api/plans/{date}
        const response = await apiClient.post<{data: StudyPlan}>(`/api/plans/${formattedDate}`, {
          content: allItemsJson,
          plannedDuration: plan.plannedDuration // 수정된 항목의 시간 사용
        });
        
        console.log('백엔드 API 응답 (updatePlanItem):', response.data);
        
        // 업데이트된 계획
        const updatedPlan = {
          date: formattedDate,
          items: updatedItems
        };
        
        // 캐시 업데이트
        plansCache[formattedDate] = updatedPlan;
        
        console.log('변환된 데이터 (updatePlanItem):', updatedPlan);
        return updatedPlan;
      } catch (apiError) {
        console.log('백엔드 API 호출 실패, 로컬 스토리지 사용:', apiError);
        
        // API 호출 실패 시 로컬 스토리지에서 수정
        const plans = getPlansFromStorage();
        const planIndex = plans.findIndex(p => p.date === formattedDate);
        
        if (planIndex === -1) {
          throw new Error('계획을 찾을 수 없습니다.');
        }
        
        const itemIndex = plans[planIndex].items.findIndex(item => item.id === itemId);
        
        if (itemIndex === -1) {
          throw new Error('계획 항목을 찾을 수 없습니다.');
        }
        
        plans[planIndex].items[itemIndex] = {
          ...plans[planIndex].items[itemIndex],
          content: plan.content,
          plannedDuration: plan.plannedDuration
        };
        
        savePlansToStorage(plans);
        
        // 캐시 업데이트
        plansCache[formattedDate] = plans[planIndex];
        
        return plans[planIndex];
      }
    } catch (error) {
      console.error('API 오류 - 계획 항목 수정:', error);
      throw error;
    }
  },
  
  // 계획 항목 삭제
  deletePlanItem: async (date: Date, itemId: number): Promise<StudyPlansByDate | null> => {
    try {
      const formattedDate = format(date, 'yyyy-MM-dd');
      
      // 기존 계획 가져오기
      const existingPlans = plansCache[formattedDate] || await planApi.getPlansByDate(date);
      if (!existingPlans || !existingPlans.items || existingPlans.items.length === 0) {
        return {
          date: formattedDate,
          items: []
        };
      }
      
      // 항목 필터링
      const updatedItems = existingPlans.items.filter(item => item.id !== itemId);
      
      // 백엔드에 전체 항목 목록 업데이트
      if (updatedItems.length > 0) {
        // 항목이 남아있으면 업데이트
        const allItemsJson = JSON.stringify(updatedItems);
        
        try {
          // 백엔드 API 호출 - POST /api/plans/{date}
          await apiClient.post<{data: StudyPlan}>(`/api/plans/${formattedDate}`, {
            content: allItemsJson,
            plannedDuration: updatedItems[0].plannedDuration // 첫 번째 항목의 시간 사용
          });
          
          // 업데이트된 계획
          const updatedPlan = {
            date: formattedDate,
            items: updatedItems
          };
          
          // 캐시 업데이트
          plansCache[formattedDate] = updatedPlan;
          
          return updatedPlan;
        } catch (apiError) {
          console.log('백엔드 API 호출 실패, 로컬 스토리지 사용:', apiError);
        }
      } else {
        // 항목이 없으면 계획 삭제
        try {
          // 백엔드 API 호출 - DELETE /api/plans/{date}
          await apiClient.delete(`/api/plans/${formattedDate}`);
          
          // 빈 계획 반환
          const emptyPlan = {
            date: formattedDate,
            items: []
          };
          
          // 캐시 업데이트
          plansCache[formattedDate] = emptyPlan;
          
          return emptyPlan;
        } catch (apiError) {
          console.log('백엔드 API 호출 실패, 로컬 스토리지 사용:', apiError);
        }
      }
      
      // API 호출 실패 시 로컬 스토리지에서 삭제
      const plans = getPlansFromStorage();
      const planIndex = plans.findIndex(p => p.date === formattedDate);
      
      if (planIndex === -1) {
        return null;
      }
      
      // 항목 필터링
      plans[planIndex].items = plans[planIndex].items.filter(item => item.id !== itemId);
      
      // 해당 날짜 계획의 항목이 모두 삭제되었다면 날짜 계획 자체를 삭제
      if (plans[planIndex].items.length === 0) {
        plans.splice(planIndex, 1);
      }
      
      savePlansToStorage(plans);
      
      if (planIndex !== -1 && plans[planIndex]) {
        
        // 캐시 업데이트
        plansCache[formattedDate] = plans[planIndex];
        
        return plans[planIndex];
      }
      
      // 전체 항목이 삭제되었다면 빈 항목으로 반환
      const emptyPlan = {
        date: formattedDate,
        items: []
      };
      
      // 캐시 업데이트
      plansCache[formattedDate] = emptyPlan;
      
      return emptyPlan;
    } catch (error) {
      console.error('API 오류 - 계획 항목 삭제:', error);
      throw error;
    }
  },
  
  // 계획 완료 처리
  completePlanItem: async (date: Date, itemId: number): Promise<StudyPlansByDate> => {
    try {
      const formattedDate = format(date, 'yyyy-MM-dd');
      
      // 기존 계획 가져오기
      const existingPlans = plansCache[formattedDate] || await planApi.getPlansByDate(date);
      if (!existingPlans) {
        throw new Error('계획을 찾을 수 없습니다.');
      }
      
      // 기존 계획에서 완료할 항목 찾기
      const updatedItems = existingPlans.items.map(item => {
        if (item.id === itemId) {
          return {
            ...item,
            isCompleted: true
          };
        }
        return item;
      });
      
      // 백엔드에 전체 항목 목록 업데이트
      const allItemsJson = JSON.stringify(updatedItems);
      
      try {
        // 백엔드 API 호출 - 백엔드에서는 /api/plans/{date}/complete 엔드포인트 사용
        // 하지만 여러 항목 중 하나만 완료 처리하므로 POST로 전체 업데이트
        await apiClient.post<{data: StudyPlan}>(`/api/plans/${formattedDate}`, {
          content: allItemsJson,
          plannedDuration: updatedItems[0].plannedDuration, // 첫 번째 항목의 시간 사용
          isCompleted: true // 하나라도 완료된 항목이 있으면 계획 자체를 완료로 표시
        });
        
        // 업데이트된 계획
        const updatedPlan = {
          date: formattedDate,
          items: updatedItems
        };
        
        // 캐시 업데이트
        plansCache[formattedDate] = updatedPlan;
        
        return updatedPlan;
      } catch (apiError) {
        console.log('백엔드 API 호출 실패, 로컬 스토리지 사용:', apiError);
        
        // API 호출 실패 시 로컬 스토리지에서 수정
        const plans = getPlansFromStorage();
        const planIndex = plans.findIndex(p => p.date === formattedDate);
        
        if (planIndex === -1) {
          throw new Error('계획을 찾을 수 없습니다.');
        }
        
        const itemIndex = plans[planIndex].items.findIndex(item => item.id === itemId);
        
        if (itemIndex === -1) {
          throw new Error('계획 항목을 찾을 수 없습니다.');
        }
        
        plans[planIndex].items[itemIndex] = {
          ...plans[planIndex].items[itemIndex],
          isCompleted: true
        };
        
        savePlansToStorage(plans);
        
        // 캐시 업데이트
        plansCache[formattedDate] = plans[planIndex];
        
        return plans[planIndex];
      }
    } catch (error) {
      console.error('API 오류 - 계획 완료 처리:', error);
      throw error;
    }
  }
};