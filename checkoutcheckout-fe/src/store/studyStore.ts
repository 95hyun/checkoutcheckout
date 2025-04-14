import { create } from 'zustand';
import { Study, StudyDetail, StudyJoinRequest } from '../types';
import studyApi from '../api/studyApi';

interface StudyState {
  studies: Study[];
  myStudies: Study[];
  currentStudy: StudyDetail | null;
  joinRequests: StudyJoinRequest[];
  isLoading: boolean;
  error: string | null;
  
  // 스터디 목록 조회 액션
  fetchStudies: () => Promise<void>;
  fetchMyStudies: () => Promise<void>;
  fetchStudyDetail: (studyId: number) => Promise<void>;
  
  // 스터디 생성 및 관리 액션
  createStudy: (studyData: any) => Promise<Study | null>;
  updateStudy: (studyId: number, studyData: any) => Promise<Study | null>;
  deleteStudy: (studyId: number) => Promise<boolean>;
  
  // 스터디 가입 및 탈퇴 액션 
  joinStudy: (studyId: number, password?: string) => Promise<boolean>;
  leaveStudy: (studyId: number) => Promise<boolean>;
  
  // 스터디원 관리 액션
  kickMember: (studyId: number, userId: number) => Promise<boolean>;
  makeAdmin: (studyId: number, userId: number) => Promise<boolean>;
  removeAdmin: (studyId: number, userId: number) => Promise<boolean>;
  
  // 가입 요청 관리 액션
  fetchJoinRequests: (studyId: number) => Promise<void>;
  approveJoinRequest: (studyId: number, requestId: number) => Promise<boolean>;
  rejectJoinRequest: (studyId: number, requestId: number) => Promise<boolean>;
  
  // 상태 초기화
  resetError: () => void;
  resetCurrentStudy: () => void;
}

