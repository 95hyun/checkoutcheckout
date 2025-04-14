import apiClient from './apiClient';

// 스터디 관련 API
const studyApi = {
  // 전체 스터디 목록 조회
  getAllStudies: () => apiClient.get('/api/studies'),
  
  // 내 스터디 목록 조회
  getMyStudies: () => apiClient.get('/api/studies/my'),
  
  // 스터디 상세 조회
  getStudyDetail: (studyId) => apiClient.get(`/api/studies/${studyId}`),
  
  // 스터디 생성
  createStudy: (studyData) => apiClient.post('/api/studies', studyData),
  
  // 스터디 수정
  updateStudy: (studyId, studyData) => apiClient.put(`/api/studies/${studyId}`, studyData),
  
  // 스터디 삭제
  deleteStudy: (studyId) => apiClient.delete(`/api/studies/${studyId}`),
  
  // 스터디 가입
  joinStudy: (studyId, password) => {
    const data = password ? { password } : {};
    return apiClient.post(`/api/studies/${studyId}/join`, data);
  },
  
  // 스터디 탈퇴
  leaveStudy: (studyId) => apiClient.delete(`/api/studies/${studyId}/leave`),
  
  // 스터디원 강퇴
  kickMember: (studyId, userId) => apiClient.delete(`/api/studies/${studyId}/members/${userId}`),
  
  // 관리자 지정
  makeAdmin: (studyId, userId) => apiClient.put(`/api/studies/${studyId}/members/${userId}/admin`),
  
  // 관리자 해제
  removeAdmin: (studyId, userId) => apiClient.delete(`/api/studies/${studyId}/members/${userId}/admin`),
  
  // 가입 요청 목록 조회
  getJoinRequests: (studyId) => apiClient.get(`/api/studies/${studyId}/join-requests`),
  
  // 가입 요청 승인
  approveJoinRequest: (studyId, requestId) => 
    apiClient.put(`/api/studies/${studyId}/join-requests/${requestId}/approve`),
  
  // 가입 요청 거절
  rejectJoinRequest: (studyId, requestId) => 
    apiClient.put(`/api/studies/${studyId}/join-requests/${requestId}/reject`),
};

export default studyApi;