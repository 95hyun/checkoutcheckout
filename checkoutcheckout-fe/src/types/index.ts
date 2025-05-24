// 사용자 관련 타입
export interface User {
  id: number;
  email: string;
  nickname: string;
  characterType?: string; // 캐릭터 타입을 프로필 이미지로 사용
}

// 희귀도 타입 정의
export type Rarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';

// 캐릭터 관련 타입
export interface Character {
  id: number;
  type: string;
  acquiredDate: string;
  rarity?: Rarity; // 희귀도 필드 추가 (선택적 필드로 이전 데이터와 호환성 유지)
}

// 인증 관련 타입
export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  email: string;
  password: string;
  nickname: string;
}

export interface TokenResponse {
  accessToken: string;
  tokenType: string;
}

// 타이머 관련 타입
export interface TimerSession {
  id: number;
  startTime: string;
  endTime?: string;
  duration: number; // 초 단위
}

export interface TimerStatus {
  isActive: boolean;
  startTime?: string;
  endTime?: string;
  currentDuration?: number; // 초 단위
}

export interface DailyStudyTime {
  date: string;
  duration: number; // 초 단위
}

export interface StudyTimeHistory {
  records: {
    date: string;
    duration: number;
  }[];
}

// 공부 계획 관련 타입
export interface StudyPlan {
  id?: number;
  date: string;
  content: string;
  plannedDuration: number; // 초 단위로 계획한 시간
  isCompleted?: boolean;
}

export interface StudyPlanItem {
  id: number;
  content: string;
  plannedDuration: number; // 초 단위로 계획한 시간
  isCompleted: boolean;
}

export interface StudyPlansByDate {
  date: string;
  items: StudyPlanItem[];
}

export interface StudyPlanRequest {
  content: string;
  plannedDuration: number; // 초 단위로 계획한 시간
}

// 랭킹 관련 타입
export interface RankEntry {
  rank: number;
  userId: number;
  nickname: string;
  studyTime: number; // 초 단위
}

export interface DailyRanking {
  date: string;
  rankings: RankEntry[];
}

// 스터디 관련 타입
export interface Study {
  id: number;
  name: string;
  description: string;
  ownerId: number;
  ownerNickname: string;
  maxMembers: number;
  currentMembers: number;
  isPasswordProtected: boolean;
  isApprovalRequired: boolean;
  isOwner: boolean;
  isMember: boolean;
  createdAt: string;
}

export interface StudyDetail extends Study {
  isAdmin: boolean;
  members: StudyMember[];
}

export interface StudyMember {
  id: number;
  userId: number;
  nickname: string;
  characterType?: string;
  isAdmin: boolean;
  isOwner: boolean;
  joinedAt: string;
}

export interface StudyJoinRequest {
  id: number;
  studyId: number;
  studyName: string;
  userId: number;
  userNickname: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  requestedAt: string;
  processedAt?: string;
}

export interface StudyCreateRequest {
  name: string;
  description: string;
  maxMembers: number;
  password?: string;
  isPasswordProtected: boolean;
  isApprovalRequired: boolean;
}

export interface StudyJoinRequestDto {
  password?: string;
}

// 스터디 랭킹 관련 타입
export interface StudyRankEntry {
  rank: number;
  studyId: number;
  studyName: string;
  studyTime: number; // 밀리초 단위
  formattedStudyTime: string; // "00:00:00" 형식
}

export interface StudyRanking {
  startDate: string;
  endDate: string;
  rankings: StudyRankEntry[];
}

export interface StudyMemberRankEntry {
  rank: number;
  userId: number;
  nickname: string;
  studyTime: number; // 밀리초 단위
  formattedStudyTime: string; // "00:00:00" 형식
}

export interface StudyMemberRanking {
  studyId: number;
  studyName: string;
  startDate: string;
  endDate: string;
  rankings: StudyMemberRankEntry[];
  totalStudyTime: number; // 초 단위
  formattedTotalStudyTime: string; // "00:00:00" 형식
}

// API 응답 관련 타입
export interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
}

export interface ApiError {
  status: number;
  message: string;
  code: string;
}