export const useStudyStore = create<StudyState>((set, get) => ({
  studies: [],
  myStudies: [],
  currentStudy: null,
  joinRequests: [],
  isLoading: false,
  error: null,
  
  // 스터디 목록 조회 액션
  fetchStudies: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await studyApi.getAllStudies();
      set({ studies: response.data.data, isLoading: false });
    } catch (error) {
      console.error('스터디 목록 조회 에러:', error);
      set({ 
        error: error.response?.data?.message || '스터디 목록을 불러오는데 실패했습니다.', 
        isLoading: false 
      });
    }
  },
  
  fetchMyStudies: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await studyApi.getMyStudies();
      set({ myStudies: response.data.data, isLoading: false });
    } catch (error) {
      console.error('내 스터디 목록 조회 에러:', error);
      set({ 
        error: error.response?.data?.message || '내 스터디 목록을 불러오는데 실패했습니다.', 
        isLoading: false 
      });
    }
  },
  
  fetchStudyDetail: async (studyId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await studyApi.getStudyDetail(studyId);
      set({ currentStudy: response.data.data, isLoading: false });
    } catch (error) {
      console.error('스터디 상세 조회 에러:', error);
      set({ 
        error: error.response?.data?.message || '스터디 상세 정보를 불러오는데 실패했습니다.', 
        isLoading: false 
      });
    }
  },
  
  // 스터디 생성 및 관리 액션
  createStudy: async (studyData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await studyApi.createStudy(studyData);
      const newStudy = response.data.data;
      
      // 스터디 목록 및 내 스터디 목록 업데이트
      set(state => ({
        studies: [...state.studies, newStudy],
        myStudies: [...state.myStudies, newStudy],
        isLoading: false
      }));
      
      return newStudy;
    } catch (error) {
      console.error('스터디 생성 에러:', error);
      set({ 
        error: error.response?.data?.message || '스터디 생성에 실패했습니다.', 
        isLoading: false 
      });
      return null;
    }
  },
  
  updateStudy: async (studyId, studyData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await studyApi.updateStudy(studyId, studyData);
      const updatedStudy = response.data.data;
      
      // 스터디 목록 및 내 스터디 목록 업데이트
      set(state => ({
        studies: state.studies.map(study => 
          study.id === studyId ? updatedStudy : study
        ),
        myStudies: state.myStudies.map(study => 
          study.id === studyId ? updatedStudy : study
        ),
        currentStudy: state.currentStudy?.id === studyId 
          ? { ...state.currentStudy, ...updatedStudy } 
          : state.currentStudy,
        isLoading: false
      }));
      
      return updatedStudy;
    } catch (error) {
      console.error('스터디 수정 에러:', error);
      set({ 
        error: error.response?.data?.message || '스터디 수정에 실패했습니다.', 
        isLoading: false 
      });
      return null;
    }
  },
  
  deleteStudy: async (studyId) => {
    set({ isLoading: true, error: null });
    try {
      await studyApi.deleteStudy(studyId);
      
      // 스터디 목록 및 내 스터디 목록에서 삭제
      set(state => ({
        studies: state.studies.filter(study => study.id !== studyId),
        myStudies: state.myStudies.filter(study => study.id !== studyId),
        currentStudy: state.currentStudy?.id === studyId ? null : state.currentStudy,
        isLoading: false
      }));
      
      return true;
    } catch (error) {
      console.error('스터디 삭제 에러:', error);
      set({ 
        error: error.response?.data?.message || '스터디 삭제에 실패했습니다.', 
        isLoading: false 
      });
      return false;
    }
  },
  
  // 스터디 가입 및 탈퇴 액션
  joinStudy: async (studyId, password) => {
    set({ isLoading: true, error: null });
    try {
      await studyApi.joinStudy(studyId, password);
      
      // 스터디 목록에서 해당 스터디 정보 업데이트
      set(state => {
        const updatedStudies = state.studies.map(study => {
          if (study.id === studyId) {
            return {
              ...study,
              isMember: true,
              currentMembers: study.currentMembers + 1
            };
          }
          return study;
        });
        
        // 내 스터디 목록 업데이트 - 새로 조회하는 것이 더 안전
        get().fetchMyStudies();
        
        return {
          studies: updatedStudies,
          isLoading: false
        };
      });
      
      return true;
    } catch (error) {
      console.error('스터디 가입 에러:', error);
      set({ 
        error: error.response?.data?.message || '스터디 가입에 실패했습니다.', 
        isLoading: false 
      });
      return false;
    }
  },
  
  leaveStudy: async (studyId) => {
    set({ isLoading: true, error: null });
    try {
      await studyApi.leaveStudy(studyId);
      
      // 스터디 목록 및 내 스터디 목록 업데이트
      set(state => {
        const updatedStudies = state.studies.map(study => {
          if (study.id === studyId) {
            return {
              ...study,
              isMember: false,
              currentMembers: study.currentMembers - 1
            };
          }
          return study;
        });
        
        return {
          studies: updatedStudies,
          myStudies: state.myStudies.filter(study => study.id !== studyId),
          currentStudy: state.currentStudy?.id === studyId ? null : state.currentStudy,
          isLoading: false
        };
      });
      
      return true;
    } catch (error) {
      console.error('스터디 탈퇴 에러:', error);
      set({ 
        error: error.response?.data?.message || '스터디 탈퇴에 실패했습니다.', 
        isLoading: false 
      });
      return false;
    }
  },
  
  // 스터디원 관리 액션
  kickMember: async (studyId, userId) => {
    set({ isLoading: true, error: null });
    try {
      await studyApi.kickMember(studyId, userId);
      
      // 현재 스터디 상세 정보에서 해당 멤버 제거
      set(state => {
        if (state.currentStudy && state.currentStudy.id === studyId) {
          return {
            currentStudy: {
              ...state.currentStudy,
              members: state.currentStudy.members.filter(member => member.userId !== userId),
              currentMembers: state.currentStudy.currentMembers - 1
            },
            isLoading: false
          };
        }
        return { isLoading: false };
      });
      
      return true;
    } catch (error) {
      console.error('멤버 강퇴 에러:', error);
      set({ 
        error: error.response?.data?.message || '멤버 강퇴에 실패했습니다.', 
        isLoading: false 
      });
      return false;
    }
  },
  
  makeAdmin: async (studyId, userId) => {
    set({ isLoading: true, error: null });
    try {
      await studyApi.makeAdmin(studyId, userId);
      
      // 현재 스터디 상세 정보에서 해당 멤버 업데이트
      set(state => {
        if (state.currentStudy && state.currentStudy.id === studyId) {
          return {
            currentStudy: {
              ...state.currentStudy,
              members: state.currentStudy.members.map(member => {
                if (member.userId === userId) {
                  return {
                    ...member,
                    isAdmin: true
                  };
                }
                return member;
              })
            },
            isLoading: false
          };
        }
        return { isLoading: false };
      });
      
      return true;
    } catch (error) {
      console.error('관리자 지정 에러:', error);
      set({ 
        error: error.response?.data?.message || '관리자 지정에 실패했습니다.', 
        isLoading: false 
      });
      return false;
    }
  },
  
  removeAdmin: async (studyId, userId) => {
    set({ isLoading: true, error: null });
    try {
      await studyApi.removeAdmin(studyId, userId);
      
      // 현재 스터디 상세 정보에서 해당 멤버 업데이트
      set(state => {
        if (state.currentStudy && state.currentStudy.id === studyId) {
          return {
            currentStudy: {
              ...state.currentStudy,
              members: state.currentStudy.members.map(member => {
                if (member.userId === userId) {
                  return {
                    ...member,
                    isAdmin: false
                  };
                }
                return member;
              })
            },
            isLoading: false
          };
        }
        return { isLoading: false };
      });
      
      return true;
    } catch (error) {
      console.error('관리자 해제 에러:', error);
      set({ 
        error: error.response?.data?.message || '관리자 해제에 실패했습니다.', 
        isLoading: false 
      });
      return false;
    }
  },
  
  // 가입 요청 관리 액션
  fetchJoinRequests: async (studyId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await studyApi.getJoinRequests(studyId);
      set({ joinRequests: response.data.data, isLoading: false });
    } catch (error) {
      console.error('가입 요청 목록 조회 에러:', error);
      set({ 
        error: error.response?.data?.message || '가입 요청 목록을 불러오는데 실패했습니다.', 
        isLoading: false 
      });
    }
  },
  
  approveJoinRequest: async (studyId, requestId) => {
    set({ isLoading: true, error: null });
    try {
      await studyApi.approveJoinRequest(studyId, requestId);
      
      // 가입 요청 목록에서 해당 요청 제거
      set(state => ({
        joinRequests: state.joinRequests.filter(request => request.id !== requestId),
        isLoading: false
      }));
      
      // 현재 스터디 정보 갱신 - 새로 조회하는 것이 안전
      if (get().currentStudy?.id === studyId) {
        get().fetchStudyDetail(studyId);
      }
      
      return true;
    } catch (error) {
      console.error('가입 요청 승인 에러:', error);
      set({ 
        error: error.response?.data?.message || '가입 요청 승인에 실패했습니다.', 
        isLoading: false 
      });
      return false;
    }
  },
  
  rejectJoinRequest: async (studyId, requestId) => {
    set({ isLoading: true, error: null });
    try {
      await studyApi.rejectJoinRequest(studyId, requestId);
      
      // 가입 요청 목록에서 해당 요청 제거
      set(state => ({
        joinRequests: state.joinRequests.filter(request => request.id !== requestId),
        isLoading: false
      }));
      
      return true;
    } catch (error) {
      console.error('가입 요청 거절 에러:', error);
      set({ 
        error: error.response?.data?.message || '가입 요청 거절에 실패했습니다.', 
        isLoading: false 
      });
      return false;
    }
  },
  
  // 상태 초기화
  resetError: () => set({ error: null }),
  resetCurrentStudy: () => set({ currentStudy: null })
}));

export default useStudyStore;